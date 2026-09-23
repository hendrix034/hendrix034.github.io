'use client';

import { useState } from 'react';
import { formatShortDate, parseISODate, relativeDay } from '../_lib/format';
import { nextInterview } from '../_lib/stats';
import { useJobs } from '../_lib/store';
import { STATUSES, statusMeta, type Application, type Status } from '../_lib/types';
import { CalendarIcon, MapPinIcon } from './icons';

type BoardProps = {
  applications: Application[];
  onOpen: (id: string) => void;
};

/**
 * Kanban board. Cards are dragged between columns with native HTML drag and drop;
 * keyboard and touch users change the status from the details panel instead.
 */
export default function Board({ applications, onOpen }: BoardProps) {
  const { setStatus } = useJobs();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<Status | null>(null);
  const now = new Date();

  const endDrag = () => {
    setDraggingId(null);
    setOverStatus(null);
  };

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Drag a card to another column to update its status, or open it to change the status there.
      </p>
      <div className="grid min-w-max auto-cols-[260px] grid-flow-col gap-4 xl:min-w-0 xl:auto-cols-fr">
        {STATUSES.map((status) => {
          const meta = statusMeta[status];
          const items = applications
            .filter((app) => app.status === status)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
          const isTarget = draggingId !== null && overStatus === status;

          return (
            <section
              key={status}
              aria-label={`${meta.label}, ${items.length} ${items.length === 1 ? 'application' : 'applications'}`}
              onDragOver={(e) => {
                if (!draggingId) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (overStatus !== status) setOverStatus(status);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOverStatus(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || draggingId;
                if (id) setStatus(id, status);
                endDrag();
              }}
              className={`flex min-h-[440px] flex-col rounded-xl border p-3 transition-colors ${
                isTarget
                  ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40'
                  : 'border-gray-200 bg-gray-100/80 dark:border-gray-800 dark:bg-gray-900/60'
              }`}
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden="true" />
                  {meta.label}
                </h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  {items.length}
                </span>
              </header>

              <ul className="flex flex-1 flex-col gap-2">
                {items.map((app) => {
                  const upcoming = nextInterview(app, now);
                  return (
                    <li
                      key={app.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', app.id);
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggingId(app.id);
                      }}
                      onDragEnd={endDrag}
                      className={`relative cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500 hover:border-gray-300 hover:shadow active:cursor-grabbing dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 ${
                        draggingId === app.id ? 'opacity-40' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onOpen(app.id)}
                        className="block w-full truncate text-left text-sm font-semibold text-gray-900 outline-none after:absolute after:inset-0 dark:text-white"
                      >
                        {app.company}
                      </button>
                      <p className="mt-0.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{app.position}</p>
                      <p className="mt-2 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
                        <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                        {app.location || 'No location'} · {app.workSetup}
                      </p>
                      {upcoming && (
                        <p className="mt-2 flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {upcoming.type} · {formatShortDate(new Date(upcoming.scheduledAt))}
                          </span>
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {app.appliedOn
                          ? `Applied ${relativeDay(parseISODate(app.appliedOn), now)}`
                          : 'Not applied yet'}
                      </p>
                    </li>
                  );
                })}
                {items.length === 0 && (
                  <li className="grid flex-1 place-items-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
                    Nothing here yet
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
