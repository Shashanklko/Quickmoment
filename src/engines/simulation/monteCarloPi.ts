export interface MonteCarloPiResult {
  totalPoints: number;
  pointsInsideCircle: number;
  estimatedPi: number;
  actualPi: number;
  errorPercentage: number;
  samplePoints: { x: number; y: number; inside: boolean }[];
}

export function runMonteCarloPi(totalPoints: number, maxSampleRender = 800): MonteCarloPiResult {
  const n = Math.max(10, Math.min(500000, totalPoints));
  let insideCount = 0;
  const samplePoints: { x: number; y: number; inside: boolean }[] = [];

  const sampleRatio = maxSampleRender / n;

  for (let i = 0; i < n; i++) {
    // Generate uniform random x, y in [-1, 1]
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const isInside = (x * x + y * y) <= 1;

    if (isInside) {
      insideCount++;
    }

    if (samplePoints.length < maxSampleRender && (Math.random() < sampleRatio || i < 200)) {
      samplePoints.push({ x, y, inside: isInside });
    }
  }

  const estimatedPi = (4 * insideCount) / n;
  const actualPi = Math.PI;
  const errorPercentage = Math.abs((estimatedPi - actualPi) / actualPi) * 100;

  return {
    totalPoints: n,
    pointsInsideCircle: insideCount,
    estimatedPi: Number(estimatedPi.toFixed(6)),
    actualPi: Number(actualPi.toFixed(6)),
    errorPercentage: Number(errorPercentage.toFixed(4)),
    samplePoints,
  };
}
