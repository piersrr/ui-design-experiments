'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MENU_ITEMS = [
  { id: 'edit', label: 'Edit', icon: '✏️' },
  { id: 'share', label: 'Share', icon: '↗️' },
  { id: 'delete', label: 'Delete', icon: '🗑️' },
];

function GooFilterDef() {
  return (
    <svg className="absolute size-0" aria-hidden>
      <defs>
        <filter id="goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="thresh"
          />
          <feComposite in="SourceGraphic" in2="thresh" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

export default function DropdownPage() {
  const [open, setOpen] = useState(false);
  const [gooey, setGooey] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elasticity, setElasticity] = useState(0);

  // Speed = how fast the dropdown appears. Higher speed = shorter duration.
  const speedClamped = Math.max(0.25, Math.min(2, Number(speed) || 1));
  const duration = 0.35 / speedClamped;
  const stagger = duration * 0.1;

  const menuTransition = elasticity
    ? {
        type: 'spring' as const,
        stiffness: (200 + elasticity * 400) * speedClamped,
        damping: (20 + (1 - elasticity) * 15) * Math.sqrt(speedClamped),
      }
    : { duration, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <div className="flex min-h-full flex-1 bg-white">
      {/* Settings – left, no card */}
      <aside className="w-64 shrink-0 p-8">
        <h1 className="text-xl font-semibold text-black">Dropdown</h1>
        <h2 className="mt-6 text-sm font-semibold text-black">Settings</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Adjust to test the dropdown effect.
        </p>
        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={gooey}
              onChange={(e) => setGooey(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-200 text-zinc-600 focus:ring-zinc-500"
            />
            <span className="text-sm font-medium text-black">Gooey</span>
          </label>
          <p className="text-xs text-zinc-500">
            Menu background appears to grow from the circle.
          </p>
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-black">Speed</span>
              <span className="text-zinc-500">{speed.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.25}
              max={2}
              step={0.05}
              value={speed}
              onChange={(e) =>
                setSpeed(Math.max(0.25, Math.min(2, Number(e.target.value) || 1)))
              }
              className="mt-1 h-2 w-full appearance-none rounded-full bg-zinc-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-600"
            />
            <p className="mt-0.5 text-xs text-zinc-500">
              Speed the dropdown appears (higher = faster)
            </p>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-black">Elasticity</span>
              <span className="text-zinc-500">{elasticity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={elasticity}
              onChange={(e) => setElasticity(Number(e.target.value))}
              className="mt-1 h-2 w-full appearance-none rounded-full bg-zinc-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-600"
            />
            <p className="mt-0.5 text-xs text-zinc-500">
              Bounce when opening (0 = none, 1 = max)
            </p>
          </div>
        </div>
      </aside>

      {/* Demo – right, no card, white background */}
      <div className="relative flex min-h-[320px] flex-1 flex-col items-center justify-middle p-8">
        <GooFilterDef />
        {/* Wrapper so dropdown + items are positioned relative to button */}
        <div className="relative flex flex-col items-center justify-middle">
          {/* Goo filter only on button + dropdown background, so items can have hover */}
          <div
            className="relative flex flex-col items-center justify-center"
            style={gooey ? { filter: 'url(#goo)' } : undefined}
          >
            {/* Circle button – white with soft shadow */}
            <motion.button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-2xl text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white mb-2"
              onClick={() => setOpen((o) => !o)}
              whileTap={{ scale: 0.95 }}
            >
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={
                elasticity
                  ? { type: 'spring', stiffness: 300, damping: 25 }
                  : { duration: duration * 0.8 }
              }
            >
              +
            </motion.span>
          </motion.button>

          {/* Dropdown background only (no items) – gooey affects this */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="menu-bg"
                className="absolute left-1/2 top-full z-0 min-w-[180px] -translate-x-1/2 -translate-y-1 overflow-hidden rounded-b-xl rounded-t-2xl bg-zinc-200"
                style={{ transformOrigin: 'top center' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: elasticity
                    ? { type: 'spring', stiffness: 400, damping: 30 }
                    : { duration: duration * 0.7 },
                }}
                transition={menuTransition}
              >
                <div className="min-h-[10rem] w-full rounded-b-xl rounded-t p-2 " aria-hidden />
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Menu items in a separate layer on top – no goo filter, so hover works */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="menu-items"
                className="absolute left-1/2 top-full z-10 min-w-[180px] -translate-x-1/2 -translate-y-1 rounded-y p-2"
                style={{ transformOrigin: 'top center' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: elasticity
                    ? { type: 'spring', stiffness: 400, damping: 30 }
                    : { duration: duration * 0.7 },
                }}
                transition={menuTransition}
              >
                <div className="flex flex-col gap-1">
                  {MENU_ITEMS.map((item, i) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-medium text-black transition-colors hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={
                      elasticity
                        ? {
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                            delay: duration + stagger * i,
                          }
                        : {
                            duration: duration * 0.6,
                            delay: duration + stagger * i,
                          }
                    }
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-lg" aria-hidden>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
