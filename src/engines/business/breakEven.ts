export interface BreakEvenInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
}

export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
  profitPoints: { units: number; revenue: number; totalCost: number; profit: number }[];
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fixed = Math.max(0, Number(input.fixedCosts) || 0);
  const variable = Math.max(0, Number(input.variableCostPerUnit) || 0);
  const price = Math.max(0.01, Number(input.sellingPricePerUnit) || 1);

  const cm = price - variable;
  const cmRatio = cm > 0 ? (cm / price) * 100 : 0;
  const breakEvenUnits = cm > 0 ? Math.ceil(fixed / cm) : 0;
  const breakEvenRevenue = breakEvenUnits * price;

  const points: { units: number; revenue: number; totalCost: number; profit: number }[] = [];
  const maxUnits = Math.max(10, breakEvenUnits * 2);
  const step = Math.max(1, Math.floor(maxUnits / 8));

  for (let u = 0; u <= maxUnits; u += step) {
    const rev = u * price;
    const cost = fixed + u * variable;
    points.push({
      units: u,
      revenue: Math.round(rev),
      totalCost: Math.round(cost),
      profit: Math.round(rev - cost),
    });
  }

  return {
    breakEvenUnits,
    breakEvenRevenue: Math.round(breakEvenRevenue),
    contributionMarginPerUnit: Number(cm.toFixed(2)),
    contributionMarginRatio: Number(cmRatio.toFixed(1)),
    profitPoints: points,
  };
}
