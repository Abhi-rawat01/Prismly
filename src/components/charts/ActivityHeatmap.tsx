
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyActivity } from '@/types/chat';
import { useResponsive } from '@/hooks';

interface ActivityHeatmapProps {
  data: HourlyActivity[];
}

const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  const { isMobile } = useResponsive();
  
  // Convert 24-hour to 12-hour format
  const formatTime = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  // Format time range for 3-hour intervals
  const formatTimeRange = (startHour: number): string => {
    const endHour = (startHour + 3) % 24;
    return `${formatTime(startHour)}-${formatTime(endHour)}`;
  };

  // Group data by hour and aggregate
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourData = data.filter(d => d.hour === hour);
    return {
      hour,
      totalMessages: hourData.reduce((sum, d) => sum + d.count, 0),
      timeLabel: formatTime(hour)
    };
  });

  // For mobile: group into 3-hour intervals
  const displayData = isMobile() 
    ? Array.from({ length: 8 }, (_, index) => {
        const startHour = index * 3;
        const endHour = startHour + 3;
        const intervalMessages = hourlyData
          .filter(d => d.hour >= startHour && d.hour < endHour)
          .reduce((sum, d) => sum + d.totalMessages, 0);
        
        return {
          hour: startHour,
          totalMessages: intervalMessages,
          timeLabel: formatTimeRange(startHour)
        };
      })
    : hourlyData;

  const maxMessages = Math.max(...displayData.map(d => d.totalMessages));

  // Smart interval calculation for mobile - max 5 ticks to avoid crowding
  const calculateSmartInterval = (max: number) => {
    const targetTicks = 5;
    const rawInterval = max / targetTicks;
    // Round to nice numbers (1, 2, 5, 10, 20, 50, 100, etc.)
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
    const normalized = rawInterval / magnitude;
    let niceInterval;
    if (normalized <= 1) niceInterval = magnitude;
    else if (normalized <= 2) niceInterval = 2 * magnitude;
    else if (normalized <= 5) niceInterval = 5 * magnitude;
    else niceInterval = 10 * magnitude;
    return niceInterval;
  };

  const mobileInterval = isMobile() ? calculateSmartInterval(maxMessages) : null;
  const mobileMaxTick = mobileInterval ? Math.ceil(maxMessages / mobileInterval) * mobileInterval : maxMessages;
  const mobileTicks = mobileInterval ? Array.from({ length: Math.floor(mobileMaxTick / mobileInterval) + 1 }, (_, i) => i * mobileInterval) : undefined;

  return (
    <Card className="p-4 md:p-6 glass-effect border-2">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold prism-text mb-2">Activity Patterns</h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          When are you both most active? Peak hours reveal communication patterns and availability. 📅
        </p>
      </div>
      
      <div className={isMobile() ? "h-[380px] mb-1" : "h-96 mb-6"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={displayData} 
            margin={isMobile() 
              ? { top: 10, right: 10, left: 10, bottom: 60 }
              : { top: 20, right: 30, left: 20, bottom: 80 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-transparent" />
            <XAxis 
              dataKey="timeLabel" 
              stroke="#666"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={isMobile() ? 60 : 80}
              fontSize={isMobile() ? 9 : 10}
            />
            <YAxis 
              stroke="#666"
              fontSize={isMobile() ? 11 : 12}
              width={isMobile() ? 55 : 60}
              domain={isMobile() ? [0, mobileMaxTick] : [0, 'auto']}
              ticks={isMobile() ? mobileTicks : undefined}
              interval={0}
              label={!isMobile() ? { value: 'Messages', angle: -90, position: 'insideLeft' } : undefined}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} messages`, 'Total']}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                border: '2px solid #f97316',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Bar 
              dataKey="totalMessages" 
              fill="#ec4899"
              radius={[2, 2, 0, 0]}
              activeBar={{ fill: '#ec4899', opacity: 0.8, stroke: '#fff', strokeWidth: 2 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={isMobile() ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 md:grid-cols-3 gap-4"}>
        <div className="glass-effect p-2.5 md:p-4 rounded-lg text-center border border-orange-200 dark:border-orange-800">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Most Active Hour</p>
          <p className="text-base md:text-xl font-bold prism-text">
            {hourlyData.reduce((max, curr) => 
              curr.totalMessages > max.total ? { hour: curr.timeLabel, total: curr.totalMessages } : max, 
              { hour: '00:00', total: 0 }
            ).hour}
          </p>
        </div>
        <div className="glass-effect p-2.5 md:p-4 rounded-lg text-center border border-purple-200 dark:border-purple-800">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Peak Messages</p>
          <p className="text-base md:text-xl font-bold prism-text">{maxMessages}</p>
        </div>
        <div className="glass-effect p-2.5 md:p-4 rounded-lg text-center border border-blue-200 dark:border-blue-800">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Late Night Chats</p>
          <p className="text-base md:text-xl font-bold prism-text">
            {hourlyData.filter(d => d.hour >= 22 || d.hour <= 2).reduce((sum, d) => sum + d.totalMessages, 0)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
