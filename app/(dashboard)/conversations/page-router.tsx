'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminConversationsPage from './admin/page';
import AgentConversationsPage from './agent/page';

export default function ConversationsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If still loading, don't do anything
        if (isLoading) return;

        // If user is not authenticated, redirect to login
        if (!user) {
            router.push('/login');
            return;
        }
    }, [user, isLoading, router]);

    // Show loading while determining user role
    if (isLoading || !user) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    // Route based on user role
    switch (user.role) {
        case 'admin':
        case 'supervisor':
            return <AdminConversationsPage />;
        case 'agent':
            return <AgentConversationsPage />;
        default:
            return (
                <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
                                <p className="mt-2 text-sm text-red-700">
                                    Your role ({user.role}) does not have access to the conversations page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
}
