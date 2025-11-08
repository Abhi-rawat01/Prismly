import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Moon, Sun, Sunrise } from 'lucide-react';
import { PeakActivity } from '@/utils/advancedAnalytics';

interface NightOwlCardProps {
  data: PeakActivity;
  participants: string[];
}

export const NightOwlCard = ({ data, participants }: NightOwlCardProps) => {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'night_owl': return <Moon className="h-6 w-6" />;
      case 'early_bird': return <Sunrise className="h-6 w-6" />;
      default: return <Sun className="h-6 w-6" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'night_owl': return 'from-indigo-500 via-purple-500 to-pink-500';
      case 'early_bird': return 'from-orange-400 via-yellow-400 to-amber-500';
      default: return 'from-blue-400 via-cyan-400 to-teal-500';
    }
  };

  const samePeakTime = data.person1.peakHour === data.person2.peakHour;

  return (
    <Card className="glass-effect border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Clock className="h-5 w-5 mr-2 text-indigo-600" />
          🦉 vs 🐦 Activity Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Split Card Design */}
          <div className="grid grid-cols-2 gap-3">
            {[data.person1, data.person2].map((personData, idx) => {
              const person = participants[idx];
              const gradient = getGradient(personData.type);
              
              return (
                <div 
                  key={person} 
                  className={`p-4 rounded-xl bg-gradient-to-br ${gradient} text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                >
                  <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    {getIcon(personData.type)}
                  </div>
                  <p className="text-sm font-semibold text-center mb-1 opacity-90">
                    {person.split(' ')[0]}
                  </p>
                  <p className="text-2xl font-bold text-center mb-1">
                    {formatHour(personData.peakHour)}
                  </p>
                  <p className="text-xs text-center opacity-90">
                    {personData.label.split(' ')[1]}
                  </p>
                  <p className="text-xs text-center opacity-75 mt-2">
                    {personData.messageCount} messages
                  </p>
                </div>
              );
            })}
          </div>

          {/* Insight Section */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            {samePeakTime ? (
              <div className="text-center">
                <p className="text-2xl mb-1">🎯</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Perfect sync at {formatHour(data.person1.peakHour)}!
                </p>
              </div>
            ) : data.sharedPeakHours.length > 0 ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  ✨ Shared Active Hours
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You're both active around {formatHour(data.sharedPeakHours[0])}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  ⏰ Different Schedules
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {participants[0].split(' ')[0]} peaks at {formatHour(data.person1.peakHour)}, {participants[1].split(' ')[0]} at {formatHour(data.person2.peakHour)}
                </p>
              </div>
            )}
          </div>

          {/* Overlap Score */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Activity Overlap: <span className="font-bold prism-text">{data.overlapScore.toFixed(0)}%</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
