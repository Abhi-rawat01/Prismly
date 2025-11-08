import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { SpaceAnalytics } from '@/utils/spaceAnalytics';

interface ConversationGalaxyProps {
  data: SpaceAnalytics;
}

export const ConversationGalaxy = ({ data }: ConversationGalaxyProps) => {
  const getGalaxyEmoji = (type: string) => {
    switch (type) {
      case 'spiral': return '🌀';
      case 'elliptical': return '⭕';
      default: return '💫';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="glass-effect border-2 relative overflow-hidden">
      {/* Animated space background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌌</span>
          <span className="text-2xl font-bold prism-text">Your Conversation Galaxy</span>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          A cosmic view of your communication universe
        </p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Galaxy Type */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Galaxy Classification</p>
              <h3 className="text-3xl font-bold flex items-center gap-2">
                {getGalaxyEmoji(data.galaxyType)} {data.galaxyType.charAt(0).toUpperCase() + data.galaxyType.slice(1)}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Age</p>
              <p className="text-2xl font-bold">{data.age}</p>
              <p className="text-xs opacity-75">days old</p>
            </div>
          </div>
          <p className="text-sm opacity-90">{data.galaxyDescription}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Stars */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Star Count</p>
                <p className="text-2xl font-bold prism-text">{data.starCount.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Each message is a star in your galaxy
            </p>
          </div>

          {/* Black Holes */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-2 border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🕳️</span>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Black Holes</p>
                <p className="text-2xl font-bold prism-text">{data.blackHoles.count}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {data.blackHoles.count > 0 
                ? `Longest silence: ${Math.round(data.blackHoles.longestSilence)} hours`
                : 'No significant silence periods'}
            </p>
          </div>

          {/* Supernovas */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💥</span>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Supernovas</p>
                <p className="text-2xl font-bold prism-text">{data.supernovas.count}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {data.supernovas.count > 0 
                ? `Biggest burst: ${data.supernovas.biggestBurst} messages in one day`
                : 'No major message bursts detected'}
            </p>
          </div>

          {/* Meteor Showers */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🌠</span>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Meteor Showers</p>
                <p className="text-2xl font-bold prism-text">{data.meteorShowers.count}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {data.meteorShowers.count > 0 
                ? `Peak intensity: ${data.meteorShowers.intensity} msgs/hour`
                : 'No rapid exchanges detected'}
            </p>
          </div>
        </div>

        {/* Recent Events */}
        {(data.supernovas.dates.length > 0 || data.meteorShowers.lastOccurrence) && (
          <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              🔭 Recent Cosmic Events
            </p>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              {data.supernovas.dates.length > 0 && (
                <p>
                  💥 Last supernova: {formatDate(data.supernovas.dates[data.supernovas.dates.length - 1])}
                </p>
              )}
              {data.meteorShowers.lastOccurrence && (
                <p>
                  🌠 Last meteor shower: {formatDate(data.meteorShowers.lastOccurrence)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Fun Footer */}
        <div className="text-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            🚀 Your conversation is a living, breathing universe - constantly expanding and evolving!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
