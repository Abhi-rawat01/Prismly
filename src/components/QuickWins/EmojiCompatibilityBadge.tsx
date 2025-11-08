import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { EmojiCompatibility } from '@/utils/advancedAnalytics';

interface EmojiCompatibilityBadgeProps {
  data: EmojiCompatibility;
  participants: string[];
}

export const EmojiCompatibilityBadge = ({ data, participants }: EmojiCompatibilityBadgeProps) => {
  const getCompatibilityInfo = (score: number) => {
    if (score >= 75) return { emoji: '🔥', label: 'High Compatibility', color: 'text-green-600', gradient: 'from-green-400 to-emerald-500' };
    if (score >= 50) return { emoji: '✨', label: 'Medium Compatibility', color: 'text-blue-600', gradient: 'from-blue-400 to-cyan-500' };
    return { emoji: '💫', label: 'Different Styles', color: 'text-purple-600', gradient: 'from-purple-400 to-pink-500' };
  };

  const info = getCompatibilityInfo(data.compatibilityScore);
  const noSharedEmojis = data.sharedCount === 0;
  const perfectMatch = data.compatibilityScore === 100;

  return (
    <Card className="glass-effect border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 mr-2 text-pink-600" />
          😊 Emoji Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Circular Progress with Percentage */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative">
              {/* Circular ring */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.compatibilityScore / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="text-pink-500" stopColor="currentColor" />
                    <stop offset="50%" className="text-purple-500" stopColor="currentColor" />
                    <stop offset="100%" className="text-blue-500" stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold prism-text">
                  {data.compatibilityScore.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Compatibility Label */}
          <div className="text-center">
            <p className="text-2xl mb-1">{info.emoji}</p>
            <p className={`text-sm font-semibold ${info.color}`}>
              {perfectMatch ? '🎯 Perfect Emoji Match!' : noSharedEmojis ? '🎨 Unique Expression Styles' : info.label}
            </p>
          </div>

          {/* Three Sections */}
          <div className="space-y-3">
            {/* Shared Emojis */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Shared ({data.sharedCount})
              </p>
              <div className="flex flex-wrap gap-1 min-h-[32px]">
                {data.sharedEmojis.length > 0 ? (
                  data.sharedEmojis.slice(0, 10).map((emoji, idx) => (
                    <span key={idx} className="text-xl hover:scale-125 transition-transform cursor-pointer">
                      {emoji}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">No shared emojis</p>
                )}
              </div>
            </div>

            {/* Unique Emojis Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {participants[0]?.split(' ')[0]} ({data.person1Only.length})
                </p>
                <div className="flex flex-wrap gap-1 min-h-[24px]">
                  {data.person1Only.slice(0, 5).map((emoji, idx) => (
                    <span key={idx} className="text-lg hover:scale-125 transition-transform cursor-pointer">
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {participants[1]?.split(' ')[0]} ({data.person2Only.length})
                </p>
                <div className="flex flex-wrap gap-1 min-h-[24px]">
                  {data.person2Only.slice(0, 5).map((emoji, idx) => (
                    <span key={idx} className="text-lg hover:scale-125 transition-transform cursor-pointer">
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data.totalUnique} unique emojis total
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
