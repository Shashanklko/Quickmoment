export interface RegressionPoint {
  x: number;
  y: number;
  yPred?: number;
  residual?: number;
}

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rValue: number; // Pearson correlation
  rSquared: number;
  equation: string;
  count: number;
  points: RegressionPoint[];
  linePoints: { x: number; yTrend: number }[];
  predictY: (xVal: number) => number;
}

export function calculateLinearRegression(rawX: number[], rawY: number[]): LinearRegressionResult {
  const n = Math.min(rawX.length, rawY.length);
  if (n < 2) {
    return {
      slope: 0,
      intercept: 0,
      rValue: 0,
      rSquared: 0,
      equation: 'y = 0',
      count: n,
      points: [],
      linePoints: [],
      predictY: () => 0,
    };
  }

  const validPairs: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    if (!isNaN(rawX[i]) && !isNaN(rawY[i])) {
      validPairs.push({ x: rawX[i], y: rawY[i] });
    }
  }

  const count = validPairs.length;
  const sumX = validPairs.reduce((acc, p) => acc + p.x, 0);
  const sumY = validPairs.reduce((acc, p) => acc + p.y, 0);
  const sumXY = validPairs.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = validPairs.reduce((acc, p) => acc + p.x * p.x, 0);
  const sumY2 = validPairs.reduce((acc, p) => acc + p.y * p.y, 0);

  const meanX = sumX / count;
  const meanY = sumY / count;

  const denominator = count * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? (count * sumXY - sumX * sumY) / denominator : 0;
  const intercept = meanY - slope * meanX;

  // Correlation r
  const rDenom = Math.sqrt((count * sumX2 - sumX * sumX) * (count * sumY2 - sumY * sumY));
  const rValue = rDenom !== 0 ? (count * sumXY - sumX * sumY) / rDenom : 0;
  const rSquared = rValue * rValue;

  const predict = (xVal: number) => slope * xVal + intercept;

  const minX = Math.min(...validPairs.map(p => p.x));
  const maxX = Math.max(...validPairs.map(p => p.x));

  const points: RegressionPoint[] = validPairs.map(p => {
    const yPred = predict(p.x);
    return {
      x: p.x,
      y: p.y,
      yPred: Number(yPred.toFixed(3)),
      residual: Number((p.y - yPred).toFixed(3)),
    };
  });

  const linePoints = [
    { x: Number(minX.toFixed(2)), yTrend: Number(predict(minX).toFixed(2)) },
    { x: Number(maxX.toFixed(2)), yTrend: Number(predict(maxX).toFixed(2)) },
  ];

  const sign = intercept >= 0 ? '+' : '-';
  const equation = `y = ${slope.toFixed(3)}x ${sign} ${Math.abs(intercept).toFixed(3)}`;

  return {
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    rValue: Number(rValue.toFixed(4)),
    rSquared: Number(rSquared.toFixed(4)),
    equation,
    count,
    points,
    linePoints,
    predictY: predict,
  };
}
