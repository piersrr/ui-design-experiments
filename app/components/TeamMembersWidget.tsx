'use client';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy' | 'away';
}

const members: TeamMember[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        role: 'Product Designer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        status: 'online',
    },
    {
        id: '2',
        name: 'Alex Morgan',
        role: 'Frontend Dev',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        status: 'busy',
    },
    {
        id: '3',
        name: 'James Wilson',
        role: 'Backend Dev',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        status: 'offline',
    },
    {
        id: '4',
        name: 'Emily Davis',
        role: 'Product Manager',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        status: 'away',
    },
];

const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
        case 'online': return 'bg-emerald-500';
        case 'busy': return 'bg-red-500';
        case 'away': return 'bg-amber-500';
        default: return 'bg-zinc-400';
    }
};

export default function TeamMembersWidget({ title = "Team" }: { title?: string }) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-300 bg-gradient-to-br from-white/80 to-zinc-100/80 p-6 backdrop-blur-sm transition-all hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-300/50 dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950/50 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
                <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                    View All
                </button>
            </div>
            <div className="flex flex-col gap-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="h-10 w-10 rounded-full border border-zinc-200 bg-zinc-100 object-cover dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${getStatusColor(member.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{member.name}</p>
                            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button className="w-full rounded-lg bg-zinc-900 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                    Invite Member
                </button>
            </div>
        </div>
    );
}
