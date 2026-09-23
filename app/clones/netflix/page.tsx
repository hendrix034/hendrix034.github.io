'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Billboard from './_components/Billboard';
import Navbar from './_components/Navbar';
import Player from './_components/Player';
import TitleModal from './_components/TitleModal';
import TitleRow, { TitleCard } from './_components/TitleRow';
import {
  featuredByTab,
  genreRows,
  isTab,
  rankOrder,
  titleById,
  titles,
  type Tab,
  type Title,
} from './data';

const MY_LIST_KEY = 'netflix-clone:my-list';
const DEFAULT_MY_LIST = ['orbiters', 'midnight-jeepney', 'wild-coast'];

type Row = { id: string; heading: string; items: Title[]; ranked?: boolean };

function topTen(pool: Title[]): Title[] {
  return rankOrder
    .map(titleById)
    .filter((title): title is Title => title !== undefined && pool.includes(title))
    .slice(0, 10);
}

function buildRows(tab: Tab, myList: Title[]): Row[] {
  const byMatch = (a: Title, b: Title) => b.match - a.match;

  if (tab === 'new') {
    return [
      { id: 'new', heading: 'New on Netflix', items: titles.filter((t) => t.year === 2026).sort(byMatch) },
      {
        id: 'top-shows',
        heading: 'Top 10 TV Shows in the Philippines Today',
        items: topTen(titles.filter((t) => t.kind === 'Series')),
        ranked: true,
      },
      {
        id: 'top-movies',
        heading: 'Top 10 Movies in the Philippines Today',
        items: topTen(titles.filter((t) => t.kind === 'Movie')),
        ranked: true,
      },
      { id: 'last-year', heading: 'Released Last Year', items: titles.filter((t) => t.year === 2025).sort(byMatch) },
    ];
  }

  const pool =
    tab === 'shows'
      ? titles.filter((t) => t.kind === 'Series')
      : tab === 'movies'
        ? titles.filter((t) => t.kind === 'Movie')
        : titles;
  const scope = tab === 'shows' ? 'TV Shows ' : tab === 'movies' ? 'Movies ' : '';

  const rows: Row[] = [
    { id: 'trending', heading: 'Trending Now', items: pool.filter((t) => t.year >= 2025).sort(byMatch) },
    { id: 'top-10', heading: `Top 10 ${scope}in the Philippines Today`, items: topTen(pool), ranked: true },
  ];

  const saved = myList.filter((t) => pool.includes(t));
  if (saved.length > 0) rows.push({ id: 'my-list', heading: 'My List', items: saved });

  for (const { genre, heading } of genreRows) {
    const items = pool.filter((t) => t.genres.includes(genre));
    if (items.length >= 3) rows.push({ id: genre, heading, items });
  }
  return rows;
}

function searchTitles(query: string): Title[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return titles.filter((t) =>
    [t.name, t.kind, ...t.genres, ...t.cast].some((value) => value.toLowerCase().includes(q)),
  );
}

