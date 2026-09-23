'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { safeHttpUrl, toISODate } from '../_lib/format';
import {
  SOURCES,
  STATUSES,
  WORK_SETUPS,
  statusMeta,
  type Application,
  type ApplicationInput,
  type Source,
  type Status,
  type WorkSetup,
} from '../_lib/types';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from './ui';

type FormState = {
  company: string;
  position: string;
  location: string;
  workSetup: WorkSetup;
  source: Source;
  jobUrl: string;
  salaryMin: string;
  salaryMax: string;
  status: Status;
  appliedOn: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const FIELD_ORDER: (keyof FormState)[] = [
  'company',
  'position',
  'location',
  'workSetup',
  'source',
  'status',
  'appliedOn',
  'jobUrl',
  'salaryMin',
  'salaryMax',
  'notes',
];

function toFormState(app?: Application): FormState {
  return {
    company: app?.company ?? '',
    position: app?.position ?? '',
    location: app?.location ?? '',
    workSetup: app?.workSetup ?? 'Onsite',
    source: app?.source ?? 'LinkedIn',
    jobUrl: app?.jobUrl ?? '',
    salaryMin: app?.salaryMin?.toString() ?? '',
    salaryMax: app?.salaryMax?.toString() ?? '',
    status: app?.status ?? 'applied',
    appliedOn: app ? (app.appliedOn ?? '') : toISODate(new Date()),
    notes: app?.notes ?? '',
  };
}

function parseAmount(value: string): number | null | 'invalid' {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 'invalid';
}

function validate(form: FormState): { errors: Errors; input?: ApplicationInput } {
  const errors: Errors = {};
  if (!form.company.trim()) errors.company = 'Enter the company name.';
  if (!form.position.trim()) errors.position = 'Enter the job title.';
  if (form.jobUrl.trim() && !safeHttpUrl(form.jobUrl.trim())) {
    errors.jobUrl = 'Enter a full link that starts with https://';
  }
  const min = parseAmount(form.salaryMin);
  const max = parseAmount(form.salaryMax);
  if (min === 'invalid') errors.salaryMin = 'Enter an amount of 0 or more.';
  if (max === 'invalid') errors.salaryMax = 'Enter an amount of 0 or more.';
  if (typeof min === 'number' && typeof max === 'number' && min > max) {
    errors.salaryMax = 'The maximum should be at least the minimum.';
  }
  if (form.status !== 'wishlist' && !form.appliedOn) errors.appliedOn = 'Add the date you applied.';

  if (Object.keys(errors).length > 0 || min === 'invalid' || max === 'invalid') return { errors };
  return {
    errors,
    input: {
      company: form.company.trim(),
      position: form.position.trim(),
      location: form.location.trim(),
      workSetup: form.workSetup,
      source: form.source,
      jobUrl: form.jobUrl.trim(),
      salaryMin: min,
      salaryMax: max,
      status: form.status,
      appliedOn: form.appliedOn || null,
      notes: form.notes.trim(),
    },
  };
}

function Field({
  id,
  label,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type ApplicationFormProps = {
  application?: Application;
  onSubmit: (input: ApplicationInput) => void;
  onCancel: () => void;
};

export default function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(application));
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Props shared by every input: id, error wiring for screen readers.
  const fieldProps = (key: keyof FormState) => ({
    id: `job-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `job-${key}-error` : undefined,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validate(form);
    setErrors(result.errors);
    if (result.input) {
      onSubmit(result.input);
      return;
    }
    const firstInvalid = FIELD_ORDER.find((key) => result.errors[key]);
    if (firstInvalid) document.getElementById(`job-${firstInvalid}`)?.focus();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-full flex-col">
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field id="job-company" label="Company" error={errors.company}>
          <input
            {...fieldProps('company')}
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            className={inputClass}
            autoComplete="organization"
            placeholder="e.g. Kalye Labs"
          />
        </Field>
        <Field id="job-position" label="Job title" error={errors.position}>
          <input
            {...fieldProps('position')}
            value={form.position}
            onChange={(e) => set('position', e.target.value)}
            className={inputClass}
            placeholder="e.g. Junior Frontend Developer"
          />
        </Field>
        <Field id="job-location" label="Location" error={errors.location}>
          <input
            {...fieldProps('location')}
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            className={inputClass}
            placeholder="e.g. BGC, Taguig"
          />
        </Field>
        <Field id="job-workSetup" label="Work setup">
          <select
            {...fieldProps('workSetup')}
            value={form.workSetup}
            onChange={(e) => set('workSetup', e.target.value as WorkSetup)}
            className={inputClass}
          >
            {WORK_SETUPS.map((setup) => (
              <option key={setup}>{setup}</option>
            ))}
          </select>
        </Field>
        <Field id="job-source" label="Where you found it">
          <select
            {...fieldProps('source')}
            value={form.source}
            onChange={(e) => set('source', e.target.value as Source)}
            className={inputClass}
          >
            {SOURCES.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </Field>
        <Field id="job-status" label="Status">
          <select
            {...fieldProps('status')}
            value={form.status}
            onChange={(e) => set('status', e.target.value as Status)}
            className={inputClass}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusMeta[status].label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="job-appliedOn" label="Date applied" error={errors.appliedOn}>
          <input
            {...fieldProps('appliedOn')}
            type="date"
            value={form.appliedOn}
            onChange={(e) => set('appliedOn', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="job-jobUrl" label="Job post link" error={errors.jobUrl}>
          <input
            {...fieldProps('jobUrl')}
            type="url"
            value={form.jobUrl}
            onChange={(e) => set('jobUrl', e.target.value)}
            className={inputClass}
            placeholder="https://"
          />
        </Field>
        <Field id="job-salaryMin" label="Salary from (₱ per month)" error={errors.salaryMin}>
          <input
            {...fieldProps('salaryMin')}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={form.salaryMin}
            onChange={(e) => set('salaryMin', e.target.value)}
            className={inputClass}
            placeholder="30000"
          />
        </Field>
        <Field id="job-salaryMax" label="Salary to (₱ per month)" error={errors.salaryMax}>
          <input
            {...fieldProps('salaryMax')}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={form.salaryMax}
            onChange={(e) => set('salaryMax', e.target.value)}
            className={inputClass}
            placeholder="40000"
          />
        </Field>
        <Field id="job-notes" label="Notes" className="sm:col-span-2">
          <textarea
            {...fieldProps('notes')}
            rows={4}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className={inputClass}
            placeholder="Contact person, requirements, what to prepare..."
          />
        </Field>
      </div>

      <div className="sticky bottom-0 mt-auto flex justify-end gap-2 border-t border-gray-200 bg-white px-5 py-3 dark:border-gray-800 dark:bg-gray-900">
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <button type="submit" className={primaryButtonClass}>
          {application ? 'Save changes' : 'Add application'}
        </button>
      </div>
    </form>
  );
}
