'use client';

import KPIWidget from './components/KPIWidget';
import ChartWidget from './components/ChartWidget';
import RadarWidget from './components/RadarWidget';
import { useTheme } from './context/ThemeContext';

const chartColors = {
  light: {
    tooltipBg: '#ffffff',
    tooltipBorder: '#e4e4e7',
    tooltipText: '#3f3f46',
    axisLine: '#d4d4d8',
    axisLabel: '#71717a',
    splitLine: '#e4e4e7',
    pieBorder: '#f4f4f5',
  },
  dark: {
    tooltipBg: '#18181b',
    tooltipBorder: '#3f3f46',
    tooltipText: '#a1a1aa',
    axisLine: '#3f3f46',
    axisLabel: '#71717a',
    splitLine: '#27272a',
    pieBorder: '#0a0a0a',
  },
} as const;

export default function Home() {
  const { theme } = useTheme();
  const c = chartColors[theme];

  const lineChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText },
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: c.axisLine } },
      axisLabel: { color: c.axisLabel },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: c.axisLine } },
      axisLabel: { color: c.axisLabel },
      splitLine: { lineStyle: { color: c.splitLine } },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#10b981', width: 3 },
        itemStyle: { color: '#10b981' },
      },
    ],
  };

  const barChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText },
    },
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4'],
      axisLine: { lineStyle: { color: c.axisLine } },
      axisLabel: { color: c.axisLabel },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: c.axisLine } },
      axisLabel: { color: c.axisLabel },
      splitLine: { lineStyle: { color: c.splitLine } },
    },
    series: [
      {
        data: [120, 200, 150, 180],
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#10b981' },
              { offset: 1, color: '#059669' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  const pieChartOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: c.tooltipText },
    },
    series: [
      {
        name: 'Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: c.pieBorder,
          borderWidth: 2,
        },
        label: {
          show: true,
          color: c.tooltipText,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        data: [
          { value: 335, name: 'Category A', itemStyle: { color: '#10b981' } },
          { value: 310, name: 'Category B', itemStyle: { color: '#059669' } },
          { value: 234, name: 'Category C', itemStyle: { color: '#047857' } },
          { value: 135, name: 'Category D', itemStyle: { color: '#065f46' } },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 p-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="mx-auto">
        {/* Bento Grid - Responsive Wrapping Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" style={{ gridAutoRows: 'minmax(200px, auto)' }}>
          {/* Top row: 4 KPI widgets stretching full width */}
          <div className="col-span-full grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <KPIWidget
            title="Total Revenue"
            value="$124,563"
            change={12.5}
            changeLabel="vs last month"
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <KPIWidget
            title="Active Users"
            value="8,432"
            change={8.2}
            changeLabel="vs last week"
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <KPIWidget
            title="Conversion Rate"
            value="3.24%"
            change={-2.1}
            changeLabel="vs last month"
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <KPIWidget
            title="Avg. Response Time"
            value="142ms"
            change={-15.3}
            changeLabel="vs last week"
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          </div>

          {/* Charts (left 2/3) + System Scan (right 1/3, 2 rows) */}
          <div
            className="col-span-full grid grid-cols-1 gap-6 xl:grid-cols-3"
            style={{
              gridTemplateRows: 'repeat(3, minmax(280px, auto))',
            }}
          >
            <div className="xl:col-span-2">
              <ChartWidget title="Weekly Performance" option={lineChartOption} height={280} />
            </div>
            <div className="flex min-h-[400px] flex-col xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:min-h-0 xl:self-stretch">
              <RadarWidget title="System Scan" className="min-h-0 flex-1" />
            </div>
            <div>
              <ChartWidget title="Quarterly Results" option={barChartOption} height={280} />
            </div>
            <div>
              <ChartWidget title="Distribution" option={pieChartOption} height={280} />
            </div>
 
          </div>
        </div>
      </div>
    </div>
  );
}
