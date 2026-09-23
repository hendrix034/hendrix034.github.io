'use client';

import { useMemo, type ReactNode } from 'react';
import { formatTime, relativeDay, startOfDay } from '../_lib/format';
import { computeStats } from '../_lib/stats';
import { statusMeta, type Application } from '../_lib/types';
import { BarList, WeeklyChart } from './Charts';
import { ClockIcon } from './icons';
import { cardClass } from './ui';

type DashboardProps = {
  applications: Application[];
  onOpen: (id: string) => void;
};

function StatTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className={`${cardClass} p-4 sm:p-5`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">{detail}</p>
    </div>
  );
}

function Panel({ title, subtitle, children, className = '' }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${cardClass} p-5 ${className}`}>
      <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Dashboard({ applications, onOpen }: DashboardProps) {
  const now = new Date();
  const stats = useMemo(() => computeStats(applications, new Date()), [applications]);
  const thisWeek = stats.weekly[stats.weekly.length - 1].count;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile
          label="Applications sent"
          value={String(stats.sent)}
          detail={`${thisWeek} this week · ${stats.wishlist} on wishlist`}
        />
        <StatTile
          label="Response rate"
          value={`${Math.round(stats.responseRate * 100)}%`}
          detail={`${stats.replied} of ${stats.sent} companies replied`}
        />
        <StatTile
          label="Reached interview"
          value={String(stats.interviewed)}
          detail={`${plural(stats.upcoming.length, 'interview')} coming up`}
        />
        <StatTile
          label="Offers"
          value={String(stats.offers)}
          detail={
            stats.avgReplyDays === null
              ? 'No replies yet'
              : `Replies take ${plural(stats.avgReplyDays, 'day')} on average`
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Applications per week" subtitle="Last 8 weeks" className="lg:col-span-2">
          <WeeklyChart data={stats.weekly} />
        </Panel>

        <Panel title="Upcoming interviews" subtitle="Scheduled and not yet done">
          {stats.upcoming.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Nothing scheduled. Add interviews from an application.</p>
          ) : (
            <ul className="space-y-2">
              {stats.upcoming.slice(0, 5).map(({ application, interview }) => {
                const date = new Date(interview.scheduledAt);
                return (
                  <li key={interview.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(application.id)}
                      className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-center leading-none text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <span>
                          <span className="block text-[10px] font-semibold uppercase">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="block text-lg font-bold">{date.getDate()}</span>
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {application.company}
                        </span>
                        <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                          {interview.type} · {formatTime(interview.scheduledAt)} · {relativeDay(startOfDay(date), now)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Pipeline" subtitle="Applications in each status">
          <BarList
            rows={stats.byStatus.map(({ status, count }) => ({
              key: status,
              label: statusMeta[status].label,
              value: count,
              marker: <span className={`h-2 w-2 shrink-0 rounded-full ${statusMeta[status].dot}`} aria-hidden="true" />,
            }))}
          />
        </Panel>

        <Panel title="Where you applied" subtitle="Applications sent per source">
          {stats.bySource.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No applications sent yet.</p>
          ) : (
            <BarList rows={stats.bySource.map(({ source, count }) => ({ key: source, label: source, value: count }))} />
          )}
        </Panel>

        <Panel title="Time to follow up" subtitle="No reply in 2 weeks or more">
          {stats.followUps.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">You are all caught up.</p>
          ) : (
            <ul className="space-y-2">
              {stats.followUps.map(({ application, days }) => (
                <li key={application.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(application.id)}
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <ClockIcon className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {application.company}
                      </span>
                      <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                        Applied {days} days ago · {application.position}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
