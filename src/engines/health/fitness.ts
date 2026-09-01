export interface FitnessInput {
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal?: 'maintain' | 'mildLoss' | 'loss' | 'gain';
}

export interface FitnessResult {
  bmi: number;
  bmiCategory: string;
  idealWeightRange: string;
  bmrCalories: number;
  tdeeCalories: number;
  targetDailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterIntakeLiters: number;
  disclaimer: string;
}

export function calculateFitness(input: FitnessInput): FitnessResult {
  const age = Math.max(10, Math.min(100, Number(input.age) || 25));
  const height = Math.max(50, Math.min(250, Number(input.heightCm) || 170));
  const weight = Math.max(20, Math.min(300, Number(input.weightKg) || 70));
  const gender = input.gender || 'male';
  const activity = input.activityLevel || 'moderate';
  const goal = input.goal || 'maintain';

  // BMI = weight (kg) / (height (m))^2
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  let category = 'Normal weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  const minIdeal = 18.5 * heightM * heightM;
  const maxIdeal = 24.9 * heightM * heightM;

  // BMR (Mifflin-St Jeor)
  // Men: 10 * weight + 6.25 * height - 5 * age + 5
  // Women: 10 * weight + 6.25 * height - 5 * age - 161
  let bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);

  // TDEE Multipliers
  const actMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  const tdee = bmr * (actMultipliers[activity] || 1.55);

  let targetCals = tdee;
  if (goal === 'mildLoss') targetCals = tdee - 250;
  else if (goal === 'loss') targetCals = tdee - 500;
  else if (goal === 'gain') targetCals = tdee + 400;

  // Macros: 30% Protein, 40% Carbs, 30% Fat
  const proteinCals = targetCals * 0.30;
  const carbsCals = targetCals * 0.40;
  const fatCals = targetCals * 0.30;

  const proteinGrams = proteinCals / 4;
  const carbsGrams = carbsCals / 4;
  const fatGrams = fatCals / 9;

  // Water: ~35ml per kg of bodyweight
  const waterLiters = (weight * 35) / 1000;

  return {
    bmi: Number(bmi.toFixed(1)),
    bmiCategory: category,
    idealWeightRange: `${minIdeal.toFixed(1)} kg - ${maxIdeal.toFixed(1)} kg`,
    bmrCalories: Math.round(bmr),
    tdeeCalories: Math.round(tdee),
    targetDailyCalories: Math.round(targetCals),
    proteinGrams: Math.round(proteinGrams),
    carbsGrams: Math.round(carbsGrams),
    fatGrams: Math.round(fatGrams),
    waterIntakeLiters: Number(waterLiters.toFixed(1)),
    disclaimer: 'Calculations are estimates for educational purposes and should not substitute professional medical or nutritional advice.',
  };
}
