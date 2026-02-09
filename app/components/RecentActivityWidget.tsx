'use client';

import { Activity, GitCommit, GitPullRequest, MessageSquare, Star, Zap } from 'lucide-react';

interface ActivityItem {
    id: string;
    user: string;
    avatar: string;
    action: string;
    target: string;
    time: string;
    type: 'commit' | 'pr' | 'comment' | 'star' | 'deploy';
}

const mockActivities: ActivityItem[] = [
    {
        id: '1',
        user: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        action: 'opened a pull request',
        target: 'feat/new-dashboard-layout',
        time: '10m ago',
        type: 'pr',
    },
    {
        id: '2',
        user: 'Alex Morgan',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        action: 'pushed to',
        target: 'main',
        time: '2h ago',
        type: 'commit',
    },
    {
        id: '3',
        user: 'James Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        action: 'commented on',
        target: 'issue #124',
        time: '4h ago',
        type: 'comment',
    },
    {
        id: '4',
        user: 'Deployment Bot',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Deploy',
        action: 'deployed to',
        target: 'production',
        time: '5h ago',
        type: 'deploy',
    },
    {
        id: '5',
        user: 'Emily Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        action: 'starred',
        target: 'ui-dashboard',
        time: '1d ago',
        type: 'star',
    },
];

const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
        case 'commit': return <GitCommit className="h-4 w-4 text-emerald-500" />;
        case 'pr': return <GitPullRequest className="h-4 w-4 text-purple-500" />;
        case 'comment': return <MessageSquare className="h-4 w-4 text-blue-500" />;
        case 'star': return <Star className="h-4 w-4 text-yellow-500" />;
        case 'deploy': return <Zap className="h-4 w-4 text-orange-500" />;
        default: return <Activity className="h-4 w-4 text-zinc-500" />;
    }
};

export default function RecentActivityWidget({ title = "Recent Activity" }: { title?: string }) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-300 bg-gradient-to-br from-white/80 to-zinc-100/80 p-6 backdrop-blur-sm transition-all hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-300/50 dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950/50 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                {mockActivities.map((item) => (
                    <div key={item.id} className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <img src={item.avatar} alt={item.user} className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-sm">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.user}</span>
                                <span className="text-zinc-500 dark:text-zinc-400">{item.action}</span>
                                <span className="truncate font-medium text-zinc-700 dark:text-zinc-300">{item.target}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                                {getIcon(item.type)}
                                <span>{item.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
