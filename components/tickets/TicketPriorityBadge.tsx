import { cn } from '@/lib/utils';
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface TicketPriorityBadgeProps {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    size?: 'sm' | 'md';
}

const priorityConfig = {
    low: {
        label: 'Low',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: null
    },
    medium: {
        label: 'Medium',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: null
    },
    high: {
        label: 'High',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: ExclamationCircleIcon
    },
    urgent: {
        label: 'Urgent',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: ExclamationTriangleIcon
    }
};

export function TicketPriorityBadge({ priority, size = 'sm' }: TicketPriorityBadgeProps) {
    const config = priorityConfig[priority];
    const Icon = config.icon;

    return (
        <span className={cn(
            'inline-flex items-center gap-1 border font-medium rounded-full',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
            config.className
        )}>
            {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
            {config.label}
        </span>
    );
}
