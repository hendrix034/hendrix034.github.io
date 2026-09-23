export const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected', 'ghosted'] as const;
export type Status = (typeof STATUSES)[number];

export const WORK_SETUPS = ['Onsite', 'Hybrid', 'Remote'] as const;
export type WorkSetup = (typeof WORK_SETUPS)[number];

export const SOURCES = [
  'LinkedIn',
  'JobStreet',
  'Kalibrr',
  'Indeed',
  'Company website',
  'Referral',
  'Other',
] as const;
export type Source = (typeof SOURCES)[number];

export const INTERVIEW_TYPES = ['HR screening', 'Technical', 'Exam', 'Final'] as const;
export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export type Interview = {
  id: string;
  type: InterviewType;
  /** Local date-time, e.g. "2026-09-25T14:00" (the datetime-local input format). */
  scheduledAt: string;
  notes: string;
  done: boolean;
};

export type StatusChange = {
  status: Status;
  /** Local date-time of the change. */
  at: string;
};

export type Application = {
  id: string;
  company: string;
  position: string;
  location: string;
  workSetup: WorkSetup;
  source: Source;
  jobUrl: string;
  /** Monthly salary in PHP. */
  salaryMin: number | null;
  salaryMax: number | null;
  status: Status;
  /** Date only, e.g. "2026-09-08". Null while the job is still on the wishlist. */
  appliedOn: string | null;
  notes: string;
  interviews: Interview[];
  history: StatusChange[];
  createdAt: string;
  updatedAt: string;
};

/** The fields a person fills in on the add/edit form. */
export type ApplicationInput = Pick<
  Application,
  | 'company'
  | 'position'
  | 'location'
  | 'workSetup'
  | 'source'
  | 'jobUrl'
  | 'salaryMin'
  | 'salaryMax'
  | 'status'
  | 'appliedOn'
  | 'notes'
>;

export const statusMeta: Record<Status, { label: string; badge: string; dot: string }> = {
  wishlist: {
    label: 'Wishlist',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    dot: 'bg-gray-400',
  },
  applied: {
    label: 'Applied',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  interview: {
    label: 'Interview',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  offer: {
    label: 'Offer',
    badge: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    dot: 'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    badge: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    dot: 'bg-red-500',
  },
  ghosted: {
    label: 'Ghosted',
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-500',
  },
};
