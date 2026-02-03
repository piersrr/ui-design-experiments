'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/experiments', label: 'CSS Experiments' },
];

export default function LeftNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="flex w-56 shrink-0 flex-col border-r border-zinc-300 bg-zinc-100/90 p-4 dark:border-zinc-800 dark:bg-zinc-950/80"
      aria-label="Main navigation"
    >
      <div className="mb-4 flex items-center justify-between px-2">
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
      </div>
      <div className="mb-6 px-2">
        <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Control Centre
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
    </nav>
  );
}
