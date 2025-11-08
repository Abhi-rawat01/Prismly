import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MessageDistributionChartProps {
  data: {
    [user: string]: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MessageDistributionChart = ({ data }: MessageDistributionChartProps) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.split(' ')[0],
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MessageDistributionChart; 