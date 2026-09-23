'use client';

import { useRef } from 'react';
import CoverArt from '../../_shared/CoverArt';
import { ChevronLeftIcon, ChevronRightIcon } from '../../_shared/icons';
import type { Title } from '../data';

type CardProps = {
  title: Title;
  onSelect: (id: string) => void;
};

export function TitleCard({ title, onSelect }: CardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(title.id)}
      aria-label={`${title.name}, ${title.kind}, ${title.year}`}
      className="group/card relative block w-full rounded-md text-left outline-none transition-transform duration-300 hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-white"
    >
      <CoverArt
        palette={title.palette}
        motif={title.motif}
        className="relative aspect-video rounded-md shadow-lg"
      >
        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <span
          className="absolute left-2 top-1 text-xl font-black text-[#e50914] drop-shadow"
          aria-hidden="true"
        >
          N
        </span>
        {title.year >= 2026 && (
          <span className="absolute right-0 top-2 rounded-l bg-[#e50914] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            New
          </span>
        )}
        <span className="absolute inset-x-2 bottom-2 block">
          <span className="line-clamp-2 text-xs font-extrabold uppercase leading-tight tracking-tight drop-shadow-md sm:text-sm xl:text-base">
            {title.name}
          </span>
          <span className="block max-h-0 overflow-hidden text-[11px] text-gray-200 opacity-0 transition-all duration-300 group-hover/card:max-h-5 group-hover/card:opacity-100 group-focus-visible/card:max-h-5 group-focus-visible/card:opacity-100">
            <span className="font-semibold text-[#46d369]">{title.match}% Match</span> ·{' '}
            {title.maturity} · {title.runtime}
          </span>
        </span>
      </CoverArt>
    </button>
  );
}

export function RankedCard({ title, rank, onSelect }: CardProps & { rank: number }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(title.id)}
      aria-label={`Number ${rank}: ${title.name}`}
      className="group/card relative block aspect-[10/9] w-full outline-none transition-transform duration-300 [container-type:inline-size] hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:scale-105"
    >
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 select-none font-black leading-[0.74] text-[#141414] [-webkit-text-stroke:3px_#5a5a5a] ${
          rank >= 10 ? 'text-[length:68cqw] tracking-[-0.12em]' : 'text-[length:88cqw]'
        }`}
      >
        {rank}
      </span>
      <CoverArt
        palette={title.palette}
        motif={title.motif}
        className="absolute right-0 top-0 h-full w-[60%] rounded-sm shadow-xl"
      >
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <span className="absolute left-1.5 top-1 text-lg font-black text-[#e50914]" aria-hidden="true">
          N
        </span>
        <span className="absolute inset-x-2 bottom-2 block text-left text-sm font-extrabold uppercase leading-tight tracking-tight drop-shadow-md">
          {title.name}
        </span>
      </CoverArt>
    </button>
  );
}

type TitleRowProps = {
  heading: string;
  items: Title[];
  ranked?: boolean;
  onSelect: (id: string) => void;
};

export default function TitleRow({ heading, items, ranked = false, onSelect }: TitleRowProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const arrowClass =
    'absolute inset-y-4 z-20 hidden w-12 items-center justify-center bg-black/50 opacity-0 transition hover:bg-black/70 focus-visible:opacity-100 group-hover/row:opacity-100 md:flex';

  return (
    <section className="group/row relative" aria-label={heading}>
      <h2 className="mb-1 px-4 text-lg font-semibold text-gray-100 md:px-12 md:text-2xl">
        {heading}
      </h2>
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${heading} left`}
          className={`${arrowClass} left-0 rounded-r`}
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <div
          ref={scroller}
          className="flex gap-2 overflow-x-auto scroll-smooth px-4 py-4 [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((title, index) =>
            ranked ? (
              <div key={title.id} className="w-[46%] shrink-0 sm:w-[32%] md:w-[24%] lg:w-[19%]">
                <RankedCard title={title} rank={index + 1} onSelect={onSelect} />
              </div>
            ) : (
              <div key={title.id} className="w-[46%] shrink-0 sm:w-[32%] md:w-[24%] lg:w-[16%]">
                <TitleCard title={title} onSelect={onSelect} />
              </div>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${heading} right`}
          className={`${arrowClass} right-0 rounded-l`}
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
