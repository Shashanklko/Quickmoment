export interface EmiInput {
  loanAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  processingFeePercent?: number;
  prepaymentMonthly?: number;
}

export interface AmortizationRow {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  interestRatioPercent: number;
  principalRatioPercent: number;
  processingFeeAmount: number;
  schedule: AmortizationRow[];
  yearlyBreakdown: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }[];
}

export function calculateEmi(input: EmiInput): EmiResult {
  const P = Math.max(0, Number(input.loanAmount) || 0);
  const annualRate = Math.max(0, Number(input.annualInterestRate) || 0);
  const tenureYears = Math.max(0.1, Number(input.tenureYears) || 1);
  const feePercent = Number(input.processingFeePercent) || 0;
  const prepaymentMonthly = Math.max(0, Number(input.prepaymentMonthly) || 0);

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = Math.round(tenureYears * 12);

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = totalMonths > 0 ? P / totalMonths : 0;
  } else {
    monthlyEmi = (P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                 (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const effectiveMonthlyPayment = monthlyEmi + prepaymentMonthly;
  const schedule: AmortizationRow[] = [];
  let currentBalance = P;
  let accumulatedInterest = 0;
  let accumulatedPrincipal = 0;

  const yearlyMap = new Map<number, { principal: number; interest: number; balance: number }>();

  for (let m = 1; m <= totalMonths && currentBalance > 0.01; m++) {
    const interest = currentBalance * monthlyRate;
    let principal = effectiveMonthlyPayment - interest;
    if (principal > currentBalance) {
      principal = currentBalance;
    }
    const closingBalance = Math.max(0, currentBalance - principal);
    const year = Math.ceil(m / 12);

    schedule.push({
      month: m,
      year,
      openingBalance: Math.round(currentBalance),
      emi: Math.round(principal + interest),
      principal: Math.round(principal),
      interest: Math.round(interest),
      closingBalance: Math.round(closingBalance),
    });

    accumulatedInterest += interest;
    accumulatedPrincipal += principal;
    currentBalance = closingBalance;

    const existingYear = yearlyMap.get(year) || { principal: 0, interest: 0, balance: 0 };
    existingYear.principal += principal;
    existingYear.interest += interest;
    existingYear.balance = closingBalance;
    yearlyMap.set(year, existingYear);
  }

  const totalPayment = accumulatedPrincipal + accumulatedInterest;
  const processingFeeAmount = (P * feePercent) / 100;
  const interestRatioPercent = totalPayment > 0 ? (accumulatedInterest / totalPayment) * 100 : 0;
  const principalRatioPercent = totalPayment > 0 ? (accumulatedPrincipal / totalPayment) * 100 : 0;

  const yearlyBreakdown = Array.from(yearlyMap.entries()).map(([year, data]) => ({
    year,
    principalPaid: Math.round(data.principal),
    interestPaid: Math.round(data.interest),
    balance: Math.round(data.balance),
  }));

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(accumulatedInterest),
    totalPayment: Math.round(totalPayment),
    principal: Math.round(P),
    interestRatioPercent: Number(interestRatioPercent.toFixed(1)),
    principalRatioPercent: Number(principalRatioPercent.toFixed(1)),
    processingFeeAmount: Math.round(processingFeeAmount),
    schedule,
    yearlyBreakdown,
  };
}
