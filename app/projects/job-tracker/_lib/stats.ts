import { addDays, daysBetween, formatShortDate, parseISODate, startOfDay, startOfWeek } from './format';
import { SOURCES, STATUSES, type Application, type Interview, type Status } from './types';

/** Statuses that mean the company answered, whether good news or bad. */
const REPLY_STATUSES: Status[] = ['interview', 'offer', 'rejected'];
const FOLLOW_UP_AFTER_DAYS = 14;
const WEEKS_SHOWN = 8;

export type UpcomingInterview = { application: Application; interview: Interview };

/** The next interview that isn't done yet, counting any scheduled for today. */
export function nextInterview(app: Application, now: Date): Interview | undefined {
  const today = startOfDay(now);
  return app.interviews
    .filter((iv) => !iv.done && new Date(iv.scheduledAt) >= today)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
}

function firstReply(app: Application) {
  return app.history.find((change) => REPLY_STATUSES.includes(change.status));
}

export function computeStats(applications: Application[], now: Date) {
  const sent = applications.filter((app) => app.status !== 'wishlist');
  const replied = sent.filter((app) => firstReply(app) !== undefined);
  const interviewed = sent.filter((app) => app.history.some((change) => change.status === 'interview'));

  const replyDays = replied.flatMap((app) => {
    const reply = firstReply(app);
    if (!reply || !app.appliedOn) return [];
    const days = daysBetween(parseISODate(app.appliedOn), new Date(reply.at));
    return days >= 0 ? [days] : [];
  });

  const currentWeek = startOfWeek(now);
  const weekly = Array.from({ length: WEEKS_SHOWN }, (_, i) => {
    const start = addDays(currentWeek, (i - (WEEKS_SHOWN - 1)) * 7);
    const end = addDays(start, 7);
    const count = sent.filter((app) => {
      if (!app.appliedOn) return false;
      const applied = parseISODate(app.appliedOn);
      return applied >= start && applied < end;
    }).length;
    return { label: formatShortDate(start), range: `week of ${formatShortDate(start)}`, count };
  });

  const today = startOfDay(now);
  const upcoming: UpcomingInterview[] = applications
    .flatMap((application) =>
      application.interviews
        .filter((interview) => !interview.done && new Date(interview.scheduledAt) >= today)
        .map((interview) => ({ application, interview })),
    )
    .sort((a, b) => a.interview.scheduledAt.localeCompare(b.interview.scheduledAt));

  // Still "Applied" with no status change for two weeks.
  const followUps = applications
    .filter((app) => {
      if (app.status !== 'applied' || !app.appliedOn) return false;
      const lastChange = app.history[app.history.length - 1]?.at ?? app.updatedAt;
      return daysBetween(new Date(lastChange), now) >= FOLLOW_UP_AFTER_DAYS;
    })
    .map((application) => ({
      application,
      days: daysBetween(parseISODate(application.appliedOn as string), now),
    }))
    .sort((a, b) => b.days - a.days);

  return {
    sent: sent.length,
    wishlist: applications.length - sent.length,
    replied: replied.length,
    responseRate: sent.length ? replied.length / sent.length : 0,
    interviewed: interviewed.length,
    offers: applications.filter((app) => app.status === 'offer').length,
    avgReplyDays: replyDays.length
      ? Math.round(replyDays.reduce((sum, days) => sum + days, 0) / replyDays.length)
      : null,
    weekly,
    byStatus: STATUSES.map((status) => ({
      status,
      count: applications.filter((app) => app.status === status).length,
    })),
    bySource: SOURCES.map((source) => ({ source, count: sent.filter((app) => app.source === source).length }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count),
    upcoming,
    followUps,
  };
}
