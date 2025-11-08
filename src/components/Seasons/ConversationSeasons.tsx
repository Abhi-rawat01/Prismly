import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';
import { SeasonAnalysis } from '@/utils/conversationSeasons';

interface ConversationSeasonsProps {
  seasonData: SeasonAnalysis;
}

export const ConversationSeasons = ({ seasonData }: ConversationSeasonsProps) => {
  if (seasonData.seasons.length === 0) {
    return null;
  }

  return (
    <Card className="glass-effect border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Conversation Seasons
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your conversation journey through different phases
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Visualization */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400 rounded-full"></div>
          </div>

          {/* Seasons */}
          <div className="space-y-4">
            {seasonData.seasons.map((season, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl bg-gradient-to-br ${season.color} text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{season.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold">{season.name}</h3>
                      <p className="text-sm opacity-90">{season.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{season.duration}</p>
                    <p className="text-xs opacity-75">days</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <p className="text-xs opacity-75">Messages</p>
                    <p className="text-lg font-bold">{season.stats.totalMessages}</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <p className="text-xs opacity-75">Per Day</p>
                    <p className="text-lg font-bold">{season.stats.avgMessagesPerDay}</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <p className="text-xs opacity-75">Emojis</p>
                    <p className="text-lg font-bold">{season.stats.emojiCount}</p>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="flex flex-wrap gap-2">
                  {season.characteristics.map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                {/* Longest Streak */}
                {season.stats.longestStreak > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs opacity-75">Longest Streak</p>
                    <p className="text-sm font-semibold">
                      🔥 {season.stats.longestStreak} days
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Golden Period Highlight */}
        {seasonData.goldenPeriod && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              <h4 className="font-bold text-gray-900 dark:text-white">
                Golden Period
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your most active phase was during <span className="font-semibold">{seasonData.goldenPeriod.period}</span> with{' '}
              <span className="font-semibold">{seasonData.goldenPeriod.stats.avgMessagesPerDay}</span> messages per day!
            </p>
          </div>
        )}

        {/* Comparison with Current */}
        {seasonData.seasons.length > 1 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                How Things Changed
              </h4>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {compareSeasons(seasonData.seasons[0], seasonData.currentSeason).map((comparison, idx) => (
                <p key={idx}>• {comparison}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Compare seasons
const compareSeasons = (early: any, current: any): string[] => {
  const comparisons: string[] = [];

  const msgChange = ((current.stats.avgMessagesPerDay - early.stats.avgMessagesPerDay) / early.stats.avgMessagesPerDay) * 100;
  if (Math.abs(msgChange) > 15) {
    comparisons.push(
      msgChange > 0
        ? `Message frequency increased by ${msgChange.toFixed(0)}%`
        : `Message frequency decreased by ${Math.abs(msgChange).toFixed(0)}%`
    );
  } else {
    comparisons.push('Message frequency remained stable');
  }

  const emojiChange = ((current.stats.emojiCount / current.stats.totalMessages) - (early.stats.emojiCount / early.stats.totalMessages)) / (early.stats.emojiCount / early.stats.totalMessages) * 100;
  if (Math.abs(emojiChange) > 20) {
    comparisons.push(
      emojiChange > 0
        ? `Emoji usage increased`
        : `Emoji usage decreased`
    );
  }

  const lengthChange = ((current.stats.avgMessageLength - early.stats.avgMessageLength) / early.stats.avgMessageLength) * 100;
  if (Math.abs(lengthChange) > 20) {
    comparisons.push(
      lengthChange > 0
        ? `Messages are getting longer`
        : `Messages are getting shorter`
    );
  }

  return comparisons.length > 0 ? comparisons : ['Communication style has evolved naturally'];
};
