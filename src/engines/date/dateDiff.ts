export interface DateDiffInput {
  startDate: string;
  endDate: string;
  includeEndDay?: boolean;
}

export interface DateDiffResult {
  calendarDays: number;
  businessDays: number;
  weekendDays: number;
  weeksAndDays: string;
  totalHours: number;
}

export function calculateDateDiff(input: DateDiffInput): DateDiffResult {
  const d1 = new Date(input.startDate || '2025-01-01');
  const d2 = new Date(input.endDate || '2025-12-31');

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return {
      calendarDays: 0,
      businessDays: 0,
      weekendDays: 0,
      weeksAndDays: '0 days',
      totalHours: 0,
    };
  }

  const start = d1 < d2 ? new Date(d1) : new Date(d2);
  const end = d1 < d2 ? new Date(d2) : new Date(d1);

  let cur = new Date(start);
  let calDays = 0;
  let bizDays = 0;
  let weekends = 0;

  while (cur < end) {
    const day = cur.getDay();
    if (day === 0 || day === 6) {
      weekends++;
    } else {
      bizDays++;
    }
    calDays++;
    cur.setDate(cur.getDate() + 1);
  }

  if (input.includeEndDay) {
    const day = end.getDay();
    if (day === 0 || day === 6) weekends++;
    else bizDays++;
    calDays++;
  }

  const weeks = Math.floor(calDays / 7);
  const remDays = calDays % 7;
  const weeksAndDays = `${weeks} weeks, ${remDays} days`;

  return {
    calendarDays: calDays,
    businessDays: bizDays,
    weekendDays: weekends,
    weeksAndDays,
    totalHours: calDays * 24,
  };
}
