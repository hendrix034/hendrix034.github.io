'use client';

import { formatTime } from '../../_shared/format';
import {
  HeartFilledIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
  VolumeMuteIcon,
} from '../../_shared/icons';
import { useSpotify } from '../_lib/SpotifyProvider';
import { collectionById } from '../data';
import Cover from './Cover';

type SliderProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  className?: string;
};

/** A native range input (for keyboard support) layered over Spotify-style styling. */
function Slider({ value, max, onChange, label, className = '' }: SliderProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`group relative flex h-4 flex-1 items-center ${className}`}>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/30">
        <div
          className="h-full rounded-full bg-white group-hover:bg-[#1ed760]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow group-hover:opacity-100"
        style={{ left: `${percent}%` }}
      />
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

function ActiveDot() {
  return <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current" />;
}

export default function PlayerBar() {
  const { player, isLiked, toggleLike, navigate } = useSpotify();
  const { track, isPlaying, position, duration, shuffle, repeat, volume, muted } = player;
  const album = track ? collectionById(track.albumId) : undefined;
  const liked = track ? isLiked(track.id) : false;
  const effectiveVolume = muted ? 0 : volume;
  const progress = duration ? (position / duration) * 100 : 0;
  const repeatLabel = repeat === 'off' ? 'Enable repeat' : repeat === 'all' ? 'Enable repeat one' : 'Disable repeat';

  return (
    <footer className="relative flex h-16 shrink-0 items-center gap-3 bg-black px-2 md:h-[72px]">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:w-[30%] md:flex-none">
        {track && album && (
          <>
            <button
              type="button"
              onClick={() => navigate({ kind: 'collection', id: album.id })}
              aria-label={`Open album ${album.name}`}
              className="shrink-0"
            >
              <Cover collection={album} className="h-12 w-12 rounded md:h-14 md:w-14" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{track.title}</p>
              <p className="truncate text-xs text-[#b3b3b3]">{track.artist}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleLike(track.id)}
              aria-pressed={liked}
              aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
              className={`ml-1 shrink-0 transition-colors ${liked ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'}`}
            >
              {liked ? <HeartFilledIcon className="h-4 w-4" /> : <HeartIcon className="h-4 w-4" />}
            </button>
          </>
        )}
      </div>

      <div className="hidden max-w-[722px] flex-1 flex-col items-center gap-1 md:flex">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => player.setShuffle((s) => !s)}
            aria-pressed={shuffle}
            aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            className={`relative p-1 transition-colors ${shuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'}`}
          >
            <ShuffleIcon className="h-4 w-4" />
            {shuffle && <ActiveDot />}
          </button>
          <button
            type="button"
            onClick={player.previous}
            aria-label="Previous"
            className="p-1 text-[#b3b3b3] transition-colors hover:text-white"
          >
            <SkipBackIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={player.togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="grid h-8 w-8 place-items-center rounded-full bg-white text-black transition hover:scale-105"
          >
            {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4 translate-x-[1px]" />}
          </button>
          <button
            type="button"
            onClick={player.next}
            aria-label="Next"
            className="p-1 text-[#b3b3b3] transition-colors hover:text-white"
          >
            <SkipForwardIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={player.cycleRepeat}
            aria-label={repeatLabel}
            className={`relative p-1 transition-colors ${
              repeat !== 'off' ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            {repeat === 'one' ? <RepeatOneIcon className="h-4 w-4" /> : <RepeatIcon className="h-4 w-4" />}
            {repeat !== 'off' && <ActiveDot />}
          </button>
        </div>
        <div className="flex w-full items-center gap-2 text-xs text-[#b3b3b3]">
          <span className="w-10 text-right tabular-nums">{formatTime(position)}</span>
          <Slider value={position} max={duration} onChange={player.seek} label="Seek" />
          <span className="w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden w-[30%] items-center justify-end gap-2 pr-2 md:flex">
        <button
          type="button"
          onClick={() => player.setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="text-[#b3b3b3] transition-colors hover:text-white"
        >
          {effectiveVolume === 0 ? <VolumeMuteIcon className="h-4 w-4" /> : <VolumeIcon className="h-4 w-4" />}
        </button>
        <Slider
          value={Math.round(effectiveVolume * 100)}
          max={100}
          onChange={(v) => {
            player.setVolume(v / 100);
            player.setMuted(false);
          }}
          label="Volume"
          className="max-w-[93px]"
        />
      </div>

      <button
        type="button"
        onClick={player.togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="grid h-10 w-10 shrink-0 place-items-center md:hidden"
      >
        {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
      </button>
      <div className="absolute inset-x-2 bottom-0 h-0.5 overflow-hidden rounded-full bg-white/20 md:hidden">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>
    </footer>
  );
}
