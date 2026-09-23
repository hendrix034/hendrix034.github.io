'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import { HomeIcon, LibraryIcon, SearchIcon, VolumeIcon } from '../../_shared/icons';
import { useSpotify } from '../_lib/SpotifyProvider';
import { collections, LIKED_ID, type Collection } from '../data';
import Cover from './Cover';

type LibraryFilter = 'all' | Collection['kind'];

export function SpotifyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="12" fill="#1ed760" />
      <g fill="none" stroke="#000" strokeLinecap="round">
        <path d="M6 9.2c4-1.2 8.6-.9 12 1" strokeWidth="1.8" />
        <path d="M6.8 12.5c3.3-.9 7-.6 9.8.9" strokeWidth="1.5" />
        <path d="M7.5 15.6c2.6-.7 5.4-.4 7.6.8" strokeWidth="1.3" />
      </g>
    </svg>
  );
}

export function LibraryList() {
  const { view, navigate, player, getCollection, liked } = useSpotify();
  const [filter, setFilter] = useState<LibraryFilter>('all');

  const likedSongs = getCollection(LIKED_ID);
  const items = [...(likedSongs ? [likedSongs] : []), ...collections].filter(
    (c) => filter === 'all' || c.kind === filter,
  );

  return (
    <>
      <div className="flex gap-2 px-4 pb-3">
        {(['Playlist', 'Album'] as const).map((kind) => {
          const active = filter === kind;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setFilter(active ? 'all' : kind)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                active ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {kind}s
            </button>
          );
        })}
      </div>
      <ul className="space-y-0.5 px-2 pb-2">
        {items.map((c) => {
          const selected = view.kind === 'collection' && view.id === c.id;
          const current = player.contextId === c.id;
          const subtitle =
            c.id === LIKED_ID ? `Playlist • ${liked.length} songs` : `${c.kind} • ${c.owner}`;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => navigate({ kind: 'collection', id: c.id })}
                aria-current={selected ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors ${
                  selected ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <Cover collection={c} className="h-12 w-12 shrink-0 rounded" />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate ${current ? 'text-[#1ed760]' : 'text-white'}`}>
                    {c.name}
                  </span>
                  <span className="block truncate text-sm text-[#b3b3b3]">{subtitle}</span>
                </span>
                {current && player.isPlaying && (
                  <VolumeIcon className="h-4 w-4 shrink-0 text-[#1ed760]" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function LibraryView() {
  return (
    <div className="pt-20">
      <h1 className="flex items-center gap-3 px-4 pb-4 text-2xl font-bold">
        <LibraryIcon className="h-6 w-6" />
        Your Library
      </h1>
      <LibraryList />
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex w-full items-center gap-5 rounded-md px-3 py-2 font-bold transition-colors ${
        active ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
      }`}
    >
      <Icon className="h-6 w-6" strokeWidth={active ? 2.6 : 2} />
      {label}
    </button>
  );
}

export default function Sidebar() {
  const { view, navigate } = useSpotify();

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col gap-2 md:flex lg:w-[340px]">
      <nav className="space-y-1 rounded-lg bg-[#121212] px-3 py-4" aria-label="Main">
        <div className="flex items-center gap-2 px-3 pb-3">
          <SpotifyLogo className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Spotify</span>
        </div>
        <NavItem
          icon={HomeIcon}
          label="Home"
          active={view.kind === 'home'}
          onClick={() => navigate({ kind: 'home' })}
        />
        <NavItem
          icon={SearchIcon}
          label="Search"
          active={view.kind === 'search'}
          onClick={() => navigate({ kind: 'search' })}
        />
      </nav>
      <section className="flex min-h-0 flex-1 flex-col rounded-lg bg-[#121212]" aria-label="Your Library">
        <h2 className="flex items-center gap-3 px-4 pb-3 pt-4 font-bold text-[#b3b3b3]">
          <LibraryIcon className="h-6 w-6" />
          Your Library
        </h2>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <LibraryList />
        </div>
      </section>
    </aside>
  );
}
