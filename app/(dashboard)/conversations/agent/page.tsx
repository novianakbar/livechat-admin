'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    ChatBubbleBottomCenterTextIcon,
    ClockIcon,
    UserIcon,
    ArchiveBoxIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { agentChatApi } from '@/lib/api-agent';
import { ChatSession } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AgentConversationsPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');

    const loadConversations = useCallback(async () => {
        try {
            setLoading(true);
            const params = selectedFilter === 'all' ? {} : { status: selectedFilter };
            const result = await agentChatApi.getMySessions(params);
            setConversations(result.sessions);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedFilter]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    const filters = [
        { id: 'all', name: 'Semua', count: conversations.length },
        { id: 'active', name: 'Aktif', count: conversations.filter(c => c.status === 'active').length },
        { id: 'waiting', name: 'Menunggu', count: conversations.filter(c => c.status === 'waiting').length },
        { id: 'closed', name: 'Selesai', count: conversations.filter(c => c.status === 'closed').length },
        { id: 'urgent', name: 'Mendesak', count: conversations.filter(c => c.priority === 'urgent').length },
    ];

    const filteredConversations = conversations.filter(conversation => {
        let matchesFilter = false;

        // Handle different filter types
        switch (selectedFilter) {
            case 'all':
                matchesFilter = true;
                break;
            case 'urgent':
                matchesFilter = conversation.priority === 'urgent';
                break;
            default:
                matchesFilter = conversation.status === selectedFilter;
        }

        const matchesSearch = conversation.contact?.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conversation.contact?.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conversation.topic.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'waiting':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'normal':
                return 'text-blue-600';
            case 'low':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getCustomerInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeDifference = (startTime: string, endTime?: string) => {
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
        return `${diff}m`;
    };

    const getOSSCategory = (topic: string) => {
        const topicLower = topic.toLowerCase();
        if (topicLower.includes('nib')) return { name: 'NIB', color: 'bg-blue-100 text-blue-800' };
        if (topicLower.includes('izin usaha')) return { name: 'Izin Usaha', color: 'bg-green-100 text-green-800' };
        if (topicLower.includes('perizinan')) return { name: 'Perizinan', color: 'bg-purple-100 text-purple-800' };
        if (topicLower.includes('berusaha')) return { name: 'OSS Berusaha', color: 'bg-indigo-100 text-indigo-800' };
        if (topicLower.includes('industri')) return { name: 'Industri', color: 'bg-orange-100 text-orange-800' };
        return { name: 'Umum', color: 'bg-gray-100 text-gray-800' };
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading conversations...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Percakapan Saya</h1>
                    <p className="text-sm text-gray-600">
                        Kelola percakapan yang ditugaskan kepada Anda - {user?.name}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">Online</span>
                    </div>
                    <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards - Agent specific */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Chat Aktif Saya</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {conversations.filter(c => c.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <ClockIcon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Menunggu Respon</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {conversations.filter(c => c.status === 'waiting').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {conversations.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                <ArchiveBoxIcon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Diselesaikan</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {conversations.filter(c => c.status === 'closed').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Filter Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedFilter === filter.id
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.name} ({filter.count})
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari percakapan saya..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={loadConversations}
                            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Conversations List */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Percakapan Assigned</h3>
                        <div className="text-sm text-gray-500">
                            {filteredConversations.length} conversations
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredConversations.length === 0 ? (
                        <div className="p-12 text-center">
                            <ChatBubbleBottomCenterTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada percakapan</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {selectedFilter === 'all' ?
                                    'Belum ada percakapan yang ditugaskan kepada Anda.' :
                                    `Tidak ada percakapan dengan status "${selectedFilter}".`
                                }
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div key={conversation.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Customer Avatar */}
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-white">
                                                {getCustomerInitials(conversation.contact?.contact_name || "Unknown")}
                                            </span>
                                        </div>

                                        {/* Conversation Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {conversation.contact?.contact_name}
                                                </h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                                                    {conversation.status}
                                                </span>
                                                <span className={`text-xs font-semibold ${getPriorityColor(conversation.priority)}`}>
                                                    {conversation.priority} priority
                                                </span>
                                                {(() => {
                                                    const category = getOSSCategory(conversation.topic);
                                                    return (
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                                            {category.name}
                                                        </span>
                                                    );
                                                })()}
                                            </div>

                                            <p className="text-sm text-gray-600 mb-1">{conversation.contact?.contact_email}</p>
                                            <p className="text-sm text-gray-500 mb-3">Company: {conversation.contact?.company_name}</p>

                                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center space-x-1">
                                                    <ClockIcon className="h-4 w-4" />
                                                    <span>Started: {formatDate(conversation.started_at)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span>Duration: {getTimeDifference(conversation.started_at, conversation.ended_at)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        <span className="font-medium">Topic:</span> {conversation.topic}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <span className="text-xs text-gray-500">{formatDate(conversation.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2 ml-4">
                                        <Link
                                            href={`/chat/${conversation.id}`}
                                            className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                        >
                                            <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-2" />
                                            Open Chat
                                        </Link>

                                        {conversation.status === 'active' && (
                                            <button
                                                onClick={() => agentChatApi.closeSession(conversation.id)}
                                                className="inline-flex items-center px-3 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                                            >
                                                <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                                                Close
                                            </button>
                                        )}

                                        {conversation.priority === 'urgent' && (
                                            <div className="inline-flex items-center px-2 py-1 border border-red-300 rounded-lg text-xs font-medium text-red-700 bg-red-50">
                                                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                                Urgent
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
