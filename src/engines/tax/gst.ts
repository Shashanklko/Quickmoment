export interface GstInput {
  amount: number;
  gstRate: number; // 5, 12, 18, 28
  calculationType: 'exclusive' | 'inclusive'; // Add GST or Remove GST
}

export interface GstResult {
  baseAmount: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
  effectiveRate: number;
}

export function calculateGst(input: GstInput): GstResult {
  const amount = Math.max(0, Number(input.amount) || 0);
  const rate = Math.max(0, Number(input.gstRate) || 18);
  const isInclusive = input.calculationType === 'inclusive';

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (isInclusive) {
    // Amount is total with GST included: Base = Amount / (1 + rate/100)
    baseAmount = amount / (1 + rate / 100);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
  } else {
    // Amount is base price: GST = Amount * (rate/100)
    baseAmount = amount;
    gstAmount = (amount * rate) / 100;
    totalAmount = baseAmount + gstAmount;
  }

  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstAmount: Number(sgstAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    effectiveRate: rate,
  };
}
