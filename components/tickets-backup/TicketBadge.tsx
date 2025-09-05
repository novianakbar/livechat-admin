import { PRIORITY_COLORS, STATUS_COLORS } from '@/lib/types/tickets';

interface TicketBadgeProps {
    type: 'priority' | 'status';
    value: string;
    className?: string;
}

export function TicketBadge({ type, value, className = '' }: TicketBadgeProps) {
    const colorMap = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS;
    const colors = colorMap[value as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors} ${className}`}
        >
            {value.replace('_', ' ').toUpperCase()}
        </span>
    );
}

interface PriorityBadgeProps {
    priority: string;
    className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    return <TicketBadge type="priority" value={priority} className={className} />;
}

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return <TicketBadge type="status" value={status} className={className} />;
}
