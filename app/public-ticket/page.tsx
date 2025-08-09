'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ticketStore } from '@/lib/ticket-store';
import { CreateTicketData } from '@/lib/types/ticket';

export default function PublicTicketPage() {
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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const { createTicket } = ticketStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newTicket = await createTicket(formData);
            setTicketId(newTicket.id);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Failed to create ticket:', error);
            alert('Failed to submit ticket. Please try again.');
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

    const resetForm = () => {
        setFormData({
            subject: '',
            description: '',
            priority: 'medium',
            customer: {
                name: '',
                email: '',
                phone: ''
            }
        });
        setIsSubmitted(false);
        setTicketId('');
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Submitted Successfully!</h2>
                        <p className="text-gray-600 mb-4">
                            Your support request has been received. Your ticket ID is:
                        </p>
                        <div className="bg-gray-100 rounded-lg p-3 mb-6">
                            <span className="text-xl font-bold text-blue-600">#{ticketId}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            We&apos;ll respond to your request as soon as possible. You&apos;ll receive updates via email.
                        </p>
                        <button
                            onClick={resetForm}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Submit Another Ticket
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Support Ticket</h1>
                    <p className="text-gray-600">
                        Need help? Fill out the form below and our support team will get back to you.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.customer.name}
                                        onChange={(e) => handleInputChange('customer.name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.customer.email}
                                        onChange={(e) => handleInputChange('customer.email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.customer.phone || ''}
                                    onChange={(e) => handleInputChange('customer.phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        {/* Issue Details */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h2>

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
                                        placeholder="Brief description of your issue"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority Level *
                                    </label>
                                    <select
                                        id="priority"
                                        required
                                        value={formData.priority}
                                        onChange={(e) => handleInputChange('priority', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="low">Low - General question or minor issue</option>
                                        <option value="medium">Medium - Standard support request</option>
                                        <option value="high">High - Important issue affecting workflow</option>
                                        <option value="urgent">Urgent - Critical issue requiring immediate attention</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        required
                                        rows={6}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Please provide detailed information about your issue, including any error messages you've encountered and steps you've already tried..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                        Submit Support Request
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Help Text */}
                        <div className="text-center text-sm text-gray-500">
                            <p>
                                Our support team typically responds within 24 hours during business days.
                                For urgent issues, please call our support hotline.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
