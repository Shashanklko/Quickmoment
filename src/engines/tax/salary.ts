export interface SalaryInput {
  annualCtc: number;
  basicPercentOfCtc?: number; // default 50%
  hraPercentOfBasic?: number; // default 50% (metro)
  annualBonus?: number;
  rentPaidMonthly?: number;
  metroCity?: boolean;
  section80C?: number; // max 1.5L
  section80D?: number; // max 25k/50k
  taxRegime: 'new' | 'old';
}

export interface TaxSlabBreakdown {
  slab: string;
  rate: string;
  taxAmount: number;
}

export interface SalaryResult {
  annualCtc: number;
  monthlyGross: number;
  annualGross: number;
  monthlyInHand: number;
  annualInHand: number;
  monthlyTotalDeductions: number;
  annualTotalDeductions: number;
  // Itemized breakdowns
  monthlyBasic: number;
  monthlyHra: number;
  monthlySpecialAllowance: number;
  monthlyEpfEmployee: number;
  monthlyEpfEmployer: number;
  monthlyProfTax: number;
  monthlyIncomeTaxTds: number;
  annualIncomeTax: number;
  annualCess: number;
  totalAnnualTax: number;
  standardDeduction: number;
  netTaxableIncome: number;
  slabBreakdown: TaxSlabBreakdown[];
  oldVsNewDifference: {
    recommended: 'new' | 'old';
    savingsAnnual: number;
  };
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const ctc = Math.max(0, Number(input.annualCtc) || 0);
  const basicPercent = (Number(input.basicPercentOfCtc) || 50) / 100;
  const hraPercent = (Number(input.hraPercentOfBasic) || 50) / 100;
  const bonus = Math.max(0, Number(input.annualBonus) || 0);
  const sec80C = Math.min(150000, Math.max(0, Number(input.section80C) || 0));
  const sec80D = Math.min(75000, Math.max(0, Number(input.section80D) || 0));
  const rentMonthly = Math.max(0, Number(input.rentPaidMonthly) || 0);
  const isMetro = input.metroCity ?? true;
  const selectedRegime = input.taxRegime || 'new';

  // Structure components from CTC
  const annualGrossWithoutBonus = Math.max(0, ctc - bonus);
  const annualBasic = annualGrossWithoutBonus * basicPercent;
  const monthlyBasic = annualBasic / 12;

  const annualHra = annualBasic * hraPercent;
  const monthlyHra = annualHra / 12;

  // EPF: 12% of basic (capped if basic > 15k, but standard corporate is 12% of actual basic)
  const monthlyEpf = monthlyBasic * 0.12;
  const annualEpf = monthlyEpf * 12;

  // Special Allowance is the residual
  const monthlyGross = (annualGrossWithoutBonus / 12);
  const monthlySpecialAllowance = Math.max(0, monthlyGross - monthlyBasic - monthlyHra - monthlyEpf);

  // Professional Tax (standard ₹200/month or ₹2,400/yr in most Indian states)
  const monthlyProfTax = monthlyGross > 15000 ? 200 : 0;
  const annualProfTax = monthlyProfTax * 12;

  // Function to compute tax under New Regime (Budget 2024-25 updated slabs)
  const computeNewRegimeTax = (gross: number) => {
    const stdDeduction = 75000;
    const taxable = Math.max(0, gross - stdDeduction);
    let tax = 0;
    const slabs: TaxSlabBreakdown[] = [];

    if (taxable <= 700000) {
      // 87A rebate covers up to 7L taxable
      return { totalTax: 0, taxable, stdDeduction, slabs: [{ slab: 'Up to ₹7,00,000 (Rebate 87A applied)', rate: '0%', taxAmount: 0 }] };
    }

    // New Slabs FY 2024-25:
    // 0 - 3L: Nil
    // 3L - 7L: 5% (₹20,000)
    // 7L - 10L: 10% (₹30,000)
    // 10L - 12L: 15% (₹30,000)
    // 12L - 15L: 20% (₹60,000)
    // Above 15L: 30%
    if (taxable > 300000) {
      const slabAmt = Math.min(taxable - 300000, 400000);
      const slabTax = slabAmt * 0.05;
      tax += slabTax;
      slabs.push({ slab: '₹3,00,000 - ₹7,00,000', rate: '5%', taxAmount: Math.round(slabTax) });
    }
    if (taxable > 700000) {
      const slabAmt = Math.min(taxable - 700000, 300000);
      const slabTax = slabAmt * 0.10;
      tax += slabTax;
      slabs.push({ slab: '₹7,00,000 - ₹10,00,000', rate: '10%', taxAmount: Math.round(slabTax) });
    }
    if (taxable > 1000000) {
      const slabAmt = Math.min(taxable - 1000000, 200000);
      const slabTax = slabAmt * 0.15;
      tax += slabTax;
      slabs.push({ slab: '₹10,00,000 - ₹12,00,000', rate: '15%', taxAmount: Math.round(slabTax) });
    }
    if (taxable > 1200000) {
      const slabAmt = Math.min(taxable - 1200000, 300000);
      const slabTax = slabAmt * 0.20;
      tax += slabTax;
      slabs.push({ slab: '₹12,00,000 - ₹15,00,000', rate: '20%', taxAmount: Math.round(slabTax) });
    }
    if (taxable > 1500000) {
      const slabAmt = taxable - 1500000;
      const slabTax = slabAmt * 0.30;
      tax += slabTax;
      slabs.push({ slab: 'Above ₹15,00,000', rate: '30%', taxAmount: Math.round(slabTax) });
    }

    const cess = tax * 0.04;
    return { totalTax: Math.round(tax + cess), taxable, stdDeduction, slabs };
  };

