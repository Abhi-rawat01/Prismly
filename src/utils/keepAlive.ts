// Keep-alive utility to prevent Render server from sleeping
// Allows scheduled sleep during low-traffic hours (2 AM - 5 AM)

const PING_INTERVAL = 10 * 60 * 1000; // Ping every 10 minutes
const SLEEP_START_HOUR = 2; // 2 AM
const SLEEP_END_HOUR = 5; // 5 AM

let pingInterval: NodeJS.Timeout | null = null;

/**
 * Check if current time is within scheduled sleep window (IST)
 * Uses IST (Indian Standard Time) for consistent sleep window
 */
const isInSleepWindow = (): boolean => {
  const now = new Date();
  
  // Convert UTC to IST (UTC + 5:30)
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  
  let istHours = utcHours + 5;
  let istMinutes = utcMinutes + 30;
  
  if (istMinutes >= 60) {
    istHours += 1;
    istMinutes -= 60;
  }
  
  istHours = istHours % 24;
  
  // Check if current IST time is in sleep window (2-5 AM IST)
  return istHours >= SLEEP_START_HOUR && istHours < SLEEP_END_HOUR;
};

/**
 * Ping the server to keep it awake
 */
const pingServer = async (): Promise<void> => {
  // Skip ping during sleep window
  if (isInSleepWindow()) {
    console.log('⏰ [KEEP-ALIVE] In sleep window (2-5 AM IST), skipping ping');
    return;
  }

  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      console.log('💚 [KEEP-ALIVE] Server pinged successfully');
    }
  } catch (error) {
    console.warn('⚠️ [KEEP-ALIVE] Ping failed:', error);
  }
};

/**
 * Start the keep-alive mechanism
 */
export const startKeepAlive = (): void => {
  // Don't start if already running
  if (pingInterval) {
    return;
  }

  console.log('🚀 [KEEP-ALIVE] Starting keep-alive service');
  console.log(`⏰ [KEEP-ALIVE] Sleep window: ${SLEEP_START_HOUR}:00 AM - ${SLEEP_END_HOUR}:00 AM IST`);
  
  // Initial ping
  pingServer();
  
  // Set up interval
  pingInterval = setInterval(pingServer, PING_INTERVAL);
};

/**
 * Stop the keep-alive mechanism
 */
export const stopKeepAlive = (): void => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log('🛑 [KEEP-ALIVE] Keep-alive service stopped');
  }
};

/**
 * Get current keep-alive status
 */
export const getKeepAliveStatus = () => {
  return {
    isActive: pingInterval !== null,
    isInSleepWindow: isInSleepWindow(),
    sleepWindow: `${SLEEP_START_HOUR}:00 AM - ${SLEEP_END_HOUR}:00 AM IST`,
    pingInterval: PING_INTERVAL / 1000 / 60 + ' minutes'
  };
};
