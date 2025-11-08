import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, Crown } from 'lucide-react';
import { ConversationStarter } from '@/utils/advancedAnalytics';

interface ConversationStarterBadgeProps {
  data: ConversationStarter;
  participants: string[];
}

export const ConversationStarterBadge = ({ data, participants }: ConversationStarterBadgeProps) => {
  const leader = data[data.leader];
  const isBalanced = Math.abs(data[participants[0]].percentage - data[participants[1]].percentage) <= 5;

  if (data.totalConversations < 3) {
    return (
      <Card className="glass-effect border-2 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
            🎬 Conversation Starter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ⚠️ Limited data - Need more conversations to analyze
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
          🎬 Conversation Starter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isBalanced ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">⚖️</div>
              <p className="text-xl font-bold prism-text mb-1">Perfectly Balanced!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Both start conversations equally
              </p>
            </div>
          ) : (
            <>
              <div className="text-center py-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <p className="text-2xl font-bold prism-text">
                    {data.leader.split(' ')[0]}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  starts <span className="font-bold text-purple-600 dark:text-purple-400">{leader.percentage.toFixed(0)}%</span> of conversations
                </p>
              </div>

              {/* Visual Comparison */}
              <div className="space-y-3">
                {participants.map((person, idx) => {
                  const personData = data[person];
                  const colors = ['from-red-500 to-pink-500', 'from-blue-500 to-cyan-500'];
                  
                  return (
                    <div key={person} className="group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {person.split(' ')[0]}
                        </span>
                        <span className="text-sm font-bold prism-text">
                          {personData.count} times
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r ${colors[idx]} h-2.5 rounded-full transition-all duration-500 group-hover:opacity-80`} 
                          style={{ width: `${personData.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Based on {data.totalConversations} conversations
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
