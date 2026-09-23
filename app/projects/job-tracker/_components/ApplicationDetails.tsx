'use client';

import { useState, type FormEvent } from 'react';
import {
  addDays,
  formatDate,
  formatDateTime,
  formatSalary,
  parseISODate,
  relativeDay,
  safeHttpUrl,
  startOfDay,
  toLocalDateTime,
} from '../_lib/format';
import { useJobs } from '../_lib/store';
import { INTERVIEW_TYPES, STATUSES, statusMeta, type Application, type InterviewType, type Status } from '../_lib/types';
import Dialog from './Dialog';
import { CalendarIcon, ExternalLinkIcon, PencilIcon, TrashIcon } from './icons';
import {
  StatusBadge,
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './ui';

/** Tomorrow at 10:00 AM, as a starting value for new interviews. */
function defaultInterviewTime(): string {
  const date = addDays(startOfDay(new Date()), 1);
  date.setHours(10);
  return toLocalDateTime(date);
}

const sectionTitle = 'mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400';

type ApplicationDetailsProps = {
  application: Application;
  onEdit: () => void;
  onClose: () => void;
};

export default function ApplicationDetails({ application: app, onEdit, onClose }: ApplicationDetailsProps) {
  const { setStatus, addInterview, toggleInterview, removeInterview, removeApplication } = useJobs();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<{ type: InterviewType; scheduledAt: string; notes: string }>(() => ({
    type: 'HR screening',
    scheduledAt: defaultInterviewTime(),
    notes: '',
  }));
  const [draftError, setDraftError] = useState('');

  const now = new Date();
  const jobUrl = safeHttpUrl(app.jobUrl);
  const interviews = [...app.interviews].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  const handleAddInterview = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.scheduledAt) {
      setDraftError('Choose a date and time.');
      return;
    }
    addInterview(app.id, { type: draft.type, scheduledAt: draft.scheduledAt, notes: draft.notes.trim() });
    setDraft({ type: draft.type, scheduledAt: defaultInterviewTime(), notes: '' });
    setDraftError('');
  };

  const details: Array<[string, string]> = [
    ['Location', app.location || 'Not set'],
    ['Work setup', app.workSetup],
    ['Salary', formatSalary(app.salaryMin, app.salaryMax)],
    ['Source', app.source],
    [
      'Applied',
      app.appliedOn
        ? `${formatDate(app.appliedOn)} (${relativeDay(parseISODate(app.appliedOn), now)})`
        : 'Not yet',
    ],
    ['Last update', formatDateTime(app.updatedAt)],
  ];

  return (
    <Dialog variant="side" title={app.company} description={app.position} onClose={onClose}>
      <div className="space-y-7 p-5">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge status={app.status} />
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            Move to
            <select
              value={app.status}
              onChange={(e) => setStatus(app.id, e.target.value as Status)}
              className={`${inputClass} w-auto py-1.5`}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusMeta[status].label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {details.map(([term, value]) => (
              <div key={term}>
                <dt className="text-gray-500 dark:text-gray-400">{term}</dt>
                <dd className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">{value}</dd>
              </div>
            ))}
          </dl>
          {jobUrl && (
            <a
              href={jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              View job post
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          )}
        </section>

        {app.notes && (
          <section>
            <h3 className={sectionTitle}>Notes</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">{app.notes}</p>
          </section>
        )}

        <section>
          <h3 className={sectionTitle}>Interviews</h3>
          {interviews.length === 0 ? (
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">No interviews scheduled yet.</p>
          ) : (
            <ul className="mb-4 space-y-2">
              {interviews.map((interview) => (
                <li
                  key={interview.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={interview.done}
                    onChange={() => toggleInterview(app.id, interview.id)}
                    aria-label={`Mark ${interview.type} interview as ${interview.done ? 'not done' : 'done'}`}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    <p
                      className={`font-medium ${
                        interview.done ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {interview.type}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {formatDateTime(interview.scheduledAt)}
                    </p>
                    {interview.notes && <p className="mt-1 text-gray-600 dark:text-gray-400">{interview.notes}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInterview(app.id, interview.id)}
                    aria-label={`Remove ${interview.type} interview`}
                    className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={handleAddInterview}
            className="space-y-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-950"
            aria-label="Schedule an interview"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="interview-type" className={labelClass}>
                  Type
                </label>
                <select
                  id="interview-type"
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value as InterviewType })}
                  className={inputClass}
                >
                  {INTERVIEW_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="interview-time" className={labelClass}>
                  Date and time
                </label>
                <input
                  id="interview-time"
                  type="datetime-local"
                  value={draft.scheduledAt}
                  onChange={(e) => {
                    setDraft({ ...draft, scheduledAt: e.target.value });
                    setDraftError('');
                  }}
                  aria-invalid={draftError ? true : undefined}
                  aria-describedby={draftError ? 'interview-time-error' : undefined}
                  className={inputClass}
                />
                {draftError && (
                  <p id="interview-time-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {draftError}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="interview-notes" className={labelClass}>
                Notes
              </label>
              <input
                id="interview-notes"
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                className={inputClass}
                placeholder="Who you'll meet, what to prepare"
              />
            </div>
            <button type="submit" className={secondaryButtonClass}>
              Add interview
            </button>
          </form>
        </section>

        <section>
          <h3 className={sectionTitle}>Timeline</h3>
          <ol className="relative space-y-3 border-l border-gray-200 pl-5 dark:border-gray-800">
            {[...app.history].reverse().map((change, index) => (
              <li key={`${change.at}-${index}`} className="relative text-sm">
                <span
                  className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full ring-4 ring-white dark:ring-gray-900 ${
                    statusMeta[change.status].dot
                  }`}
                  aria-hidden="true"
                />
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {index === app.history.length - 1
                    ? `Added as ${statusMeta[change.status].label}`
                    : `Moved to ${statusMeta[change.status].label}`}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{formatDateTime(change.at)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-5 dark:border-gray-800">
          {confirmDelete ? (
            <>
              <p className="mr-auto text-sm text-gray-700 dark:text-gray-300">Delete this application for good?</p>
              <button type="button" onClick={() => setConfirmDelete(false)} className={secondaryButtonClass}>
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  removeApplication(app.id);
                  onClose();
                }}
                className={dangerButtonClass}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={onEdit} className={primaryButtonClass}>
                <PencilIcon className="h-4 w-4" />
                Edit details
              </button>
              <button type="button" onClick={() => setConfirmDelete(true)} className={secondaryButtonClass}>
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </section>
      </div>
    </Dialog>
  );
}
