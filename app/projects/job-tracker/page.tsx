'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ApplicationDetails from './_components/ApplicationDetails';
import ApplicationForm from './_components/ApplicationForm';
import ApplicationList from './_components/ApplicationList';
import Board from './_components/Board';
import Dashboard from './_components/Dashboard';
import Dialog from './_components/Dialog';
import Header, { type View } from './_components/Header';
import { BriefcaseIcon, PlusIcon, RefreshIcon } from './_components/icons';
import { cardClass, primaryButtonClass, secondaryButtonClass } from './_components/ui';
import { JobsProvider, useJobs } from './_lib/store';
import type { Application, ApplicationInput } from './_lib/types';

export default function JobTrackerPage() {
  return (
    <JobsProvider>
      <JobTracker />
    </JobsProvider>
  );
}

function JobTracker() {
  const { loaded, applications, isDemo, addApplication, updateApplication, clearAll, resetDemo } = useJobs();
  const [view, setView] = useState<View>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Application | 'new' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const deepLinkHandled = useRef(false);

  // Deep links: ?view=board and ?app=<id> (used for screenshots and sharing a view).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('view');
    if (requested === 'dashboard' || requested === 'board' || requested === 'list') setView(requested);
  }, []);

  useEffect(() => {
    if (!loaded || deepLinkHandled.current) return;
    deepLinkHandled.current = true;
    const id = new URLSearchParams(window.location.search).get('app');
    if (id && applications.some((app) => app.id === id)) setSelectedId(id);
  }, [loaded, applications]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const selected = selectedId ? applications.find((app) => app.id === selectedId) : undefined;
  const closeDetails = useCallback(() => setSelectedId(null), []);
  const closeForm = useCallback(() => setEditing(null), []);

  const handleSubmit = (input: ApplicationInput) => {
    if (editing === 'new') {
      addApplication(input);
      setMessage(`Added ${input.company}`);
    } else if (editing) {
      updateApplication(editing.id, input);
      setMessage('Changes saved');
    }
    setEditing(null);
  };

  let content;
  if (!loaded) {
    content = <p className="py-20 text-center text-sm text-gray-500">Loading your applications...</p>;
  } else if (applications.length === 0) {
    content = (
      <div className={`${cardClass} mx-auto max-w-lg px-6 py-14 text-center`}>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <BriefcaseIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No applications yet</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add the first job you applied for, or load sample data to explore the app.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button type="button" onClick={() => setEditing('new')} className={primaryButtonClass}>
            <PlusIcon className="h-4 w-4" />
            Add application
          </button>
          <button type="button" onClick={resetDemo} className={secondaryButtonClass}>
            <RefreshIcon className="h-4 w-4" />
            Load sample data
          </button>
        </div>
      </div>
    );
  } else if (view === 'dashboard') {
    content = <Dashboard applications={applications} onOpen={setSelectedId} />;
  } else if (view === 'board') {
    content = <Board applications={applications} onOpen={setSelectedId} />;
  } else {
    content = <ApplicationList applications={applications} onOpen={setSelectedId} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header view={view} onViewChange={setView} onAdd={() => setEditing('new')} onNotify={setMessage} />

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {loaded && isDemo && applications.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            <p>
              <strong className="font-semibold">You are looking at sample data.</strong> The companies are
              fictional, and everything you change is saved only in this browser.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete the sample data and start with an empty tracker?')) clearAll();
              }}
              className="shrink-0 font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-300"
            >
              Start fresh
            </button>
          </div>
        )}
        {content}
      </main>

      <footer className="mx-auto max-w-[1440px] px-4 pb-10 pt-4 text-sm text-gray-500 sm:px-6 lg:px-8 dark:text-gray-400">
        JobTrack is a front-end project built with Next.js, TypeScript, and Tailwind CSS. Data stays in your
        browser (localStorage) and can be exported as JSON.{' '}
        <Link href="/?open=projects" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Back to portfolio
        </Link>
      </footer>

      {selected && !editing && (
        <ApplicationDetails application={selected} onEdit={() => setEditing(selected)} onClose={closeDetails} />
      )}
      {editing && (
        <Dialog
          title={editing === 'new' ? 'Add application' : 'Edit application'}
          description={editing === 'new' ? undefined : `${editing.company} · ${editing.position}`}
          onClose={closeForm}
        >
          <ApplicationForm
            application={editing === 'new' ? undefined : editing}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </Dialog>
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        {message && (
          <p className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-gray-900">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
