import React, { useRef, useEffect } from 'react';

interface MonteCarloCanvasProps {
  samplePoints: { x: number; y: number; inside: boolean }[];
  estimatedPi: number;
  totalPoints: number;
}

export const MonteCarloCanvas: React.FC<MonteCarloCanvasProps> = ({
  samplePoints,
  estimatedPi,
  totalPoints,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    const radius = width / 2 - 10;

    // Clear background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw unit circle boundary
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw square boundary
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(center - radius, center - radius, radius * 2, radius * 2);

    // Draw points
    samplePoints.forEach((pt) => {
      const px = center + pt.x * radius;
      const py = center + pt.y * radius;

      ctx.fillStyle = pt.inside ? '#10b981' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [samplePoints]);

  return (
    <div className="flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Live Stochastic Point Sampling
          </h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Green: Inside Circle | Red: Outside Circle
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold font-mono text-brand-600 dark:text-brand-400">
            π ≈ {estimatedPi}
          </span>
          <div className="text-[10px] text-slate-400">
            ({totalPoints.toLocaleString()} trials)
          </div>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
        <canvas ref={canvasRef} width={280} height={280} className="w-full max-w-[280px] h-auto block" />
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Inside Circle (r ≤ 1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span>Outside Circle</span>
        </div>
      </div>
    </div>
  );
};
