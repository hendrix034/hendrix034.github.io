'use client';

import { useEffect, useRef } from 'react';
import CoverArt from '../../_shared/CoverArt';
import { CheckIcon, CloseIcon, PlayIcon, PlusIcon, ThumbsUpIcon } from '../../_shared/icons';
import { titles, type Genre, type Title } from '../data';

const moods: Record<Genre, string> = {
  Action: 'Exciting',
  Comedy: 'Witty',
  Drama: 'Emotional',
  'Sci-Fi': 'Mind-Bending',
  Thriller: 'Suspenseful',
  Documentary: 'Inspiring',
};

type TitleModalProps = {
  title: Title;
  inMyList: boolean;
  onToggleMyList: () => void;
  onPlay: () => void;
  onSelect: (id: string) => void;
  onClose: () => void;
};

function similarTitles(title: Title): Title[] {
  const shared = (other: Title) => other.genres.filter((g) => title.genres.includes(g)).length;
  return titles
    .filter((other) => other.id !== title.id && shared(other) > 0)
    .sort((a, b) => shared(b) - shared(a) || b.match - a.match)
    .slice(0, 6);
}

export default function TitleModal({
  title,
  inMyList,
  onToggleMyList,
  onPlay,
  onSelect,
  onClose,
}: TitleModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog while open and hand focus back to the card that opened it.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previous?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const similar = similarTitles(title);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-2 py-6 md:py-10"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="title-modal-heading"
        className="relative mx-auto max-w-[850px] overflow-hidden rounded-lg bg-[#181818] shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-[#181818] transition-colors hover:bg-[#2a2a2a]"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <CoverArt palette={title.palette} motif={title.motif} className="relative aspect-video">
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-5 md:bottom-10 md:left-12">
            <h2
              id="title-modal-heading"
              className="max-w-lg text-4xl font-black uppercase leading-[0.9] tracking-tight drop-shadow-lg md:text-6xl"
            >
              {title.name}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPlay}
                className="flex items-center gap-2 rounded bg-white px-6 py-2 font-semibold text-black transition hover:bg-white/75"
              >
                <PlayIcon className="h-6 w-6" />
                Play
              </button>
              <button
                type="button"
                onClick={onToggleMyList}
                aria-pressed={inMyList}
                aria-label={inMyList ? 'Remove from My List' : 'Add to My List'}
                title={inMyList ? 'Remove from My List' : 'Add to My List'}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/60 bg-[#2a2a2a]/60 transition hover:border-white"
              >
                {inMyList ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
              </button>
              <button
                type="button"
                aria-label="I like this"
                title="I like this"
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/60 bg-[#2a2a2a]/60 transition hover:border-white"
              >
                <ThumbsUpIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CoverArt>

        <div className="grid gap-6 px-6 py-4 md:grid-cols-[2fr_1fr] md:px-12">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span className="font-semibold text-[#46d369]">{title.match}% Match</span>
              <span className="text-gray-300">{title.year}</span>
              <span className="border border-white/40 px-1.5 text-xs">{title.maturity}</span>
              <span className="text-gray-300">{title.runtime}</span>
              <span className="rounded border border-white/40 px-1 text-[10px] font-semibold">HD</span>
            </div>
            <p className="leading-relaxed text-gray-100">{title.description}</p>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="mr-1 inline text-gray-500">Cast:</dt>
              <dd className="inline text-gray-200">{title.cast.join(', ')}</dd>
            </div>
            <div>
              <dt className="mr-1 inline text-gray-500">Genres:</dt>
              <dd className="inline text-gray-200">{title.genres.join(', ')}</dd>
            </div>
            <div>
              <dt className="mr-1 inline text-gray-500">
                This {title.kind === 'Series' ? 'show' : 'movie'} is:
              </dt>
              <dd className="inline text-gray-200">
                {title.genres.map((genre) => moods[genre]).join(', ')}
              </dd>
            </div>
          </dl>
        </div>

        {similar.length > 0 && (
          <div className="px-6 pb-10 md:px-12">
            <h3 className="mb-4 text-xl font-bold md:text-2xl">More Like This</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {similar.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="overflow-hidden rounded-md bg-[#2f2f2f] text-left transition-colors hover:bg-[#3a3a3a]"
                >
                  <CoverArt palette={item.palette} motif={item.motif} className="relative aspect-video">
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute right-2 top-2 text-xs font-semibold drop-shadow">
                      {item.runtime}
                    </span>
                    <span className="absolute inset-x-2 bottom-2 text-sm font-extrabold uppercase leading-tight">
                      {item.name}
                    </span>
                  </CoverArt>
                  <span className="block space-y-2 p-3">
                    <span className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold text-[#46d369]">{item.match}% Match</span>
                      <span className="border border-white/40 px-1 text-[10px]">{item.maturity}</span>
                      <span className="text-gray-400">{item.year}</span>
                    </span>
                    <span className="line-clamp-3 block text-xs text-gray-300 md:text-sm">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
