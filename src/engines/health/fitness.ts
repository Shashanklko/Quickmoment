export interface FitnessInput {
  unitSystem?: 'metric' | 'imperial';
  age: number;
  gender: 'male' | 'female';
  heightCm?: number;
  heightFeet?: number;
  heightInches?: number;
  weightKg?: number;
  weightLbs?: number;
  bodyFatPercent?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal?: 'maintain' | 'mildLoss' | 'loss' | 'extremeLoss' | 'mildGain' | 'gain';
  macroPreference?: 'balanced' | 'highProtein' | 'keto' | 'highCarb';
}

export interface FitnessResult {
  bmi: number;
  bmiCategory: string;
  bmiPrime: number;
  heightCm: number;
  heightFormatted: string;
  weightKg: number;
  weightFormatted: string;
  idealWeightRangeKg: string;
  idealWeightRangeLbs: string;
  bmrCalories: number;
  katchBmrCalories?: number;
  tdeeCalories: number;
  targetDailyCalories: number;
  calorieDelta: number;
  goalLabel: string;
  proteinGrams: number;
  proteinCalories: number;
  proteinPercent: number;
  carbsGrams: number;
  carbsCalories: number;
  carbsPercent: number;
  fatGrams: number;
  fatCalories: number;
  fatPercent: number;
  waterIntakeLiters: number;
  waterIntakeOz: number;
  leanMassKg?: number;
  leanMassLbs?: number;
  fatMassKg?: number;
  fatMassLbs?: number;
  heartRateZones: {
    maxHeartRate: number;
    fatBurnRange: string;
    aerobicRange: string;
    peakRange: string;
  };
  disclaimer: string;
}

