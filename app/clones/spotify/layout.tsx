import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'A Spotify web player UI clone built with Next.js, TypeScript, and Tailwind CSS.',
};

export default function SpotifyLayout({ children }: { children: ReactNode }) {
  return children;
}
