import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'JobTrack · Job Application Tracker',
  description:
    'Track job applications from wishlist to offer with a kanban board, interview schedule, and dashboard.',
};

export default function JobTrackerLayout({ children }: { children: ReactNode }) {
  return children;
}
