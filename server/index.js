import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload file endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
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

    console.log('✅ File uploaded to server:', fileInfo.originalName);

    // Upload to Drime Cloud Storage
    let cloudUploadResult = null;
    try {
      const { uploadToCloudStorage, scheduleFileDelete } = await import('./cloudStorage.js');
      cloudUploadResult = await uploadToCloudStorage(req.file);
      
      // Schedule file deletion after 5 minutes
      const deleteDelay = parseInt(process.env.FILE_DELETE_DELAY_MINUTES) || 5;
      scheduleFileDelete(req.file.path, deleteDelay);
      
      console.log(`✅ File uploaded to cloud and scheduled for deletion in ${deleteDelay} minutes`);
    } catch (cloudError) {
      console.error('⚠️ Cloud upload failed, file kept locally:', cloudError.message);
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: fileInfo,
      cloudUpload: cloudUploadResult
    });
  } catch (error) {
    console.error('Upload error:', error);
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
});