export function calculateFitness(input: FitnessInput): FitnessResult {
  const unitSystem = input.unitSystem || 'metric';
  const age = Math.max(10, Math.min(100, Number(input.age) || 26));
  const gender = input.gender || 'male';
  const activity = input.activityLevel || 'moderate';
  const goal = input.goal || 'maintain';
  const macroPref = input.macroPreference || 'balanced';

  // 1. Resolve Height in cm & formatted string
  let heightCm = 175;
  let heightFormatted = '175 cm (5 ft 9 in)';
  if (unitSystem === 'imperial') {
    const feet = Math.max(3, Math.min(7, Number(input.heightFeet) || 5));
    const inches = Math.max(0, Math.min(11.9, Number(input.heightInches) || 9));
    const totalInches = feet * 12 + inches;
    heightCm = totalInches * 2.54;
    heightFormatted = `${feet} ft ${Math.round(inches)} in (${Math.round(heightCm)} cm)`;
  } else {
    heightCm = Math.max(100, Math.min(240, Number(input.heightCm) || 175));
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    heightFormatted = `${Math.round(heightCm)} cm (${feet} ft ${inches} in)`;
  }

  // 2. Resolve Weight in kg & formatted string
  let weightKg = 72;
  let weightFormatted = '72 kg (158.7 lbs)';
  if (unitSystem === 'imperial') {
    const lbs = Math.max(50, Math.min(600, Number(input.weightLbs) || 160));
    weightKg = lbs * 0.45359237;
    weightFormatted = `${lbs} lbs (${weightKg.toFixed(1)} kg)`;
  } else {
    weightKg = Math.max(25, Math.min(300, Number(input.weightKg) || 72));
    const lbs = weightKg * 2.20462;
    weightFormatted = `${weightKg.toFixed(1)} kg (${lbs.toFixed(1)} lbs)`;
  }

  // 3. BMI Calculation = weight(kg) / (height(m))^2
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const bmiPrime = bmi / 25; // Ratio to upper normal limit

  let category = 'Normal weight';
  if (bmi < 16) category = 'Severe Thinness';
  else if (bmi < 17) category = 'Moderate Thinness';
  else if (bmi < 18.5) category = 'Mild Thinness (Underweight)';
  else if (bmi < 25) category = 'Normal Healthy Weight';
  else if (bmi < 30) category = 'Overweight (Pre-obese)';
  else if (bmi < 35) category = 'Obese Class I';
  else if (bmi < 40) category = 'Obese Class II';
  else category = 'Obese Class III (Severe)';

  // 4. Ideal Weight Range (WHO BMI 18.5 - 24.9)
  const minIdealKg = 18.5 * heightM * heightM;
  const maxIdealKg = 24.9 * heightM * heightM;
  const minIdealLbs = minIdealKg * 2.20462;
  const maxIdealLbs = maxIdealKg * 2.20462;

  // 5. BMR (Mifflin-St Jeor)
  // Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
  // Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);

  // Optional Katch-McArdle BMR if body fat % provided
  let katchBmr: number | undefined;
  let leanMassKg: number | undefined;
  let leanMassLbs: number | undefined;
  let fatMassKg: number | undefined;
  let fatMassLbs: number | undefined;

  const bodyFat = Number(input.bodyFatPercent);
  if (!isNaN(bodyFat) && bodyFat > 3 && bodyFat < 60) {
    leanMassKg = weightKg * (1 - bodyFat / 100);
    leanMassLbs = leanMassKg * 2.20462;
    fatMassKg = weightKg * (bodyFat / 100);
    fatMassLbs = fatMassKg * 2.20462;
    katchBmr = Math.round(370 + 21.6 * leanMassKg);
  }

  // 6. TDEE (Total Daily Energy Expenditure) Multipliers
  const actMultipliers: Record<string, number> = {
    sedentary: 1.2, // Desk job, little to no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Hard exercise 6-7 days/week
    veryActive: 1.9, // Very hard training & physical job
  };
  const tdee = bmr * (actMultipliers[activity] || 1.55);

  // 7. Target Caloric Goal
  let calorieDelta = 0;
  let goalLabel = 'Maintain Current Weight';
  if (goal === 'mildLoss') {
    calorieDelta = -250;
    goalLabel = 'Mild Weight Loss (-0.25 kg / 0.55 lb per week)';
  } else if (goal === 'loss') {
    calorieDelta = -500;
    goalLabel = 'Standard Fat Loss (-0.5 kg / 1.1 lb per week)';
  } else if (goal === 'extremeLoss') {
    calorieDelta = -750;
    goalLabel = 'Intense Deficit (-0.75 kg / 1.65 lb per week)';
  } else if (goal === 'mildGain') {
    calorieDelta = +250;
    goalLabel = 'Lean Muscle Gain (+0.25 kg / 0.55 lb per week)';
  } else if (goal === 'gain') {
    calorieDelta = +500;
    goalLabel = 'Hypertrophy Bulking (+0.5 kg / 1.1 lb per week)';
  }

  const targetDailyCalories = Math.max(1200, Math.round(tdee + calorieDelta));

  // 8. Macronutrient Target Splits
  let pRatio = 0.3;
  let cRatio = 0.45;
  let fRatio = 0.25;

  if (macroPref === 'highProtein') {
    pRatio = 0.4;
    cRatio = 0.35;
    fRatio = 0.25;
  } else if (macroPref === 'keto') {
    pRatio = 0.25;
    cRatio = 0.05;
    fRatio = 0.7;
  } else if (macroPref === 'highCarb') {
    pRatio = 0.2;
    cRatio = 0.6;
    fRatio = 0.2;
  }

  const proteinCalories = Math.round(targetDailyCalories * pRatio);
  const carbsCalories = Math.round(targetDailyCalories * cRatio);
  const fatCalories = Math.round(targetDailyCalories * fRatio);

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  // 9. Water Intake (35ml per kg of bodyweight + activity bonus)
  const actWaterBonus = activity === 'active' || activity === 'veryActive' ? 0.6 : 0.2;
  const waterLiters = (weightKg * 35) / 1000 + actWaterBonus;
  const waterOz = waterLiters * 33.814;

  // 10. Heart Rate Training Zones (Tanaka formula: 208 - 0.7 * age)
  const maxHeartRate = Math.round(208 - 0.7 * age);
  const fatBurnMin = Math.round(maxHeartRate * 0.6);
  const fatBurnMax = Math.round(maxHeartRate * 0.7);
  const aerobicMin = Math.round(maxHeartRate * 0.7);
  const aerobicMax = Math.round(maxHeartRate * 0.85);
  const peakMin = Math.round(maxHeartRate * 0.85);
  const peakMax = maxHeartRate;

  return {
    bmi: Number(bmi.toFixed(1)),
    bmiCategory: category,
    bmiPrime: Number(bmiPrime.toFixed(2)),
    heightCm: Math.round(heightCm),
    heightFormatted,
    weightKg: Number(weightKg.toFixed(1)),
    weightFormatted,
    idealWeightRangeKg: `${minIdealKg.toFixed(1)} - ${maxIdealKg.toFixed(1)} kg`,
    idealWeightRangeLbs: `${minIdealLbs.toFixed(1)} - ${maxIdealLbs.toFixed(1)} lbs`,
    bmrCalories: Math.round(bmr),
    katchBmrCalories: katchBmr,
    tdeeCalories: Math.round(tdee),
    targetDailyCalories,
    calorieDelta,
    goalLabel,
    proteinGrams,
    proteinCalories,
    proteinPercent: Math.round(pRatio * 100),
    carbsGrams,
    carbsCalories,
    carbsPercent: Math.round(cRatio * 100),
    fatGrams,
    fatCalories,
    fatPercent: Math.round(fRatio * 100),
    waterIntakeLiters: Number(waterLiters.toFixed(1)),
    waterIntakeOz: Math.round(waterOz),
    leanMassKg: leanMassKg ? Number(leanMassKg.toFixed(1)) : undefined,
    leanMassLbs: leanMassLbs ? Number(leanMassLbs.toFixed(1)) : undefined,
    fatMassKg: fatMassKg ? Number(fatMassKg.toFixed(1)) : undefined,
    fatMassLbs: fatMassLbs ? Number(fatMassLbs.toFixed(1)) : undefined,
    heartRateZones: {
      maxHeartRate,
      fatBurnRange: `${fatBurnMin} - ${fatBurnMax} BPM`,
      aerobicRange: `${aerobicMin} - ${aerobicMax} BPM`,
      peakRange: `${peakMin} - ${peakMax} BPM`,
    },
    disclaimer:
      'Calculations are mathematical estimates for educational & fitness planning purposes. Consult certified healthcare or nutrition professionals for tailored medical advice.',
  };
}
