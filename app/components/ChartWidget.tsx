'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface ChartWidgetProps {
  title: string;
  option: any;
  height?: number;
}

const chartTextColor = { light: '#3f3f46', dark: '#a1a1aa' } as const;

export default function ChartWidget({ title, option, height = 300 }: ChartWidgetProps) {
  const { theme } = useTheme();
  const chartOption = useMemo(() => ({
    ...option,
    backgroundColor: 'transparent',
    textStyle: {
      color: chartTextColor[theme],
      fontFamily: 'var(--font-geist-sans)',
    },
    grid: {
      ...option.grid,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  }), [option, theme]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-300 bg-gradient-to-br from-white/80 to-zinc-100/80 p-6 backdrop-blur-sm transition-all hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-300/50 dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950/50 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
      <ReactECharts
        option={chartOption}
        style={{ height: `${height}px`, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
