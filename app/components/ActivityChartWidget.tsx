'use client';

import { useTheme } from '../context/ThemeContext';

interface ActivityChartWidgetProps {
    title: string;
    data?: number[]; // Array of 364/365 numbers representing activity levels (0-4)
}

// Generate some random data if none provided
// Generate deterministic mock data to avoid hydration mismatch
const generateData = () => {
    return Array.from({ length: 364 }, (_, i) => {
        // Use a pseudo-random function based on index to be deterministic
        const val = Math.sin(i * 0.1) * 10000;
        return Math.floor(Math.abs(val) % 5);
    });
};

export default function ActivityChartWidget({ title, data }: ActivityChartWidgetProps) {
    const { theme } = useTheme();
    const activityData = data || generateData();

    // Colors for different activity levels
    const getLevelColor = (level: number) => {
        // 0 = empty, 1 = low, 2 = medium, 3 = high, 4 = very high
        if (theme === 'dark') {
            switch (level) {
                case 1: return 'bg-emerald-900/30';
                case 2: return 'bg-emerald-800/60';
                case 3: return 'bg-emerald-600';
                case 4: return 'bg-emerald-400';
                default: return 'bg-zinc-800/50';
            }
        } else {
            switch (level) {
                case 1: return 'bg-emerald-100';
                case 2: return 'bg-emerald-300';
                case 3: return 'bg-emerald-500';
                case 4: return 'bg-emerald-700';
                default: return 'bg-zinc-100';
            }
        }
    };

    const weeks = [];
    for (let i = 0; i < 52; i++) {
        weeks.push(activityData.slice(i * 7, (i + 1) * 7));
    }

    // Calculate total contributions for "Last Year" summary
    const totalContributions = activityData.reduce((acc, curr) => acc + (curr > 0 ? curr * 3 : 0), 0) + 1200;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-300 bg-gradient-to-br from-white/80 to-zinc-100/80 p-6 backdrop-blur-sm transition-all hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-300/50 dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950/50 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
                <span className="text-xs text-zinc-500">{totalContributions} contributions in the last year</span>
            </div>

            <div className="flex w-full justify-between gap-1 overflow-x-auto pb-2">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((level, dayIndex) => (
                            <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`h-2.5 w-2.5 rounded-sm ${getLevelColor(level)} transition-colors duration-300 hover:ring-1 hover:ring-zinc-400 dark:hover:ring-zinc-500`}
                                title={`Activity level: ${level}`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="mt-2 flex items-center justify-end gap-2 text-xs text-zinc-500">
                <span>Less</span>
                <div className={`h-2.5 w-2.5 rounded-sm ${theme === 'dark' ? 'bg-zinc-800/50' : 'bg-zinc-100'}`} />
                <div className={`h-2.5 w-2.5 rounded-sm ${theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-100'}`} />
                <div className={`h-2.5 w-2.5 rounded-sm ${theme === 'dark' ? 'bg-emerald-800/60' : 'bg-emerald-300'}`} />
                <div className={`h-2.5 w-2.5 rounded-sm ${theme === 'dark' ? 'bg-emerald-600' : 'bg-emerald-500'}`} />
                <div className={`h-2.5 w-2.5 rounded-sm ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-700'}`} />
                <span>More</span>
            </div>
        </div>
    );
}
