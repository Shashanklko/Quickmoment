import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';

interface ScatterRegressionChartProps {
  points: { x: number; y: number }[];
  linePoints: { x: number; yTrend: number }[];
  equation: string;
  rSquared: number;
}

export const ScatterRegressionChart: React.FC<ScatterRegressionChartProps> = ({
  points,
  linePoints,
  equation,
  rSquared,
}) => {
  return (
    <div className="flex flex-col w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Regression Scatter Plot & Trendline
          </h4>
          <p className="text-[11px] font-mono text-brand-600 dark:text-brand-400 mt-0.5">
            Fit: {equation} (R² = {rSquared.toFixed(3)})
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <ComposedChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="x" type="number" stroke="#94a3b8" fontSize={11} name="X" />
            <YAxis dataKey="y" type="number" stroke="#94a3b8" fontSize={11} name="Y" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
              }}
            />
            {/* Scatter points */}
            <Scatter name="Data Points" data={points} fill="#d946ef" />
            {/* Trend line */}
            <Line
              type="monotone"
              data={linePoints}
              dataKey="yTrend"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
