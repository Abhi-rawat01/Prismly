import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EmojiData } from '@/types/chat';
import { useResponsive } from '@/hooks';

interface EmojiChartProps {
  data: EmojiData[];
}

const EmojiChart = ({ data }: EmojiChartProps) => {
  const { isMobile } = useResponsive();
  
  // Get unique participants
  const participants = [...new Set(data.map(d => d.sender))];
  
  // Get top emojis across all participants
  const emojiCounts = new Map<string, { [key: string]: number }>();
  
  data.forEach(item => {
    if (!emojiCounts.has(item.emoji)) {
      const counts: { [key: string]: number } = {};
      participants.forEach(p => counts[p] = 0);
      emojiCounts.set(item.emoji, counts);
    }
    emojiCounts.get(item.emoji)![item.sender] = item.count;
  });
  
  // Convert to array and sort by total usage
  // Show only 7 on mobile, 15 on desktop
  const chartData = Array.from(emojiCounts.entries())
    .map(([emoji, counts]) => ({
      emoji,
      ...counts,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, isMobile() ? 7 : 15);

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

  const maxValue = Math.max(...chartData.map(d => d.total));
  const mobileInterval = isMobile() ? calculateSmartInterval(maxValue) : null;
  const mobileMaxTick = mobileInterval ? Math.ceil(maxValue / mobileInterval) * mobileInterval : maxValue;
  const mobileTicks = mobileInterval ? Array.from({ length: Math.floor(mobileMaxTick / mobileInterval) + 1 }, (_, i) => i * mobileInterval) : undefined;

  // Colors for the two participants
  const colors = ['#ef4444', '#3b82f6']; // Light red and blue

  return (
    <Card className="p-4 md:p-6 glass-effect border-2">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold prism-text mb-2">Engagement Analysis</h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          Emoji usage reveals emotional expression and engagement levels. More emojis = more expressive! 😊✨
        </p>
      </div>
      
      <div className={isMobile() ? "h-[500px] mb-4" : "h-96 mb-6"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={isMobile() 
              ? { top: 10, right: 10, left: 10, bottom: 50 }
              : { top: 20, right: 30, left: 20, bottom: 60 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-transparent" />
            <XAxis 
              dataKey="emoji"
              stroke="#666"
              fontSize={isMobile() ? 32 : 24}
              interval={0}
              angle={0}
              textAnchor="middle"
              height={isMobile() ? 60 : 60}
              label={!isMobile() ? { value: 'Emoji', position: 'insideBottom', offset: -10, style: { fontSize: 14 } } : undefined}
            />
            <YAxis 
              stroke="#666"
              fontSize={isMobile() ? 11 : 12}
              width={isMobile() ? 45 : 60}
              label={!isMobile() ? { value: 'Usage Count', angle: -90, position: 'insideLeft', style: { fontSize: 14 } } : undefined}
              domain={isMobile() ? [0, mobileMaxTick] : [0, 'auto']}
              ticks={isMobile() ? mobileTicks : undefined}
              interval={0}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} times`, 'Used']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                border: '2px solid #ec4899',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }}
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Legend 
              verticalAlign="top" 
              wrapperStyle={{ paddingBottom: isMobile() ? '10px' : '20px' }}
              formatter={(value) => value.split(' ')[0]}
              iconSize={isMobile() ? 12 : 14}
            />
            {participants.map((participant, index) => (
              <Bar 
                key={participant}
                dataKey={participant}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                name={participant}
                activeBar={{ fill: colors[index % colors.length], opacity: 0.8, stroke: '#fff', strokeWidth: 2 }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {chartData.slice(0, isMobile() ? 4 : 5).map((item) => {
          const topUser = participants.reduce((max, p) => 
            (item[p] as number) > (item[max] as number) ? p : max
          , participants[0]);
          
          return (
            <div key={item.emoji} className="text-center p-3 md:p-4 glass-effect rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{item.emoji}</div>
              <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Total: {item.total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">By {topUser.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default EmojiChart;
