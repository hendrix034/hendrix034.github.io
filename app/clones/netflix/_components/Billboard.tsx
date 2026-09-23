import CoverArt from '../../_shared/CoverArt';
import { InfoIcon, PlayIcon } from '../../_shared/icons';
import type { Title } from '../data';

type BillboardProps = {
  title: Title;
  onPlay: () => void;
  onMoreInfo: () => void;
};

export default function Billboard({ title, onPlay, onMoreInfo }: BillboardProps) {
  return (
    <section className="relative h-[75vh] min-h-[480px] w-full md:h-[88vh]">
      <CoverArt palette={title.palette} motif={title.motif} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />

      <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center gap-4 px-4 pt-16 md:gap-5 md:px-12">
        <p className="flex items-center gap-2 text-xs font-bold tracking-[0.35em] text-gray-200 md:text-sm">
          <span className="text-2xl font-black tracking-normal text-[#e50914]">N</span>
          {title.kind === 'Series' ? 'SERIES' : 'FILM'}
        </p>
        <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight drop-shadow-lg md:text-7xl lg:text-8xl">
          {title.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
          <span className="font-semibold text-[#46d369]">{title.match}% Match</span>
          <span>{title.year}</span>
          <span className="border border-white/50 px-1.5 text-xs">{title.maturity}</span>
          <span>{title.runtime}</span>
        </div>
        <p className="line-clamp-3 max-w-xl text-base text-gray-100 drop-shadow md:text-lg">
          {title.description}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPlay}
            className="flex items-center gap-2 rounded bg-white px-5 py-2 font-semibold text-black transition hover:bg-white/75 md:px-7 md:text-lg"
          >
            <PlayIcon className="h-6 w-6 md:h-7 md:w-7" />
            Play
          </button>
          <button
            type="button"
            onClick={onMoreInfo}
            className="flex items-center gap-2 rounded bg-gray-500/70 px-5 py-2 font-semibold transition hover:bg-gray-500/50 md:px-7 md:text-lg"
          >
            <InfoIcon className="h-6 w-6 md:h-7 md:w-7" />
            More Info
          </button>
        </div>
      </div>

      <div className="absolute bottom-[32%] right-0 z-10 hidden items-center border-l-[3px] border-gray-300 bg-gray-600/50 py-1.5 pl-3 pr-12 text-lg md:flex">
        {title.maturity}
      </div>
    </section>
  );
}