export default function NetflixClonePage() {
  const [tab, setTab] = useState<Tab>('home');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [myListIds, setMyListIds] = useState<string[]>(DEFAULT_MY_LIST);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MY_LIST_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) {
        setMyListIds(parsed.filter((id): id is string => typeof id === 'string' && !!titleById(id)));
      }
    } catch {
      // Storage can be blocked (e.g. private mode); keep the default list.
    }

    // Deep links: ?tab=movies, ?q=action, ?title=neon-district
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (isTab(tabParam)) setTab(tabParam);
    const q = params.get('q');
    if (q) setQuery(q);
    const titleParam = params.get('title');
    if (titleParam && titleById(titleParam)) setSelectedId(titleParam);
  }, []);

  const myList = useMemo(
    () => myListIds.map(titleById).filter((t): t is Title => t !== undefined),
    [myListIds],
  );
  const rows = useMemo(() => buildRows(tab, myList), [tab, myList]);
  const results = useMemo(() => searchTitles(query), [query]);

  const featured = titleById(featuredByTab[tab]) ?? titles[0];
  const selected = selectedId ? titleById(selectedId) : undefined;
  const playing = playingId ? titleById(playingId) : undefined;

  const changeTab = useCallback((next: Tab) => {
    setTab(next);
    setQuery('');
    window.scrollTo({ top: 0 });
  }, []);

  const changeQuery = useCallback(
    (next: string) => {
      if (!query && next) window.scrollTo({ top: 0 });
      setQuery(next);
    },
    [query],
  );

  const toggleMyList = useCallback((id: string) => {
    setMyListIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      try {
        window.localStorage.setItem(MY_LIST_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors; the list still works for this visit.
      }
      return next;
    });
  }, []);

  const play = useCallback((id: string) => {
    setSelectedId(null);
    setPlayingId(id);
  }, []);
  const closeModal = useCallback(() => setSelectedId(null), []);
  const closePlayer = useCallback(() => setPlayingId(null), []);

  let content: ReactNode;
  if (query.trim()) {
    content = (
      <SearchResults query={query} results={results} onSelect={setSelectedId} onQueryChange={changeQuery} />
    );
  } else if (tab === 'mylist') {
    content = <MyList items={myList} onSelect={setSelectedId} />;
  } else {
    content = (
      <>
        <Billboard
          title={featured}
          onPlay={() => play(featured.id)}
          onMoreInfo={() => setSelectedId(featured.id)}
        />
        <div className="relative z-10 -mt-24 space-y-6 pb-12 md:-mt-40 md:space-y-8">
          {rows.map((row) => (
            <TitleRow
              key={row.id}
              heading={row.heading}
              items={row.items}
              ranked={row.ranked}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#141414] font-sans text-white">
      <Navbar tab={tab} onTabChange={changeTab} query={query} onQueryChange={changeQuery} />
      <main>{content}</main>
      <Footer />

      {selected && (
        <TitleModal
          key={selected.id}
          title={selected}
          inMyList={myListIds.includes(selected.id)}
          onToggleMyList={() => toggleMyList(selected.id)}
          onPlay={() => play(selected.id)}
          onSelect={setSelectedId}
          onClose={closeModal}
        />
      )}
      {playing && <Player title={playing} onClose={closePlayer} />}
    </div>
  );
}

type GridProps = { items: Title[]; onSelect: (id: string) => void };

function TitleGrid({ items, onSelect }: GridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((title) => (
        <TitleCard key={title.id} title={title} onSelect={onSelect} />
      ))}
    </div>
  );
}

function SearchResults({
  query,
  results,
  onSelect,
  onQueryChange,
}: {
  query: string;
  results: Title[];
  onSelect: (id: string) => void;
  onQueryChange: (query: string) => void;
}) {
  const related = Array.from(new Set(results.flatMap((t) => t.genres)));

  return (
    <section className="min-h-[70vh] px-4 pb-16 pt-24 md:px-12 md:pt-32">
      {results.length === 0 ? (
        <div className="mx-auto max-w-lg pt-12 text-gray-300">
          <p className="mb-4">{`Your search for "${query}" did not have any matches.`}</p>
          <p className="mb-2">Suggestions:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Try different keywords</li>
            <li>Try a genre, like Comedy or Sci-Fi</li>
            <li>Try the name of an actor</li>
          </ul>
        </div>
      ) : (
        <>
          <p className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-400">
            <span>Explore titles related to:</span>
            {related.map((genre, index) => (
              <span key={genre} className="flex items-center gap-3">
                {index > 0 && <span className="text-gray-600">|</span>}
                <button type="button" onClick={() => onQueryChange(genre)} className="text-white hover:underline">
                  {genre}
                </button>
              </span>
            ))}
          </p>
          <TitleGrid items={results} onSelect={onSelect} />
        </>
      )}
    </section>
  );
}

function MyList({ items, onSelect }: GridProps) {
  return (
    <section className="min-h-[70vh] px-4 pb-16 pt-24 md:px-12 md:pt-32">
      <h1 className="mb-8 text-2xl font-semibold md:text-4xl">My List</h1>
      {items.length === 0 ? (
        <p className="text-gray-400">{"You haven't added any titles to your list yet."}</p>
      ) : (
        <TitleGrid items={items} onSelect={onSelect} />
      )}
    </section>
  );
}

const footerLinks = [
  'Audio Description',
  'Help Center',
  'Gift Cards',
  'Media Center',
  'Investor Relations',
  'Jobs',
  'Terms of Use',
  'Privacy',
  'Legal Notices',
  'Cookie Preferences',
  'Corporate Information',
  'Contact Us',
];

function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-4 py-12 text-sm text-gray-500 md:px-12">
      <ul className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4" aria-hidden="true">
        {footerLinks.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <p>
        Netflix UI clone built for learning purposes with Next.js, TypeScript, and Tailwind CSS.
        Not affiliated with Netflix. All titles, people, and artwork are fictional.
      </p>
      <Link href="/?open=projects" className="mt-4 inline-block text-gray-300 hover:text-white">
        ← Back to portfolio
      </Link>
    </footer>
  );
}
