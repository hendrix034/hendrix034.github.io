import type { ReactElement } from 'react';

export type IconName =
  | 'about'
  | 'folder'
  | 'skills'
  | 'contact'
  | 'recycle'
  | 'welcome'
  | 'jobtrack'
  | 'netflix'
  | 'spotify'
  | 'cart'
  | 'shutdown';

const outline = '#1a1a1a';

// Hand-drawn 32x32 icons in the style of late-90s desktops.
const shapes: Record<IconName, ReactElement> = {
  folder: (
    <>
      <path d="M2 7h11l2 3h15v18H2z" fill="#c9a227" />
      <path d="M2 12h28v16H2z" fill="#f5d76e" />
      <path d="M2 12h28v1H2z" fill="#fff3b0" />
      <path d="M2 27h28v1H2zM29 12h1v16h-1z" fill="#8a6d0b" />
    </>
  ),
  about: (
    <>
      <rect x="3" y="6" width="26" height="20" fill="#ffffff" stroke={outline} />
      <rect x="6" y="9" width="9" height="11" fill="#9ec5f4" />
      <circle cx="10.5" cy="13" r="2.5" fill="#f1c38e" />
      <path d="M6.5 20c0-3 2-4.5 4-4.5s4 1.5 4 4.5z" fill="#1c5cab" />
      <rect x="17" y="10" width="9" height="2" fill="#808080" />
      <rect x="17" y="14" width="7" height="2" fill="#808080" />
      <rect x="17" y="18" width="8" height="2" fill="#808080" />
      <rect x="6" y="22" width="20" height="1" fill="#c0c0c0" />
    </>
  ),
  skills: (
    <>
      <rect x="3" y="4" width="26" height="18" fill="#c0c0c0" stroke={outline} />
      <rect x="6" y="7" width="20" height="12" fill="#008080" />
      <rect x="8" y="9" width="8" height="2" fill="#7ff0e0" />
      <rect x="8" y="13" width="12" height="2" fill="#7ff0e0" />
      <rect x="12" y="22" width="8" height="3" fill="#808080" />
      <rect x="7" y="25" width="18" height="3" fill="#c0c0c0" stroke={outline} />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="8" width="26" height="17" fill="#ffffff" stroke={outline} />
      <path d="M3.5 8.5 16 18l12.5-9.5" fill="none" stroke={outline} />
      <path d="M3.5 24.5 12 16M28.5 24.5 20 16" fill="none" stroke="#808080" />
      <rect x="22" y="10" width="5" height="4" fill="#e34948" />
    </>
  ),
  recycle: (
    <>
      <rect x="6" y="6" width="20" height="3" fill="#c0c0c0" stroke={outline} />
      <path d="M8 9h16l-2 19H10z" fill="#dfdfdf" stroke={outline} />
      <path d="M12 12v13M16 12v13M20 12v13" stroke="#808080" />
    </>
  ),
  welcome: (
    <>
      <rect x="3" y="5" width="26" height="22" fill="#c0c0c0" stroke={outline} />
      <rect x="4" y="6" width="24" height="4" fill="#000080" />
      <rect x="25" y="7" width="2" height="2" fill="#c0c0c0" />
      <rect x="5" y="12" width="22" height="13" fill="#ffffff" />
      <rect x="7" y="14" width="12" height="2" fill="#000080" />
      <rect x="7" y="18" width="16" height="1" fill="#808080" />
      <rect x="7" y="21" width="14" height="1" fill="#808080" />
    </>
  ),
  jobtrack: (
    <>
      <rect x="3" y="3" width="26" height="26" rx="5" fill="#2563eb" />
      <rect x="8" y="12" width="16" height="11" fill="#ffffff" />
      <path d="M13 12V9h6v3" fill="none" stroke="#ffffff" strokeWidth="2" />
      <rect x="8" y="16" width="16" height="1" fill="#2563eb" />
    </>
  ),
  netflix: (
    <>
      <rect x="3" y="3" width="26" height="26" fill="#141414" />
      <path d="M10 7h4l4 10V7h4v18h-4l-4-10v10h-4z" fill="#e50914" />
    </>
  ),
  spotify: (
    <>
      <circle cx="16" cy="16" r="13" fill="#1ed760" />
      <path d="M9 12.5c5-1.5 10-1 14.5 1.5" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 16.5c4-1 8-.7 11.5 1.2" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 20.3c3-.7 6-.5 8.5.9" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  cart: (
    <>
      <path d="M3 7h4l3 13h15l3-9H9" fill="none" stroke="#000080" strokeWidth="2" />
      <path d="M10 13h16l-2 5H11z" fill="#9ec5f4" />
      <circle cx="12" cy="25" r="2" fill={outline} />
      <circle cx="23" cy="25" r="2" fill={outline} />
    </>
  ),
  shutdown: (
    <>
      <rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke={outline} />
      <path d="M11 11a8 8 0 1 0 10 0" fill="none" stroke="#b91c1c" strokeWidth="2.5" />
      <path d="M16 7v9" stroke="#b91c1c" strokeWidth="2.5" />
    </>
  ),
};

export default function PixelIcon({ name, className = 'h-8 w-8' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {shapes[name]}
    </svg>
  );
}
