'use client';

import { useEffect, useState } from 'react';
import { useSpotify } from '../_lib/SpotifyProvider';
import { LIKED_ID, type Collection } from '../data';
import { CollectionCard, QuickPick } from './Cards';

export const HOME_TINT = '#27305a';

type Filter = 'all' | Collection['kind'];

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Playlist', label: 'Playlists' },
  { id: 'Album', label: 'Albums' },
];

const quickPickIds = [
  LIKED_ID,
  'daily-mix-1',
  'opm-chill',
  'manila-nights',
  'late-night-drive',
  'orbit',
  'rainy-day',
  'weekend',
];

const sections = [
  {
    title: 'Made For You',
    ids: ['daily-mix-1', 'discover-weekly', 'release-radar', 'opm-chill', 'late-night-drive', 'deep-focus'],
  },
  {
    title: 'Popular albums',
    ids: ['orbit', 'manila-nights', 'weekend', 'corner-store', 'commute', 'shorelines', 'frequencies'],
  },
  {
    title: 'Moods and moments',
    ids: ['rainy-day', 'deep-focus', 'workout-boost', 'late-night-drive', 'opm-chill', 'daily-mix-1'],
  },
];

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeView() {
  const { getCollection } = useSpotify();
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [greeting, setGreeting] = useState('Good evening');

  // Set after mount so the server-rendered HTML matches the first client render.
  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);

  const resolve = (ids: string[]) =>
    ids
      .map((id) => getCollection(id))
      .filter((c): c is Collection => c !== undefined && (filter === 'all' || c.kind === filter));

  const quickPicks = resolve(quickPickIds);

  return (
    <div className="relative px-4 pb-4 pt-16 md:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-gradient-to-b from-[#27305a] to-transparent"
        aria-hidden="true"
      />
      <div className="relative space-y-8">
        <div className="flex gap-2 pt-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                filter === f.id ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {quickPicks.length > 0 && (
          <section>
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">{greeting}</h1>
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
              {quickPicks.map((c) => (
                <QuickPick key={c.id} collection={c} />
              ))}
            </div>
          </section>
        )}

        {sections.map((section) => {
          const items = resolve(section.ids);
          if (items.length === 0) return null;
          const isExpanded = expanded[section.title] ?? false;
          return (
            <section key={section.title}>
              <div className="mb-2 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [section.title]: !isExpanded }))}
                  className="shrink-0 text-sm font-bold text-[#b3b3b3] hover:underline"
                >
                  {isExpanded ? 'Show less' : 'Show all'}
                </button>
              </div>
              {/* Collapsed: only the first grid row is visible, like Spotify's shelves. */}
              <div
                className={`-mx-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${
                  isExpanded ? '' : 'auto-rows-[0] grid-rows-[auto] overflow-hidden'
                }`}
              >
                {items.map((c) => (
                  <CollectionCard key={c.id} collection={c} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
