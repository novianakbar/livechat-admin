'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TicketCard } from '@/components/tickets/TicketCard';
import { TicketForm } from '@/components/tickets/TicketForm';
import { ticketStore } from '@/lib/ticket-store';
import { Ticket } from '@/lib/types/ticket';

export default function TicketsPage() {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const { tickets, loading, fetchTickets } = ticketStore();

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const filteredTickets = tickets.filter((ticket: Ticket) => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusCounts = () => {
        const counts = {
            all: tickets.length,
            open: tickets.filter((t: Ticket) => t.status === 'open').length,
            in_progress: tickets.filter((t: Ticket) => t.status === 'in_progress').length,
            resolved: tickets.filter((t: Ticket) => t.status === 'resolved').length,
            closed: tickets.filter((t: Ticket) => t.status === 'closed').length
        };
        return counts;
    };

    const statusCounts = getStatusCounts();

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
                    <p className="text-gray-600 mt-1">Manage and track customer support tickets</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Ticket
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Total Tickets</div>
                    <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Open</div>
                    <div className="text-2xl font-bold text-red-600">{statusCounts.open}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">In Progress</div>
                    <div className="text-2xl font-bold text-yellow-600">{statusCounts.in_progress}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Resolved</div>
                    <div className="text-2xl font-bold text-green-600">{statusCounts.resolved}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Closed</div>
                    <div className="text-2xl font-bold text-gray-600">{statusCounts.closed}</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tickets by subject or customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
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
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading tickets...</p>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No tickets found matching your criteria.</p>
                    </div>
                ) : (
                    filteredTickets.map((ticket: Ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))
                )}
            </div>

            {/* New Ticket Form Modal */}
            {showForm && (
                <TicketForm
                    onClose={() => setShowForm(false)}
                    onSubmit={() => {
                        setShowForm(false);
                        fetchTickets();
                    }}
                />
            )}
        </div>
    );
}
