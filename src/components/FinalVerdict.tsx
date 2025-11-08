import { Card } from '@/components/ui/card';
import { ChatData } from '@/types/chat';
import { RelationshipType } from '@/components/RelationshipTypeSelector';
import { getVerdict } from '@/utils/verdicts';

interface FinalVerdictProps {
  chatData: ChatData;
  relationshipType: RelationshipType;
  connectionScore: number;
}

const FinalVerdict = ({ chatData, relationshipType, connectionScore }: FinalVerdictProps) => {
  const verdict = getVerdict(connectionScore, relationshipType);
  
  // Create circular progress indicator
  const circumference = 2 * Math.PI * 70; // radius = 70
  const strokeDashoffset = circumference - (connectionScore / 100) * circumference;

  return (
    <Card className={`p-8 text-center glass-effect border-2 bg-gradient-to-br ${verdict.gradient} dark:from-gray-800 dark:to-gray-900 shadow-2xl`}>
      <div className="space-y-6">
        {/* Circular Progress with Score */}
        <div className="flex justify-center">
          <div className="relative">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(270, 70%, 60%)" />
                  <stop offset="50%" stopColor="hsl(210, 80%, 55%)" />
                  <stop offset="100%" stopColor="hsl(330, 75%, 65%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold prism-text">
                {connectionScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Connection
              </div>
            </div>
          </div>
        </div>
        
        {/* Verdict Icon & Title */}
        <div className="space-y-3">
          <div className="text-6xl">{verdict.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {verdict.title}
          </h2>
        </div>
        
        {/* Description */}
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {verdict.description}
          </p>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
          <div className="space-y-1">
            <div className="text-2xl font-bold prism-text">{chatData.totalMessages}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Messages</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold prism-text">{chatData.avgReplyTime}m</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Reply</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold prism-text">{Math.round(chatData.messageRatio * 100)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Balance</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold prism-text">{Math.round(chatData.consistencyRatio * 100)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Consistency</div>
          </div>
        </div>
        
        {/* Quote */}
        <div className="glass-effect rounded-lg p-4 max-w-md mx-auto border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            "Every conversation tells a story. Prismly helps you see it in full color." 🌈
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FinalVerdict;
