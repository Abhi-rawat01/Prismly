interface TrendMiniChartProps {
  data: number[];
  color?: string;
}

export const TrendMiniChart = ({ data, color = 'purple' }: TrendMiniChartProps) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      viewBox="0 0 100 30"
      className="w-full h-8"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={`var(--${color}-500)`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
    </svg>
  );
};
