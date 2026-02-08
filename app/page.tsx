'use client';

import Link from 'next/link';

const pages = [
  { href: '/dashboard/', label: 'Dashboard', description: 'KPIs, charts and analytics' },
  { href: '/tabs/', label: 'Tabs', description: 'Tabbed content components' },
  { href: '/dropdown/', label: 'Dropdown', description: 'Dropdown menus and selects' },
  { href: '/chat/', label: 'Chat', description: 'Chat interface and messaging' },
  { href: '/carousel/', label: 'Carousel', description: 'Motion card carousel and CSS marquee' },
  { href: '/accordion/', label: 'Accordion', description: 'Fluid expand/collapse with Motion' },
  { href: '/feed/', label: 'Feed', description: 'Feed and activity views' },
  { href: '/animation-states/', label: 'Animation states', description: 'Animation state demos' },
];

export default function Home() {
  return (
    <div className="h-full min-h-0 overflow-auto p-6 md:p-10">
      <div className="flex min-h-full flex-col items-center justify-center w-full max-w-4xl">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-200 md:text-3xl">
          UI Playground
        </h1>
        <p className="mb-10 text-zinc-600 dark:text-zinc-400">
          Choose a page to explore.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {pages.map(({ href, label, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-xl border border-zinc-300 bg-white p-6 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500"
            >
              <span className="text-lg font-medium text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                {label}
              </span>
              <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {description}
              </span>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400" aria-hidden>
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
