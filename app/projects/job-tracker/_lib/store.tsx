'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { createDemoApplications } from './demoData';
import { safeHttpUrl, toLocalDateTime } from './format';
import {
  INTERVIEW_TYPES,
  SOURCES,
  STATUSES,
  WORK_SETUPS,
  type Application,
  type ApplicationInput,
  type Interview,
  type InterviewType,
  type Status,
  type StatusChange,
} from './types';

const STORAGE_KEY = 'job-tracker:v1';

type Data = { applications: Application[]; isDemo: boolean };

type Action =
  | { type: 'load'; data: Data }
  | { type: 'add'; application: Application }
  | { type: 'update'; id: string; input: ApplicationInput; at: string }
  | { type: 'remove'; id: string }
  | { type: 'setStatus'; id: string; status: Status; at: string }
  | { type: 'addInterview'; id: string; interview: Interview; at: string }
  | { type: 'toggleInterview'; id: string; interviewId: string; at: string }
  | { type: 'removeInterview'; id: string; interviewId: string; at: string };

/** Moves an application to a new status and records the change in its history. */
function withStatus(app: Application, status: Status, at: string): Application {
  if (app.status === status) return app;
  return {
    ...app,
    status,
    appliedOn: app.appliedOn ?? (status === 'wishlist' ? null : at.slice(0, 10)),
    history: [...app.history, { status, at }],
    updatedAt: at,
  };
}

function reducer(state: Data | null, action: Action): Data | null {
  if (action.type === 'load') return action.data;
  if (!state) return state;

  const updateOne = (id: string, change: (app: Application) => Application): Data => ({
    ...state,
    applications: state.applications.map((app) => (app.id === id ? change(app) : app)),
  });

  switch (action.type) {
    case 'add':
      return { ...state, applications: [action.application, ...state.applications] };
    case 'update':
      return updateOne(action.id, (app) =>
        withStatus({ ...app, ...action.input, status: app.status, updatedAt: action.at }, action.input.status, action.at),
      );
    case 'remove':
      return { ...state, applications: state.applications.filter((app) => app.id !== action.id) };
    case 'setStatus':
      return updateOne(action.id, (app) => withStatus(app, action.status, action.at));
    case 'addInterview':
      return updateOne(action.id, (app) => ({
        ...app,
        interviews: [...app.interviews, action.interview],
        updatedAt: action.at,
      }));
    case 'toggleInterview':
      return updateOne(action.id, (app) => ({
        ...app,
        interviews: app.interviews.map((iv) => (iv.id === action.interviewId ? { ...iv, done: !iv.done } : iv)),
        updatedAt: action.at,
      }));
    case 'removeInterview':
      return updateOne(action.id, (app) => ({
        ...app,
        interviews: app.interviews.filter((iv) => iv.id !== action.interviewId),
        updatedAt: action.at,
      }));
  }
}

// --- Parsing stored or imported JSON --------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const text = (value: unknown) => (typeof value === 'string' ? value : '');
const amount = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

function parseInterview(value: unknown): Interview[] {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.scheduledAt !== 'string') return [];
  return [
    {
      id: value.id,
      type: oneOf<InterviewType>(value.type, INTERVIEW_TYPES, 'HR screening'),
      scheduledAt: value.scheduledAt,
      notes: text(value.notes),
      done: value.done === true,
    },
  ];
}

function parseStatusChange(value: unknown): StatusChange[] {
  if (!isRecord(value) || typeof value.at !== 'string' || !STATUSES.includes(value.status as Status)) return [];
  return [{ status: value.status as Status, at: value.at }];
}

/** Accepts either an exported file ({ applications: [...] }) or a bare array. Returns null if invalid. */
function parseApplications(value: unknown): Application[] | null {
  const list = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.applications)
      ? value.applications
      : null;
  if (!list) return null;

  const applications: Application[] = [];
  for (const item of list) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.company !== 'string' ||
      typeof item.position !== 'string' ||
      !STATUSES.includes(item.status as Status)
    ) {
      return null;
    }
    const createdAt = text(item.createdAt);
    applications.push({
      id: item.id,
      company: item.company,
      position: item.position,
      location: text(item.location),
      workSetup: oneOf(item.workSetup, WORK_SETUPS, 'Onsite'),
      source: oneOf(item.source, SOURCES, 'Other'),
      jobUrl: safeHttpUrl(text(item.jobUrl)) ?? '',
      salaryMin: amount(item.salaryMin),
      salaryMax: amount(item.salaryMax),
      status: item.status as Status,
      appliedOn: typeof item.appliedOn === 'string' ? item.appliedOn : null,
      notes: text(item.notes),
      interviews: Array.isArray(item.interviews) ? item.interviews.flatMap(parseInterview) : [],
      history: Array.isArray(item.history) ? item.history.flatMap(parseStatusChange) : [],
      createdAt,
      updatedAt: text(item.updatedAt) || createdAt,
    });
  }
  return applications;
}

