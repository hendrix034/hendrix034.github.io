'use client';

import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, SearchIcon } from '../../_shared/icons';
import { useSpotify } from '../_lib/SpotifyProvider';
import { PlayButton } from './Cards';

type TopBarProps = {
  /** True once the main panel has scrolled, which fills the bar with the page color. */
  scrolled: boolean;
  tint: string;
};

export default function TopBar({ scrolled, tint }: TopBarProps) {
  const { view, canGoBack, canGoForward, goBack, goForward, searchQuery, setSearchQuery, getCollection } =
    useSpotify();
  const collection = view.kind === 'collection' ? getCollection(view.id) : undefined;

  const navButton =
    'hidden h-8 w-8 shrink-0 place-items-center rounded-full bg-black/70 transition disabled:cursor-not-allowed disabled:opacity-50 sm:grid';

  return (
    <div className="sticky top-0 z-30 h-16">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: tint }}
      >
        <div className="h-full w-full bg-black/40" />
      </div>

      <div className="relative flex h-full items-center gap-2 px-4 md:px-6">
        <button type="button" onClick={goBack} disabled={!canGoBack} aria-label="Go back" className={navButton}>
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button type="button" onClick={goForward} disabled={!canGoForward} aria-label="Go forward" className={navButton}>
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        {view.kind === 'search' && (
          <label className="flex h-11 w-full max-w-[364px] items-center gap-2 rounded-full bg-[#242424] px-3 ring-white transition focus-within:ring-2 hover:bg-[#2a2a2a] sm:ml-1">
            <SearchIcon className="h-5 w-5 shrink-0 text-[#b3b3b3]" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to play?"
              aria-label="Search songs, artists, albums, and playlists"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#b3b3b3]"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <CloseIcon className="h-5 w-5 text-[#b3b3b3] hover:text-white" />
              </button>
            )}
          </label>
        )}

        {collection && (
          <div
            className={`ml-2 flex min-w-0 items-center gap-3 transition-opacity duration-300 ${
              scrolled ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!scrolled}
          >
            <PlayButton collectionId={collection.id} className="shrink-0" />
            <span className="truncate text-xl font-bold">{collection.name}</span>
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/?open=projects"
            className="hidden whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-sm font-bold text-black transition hover:scale-105 sm:inline-block"
          >
            Back to portfolio
          </Link>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-black/70 p-1" aria-hidden="true">
            <span className="h-full w-full rounded-full bg-gradient-to-br from-pink-500 to-orange-400" />
          </span>
        </div>
      </div>
    </div>
  );
}
