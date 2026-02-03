'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface ChartWidgetProps {
  title: string;
  option: any;
  height?: number;
}

export default function ChartWidget({ title, option, height = 300 }: ChartWidgetProps) {
  const chartOption = useMemo(() => ({
    ...option,
    backgroundColor: 'transparent',
    textStyle: {
      color: '#a1a1aa',
      fontFamily: 'var(--font-geist-sans)',
    },
    grid: {
      ...option.grid,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  }), [option]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <ReactECharts
        option={chartOption}
        style={{ height: `${height}px`, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
