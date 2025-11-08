import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';
import { EmojiCompatibility } from '@/utils/advancedAnalytics';

interface EmojiCompatibilityCardProps {
  data: EmojiCompatibility;
  participants: string[];
}

export const EmojiCompatibilityCard = ({ data, participants }: EmojiCompatibilityCardProps) => {
  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return { text: 'Excellent Match', color: 'text-green-600', emoji: '🎯' };
    if (score >= 60) return { text: 'Great Compatibility', color: 'text-blue-600', emoji: '✨' };
    if (score >= 40) return { text: 'Good Overlap', color: 'text-purple-600', emoji: '👍' };
    if (score >= 20) return { text: 'Some Shared', color: 'text-orange-600', emoji: '🤝' };
    return { text: 'Different Styles', color: 'text-gray-600', emoji: '🎨' };
  };

  const label = getCompatibilityLabel(data.compatibilityScore);

  return (
    <Card className="glass-effect border-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-pink-600" />
          Emoji Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Compatibility Score */}
          <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
            <div className="text-5xl mb-2">{label.emoji}</div>
            <div className="text-4xl font-bold prism-text mb-2">
              {data.compatibilityScore.toFixed(0)}%
            </div>
            <p className={`text-sm font-semibold ${label.color}`}>
              {label.text}
            </p>
          </div>

          {/* Shared Emojis */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Shared Emojis ({data.sharedCount})
            </p>
            <div className="flex flex-wrap gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 min-h-[60px]">
              {data.sharedEmojis.length > 0 ? (
                data.sharedEmojis.slice(0, 20).map((emoji, idx) => (
                  <span key={idx} className="text-2xl">{emoji}</span>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No shared emojis</p>
              )}
            </div>
          </div>

          {/* Unique Emojis */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Only {participants[0]?.split(' ')[0]} ({data.person1Only.length})
              </p>
              <div className="flex flex-wrap gap-1 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 min-h-[50px]">
                {data.person1Only.slice(0, 10).map((emoji, idx) => (
                  <span key={idx} className="text-xl">{emoji}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Only {participants[1]?.split(' ')[0]} ({data.person2Only.length})
              </p>
              <div className="flex flex-wrap gap-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 min-h-[50px]">
                {data.person2Only.slice(0, 10).map((emoji, idx) => (
                  <span key={idx} className="text-xl">{emoji}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
