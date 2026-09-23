'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HomeIcon, LibraryIcon, SearchIcon } from '../_shared/icons';
import CollectionView from './_components/CollectionView';
import HomeView, { HOME_TINT } from './_components/HomeView';
import PlayerBar from './_components/PlayerBar';
import SearchView from './_components/SearchView';
import Sidebar, { LibraryView } from './_components/Sidebar';
import TopBar from './_components/TopBar';
import { SpotifyProvider, useSpotify } from './_lib/SpotifyProvider';

export default function SpotifyClonePage() {
  return (
    <SpotifyProvider>
      <SpotifyApp />
    </SpotifyProvider>
  );
}

function SpotifyApp() {
  const { view, resetNav, setSearchQuery, getCollection, playCollection, player } = useSpotify();
  const { togglePlay, isPlaying, track } = player;
  const mainRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Deep links: ?collection=opm-chill (&play=1), ?search=luna, ?view=library
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const collectionId = params.get('collection');
    const search = params.get('search');
    if (collectionId && getCollection(collectionId)) {
      resetNav([{ kind: 'home' }, { kind: 'collection', id: collectionId }]);
      if (params.get('play') === '1') playCollection(collectionId);
    } else if (search !== null) {
      setSearchQuery(search);
      resetNav([{ kind: 'home' }, { kind: 'search' }]);
    } else if (params.get('view') === 'library') {
      resetNav([{ kind: 'home' }, { kind: 'library' }]);
    }
    // Runs once on mount; later changes come from in-app navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setScrolled(false);
  }, [view]);

  // Space toggles playback unless a control or text field has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      if (e.target instanceof Element && e.target.closest('input, textarea, select, button, a')) return;
      e.preventDefault();
      togglePlay();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay]);

  useEffect(() => {
    document.title = isPlaying && track ? `${track.title} • ${track.artist}` : 'Spotify Clone';
  }, [isPlaying, track]);

  const tint =
    view.kind === 'collection'
      ? getCollection(view.id)?.palette[0] ?? '#121212'
      : view.kind === 'home'
        ? HOME_TINT
        : '#121212';

  return (
    <div className="flex h-dvh flex-col gap-2 bg-black font-sans text-white md:p-2 md:pb-0">
      <div className="flex min-h-0 flex-1 gap-2">
        <Sidebar />
        <main
          ref={mainRef}
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 48)}
          className="relative min-w-0 flex-1 overflow-y-auto bg-[#121212] md:rounded-lg"
        >
          <TopBar scrolled={scrolled} tint={tint} />
          <div className="-mt-16">
            {view.kind === 'home' && <HomeView />}
            {view.kind === 'search' && <SearchView />}
            {view.kind === 'library' && <LibraryView />}
            {view.kind === 'collection' && <CollectionView key={view.id} id={view.id} />}
            <MainFooter />
          </div>
        </main>
      </div>
      <PlayerBar />
      <MobileNav />
    </div>
  );
}

function MobileNav() {
  const { view, navigate } = useSpotify();
  const items = [
    { kind: 'home', label: 'Home', Icon: HomeIcon },
    { kind: 'search', label: 'Search', Icon: SearchIcon },
    { kind: 'library', label: 'Your Library', Icon: LibraryIcon },
  ] as const;

  return (
    <nav className="grid grid-cols-3 bg-black pb-2 md:hidden" aria-label="Main">
      {items.map(({ kind, label, Icon }) => (
        <button
          key={kind}
          type="button"
          onClick={() => navigate({ kind })}
          aria-current={view.kind === kind ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 py-1 text-[11px] ${
            view.kind === kind ? 'text-white' : 'text-[#b3b3b3]'
          }`}
        >
          <Icon className="h-6 w-6" />
          {label}
        </button>
      ))}
    </nav>
  );
}

function MainFooter() {
  return (
    <footer className="mx-4 mt-8 border-t border-white/10 py-8 text-sm text-[#b3b3b3] md:mx-6">
      <p>
        Spotify UI clone built for learning purposes with Next.js, TypeScript, and Tailwind CSS.
        Not affiliated with Spotify. All artists, songs, and artwork are fictional, and playback is
        simulated.
      </p>
      <Link href="/?open=projects" className="mt-3 inline-block font-semibold text-white hover:underline">
        ← Back to portfolio
      </Link>
    </footer>
  );
}
