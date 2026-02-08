'use client';

import { Fragment, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, UserPlus, Tag } from 'lucide-react';

type ActivityComment = {
  id: number;
  type: 'comment';
  person: { name: string; href: string };
  imageUrl: string;
  comment: string;
  date: string;
};

type ActivityAssignment = {
  id: number;
  type: 'assignment';
  person: { name: string; href: string };
  assigned: { name: string; href: string };
  date: string;
};

type ActivityTags = {
  id: number;
  type: 'tags';
  person: { name: string; href: string };
  tags: Array<{ name: string; href: string; color: string }>;
  date: string;
};

type ActivityItem = ActivityComment | ActivityAssignment | ActivityTags;

const activity: ActivityItem[] = [
  {
    id: 1,
    type: 'comment',
    person: { name: 'Eduardo Benz', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment:
      'The new dashboard layout looks great. I’ve run it past the design team and we’re good to ship. Can we schedule the release for Tuesday?',
    date: '6d ago',
  },
  {
    id: 2,
    type: 'assignment',
    person: { name: 'Hilary Mahy', href: '#' },
    assigned: { name: 'Kristin Watson', href: '#' },
    date: '2d ago',
  },
  {
    id: 3,
    type: 'tags',
    person: { name: 'Hilary Mahy', href: '#' },
    tags: [
      { name: 'Bug', href: '#', color: 'bg-red-500' },
      { name: 'Accessibility', href: '#', color: 'bg-indigo-500' },
    ],
    date: '6h ago',
  },
  {
    id: 4,
    type: 'comment',
    person: { name: 'Jason Meyers', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment:
      'Thanks for the QA pass. I’ve fixed the focus trap in the modal and added the missing aria-labels. Ready for another review when you have time.',
    date: '2h ago',
  },
  {
    id: 5,
    type: 'assignment',
    person: { name: 'Leslie Alexander', href: '#' },
    assigned: { name: 'Michael Chen', href: '#' },
    date: '1d ago',
  },
  {
    id: 6,
    type: 'comment',
    person: { name: 'Sarah Kim', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment:
      'Heads up: the analytics API is returning 429s during peak hours. We’re scaling the cache layer and should have it stable by EOD.',
    date: '5h ago',
  },
  {
    id: 7,
    type: 'tags',
    person: { name: 'Tom Wilson', href: '#' },
    tags: [
      { name: 'Feature', href: '#', color: 'bg-emerald-500' },
      { name: 'API', href: '#', color: 'bg-amber-500' },
    ],
    date: '3h ago',
  },
  {
    id: 8,
    type: 'comment',
    person: { name: 'Alex Rivera', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment:
      'Documentation for the new webhooks is live. I’ve added examples for retries and idempotency keys. Let me know if you want more use cases.',
    date: '45m ago',
  },
];

function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const FILTER_OPTIONS = ['All', 'Comments', 'Assignments', 'Tags'] as const;
type FilterValue = (typeof FILTER_OPTIONS)[number];

function getFilterType(filter: FilterValue): ActivityItem['type'] | null {
  if (filter === 'All') return null;
  if (filter === 'Comments') return 'comment';
  if (filter === 'Assignments') return 'assignment';
  if (filter === 'Tags') return 'tags';
  return null;
}

export default function FeedPage() {
  const [filter, setFilter] = useState<FilterValue>('All');

  const filteredActivity = useMemo(() => {
    const type = getFilterType(filter);
    if (!type) return activity;
    return activity.filter((item) => item.type === type);
  }, [filter]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="flex shrink-0 flex-col gap-4 border-b border-zinc-300 bg-zinc-100/80 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950/80">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Feed</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Show:</span>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={classNames(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  filter === option
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-zinc-200/80 text-zinc-600 hover:bg-zinc-300/80 hover:text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-700/80 dark:hover:text-zinc-200'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6  bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-2xl ">
          <section aria-label="Activity feed" className="flow-root">
            <ul role="list" className="-mb-8">
              <AnimatePresence initial={false} mode="popLayout">
                {filteredActivity.map((activityItem, activityItemIdx) => (
                  <motion.li
                    key={activityItem.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.2,
                      delay: activityItemIdx * 0.03,
                      layout: { duration: 0.2 },
                    }}
                  >
                  <div className="relative pb-8">
                    {activityItemIdx !== filteredActivity.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-white/10"
                      />
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      {activityItem.type === 'comment' ? (
                        <>
                          <div className="relative shrink-0">
                            <img
                              alt=""
                              src={activityItem.imageUrl}
                              className="flex size-10 rounded-full bg-zinc-400 object-cover ring-8 ring-white outline outline-1 -outline-offset-1 outline-black/5 dark:ring-zinc-900 dark:outline-white/10"
                            />
                
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <a
                                  href={activityItem.person.href}
                                  className="font-medium text-zinc-900 hover:underline dark:text-white"
                                >
                                  {activityItem.person.name}
                                </a>
                              </div>
                              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                                Commented {activityItem.date}
                              </p>
                            </div>
                            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                              <p>{activityItem.comment}</p>
                            </div>
                          </div>
                        </>
                      ) : activityItem.type === 'assignment' ? (
                        <>
                          <div className="shrink-0">
                            <div className="relative px-1">
                              <div className="flex size-8 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-white dark:bg-zinc-800 dark:ring-zinc-900">
                                <UserPlus className="size-5 text-zinc-500 dark:text-zinc-400" />
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 py-1.5">
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                              <a
                                href={activityItem.person.href}
                                className="font-medium text-zinc-900 hover:underline dark:text-white"
                              >
                                {activityItem.person.name}
                              </a>{' '}
                              assigned{' '}
                              <a
                                href={activityItem.assigned.href}
                                className="font-medium text-zinc-900 hover:underline dark:text-white"
                              >
                                {activityItem.assigned.name}
                              </a>{' '}
                              <span className="whitespace-nowrap">{activityItem.date}</span>
                            </div>
                          </div>
                        </>
                      ) : activityItem.type === 'tags' ? (
                        <>
                          <div className="shrink-0">
                            <div className="relative px-1">
                              <div className="flex size-8 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-white dark:bg-zinc-800 dark:ring-zinc-900">
                                <Tag className="size-5 text-zinc-500 dark:text-zinc-400" />
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 py-0">
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                              <span className="mr-0.5">
                                <a
                                  href={activityItem.person.href}
                                  className="font-medium text-zinc-900 hover:underline dark:text-white"
                                >
                                  {activityItem.person.name}
                                </a>{' '}
                                added tags
                              </span>{' '}
                              <span className="mr-0.5">
                                {activityItem.tags.map((tag) => (
                                  <Fragment key={tag.name}>
                                    <a
                                      href={tag.href}
                                      className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100 dark:bg-white/5 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/10"
                                    >
                                      <span
                                        aria-hidden
                                        className={classNames(tag.color, 'size-1.5 shrink-0 rounded-full')}
                                      />
                                      {tag.name}
                                    </a>{' '}
                                  </Fragment>
                                ))}
                              </span>
                              <span className="whitespace-nowrap">{activityItem.date}</span>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </motion.li>
              ))}
              </AnimatePresence>
            </ul>
          </section>
          {filteredActivity.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No activity in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
