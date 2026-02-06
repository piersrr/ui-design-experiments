'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tabs', label: 'Tabs' },
  { href: '/dropdown', label: 'Dropdown' },
  { href: '/chat', label: 'Chat' },
  { href: '/carousel', label: 'Carousel' },
];

function ThemeToggle({ theme, toggleTheme }: { theme: 'light' | 'dark'; toggleTheme: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="Toggle light or dark mode"
      onClick={toggleTheme}
      className="relative flex h-9 w-[4.25rem] shrink-0 rounded-full border border-zinc-300 bg-zinc-200/80 transition-colors dark:border-zinc-700 dark:bg-zinc-800/80"
    >
      <span
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow-sm transition-[left] duration-200 dark:bg-zinc-700 ${
          theme === 'dark' ? 'left-8' : 'left-1'
        }`}
        aria-hidden
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
      <span className="flex h-full w-full items-center justify-between px-2.5 text-sm pointer-events-none">
        <span className={theme === 'light' ? 'opacity-100' : 'opacity-40'}>☀️</span>
        <span className={theme === 'dark' ? 'opacity-100' : 'opacity-40'}>🌙</span>
      </span>
    </button>
  );
}

function Logo({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <a
      href="https://piers.cc"
      target="_blank"
      rel="noopener noreferrer"
      className="block focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-100 dark:focus:ring-offset-zinc-950 rounded shrink-0"
      aria-label="Piers – open in new tab"
    >
      <Image
        src={theme === 'dark' ? '/prk-white.png' : '/prk-black.png'}
        alt=""
        width={120}
        height={40}
        className="h-10 w-auto object-contain"
      />
    </a>
  );
}

export default function LeftNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <ul className="flex flex-col gap-0.5">
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-600 hover:bg-zinc-300/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200'
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile: top bar + dropdown tray in flow (pushes content down when open) */}
      <div className="w-full shrink-0 md:hidden" aria-label="Mobile navigation">
        <header className="flex h-14 items-center justify-between border-b border-zinc-300 bg-zinc-100/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-zinc-100/90 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/90">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-300/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Logo theme={theme} />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        {/* Mobile: dropdown tray in flow — expands and pushes content down */}
        <div
          className="overflow-hidden transition-[max-height] duration-200 ease-out md:hidden"
          style={{ maxHeight: mobileOpen ? '12rem' : '0' }}
        >
          <nav
            className="border-b border-zinc-300 bg-zinc-100/95 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/95"
            aria-label="Main navigation"
          >
            {navLinks}
          </nav>
        </div>
      </div>

      {/* Desktop: sidebar */}
      <nav
        className="hidden w-56 shrink-0 flex-col border-r border-zinc-300 bg-zinc-100/90 p-4 dark:border-zinc-800 dark:bg-zinc-950/80 md:flex"
        aria-label="Main navigation"
      >
        <div className="mb-4 flex items-center justify-between px-2">
          <Logo theme={theme} />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <div className="mb-6 px-2" />
        {navLinks}
      </nav>
    </>
  );
}
