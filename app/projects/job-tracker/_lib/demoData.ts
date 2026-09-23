import { addDays, startOfDay, toISODate, toLocalDateTime } from './format';
import type { Application, InterviewType, Source, Status, WorkSetup } from './types';

type Seed = {
  company: string;
  position: string;
  location: string;
  workSetup: WorkSetup;
  source: Source;
  salary?: [number, number];
  slug: string;
  notes: string;
  /** Status changes as [status, days ago], oldest first. The last one is the current status. */
  steps: Array<[Status, number]>;
  /** Negative `inDays` means the interview already happened. */
  interviews?: Array<{ type: InterviewType; inDays: number; hour: number; notes: string }>;
};

// Sample data for the demo. Every company here is fictional.
const seeds: Seed[] = [
  {
    company: 'Kalye Labs',
    position: 'Junior Frontend Developer',
    location: 'BGC, Taguig',
    workSetup: 'Hybrid',
    source: 'LinkedIn',
    salary: [30000, 40000],
    slug: 'kalye-labs/junior-frontend-developer',
    notes: 'Small product team building a logistics dashboard. Uses React, TypeScript, and Tailwind.',
    steps: [['applied', 18], ['interview', 12]],
    interviews: [
      { type: 'HR screening', inDays: -10, hour: 10, notes: 'Went well. Asked about notice period and salary.' },
      { type: 'Technical', inDays: 2, hour: 14, notes: 'Live coding in React. Review hooks and array methods.' },
    ],
  },
  {
    company: 'Bahaghari Software',
    position: 'React Developer',
    location: 'Remote (PH)',
    workSetup: 'Remote',
    source: 'JobStreet',
    salary: [35000, 45000],
    slug: 'bahaghari/react-developer',
    notes: 'Offer: 42k per month plus HMO from day one. Reply by Friday.',
    steps: [['applied', 25], ['interview', 20], ['offer', 3]],
    interviews: [
      { type: 'HR screening', inDays: -19, hour: 9, notes: '' },
      { type: 'Technical', inDays: -14, hour: 15, notes: 'Take-home review. They liked the tests.' },
      { type: 'Final', inDays: -7, hour: 11, notes: 'Talked with the CTO about the roadmap.' },
    ],
  },
  {
    company: 'Isla Cloud Solutions',
    position: 'Full Stack Developer (Next.js)',
    location: 'Cebu City',
    workSetup: 'Onsite',
    source: 'Kalibrr',
    salary: [28000, 38000],
    slug: 'isla-cloud/full-stack-developer',
    notes: '',
    steps: [['applied', 9]],
  },
  {
    company: 'Habagat Systems',
    position: 'Junior Software Engineer',
    location: 'Ortigas, Pasig',
    workSetup: 'Hybrid',
    source: 'Company website',
    salary: [25000, 32000],
    slug: 'habagat/junior-software-engineer',
    notes: 'Rejected after the exam. Practice SQL joins and Big-O questions.',
    steps: [['applied', 40], ['interview', 35], ['rejected', 30]],
    interviews: [{ type: 'Exam', inDays: -33, hour: 9, notes: 'Online exam: 3 algorithm problems and SQL.' }],
  },
  {
    company: 'Lakbay Tech',
    position: 'Web Developer',
    location: 'Makati',
    workSetup: 'Onsite',
    source: 'Indeed',
    salary: [22000, 28000],
    slug: 'lakbay/web-developer',
    notes: 'No reply after two follow-up emails.',
    steps: [['applied', 45], ['ghosted', 10]],
  },
  {
    company: 'Sinag Digital',
    position: 'Frontend Engineer',
    location: 'Remote (PH)',
    workSetup: 'Remote',
    source: 'Referral',
    salary: [45000, 60000],
    slug: 'sinag/frontend-engineer',
    notes: 'Referred by a former classmate. Ask about team size and code review process.',
    steps: [['applied', 6], ['interview', 2]],
    interviews: [{ type: 'HR screening', inDays: 1, hour: 10, notes: 'Video call. Prepare a 2-minute intro.' }],
  },
  {
    company: 'Bantay Health',
    position: 'Associate Software Engineer',
    location: 'Quezon City',
    workSetup: 'Hybrid',
    source: 'LinkedIn',
    salary: [30000, 35000],
    slug: 'bantay-health/associate-software-engineer',
    notes: 'Health-tech startup. Mentioned mentorship program for juniors.',
    steps: [['applied', 16]],
  },
  {
    company: 'Tanaw Analytics',
    position: 'Junior Data Visualization Developer',
    location: 'BGC, Taguig',
    workSetup: 'Hybrid',
    source: 'LinkedIn',
    salary: [32000, 42000],
    slug: 'tanaw/data-visualization-developer',
    notes: 'They went with someone who knows D3. Worth learning for next time.',
    steps: [['applied', 30], ['interview', 24], ['rejected', 15]],
    interviews: [
      { type: 'HR screening', inDays: -24, hour: 13, notes: '' },
      { type: 'Technical', inDays: -18, hour: 16, notes: 'Asked to build a small chart component.' },
    ],
  },
  {
    company: 'Agos Payments',
    position: 'Frontend Developer (React)',
    location: 'Makati',
    workSetup: 'Hybrid',
    source: 'JobStreet',
    salary: [40000, 50000],
    slug: 'agos/frontend-developer',
    notes: '',
    steps: [['applied', 3]],
  },
  {
    company: 'Dalisay Studio',
    position: 'UI Developer',
    location: 'Remote (PH)',
    workSetup: 'Remote',
    source: 'Kalibrr',
    slug: 'dalisay/ui-developer',
    notes: 'Needs a portfolio review. Apply after finishing this project.',
    steps: [['wishlist', 5]],
  },
  {
    company: 'Luntian Energy Apps',
    position: 'Junior Full Stack Developer',
    location: 'Ortigas, Pasig',
    workSetup: 'Onsite',
    source: 'Company website',
    salary: [26000, 34000],
    slug: 'luntian/junior-full-stack-developer',
    notes: '',
    steps: [['applied', 52], ['ghosted', 20]],
  },
  {
    company: 'Pulo Games',
    position: 'Web Game Developer',
    location: 'Cebu City',
    workSetup: 'Hybrid',
    source: 'Indeed',
    salary: [30000, 40000],
    slug: 'pulo-games/web-game-developer',
    notes: 'Wants Canvas or WebGL experience.',
    steps: [['wishlist', 2]],
  },
  {
    company: 'Kislap Media',
    position: 'Frontend Developer',
    location: 'Quezon City',
    workSetup: 'Onsite',
    source: 'JobStreet',
    salary: [28000, 35000],
    slug: 'kislap/frontend-developer',
    notes: '',
    steps: [['applied', 11], ['interview', 7]],
    interviews: [
      { type: 'Exam', inDays: 4, hour: 9, notes: 'Take-home: build a responsive landing page in 48 hours.' },
    ],
  },
  {
    company: 'Hiraya Fintech',
    position: 'Software Engineer I',
    location: 'BGC, Taguig',
    workSetup: 'Hybrid',
    source: 'LinkedIn',
    salary: [38000, 48000],
    slug: 'hiraya/software-engineer-1',
    notes: '',
    steps: [['applied', 1]],
  },
];

