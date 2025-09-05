'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTicketStore } from '@/lib/stores/ticket-store';
import type { CreateTicketRequest } from '@/lib/types/tickets';
import { RadixButton, RadixInput, RadixTextarea, RadixSelect } from '@/components/ui/radix-form';

interface TicketFormData {
    subject: string;
    description: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    priority: string;
    category_id?: string;
}

export default function CreateTicketPage() {
    const router = useRouter();
    const { createTicket, fetchCategories, categories, loading } = useTicketStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<TicketFormData>();

    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const onSubmit = async (data: TicketFormData) => {
        setIsCreating(true);
        try {
            const ticketData: CreateTicketRequest = {
                ...data,
                created_via: 'agent', // Since this is from admin panel
            };

            await createTicket(ticketData);
            router.push('/tickets');
        } catch (error) {
            console.error('Failed to create ticket:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleBack = () => {
        router.push('/tickets');
    };

    const handleReset = () => {
        reset();
    };

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
                        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
                        <p className="text-gray-600">Create a new support ticket</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Customer Information</h3>

                            <div>
                                <RadixInput
                                    label="Customer Name"
                                    required
                                    {...register('customer_name', {
                                        required: 'Customer name is required'
                                    })}
                                    type="text"
                                    id="customer_name"
                                    placeholder="Enter customer name"
                                    error={errors.customer_name?.message}
                                />
                            </div>

                            <div>
                                <RadixInput
                                    label="Customer Email"
                                    required
                                    {...register('customer_email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    id="customer_email"
                                    placeholder="Enter customer email"
                                    error={errors.customer_email?.message}
                                />
                            </div>

                            <div>
                                <RadixInput
                                    label="Customer Phone"
                                    {...register('customer_phone')}
                                    type="tel"
                                    id="customer_phone"
                                    placeholder="Enter customer phone"
                                />
                            </div>
                        </div>

                        {/* Ticket Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Ticket Details</h3>

                            <div>
                                <RadixSelect
                                    label="Priority"
                                    required
                                    {...register('priority', { required: 'Priority is required' })}
                                    id="priority"
                                    error={errors.priority?.message}
                                >
                                    <option value="">Select priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </RadixSelect>
                            </div>

                            <div>
                                <RadixSelect
                                    label="Category"
                                    {...register('category_id')}
                                    id="category_id"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </RadixSelect>
                            </div>
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
                            disabled={isSubmitting || isCreating}
                            className="cursor-pointer flex items-center"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reset
                        </RadixButton>
                        <RadixButton
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={isSubmitting || isCreating}
                            className="cursor-pointer"
                        >
                            Cancel
                        </RadixButton>
                        <RadixButton
                            type="submit"
                            disabled={isSubmitting || isCreating || loading}
                            className="cursor-pointer flex items-center"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isCreating ? 'Creating...' : 'Create Ticket'}
                        </RadixButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
