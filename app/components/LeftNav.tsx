'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/experiments', label: 'CSS Experiments' },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950/80 p-4"
      aria-label="Main navigation"
    >
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
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
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
