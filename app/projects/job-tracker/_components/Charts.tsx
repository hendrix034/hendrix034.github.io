'use client';

import { useState, type ReactNode } from 'react';

// One series per chart, so a single hue (the palette's sequential blue) with text labels.
const barColor = 'bg-[#2a78d6] dark:bg-[#3987e5]';
const barColorActive = 'bg-[#1c5cab] dark:bg-[#6da7ec]';

type WeeklyPoint = { label: string; range: string; count: number };

function niceTicks(max: number): number[] {
  const step = max <= 4 ? 1 : max <= 10 ? 2 : Math.ceil(max / 5);
  const top = Math.max(step, Math.ceil(max / step) * step);
  return Array.from({ length: top / step + 1 }, (_, i) => i * step);
}

/** Column chart of applications sent per week, with a tooltip on hover or keyboard focus. */
export function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const ticks = niceTicks(Math.max(0, ...data.map((d) => d.count)));
  const top = ticks[ticks.length - 1];
  const last = data.length - 1;

  return (
    <div className="flex gap-3">
      <div className="relative h-48 w-5 shrink-0 text-right text-xs tabular-nums text-gray-500 dark:text-gray-400">
        {ticks.map((tick) => (
          <span key={tick} className="absolute right-0 translate-y-1/2" style={{ bottom: `${(tick / top) * 100}%` }}>
            {tick}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative h-48">
          {ticks.map((tick) => (
            <div
              key={tick}
              className={`absolute inset-x-0 border-t ${
                tick === 0 ? 'border-gray-300 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800'
              }`}
              style={{ bottom: `${(tick / top) * 100}%` }}
              aria-hidden="true"
            />
          ))}
          <div className="absolute inset-0 flex">
            {data.map((point, i) => {
              const height = (point.count / top) * 100;
              const isActive = active === i;
              const noun = point.count === 1 ? 'application' : 'applications';
              return (
                <button
                  key={point.label}
                  type="button"
                  aria-label={`${point.count} ${noun}, ${point.range}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="relative flex flex-1 cursor-default items-end justify-center rounded outline-none focus-visible:bg-blue-500/10"
                >
                  <span
                    className={`w-full max-w-[24px] rounded-t transition-colors ${isActive ? barColorActive : barColor}`}
                    style={{ height: `${height}%` }}
                  />
                  {i === last && active === null && point.count > 0 && (
                    <span
                      className="absolute text-xs font-semibold text-gray-700 dark:text-gray-200"
                      style={{ bottom: `calc(${height}% + 4px)` }}
                    >
                      {point.count}
                    </span>
                  )}
                  {isActive && (
                    <span
                      className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-left text-xs text-white shadow-lg dark:bg-white dark:text-gray-900"
                      style={{ bottom: `calc(${height}% + 8px)` }}
                    >
                      <strong className="block text-sm">{point.count}</strong>
                      <span className="text-gray-300 dark:text-gray-600">
                        {noun}, {point.range}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex text-[11px] text-gray-500 dark:text-gray-400" aria-hidden="true">
          {data.map((point, i) => (
            <span
              key={point.label}
              className={`flex-1 text-center ${i === last ? 'font-semibold text-gray-700 dark:text-gray-200' : ''}`}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type BarRow = { key: string; label: string; value: number; marker?: ReactNode };

/** Horizontal bars with the value at each bar's tip. */
export function BarList({ rows }: { rows: BarRow[] }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const share = total ? Math.round((row.value / total) * 100) : 0;
        return (
          <li
            key={row.key}
            className="grid grid-cols-[8rem_1fr] items-center gap-3 text-sm"
            title={`${row.label}: ${row.value} (${share}% of total)`}
          >
            <span className="flex min-w-0 items-center gap-2 text-gray-700 dark:text-gray-300">
              {row.marker}
              <span className="truncate">{row.label}</span>
            </span>
            <span className="flex items-center gap-2">
              {row.value > 0 && (
                <span
                  className={`h-2.5 rounded-r ${barColor}`}
                  style={{ width: `calc((100% - 2.5rem) * ${row.value / max})`, minWidth: 4 }}
                />
              )}
              <span className="tabular-nums text-gray-700 dark:text-gray-200">{row.value}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
