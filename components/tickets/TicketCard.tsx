import { Ticket } from '@/lib/types/ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { formatDate } from '@/lib/utils';
import { ChatBubbleBottomCenterTextIcon, PaperClipIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface TicketCardProps {
    ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
    return (
        <Link href={`/tickets/${ticket.id}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                #{ticket.id} - {ticket.subject}
                            </h3>
                            <TicketStatusBadge status={ticket.status} />
                            <TicketPriorityBadge priority={ticket.priority} />
                        </div>

                        <p className="text-gray-600 line-clamp-2 mb-3">
                            {ticket.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{ticket.customer.name}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <span>Created {formatDate(ticket.createdAt)}</span>
                            </div>

                            {ticket.comments.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                                    <span>{ticket.comments.length} comment{ticket.comments.length === 1 ? '' : 's'}</span>
                                </div>
                            )}

                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <PaperClipIcon className="w-4 h-4" />
                                    <span>{ticket.attachments.length} attachment{ticket.attachments.length === 1 ? '' : 's'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        {ticket.assignedAgent ? (
                            <span>Assigned to {ticket.assignedAgent.name}</span>
                        ) : (
                            <span className="text-orange-600">Unassigned</span>
                        )}
                    </div>

                    <div className="text-sm text-gray-500">
                        Updated {formatDate(ticket.updatedAt)}
                    </div>
                </div>
            </div>
        </Link>
    );
}
