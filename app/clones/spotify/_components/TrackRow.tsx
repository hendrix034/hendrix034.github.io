'use client';

import { formatTime } from '../../_shared/format';
import { ClockIcon, HeartFilledIcon, HeartIcon, PauseIcon, PlayIcon } from '../../_shared/icons';
import { useSpotify } from '../_lib/SpotifyProvider';
import { collectionById, type Track } from '../data';
import Cover, { Equalizer } from './Cover';

const columns = {
  withAlbum:
    'grid-cols-[16px_minmax(0,1fr)_88px] md:grid-cols-[16px_minmax(0,4fr)_minmax(0,3fr)_104px]',
  withoutAlbum: 'grid-cols-[16px_minmax(0,1fr)_88px] md:grid-cols-[16px_minmax(0,1fr)_104px]',
};

export function TrackListHeader({ showAlbum = true }: { showAlbum?: boolean }) {
  return (
    <div
      className={`grid items-center gap-4 border-b border-white/10 px-4 pb-2 text-sm text-[#b3b3b3] ${
        showAlbum ? columns.withAlbum : columns.withoutAlbum
      }`}
    >
      <span className="text-center">#</span>
      <span>Title</span>
      {showAlbum && <span className="hidden md:block">Album</span>}
      <span className="flex justify-end pr-2">
        <ClockIcon className="h-4 w-4" aria-label="Duration" />
      </span>
    </div>
  );
}

type TrackRowProps = {
  track: Track;
  number: number;
  /** The playlist or album this row plays from. */
  contextId: string;
  showAlbum?: boolean;
  showCover?: boolean;
};

export default function TrackRow({
  track,
  number,
  contextId,
  showAlbum = true,
  showCover = true,
}: TrackRowProps) {
  const { player, playCollection, isLiked, toggleLike } = useSpotify();
  const album = collectionById(track.albumId);
  const isCurrent = player.track?.id === track.id;
  const isActive = isCurrent && player.isPlaying;
  const liked = isLiked(track.id);
  const play = () => playCollection(contextId, track.id);

  return (
    <div
      onClick={play}
      className={`group grid h-14 items-center gap-4 rounded-md px-4 text-sm text-[#b3b3b3] transition-colors hover:bg-white/10 ${
        showAlbum ? columns.withAlbum : columns.withoutAlbum
      }`}
    >
      <div className="flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            play();
          }}
          aria-label={`${isActive ? 'Pause' : 'Play'} ${track.title} by ${track.artist}`}
          className="grid h-5 min-w-4 place-items-center text-white"
        >
          <span className="hidden group-focus-within:block group-hover:block">
            {isActive ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          </span>
          <span className="group-focus-within:hidden group-hover:hidden">
            {isActive ? (
              <Equalizer />
            ) : (
              <span className={`text-base tabular-nums ${isCurrent ? 'text-[#1ed760]' : 'text-[#b3b3b3]'}`}>
                {number}
              </span>
            )}
          </span>
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        {showCover && album && <Cover collection={album} className="h-10 w-10 shrink-0 rounded" />}
        <div className="min-w-0">
          <p className={`truncate text-base ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
            {track.title}
          </p>
          <p className="flex min-w-0 items-center gap-1.5">
            {track.explicit && (
              <span
                title="Explicit"
                className="grid h-4 w-4 shrink-0 place-items-center rounded-sm bg-[#b3b3b3] text-[9px] font-bold text-black"
              >
                E
              </span>
            )}
            <span className="truncate group-hover:text-white">{track.artist}</span>
          </p>
        </div>
      </div>

      {showAlbum && <p className="hidden truncate group-hover:text-white md:block">{album?.name}</p>}

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${track.title} from Liked Songs` : `Save ${track.title} to Liked Songs`}
          className={`transition ${
            liked
              ? 'text-[#1ed760]'
              : 'text-[#b3b3b3] opacity-0 hover:text-white focus-visible:opacity-100 group-hover:opacity-100'
          }`}
        >
          {liked ? <HeartFilledIcon className="h-4 w-4" /> : <HeartIcon className="h-4 w-4" />}
        </button>
        <span className="w-10 text-right tabular-nums">{formatTime(track.duration)}</span>
      </div>
    </div>
  );
}
