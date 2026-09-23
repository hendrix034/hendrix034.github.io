'use client';

import { useEffect, useRef, type ChangeEvent, type ComponentType, type SVGProps } from 'react';
import Link from 'next/link';
import { toISODate } from '../_lib/format';
import { useJobs } from '../_lib/store';
import {
  ArrowLeftIcon,
  BoardIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  DashboardIcon,
  DownloadIcon,
  ListIcon,
  PlusIcon,
  RefreshIcon,
  TrashIcon,
  UploadIcon,
} from './icons';
import { primaryButtonClass, secondaryButtonClass } from './ui';

export type View = 'dashboard' | 'board' | 'list';

export const views: { id: View; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'board', label: 'Board', Icon: BoardIcon },
  { id: 'list', label: 'List', Icon: ListIcon },
];

type HeaderProps = {
  view: View;
  onViewChange: (view: View) => void;
  onAdd: () => void;
  onNotify: (message: string) => void;
};

export default function Header({ view, onViewChange, onAdd, onNotify }: HeaderProps) {
  const { applications, exportJson, importJson, resetDemo, clearAll } = useJobs();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const closeMenu = () => menuRef.current?.removeAttribute('open');
  const countLabel = (n: number) => `${n} ${n === 1 ? 'application' : 'applications'}`;

  // Close the data menu when clicking anywhere else.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-applications-${toISODate(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    closeMenu();
    onNotify(`Exported ${countLabel(applications.length)}`);
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    closeMenu();
    if (!file) return;
    if (!window.confirm('Importing replaces all applications currently in this browser. Continue?')) return;
    const count = importJson(await file.text());
    onNotify(count === null ? 'That file is not a valid export' : `Imported ${countLabel(count)}`);
  };

  const handleReset = () => {
    closeMenu();
    if (!window.confirm('Replace everything with the sample data?')) return;
    resetDemo();
    onNotify('Sample data loaded');
  };

  const handleClear = () => {
    closeMenu();
    if (!window.confirm('Delete all applications in this browser? Export first if you want a backup.')) return;
    clearAll();
    onNotify('All applications deleted');
  };

  const menuItem =
    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800';

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/?open=projects"
            aria-label="Back to portfolio"
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
            <BriefcaseIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold leading-tight text-gray-900 dark:text-white">JobTrack</p>
            <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">From wishlist to offer</p>
          </div>
        </div>

        <nav
          aria-label="Views"
          className="order-last flex w-full rounded-lg bg-gray-100 p-1 sm:order-none sm:w-auto dark:bg-gray-800"
        >
          {views.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              aria-current={view === id ? 'page' : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition sm:flex-none ${
                view === id
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <details ref={menuRef} className="relative">
            <summary className={`${secondaryButtonClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
              Data
              <ChevronDownIcon className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 z-40 mt-2 w-60 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <button type="button" onClick={handleExport} className={menuItem}>
                <DownloadIcon className="h-4 w-4" />
                Export as JSON
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className={menuItem}>
                <UploadIcon className="h-4 w-4" />
                Import from JSON
              </button>
              <button type="button" onClick={handleReset} className={menuItem}>
                <RefreshIcon className="h-4 w-4" />
                Load sample data
              </button>
              <button type="button" onClick={handleClear} className={`${menuItem} text-red-600 dark:text-red-400`}>
                <TrashIcon className="h-4 w-4" />
                Delete all
              </button>
            </div>
          </details>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
            tabIndex={-1}
          />
          <button type="button" onClick={onAdd} className={primaryButtonClass}>
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Add application</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
}
