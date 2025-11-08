import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ReplyTimeData } from '@/types/chat';
import { X } from 'lucide-react';

interface ReplyTimeChartProps {
  data: ReplyTimeData[];
}

const formatReplyTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes.toFixed(1)}min`;
  }
  
  const totalHours = minutes / 60;
  
  if (totalHours < 24) {
    const hours = Math.floor(totalHours);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  }
  
  // Convert to days and hours
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);
  return `${days}d ${hours}h`;
};

const ReplyTimeChart = ({ data }: ReplyTimeChartProps) => {
  const [selectedStat, setSelectedStat] = useState<'fastest' | 'slowest' | 'average' | null>(null);
  
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 text-center glass-effect border-2">
        <h2 className="text-2xl font-bold prism-text">Responsiveness Analysis</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          No reply time data available to display. This usually means the chat is one-sided or contains no back-and-forth conversation.
        </p>
      </Card>
    );
  }

  const fastestReply = Math.min(...data.map(d => d.replyTime));
  const slowestReply = Math.max(...data.map(d => d.replyTime));
  const averageReply = data.reduce((sum, d) => sum + d.replyTime, 0) / data.length;

  // Find the LATEST (most recent) fastest reply by filtering all fastest replies and taking the last one
  const fastestReplies = data.filter(d => d.replyTime === fastestReply);
  const fastestReplyData = fastestReplies[fastestReplies.length - 1];
  
  // Find the LATEST (most recent) slowest reply
  const slowestReplies = data.filter(d => d.replyTime === slowestReply);
  const slowestReplyData = slowestReplies[slowestReplies.length - 1];

  const handleStatClick = (stat: 'fastest' | 'slowest' | 'average') => {
    setSelectedStat(selectedStat === stat ? null : stat);
  };

  return (
    <Card className="p-6 glass-effect border-2">
      <div className="mb-6">
        <h2 className="text-2xl font-bold prism-text">Responsiveness Analysis</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Response time metrics throughout your conversation. 
          Click on a card to see details. ⚡
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => handleStatClick('fastest')}
          className={`glass-effect p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
            selectedStat === 'fastest' 
              ? 'border-green-400 dark:border-green-600 shadow-lg' 
              : 'border-green-200 dark:border-green-800'
          }`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Fastest Reply</p>
          <p className="text-4xl font-bold prism-text">
            {formatReplyTime(fastestReply)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click for details</p>
        </div>
        
        <div 
          onClick={() => handleStatClick('slowest')}
          className={`glass-effect p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
            selectedStat === 'slowest' 
              ? 'border-purple-400 dark:border-purple-600 shadow-lg' 
              : 'border-purple-200 dark:border-purple-800'
          }`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Slowest Reply</p>
          <p className="text-4xl font-bold prism-text">
            {formatReplyTime(slowestReply)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click for details</p>
        </div>
        
        <div 
          onClick={() => handleStatClick('average')}
          className={`glass-effect p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
            selectedStat === 'average' 
              ? 'border-blue-400 dark:border-blue-600 shadow-lg' 
              : 'border-blue-200 dark:border-blue-800'
          }`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Reply</p>
          <p className="text-4xl font-bold prism-text">
            {formatReplyTime(averageReply)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click for details</p>
        </div>
      </div>

      {/* Details Panel */}
      {selectedStat && (
        <div className="mt-6 p-6 glass-effect rounded-xl border-2 border-purple-300 dark:border-purple-700 animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold prism-text">
              {selectedStat === 'fastest' && 'Fastest Reply Details'}
              {selectedStat === 'slowest' && 'Slowest Reply Details'}
              {selectedStat === 'average' && 'Average Reply Information'}
            </h3>
            <button 
              onClick={() => setSelectedStat(null)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {selectedStat === 'fastest' && fastestReplyData && (
            <div className="space-y-3">
              {/* Previous Message */}
              {fastestReplyData.previousMessage && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-gray-400">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {fastestReplyData.previousSender}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {fastestReplyData.previousTimestamp?.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "{fastestReplyData.previousMessage.replace(/<Media omitted>/g, 'Sticker/GIF').substring(0, 150)}{fastestReplyData.previousMessage.length > 150 ? '...' : ''}"
                  </p>
                </div>
              )}

              {/* Reply Time Indicator */}
              <div className="flex items-center justify-center py-2">
                <div className="flex-1 border-t-2 border-dashed border-green-300 dark:border-green-700"></div>
                <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <p className="text-sm font-bold text-green-700 dark:text-green-300">
                    ⚡ {formatReplyTime(fastestReply)} later
                  </p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-green-300 dark:border-green-700"></div>
              </div>

              {/* Reply Message */}
              {fastestReplyData.message && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {fastestReplyData.sender}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {fastestReplyData.timestamp?.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    "{fastestReplyData.message.replace(/<Media omitted>/g, 'Sticker/GIF').substring(0, 150)}{fastestReplyData.message.length > 150 ? '...' : ''}"
                  </p>
                </div>
              )}
            </div>
          )}
          
          {selectedStat === 'slowest' && slowestReplyData && (
            <div className="space-y-3">
              {/* Previous Message */}
              {slowestReplyData.previousMessage && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-gray-400">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {slowestReplyData.previousSender}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {slowestReplyData.previousTimestamp?.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "{slowestReplyData.previousMessage.replace(/<Media omitted>/g, 'Sticker/GIF').substring(0, 150)}{slowestReplyData.previousMessage.length > 150 ? '...' : ''}"
                  </p>
                </div>
              )}

              {/* Reply Time Indicator */}
              <div className="flex items-center justify-center py-2">
                <div className="flex-1 border-t-2 border-dashed border-purple-300 dark:border-purple-700"></div>
                <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                    ⏱️ {formatReplyTime(slowestReply)} later
                  </p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-purple-300 dark:border-purple-700"></div>
              </div>

              {/* Reply Message */}
              {slowestReplyData.message && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      {slowestReplyData.sender}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {slowestReplyData.timestamp?.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    "{slowestReplyData.message.replace(/<Media omitted>/g, 'Sticker/GIF').substring(0, 150)}{slowestReplyData.message.length > 150 ? '...' : ''}"
                  </p>
                </div>
              )}

              {slowestReply > 1440 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ This reply took more than a day! There might have been a break in the conversation.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {selectedStat === 'average' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Reply Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatReplyTime(averageReply)}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Replies Analyzed</p>
                <p className="font-semibold text-gray-900 dark:text-white">{data.length} interactions</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Interpretation</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {averageReply < 5 
                    ? "⚡ Very responsive! Quick replies show high engagement."
                    : averageReply < 30
                    ? "✅ Good responsiveness. Replies come within a reasonable time."
                    : averageReply < 120
                    ? "⏰ Moderate response time. Conversations happen but with some delays."
                    : "🕐 Slow response pattern. Long gaps between messages."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 glass-effect rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          📊 Based on {data.length} reply interactions between participants
        </p>
      </div>
    </Card>
  );
};

export default ReplyTimeChart;
