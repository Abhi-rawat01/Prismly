import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { StreakData } from '@/utils/advancedAnalytics';

interface LongestStreakCardProps {
  data: StreakData;
}

export const LongestStreakCard = ({ data }: LongestStreakCardProps) => {

  const getFlameIntensity = (days: number) => {
    if (days >= 90) return { size: 'text-6xl', emoji: '🔥✨', label: 'Epic Streak!', color: 'from-orange-500 via-red-500 to-pink-500' };
    if (days >= 31) return { size: 'text-5xl', emoji: '🔥🔥', label: 'Amazing!', color: 'from-orange-400 to-red-500' };
    if (days >= 8) return { size: 'text-4xl', emoji: '🔥', label: 'Great!', color: 'from-yellow-400 to-orange-500' };
    return { size: 'text-3xl', emoji: '🔥', label: 'Good Start', color: 'from-yellow-300 to-orange-400' };
  };

  const flame = getFlameIntensity(data.longestStreak);
  const isOnLongestStreak = data.currentStreak === data.longestStreak && data.currentStreak > 0;
  const hasCurrentStreak = data.currentStreak > 0;

  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  return (
    <Card className="glass-effect border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Flame className="h-5 w-5 mr-2 text-orange-600" />
          🔥 Longest Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Display */}
          <div className={`p-6 rounded-xl bg-gradient-to-br ${flame.color} text-white text-center`}>
            <div className={`${flame.size} mb-2 animate-pulse`}>
              {flame.emoji}
            </div>
            <p className="text-4xl font-bold mb-1">
              {data.longestStreak} {data.longestStreak === 1 ? 'day' : 'days'}
            </p>
            <p className="text-sm opacity-90 mb-2">{flame.label}</p>
            <p className="text-xs opacity-75">
              {formatDateRange(data.longestStreakStart, data.longestStreakEnd)}
            </p>
          </div>

          {/* Current Streak Status */}
          {isOnLongestStreak ? (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-center">
                <p className="text-2xl mb-1">🎉</p>
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  You're on your longest streak right now!
                </p>
              </div>
            </div>
          ) : hasCurrentStreak ? (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold prism-text">{data.currentStreak} days</p>
                </div>
                <div className="text-3xl">🔥</div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl mb-1">💬</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Start a new streak today!
                </p>
              </div>
            </div>
          )}

          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 glass-effect rounded-lg text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Streaks</p>
              <p className="text-lg font-bold prism-text">{data.totalStreaks}</p>
            </div>
            <div className="p-3 glass-effect rounded-lg text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Length</p>
              <p className="text-lg font-bold prism-text">{data.averageStreakLength}</p>
            </div>
            <div className="p-3 glass-effect rounded-lg text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Days</p>
              <p className="text-lg font-bold prism-text">{data.activityPercentage}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
