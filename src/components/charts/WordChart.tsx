import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WordData } from '@/types/chat';
import { useResponsive } from '@/hooks';

interface WordChartProps {
  data: WordData[];
}

const WordChart = ({ data }: WordChartProps) => {
  const { isMobile } = useResponsive();
  
  // Get unique participants
  const participants = [...new Set(data.map(d => d.sender))];
  
  // Get top words across all participants
  const wordCounts = new Map<string, { [key: string]: number }>();
  
  data.forEach(item => {
    if (!wordCounts.has(item.word)) {
      const counts: { [key: string]: number } = {};
      participants.forEach(p => counts[p] = 0);
      wordCounts.set(item.word, counts);
    }
    wordCounts.get(item.word)![item.sender] = item.count;
  });
  
  // Convert to array and sort by total usage
  // Show only 7 on mobile, 15 on desktop
  const chartData = Array.from(wordCounts.entries())
    .map(([word, counts]) => ({
      word,
      ...counts,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0)
    }))
    .filter(item => item.word.length > 2) // Filter out short words
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

  // Colors for the two participants - light red and blue
  const colors = ['#ef4444', '#3b82f6'];

  return (
    <Card className="p-4 md:p-6 glass-effect border-2">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold prism-text mb-2">Conversation Analysis</h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          The most used words reveal conversation topics and communication style. 💬
        </p>
      </div>
      
      <div className={isMobile() ? "h-[420px] mb-2" : "h-[500px] mb-6"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={isMobile() 
              ? { top: 10, right: 10, left: 10, bottom: 60 }
              : { top: 20, right: 30, left: 20, bottom: 80 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-transparent" />
            <XAxis 
              dataKey="word"
              stroke="#666"
              angle={-45}
              textAnchor="end"
              height={isMobile() ? 60 : 80}
              interval={0}
              fontSize={isMobile() ? 10 : 12}
              label={!isMobile() ? { value: 'Word', position: 'insideBottom', offset: -15, style: { fontSize: 14 } } : undefined}
            />
            <YAxis 
              stroke="#666"
              fontSize={isMobile() ? 11 : 12}
              width={isMobile() ? 50 : 60}
              domain={isMobile() ? [0, mobileMaxTick] : [0, 'auto']}
              ticks={isMobile() ? mobileTicks : undefined}
              interval={0}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} times`, 'Used']}
              labelFormatter={(word) => `"${word}"`}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                border: '2px solid #a855f7',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
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

      <div className={isMobile() ? "flex flex-wrap gap-2 justify-center" : "mt-6 flex flex-wrap gap-3 justify-center"}>
        {chartData.slice(0, isMobile() ? 7 : 10).map((item, index) => {
          const topUser = participants.reduce((max, p) => 
            (item[p] as number) > (item[max] as number) ? p : max
          , participants[0]);
          
          const gradients = [
            'from-red-500 to-pink-500',
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-green-500 to-teal-500',
            'from-orange-500 to-yellow-500',
            'from-indigo-500 to-purple-500',
            'from-pink-500 to-rose-500',
            'from-cyan-500 to-blue-500',
            'from-violet-500 to-purple-500',
            'from-teal-500 to-green-500'
          ];
          
          return (
            <div 
              key={item.word}
              className={`px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-full shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer`}
            >
              <span className="text-white font-bold text-xs md:text-sm">
                {item.word}
              </span>
              <span className="text-white/90 text-xs ml-1 md:ml-2">
                ({item.total})
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WordChart;
