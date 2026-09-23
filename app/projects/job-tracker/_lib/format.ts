const DAY_MS = 86_400_000;

const pad = (n: number) => String(n).padStart(2, '0');

/** "YYYY-MM-DD" in local time. */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DDTHH:mm" in local time, the format of <input type="datetime-local">. */
export function toLocalDateTime(date: Date): string {
  return `${toISODate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Whole calendar days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

/** Monday of the week that contains `date`. */
export function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  return addDays(day, -((day.getDay() + 6) % 7));
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const shortDateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

export const formatDate = (isoDate: string) => dateFormat.format(parseISODate(isoDate));
export const formatShortDate = (date: Date) => shortDateFormat.format(date);
export const formatDateTime = (localDateTime: string) => dateTimeFormat.format(new Date(localDateTime));
export const formatTime = (localDateTime: string) => timeFormat.format(new Date(localDateTime));

export function relativeDay(date: Date, now: Date): string {
  const diff = daysBetween(now, date);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  return diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
}

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatSalary(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return min === max ? peso.format(min) : `${peso.format(min)} – ${peso.format(max)}`;
  if (min !== null) return `${peso.format(min)}+`;
  if (max !== null) return `Up to ${peso.format(max)}`;
  return 'Not stated';
}

/** Returns the URL only if it is a plain http(s) link, so imported data can't inject `javascript:` links. */
export function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
