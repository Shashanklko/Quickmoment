export interface DescriptiveStatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  varianceSample: number;
  variancePopulation: number;
  stdDevSample: number;
  stdDevPopulation: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  lowerOutlierBound: number;
  upperOutlierBound: number;
  outliers: number[];
  cleanedMeanWithoutOutliers: number;
  skewness: number;
  kurtosis: number;
  histogramBins: { bin: string; count: number; min: number; max: number }[];
}

export function calculateDescriptiveStats(rawNumbers: number[]): DescriptiveStatsResult {
  const nums = rawNumbers.filter(n => typeof n === 'number' && !isNaN(n)).sort((a, b) => a - b);
  const n = nums.length;

  if (n === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      mode: [],
      min: 0,
      max: 0,
      range: 0,
      varianceSample: 0,
      variancePopulation: 0,
      stdDevSample: 0,
      stdDevPopulation: 0,
      q1: 0,
      q2: 0,
      q3: 0,
      iqr: 0,
      lowerOutlierBound: 0,
      upperOutlierBound: 0,
      outliers: [],
      cleanedMeanWithoutOutliers: 0,
      skewness: 0,
      kurtosis: 0,
      histogramBins: [],
    };
  }

  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / n;

  // Median
  let median = 0;
  if (n % 2 === 1) {
    median = nums[Math.floor(n / 2)];
  } else {
    median = (nums[n / 2 - 1] + nums[n / 2]) / 2;
  }

  // Mode
  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  nums.forEach(val => {
    const f = (freqMap.get(val) || 0) + 1;
    freqMap.set(val, f);
    if (f > maxFreq) maxFreq = f;
  });

  const mode: number[] = [];
  if (maxFreq > 1) {
    freqMap.forEach((freq, val) => {
      if (freq === maxFreq) mode.push(val);
    });
  }

  const min = nums[0];
  const max = nums[n - 1];
  const range = max - min;

  // Variances & Standard Deviations
  const sumSqDiff = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  const variancePopulation = sumSqDiff / n;
  const varianceSample = n > 1 ? sumSqDiff / (n - 1) : 0;
  const stdDevPopulation = Math.sqrt(variancePopulation);
  const stdDevSample = Math.sqrt(varianceSample);

  // Percentiles / Quartiles (Tukey method)
  const getPercentile = (p: number) => {
    const index = (n - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    if (lower === upper) return nums[lower];
    return nums[lower] * (1 - weight) + nums[upper] * weight;
  };

  const q1 = getPercentile(0.25);
  const q2 = median;
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;

  // Outliers (1.5 * IQR rule)
  const lowerOutlierBound = q1 - 1.5 * iqr;
  const upperOutlierBound = q3 + 1.5 * iqr;
  const outliers = nums.filter(val => val < lowerOutlierBound || val > upperOutlierBound);
  const nonOutliers = nums.filter(val => val >= lowerOutlierBound && val <= upperOutlierBound);
  const cleanedMean = nonOutliers.length > 0 ? nonOutliers.reduce((a, b) => a + b, 0) / nonOutliers.length : mean;

  // Skewness & Kurtosis
  let m3 = 0;
  let m4 = 0;
  if (stdDevPopulation > 0) {
    m3 = nums.reduce((acc, curr) => acc + Math.pow((curr - mean) / stdDevPopulation, 3), 0) / n;
    m4 = nums.reduce((acc, curr) => acc + Math.pow((curr - mean) / stdDevPopulation, 4), 0) / n - 3;
  }

  // Histogram bins (Freedman-Diaconis or Sturges rule)
  const numBins = Math.min(10, Math.max(4, Math.ceil(1 + Math.log2(n))));
  const binWidth = range > 0 ? range / numBins : 1;
  const bins: { bin: string; count: number; min: number; max: number }[] = [];

  for (let i = 0; i < numBins; i++) {
    const bMin = min + i * binWidth;
    const bMax = i === numBins - 1 ? max + 0.0001 : min + (i + 1) * binWidth;
    const count = nums.filter(v => v >= bMin && v < bMax).length;
    bins.push({
      bin: `${bMin.toFixed(1)} - ${bMax.toFixed(1)}`,
      count,
      min: bMin,
      max: bMax,
    });
  }

  return {
    count: n,
    sum: Number(sum.toFixed(4)),
    mean: Number(mean.toFixed(4)),
    median: Number(median.toFixed(4)),
    mode: mode.map(m => Number(m.toFixed(4))),
    min,
    max,
    range: Number(range.toFixed(4)),
    varianceSample: Number(varianceSample.toFixed(4)),
    variancePopulation: Number(variancePopulation.toFixed(4)),
    stdDevSample: Number(stdDevSample.toFixed(4)),
    stdDevPopulation: Number(stdDevPopulation.toFixed(4)),
    q1: Number(q1.toFixed(4)),
    q2: Number(q2.toFixed(4)),
    q3: Number(q3.toFixed(4)),
    iqr: Number(iqr.toFixed(4)),
    lowerOutlierBound: Number(lowerOutlierBound.toFixed(4)),
    upperOutlierBound: Number(upperOutlierBound.toFixed(4)),
    outliers,
    cleanedMeanWithoutOutliers: Number(cleanedMean.toFixed(4)),
    skewness: Number(m3.toFixed(4)),
    kurtosis: Number(m4.toFixed(4)),
    histogramBins: bins,
  };
}
