'use client';

import KPIWidget from '../components/KPIWidget';
import ChartWidget from '../components/ChartWidget';
import RadarWidget from '../components/RadarWidget';
import ActivityChartWidget from '../components/ActivityChartWidget';
import RecentActivityWidget from '../components/RecentActivityWidget';
import TeamMembersWidget from '../components/TeamMembersWidget';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Users, Activity, Clock } from 'lucide-react';

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

export default function DashboardPage() {
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
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#10b981', width: 3 },
        itemStyle: { color: '#10b981' },
      },
    ],
    grid: { top: 10, bottom: 20, left: 40, right: 10 },
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
        barWidth: '60%',
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
    grid: { top: 10, bottom: 20, left: 30, right: 10 },
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
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: 'Distribution',
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: c.pieBorder,
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: c.tooltipText
          },
        },
        data: [
          { value: 335, name: 'Direct', itemStyle: { color: '#10b981' } },
          { value: 310, name: 'Social', itemStyle: { color: '#059669' } },
          { value: 234, name: 'Ads', itemStyle: { color: '#047857' } },
          { value: 135, name: 'Others', itemStyle: { color: '#065f46' } },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 p-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-[1920px]">
        {/* Header Area */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Welcome back, Piers. Here&apos;s what&apos;s happening with your projects today.</p>
        </div>

        {/* Bento Grid Layout - Highly Dense */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 xl:gap-6">

          {/* Row 1: KPIs (Top 4 items) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
            <KPIWidget
              title="Total Revenue"
              value="$124,563"
              change={12.5}
              changeLabel="vs last month"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
            <KPIWidget
              title="Active Users"
              value="8,432"
              change={8.2}
              changeLabel="vs last week"
              icon={<Users className="h-5 w-5" />}
            />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
            <KPIWidget
              title="Conversion Rate"
              value="3.24%"
              change={-2.1}
              changeLabel="vs last month"
              icon={<Activity className="h-5 w-5" />}
            />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
            <KPIWidget
              title="Avg. Response"
              value="142ms"
              change={-15.3}
              changeLabel="vs last week"
              icon={<Clock className="h-5 w-5" />}
            />
          </div>

          {/* Row 2: Main Chart (Wide) & Team (Narrow) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-8">
            <ChartWidget title="Revenue Performance" option={lineChartOption} height={320} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-4">
            <TeamMembersWidget title="Team Status" />
          </div>

          {/* Row 3: Activity Heatmap (Wide) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-8">
            <ActivityChartWidget title="Contribution Activity" />
          </div>

          {/* Row 3/4 Mixed: Radar & Pie */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-4 row-span-2">
            <RadarWidget title="System Health" className="h-full min-h-[300px]" />
          </div>

          {/* Row 4: Recent Activity & secondary chart */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4 min-h-[300px]">
            <RecentActivityWidget title="Recent Logs" />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4">
            <ChartWidget title="Traffic Sources" option={pieChartOption} height={280} />
          </div>

          {/* Row 5: Bottom small chart */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4">
            <ChartWidget title="Quarterly Goals" option={barChartOption} height={280} />
          </div>

        </div>
      </div>
    </div>
  );
}
