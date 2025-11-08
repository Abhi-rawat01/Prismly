# Prismly - Render Deployment Guide

## 🚀 Deploy to Render

### Prerequisites
- GitHub account with your code pushed
- Render account (free tier works)

### Quick Deploy Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - **Name:** prismly (or your preferred name)
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for better performance)

4. **Add Environment Variables** (Optional - for cloud storage)
   - Click "Environment" tab
   - Add your cloud storage credentials from `.env.example`

5. **Add Persistent Disk** (for file uploads)
   - Click "Disks" tab
   - Add disk: Name: `uploads`, Mount Path: `/opt/render/project/src/server/uploads`, Size: 1GB

6. **Deploy!**
   - Click "Create Web Service"
   - Render will automatically build and deploy

### Your App Will Be Live At:
`https://your-app-name.onrender.com`

---

## 📦 Features

### Current Features (Working)
✅ File upload (.txt and .zip)
✅ ZIP auto-extraction
✅ Session Storage backup
✅ Files saved to Render disk
✅ Dark mode by default
✅ Mobile responsive
✅ All charts and analysis

### Cloud Storage Integration (Ready to Configure)
The backend is ready for cloud storage. Just add your API credentials:

1. Copy `.env.example` to `.env`
2. Add your cloud storage credentials
3. Update `server/cloudStorage.js` with your provider's code
4. Redeploy

---

## 🔧 Local Development

### Run Locally
```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Start server
npm start
```

Server runs on: `http://localhost:3000`

### Development Mode
```bash
# Frontend only (Vite dev server)
npm run dev

# Backend only
npm run server
```

---

## 📁 File Upload API

### Upload Endpoint
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (txt or zip)
```

### Response
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "filename": "1234567890-chat.txt",
    "originalName": "chat.txt",
    "size": 12345,
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🌐 Cloud Storage Providers

### Supported (Add your own integration):
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudinary
- Supabase Storage

See `server/cloudStorage.js` for integration examples.

---

## 🛠️ Troubleshooting

### Build Fails
- Check Node version (use Node 18+)
- Run `npm install` locally first
- Check build logs on Render

### Files Not Uploading
- Check disk is mounted correctly
- Verify file size limits (50MB default)
- Check server logs

### Cloud Storage Not Working
- Verify environment variables are set
- Check API credentials
- Review `server/cloudStorage.js` implementation

---

## 📞 Support

For issues, check:
1. Render logs (Dashboard → Logs)
2. Browser console (F12)
3. Server logs in Render dashboard

---

## 🎉 You're All Set!

Your Prismly app is now ready for production on Render with file upload capabilities!
