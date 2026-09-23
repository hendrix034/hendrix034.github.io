'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AboutContent,
  ContactContent,
  DesktopContext,
  ProjectContent,
  ProjectsContent,
  RecycleContent,
  SkillsContent,
  WelcomeContent,
  isTouchClick,
  type AppId,
  type WindowKey,
} from './content';
import { projects } from './data';
import PixelIcon, { type IconName } from './icons';
import Window from './Window';

const TASKBAR_HEIGHT = 40;

type OpenWindow = {
  key: WindowKey;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

type WindowMeta = { title: string; icon: IconName; width: number; content: ReactNode };

const apps: Record<AppId, Omit<WindowMeta, 'content'> & { content: () => ReactNode }> = {
  welcome: { title: 'Welcome', icon: 'welcome', width: 580, content: () => <WelcomeContent /> },
  about: { title: 'About Me', icon: 'about', width: 660, content: () => <AboutContent /> },
  projects: { title: 'Projects', icon: 'folder', width: 740, content: () => <ProjectsContent /> },
  skills: { title: 'Skills', icon: 'skills', width: 470, content: () => <SkillsContent /> },
  contact: { title: 'Contact', icon: 'contact', width: 470, content: () => <ContactContent /> },
  recycle: { title: 'Recycle Bin', icon: 'recycle', width: 380, content: () => <RecycleContent /> },
};

function isAppId(value: string | null): value is AppId {
  return value !== null && value in apps;
}

function windowMeta(key: WindowKey): WindowMeta | null {
  if (key.startsWith('project:')) {
    const project = projects.find((p) => `project:${p.id}` === key);
    return project
      ? { title: project.title, icon: project.icon, width: 800, content: <ProjectContent project={project} /> }
      : null;
  }
  const app = apps[key as AppId];
  return { title: app.title, icon: app.icon, width: app.width, content: app.content() };
}

type DesktopItem =
  | { id: string; label: string; icon: IconName; app: AppId }
  | { id: string; label: string; icon: IconName; href: string };

const desktopItems: DesktopItem[] = [
  { id: 'about', label: 'About Me', icon: 'about', app: 'about' },
  { id: 'projects', label: 'Projects', icon: 'folder', app: 'projects' },
  { id: 'skills', label: 'Skills', icon: 'skills', app: 'skills' },
  { id: 'contact', label: 'Contact', icon: 'contact', app: 'contact' },
  { id: 'recycle', label: 'Recycle Bin', icon: 'recycle', app: 'recycle' },
  ...projects
    .filter((p) => p.demo)
    .map((p) => ({ id: `demo-${p.id}`, label: p.title.replace(' Application', ''), icon: p.icon, href: p.demo as string })),
];

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="tabular-nums">
      {now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
    </span>
  );
}

