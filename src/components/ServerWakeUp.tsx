import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Server, CheckCircle2, Moon } from 'lucide-react';

interface ServerWakeUpProps {
  onServerReady: () => void;
}

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
  
  return istHours >= 2 && istHours < 5; // 2-5 AM IST
};

const ServerWakeUp = ({ onServerReady }: ServerWakeUpProps) => {
  const [status, setStatus] = useState<'checking' | 'waking' | 'ready'>('checking');
  const [attempts, setAttempts] = useState(0);
  const [inSleepWindow, setInSleepWindow] = useState(isInSleepWindow());

  useEffect(() => {
    const checkServer = async () => {
      const maxAttempts = 30; // 30 attempts = ~60 seconds max wait
      
      for (let i = 0; i < maxAttempts; i++) {
        setAttempts(i + 1);
        
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch('/api/health', {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            setStatus('ready');
            setTimeout(() => onServerReady(), 500);
            return;
          }
        } catch (error) {
          // Server not ready yet
          if (i === 0) {
            setStatus('waking');
          }
        }
        
        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // If we get here, server didn't wake up
      setStatus('ready'); // Proceed anyway, let the upload fail naturally
      onServerReady();
    };

    checkServer();
  }, [onServerReady]);

  if (status === 'ready') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="max-w-md w-full mx-4 p-8 glass-effect border-2 shadow-2xl">
        <div className="space-y-6">
          {/* Animated Server Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              {status === 'checking' ? (
                <Loader2 className="relative h-16 w-16 text-blue-500 animate-spin" />
              ) : status === 'waking' ? (
                <Server className="relative h-16 w-16 text-purple-500 animate-pulse" />
              ) : (
                <CheckCircle2 className="relative h-16 w-16 text-green-500" />
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold prism-text">
              {status === 'checking' ? 'Checking Server...' : 'Waking Up Server'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {status === 'checking' 
                ? 'Connecting to the server...'
                : inSleepWindow
                  ? 'Server is in scheduled sleep mode (2-5 AM). Waking it up for you...'
                  : 'The server was sleeping. Waking it up now...'
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {inSleepWindow 
                ? 'Sleep window: 2:00 AM - 5:00 AM IST • May take up to 60 seconds'
                : 'This may take up to 60 seconds on first visit'
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((attempts / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-center text-gray-500">
              Attempt {attempts} of 30
            </p>
          </div>

          {/* Info Box */}
          <div className={`p-4 rounded-lg border ${
            inSleepWindow 
              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              {inSleepWindow ? (
                <>
                  <Moon className="inline h-3 w-3 mr-1" />
                  Server sleeps 2-5 AM IST to save resources. It will stay awake after waking!
                </>
              ) : (
                <>
                  💡 Server auto-pings every 10 minutes to stay awake. Once ready, your experience will be instant!
                </>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServerWakeUp;
