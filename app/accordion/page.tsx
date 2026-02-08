'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

type AccentKey = 'design' | 'motion' | 'details';

const accentConfig: Record<AccentKey, { header: string; chevron: string }> = {
  design: {
    header: 'text-sky-700 dark:text-sky-300',
    chevron: 'text-sky-500 dark:text-sky-400',
  },
  motion: {
    header: 'text-violet-700 dark:text-violet-300',
    chevron: 'text-violet-500 dark:text-violet-400',
  },
  details: {
    header: 'text-amber-700 dark:text-amber-300',
    chevron: 'text-amber-500 dark:text-amber-400',
  },
};

const items = [
  {
    id: 'design',
    title: 'Design',
    content:
      'A fluid accordion built with Motion: smooth height springs, rounded corners, and a focus on clarity. Each panel expands and collapses with natural easing so the interface feels responsive and polished.',
  },
  {
    id: 'motion',
    title: 'Motion',
    content:
      'We use layout-aware animations and spring physics so opening and closing panels feels organic. The chevron rotates in sync, and content height is measured for pixel-perfect transitions instead of jarring jumps.',
  },
  {
    id: 'details',
    title: 'Details',
    content:
      'Rounded corners, subtle borders, and consistent spacing tie the three panels into a single cohesive block. Dark mode is supported so the accordion fits any theme.',
  },
];

function AccordionItem({
  id,
  title,
  content,
  isOpen,
  onToggle,
  isFirstClosed,
  isLastClosed,
}: {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
  isFirstClosed: boolean;
  isLastClosed: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const accent = accentConfig[id as AccentKey] ?? accentConfig.design;

  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const update = () => setHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [content]);

  const closedRadius =
    isFirstClosed && isLastClosed
      ? 'rounded-2xl'
      : isFirstClosed
        ? 'rounded-t-2xl'
        : isLastClosed
          ? 'rounded-b-2xl'
          : '';

  const buttonRadius = isOpen
    ? 'rounded-t-2xl'
    : isFirstClosed && isLastClosed
      ? 'rounded-2xl'
      : isFirstClosed
        ? 'rounded-t-2xl'
        : isLastClosed
          ? 'rounded-b-2xl'
          : '';

  const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      layout
      transition={spring}
      className={
        isOpen
          ? 'my-3 rounded-2xl border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900'
          : `border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900/80 ${closedRadius} ${!isFirstClosed ? 'border-t-0' : ''}`
      }
    >
      <button
        type="button"
        onClick={onToggle}
        className={`
          flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-medium transition-colors ${buttonRadius}
          ${isOpen ? `bg-white dark:bg-zinc-900 ${accent.header}` : 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'}
        `}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        id={`accordion-heading-${id}`}
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={spring}
          className={`shrink-0 ${isOpen ? accent.chevron : 'text-zinc-500 dark:text-zinc-400'}`}
          aria-hidden
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <motion.div
        id={`accordion-content-${id}`}
        role="region"
        aria-labelledby={`accordion-heading-${id}`}
        initial={false}
        animate={{
          height: isOpen ? height : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          height: spring,
          opacity: { duration: 0.2 },
        }}
        style={{ overflow: 'hidden' }}
      >
        <div
          ref={contentRef}
          className={`bg-white px-5 py-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 ${isOpen ? 'rounded-b-2xl' : ''}`}
        >
          {content}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AccordionPage() {
  const [openId, setOpenId] = useState<string | null>(items[0].id);
  const closedIndices = items
    .map((item, i) => (openId === item.id ? -1 : i))
    .filter((i) => i >= 0);
  const firstClosed = closedIndices[0] ?? -1;
  const lastClosed = closedIndices[closedIndices.length - 1] ?? -1;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Accordion
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-8">
          Fluid expand/collapse with Motion and rounded corners.
        </p>

        <motion.div className="flex flex-col" layout>
          {items.map((item, index) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              isOpen={openId === item.id}
              onToggle={() =>
                setOpenId((prev) => (prev === item.id ? null : item.id))
              }
              isFirstClosed={index === firstClosed}
              isLastClosed={index === lastClosed}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
