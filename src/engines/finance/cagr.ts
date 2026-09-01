export interface CagrInput {
  initialValue: number;
  finalValue: number;
  durationYears: number;
}

export interface CagrResult {
  cagrPercentage: number;
  absoluteReturnPercent: number;
  totalGain: number;
  multiplier: number;
  ruleOf72Years: number;
}

export function calculateCagr(input: CagrInput): CagrResult {
  const init = Math.max(0.01, Number(input.initialValue) || 1);
  const final = Math.max(0, Number(input.finalValue) || 0);
  const years = Math.max(0.01, Number(input.durationYears) || 1);

  const cagr = (Math.pow(final / init, 1 / years) - 1) * 100;
  const absolute = ((final - init) / init) * 100;
  const totalGain = final - init;
  const multiplier = final / init;
  const ruleOf72 = cagr > 0 ? 72 / cagr : 0;

  return {
    cagrPercentage: Number(cagr.toFixed(2)),
    absoluteReturnPercent: Number(absolute.toFixed(2)),
    totalGain: Math.round(totalGain),
    multiplier: Number(multiplier.toFixed(2)),
    ruleOf72Years: Number(ruleOf72.toFixed(1)),
  };
}
