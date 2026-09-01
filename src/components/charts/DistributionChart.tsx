import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DistributionBin {
  bin: string;
  count: number;
}

interface DistributionChartProps {
  data: DistributionBin[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  title = 'Frequency Distribution Histogram',
}) => {
  return (
    <div className="flex flex-col w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
        {title}
      </h4>

      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="bin"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              angle={-25}
              textAnchor="end"
            />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: any) => [`${value} count`, 'Frequency']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`bar-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
