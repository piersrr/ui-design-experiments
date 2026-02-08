'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, RefreshCw, type LucideIcon } from 'lucide-react';

type Roundness = 'sharp' | 'medium' | 'round';

const roundnessClasses: Record<Roundness, string> = {
  sharp: 'rounded-md',
  medium: 'rounded-xl',
  round: 'rounded-2xl',
};

type StateConfig = {
  id: string;
  label: string;
  Icon?: LucideIcon;
  colorClass: string;
  bloomClass: string;
  description: string;
};

const states: StateConfig[] = [
  {
    id: 'loading',
    label: 'Loading',
    Icon: Loader2,
    colorClass: 'text-sky-500 dark:text-sky-400',
    bloomClass: 'animate-bloom-pulse',
    description: 'Spinner with soft bloom',
  },
  {
    id: 'thinking',
    label: 'Thinking',
    colorClass: 'text-violet-500 dark:text-violet-400',
    bloomClass: 'animate-bloom-breathe',
    description: 'Pulsing circle',
  },
  {
    id: 'rendering',
    label: 'Rendering',
    colorClass: 'text-amber-500 dark:text-amber-400',
    bloomClass: 'animate-bloom-pulse',
    description: 'Square wipes left to right',
  },
  {
    id: 'syncing',
    label: 'Syncing',
    Icon: RefreshCw,
    colorClass: 'text-indigo-500 dark:text-indigo-400',
    bloomClass: 'animate-bloom-breathe',
    description: 'Sync arrows with bloom',
  },
];

function StateButton({
  state,
  roundness,
}: {
  state: StateConfig;
  roundness: Roundness;
}) {
  const { Icon, label, colorClass, bloomClass, description } = state;
  const rounded = roundnessClasses[roundness];

  const iconEl = (
    <span
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center state-hdr ${colorClass} ${bloomClass}`}
      aria-hidden
    >
      {state.id === 'loading' && state.Icon && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <state.Icon className="h-4 w-4" strokeWidth={2} />
        </motion.span>
      )}
      {state.id === 'thinking' && (
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block h-2.5 w-2.5 rounded-full bg-current"
        />
      )}
      {state.id === 'rendering' && (
        <span className="relative h-4 w-4 shrink-0 rounded-sm border-2 border-current">
          <span
            className="absolute inset-0 rounded-sm bg-current animate-wipe-right"
            aria-hidden
          />
        </span>
      )}
      {state.id === 'syncing' && state.Icon && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <state.Icon className="h-4 w-4" strokeWidth={2} />
        </motion.span>
      )}
    </span>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`inline-flex w-fit items-center gap-2 border border-zinc-300 bg-zinc-50/80 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 hover:border-zinc-400 hover:bg-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80 ${rounded}`}
      >
        {iconEl}
        <span>{label}</span>
      </motion.button>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}

const roundnessLabels: Record<Roundness, string> = {
  sharp: 'Sharp',
  medium: 'Medium',
  round: 'Round',
};

export default function AnimationStatesPage() {
  const [roundness, setRoundness] = useState<Roundness>('round');

  return (
    <div className="flex h-full flex-col overflow-auto p-6 md:p-8">
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Animation states
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Activity states with bloom and HDR-style icon glow
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Corners
            </span>
            <div
              role="group"
              aria-label="Button corner roundness"
              className="flex rounded-lg border border-zinc-300 bg-zinc-100/80 p-0.5 dark:border-zinc-700 dark:bg-zinc-800/80"
            >
              {(['sharp', 'medium', 'round'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoundness(r)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    roundness === r
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {roundnessLabels[r]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-end gap-4">
        {states.map((state) => (
          <StateButton key={state.id} state={state} roundness={roundness} />
        ))}
      </div>
    </div>
  );
}
