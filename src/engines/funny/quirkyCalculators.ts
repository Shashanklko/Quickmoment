// Quirky, Relatable & Viral Calculators for High Engagement

export interface ImpulsePurchaseResult {
  itemPrice: number;
  hourlyWage: number;
  workHoursRequired: number;
  workDaysRequired: number;
  percentageOfMonthlySalary: number;
  verdictTitle: string;
  verdictMessage: string;
  regretRiskScore: number; // 0 - 100
  funnyAlternative: string;
}

export const calculateImpulsePurchase = (params: {
  itemPrice: number;
  monthlySalary: number;
  weeklyHours?: number;
}): ImpulsePurchaseResult => {
  const { itemPrice, monthlySalary, weeklyHours = 40 } = params;

  const monthlyHours = (weeklyHours * 52) / 12;
  const hourlyWage = monthlySalary > 0 ? monthlySalary / monthlyHours : 1;
  const workHoursRequired = Number((itemPrice / hourlyWage).toFixed(1));
  const workDaysRequired = Number((workHoursRequired / 8).toFixed(1));
  const percentageOfMonthlySalary = Number(((itemPrice / monthlySalary) * 100).toFixed(1));

  let verdictTitle = '🛒 Treat Yourself!';
  let verdictMessage = 'Costs less than a day of work. Go ahead unless your credit card is crying.';
  let regretRiskScore = 20;
  let funnyAlternative = 'Or buy 12 cups of gourmet coffee.';

  if (percentageOfMonthlySalary > 50) {
    verdictTitle = '🚨 ABORT MISSION! Financial Hazard';
    verdictMessage = `This single purchase consumes ${percentageOfMonthlySalary}% of your monthly paycheck! You will be eating plain ramen noodles for 3 weeks.`;
    regretRiskScore = 95;
    funnyAlternative = `Or invest it into Nifty 50 and earn ₹${(itemPrice * 0.12).toFixed(0)}/yr in compounding gains!`;
  } else if (percentageOfMonthlySalary > 25) {
    verdictTitle = '⚠️ Heavy Damage Alert';
    verdictMessage = `You must endure ${workDaysRequired} full days of awkward Zoom calls and boss emails to pay for this. Sleep on it for 48 hours.`;
    regretRiskScore = 75;
    funnyAlternative = 'Or pay off your credit card balance and sleep peacefully.';
  } else if (percentageOfMonthlySalary > 10) {
    verdictTitle = '🤔 Proceed with Caution';
    verdictMessage = `Costs ${workHoursRequired} hours of pure labor. If it sparks genuine joy, buy it. If it's a 2 AM shopping impulse, close the tab.`;
    regretRiskScore = 50;
    funnyAlternative = 'Or book a weekend getaway ticket.';
  }

  return {
    itemPrice,
    hourlyWage: Number(hourlyWage.toFixed(1)),
    workHoursRequired,
    workDaysRequired,
    percentageOfMonthlySalary,
    verdictTitle,
    verdictMessage,
    regretRiskScore,
    funnyAlternative,
  };
};

export interface MeetingCostResult {
  totalCost: number;
  costPerMinute: number;
  costPerSecond: number;
  wastedCost: number;
  wordleScrollCost: number;
  verdictTitle: string;
  verdictMessage: string;
}

