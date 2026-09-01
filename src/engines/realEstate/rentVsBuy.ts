export interface RentVsBuyInput {
  propertyPrice: number;
  downPaymentPercent: number; // e.g. 20%
  loanInterestRate: number; // e.g. 8.5%
  loanTenureYears: number; // e.g. 20
  monthlyRent: number; // e.g. 25000
  annualRentIncreasePercent: number; // e.g. 7%
  annualPropertyAppreciationPercent: number; // e.g. 6%
  investmentReturnPercent: number; // e.g. 11% (if renting & investing difference)
  holdingYears: number; // e.g. 15
}

export interface RentVsBuyResult {
  totalCostOfBuying: number;
  estimatedPropertyValue: number;
  netWealthIfBuying: number;
  totalCostOfRenting: number;
  investedDownPaymentAndDiffValue: number;
  netWealthIfRenting: number;
  recommendedDecision: 'Buy Property' | 'Rent & Invest Difference';
  wealthDifference: number;
  yearlyComparison: {
    year: number;
    buyNetWealth: number;
    rentNetWealth: number;
  }[];
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const price = Math.max(100000, Number(input.propertyPrice) || 5000000);
  const dpPct = (Number(input.downPaymentPercent) || 20) / 100;
  const loanRate = (Number(input.loanInterestRate) || 8.5) / 100 / 12;
  const tenureYears = Number(input.loanTenureYears) || 20;
  let rentMonthly = Number(input.monthlyRent) || 25000;
  const rentHike = (Number(input.annualRentIncreasePercent) || 6) / 100;
  const propApprec = (Number(input.annualPropertyAppreciationPercent) || 6) / 100;
  const investReturnMonthly = (Number(input.investmentReturnPercent) || 11) / 100 / 12;
  const years = Math.max(1, Math.min(30, Number(input.holdingYears) || 15));

  const downPayment = price * dpPct;
  const loanPrincipal = price - downPayment;
  const totalLoanMonths = tenureYears * 12;

  const emi = loanPrincipal > 0 && loanRate > 0
    ? (loanPrincipal * loanRate * Math.pow(1 + loanRate, totalLoanMonths)) / (Math.pow(1 + loanRate, totalLoanMonths) - 1)
    : 0;

  // Simulator over years
  let currentPropVal = price;
  let loanBal = loanPrincipal;
  let rentInvestmentPortfolio = downPayment; // Renter invests down payment in market

  let totalBuyOutflow = downPayment;
  let totalRentOutflow = 0;

  const yearlyComparison = [];

  for (let y = 1; y <= years; y++) {
    // 12 months in this year
    for (let m = 1; m <= 12; m++) {
      // Buyer pays EMI
      if (loanBal > 0) {
        const interest = loanBal * loanRate;
        const principal = Math.min(loanBal, emi - interest);
        loanBal = Math.max(0, loanBal - principal);
        totalBuyOutflow += emi;
      }

      // Maintenance / property tax (approx 1% of price / 12)
      const maintenance = (price * 0.01) / 12;
      totalBuyOutflow += maintenance;

      // Renter pays rent
      totalRentOutflow += rentMonthly;

      // Renter invests the difference if EMI + maintenance > rent
      const buyerMonthlyOutflow = (loanBal > 0 ? emi : 0) + maintenance;
      const monthlySavings = buyerMonthlyOutflow - rentMonthly;

      rentInvestmentPortfolio = rentInvestmentPortfolio * (1 + investReturnMonthly) + Math.max(0, monthlySavings);
    }

    // Year-end appreciation & rent hike
    currentPropVal = currentPropVal * (1 + propApprec);
    rentMonthly = rentMonthly * (1 + rentHike);

    const buyNetWealth = currentPropVal - loanBal;
    const rentNetWealth = rentInvestmentPortfolio;

    yearlyComparison.push({
      year: y,
      buyNetWealth: Math.round(buyNetWealth),
      rentNetWealth: Math.round(rentNetWealth),
    });
  }

  const finalBuyWealth = Math.round(currentPropVal - loanBal);
  const finalRentWealth = Math.round(rentInvestmentPortfolio);
  const diff = Math.abs(finalBuyWealth - finalRentWealth);

  return {
    totalCostOfBuying: Math.round(totalBuyOutflow),
    estimatedPropertyValue: Math.round(currentPropVal),
    netWealthIfBuying: finalBuyWealth,
    totalCostOfRenting: Math.round(totalRentOutflow),
    investedDownPaymentAndDiffValue: finalRentWealth,
    netWealthIfRenting: finalRentWealth,
    recommendedDecision: finalBuyWealth >= finalRentWealth ? 'Buy Property' : 'Rent & Invest Difference',
    wealthDifference: diff,
    yearlyComparison,
  };
}
