'use client';

import { formatLongDuration } from '../../_shared/format';
import { ShuffleIcon } from '../../_shared/icons';
import { useSpotify } from '../_lib/SpotifyProvider';
import { trackById, type Track } from '../data';
import { PlayButton } from './Cards';
import Cover from './Cover';
import TrackRow, { TrackListHeader } from './TrackRow';

export default function CollectionView({ id }: { id: string }) {
  const { getCollection, player } = useSpotify();
  const collection = getCollection(id);

  if (!collection) {
    return (
      <div className="px-6 pt-32 text-center">
        <h1 className="text-2xl font-bold">This page is not available</h1>
      </div>
    );
  }

  const tracks = collection.trackIds
    .map(trackById)
    .filter((track): track is Track => track !== undefined);
  const totalSeconds = tracks.reduce((sum, track) => sum + track.duration, 0);
  const color = collection.palette[0];
  const isPlaylist = collection.kind === 'Playlist';
  const headingSize =
    collection.name.length > 14 ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-7xl lg:text-8xl';

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, ${color} 0px, ${color}aa 280px, #121212 560px)`,
      }}
    >
      <header className="flex flex-col gap-6 bg-gradient-to-b from-transparent to-black/20 px-4 pb-6 pt-20 sm:flex-row sm:items-end md:px-6">
        <Cover
          collection={collection}
          label
          className="aspect-square w-40 shrink-0 self-center rounded shadow-[0_8px_40px_rgba(0,0,0,0.6)] sm:w-48 sm:self-auto lg:w-56"
        />
        <div className="min-w-0 space-y-3">
          <p className="text-sm font-semibold">{collection.kind}</p>
          <h1 className={`font-black leading-none tracking-tight ${headingSize}`}>{collection.name}</h1>
          {collection.description && <p className="text-sm text-white/70">{collection.description}</p>}
          <p className="text-sm">
            <span className="font-bold">{collection.owner}</span>
            {collection.year && <span className="text-white/70"> • {collection.year}</span>}
            <span className="text-white/70">
              {' '}
              • {tracks.length} songs, {formatLongDuration(totalSeconds)}
            </span>
          </p>
        </div>
      </header>

      <div className="bg-black/20 px-4 pb-8 md:px-6">
        <div className="flex items-center gap-6 py-6">
          <PlayButton collectionId={collection.id} size="lg" />
          <button
            type="button"
            onClick={() => player.setShuffle((s) => !s)}
            aria-pressed={player.shuffle}
            aria-label={player.shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            className={`transition-colors ${player.shuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'}`}
          >
            <ShuffleIcon className="h-7 w-7" />
          </button>
        </div>

        {tracks.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-2xl font-bold">Songs you like will appear here</h2>
            <p className="mt-2 text-[#b3b3b3]">Save songs by tapping the heart icon.</p>
          </div>
        ) : (
          <>
            <TrackListHeader showAlbum={isPlaylist} />
            <ol className="mt-2">
              {tracks.map((track, index) => (
                <li key={track.id}>
                  <TrackRow
                    track={track}
                    number={index + 1}
                    contextId={collection.id}
                    showAlbum={isPlaylist}
                    showCover={isPlaylist}
                  />
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
