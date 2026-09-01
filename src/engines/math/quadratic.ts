export interface QuadraticResult {
  discriminant: number;
  rootType: 'two-distinct-real' | 'one-repeated-real' | 'two-complex';
  root1: string;
  root2: string;
  vertex: { x: number; y: number };
  stepByStep: string[];
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  const coeffA = Number(a) || 1;
  const coeffB = Number(b) || 0;
  const coeffC = Number(c) || 0;

  if (coeffA === 0) {
    // Linear: bx + c = 0 => x = -c/b
    const x = coeffB !== 0 ? -coeffC / coeffB : 0;
    return {
      discriminant: 0,
      rootType: 'one-repeated-real',
      root1: x.toFixed(3),
      root2: x.toFixed(3),
      vertex: { x: 0, y: coeffC },
      stepByStep: [`Linear equation: ${coeffB}x + ${coeffC} = 0`, `x = ${-coeffC} / ${coeffB} = ${x.toFixed(3)}`],
    };
  }

  const d = coeffB * coeffB - 4 * coeffA * coeffC;
  const vertexX = -coeffB / (2 * coeffA);
  const vertexY = coeffA * vertexX * vertexX + coeffB * vertexX + coeffC;

  const steps: string[] = [
    `Standard Form: ${coeffA}x² ${coeffB >= 0 ? '+' : ''}${coeffB}x ${coeffC >= 0 ? '+' : ''}${coeffC} = 0`,
    `Discriminant Δ = b² - 4ac = (${coeffB})² - 4(${coeffA})(${coeffC}) = ${d}`,
  ];

  if (d > 0) {
    const r1 = (-coeffB + Math.sqrt(d)) / (2 * coeffA);
    const r2 = (-coeffB - Math.sqrt(d)) / (2 * coeffA);
    steps.push(`Since Δ > 0, there are two real and distinct roots.`);
    steps.push(`x₁ = (-b + √Δ)/(2a) = (${-coeffB} + ${Math.sqrt(d).toFixed(3)}) / ${2 * coeffA} = ${r1.toFixed(3)}`);
    steps.push(`x₂ = (-b - √Δ)/(2a) = (${-coeffB} - ${Math.sqrt(d).toFixed(3)}) / ${2 * coeffA} = ${r2.toFixed(3)}`);

    return {
      discriminant: d,
      rootType: 'two-distinct-real',
      root1: r1.toFixed(3),
      root2: r2.toFixed(3),
      vertex: { x: Number(vertexX.toFixed(2)), y: Number(vertexY.toFixed(2)) },
      stepByStep: steps,
    };
  } else if (d === 0) {
    const r = -coeffB / (2 * coeffA);
    steps.push(`Since Δ = 0, there is one repeated real root.`);
    steps.push(`x = -b / (2a) = ${-coeffB} / ${2 * coeffA} = ${r.toFixed(3)}`);

    return {
      discriminant: 0,
      rootType: 'one-repeated-real',
      root1: r.toFixed(3),
      root2: r.toFixed(3),
      vertex: { x: Number(vertexX.toFixed(2)), y: Number(vertexY.toFixed(2)) },
      stepByStep: steps,
    };
  } else {
    const realPart = -coeffB / (2 * coeffA);
    const imagPart = Math.sqrt(Math.abs(d)) / (2 * coeffA);
    steps.push(`Since Δ < 0, roots are complex conjugates.`);
    steps.push(`x = ${realPart.toFixed(3)} ± ${Math.abs(imagPart).toFixed(3)}i`);

    return {
      discriminant: d,
      rootType: 'two-complex',
      root1: `${realPart.toFixed(3)} + ${Math.abs(imagPart).toFixed(3)}i`,
      root2: `${realPart.toFixed(3)} - ${Math.abs(imagPart).toFixed(3)}i`,
      vertex: { x: Number(vertexX.toFixed(2)), y: Number(vertexY.toFixed(2)) },
      stepByStep: steps,
    };
  }
}
