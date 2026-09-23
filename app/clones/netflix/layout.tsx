import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Netflix Clone',
  description: 'A Netflix UI clone built with Next.js, TypeScript, and Tailwind CSS.',
};

export default function NetflixLayout({ children }: { children: ReactNode }) {
  return children;
}
