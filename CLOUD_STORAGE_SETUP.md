# ☁️ Drime Cloud Storage - Configured & Ready!

## ✅ What's Been Set Up

### 1. **Drime Cloud Integration**
- API endpoint: `https://app.drime.cloud/api/v1/uploads`
- Access token configured in `.env`
- Automatic upload on file receive

### 2. **Auto-Delete Feature**
- Files uploaded to Drime Cloud
- Local files deleted after **5 minutes**
- Configurable delay via `FILE_DELETE_DELAY_MINUTES`

### 3. **File Flow**
```
User uploads file
    ↓
Saved to Render disk (server/uploads/)
    ↓
Uploaded to Drime Cloud ☁️
    ↓
Wait 5 minutes ⏰
    ↓
Delete from Render disk 🗑️
```

---

## 🔧 Configuration

### Environment Variables (Already Set)
```env
DRIME_CLOUD_BASE_URL=https://app.drime.cloud/api/v1/uploads
DRIME_CLOUD_ACCESS_TOKEN=11002|qyhSL7klvYgTQQ5ODYiODTBqS6jJPkTz80gloJVM3fe1fe34
FILE_DELETE_DELAY_MINUTES=5
```

### On Render Dashboard:
1. Go to your service → Environment
2. Add these variables:
   - `DRIME_CLOUD_BASE_URL`
   - `DRIME_CLOUD_ACCESS_TOKEN`
   - `FILE_DELETE_DELAY_MINUTES`

---

## 📋 How It Works

### Upload Process:
1. **User uploads .txt or .zip file**
2. **Server receives file** → Saves to `server/uploads/`
3. **Uploads to Drime Cloud** → Using Bearer token authentication
4. **Schedules deletion** → File deleted after 5 minutes
5. **Returns response** → With both local and cloud info

### API Response:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "filename": "1234567890-chat.txt",
    "originalName": "chat.txt",
    "size": 12345,
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  },
  "cloudUpload": {
    "success": true,
    "status": 200,
    "data": { /* Drime Cloud response */ },
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🧪 Testing

### Test Upload Locally:
```bash
# Start server
npm start

# Upload file (in another terminal)
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/your/chat.txt"
```

### Check Logs:
```
✅ File uploaded to server: chat.txt
📤 Uploading to Drime Cloud: chat.txt
✅ Successfully uploaded to Drime Cloud
⏰ Scheduled deletion in 5 minutes
🗑️ Successfully deleted local file (after 5 min)
```

---

## ⚙️ Customization

### Change Delete Delay:
Edit `.env`:
```env
FILE_DELETE_DELAY_MINUTES=10  # Wait 10 minutes instead
```

### Disable Auto-Delete:
Comment out in `server/index.js`:
```javascript
// scheduleFileDelete(req.file.path, deleteDelay);
```

---

## 🚨 Error Handling

### If Cloud Upload Fails:
- File stays on Render disk
- No auto-delete scheduled
- Error logged to console
- User still gets success response (file saved locally)

### If Delete Fails:
- Error logged to console
- File remains on disk
- Won't affect new uploads

---

## 📊 Monitoring

### Check Upload Status:
```bash
# List uploaded files
curl http://localhost:3000/api/files

# Health check
curl http://localhost:3000/api/health
```

### Render Logs:
- Go to Render Dashboard → Logs
- Watch for:
  - ✅ Upload success
  - 📤 Cloud upload
  - ⏰ Scheduled deletion
  - 🗑️ File deleted

---

## 🎉 You're All Set!

Your app now:
- ✅ Accepts file uploads
- ✅ Uploads to Drime Cloud automatically
- ✅ Deletes local files after 5 minutes
- ✅ Ready for production on Render

Just deploy and it works! 🚀
