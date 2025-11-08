import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ParseProgress as ParseProgressType } from '@/utils/chatParser';

interface ParseProgressProps {
  progress: ParseProgressType;
}

export const ParseProgress = ({ progress }: ParseProgressProps) => {
  return (
    <Card className="glass-effect border-2 max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Icon and Title */}
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {progress.stage}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{progress.current.toLocaleString()} / {progress.total.toLocaleString()}</span>
              <span className="font-bold prism-text">{progress.percentage}%</span>
            </div>
          </div>

          {/* Tip */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              💡 Large chats may take a moment to analyze. Hang tight!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
