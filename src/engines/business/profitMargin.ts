export interface ProfitMarginInput {
  cost: number;
  revenue: number;
}

export interface ProfitMarginResult {
  profit: number;
  grossMarginPercent: number;
  markupPercent: number;
}

export function calculateProfitMargin(cost: number, revenue: number): ProfitMarginResult {
  const c = Math.max(0, Number(cost) || 0);
  const r = Math.max(0, Number(revenue) || 0);

  const profit = r - c;
  const margin = r > 0 ? (profit / r) * 100 : 0;
  const markup = c > 0 ? (profit / c) * 100 : 0;

  return {
    profit: Math.round(profit),
    grossMarginPercent: Number(margin.toFixed(2)),
    markupPercent: Number(markup.toFixed(2)),
  };
}
