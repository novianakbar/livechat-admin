interface TicketFiltersProps {
    statusFilter: string;
    priorityFilter: string;
    onStatusChange: (status: string) => void;
    onPriorityChange: (priority: string) => void;
}

export function TicketFilters({
    statusFilter,
    priorityFilter,
    onStatusChange,
    onPriorityChange
}: TicketFiltersProps) {
    return (
        <div className="flex gap-4">
            <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div>
                <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                </label>
                <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
        </div>
    );
}
