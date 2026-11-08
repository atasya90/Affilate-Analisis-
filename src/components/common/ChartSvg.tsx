import React, { useState } from 'react';

export interface ChartPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface ChartSvgProps {
  data: ChartPoint[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  showArea?: boolean;
  type?: 'line' | 'bar';
  title?: string;
  emptyMessage?: string;
}

export const ChartSvg: React.FC<ChartSvgProps> = ({
  data,
  height = 180,
  color = '#6366f1',
  secondaryColor = '#14b8a6',
  valuePrefix = '',
  valueSuffix = '',
  showArea = true,
  type = 'line',
  title,
  emptyMessage = 'Tidak ada data time-series',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs"
      >
        {emptyMessage}
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values, 1);
  const range = maxVal - minVal || 1;

  const width = 600;
  const paddingX = 25;
  const paddingTop = 20;
  const paddingBottom = 25;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;

  // Coordinate mapper
  const getCoordinates = (val: number, idx: number) => {
    const x = paddingX + (idx / Math.max(1, data.length - 1)) * chartWidth;
    const normalizedY = (val - minVal) / range;
    const y = paddingTop + (1 - normalizedY) * chartHeight;
    return { x, y };
  };

  const points = data.map((d, i) => getCoordinates(d.value, i));
  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="w-full relative flex flex-col select-none">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">{title}</span>
          {hoveredData && (
            <div className="text-xs font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              <span className="text-slate-400 mr-1.5">{hoveredData.label}:</span>
              <span className="font-bold">
                {valuePrefix}
                {hoveredData.value.toLocaleString('id-ID')}
                {valueSuffix}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="#1e293b"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight * 0.5}
            x2={width - paddingX}
            y2={paddingTop + chartHeight * 0.5}
            stroke="#1e293b"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight}
            x2={width - paddingX}
            y2={paddingTop + chartHeight}
            stroke="#1e293b"
          />

          {type === 'line' ? (
            <>
              {showArea && <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />}
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIndex === i ? 5 : i === points.length - 1 ? 4 : 2.5}
                  fill={hoveredIndex === i ? '#ffffff' : color}
                  stroke="#050814"
                  strokeWidth="2"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              ))}
            </>
          ) : (
            // Bar chart
            data.map((d, i) => {
              const barWidth = Math.max(4, chartWidth / data.length - 6);
              const { x, y } = getCoordinates(d.value, i);
              const barHeight = paddingTop + chartHeight - y;
              return (
                <rect
                  key={i}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={Math.max(2, barHeight)}
                  rx="3"
                  fill={hoveredIndex === i ? secondaryColor : color}
                  opacity={hoveredIndex === null || hoveredIndex === i ? 0.9 : 0.5}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              );
            })
          )}

          {/* Interactive vertical hover indicator line */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartHeight}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Label markers for start and end */}
          <text
            x={paddingX}
            y={height - 6}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="start"
          >
            {data[0]?.label}
          </text>
          <text
            x={width - paddingX}
            y={height - 6}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            {data[data.length - 1]?.label}
          </text>
        </svg>
      </div>
    </div>
  );
};

export const Sparkline: React.FC<{ data: number[]; color?: string; width?: number; height?: number }> = ({
  data,
  color = '#10b981',
  width = 90,
  height = 28,
}) => {
  if (!data || data.length < 2) return <div style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((val - min) / range) * (height - 8);
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(' ')}
      />
    </svg>
  );
};
