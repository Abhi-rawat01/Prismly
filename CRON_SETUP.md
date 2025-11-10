# Cron Job Setup Guide

## Purpose
Set up a single daily cron job to wake up the Render server at 5:00 AM after the scheduled sleep window (2-5 AM).

## Why Only One Call?
- **Server-side keep-alive**: The server pings itself every 10 minutes to stay awake
- **Scheduled sleep**: Server allows sleep from 2-5 AM to save resources
- **Morning wake-up**: One cron job at 5 AM wakes the server, then it keeps itself awake all day

## Setup Instructions

### 1. Go to cron-job.org
Visit: https://cron-job.org/en/

### 2. Create Free Account
- Click "Sign up"
- Verify your email

### 3. Create New Cron Job
Click "Create cronjob" and configure:

**Basic Settings:**
- **Title**: `Prismly Morning Wake-Up`
- **URL**: `https://your-app-name.onrender.com/api/health`
  - Replace `your-app-name` with your actual Render app name
- **Request Method**: GET

**Schedule:**
- **Type**: Select "Every day"
- **Time**: `05:00` (5:00 AM)
- **Timezone**: Select your timezone (or UTC)

**Advanced (Optional):**
- **Timeout**: 30 seconds
- **Execution**: Enable "Save responses"

### 4. Save and Activate
- Click "Create cronjob"
- Make sure it's enabled (toggle should be ON)

## How It Works

```
Timeline:
├─ 2:00 AM  → Server stops self-pinging (sleep window starts)
├─ 2:15 AM  → Render puts server to sleep (no activity)
├─ 5:00 AM  → cron-job.org pings server (WAKE UP!)
├─ 5:00 AM  → Server wakes up and starts self-pinging
├─ 5:10 AM  → Server pings itself (stays awake)
├─ 5:20 AM  → Server pings itself (stays awake)
└─ ...continues all day until 2:00 AM next day
```

## Verify Setup

### Check if it's working:
1. Visit your app's health endpoint: `https://your-app-name.onrender.com/api/health`
2. You should see:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-11-10T...",
  "keepAlive": {
    "active": true,
    "inSleepWindow": false,
    "sleepWindow": "2:00 - 5:00 UTC"
  }
}
```

### Monitor in cron-job.org:
- Go to "Cronjobs" → Your job
- Check "History" tab to see execution logs
- Should show successful 200 responses

## Troubleshooting

**Server still sleeping during the day?**
- Check if cron job is enabled
- Verify the URL is correct
- Check execution history for errors

**Want to change sleep window?**
- Edit `SLEEP_START_HOUR` and `SLEEP_END_HOUR` in `server/index.js`
- Update cron job time accordingly
- Redeploy on Render

## Cost
- **cron-job.org**: FREE forever (1 job, daily execution)
- **Render**: FREE tier (with this setup, server stays awake 19 hours/day)

## Alternative: No Sleep Window
If you want 24/7 uptime without any sleep:
1. Change cron job to run every 10 minutes: `*/10 * * * *`
2. Remove sleep window check from server code
3. Server will never sleep (uses more Render resources)

---

**Created by:** ABHI_RAWT  
**Instagram:** [@abhi_rawat_uk1](https://www.instagram.com/abhi_rawat_uk1)
