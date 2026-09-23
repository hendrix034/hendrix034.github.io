import { useCallback, useEffect, useState } from 'react';
import { trackById } from '../data';

export type RepeatMode = 'off' | 'all' | 'one';

/**
 * Playback state for the clone. There is no audio, so a one-second timer
 * advances the position and moves through the queue.
 */
export function usePlayer(initialContextId: string, initialQueue: string[]) {
  const [contextId, setContextId] = useState<string | null>(initialContextId);
  const [queue, setQueue] = useState<string[]>(initialQueue);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);

  const track = trackById(queue[index]);
  const duration = track?.duration ?? 0;

  const nextIndex = useCallback(
    (from: number): number | null => {
      if (queue.length === 0) return null;
      if (shuffle && queue.length > 1) {
        let candidate = from;
        while (candidate === from) candidate = Math.floor(Math.random() * queue.length);
        return candidate;
      }
      if (from + 1 < queue.length) return from + 1;
      return repeat === 'all' ? 0 : null;
    },
    [queue.length, shuffle, repeat],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setPosition((p) => p + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  // When a track ends: repeat it, move to the next one, or stop at the end of the queue.
  useEffect(() => {
    if (duration === 0 || position < duration) return;
    setPosition(0);
    if (repeat === 'one') return;
    const next = nextIndex(index);
    if (next === null) {
      setIndex(0);
      setIsPlaying(false);
    } else {
      setIndex(next);
    }
  }, [position, duration, repeat, index, nextIndex]);

  const playQueue = useCallback((newContextId: string, trackIds: string[], start = 0) => {
    if (trackIds.length === 0) return;
    setContextId(newContextId);
    setQueue(trackIds);
    setIndex(start);
    setPosition(0);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => (queue.length > 0 ? !playing : false));
  }, [queue.length]);

  const next = useCallback(() => {
    setIndex(nextIndex(index) ?? 0);
    setPosition(0);
  }, [index, nextIndex]);

  const previous = useCallback(() => {
    if (position > 3) {
      setPosition(0);
      return;
    }
    setIndex((i) => (i > 0 ? i - 1 : repeat === 'all' ? queue.length - 1 : 0));
    setPosition(0);
  }, [position, repeat, queue.length]);

  const seek = useCallback(
    (seconds: number) => setPosition(Math.max(0, Math.min(seconds, duration))),
    [duration],
  );

  const cycleRepeat = useCallback(() => {
    setRepeat((mode) => (mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off'));
  }, []);

  return {
    contextId,
    track,
    position,
    duration,
    isPlaying,
    shuffle,
    repeat,
    volume,
    muted,
    playQueue,
    togglePlay,
    next,
    previous,
    seek,
    setShuffle,
    cycleRepeat,
    setVolume,
    setMuted,
  };
}