export default function Desktop() {
  const router = useRouter();
  const [windows, setWindows] = useState<OpenWindow[]>([
    { key: 'welcome', x: 220, y: 60, z: 1, minimized: false, maximized: false },
  ]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [shutDown, setShutDown] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const zCounter = useRef(1);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const nextZ = () => {
    zCounter.current += 1;
    return zCounter.current;
  };

  const open = useCallback((key: WindowKey) => {
    setStartOpen(false);
    setWindows((current) => {
      const z = nextZ();
      if (current.some((w) => w.key === key)) {
        return current.map((w) => (w.key === key ? { ...w, minimized: false, z } : w));
      }
      const width = windowMeta(key)?.width ?? 500;
      const offset = current.length * 28;
      const x = Math.max(8, Math.min(150 + offset, window.innerWidth - width - 8));
      const y = Math.max(8, Math.min(36 + offset, window.innerHeight - TASKBAR_HEIGHT - 240));
      return [...current, { key, x, y, z, minimized: false, maximized: false }];
    });
  }, []);

  const close = useCallback((key: WindowKey) => {
    setWindows((current) => current.filter((w) => w.key !== key));
  }, []);

  const focus = useCallback((key: WindowKey) => {
    setWindows((current) => {
      const top = current.reduce((max, w) => Math.max(max, w.z), 0);
      const target = current.find((w) => w.key === key);
      if (!target || (target.z === top && !target.minimized)) return current;
      const z = nextZ();
      return current.map((w) => (w.key === key ? { ...w, minimized: false, z } : w));
    });
  }, []);

  const update = (key: WindowKey, change: Partial<OpenWindow>) =>
    setWindows((current) => current.map((w) => (w.key === key ? { ...w, ...change } : w)));

  const move = (key: WindowKey, x: number, y: number) => {
    const width = windowMeta(key)?.width ?? 500;
    update(key, {
      x: Math.max(-(width - 80), Math.min(x, window.innerWidth - 80)),
      y: Math.max(0, Math.min(y, window.innerHeight - TASKBAR_HEIGHT - 24)),
    });
  };

  // Center the welcome window, honor ?open=projects deep links, and track screen size.
  useEffect(() => {
    setWindows((current) =>
      current.map((w) =>
        w.key === 'welcome'
          ? {
              ...w,
              x: Math.max(8, Math.round((window.innerWidth - 580) / 2)),
              y: Math.max(8, Math.round((window.innerHeight - TASKBAR_HEIGHT) * 0.1)),
            }
          : w,
      ),
    );
    const requested = new URLSearchParams(window.location.search).get('open');
    if (isAppId(requested)) open(requested);

    const query = window.matchMedia('(max-width: 767px)');
    const sync = () => setSmallScreen(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [open]);

  // Close the Start menu on outside clicks or Escape.
  useEffect(() => {
    if (!startOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!startMenuRef.current?.contains(target) && !startButtonRef.current?.contains(target)) setStartOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStartOpen(false);
        startButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [startOpen]);

  const activeKey = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    return visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).key : null;
  }, [windows]);

  const activateItem = (item: DesktopItem) => {
    if ('app' in item) open(item.app);
    else router.push(item.href);
  };

  const onTaskbarClick = (key: WindowKey) => {
    const target = windows.find((w) => w.key === key);
    if (target && key === activeKey && !target.minimized) update(key, { minimized: true });
    else focus(key);
  };

  if (shutDown) {
    return (
      <button
        type="button"
        autoFocus
        onClick={() => setShutDown(false)}
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-black px-6 text-center font-bold text-[#ff8a00]"
      >
        <span className="text-2xl leading-snug md:text-4xl">
          It&apos;s now safe to turn off
          <br />
          your computer.
        </span>
        <span className="text-sm font-normal text-[#ffb35c]">Click anywhere to start again</span>
      </button>
    );
  }

  const menuItemClass =
    'flex w-full items-center gap-3 px-2 py-1.5 text-left text-[13px] hover:bg-[#000080] hover:text-white focus-visible:bg-[#000080] focus-visible:text-white focus-visible:outline-none';

  return (
    <DesktopContext.Provider value={{ open, close }}>
      <div className="win98 fixed inset-0 overflow-hidden bg-[#008080]">
        <h1 className="sr-only">John Hendrix Nagle, full stack developer. Portfolio.</h1>

        {/* Desktop area above the taskbar */}
        <div
          className="absolute inset-x-0 top-0"
          style={{ bottom: TASKBAR_HEIGHT }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setSelectedIcon(null);
          }}
        >
          <ul
            className="grid grid-cols-4 content-start gap-1 p-2 sm:grid-cols-6 md:h-full md:grid-flow-col md:auto-cols-[86px] md:grid-cols-none md:grid-rows-[repeat(auto-fill,88px)] md:justify-start"
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) setSelectedIcon(null);
            }}
          >
            {desktopItems.map((item) => {
              const selected = selectedIcon === item.id;
              return (
                <li key={item.id} className="flex justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      setSelectedIcon(item.id);
                      if (isTouchClick(e)) activateItem(item);
                    }}
                    onDoubleClick={() => activateItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        activateItem(item);
                      }
                    }}
                    className="flex w-[78px] select-none flex-col items-center gap-1 p-1 text-center text-[12px] text-white outline-none"
                  >
                    <span
                      className="relative h-8 w-8"
                      style={
                        selected
                          ? { filter: 'brightness(0.65) sepia(1) hue-rotate(185deg) saturate(5)' }
                          : undefined
                      }
                    >
                      <PixelIcon name={item.icon} />
                      {'href' in item && (
                        <svg viewBox="0 0 10 10" className="absolute -bottom-0.5 -left-0.5 h-3 w-3" aria-hidden="true">
                          <rect width="10" height="10" fill="#fff" stroke="#000" />
                          <path d="M3 7l4-4M4 3h3v3" fill="none" stroke="#000" strokeWidth="1.2" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`px-0.5 leading-tight ${
                        selected
                          ? 'bg-[#000080] outline-dotted outline-1 outline-white'
                          : '[text-shadow:1px_1px_0_#000]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {windows.map((w) => {
            const meta = windowMeta(w.key);
            if (!meta) return null;
            return (
              <Window
                key={w.key}
                id={w.key}
                title={meta.title}
                icon={meta.icon}
                x={w.x}
                y={w.y}
                z={w.z}
                width={meta.width}
                active={w.key === activeKey}
                minimized={w.minimized}
                maximized={w.maximized}
                fullScreen={smallScreen}
                onFocus={() => focus(w.key)}
                onClose={() => close(w.key)}
                onMinimize={() => update(w.key, { minimized: true })}
                onToggleMaximize={() => update(w.key, { maximized: !w.maximized })}
                onMove={(x, y) => move(w.key, x, y)}
              >
                {meta.content}
              </Window>
            );
          })}
        </div>

        {/* Start menu */}
        {startOpen && (
          <div
            ref={startMenuRef}
            role="menu"
            aria-label="Start menu"
            className="win-raised absolute left-[2px] z-[1001] flex w-64 p-[3px]"
            style={{ bottom: TASKBAR_HEIGHT - 2 }}
          >
            <div className="flex w-7 shrink-0 items-end justify-center bg-gradient-to-t from-[#000080] to-[#1084d0] pb-2">
              <span className="rotate-180 whitespace-nowrap text-[17px] font-bold tracking-wide text-white [writing-mode:vertical-rl]">
                JohnOS <span className="font-normal text-[#c0d8f8]">98</span>
              </span>
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              {(['about', 'projects', 'skills', 'contact'] as const).map((app) => (
                <button key={app} type="button" role="menuitem" onClick={() => open(app)} className={menuItemClass}>
                  <PixelIcon name={apps[app].icon} className="h-6 w-6 shrink-0" />
                  {apps[app].title}
                </button>
              ))}
              <div className="win-separator mx-1 my-1" role="separator" />
              {projects
                .filter((p) => p.demo)
                .map((p) => (
                  <Link key={p.id} href={p.demo as string} role="menuitem" className={menuItemClass}>
                    <PixelIcon name={p.icon} className="h-6 w-6 shrink-0" />
                    {p.title}
                  </Link>
                ))}
              <div className="win-separator mx-1 my-1" role="separator" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setStartOpen(false);
                  setShutDown(true);
                }}
                className={menuItemClass}
              >
                <PixelIcon name="shutdown" className="h-6 w-6 shrink-0" />
                Shut Down...
              </button>
            </div>
          </div>
        )}

        {/* Taskbar */}
        <footer
          className="win-raised absolute inset-x-0 bottom-0 z-[1000] flex items-center gap-1 px-[3px]"
          style={{ height: TASKBAR_HEIGHT }}
        >
          <button
            ref={startButtonRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={startOpen}
            onClick={() => setStartOpen((o) => !o)}
            className={`win-button h-[30px] min-w-0 shrink-0 gap-1 px-1.5 font-bold ${startOpen ? 'win-button-pressed' : ''}`}
          >
            <PixelIcon name="welcome" className="h-5 w-5" />
            Start
          </button>
          <div className="mx-0.5 h-[28px] w-[2px] border-l border-r border-l-[#808080] border-r-white" aria-hidden="true" />
          <nav aria-label="Open windows" className="flex min-w-0 flex-1 gap-1 overflow-hidden">
            {windows.map((w) => {
              const meta = windowMeta(w.key);
              if (!meta) return null;
              const isActive = w.key === activeKey;
              return (
                <button
                  key={w.key}
                  type="button"
                  onClick={() => onTaskbarClick(w.key)}
                  aria-pressed={isActive}
                  className={`win-button h-[30px] min-w-0 max-w-[170px] flex-1 justify-start gap-1.5 px-1.5 ${
                    isActive ? 'win-button-pressed win-dither font-bold' : ''
                  }`}
                >
                  <PixelIcon name={meta.icon} className="h-4 w-4 shrink-0" />
                  <span className="truncate">{meta.title}</span>
                </button>
              );
            })}
          </nav>
          <div className="win-status flex h-[30px] shrink-0 items-center gap-2 px-2.5 text-[13px]">
            <Clock />
          </div>
        </footer>
      </div>
    </DesktopContext.Provider>
  );
}
