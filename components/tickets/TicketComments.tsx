import { Ticket } from '@/lib/types/ticket';
import { formatDateTime } from '@/lib/utils';
import { PaperClipIcon } from '@heroicons/react/24/outline';

interface TicketCommentsProps {
    ticket: Ticket;
}

export function TicketComments({ ticket }: TicketCommentsProps) {
    if (ticket.comments.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
                <p className="text-gray-500 text-center py-8">No comments yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({ticket.comments.length})
            </h3>

            <div className="space-y-4">
                {ticket.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${comment.author.role === 'agent'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-green-100 text-green-600'
                                    }`}>
                                    {comment.author.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{comment.author.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {comment.author.role} • {formatDateTime(comment.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="ml-10">
                            <p className="text-gray-700 whitespace-pre-wrap mb-3">{comment.content}</p>

                            {comment.attachments && comment.attachments.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-600">Attachments:</p>
                                    {comment.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                                            <PaperClipIcon className="w-4 h-4" />
                                            <span>{attachment.name}</span>
                                            <span className="text-gray-400">
                                                ({(attachment.size / 1024).toFixed(1)} KB)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
