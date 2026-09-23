'use client';

import { useMemo, useState } from 'react';
import { formatDate, formatSalary } from '../_lib/format';
import { STATUSES, WORK_SETUPS, statusMeta, type Application, type Status, type WorkSetup } from '../_lib/types';
import { SearchIcon } from './icons';
import { StatusBadge, cardClass, inputClass } from './ui';

type SortKey = 'newest' | 'oldest' | 'company' | 'salary';

const sortOptions: { id: SortKey; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'company', label: 'Company A–Z' },
  { id: 'salary', label: 'Highest salary' },
];

/** The date used for sorting: when it was applied, or when it was saved for wishlist items. */
const sortDate = (app: Application) => app.appliedOn ?? app.createdAt.slice(0, 10);

type ApplicationListProps = {
  applications: Application[];
  onOpen: (id: string) => void;
};

export default function ApplicationList({ applications, onOpen }: ApplicationListProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [setup, setSetup] = useState<WorkSetup | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = applications.filter(
      (app) =>
        (status === 'all' || app.status === status) &&
        (setup === 'all' || app.workSetup === setup) &&
        (!q || [app.company, app.position, app.location, app.notes].some((v) => v.toLowerCase().includes(q))),
    );
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return sortDate(b).localeCompare(sortDate(a));
        case 'oldest':
          return sortDate(a).localeCompare(sortDate(b));
        case 'company':
          return a.company.localeCompare(b.company);
        case 'salary':
          return (b.salaryMax ?? b.salaryMin ?? -1) - (a.salaryMax ?? a.salaryMin ?? -1);
      }
    });
  }, [applications, query, status, setup, sort]);

  const selectClass = `${inputClass} sm:w-auto`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative sm:w-72">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, role, location"
            aria-label="Search applications"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status | 'all')}
          aria-label="Filter by status"
          className={selectClass}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusMeta[s].label}
            </option>
          ))}
        </select>
        <select
          value={setup}
          onChange={(e) => setSetup(e.target.value as WorkSetup | 'all')}
          aria-label="Filter by work setup"
          className={selectClass}
        >
          <option value="all">Any setup</option>
          {WORK_SETUPS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort applications"
          className={selectClass}
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 dark:text-gray-400 sm:ml-auto" aria-live="polite">
          Showing {rows.length} of {applications.length}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className={`${cardClass} p-10 text-center text-sm text-gray-500 dark:text-gray-400`}>
          No applications match these filters.
        </div>
      ) : (
        <div className={`${cardClass} overflow-hidden`}>
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Company and role</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Location</th>
                <th scope="col" className="px-4 py-3 font-medium">Salary</th>
                <th scope="col" className="px-4 py-3 font-medium">Source</th>
                <th scope="col" className="px-4 py-3 font-medium">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => onOpen(app.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(app.id);
                      }}
                      className="text-left font-semibold text-gray-900 hover:underline dark:text-white"
                    >
                      {app.company}
                    </button>
                    <p className="text-gray-500 dark:text-gray-400">{app.position}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {app.location || '—'}
                    <p className="text-xs text-gray-400">{app.workSetup}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600 dark:text-gray-300">
                    {formatSalary(app.salaryMin, app.salaryMax)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{app.source}</td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600 dark:text-gray-300">
                    {app.appliedOn ? formatDate(app.appliedOn) : 'Not yet'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            {rows.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => onOpen(app.id)}
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-gray-900 dark:text-white">{app.company}</span>
                    <span className="block truncate text-sm text-gray-500 dark:text-gray-400">{app.position}</span>
                    <span className="mt-1 block text-xs text-gray-400">
                      {app.appliedOn ? `Applied ${formatDate(app.appliedOn)}` : 'Not applied yet'} ·{' '}
                      {formatSalary(app.salaryMin, app.salaryMax)}
                    </span>
                  </span>
                  <StatusBadge status={app.status} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
