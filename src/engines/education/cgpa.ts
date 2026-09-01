export interface CgpaInput {
  cgpa: number;
  gradingScale?: 10 | 4 | 5; // default 10 (CBSE/Indian standard: CGPA * 9.5)
  formulaType?: 'cbse' | 'standard' | 'mumbai' | 'anna';
}

export interface CgpaResult {
  cgpa: number;
  percentage: number;
  gradeClassification: string;
  fourPointEquivalent: number;
  formulaExplanation: string;
}

export function calculateCgpa(input: CgpaInput): CgpaResult {
  const cgpa = Math.max(0, Math.min(10, Number(input.cgpa) || 8.0));
  const scale = input.gradingScale || 10;
  const formula = input.formulaType || 'cbse';

  let percentage = 0;
  let formulaDesc = '';

  if (scale === 10) {
    if (formula === 'cbse') {
      percentage = cgpa * 9.5;
      formulaDesc = 'Percentage = CGPA × 9.5 (Standard CBSE / AICTE formula)';
    } else if (formula === 'mumbai') {
      percentage = 7.1 * cgpa + 11;
      formulaDesc = 'Percentage = 7.1 × CGPA + 11 (Mumbai University formula)';
    } else if (formula === 'anna') {
      percentage = cgpa * 10;
      formulaDesc = 'Percentage = CGPA × 10 (Anna University formula)';
    } else {
      percentage = (cgpa / 10) * 100;
      formulaDesc = 'Percentage = (CGPA / 10) × 100';
    }
  } else if (scale === 4) {
    percentage = (cgpa / 4) * 100;
    formulaDesc = 'Percentage = (GPA / 4.0) × 100 (US 4.0 Scale)';
  } else {
    percentage = (cgpa / 5) * 100;
    formulaDesc = 'Percentage = (GPA / 5.0) × 100';
  }

  percentage = Math.max(0, Math.min(100, percentage));

  let classification = 'First Class with Distinction';
  if (percentage < 40) classification = 'Fail / Unsatisfactory';
  else if (percentage < 50) classification = 'Third Division / Pass';
  else if (percentage < 60) classification = 'Second Division';
  else if (percentage < 75) classification = 'First Division';

  const fourPointEquiv = (percentage / 100) * 4.0;

  return {
    cgpa,
    percentage: Number(percentage.toFixed(2)),
    gradeClassification: classification,
    fourPointEquivalent: Number(fourPointEquiv.toFixed(2)),
    formulaExplanation: formulaDesc,
  };
}
