import CoverArt from '../../_shared/CoverArt';
import { HeartFilledIcon } from '../../_shared/icons';
import { LIKED_ID, type Collection } from '../data';

type CoverProps = {
  collection: Collection;
  className?: string;
  /** Prints the playlist name on the artwork, like Spotify's editorial covers. */
  label?: boolean;
};

export default function Cover({ collection, className = '', label = false }: CoverProps) {
  if (collection.id === LIKED_ID) {
    return (
      <div
        className={`relative grid place-items-center overflow-hidden bg-gradient-to-br from-[#450af5] to-[#c4efd9] ${className}`}
        aria-hidden="true"
      >
        <HeartFilledIcon className="h-[38%] w-[38%] text-white" />
      </div>
    );
  }

  const showLabel = label && collection.kind === 'Playlist';

  return (
    <CoverArt
      palette={collection.palette}
      motif={collection.motif}
      className={`relative ${showLabel ? '[container-type:inline-size]' : ''} ${className}`}
    >
      {showLabel && (
        <span className="absolute inset-x-[8%] bottom-[7%] text-[length:13cqw] font-black leading-[0.95] tracking-tight text-white drop-shadow">
          {collection.name}
        </span>
      )}
    </CoverArt>
  );
}

export function Equalizer({ className = '' }: { className?: string }) {
  return (
    <span className={`flex h-3.5 items-end gap-[2px] ${className}`} title="Now playing">
      {[0, 0.35, 0.15, 0.5].map((delay) => (
        <span
          key={delay}
          className="h-full w-[3px] origin-bottom animate-equalize rounded-sm bg-[#1ed760]"
          style={{ animationDelay: `-${delay}s` }}
        />
      ))}
    </span>
  );
}
