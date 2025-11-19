# Cron Job Setup Guide

## Purpose
Set up a cron job to ping the Render server every 10 minutes to keep it awake 24/7 (except during scheduled sleep window 2-5 AM IST).

## Why External Cron?
- **Render limitation**: Self-pings from the server don't count as external traffic
- **Free tier sleep**: Render sleeps the server after 15 minutes of no external requests
- **Solution**: External cron job pings every 10 minutes to keep server awake
- **Scheduled sleep**: Optionally skip pings during 2-5 AM IST to save resources

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
- **Type**: Select "Custom"
- **Cron Expression**: `*/10 * * * *` (every 10 minutes)
- **Timezone**: Select "Asia/Kolkata" (Indian Standard Time)

**Optional - Skip Sleep Window (2-5 AM IST):**
If you want to allow sleep during 2-5 AM, use this expression instead:
- **Cron Expression**: `*/10 0-1,5-23 * * *` (every 10 min, except 2-5 AM)

**Advanced (Optional):**
- **Timeout**: 30 seconds
- **Execution**: Enable "Save responses"

### 4. Save and Activate
- Click "Create cronjob"
- Make sure it's enabled (toggle should be ON)

## How It Works

```
Timeline (IST - Indian Standard Time):
├─ 2:00 AM IST  → Server stops self-pinging (sleep window starts)
├─ 2:15 AM IST  → Render puts server to sleep (no activity)
├─ 5:00 AM IST  → cron-job.org pings server (WAKE UP!)
├─ 5:00 AM IST  → Server wakes up and starts self-pinging
├─ 5:10 AM IST  → Server pings itself (stays awake)
├─ 5:20 AM IST  → Server pings itself (stays awake)
└─ ...continues all day until 2:00 AM IST next day
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
    "sleepWindow": "2:00 - 5:00 IST"
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
