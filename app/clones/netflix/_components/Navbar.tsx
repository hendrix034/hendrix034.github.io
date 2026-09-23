'use client';

import { useEffect, useRef, useState } from 'react';
import { BellIcon, CloseIcon, SearchIcon } from '../../_shared/icons';
import { tabs, type Tab } from '../data';

type NavbarProps = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export default function Navbar({ tab, onTabChange, query, onQueryChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the box open when a query arrives from a deep link.
  useEffect(() => {
    if (query) setSearchOpen(true);
  }, [query]);

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const solid = scrolled || query !== '' || tab === 'mylist';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <nav className="flex h-16 items-center gap-4 px-4 md:h-[68px] md:gap-10 md:px-12">
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="text-2xl font-black tracking-tighter text-[#e50914] md:text-[1.9rem]"
        >
          NETFLIX
        </button>

        <ul className="hidden items-center gap-5 text-sm lg:flex">
          {tabs.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={tab === item.id && !query ? 'page' : undefined}
                className={`transition-colors ${
                  tab === item.id && !query
                    ? 'font-semibold text-white'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <label className="lg:hidden">
          <span className="sr-only">Browse</span>
          <select
            value={tab}
            onChange={(e) => onTabChange(e.target.value as Tab)}
            className="bg-transparent text-sm font-semibold outline-none"
          >
            {tabs.map((item) => (
              <option key={item.id} value={item.id} className="bg-black">
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className="ml-auto flex items-center gap-4 md:gap-6">
          <div
            className={`flex items-center gap-2 border px-2 py-1 transition-colors ${
              searchOpen ? 'border-white bg-black/80' : 'border-transparent'
            }`}
          >
            <button type="button" onClick={openSearch} aria-label="Search">
              <SearchIcon className="h-5 w-5" />
            </button>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onBlur={() => {
                if (!query) setSearchOpen(false);
              }}
              tabIndex={searchOpen ? 0 : -1}
              placeholder="Titles, people, genres"
              aria-label="Search titles, people, and genres"
              className={`bg-transparent text-sm outline-none transition-all duration-300 placeholder:text-gray-400 ${
                searchOpen ? 'w-28 sm:w-56' : 'w-0'
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  onQueryChange('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <button type="button" aria-label="Notifications" className="relative hidden sm:block">
            <BellIcon className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#e50914]" />
          </button>
          <div
            className="h-8 w-8 rounded bg-gradient-to-br from-sky-400 to-indigo-600"
            aria-hidden="true"
          />
        </div>
      </nav>
    </header>
  );
}