// --- Store ----------------------------------------------------------------

const now = () => toLocalDateTime(new Date());
const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function useJobState() {
  const [data, dispatch] = useReducer(reducer, null);

  // Load once on the client. First-time visitors get the sample data.
  useEffect(() => {
    let stored: Data | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        const applications = parseApplications(parsed);
        if (applications) {
          stored = { applications, isDemo: isRecord(parsed) && parsed.isDemo === true };
        }
      }
    } catch {
      // Unreadable or blocked storage: fall back to the sample data.
    }
    dispatch({
      type: 'load',
      data: stored ?? { applications: createDemoApplications(new Date()), isDemo: true },
    });
  }, []);

  // Save after every change.
  useEffect(() => {
    if (!data) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
    } catch {
      // Storage full or blocked; the data still works until the tab closes.
    }
  }, [data]);

  const addApplication = useCallback((input: ApplicationInput): string => {
    const at = now();
    const id = newId('app');
    dispatch({
      type: 'add',
      application: {
        ...input,
        id,
        appliedOn: input.appliedOn ?? (input.status === 'wishlist' ? null : at.slice(0, 10)),
        interviews: [],
        history: [{ status: input.status, at }],
        createdAt: at,
        updatedAt: at,
      },
    });
    return id;
  }, []);

  const updateApplication = useCallback((id: string, input: ApplicationInput) => {
    dispatch({ type: 'update', id, input, at: now() });
  }, []);

  const removeApplication = useCallback((id: string) => dispatch({ type: 'remove', id }), []);

  const setStatus = useCallback((id: string, status: Status) => {
    dispatch({ type: 'setStatus', id, status, at: now() });
  }, []);

  const addInterview = useCallback((id: string, interview: Omit<Interview, 'id' | 'done'>) => {
    dispatch({ type: 'addInterview', id, interview: { ...interview, id: newId('interview'), done: false }, at: now() });
  }, []);

  const toggleInterview = useCallback((id: string, interviewId: string) => {
    dispatch({ type: 'toggleInterview', id, interviewId, at: now() });
  }, []);

  const removeInterview = useCallback((id: string, interviewId: string) => {
    dispatch({ type: 'removeInterview', id, interviewId, at: now() });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: 'load', data: { applications: createDemoApplications(new Date()), isDemo: true } });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'load', data: { applications: [], isDemo: false } });
  }, []);

  const exportJson = useCallback(
    () => JSON.stringify({ version: 1, exportedAt: now(), applications: data?.applications ?? [] }, null, 2),
    [data],
  );

  /** Replaces all data with the file's contents. Returns the number imported, or null if the file is invalid. */
  const importJson = useCallback((json: string): number | null => {
    try {
      const applications = parseApplications(JSON.parse(json));
      if (!applications) return null;
      dispatch({ type: 'load', data: { applications, isDemo: false } });
      return applications.length;
    } catch {
      return null;
    }
  }, []);

  return useMemo(
    () => ({
      loaded: data !== null,
      applications: data?.applications ?? [],
      isDemo: data?.isDemo ?? false,
      addApplication,
      updateApplication,
      removeApplication,
      setStatus,
      addInterview,
      toggleInterview,
      removeInterview,
      resetDemo,
      clearAll,
      exportJson,
      importJson,
    }),
    [
      data,
      addApplication,
      updateApplication,
      removeApplication,
      setStatus,
      addInterview,
      toggleInterview,
      removeInterview,
      resetDemo,
      clearAll,
      exportJson,
      importJson,
    ],
  );
}

type JobStore = ReturnType<typeof useJobState>;

const JobsContext = createContext<JobStore | null>(null);

export function JobsProvider({ children }: { children: ReactNode }) {
  const store = useJobState();
  return <JobsContext.Provider value={store}>{children}</JobsContext.Provider>;
}

export function useJobs(): JobStore {
  const store = useContext(JobsContext);
  if (!store) throw new Error('useJobs must be used inside <JobsProvider>');
  return store;
}
