'use client';

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import PixelIcon, { type IconName } from './icons';

type WindowProps = {
  id: string;
  title: string;
  icon: IconName;
  x: number;
  y: number;
  z: number;
  width: number;
  active: boolean;
  minimized: boolean;
  maximized: boolean;
  /** Small screens: every window fills the desktop and can't be dragged. */
  fullScreen: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
};

function TitleButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      className="win-title-button"
    >
      <svg viewBox="0 0 8 7" className="h-[7px] w-2" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

export default function Window({
  id,
  title,
  icon,
  x,
  y,
  z,
  width,
  active,
  minimized,
  maximized,
  fullScreen,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  children,
}: WindowProps) {
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const filled = maximized || fullScreen;
  const titleId = `window-${id.replace(/[^a-z0-9-]/gi, '-')}-title`;

  // Focus a window when it opens so keyboard users land inside it.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (filled || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - x, dy: e.clientY - y };
  };

  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    onMove(e.clientX - drag.current.dx, e.clientY - drag.current.dy);
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <section
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={titleId}
      onPointerDown={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      className={`win-raised absolute flex-col p-[3px] outline-none ${minimized ? 'hidden' : 'flex'} ${
        filled ? 'inset-0' : ''
      }`}
      style={
        filled
          ? { zIndex: z }
          : {
              left: x,
              top: y,
              width,
              maxWidth: 'calc(100vw - 16px)',
              maxHeight: `calc(100% - ${Math.max(y, 0)}px - 8px)`,
              zIndex: z,
            }
      }
    >
      <div
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => {
          if (!fullScreen) onToggleMaximize();
        }}
        className={`flex h-[22px] shrink-0 touch-none select-none items-center gap-1.5 px-[3px] ${
          active ? 'win-titlebar' : 'win-titlebar-inactive'
        }`}
      >
        <PixelIcon name={icon} className="h-4 w-4 shrink-0" />
        <h2 id={titleId} className="min-w-0 flex-1 truncate text-[13px] font-bold">
          {title}
        </h2>
        <div className="flex items-center gap-[2px]">
          <TitleButton label="Minimize" onClick={onMinimize}>
            <rect x="1" y="5" width="6" height="2" fill="#000" />
          </TitleButton>
          {!fullScreen && (
            <TitleButton label={maximized ? 'Restore' : 'Maximize'} onClick={onToggleMaximize}>
              <path d="M0.5 0.5h7v6h-7z" fill="none" stroke="#000" />
              <rect x="0" y="0" width="8" height="2" fill="#000" />
            </TitleButton>
          )}
          <span className="w-[2px]" />
          <TitleButton label="Close" onClick={onClose}>
            <path d="M1 0h1l2 2 2-2h1v1L5 3.5 7 6v1H6L4 5 2 7H1V6l2-2.5L1 1z" fill="#000" />
          </TitleButton>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}
