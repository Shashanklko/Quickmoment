export interface MonteCarloInvestmentInput {
  initialInvestment: number;
  monthlyContribution: number;
  expectedAnnualReturn: number; // e.g. 12%
  annualVolatility: number; // e.g. 18%
  durationYears: number; // e.g. 20
  numSimulations: number; // e.g. 2000
  targetGoalCorpus?: number; // e.g. 10000000 (1 Crore)
}

export interface MonteCarloYearlyBand {
  year: number;
  p10: number; // 10th percentile (worst case)
  p25: number;
  p50: number; // Median
  p75: number;
  p90: number; // 90th percentile (best case)
}

export interface MonteCarloInvestmentResult {
  simulationsRun: number;
  durationYears: number;
  totalPrincipalInvested: number;
  p10Final: number;
  p50Final: number; // Median
  p90Final: number;
  probabilityOfReachingTarget: number;
  samplePaths: { pathIndex: number; data: number[] }[];
  yearlyBands: MonteCarloYearlyBand[];
}

// Box-Muller transform for standard normal random variables
function randomNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function runMonteCarloInvestment(input: MonteCarloInvestmentInput): MonteCarloInvestmentResult {
  const init = Math.max(0, Number(input.initialInvestment) || 100000);
  const monthly = Math.max(0, Number(input.monthlyContribution) || 10000);
  const mu = (Number(input.expectedAnnualReturn) || 12) / 100;
  const sigma = Math.max(0.01, (Number(input.annualVolatility) || 15) / 100);
  const years = Math.max(1, Math.min(40, Math.round(Number(input.durationYears) || 15)));
  const numSims = Math.max(100, Math.min(5000, Math.round(Number(input.numSimulations) || 1000)));
  const targetGoal = Number(input.targetGoalCorpus) || 10000000;

  const dt = 1 / 12;
  const totalMonths = years * 12;
  const drift = (mu - 0.5 * sigma * sigma) * dt;
  const volSqrtDt = sigma * Math.sqrt(dt);

  // Store outcomes per year across all simulations: yearIndex -> array of values
  const yearTrajectories: number[][] = Array.from({ length: years + 1 }, () => []);
  const samplePaths: { pathIndex: number; data: number[] }[] = [];
  let targetMetCount = 0;

  for (let s = 0; s < numSims; s++) {
    let currentCorpus = init;
    const pathTrajectory: number[] = [init];

    for (let m = 1; m <= totalMonths; m++) {
      const z = randomNormal();
      currentCorpus = (currentCorpus + monthly) * Math.exp(drift + volSqrtDt * z);

      if (m % 12 === 0) {
        const year = m / 12;
        yearTrajectories[year].push(currentCorpus);
        pathTrajectory.push(Math.round(currentCorpus));
      }
    }

    if (currentCorpus >= targetGoal) {
      targetMetCount++;
    }

    if (s < 6) {
      samplePaths.push({
        pathIndex: s + 1,
        data: pathTrajectory,
      });
    }
  }

  // Calculate percentiles per year
  const getPercentile = (arr: number[], p: number) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.floor(sorted.length * p);
    return Math.round(sorted[Math.min(idx, sorted.length - 1)]);
  };

  const yearlyBands: MonteCarloYearlyBand[] = [];
  for (let y = 1; y <= years; y++) {
    const arr = yearTrajectories[y];
    yearlyBands.push({
      year: y,
      p10: getPercentile(arr, 0.10),
      p25: getPercentile(arr, 0.25),
      p50: getPercentile(arr, 0.50),
      p75: getPercentile(arr, 0.75),
      p90: getPercentile(arr, 0.90),
    });
  }

  const finalArr = yearTrajectories[years];
  const totalInvested = init + monthly * 12 * years;

  return {
    simulationsRun: numSims,
    durationYears: years,
    totalPrincipalInvested: Math.round(totalInvested),
    p10Final: getPercentile(finalArr, 0.10),
    p50Final: getPercentile(finalArr, 0.50),
    p90Final: getPercentile(finalArr, 0.90),
    probabilityOfReachingTarget: Number(((targetMetCount / numSims) * 100).toFixed(1)),
    samplePaths,
    yearlyBands,
  };
}
