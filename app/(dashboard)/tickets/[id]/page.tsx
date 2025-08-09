'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PaperClipIcon, PlusIcon } from '@heroicons/react/24/outline';
import { TicketComments } from '@/components/tickets/TicketComments';
import { ticketStore } from '@/lib/ticket-store';
import { formatDate } from '@/lib/utils';
import { Ticket } from '@/lib/types/ticket';

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.id as string;
    const { tickets, updateTicket, addComment } = ticketStore();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isAddingComment, setIsAddingComment] = useState(false);

    useEffect(() => {
        const foundTicket = tickets.find(t => t.id === ticketId);
        setTicket(foundTicket || null);
    }, [ticketId, tickets]);

    const handleStatusChange = async (newStatus: string) => {
        if (ticket) {
            await updateTicket(ticket.id, { status: newStatus as Ticket['status'] });
            setTicket({ ...ticket, status: newStatus as Ticket['status'] });
        }
    };

    const handlePriorityChange = async (newPriority: string) => {
        if (ticket) {
            await updateTicket(ticket.id, { priority: newPriority as Ticket['priority'] });
            setTicket({ ...ticket, priority: newPriority as Ticket['priority'] });
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !ticket) return;

        setIsAddingComment(true);
        try {
            await addComment(ticket.id, {
                content: newComment,
                author: {
                    name: 'Current Agent',
                    role: 'agent'
                }
            });
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setIsAddingComment(false);
        }
    };

    if (!ticket) {
        return (
            <div className="p-6">
                <div className="text-center py-8">
                    <p className="text-gray-500">Ticket not found</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        #{ticket.id} - {ticket.subject}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Created {formatDate(ticket.createdAt)} by {ticket.customer.name}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Description */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                        </div>

                        {ticket.attachments && ticket.attachments.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                                <div className="space-y-2">
                                    {ticket.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                                            <PaperClipIcon className="w-4 h-4" />
                                            <span>{attachment.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Comments */}
                    <TicketComments ticket={ticket} />

                    {/* Add Comment */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment</h3>
                        <div className="space-y-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type your comment here..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() || isAddingComment}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isAddingComment ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Add Comment
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Priority */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                <select
                                    value={ticket.priority}
                                    onChange={(e) => handlePriorityChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>

                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Name</span>
                                <p className="text-gray-900">{ticket.customer.name}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Email</span>
                                <p className="text-gray-900">{ticket.customer.email}</p>
                            </div>
                            {ticket.customer.phone && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Phone</span>
                                    <p className="text-gray-900">{ticket.customer.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assigned Agent */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Agent</h3>

                        {ticket.assignedAgent ? (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                        {ticket.assignedAgent.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{ticket.assignedAgent.name}</p>
                                    <p className="text-sm text-gray-500">{ticket.assignedAgent.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-500 mb-3">No agent assigned</p>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Assign Agent
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
