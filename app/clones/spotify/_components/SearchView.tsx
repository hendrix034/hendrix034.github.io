'use client';

import { useSpotify } from '../_lib/SpotifyProvider';
import { collectionById, collections, tracks, type Collection } from '../data';
import { CollectionCard, PlayButton } from './Cards';
import Cover from './Cover';
import TrackRow from './TrackRow';

const browseCategories = [
  { name: 'OPM', color: '#e8115b', target: 'opm-chill' },
  { name: 'Made For You', color: '#1e3264', target: 'daily-mix-1' },
  { name: 'New Releases', color: '#608108', target: 'release-radar' },
  { name: 'Discover', color: '#8d67ab', target: 'discover-weekly' },
  { name: 'Focus', color: '#503750', target: 'deep-focus' },
  { name: 'Driving', color: '#dc148c', target: 'late-night-drive' },
  { name: 'Rainy Day', color: '#27856a', target: 'rainy-day' },
  { name: 'Workout', color: '#e13300', target: 'workout-boost' },
  { name: 'Indie', color: '#7358ff', target: 'corner-store' },
  { name: 'Chill', color: '#477d95', target: 'shorelines' },
];

function BrowseAll() {
  const { navigate } = useSpotify();

  return (
    <div className="px-4 pb-8 pt-20 md:px-6">
      <h1 className="mb-4 text-2xl font-bold">Browse all</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {browseCategories.map((category) => {
          const target = collectionById(category.target);
          return (
            <button
              key={category.name}
              type="button"
              onClick={() => navigate({ kind: 'collection', id: category.target })}
              className="relative aspect-[16/10] overflow-hidden rounded-lg p-4 text-left transition hover:brightness-110"
              style={{ backgroundColor: category.color }}
            >
              <span className="relative z-10 text-xl font-bold md:text-2xl">{category.name}</span>
              {target && (
                <span className="absolute -bottom-[6%] -right-[6%] w-[42%] rotate-[25deg]">
                  <Cover collection={target} className="aspect-square w-full rounded shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopResult({ collection }: { collection: Collection }) {
  const { navigate } = useSpotify();

  return (
    <div className="group relative rounded-lg bg-[#181818] p-5 transition-colors hover:bg-[#282828]">
      <button
        type="button"
        onClick={() => navigate({ kind: 'collection', id: collection.id })}
        aria-label={`Open ${collection.name}`}
        className="absolute inset-0 rounded-lg"
      />
      <Cover
        collection={collection}
        label
        className="pointer-events-none mb-5 h-24 w-24 rounded shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      />
      <p className="pointer-events-none truncate text-3xl font-bold">{collection.name}</p>
      <p className="pointer-events-none mt-1 text-sm text-[#b3b3b3]">
        {collection.kind} • <span className="text-white">{collection.owner}</span>
      </p>
      <PlayButton
        collectionId={collection.id}
        className="absolute bottom-5 right-5 translate-y-2 opacity-0 transition-all duration-300 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
      />
    </div>
  );
}

export default function SearchView() {
  const { searchQuery } = useSpotify();
  const q = searchQuery.trim().toLowerCase();

  if (!q) return <BrowseAll />;

  const matches = (...values: (string | undefined)[]) =>
    values.some((value) => value?.toLowerCase().includes(q));

  const trackResults = tracks.filter((t) =>
    matches(t.title, t.artist, collectionById(t.albumId)?.name),
  );
  const collectionResults = collections.filter((c) => matches(c.name, c.owner, c.description));

  if (trackResults.length === 0 && collectionResults.length === 0) {
    return (
      <div className="px-4 pt-32 text-center md:px-6">
        <h1 className="text-2xl font-bold">{`No results found for "${searchQuery.trim()}"`}</h1>
        <p className="mt-2 text-[#b3b3b3]">
          Please make sure your words are spelled correctly, or use fewer or different keywords.
        </p>
      </div>
    );
  }

  const top =
    collectionResults[0] ?? (trackResults[0] ? collectionById(trackResults[0].albumId) : undefined);

  return (
    <div className="space-y-8 px-4 pb-8 pt-20 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {top && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Top result</h2>
            <TopResult collection={top} />
          </section>
        )}
        {trackResults.length > 0 && (
          <section className="min-w-0">
            <h2 className="mb-2 text-2xl font-bold">Songs</h2>
            <ol>
              {trackResults.slice(0, 4).map((track, index) => (
                <li key={track.id}>
                  <TrackRow track={track} number={index + 1} contextId={track.albumId} showAlbum={false} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
      {collectionResults.length > 0 && (
        <section>
          <h2 className="mb-2 text-2xl font-bold">Playlists and albums</h2>
          <div className="-mx-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {collectionResults.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
