import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Solid({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

function Outline({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const heartPath =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

export function PlayIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d="M7 4.8v14.4a1 1 0 0 0 1.53.85l11.2-7.2a1 1 0 0 0 0-1.7L8.53 3.95A1 1 0 0 0 7 4.8z" />
    </Solid>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <rect x="6" y="4.5" width="4" height="15" rx="1" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" />
    </Solid>
  );
}

export function SkipForwardIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d="M5 5.8v12.4a1 1 0 0 0 1.55.83l9.3-6.2a1 1 0 0 0 0-1.66l-9.3-6.2A1 1 0 0 0 5 5.8z" />
      <rect x="17" y="5" width="2.2" height="14" rx="1.1" />
    </Solid>
  );
}

export function SkipBackIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d="M19 5.8v12.4a1 1 0 0 1-1.55.83l-9.3-6.2a1 1 0 0 1 0-1.66l9.3-6.2A1 1 0 0 1 19 5.8z" />
      <rect x="4.8" y="5" width="2.2" height="14" rx="1.1" />
    </Solid>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="m15 15 6 6" />
      <path d="m4 4 5 5" />
    </Outline>
  );
}

export function RepeatIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </Outline>
  );
}

export function RepeatOneIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      <path d="M11 10.5 12 10v4" strokeWidth={1.6} />
    </Outline>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d={heartPath} />
    </Outline>
  );
}

export function HeartFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d={heartPath} />
    </Solid>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
    </Outline>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Outline>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M4 4v16" />
      <path d="M9 4v16" />
      <path d="m14 4 6 16" />
    </Outline>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M12 5v14M5 12h14" />
    </Outline>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Outline>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Outline>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m15 18-6-6 6-6" />
    </Outline>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m9 18 6-6-6-6" />
    </Outline>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Outline>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 16v-4.5" />
      <path d="M12 8h.01" />
    </Outline>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Outline>
  );
}

export function ThumbsUpIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M7 10v11" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </Outline>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </Outline>
  );
}

export function VolumeMuteIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </Outline>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Outline>
  );
}
