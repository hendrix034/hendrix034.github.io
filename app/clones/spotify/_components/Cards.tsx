'use client';

import { PauseIcon, PlayIcon } from '../../_shared/icons';
import { useSpotify } from '../_lib/SpotifyProvider';
import type { Collection } from '../data';
import Cover, { Equalizer } from './Cover';

const sizes = {
  sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { button: 'h-12 w-12', icon: 'h-5 w-5' },
  lg: { button: 'h-14 w-14', icon: 'h-6 w-6' },
};

type PlayButtonProps = {
  collectionId: string;
  size?: keyof typeof sizes;
  className?: string;
};

export function PlayButton({ collectionId, size = 'md', className = '' }: PlayButtonProps) {
  const { player, playCollection, getCollection } = useSpotify();
  const active = player.contextId === collectionId && player.isPlaying;
  const name = getCollection(collectionId)?.name ?? '';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        playCollection(collectionId);
      }}
      aria-label={`${active ? 'Pause' : 'Play'} ${name}`}
      className={`pointer-events-auto grid place-items-center rounded-full bg-[#1ed760] text-black shadow-lg transition hover:scale-105 hover:bg-[#3be477] ${sizes[size].button} ${className}`}
    >
      {active ? (
        <PauseIcon className={sizes[size].icon} />
      ) : (
        <PlayIcon className={`${sizes[size].icon} translate-x-[1px]`} />
      )}
    </button>
  );
}

export function subtitleFor(collection: Collection): string {
  return collection.kind === 'Album'
    ? `${collection.year} • ${collection.owner}`
    : collection.description || `By ${collection.owner}`;
}

export function CollectionCard({ collection }: { collection: Collection }) {
  const { navigate, player } = useSpotify();
  const active = player.contextId === collection.id && player.isPlaying;

  return (
    <div className="group relative rounded-md p-3 transition-colors hover:bg-white/10">
      <button
        type="button"
        onClick={() => navigate({ kind: 'collection', id: collection.id })}
        aria-label={`Open ${collection.name}`}
        className="absolute inset-0 rounded-md"
      />
      <div className="pointer-events-none relative mb-3">
        <Cover
          collection={collection}
          label
          className="aspect-square w-full rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        />
        <PlayButton
          collectionId={collection.id}
          className={`absolute bottom-2 right-2 transition-all duration-300 ${
            active
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100'
          }`}
        />
      </div>
      <p className="pointer-events-none truncate font-bold">{collection.name}</p>
      <p className="pointer-events-none mt-1 line-clamp-2 text-sm text-[#b3b3b3]">
        {subtitleFor(collection)}
      </p>
    </div>
  );
}

export function QuickPick({ collection }: { collection: Collection }) {
  const { navigate, player } = useSpotify();
  const current = player.contextId === collection.id;
  const active = current && player.isPlaying;

  return (
    <div className="group relative flex h-12 items-center gap-3 overflow-hidden rounded bg-white/10 pr-2 transition-colors hover:bg-white/20 md:h-16">
      <button
        type="button"
        onClick={() => navigate({ kind: 'collection', id: collection.id })}
        aria-label={`Open ${collection.name}`}
        className="absolute inset-0"
      />
      <Cover
        collection={collection}
        className="pointer-events-none aspect-square h-full shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      />
      <span
        className={`pointer-events-none min-w-0 flex-1 truncate text-sm font-bold ${
          current ? 'text-[#1ed760]' : ''
        }`}
      >
        {collection.name}
      </span>
      {active && <Equalizer className="pointer-events-none mr-2 group-hover:hidden" />}
      <PlayButton
        collectionId={collection.id}
        size="sm"
        className={`relative shrink-0 ${
          active ? 'hidden group-hover:grid' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      />
    </div>
  );
}
