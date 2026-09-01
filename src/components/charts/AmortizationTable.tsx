import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface YearlyBreakdownItem {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

interface AmortizationTableProps {
  yearlyData: YearlyBreakdownItem[];
  loanAmount: number;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  yearlyData,
  loanAmount,
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayData = showAll ? yearlyData : yearlyData.slice(0, 5);

  const exportCsv = () => {
    let csv = 'Year,Principal Paid (₹),Interest Paid (₹),Ending Balance (₹)\n';
    yearlyData.forEach((row) => {
      csv += `${row.year},${row.principalPaid},${row.interestPaid},${row.balance}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `amortization_schedule_${loanAmount}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Yearly Amortization Schedule
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Breakup of annual principal vs interest payments
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
              <th className="pb-2.5">Year</th>
              <th className="pb-2.5">Principal Paid</th>
              <th className="pb-2.5">Interest Paid</th>
              <th className="pb-2.5 text-right">Ending Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {displayData.map((row) => (
              <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white">
                  Year {row.year}
                </td>
                <td className="py-2.5 text-brand-600 dark:text-brand-400 font-semibold">
                  ₹{row.principalPaid.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 text-rose-600 dark:text-rose-400 font-semibold">
                  ₹{row.interestPaid.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 text-right font-bold text-slate-900 dark:text-slate-100">
                  ₹{row.balance.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {yearlyData.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-3 py-2 text-center text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
        >
          {showAll ? 'Show Less ↑' : `View Full Schedule (${yearlyData.length} Years) ↓`}
        </button>
      )}
    </div>
  );
};
