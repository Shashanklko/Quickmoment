export interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  timeYears: number;
  frequency: 'yearly' | 'halfYearly' | 'quarterly' | 'monthly' | 'daily';
  additionalMonthlyDeposit?: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalPrincipal: number;
  totalInterestEarned: number;
  interestToPrincipalRatio: number;
  progression: {
    year: number;
    principalDeposited: number;
    interestAccrued: number;
    totalBalance: number;
  }[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const P = Math.max(0, Number(input.principal) || 0);
  const r = Math.max(0, Number(input.annualRate) || 0) / 100;
  const t = Math.max(0.1, Number(input.timeYears) || 1);
  const monthlyDeposit = Math.max(0, Number(input.additionalMonthlyDeposit) || 0);

  const freqMap: Record<string, number> = {
    yearly: 1,
    halfYearly: 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };
  const n = freqMap[input.frequency] || 12;

  let balance = P;
  let totalDeposited = P;
  const progression = [];

  const totalMonths = Math.round(t * 12);
  const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;

  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit;
    totalDeposited += monthlyDeposit;

    if (m % 12 === 0 || m === totalMonths) {
      const year = Math.ceil(m / 12);
      progression.push({
        year,
        principalDeposited: Math.round(totalDeposited),
        interestAccrued: Math.round(Math.max(0, balance - totalDeposited)),
        totalBalance: Math.round(balance),
      });
    }
  }

  const futureValue = Math.round(balance);
  const totalInterestEarned = Math.round(Math.max(0, futureValue - totalDeposited));
  const interestToPrincipalRatio = totalDeposited > 0 ? Number(((totalInterestEarned / totalDeposited) * 100).toFixed(1)) : 0;

  return {
    futureValue,
    totalPrincipal: Math.round(totalDeposited),
    totalInterestEarned,
    interestToPrincipalRatio,
    progression,
  };
}
