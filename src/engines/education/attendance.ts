export interface AttendanceInput {
  totalClassesHeld: number;
  classesAttended: number;
  targetPercentage?: number; // default 75%
  upcomingClassesPlanned?: number;
}

export interface AttendanceResult {
  currentPercentage: number;
  targetPercentage: number;
  classesAttended: number;
  totalClassesHeld: number;
  classesMissed: number;
  status: 'safe' | 'warning' | 'shortage';
  classesNeededToReachTarget: number;
  allowedBunksWhileSafe: number;
  scenarioAnalysis: string;
}

export function calculateAttendance(input: AttendanceInput): AttendanceResult {
  const attended = Math.max(0, Number(input.classesAttended) || 0);
  const totalHeld = Math.max(attended, Number(input.totalClassesHeld) || 0);
  const target = Math.max(1, Math.min(100, Number(input.targetPercentage) || 75));
  const upcoming = Math.max(0, Number(input.upcomingClassesPlanned) || 0);

  const missed = Math.max(0, totalHeld - attended);
  const currentPct = totalHeld > 0 ? (attended / totalHeld) * 100 : 100;

  // Case 1: Attendance is currently below target
  // We need X more consecutive attended classes such that:
  // (attended + X) / (totalHeld + X) >= target / 100
  // attended + X >= (target/100)*totalHeld + (target/100)*X
  // X * (1 - target/100) >= (target/100)*totalHeld - attended
  let classesNeeded = 0;
  if (currentPct < target) {
    const numerator = (target / 100) * totalHeld - attended;
    const denominator = 1 - (target / 100);
    classesNeeded = denominator > 0 ? Math.ceil(numerator / denominator) : 0;
  }

  // Case 2: Attendance is currently above target
  // How many classes Y can you miss right now without dropping below target?
  // attended / (totalHeld + Y) >= target / 100
  // totalHeld + Y <= attended / (target/100)
  // Y <= attended / (target/100) - totalHeld
  let allowedBunks = 0;
  if (currentPct >= target) {
    allowedBunks = Math.floor(attended / (target / 100) - totalHeld);
    if (allowedBunks < 0) allowedBunks = 0;
  }

  let status: 'safe' | 'warning' | 'shortage' = 'safe';
  if (currentPct < target) {
    status = 'shortage';
  } else if (currentPct < target + 5) {
    status = 'warning';
  }

  let scenario = '';
  if (currentPct >= target) {
    scenario = `You are safe! You can afford to bunk ${allowedBunks} more classes and still maintain at least ${target}% attendance.`;
  } else {
    scenario = `You need to attend the next ${classesNeeded} consecutive classes without missing any to reach ${target}%.`;
    if (upcoming > 0) {
      if (classesNeeded <= upcoming) {
        scenario += ` With ${upcoming} classes remaining, this goal is achievable!`;
      } else {
        scenario += ` With only ${upcoming} classes remaining, maximum achievable attendance is ${((attended + upcoming) / (totalHeld + upcoming) * 100).toFixed(1)}%.`;
      }
    }
  }

  return {
    currentPercentage: Number(currentPct.toFixed(1)),
    targetPercentage: target,
    classesAttended: attended,
    totalClassesHeld: totalHeld,
    classesMissed: missed,
    status,
    classesNeededToReachTarget: classesNeeded,
    allowedBunksWhileSafe: allowedBunks,
    scenarioAnalysis: scenario,
  };
}
