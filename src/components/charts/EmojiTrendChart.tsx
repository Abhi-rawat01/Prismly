import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyEmojiData } from '@/types/chat';

interface EmojiTrendChartProps {
  data: DailyEmojiData[];
  participants: string[];
}

const COLORS = ['#ec4899', '#8b5cf6', '#8884d8', '#82ca9d'];

const EmojiTrendChart = ({ data, participants }: EmojiTrendChartProps) => {
  const hasData = data.some(d => participants.some(p => (d[p] as number) > 0));

  if (!hasData) {
    return (
      <Card className="p-6 mt-6 text-center">
        <h2 className="text-xl font-bold mb-2">Daily Emoji Usage</h2>
        <p className="text-gray-600">No emoji usage data available to display.</p>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Daily Emoji Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {participants.map((p, index) => (
                <Line
                  key={p}
                  type="monotone"
                  dataKey={p}
                  stroke={COLORS[index % COLORS.length]}
                  name={p.split(' ')[0]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmojiTrendChart; 