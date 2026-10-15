import React from 'react';

interface SparklineChartProps {
  data: number[];
  isPositive: boolean;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ data, isPositive }) => {
  if (!data || data.length === 0) return null;

  // Берём только 20 последних точек для плавности
  const pointsData = data.slice(-20);
  const min = Math.min(...pointsData);
  const max = Math.max(...pointsData);

  const width = 120;
  const height = 40;

  // Преобразуем массив цен в координаты SVG (x, y)
  const points = pointsData
    .map((val, index) => {
      const x = (index / (pointsData.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};