export const calculateMeetingCost = (params: {
  numAttendees: number;
  avgAnnualSalary: number;
  durationMinutes: number;
  engagementPercent?: number; // e.g. 30% of people active
}): MeetingCostResult => {
  const { numAttendees, avgAnnualSalary, durationMinutes, engagementPercent = 40 } = params;

  // Average working hours per year = 2000 hours = 120,000 minutes
  const costPerPersonPerMinute = avgAnnualSalary / 120000;
  const costPerMinute = costPerPersonPerMinute * numAttendees;
  const totalCost = Number((costPerMinute * durationMinutes).toFixed(0));
  const costPerSecond = Number((costPerMinute / 60).toFixed(2));

  const passivePercent = Math.max(0, 100 - engagementPercent);
  const wastedCost = Number(((totalCost * passivePercent) / 100).toFixed(0));
  const wordleScrollCost = Number((wastedCost * 0.6).toFixed(0));

  let verdictTitle = '📧 This Should Have Been An Email!';
  let verdictMessage = `This ${durationMinutes}-minute meeting burned ₹${totalCost.toLocaleString('en-IN')}. If this meeting had an agenda, nobody read it.`;

  if (totalCost > 50000) {
    verdictTitle = '💸 Corporate Black Hole';
    verdictMessage = `You just burned ₹${totalCost.toLocaleString('en-IN')}! For this price, your team could have catered five-star pizza and achieved the exact same outcome.`;
  } else if (totalCost < 5000) {
    verdictTitle = '⚡ Quick & Efficient Sync';
    verdictMessage = 'Relatively harmless budget burn. Keep it under 15 minutes before existential dread kicks in.';
  }

  return {
    totalCost,
    costPerMinute: Number(costPerMinute.toFixed(1)),
    costPerSecond,
    wastedCost,
    wordleScrollCost,
    verdictTitle,
    verdictMessage,
  };
};

export interface CoffeeMillionaireResult {
  annualSpend: number;
  spentOverHorizon: number;
  investedFutureCorpus: number;
  opportunityLoss: number;
  verdictTitle: string;
  verdictMessage: string;
}

export const calculateCoffeeMillionaire = (params: {
  dailyCoffeePrice: number;
  daysPerWeek: number;
  years: number;
  investmentReturnRate?: number;
}): CoffeeMillionaireResult => {
  const { dailyCoffeePrice, daysPerWeek, years, investmentReturnRate = 12 } = params;

  const weeklySpend = dailyCoffeePrice * daysPerWeek;
  const monthlySpend = (weeklySpend * 52) / 12;
  const annualSpend = Number((monthlySpend * 12).toFixed(0));
  const spentOverHorizon = Number((annualSpend * years).toFixed(0));

  // SIP Future value formula
  const r = investmentReturnRate / 100 / 12;
  const n = years * 12;
  const investedFutureCorpus = Number((monthlySpend * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)).toFixed(0));
  const opportunityLoss = investedFutureCorpus - spentOverHorizon;

  let verdictTitle = '☕ The Iced Latte Dilemma';
  let verdictMessage = `Skipping your coffee gives you ₹${(investedFutureCorpus / 100000).toFixed(1)} Lakhs in ${years} years... but decreases your morning joy by 99%. Choose wisely!`;

  return {
    annualSpend,
    spentOverHorizon,
    investedFutureCorpus,
    opportunityLoss,
    verdictTitle,
    verdictMessage,
  };
};

export interface BillionaireTimeResult {
  annualSalary: number;
  muskTimeSeconds: number;
  ambaniTimeSeconds: number;
  adaniTimeSeconds: number;
  chaiCupsEquivalent: number;
  funnyQuote: string;
}

export const calculateBillionaireTime = (annualSalary: number): BillionaireTimeResult => {
  // Approximate billionaire net earnings per second:
  // Elon Musk: ~$300/second (~₹25,000/sec)
  // Mukesh Ambani: ~$150/second (~₹12,500/sec)
  // Gautam Adani: ~$120/second (~₹10,000/sec)
  const muskEarningsPerSec = 25000;
  const ambaniEarningsPerSec = 12500;
  const adaniEarningsPerSec = 10000;

  const muskTimeSeconds = Number((annualSalary / muskEarningsPerSec).toFixed(1));
  const ambaniTimeSeconds = Number((annualSalary / ambaniEarningsPerSec).toFixed(1));
  const adaniTimeSeconds = Number((annualSalary / adaniEarningsPerSec).toFixed(1));
  const chaiCupsEquivalent = Math.floor(annualSalary / 15);

  const quotes = [
    'While you read this sentence, Elon Musk just earned enough to buy a Tesla.',
    'Comparison is the thief of joy... but math is hilarious.',
    'Your wealth is infinite in memes and happiness points.',
  ];

  return {
    annualSalary,
    muskTimeSeconds,
    ambaniTimeSeconds,
    adaniTimeSeconds,
    chaiCupsEquivalent,
    funnyQuote: quotes[Math.floor(Math.random() * quotes.length)],
  };
};
