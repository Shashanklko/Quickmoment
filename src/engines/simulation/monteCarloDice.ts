export interface DiceSimulationInput {
  numberOfDice: number;
  targetSum: number;
  numberOfRolls: number;
}

export interface DiceSimulationResult {
  simulatedProbability: number;
  theoreticalProbability: number;
  differencePercent: number;
  totalRolls: number;
  targetHits: number;
  sumFrequencies: { sum: number; count: number; probability: number }[];
}

export function runDiceSimulation(input: DiceSimulationInput): DiceSimulationResult {
  const numDice = Math.max(1, Math.min(6, Math.round(Number(input.numberOfDice) || 2)));
  const targetSum = Math.max(numDice, Math.min(numDice * 6, Math.round(Number(input.targetSum) || 7)));
  const numRolls = Math.max(500, Math.min(200000, Math.round(Number(input.numberOfRolls) || 10000)));

  const minSum = numDice;
  const maxSum = numDice * 6;
  const sumCounts: number[] = new Array(maxSum + 1).fill(0);

  let targetHits = 0;
  for (let i = 0; i < numRolls; i++) {
    let currentSum = 0;
    for (let d = 0; d < numDice; d++) {
      currentSum += Math.floor(Math.random() * 6) + 1;
    }
    sumCounts[currentSum]++;
    if (currentSum === targetSum) {
      targetHits++;
    }
  }

  // Exact theoretical probability using polynomial expansion or recursion
  function getExactWays(dice: number, target: number): number {
    if (dice === 0) return target === 0 ? 1 : 0;
    if (target < dice || target > dice * 6) return 0;
    let ways = 0;
    for (let face = 1; face <= 6; face++) {
      ways += getExactWays(dice - 1, target - face);
    }
    return ways;
  }

  const totalPossibleCombinations = Math.pow(6, numDice);
  const exactWays = getExactWays(numDice, targetSum);
  const theoreticalProb = (exactWays / totalPossibleCombinations) * 100;
  const simulatedProb = (targetHits / numRolls) * 100;

  const sumFrequencies = [];
  for (let s = minSum; s <= maxSum; s++) {
    sumFrequencies.push({
      sum: s,
      count: sumCounts[s],
      probability: Number(((sumCounts[s] / numRolls) * 100).toFixed(2)),
    });
  }

  return {
    simulatedProbability: Number(simulatedProb.toFixed(3)),
    theoreticalProbability: Number(theoreticalProb.toFixed(3)),
    differencePercent: Number(Math.abs(simulatedProb - theoreticalProb).toFixed(3)),
    totalRolls: numRolls,
    targetHits,
    sumFrequencies,
  };
}
