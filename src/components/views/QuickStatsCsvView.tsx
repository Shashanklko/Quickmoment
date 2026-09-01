import React, { useState } from 'react';
import { calculateDescriptiveStats } from '../../engines/statistics/descriptive';
import { DistributionChart } from '../charts/DistributionChart';
import { FileSpreadsheet, Upload, AlertCircle, Sparkles } from 'lucide-react';

export const QuickStatsCsvView: React.FC = () => {
  const [csvText, setCsvText] = useState(
    `Name,Score,HoursStudied,Attendance\nAlice,88,14,92\nBob,72,8,80\nCharlie,95,18,98\nDavid,60,5,68\nEmma,84,12,89\nFrank,78,10,85\nGrace,92,16,95\nHenry,65,7,72\nIvy,99,20,100\nJack,45,3,55`
  );
  const [selectedColumn, setSelectedColumn] = useState<number>(1);

  // Parse CSV
  const parseCsv = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => line.split(',').map((c) => c.trim()));
    return { headers, rows };
  };

  const { headers, rows } = parseCsv();

  // Extract numerical values for selected column
  const columnData = rows
    .map((r) => parseFloat(r[selectedColumn]))
    .filter((v) => !isNaN(v));

  const stats = calculateDescriptiveStats(columnData);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCsvText(event.target.result as string);
          setSelectedColumn(0);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                QuickStats CSV Data Analyzer
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                PRO DATA TOOL
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Upload or paste CSV datasets to instantly compute summary metrics, Tukey outliers, quartiles, and generate interactive frequency distributions.
            </p>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-md transition-all">
          <Upload className="w-4 h-4" />
          Upload CSV File
          <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Editor & Column Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Raw CSV Data
              </label>
              <span className="text-[11px] text-slate-400">{rows.length} rows loaded</span>
            </div>
            <textarea
              rows={9}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />

            <div className="mt-4">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                Select Numerical Column to Analyze
              </label>
              <div className="flex flex-wrap gap-2">
                {headers.map((h, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColumn(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedColumn === idx
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Summary Outputs */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Count (N)</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{stats.count}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Mean (Average)</span>
              <span className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">{stats.mean}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Median</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{stats.median}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Std Dev (Sample)</span>
              <span className="text-lg font-bold font-mono text-brand-600 dark:text-brand-400">{stats.stdDevSample}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Min / Max</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.min} / {stats.max}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Q1 (25th %ile)</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.q1}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Q3 (75th %ile)</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.q3}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 block mb-1">IQR</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.iqr}</span>
            </div>
          </div>

          {stats.outliers.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 dark:text-rose-200">
                <strong>Outliers Flagged:</strong> {stats.outliers.join(', ')}. Cleaned mean without outliers is <strong>{stats.cleanedMeanWithoutOutliers}</strong>.
              </div>
            </div>
          )}

          <DistributionChart data={stats.histogramBins} title={`Frequency Distribution for "${headers[selectedColumn]}"`} />
        </div>
      </div>
    </div>
  );
};
