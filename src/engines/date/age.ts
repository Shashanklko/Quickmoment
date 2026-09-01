export interface AgeInput {
  birthDate: string; // YYYY-MM-DD
  targetDate?: string; // YYYY-MM-DD, defaults to today
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthdayCountdownDays: number;
  dayOfWeekBorn: string;
  zodiacSign: string;
}

export function calculateAge(input: AgeInput): AgeResult {
  const birth = new Date(input.birthDate || '2000-01-01');
  const target = input.targetDate ? new Date(input.targetDate) : new Date();

  if (isNaN(birth.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalWeeks: 0,
      totalHours: 0,
      totalMinutes: 0,
      nextBirthdayCountdownDays: 0,
      dayOfWeekBorn: 'Unknown',
      zodiacSign: 'Unknown',
    };
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month of target
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = Math.max(0, target.getTime() - birth.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Next birthday calculation
  let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday.getTime() < target.getTime()) {
    nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const nextBirthdayCountdownDays = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = daysOfWeek[birth.getDay()];

  // Zodiac Sign
  const bMonth = birth.getMonth() + 1;
  const bDay = birth.getDate();
  let zodiac = 'Aries';

  if ((bMonth === 3 && bDay >= 21) || (bMonth === 4 && bDay <= 19)) zodiac = 'Aries ♈';
  else if ((bMonth === 4 && bDay >= 20) || (bMonth === 5 && bDay <= 20)) zodiac = 'Taurus ♉';
  else if ((bMonth === 5 && bDay >= 21) || (bMonth === 6 && bDay <= 20)) zodiac = 'Gemini ♊';
  else if ((bMonth === 6 && bDay >= 21) || (bMonth === 7 && bDay <= 22)) zodiac = 'Cancer ♋';
  else if ((bMonth === 7 && bDay >= 23) || (bMonth === 8 && bDay <= 22)) zodiac = 'Leo ♌';
  else if ((bMonth === 8 && bDay >= 23) || (bMonth === 9 && bDay <= 22)) zodiac = 'Virgo ♍';
  else if ((bMonth === 9 && bDay >= 23) || (bMonth === 10 && bDay <= 22)) zodiac = 'Libra ♎';
  else if ((bMonth === 10 && bDay >= 23) || (bMonth === 11 && bDay <= 21)) zodiac = 'Scorpio ♏';
  else if ((bMonth === 11 && bDay >= 22) || (bMonth === 12 && bDay <= 21)) zodiac = 'Sagittarius ♐';
  else if ((bMonth === 12 && bDay >= 22) || (bMonth === 1 && bDay <= 19)) zodiac = 'Capricorn ♑';
  else if ((bMonth === 1 && bDay >= 20) || (bMonth === 2 && bDay <= 18)) zodiac = 'Aquarius ♒';
  else zodiac = 'Pisces ♓';

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    nextBirthdayCountdownDays,
    dayOfWeekBorn,
    zodiacSign: zodiac,
  };
}
