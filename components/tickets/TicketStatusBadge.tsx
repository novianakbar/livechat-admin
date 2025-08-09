import { cn } from '@/lib/utils';

interface TicketStatusBadgeProps {
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    size?: 'sm' | 'md';
}

const statusConfig = {
    open: {
        label: 'Open',
        className: 'bg-red-100 text-red-800 border-red-200'
    },
    in_progress: {
        label: 'In Progress',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    resolved: {
        label: 'Resolved',
        className: 'bg-green-100 text-green-800 border-green-200'
    },
    closed: {
        label: 'Closed',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
};

export function TicketStatusBadge({ status, size = 'sm' }: TicketStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={cn(
            'inline-flex items-center border font-medium rounded-full',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
            config.className
        )}>
            {config.label}
        </span>
    );
}
