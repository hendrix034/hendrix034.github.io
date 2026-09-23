'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EMAIL, facts, projects, skillGroups, socialLinks, type Project } from './data';
import PixelIcon, { type IconName } from './icons';

export type AppId = 'welcome' | 'about' | 'projects' | 'skills' | 'contact' | 'recycle';
export type WindowKey = AppId | `project:${string}`;

type DesktopActions = {
  open: (key: WindowKey) => void;
  close: (key: WindowKey) => void;
};

export const DesktopContext = createContext<DesktopActions | null>(null);

function useDesktop(): DesktopActions {
  const actions = useContext(DesktopContext);
  if (!actions) throw new Error('Window content must be rendered inside <Desktop>');
  return actions;
}

/** True when the click came from a finger, where double-click isn't practical. */
export function isTouchClick(event: { nativeEvent: Event }): boolean {
  const pointerType = (event.nativeEvent as PointerEvent).pointerType;
  return pointerType === 'touch' || window.matchMedia('(pointer: coarse)').matches;
}

function GroupBox({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="win-groupbox">
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}

// --- Welcome ------------------------------------------------------------------

export function WelcomeContent() {
  const { open } = useDesktop();
  const shortcuts: { key: AppId; label: string; icon: IconName }[] = [
    { key: 'projects', label: 'Projects', icon: 'folder' },
    { key: 'about', label: 'About me', icon: 'about' },
    { key: 'skills', label: 'Skills', icon: 'skills' },
    { key: 'contact', label: 'Contact', icon: 'contact' },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row">
      <div className="min-w-0 flex-1 space-y-3">
        <p className="text-[22px] font-bold leading-tight">
          Welcome to <span className="text-[#000080]">JohnOS</span> 98
        </p>
        <div className="win-field space-y-2 p-3 text-[14px] leading-relaxed">
          <p>
            Hi, I&apos;m <strong>John Hendrix Nagle</strong>, a full stack developer from the Philippines.
          </p>
          <p>
            I build web apps with Laravel, Node.js, React, Vue, and Next.js. This desktop is my portfolio: open
            the folders to see my projects, skills, and how to reach me.
          </p>
          <p className="flex items-center gap-2 font-bold">
            <span className="h-2.5 w-2.5 shrink-0 bg-[#00a800]" aria-hidden="true" />
            Open to full-time and freelance work
          </p>
        </div>
        <p className="text-[12px] text-[#404040]">Tip: double-click (or tap) an icon on the desktop to open it.</p>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:w-40">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.key}
            type="button"
            onClick={() => open(shortcut.key)}
            className="win-button justify-start"
          >
            <PixelIcon name={shortcut.icon} className="h-5 w-5" />
            {shortcut.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- About ----------------------------------------------------------------------

export function AboutContent() {
  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      <div className="win-sunken shrink-0 self-start p-[2px]">
        <div className="relative h-56 w-44">
          <Image
            src="/FB_IMG_1579531407695.jpg"
            alt="John Hendrix Nagle"
            fill
            sizes="176px"
            className="object-cover object-[50%_40%]"
          />
        </div>
      </div>
      <div className="min-w-0 space-y-3 text-[14px] leading-relaxed">
        <h3 className="text-[18px] font-bold">John Hendrix Nagle</h3>
        <p>
          On the back end I use PHP and Laravel, Node.js, and REST APIs, with MySQL, PostgreSQL, SQL Server, or
          MongoDB behind them. On the front end I work mostly in React, Next.js, and Vue, and I have also used
          Angular and Ionic.
        </p>
        <p>
          Right now I am looking for my next full-time role and taking freelance work on Upwork. The Projects
          folder has my recent builds: a job application tracker and two UI clones.
        </p>
        <GroupBox legend="Details">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="text-[12px] text-[#404040]">{fact.term}</dt>
                <dd className="font-bold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </GroupBox>
      </div>
    </div>
  );
}

// --- Projects (Explorer-style folder) --------------------------------------------

export function ProjectsContent() {
  const { open } = useDesktop();
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];

  return (
    <div className="flex h-full min-h-[340px] flex-col gap-[3px]">
      <div className="flex items-center gap-2 px-1 pt-1 text-[13px]">
        <span className="text-[#404040]">Address</span>
        <div className="win-field flex min-w-0 flex-1 items-center gap-1.5 px-1.5 py-[3px]">
          <PixelIcon name="folder" className="h-4 w-4 shrink-0" />
          <span className="truncate">C:\My Documents\Projects</span>
        </div>
      </div>

      <div className="win-sunken flex min-h-0 flex-1 bg-white p-[2px]">
        <aside className="hidden w-56 shrink-0 overflow-auto bg-gradient-to-b from-white to-[#dce8f7] p-3 sm:block">
          <PixelIcon name={selected.icon} className="h-10 w-10" />
          <h3 className="mt-2 text-[15px] font-bold leading-tight">{selected.title}</h3>
          {selected.kind && <p className="text-[12px] text-[#404040]">{selected.kind}</p>}
          <hr className="my-2 border-[#1084d0]" />
          <p className="text-[12px] leading-relaxed">{selected.description}</p>
          <button type="button" onClick={() => open(`project:${selected.id}`)} className="win-button mt-3">
            Open
          </button>
        </aside>

        <ul className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-start gap-2 overflow-auto p-3">
          {projects.map((project) => {
            const isSelected = project.id === selected.id;
            return (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={(e) => {
                    setSelectedId(project.id);
                    if (isTouchClick(e)) open(`project:${project.id}`);
                  }}
                  onDoubleClick={() => open(`project:${project.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      open(`project:${project.id}`);
                    }
                  }}
                  className="flex w-full flex-col items-center gap-1 p-1 text-center text-[12px] outline-none"
                >
                  <PixelIcon name={project.icon} className="h-8 w-8" />
                  <span
                    className={`px-0.5 leading-tight ${
                      isSelected ? 'bg-[#000080] text-white outline-dotted outline-1 outline-offset-0' : ''
                    }`}
                  >
                    {project.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex gap-[3px] text-[12px]">
        <p className="win-status flex-1 px-1.5 py-0.5">{projects.length} object(s)</p>
        <p className="win-status hidden w-48 truncate px-1.5 py-0.5 sm:block">{selected.title}</p>
      </div>
    </div>
  );
}

function Screenshots({ images }: { images: Project['images'] }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const step = (delta: number) => setIndex((i) => (i + delta + total) % total);
  const image = images[index];

  return (
    <div>
      <div className="win-sunken bg-[#808080] p-[2px]">
        <div className="relative aspect-[3/2]">
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="object-cover object-top"
          />
        </div>
      </div>
      {total > 1 && (
        <div className="mt-2 flex items-center justify-between gap-2 text-[13px]">
          <button type="button" onClick={() => step(-1)} className="win-button">
            &lt; Back
          </button>
          <span aria-live="polite">
            {index + 1} of {total}
          </span>
          <button type="button" onClick={() => step(1)} className="win-button">
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectContent({ project }: { project: Project }) {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <Screenshots images={project.images} />
      <div className="space-y-3 text-[14px] leading-relaxed">
        <div className="flex items-center gap-2">
          <PixelIcon name={project.icon} className="h-8 w-8 shrink-0" />
          <div>
            <h3 className="text-[18px] font-bold leading-tight">{project.title}</h3>
            {project.kind && <p className="text-[12px] text-[#404040]">{project.kind}</p>}
          </div>
        </div>
        <p>{project.description}</p>
        <GroupBox legend="Built with">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
            {project.tech.map((tech) => (
              <li key={tech} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 bg-[#000080]" aria-hidden="true" />
                {tech}
              </li>
            ))}
          </ul>
        </GroupBox>
        {project.demo ? (
          <Link href={project.demo} className="win-button font-bold">
            Open live demo
          </Link>
        ) : (
          <p className="text-[12px] text-[#404040]">Screenshots only. This project has no live demo.</p>
        )}
      </div>
    </div>
  );
}

// --- Skills (tabbed properties dialog) ---------------------------------------------

export function SkillsContent() {
  const { close } = useDesktop();
  const [tab, setTab] = useState(0);
  const group = skillGroups[tab];

  return (
    <div className="p-3">
      <div role="tablist" aria-label="Skill categories" className="flex flex-wrap pl-[2px]">
        {skillGroups.map((g, i) => (
          <button
            key={g.title}
            type="button"
            role="tab"
            id={`skills-tab-${i}`}
            aria-selected={tab === i}
            aria-controls="skills-panel"
            onClick={() => setTab(i)}
            className="win-tab"
          >
            {g.title}
          </button>
        ))}
      </div>
      <div id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${tab}`} className="win-raised p-4">
        <GroupBox legend={group.title}>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[14px]">
            {group.skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 bg-[#000080]" aria-hidden="true" />
                {skill}
              </li>
            ))}
          </ul>
        </GroupBox>
        <p className="mt-3 text-[12px] text-[#404040]">Languages, frameworks, and services I have used in projects.</p>
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={() => close('skills')} className="win-button">
          OK
        </button>
      </div>
    </div>
  );
}

// --- Contact ------------------------------------------------------------------------

export function ContactContent() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address stays visible and selectable.
    }
  };

  return (
    <div className="space-y-4 p-4 text-[14px]">
      <div className="flex items-start gap-3">
        <PixelIcon name="contact" className="h-8 w-8 shrink-0" />
        <p className="leading-relaxed">Have a role or a project in mind? Email is the best way to reach me.</p>
      </div>
      <GroupBox legend="E-mail">
        <div className="flex flex-wrap items-center gap-2">
          <input
            readOnly
            value={EMAIL}
            aria-label="Email address"
            onFocus={(e) => e.currentTarget.select()}
            className="win-field min-w-0 flex-1 px-1.5 py-1 text-[13px] outline-none"
          />
          <button type="button" onClick={copyEmail} className="win-button">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <a href={`mailto:${EMAIL}`} className="win-button mt-3 font-bold">
          Send e-mail...
        </a>
      </GroupBox>
      <GroupBox legend="Find me on">
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="win-button">
              {link.name}
            </a>
          ))}
        </div>
      </GroupBox>
    </div>
  );
}

// --- Recycle Bin ----------------------------------------------------------------------

export function RecycleContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-[13px]">
      <PixelIcon name="recycle" className="h-10 w-10" />
      <p>The Recycle Bin is empty.</p>
    </div>
  );
}
