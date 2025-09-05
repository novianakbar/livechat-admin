'use client';

import { useState } from 'react';
import { PriorityBadge, StatusBadge } from './TicketBadge';
import { formatDistanceToNow } from 'date-fns';
import type { TicketListItem } from '@/lib/types/tickets';

interface TicketTableProps {
    tickets: TicketListItem[];
    isLoading?: boolean;
    onViewTicket: (ticketId: string) => void;
    onEditTicket: (ticketId: string) => void;
    onArchiveTicket: (ticketId: string) => void;
}

export function TicketTable({
    tickets,
    isLoading = false,
    onViewTicket,
    onEditTicket,
    onArchiveTicket,
}: TicketTableProps) {
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

    const handleSelectAll = () => {
        if (selectedTickets.length === tickets.length) {
            setSelectedTickets([]);
        } else {
            setSelectedTickets(tickets.map(ticket => ticket.id));
        }
    };

    const handleSelectTicket = (ticketId: string) => {
        setSelectedTickets(prev =>
            prev.includes(ticketId)
                ? prev.filter(id => id !== ticketId)
                : [...prev, ticketId]
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
                ))}
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No tickets found</div>
                <div className="text-gray-400 text-sm">Tickets will appear here after creation</div>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tickets</h3>
                    <div className="flex items-center space-x-4">
                        {selectedTickets.length > 0 && (
                            <span className="text-sm text-gray-600">{selectedTickets.length} selected</span>
                        )}
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedTickets.length === tickets.length && tickets.length > 0}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 mr-2"
                            />
                            <span className="text-sm text-gray-600">Select all</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                                <input
                                    type="checkbox"
                                    checked={selectedTickets.includes(ticket.id)}
                                    onChange={() => handleSelectTicket(ticket.id)}
                                    className="rounded border-gray-300"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-900 font-mono">
                                            #{ticket.ticket_number}
                                        </span>
                                        <StatusBadge status={ticket.status} />
                                        <PriorityBadge priority={ticket.priority} />
                                        {ticket.category && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {ticket.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900 mt-1">{ticket.subject}</h4>
                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                        <span>{ticket.customer_name}</span>
                                        <span>•</span>
                                        <span>{ticket.customer_email}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(ticket.created_at))} ago</span>
                                        {ticket.agent ? (
                                            <>
                                                <span>•</span>
                                                <span>Assigned to {ticket.agent.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>•</span>
                                                <span className="text-gray-400">Unassigned</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onViewTicket(ticket.id)}
                                    className="bg-white text-gray-700 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => onEditTicket(ticket.id)}
                                    className="bg-white text-gray-700 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onArchiveTicket(ticket.id)}
                                    className="bg-white text-red-600 px-3 py-1 rounded-lg border border-red-300 hover:bg-red-50 transition-colors text-sm"
                                >
                                    Archive
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
