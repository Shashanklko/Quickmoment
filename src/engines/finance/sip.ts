export interface SipInput {
  monthlyInvestment: number;
  expectedAnnualReturn: number;
  investmentDurationYears: number;
  annualStepUpPercent?: number;
}

export interface SipYearlyPoint {
  year: number;
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
}

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
  wealthGainMultiplier: number;
  yearlyProgression: SipYearlyPoint[];
}

export function calculateSip(input: SipInput): SipResult {
  let monthlyInv = Math.max(0, Number(input.monthlyInvestment) || 0);
  const annualReturn = Math.max(0, Number(input.expectedAnnualReturn) || 0);
  const years = Math.max(1, Number(input.investmentDurationYears) || 1);
  const stepUpPercent = Math.max(0, Number(input.annualStepUpPercent) || 0);

  const monthlyRate = annualReturn / 12 / 100;
  let currentMonthly = monthlyInv;
  let totalInvested = 0;
  let corpus = 0;

  const yearlyProgression: SipYearlyPoint[] = [];

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      corpus = (corpus + currentMonthly) * (1 + monthlyRate);
      totalInvested += currentMonthly;
    }

    yearlyProgression.push({
      year,
      totalInvested: Math.round(totalInvested),
      estimatedReturns: Math.round(Math.max(0, corpus - totalInvested)),
      futureValue: Math.round(corpus),
    });

    if (stepUpPercent > 0) {
      currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
    }
  }

  const futureValue = Math.round(corpus);
  const estimatedReturns = Math.round(Math.max(0, futureValue - totalInvested));
  const wealthGainMultiplier = totalInvested > 0 ? Number((futureValue / totalInvested).toFixed(2)) : 1;

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns,
    futureValue,
    wealthGainMultiplier,
    yearlyProgression,
  };
}
