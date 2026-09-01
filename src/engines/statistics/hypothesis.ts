import { normalCdf } from './distributions';

export interface ConfidenceIntervalInput {
  sampleMean: number;
  sampleStdDev: number;
  sampleSize: number;
  confidenceLevel: 90 | 95 | 99;
}

export interface ConfidenceIntervalResult {
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  criticalZ: number;
  intervalString: string;
}

export function calculateConfidenceInterval(input: ConfidenceIntervalInput): ConfidenceIntervalResult {
  const mean = Number(input.sampleMean) || 0;
  const s = Math.max(0.0001, Number(input.sampleStdDev) || 1);
  const n = Math.max(1, Number(input.sampleSize) || 30);
  const conf = input.confidenceLevel || 95;

  const zMap: Record<number, number> = {
    90: 1.645,
    95: 1.96,
    99: 2.576,
  };
  const z = zMap[conf] || 1.96;

  const stdError = s / Math.sqrt(n);
  const marginOfError = z * stdError;
  const lowerBound = mean - marginOfError;
  const upperBound = mean + marginOfError;

  return {
    marginOfError: Number(marginOfError.toFixed(4)),
    lowerBound: Number(lowerBound.toFixed(4)),
    upperBound: Number(upperBound.toFixed(4)),
    criticalZ: z,
    intervalString: `[${lowerBound.toFixed(3)}, ${upperBound.toFixed(3)}]`,
  };
}

export interface OneSampleTTestInput {
  sampleMean: number;
  hypothesizedMean: number;
  sampleStdDev: number;
  sampleSize: number;
  significanceAlpha: number; // 0.05, 0.01
  testType: 'two-tailed' | 'left-tailed' | 'right-tailed';
}

export interface OneSampleTTestResult {
  tStatistic: number;
  degreesOfFreedom: number;
  pValueEstimate: number;
  rejectNull: boolean;
  conclusion: string;
}

export function calculateOneSampleTTest(input: OneSampleTTestInput): OneSampleTTestResult {
  const xBar = Number(input.sampleMean) || 0;
  const mu0 = Number(input.hypothesizedMean) || 0;
  const s = Math.max(0.0001, Number(input.sampleStdDev) || 1);
  const n = Math.max(2, Number(input.sampleSize) || 10);
  const alpha = Number(input.significanceAlpha) || 0.05;
  const type = input.testType || 'two-tailed';

  const df = n - 1;
  const se = s / Math.sqrt(n);
  const t = (xBar - mu0) / se;

  // Approximate normal p-value for quick client-side test
  const zProb = normalCdf(Math.abs(t), 0, 1);
  let pValue = 2 * (1 - zProb);
  if (type === 'left-tailed') pValue = normalCdf(t, 0, 1);
  if (type === 'right-tailed') pValue = 1 - normalCdf(t, 0, 1);

  const rejectNull = pValue < alpha;
  const conclusion = rejectNull 
    ? `Reject Null Hypothesis (H₀). Statistically significant difference observed at α = ${alpha}.`
    : `Fail to Reject Null Hypothesis (H₀). Insufficient evidence to show a significant difference at α = ${alpha}.`;

  return {
    tStatistic: Number(t.toFixed(4)),
    degreesOfFreedom: df,
    pValueEstimate: Number(Math.max(0.00001, Math.min(1, pValue)).toFixed(5)),
    rejectNull,
    conclusion,
  };
}