export function createDemoApplications(now: Date): Application[] {
  const today = startOfDay(now);
  const at = (daysAgo: number, hour = 9) => {
    const date = addDays(today, -daysAgo);
    date.setHours(hour);
    return toLocalDateTime(date);
  };

  return seeds.map((seed, i) => {
    const history = seed.steps.map(([status, daysAgo]) => ({ status, at: at(daysAgo) }));
    const appliedStep = seed.steps.find(([status]) => status === 'applied');
    const interviews = (seed.interviews ?? []).map((interview, j) => {
      const date = addDays(today, interview.inDays);
      date.setHours(interview.hour);
      return {
        id: `demo-${i + 1}-interview-${j + 1}`,
        type: interview.type,
        scheduledAt: toLocalDateTime(date),
        notes: interview.notes,
        done: interview.inDays < 0,
      };
    });

    return {
      id: `demo-${i + 1}`,
      company: seed.company,
      position: seed.position,
      location: seed.location,
      workSetup: seed.workSetup,
      source: seed.source,
      jobUrl: `https://jobs.example.com/${seed.slug}`,
      salaryMin: seed.salary?.[0] ?? null,
      salaryMax: seed.salary?.[1] ?? null,
      status: seed.steps[seed.steps.length - 1][0],
      appliedOn: appliedStep ? toISODate(addDays(today, -appliedStep[1])) : null,
      notes: seed.notes,
      interviews,
      history,
      createdAt: history[0].at,
      updatedAt: history[history.length - 1].at,
    };
  });
}
