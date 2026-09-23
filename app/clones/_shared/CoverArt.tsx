import type { ReactNode } from 'react';

export type Motif =
  | 'sun'
  | 'waves'
  | 'grid'
  | 'orbit'
  | 'peaks'
  | 'stripes'
  | 'city'
  | 'rings';

type CoverArtProps = {
  palette: [string, string];
  motif: Motif;
  /** Must include a position utility (relative/absolute) when children are positioned. */
  className?: string;
  children?: ReactNode;
};

/**
 * Generated artwork (gradient + SVG pattern) so the clones need no
 * copyrighted posters or album covers.
 */
export default function CoverArt({
  palette,
  motif,
  className = '',
  children,
}: CoverArtProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <MotifShapes motif={motif} />
      </svg>
      {children}
    </div>
  );
}

const buildings: Array<[x: number, width: number, height: number]> = [
  [0, 10, 30],
  [9, 8, 48],
  [16, 12, 38],
  [27, 7, 58],
  [33, 11, 42],
  [43, 9, 66],
  [51, 13, 36],
  [63, 8, 52],
  [70, 12, 44],
  [81, 9, 60],
  [89, 11, 34],
];

const stars: Array<[cx: number, cy: number, r: number]> = [
  [12, 18, 0.6],
  [30, 10, 0.4],
  [88, 70, 0.5],
  [20, 80, 0.3],
  [70, 14, 0.5],
  [92, 36, 0.35],
  [45, 88, 0.4],
];

function MotifShapes({ motif }: { motif: Motif }) {
  switch (motif) {
    case 'sun':
      return (
        <>
          <circle cx="68" cy="46" r="24" fill="#fff" fillOpacity="0.22" />
          <circle
            cx="68"
            cy="46"
            r="34"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.1"
            strokeWidth="0.6"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x="0"
              y={60 + i * 7}
              width="100"
              height={1 + i * 0.9}
              fill="#000"
              fillOpacity="0.22"
            />
          ))}
        </>
      );
    case 'waves':
      return (
        <>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const y = 38 + i * 9;
            return (
              <path
                key={i}
                d={`M-10 ${y} Q 15 ${y - 7} 40 ${y} T 90 ${y} T 140 ${y}`}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.08 + i * 0.03}
                strokeWidth="1.4"
              />
            );
          })}
        </>
      );
    case 'grid':
      return (
        <>
          <circle cx="50" cy="44" r="18" fill="#fff" fillOpacity="0.18" />
          <rect x="0" y="52" width="100" height="48" fill="#000" fillOpacity="0.35" />
          {[-60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140, 160].map((x) => (
            <line
              key={x}
              x1="50"
              y1="52"
              x2={x}
              y2="100"
              stroke="#fff"
              strokeOpacity="0.25"
              strokeWidth="0.4"
            />
          ))}
          {[54, 57, 61, 66, 72, 80, 90].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#fff"
              strokeOpacity="0.25"
              strokeWidth="0.4"
            />
          ))}
        </>
      );
    case 'orbit':
      return (
        <>
          {stars.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#fff" fillOpacity="0.7" />
          ))}
          <g transform="rotate(-20 58 52)">
            <ellipse
              cx="58"
              cy="52"
              rx="40"
              ry="11"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.28"
              strokeWidth="0.7"
            />
            <ellipse
              cx="58"
              cy="52"
              rx="28"
              ry="7"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.18"
              strokeWidth="0.7"
            />
            <circle cx="18" cy="52" r="2.2" fill="#fff" fillOpacity="0.6" />
          </g>
          <circle cx="58" cy="52" r="12" fill="#fff" fillOpacity="0.22" />
        </>
      );
    case 'peaks':
      return (
        <>
          <circle cx="82" cy="24" r="6" fill="#fff" fillOpacity="0.25" />
          <polygon points="-10,100 25,48 55,100" fill="#fff" fillOpacity="0.1" />
          <polygon points="20,100 60,38 100,100" fill="#fff" fillOpacity="0.14" />
          <polygon points="52,48 60,38 68,48 63,46 60,49 56,46" fill="#fff" fillOpacity="0.35" />
          <polygon points="55,100 90,55 120,100" fill="#000" fillOpacity="0.18" />
        </>
      );
    case 'stripes':
      return (
        <g transform="rotate(-35 50 50)">
          {Array.from({ length: 14 }, (_, i) => (
            <rect
              key={i}
              x={-40 + i * 13}
              y="-40"
              width={5 + (i % 3) * 2}
              height="180"
              fill="#fff"
              fillOpacity={0.05 + (i % 4) * 0.03}
            />
          ))}
        </g>
      );
    case 'city':
      return (
        <>
          <circle cx="78" cy="22" r="7" fill="#fff" fillOpacity="0.3" />
          {buildings.map(([x, width, height]) => (
            <rect
              key={x}
              x={x}
              y={100 - height}
              width={width}
              height={height}
              fill="#000"
              fillOpacity="0.35"
            />
          ))}
        </>
      );
    case 'rings':
      return (
        <>
          {[10, 18, 26, 34, 42, 50, 58].map((r, i) => (
            <circle
              key={r}
              cx="78"
              cy="28"
              r={r}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.3 - i * 0.035}
              strokeWidth="0.8"
            />
          ))}
          <circle cx="78" cy="28" r="5" fill="#fff" fillOpacity="0.35" />
        </>
      );
  }
}
