'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

const CARD_COUNT = 8;
const CARD_WIDTH = 280;
const CARD_GAP = 16;

const cards = Array.from({ length: CARD_COUNT }, (_, i) => ({
  id: i + 1,
  title: `Card ${i + 1}`,
  subtitle: ['Analytics', 'Reports', 'Insights', 'Overview', 'Summary', 'Metrics', 'Data', 'Charts'][i],
  color: ['emerald', 'sky', 'violet', 'amber', 'rose', 'teal', 'indigo', 'orange'][i],
}));

function MotionCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const maxScroll = -((CARD_WIDTH + CARD_GAP) * (CARD_COUNT - 1));

  const dragConstraints = { left: maxScroll, right: 0 };

  const goTo = (i: number) => {
    const target = -i * (CARD_WIDTH + CARD_GAP);
    animate(x, target, { type: 'spring', stiffness: 300, damping: 35 });
    setIndex(i);
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-1 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        Motion carousel
      </h2>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Drag or use arrows. Viewport edges fade; cards lift on hover.
      </p>
      {/* Viewport fade: mask on edges so cards fade at visible edges, not by scroll */}
      <div
        ref={containerRef}
        className="relative overflow-hidden py-2"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <motion.div
          className="flex cursor-grab touch-pan-y gap-4 active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            const velocity = info.velocity.x;
            const threshold = (CARD_WIDTH + CARD_GAP) * 0.3;
            let next = index;
            if (velocity < -200) next = Math.min(CARD_COUNT - 1, index + 1);
            else if (velocity > 200) next = Math.max(0, index - 1);
            else {
              const currentOffset = -index * (CARD_WIDTH + CARD_GAP);
              const diff = x.get() - currentOffset;
              if (diff < -threshold) next = index + 1;
              else if (diff > threshold) next = index - 1;
              next = Math.max(0, Math.min(CARD_COUNT - 1, next));
            }
            goTo(next);
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
              style={{ width: CARD_WIDTH }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                style={{
                  backgroundColor:
                    ['#d1fae9', '#e0f2fe', '#ede9fe', '#fef3c7', '#ffe4e6', '#ccfbf1', '#e0e7ff', '#ffedd5'][i],
                }}
              >
                <span className="opacity-80">◆</span>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {card.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {card.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, index - 1))}
            disabled={index === 0}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            aria-label="Previous card"
          >
            ← Prev
          </button>
          <div className="flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? 'w-6 bg-emerald-500'
                    : 'w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500'
                }`}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(Math.min(CARD_COUNT - 1, index + 1))}
            disabled={index === CARD_COUNT - 1}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            aria-label="Next card"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = [
  'Design',
  '•',
  'Build',
  '•',
  'Ship',
  '•',
  'Iterate',
  '•',
  'Scale',
  '•',
  'Measure',
  '•',
];

function CssMarquee() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-1 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        CSS marquee
      </h2>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Scrolling text, no JavaScript. Duplicated content for seamless loop.
      </p>
      <div className="w-full overflow-hidden border-y border-zinc-200 py-4 dark:border-zinc-700">
        <div className="marquee-inner">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={`a-${i}`}
              className="mx-6 shrink-0 text-2xl font-medium text-zinc-700 dark:text-zinc-300"
            >
              {item}
            </span>
          ))}
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={`b-${i}`}
              className="mx-6 shrink-0 text-2xl font-medium text-zinc-700 dark:text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CarouselPage() {
  return (
    <div className="h-full overflow-auto p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-12">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 md:text-3xl">
            Carousel
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Motion carousel with cards and a CSS-only text marquee.
          </p>
        </div>
        <MotionCarousel />
        <CssMarquee />
      </div>
    </div>
  );
}
