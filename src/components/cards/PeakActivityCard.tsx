import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Moon, Sun, Sunrise } from 'lucide-react';
import { PeakActivity } from '@/utils/advancedAnalytics';

interface PeakActivityCardProps {
  data: PeakActivity;
  participants: string[];
}

export const PeakActivityCard = ({ data, participants }: PeakActivityCardProps) => {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'night_owl': return <Moon className="h-5 w-5" />;
      case 'early_bird': return <Sunrise className="h-5 w-5" />;
      default: return <Sun className="h-5 w-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'night_owl': return 'from-indigo-500 to-purple-600';
      case 'early_bird': return 'from-orange-500 to-yellow-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <Card className="glass-effect border-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-indigo-600" />
          Peak Activity Times
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Person Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {[data.person1, data.person2].map((personData, idx) => {
              const person = participants[idx];
              const color = getColor(personData.type);
              
              return (
                <div key={person} className={`p-4 rounded-xl bg-gradient-to-br ${color} text-white`}>
                  <div className="flex items-center gap-2 mb-3">
                    {getIcon(personData.type)}
                    <p className="text-sm font-semibold">{person.split(' ')[0]}</p>
                  </div>
                  <p className="text-2xl font-bold mb-1">{formatHour(personData.peakHour)}</p>
                  <p className="text-xs opacity-90">{personData.label}</p>
                  <p className="text-xs opacity-75 mt-2">{personData.messageCount} messages</p>
                </div>
              );
            })}
          </div>

          {/* Overlap Score */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Activity Overlap
            </p>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold prism-text">
                {data.overlapScore.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                of messages sent when both are active
              </p>
            </div>
          </div>

          {/* Shared Peak Hours */}
          {data.sharedPeakHours.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Shared Peak Hours
              </p>
              <div className="flex flex-wrap gap-2">
                {data.sharedPeakHours.map((hour) => (
                  <span 
                    key={hour} 
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                  >
                    {formatHour(hour)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
