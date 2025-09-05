'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTicketStore } from '@/lib/stores/ticket-store';
import type { UpdateTicketRequest } from '@/lib/types/tickets';
import { RadixButton, RadixInput, RadixTextarea, RadixSelect } from '@/components/ui/radix-form';

interface TicketEditFormData {
    subject: string;
    description: string;
    priority: string;
    status: string;
}

export default function EditTicketPage() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.id as string;

    const {
        currentTicket,
        updateTicket,
        fetchTicket,
        loading,
        error
    } = useTicketStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<TicketEditFormData>();

    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (ticketId) {
            fetchTicket(ticketId);
        }
    }, [ticketId, fetchTicket]);

    useEffect(() => {
        if (currentTicket) {
            setValue('subject', currentTicket.subject);
            setValue('description', currentTicket.description);
            setValue('priority', currentTicket.priority);
            setValue('status', currentTicket.status);
        }
    }, [currentTicket, setValue]);

    const onSubmit = async (data: TicketEditFormData) => {
        if (!currentTicket) return;

        setIsUpdating(true);
        try {
            const updateData: UpdateTicketRequest = {
                id: currentTicket.id,
                ...data,
            };

            await updateTicket(updateData);
            router.push(`/tickets/${ticketId}`);
        } catch (error) {
            console.error('Failed to update ticket:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBack = () => {
        router.push(`/tickets/${ticketId}`);
    };

    const handleReset = () => {
        if (currentTicket) {
            setValue('subject', currentTicket.subject);
            setValue('description', currentTicket.description);
            setValue('priority', currentTicket.priority);
            setValue('status', currentTicket.status);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-600 mb-4">{error}</div>
                <RadixButton
                    onClick={() => fetchTicket(ticketId)}
                    className="cursor-pointer"
                >
                    Retry
                </RadixButton>
            </div>
        );
    }

    if (!currentTicket) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-gray-600 mb-4">Ticket not found</div>
                <RadixButton
                    onClick={() => router.push('/tickets')}
                    className="cursor-pointer"
                >
                    Back to Tickets
                </RadixButton>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <RadixButton
                        variant="outline"
                        onClick={handleBack}
                        className="cursor-pointer text-sm px-3 py-1 flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </RadixButton>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Ticket #{currentTicket.ticket_code}</h1>
                        <p className="text-gray-600">Update ticket information</p>
                    </div>
                </div>
            </div>

            {/* Customer Info (Read-only) */}
            <div className="bg-gray-50 rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Information (Read-only)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="text-sm font-medium text-gray-600">Name</span>
                        <p className="text-sm">{currentTicket.customer_name}</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-600">Email</span>
                        <p className="text-sm">{currentTicket.customer_email}</p>
                    </div>
                    {currentTicket.customer_phone && (
                        <div>
                            <span className="text-sm font-medium text-gray-600">Phone</span>
                            <p className="text-sm">{currentTicket.customer_phone}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Ticket Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <RadixSelect
                                label="Status"
                                required
                                {...register('status', { required: 'Status is required' })}
                                id="status"
                                error={errors.status?.message}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                                <option value="escalated">Escalated</option>
                            </RadixSelect>
                        </div>

                        <div>
                            <RadixSelect
                                label="Priority"
                                required
                                {...register('priority', { required: 'Priority is required' })}
                                id="priority"
                                error={errors.priority?.message}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </RadixSelect>
                        </div>
                    </div>

                    {/* Subject and Description */}
                    <div className="space-y-4">
                        <div>
                            <RadixInput
                                label="Subject"
                                required
                                {...register('subject', {
                                    required: 'Subject is required',
                                    minLength: {
                                        value: 5,
                                        message: 'Subject must be at least 5 characters'
                                    }
                                })}
                                type="text"
                                id="subject"
                                placeholder="Enter ticket subject"
                                error={errors.subject?.message}
                            />
                        </div>

                        <div>
                            <RadixTextarea
                                label="Description"
                                required
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: {
                                        value: 10,
                                        message: 'Description must be at least 10 characters'
                                    }
                                })}
                                id="description"
                                rows={6}
                                placeholder="Describe the issue in detail..."
                                error={errors.description?.message}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <RadixButton
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSubmitting || isUpdating}
                            className="cursor-pointer flex items-center"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reset
                        </RadixButton>
                        <RadixButton
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={isSubmitting || isUpdating}
                            className="cursor-pointer"
                        >
                            Cancel
                        </RadixButton>
                        <RadixButton
                            type="submit"
                            disabled={isSubmitting || isUpdating}
                            className="cursor-pointer flex items-center"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isUpdating ? 'Updating...' : 'Update Ticket'}
                        </RadixButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
