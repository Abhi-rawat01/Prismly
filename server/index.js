import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Keep-alive configuration
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes
const SLEEP_START_HOUR = 2; // 2 AM
const SLEEP_END_HOUR = 5; // 5 AM
let keepAliveInterval = null;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.txt', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .zip files are allowed'));
    }
  }
});

// Keep-alive functions
const isInSleepWindow = () => {
  const now = new Date();
  
  // Convert UTC to IST (UTC + 5:30)
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  
  // Add 5 hours 30 minutes for IST
  let istHours = utcHours + 5;
  let istMinutes = utcMinutes + 30;
  
  // Handle minute overflow
  if (istMinutes >= 60) {
    istHours += 1;
    istMinutes -= 60;
  }
  
  // Handle hour overflow (24-hour format)
  istHours = istHours % 24;
  
  // Check if current IST time is in sleep window (2 AM - 5 AM IST)
  return istHours >= SLEEP_START_HOUR && istHours < SLEEP_END_HOUR;
};

const selfPing = async () => {
  // Skip ping during sleep window
  if (isInSleepWindow()) {
    console.log('⏰ [KEEP-ALIVE] In sleep window (2-5 AM IST), skipping self-ping');
    return;
  }

  try {
    const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const response = await fetch(`${url}/api/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log('💚 [KEEP-ALIVE] Self-ping successful - Server staying awake');
    }
  } catch (error) {
    console.warn('⚠️ [KEEP-ALIVE] Self-ping failed:', error.message);
  }
};

const startKeepAlive = () => {
  if (keepAliveInterval) {
    return; // Already running
  }

  console.log('🚀 [KEEP-ALIVE] Starting server-side keep-alive');
  console.log(`⏰ [KEEP-ALIVE] Sleep window: ${SLEEP_START_HOUR}:00 - ${SLEEP_END_HOUR}:00 IST (Indian Standard Time)`);
  console.log(`🔄 [KEEP-ALIVE] Ping interval: ${KEEP_ALIVE_INTERVAL / 1000 / 60} minutes`);
  
  // Initial ping after 1 minute (give server time to fully start)
  setTimeout(selfPing, 60000);
  
  // Set up recurring pings
  keepAliveInterval = setInterval(selfPing, KEEP_ALIVE_INTERVAL);
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  const status = {
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    keepAlive: {
      active: keepAliveInterval !== null,
      inSleepWindow: isInSleepWindow(),
      sleepWindow: `${SLEEP_START_HOUR}:00 - ${SLEEP_END_HOUR}:00 IST`
    }
  };
  console.log('💓 [HEALTH] Health check received');
  res.json(status);
});

// Upload file endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  console.log('🔔 [REQUEST] Upload endpoint hit!');
  try {
    if (!req.file) {
      console.log('❌ [ERROR] No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
      uploadedAt: new Date().toISOString()
    };

    console.log('📤 [UPLOAD] Someone uploaded a file:', fileInfo.originalName, `(${(fileInfo.size / 1024).toFixed(2)} KB)`);

    // Save to local disk
    console.log('💾 [SAVED] File saved to local disk:', req.file.path);

    // Upload to Cloud Storage
    let cloudUploadResult = null;
    try {
      const { uploadToCloudStorage, scheduleFileDelete } = await import('./cloudStorage.js');
      
      console.log('☁️  [BACKUP] Sending file to cloud backup...');
      cloudUploadResult = await uploadToCloudStorage(req.file);
      console.log('✅ [BACKUP] File successfully backed up to cloud storage');
      
      // Schedule file deletion after 5 minutes
      const deleteDelay = parseInt(process.env.FILE_DELETE_DELAY_MINUTES) || 5;
      scheduleFileDelete(req.file.path, deleteDelay);
      
      console.log(`🗑️  [DELETE] File scheduled for deletion in ${deleteDelay} minutes`);
    } catch (cloudError) {
      console.error('❌ [BACKUP] Cloud backup failed:', cloudError.message);
      console.log('⚠️  [WARNING] File kept locally only');
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: fileInfo,
      cloudUpload: cloudUploadResult
    });
  } catch (error) {
    console.error('❌ [ERROR] Upload failed:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get uploaded files list
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir).map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        uploadedAt: stats.birthtime
      };
    });
    res.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing - return index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  
  // Start keep-alive mechanism
  startKeepAlive();
});
