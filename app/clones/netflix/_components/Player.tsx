'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CoverArt from '../../_shared/CoverArt';
import { formatTime } from '../../_shared/format';
import { ArrowLeftIcon, PauseIcon, PlayIcon } from '../../_shared/icons';
import { runtimeSeconds, type Title } from '../data';

type PlayerProps = {
  title: Title;
  onClose: () => void;
};

/** Full-screen player. There is no real video, so playback is a simulated timer. */
export default function Player({ title, onClose }: PlayerProps) {
  const total = runtimeSeconds(title);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [idle, setIdle] = useState(false);
  const [activity, setActivity] = useState(0);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  const finished = position >= total;
  const subtitle = title.kind === 'Series' ? 'S1:E1 · Pilot' : `${title.year} · ${title.runtime}`;

  const wake = useCallback(() => setActivity((n) => n + 1), []);

  const togglePlay = useCallback(() => {
    if (finished) setPosition(0);
    setPlaying((p) => (finished ? true : !p));
  }, [finished]);

  // Move focus into the player so keys don't activate buttons hidden behind it.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    playButtonRef.current?.focus();
    return () => previous?.focus();
  }, []);

  // Hide the controls after 3 seconds without mouse or keyboard input.
  useEffect(() => {
    setIdle(false);
    const timer = window.setTimeout(() => setIdle(true), 3000);
    return () => window.clearTimeout(timer);
  }, [activity]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setPosition((p) => Math.min(p + 1, total)), 1000);
    return () => window.clearInterval(timer);
  }, [playing, total]);

  useEffect(() => {
    if (finished) setPlaying(false);
  }, [finished]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inControl = e.target instanceof Element && e.target.closest('button, input') !== null;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && !inControl) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' && !inControl) {
        setPosition((p) => Math.min(p + 10, total));
      } else if (e.key === 'ArrowLeft' && !inControl) {
        setPosition((p) => Math.max(p - 10, 0));
      }
      wake();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, togglePlay, total, wake]);

  const hideControls = idle && playing;
  const controlsClass = `transition-opacity duration-500 ${hideControls ? 'opacity-0' : 'opacity-100'}`;

  return (
    <div
      className={`fixed inset-0 z-[60] bg-black ${hideControls ? 'cursor-none' : ''}`}
      onMouseMove={wake}
      onClick={wake}
    >
      <CoverArt
        palette={title.palette}
        motif={title.motif}
        className="absolute inset-0 scale-110 opacity-50 blur-md"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-300">
          {finished ? 'Finished' : playing ? 'Now playing' : 'Paused'}
        </p>
        <h2 className="text-4xl font-black uppercase tracking-tight md:text-7xl">{title.name}</h2>
        <p className="text-gray-300">{subtitle}</p>
        <p className="mt-8 max-w-sm text-xs text-gray-400">
          Video playback is simulated in this clone. Press Space to pause and the arrow keys to
          skip 10 seconds.
        </p>
      </div>

      <div
        className={`absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-8 ${controlsClass}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to browse"
          className="rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <ArrowLeftIcon className="h-8 w-8" />
        </button>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/90 to-transparent px-4 pb-6 pt-16 md:px-8 ${controlsClass}`}
      >
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={total}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label="Seek"
            className="h-1 flex-1 cursor-pointer accent-[#e50914]"
          />
          <span className="w-20 text-right text-sm tabular-nums">
            -{formatTime(total - position)}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            ref={playButtonRef}
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <PauseIcon className="h-9 w-9" /> : <PlayIcon className="h-9 w-9" />}
          </button>
          <button
            type="button"
            onClick={() => setPosition((p) => Math.max(p - 10, 0))}
            aria-label="Back 10 seconds"
            className="text-sm font-semibold"
          >
            -10s
          </button>
          <button
            type="button"
            onClick={() => setPosition((p) => Math.min(p + 10, total))}
            aria-label="Forward 10 seconds"
            className="text-sm font-semibold"
          >
            +10s
          </button>
          <p className="min-w-0 truncate text-base font-semibold md:text-lg">
            {title.name}
            <span className="ml-2 font-normal text-gray-400">{subtitle}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
