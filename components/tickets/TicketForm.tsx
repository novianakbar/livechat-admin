'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ticketStore } from '@/lib/ticket-store';
import { CreateTicketData } from '@/lib/types/ticket';

interface TicketFormProps {
    onClose: () => void;
    onSubmit: () => void;
}

export function TicketForm({ onClose, onSubmit }: TicketFormProps) {
    const [formData, setFormData] = useState<CreateTicketData>({
        subject: '',
        description: '',
        priority: 'medium',
        customer: {
            name: '',
            email: '',
            phone: ''
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createTicket } = ticketStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createTicket(formData);
            onSubmit();
        } catch (error) {
            console.error('Failed to create ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (field.startsWith('customer.')) {
            const customerField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                customer: {
                    ...prev.customer,
                    [customerField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    required
                                    value={formData.customer.name}
                                    onChange={(e) => handleInputChange('customer.name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="customerEmail"
                                    required
                                    value={formData.customer.email}
                                    onChange={(e) => handleInputChange('customer.email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                id="customerPhone"
                                value={formData.customer.phone || ''}
                                onChange={(e) => handleInputChange('customer.phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Details</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Brief description of the issue"
                                />
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority *
                                </label>
                                <select
                                    id="priority"
                                    required
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Detailed description of the issue or request"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
