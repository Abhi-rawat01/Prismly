import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string;
  suggestion?: string;
  onRetry: () => void;
}

export const ErrorDisplay = ({ error, suggestion, onRetry }: ErrorDisplayProps) => {
  return (
    <Card className="glass-effect border-2 border-red-200 dark:border-red-800 max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Error Icon and Title */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Upload Error
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>

          {/* Suggestion */}
          {suggestion && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    How to fix this:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {suggestion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Export Instructions */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              📱 How to Export from WhatsApp:
            </p>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Open the chat you want to analyze</li>
              <li>Tap the three dots (⋮) menu</li>
              <li>Select "More" → "Export chat"</li>
              <li>Choose "Without media"</li>
              <li>Save and upload the .txt file here</li>
            </ol>
          </div>

          {/* Retry Button */}
          <Button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
