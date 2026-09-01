// Combinations helper nCr
export function combinations(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  let c = 1;
  for (let i = 1; i <= r; i++) {
    c = (c * (n - (r - i))) / i;
  }
  return c;
}

// Factorial helper
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Binomial Distribution
export interface BinomialInput {
  trials: number;
  probability: number;
  successes: number;
}

export interface BinomialResult {
  exactProbability: number;
  cumulativeLessEqual: number;
  cumulativeGreaterEqual: number;
  mean: number;
  variance: number;
  stdDev: number;
  distributionChart: { k: number; prob: number; isExact: boolean }[];
}

export function calculateBinomial(input: BinomialInput): BinomialResult {
  const n = Math.max(1, Math.min(100, Math.round(Number(input.trials) || 10)));
  const p = Math.max(0, Math.min(1, Number(input.probability) || 0.5));
  const k = Math.max(0, Math.min(n, Math.round(Number(input.successes) || 0)));

  const pmf = (x: number) => {
    return combinations(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
  };

  const exact = pmf(k);
  let lessEqual = 0;
  let greaterEqual = 0;
  const chart: { k: number; prob: number; isExact: boolean }[] = [];

  for (let i = 0; i <= n; i++) {
    const pr = pmf(i);
    chart.push({
      k: i,
      prob: Number(pr.toFixed(5)),
      isExact: i === k,
    });
    if (i <= k) lessEqual += pr;
    if (i >= k) greaterEqual += pr;
  }

  const mean = n * p;
  const variance = n * p * (1 - p);

  return {
    exactProbability: Number(exact.toFixed(5)),
    cumulativeLessEqual: Number(lessEqual.toFixed(5)),
    cumulativeGreaterEqual: Number(greaterEqual.toFixed(5)),
    mean: Number(mean.toFixed(3)),
    variance: Number(variance.toFixed(3)),
    stdDev: Number(Math.sqrt(variance).toFixed(3)),
    distributionChart: chart,
  };
}

// Normal Distribution (Gaussian)
export interface NormalInput {
  mean: number;
  stdDev: number;
  xValue: number;
}

// Error function approximation (Abramowitz and Stegun)
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

export function normalCdf(x: number, mean: number, stdDev: number): number {
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

export function calculateNormal(input: NormalInput) {
  const mu = Number(input.mean) || 0;
  const sigma = Math.max(0.0001, Number(input.stdDev) || 1);
  const x = Number(input.xValue) || 0;

  const zScore = (x - mu) / sigma;
  const probLess = normalCdf(x, mu, sigma);
  const probGreater = 1 - probLess;
  const pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(zScore, 2));

  // Generate curve points
  const points: { x: number; pdf: number; highlighted: boolean }[] = [];
  const start = mu - 3.5 * sigma;
  const end = mu + 3.5 * sigma;
  const step = (end - start) / 60;

  for (let cur = start; cur <= end; cur += step) {
    const curZ = (cur - mu) / sigma;
    const curPdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(curZ, 2));
    points.push({
      x: Number(cur.toFixed(2)),
      pdf: Number(curPdf.toFixed(4)),
      highlighted: cur <= x,
    });
  }

  return {
    zScore: Number(zScore.toFixed(4)),
    probLess: Number(probLess.toFixed(5)),
    probGreater: Number(probGreater.toFixed(5)),
    pdfAtX: Number(pdf.toFixed(5)),
    percentile: Number((probLess * 100).toFixed(2)),
    curvePoints: points,
  };
}
