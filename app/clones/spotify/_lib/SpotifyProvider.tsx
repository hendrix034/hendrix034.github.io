'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { collectionById, LIKED_ID, likedCollection, type Collection } from '../data';
import { usePlayer } from './usePlayer';

export type View =
  | { kind: 'home' }
  | { kind: 'search' }
  | { kind: 'library' }
  | { kind: 'collection'; id: string };

const LIKED_KEY = 'spotify-clone:liked';
const DEFAULT_LIKED = [
  'golden-hour-traffic',
  'tala',
  'ulan-sa-edsa',
  'sunday-silog',
  'low-tide',
  'satellite-heart',
  'monsoon-letters',
];
const DEFAULT_CONTEXT = 'daily-mix-1';

function sameView(a: View, b: View): boolean {
  if (a.kind !== b.kind) return false;
  return a.kind !== 'collection' || (b.kind === 'collection' && a.id === b.id);
}

function useSpotifyState() {
  const [nav, setNav] = useState<{ stack: View[]; index: number }>({
    stack: [{ kind: 'home' }],
    index: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [liked, setLiked] = useState<string[]>(DEFAULT_LIKED);
  const player = usePlayer(DEFAULT_CONTEXT, collectionById(DEFAULT_CONTEXT)?.trackIds ?? []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LIKED_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) {
        setLiked(parsed.filter((id): id is string => typeof id === 'string'));
      }
    } catch {
      // Storage can be blocked (e.g. private mode); keep the defaults.
    }
  }, []);

  const navigate = useCallback((view: View) => {
    setNav(({ stack, index }) =>
      sameView(stack[index], view)
        ? { stack, index }
        : { stack: [...stack.slice(0, index + 1), view], index: index + 1 },
    );
  }, []);
  const goBack = useCallback(() => setNav((n) => ({ ...n, index: Math.max(0, n.index - 1) })), []);
  const goForward = useCallback(
    () => setNav((n) => ({ ...n, index: Math.min(n.stack.length - 1, n.index + 1) })),
    [],
  );
  const resetNav = useCallback((stack: View[]) => setNav({ stack, index: stack.length - 1 }), []);

  const toggleLike = useCallback((trackId: string) => {
    setLiked((prev) => {
      const next = prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [trackId, ...prev];
      try {
        window.localStorage.setItem(LIKED_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors; likes still work for this visit.
      }
      return next;
    });
  }, []);

  const getCollection = (id: string): Collection | undefined =>
    id === LIKED_ID ? likedCollection(liked) : collectionById(id);

  /** Plays a playlist or album, or toggles it if it is already the current one. */
  const playCollection = (id: string, trackId?: string) => {
    const collection = getCollection(id);
    if (!collection || collection.trackIds.length === 0) return;
    if (player.contextId === id && (!trackId || trackId === player.track?.id)) {
      player.togglePlay();
      return;
    }
    const start = trackId
      ? collection.trackIds.indexOf(trackId)
      : player.shuffle
        ? Math.floor(Math.random() * collection.trackIds.length)
        : 0;
    player.playQueue(id, collection.trackIds, Math.max(start, 0));
  };

  return {
    view: nav.stack[nav.index],
    canGoBack: nav.index > 0,
    canGoForward: nav.index < nav.stack.length - 1,
    navigate,
    goBack,
    goForward,
    resetNav,
    searchQuery,
    setSearchQuery,
    liked,
    isLiked: (trackId: string) => liked.includes(trackId),
    toggleLike,
    getCollection,
    playCollection,
    player,
  };
}

type SpotifyState = ReturnType<typeof useSpotifyState>;

const SpotifyContext = createContext<SpotifyState | null>(null);

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const value = useSpotifyState();
  return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>;
}

export function useSpotify(): SpotifyState {
  const context = useContext(SpotifyContext);
  if (!context) throw new Error('useSpotify must be used inside <SpotifyProvider>');
  return context;
}
