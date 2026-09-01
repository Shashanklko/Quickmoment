export function calcPercentOf(x: number, y: number): number {
  return (x / 100) * y;
}

export function calcWhatPercent(x: number, y: number): number {
  if (y === 0) return 0;
  return (x / y) * 100;
}

export function calcPercentChange(initial: number, final: number): { change: number; isIncrease: boolean; diff: number } {
  if (initial === 0) return { change: 0, isIncrease: true, diff: final };
  const diff = final - initial;
  const change = (diff / Math.abs(initial)) * 100;
  return {
    change: Number(Math.abs(change).toFixed(2)),
    isIncrease: diff >= 0,
    diff,
  };
}
