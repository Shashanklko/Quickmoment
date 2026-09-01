export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancyAge: number;
  currentMonthlyExpense: number;
  inflationRate: number;
  preRetirementReturnRate: number;
  postRetirementReturnRate: number;
  existingSavings?: number;
}

export interface RetirementResult {
  yearsToRetirement: number;
  yearsInRetirement: number;
  inflatedMonthlyExpenseAtRetirement: number;
  requiredRetirementCorpus: number;
  existingSavingsFutureValue: number;
  shortfallCorpus: number;
  requiredMonthlySavings: number;
  fireMultiplier: number;
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const currentAge = Math.max(18, Number(input.currentAge) || 30);
  const retirementAge = Math.max(currentAge + 1, Number(input.retirementAge) || 60);
  const lifeExpectancy = Math.max(retirementAge + 1, Number(input.lifeExpectancyAge) || 85);
  const monthlyExpense = Math.max(0, Number(input.currentMonthlyExpense) || 50000);
  const inflation = Math.max(0, Number(input.inflationRate) || 6) / 100;
  const preReturn = Math.max(0, Number(input.preRetirementReturnRate) || 12) / 100;
  const postReturn = Math.max(0, Number(input.postRetirementReturnRate) || 8) / 100;
  const savings = Math.max(0, Number(input.existingSavings) || 0);

  const yearsToRetire = retirementAge - currentAge;
  const yearsInRetire = lifeExpectancy - retirementAge;

  // Future expense at retirement
  const inflatedAnnualExpense = (monthlyExpense * 12) * Math.pow(1 + inflation, yearsToRetire);
  const inflatedMonthlyExpense = inflatedAnnualExpense / 12;

  // Real rate of return post-retirement: (1+postReturn)/(1+inflation) - 1
  const realReturn = (1 + postReturn) / (1 + inflation) - 1;

  let requiredCorpus = 0;
  if (Math.abs(realReturn) < 0.0001) {
    requiredCorpus = inflatedAnnualExpense * yearsInRetire;
  } else {
    requiredCorpus = inflatedAnnualExpense * ((1 - Math.pow(1 + realReturn, -yearsInRetire)) / realReturn);
  }

  // Future value of current savings
  const savingsFv = savings * Math.pow(1 + preReturn, yearsToRetire);
  const shortfall = Math.max(0, requiredCorpus - savingsFv);

  // Required monthly investment to bridge shortfall
  const months = yearsToRetire * 12;
  const monthlyPreRate = preReturn / 12;
  let requiredMonthlySavings = 0;
  if (monthlyPreRate > 0 && months > 0 && shortfall > 0) {
    requiredMonthlySavings = (shortfall * monthlyPreRate) / (Math.pow(1 + monthlyPreRate, months) - 1);
  }

  const fireMultiplier = (monthlyExpense * 12) > 0 ? requiredCorpus / (monthlyExpense * 12) : 25;

  return {
    yearsToRetirement: yearsToRetire,
    yearsInRetirement: yearsInRetire,
    inflatedMonthlyExpenseAtRetirement: Math.round(inflatedMonthlyExpense),
    requiredRetirementCorpus: Math.round(requiredCorpus),
    existingSavingsFutureValue: Math.round(savingsFv),
    shortfallCorpus: Math.round(shortfall),
    requiredMonthlySavings: Math.round(requiredMonthlySavings),
    fireMultiplier: Number(fireMultiplier.toFixed(1)),
  };
}