  // Function to compute tax under Old Regime
  const computeOldRegimeTax = (gross: number) => {
    const stdDeduction = 50000;
    // HRA Exemption: min of (actual HRA, rent - 10% basic, 50%/40% basic)
    const annualRent = rentMonthly * 12;
    const hraExemption = Math.max(0, Math.min(
      annualHra,
      Math.max(0, annualRent - (0.10 * annualBasic)),
      isMetro ? 0.50 * annualBasic : 0.40 * annualBasic
    ));

    const totalExemptions = stdDeduction + hraExemption + annualProfTax + sec80C + sec80D;
    const taxable = Math.max(0, gross - totalExemptions);
    let tax = 0;
    const slabs: TaxSlabBreakdown[] = [];

    if (taxable <= 500000) {
      return { totalTax: 0, taxable, stdDeduction, slabs: [{ slab: 'Up to ₹5,00,000 (Rebate 87A applied)', rate: '0%', taxAmount: 0 }] };
    }

    if (taxable > 250000) {
      const slabAmt = Math.min(taxable - 250000, 250000);
      const slabTax = slabAmt * 0.05;
      tax += slabTax;
      slabs.push({ slab: '₹2,50,000 - ₹5,00,000', rate: '5%', taxAmount: Math.round(slabTax) });
    }
    if (taxable > 500000) {
      const slabAmt = Math.min(taxable - 500000, 500000);
      const slabTax = slabAmt * 0.20;
      tax += slabTax;
      slabs.push({ slab: '₹5,00,000 - ₹10,00,000', rate: '20%', taxAmount: Math.round(slabTax) });
    }
    if (taxable > 1000000) {
      const slabAmt = taxable - 1000000;
      const slabTax = slabAmt * 0.30;
      tax += slabTax;
      slabs.push({ slab: 'Above ₹10,00,000', rate: '30%', taxAmount: Math.round(slabTax) });
    }

    const cess = tax * 0.04;
    return { totalTax: Math.round(tax + cess), taxable, stdDeduction, slabs };
  };

  const newTaxResult = computeNewRegimeTax(ctc);
  const oldTaxResult = computeOldRegimeTax(ctc);

  const activeTax = selectedRegime === 'new' ? newTaxResult : oldTaxResult;
  const annualIncomeTax = activeTax.totalTax;
  const monthlyIncomeTaxTds = annualIncomeTax / 12;

  const monthlyTotalDeductions = monthlyEpf + monthlyProfTax + monthlyIncomeTaxTds;
  const monthlyInHand = Math.max(0, monthlyGross - monthlyTotalDeductions);
  const annualInHand = monthlyInHand * 12;

  const diff = Math.abs(newTaxResult.totalTax - oldTaxResult.totalTax);
  const recommended = newTaxResult.totalTax <= oldTaxResult.totalTax ? 'new' : 'old';

  return {
    annualCtc: Math.round(ctc),
    monthlyGross: Math.round(monthlyGross),
    annualGross: Math.round(monthlyGross * 12),
    monthlyInHand: Math.round(monthlyInHand),
    annualInHand: Math.round(annualInHand),
    monthlyTotalDeductions: Math.round(monthlyTotalDeductions),
    annualTotalDeductions: Math.round(monthlyTotalDeductions * 12),
    monthlyBasic: Math.round(monthlyBasic),
    monthlyHra: Math.round(monthlyHra),
    monthlySpecialAllowance: Math.round(monthlySpecialAllowance),
    monthlyEpfEmployee: Math.round(monthlyEpf),
    monthlyEpfEmployer: Math.round(monthlyEpf),
    monthlyProfTax: Math.round(monthlyProfTax),
    monthlyIncomeTaxTds: Math.round(monthlyIncomeTaxTds),
    annualIncomeTax: Math.round(annualIncomeTax * (1 / 1.04)),
    annualCess: Math.round(annualIncomeTax * (0.04 / 1.04)),
    totalAnnualTax: Math.round(annualIncomeTax),
    standardDeduction: activeTax.stdDeduction,
    netTaxableIncome: Math.round(activeTax.taxable),
    slabBreakdown: activeTax.slabs,
    oldVsNewDifference: {
      recommended,
      savingsAnnual: Math.round(diff),
    },
  };
}
