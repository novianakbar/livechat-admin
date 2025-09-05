'use client';

import { useEffect } from 'react';
import { useTicketStore } from '@/lib/stores/ticket-store';
import { Plus, TicketIcon, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
    const { stats, fetchStats, tickets, fetchTickets } = useTicketStore();

    useEffect(() => {
        fetchTickets();
        fetchStats();
    }, [fetchTickets, fetchStats]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Overview of your support ticket system</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link href="/tickets/create">
                        <Button variant="destructive" className="inline-flex items-center cursor-pointer">
                            <Plus className="h-4 w-4 mr-2" />
                            New Ticket
                        </Button>
                    </Link>
                    <Link href="/tickets">
                        <Button variant="outline" className="inline-flex items-center text-gray-700 cursor-pointer">
                            <TicketIcon className="h-4 w-4 mr-2" />
                            View All Tickets
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <TicketIcon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats?.total_tickets ?? tickets.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats?.open_tickets ?? tickets.filter(t => t.status === 'open').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Resolved Tickets</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats?.resolved_tickets ?? tickets.filter(t => t.status === 'resolved').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats?.in_progress_tickets ?? tickets.filter(t => t.status === 'in_progress').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {tickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-900">
                                            #{ticket.ticket_code}
                                        </span>
                                        <Badge
                                            variant={
                                                ticket.status === 'open' ? 'default' :
                                                    ticket.status === 'in_progress' ? 'secondary' :
                                                        ticket.status === 'resolved' ? 'outline' :
                                                            ticket.status === 'closed' ? 'secondary' :
                                                                'destructive'
                                            }
                                            className={
                                                ticket.status === 'open' ? 'bg-green-600 hover:bg-green-700' :
                                                    ticket.status === 'in_progress' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                                        ticket.status === 'resolved' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                                            ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                                                                'bg-red-600 hover:bg-red-700'
                                            }
                                        >
                                            {ticket.status.replace('_', ' ')}
                                        </Badge>
                                        <Badge
                                            variant={
                                                ticket.priority === 'low' ? 'secondary' :
                                                    ticket.priority === 'medium' ? 'outline' :
                                                        ticket.priority === 'high' ? 'default' :
                                                            'destructive'
                                            }
                                            className={
                                                ticket.priority === 'low' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                                                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                        ticket.priority === 'high' ? 'bg-orange-600 text-white hover:bg-orange-700' :
                                                            'bg-red-600 hover:bg-red-700'
                                            }
                                        >
                                            {ticket.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-900 mt-1">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500">
                                        {ticket.customer_name} • {new Date(ticket.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link href={`/tickets/${ticket.id}`}>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {tickets.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No tickets found
                    </div>
                )}
                {tickets.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                        <Link href="/tickets" className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium">
                            View all tickets →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}