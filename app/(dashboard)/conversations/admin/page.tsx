'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ChatBubbleBottomCenterTextIcon,
    EllipsisVerticalIcon,
    ClockIcon,
    UserIcon,
    PhoneIcon,
    ArchiveBoxIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { chatApi, ChatSession } from '@/lib/api';

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConversations, setSelectedConversations] = useState<string[]>([]);

    const loadConversations = useCallback(async () => {
        try {
            setLoading(true);
            const params = selectedFilter === 'all' ? {} : { status: selectedFilter };
            const result = await chatApi.getSessions(params);
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
        { id: 'nib', name: 'NIB', count: conversations.filter(c => c.topic.toLowerCase().includes('nib')).length },
        { id: 'izin', name: 'Perizinan', count: conversations.filter(c => c.topic.toLowerCase().includes('izin')).length }
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
            case 'nib':
                matchesFilter = conversation.topic.toLowerCase().includes('nib');
                break;
            case 'izin':
                matchesFilter = conversation.topic.toLowerCase().includes('izin');
                break;
            default:
                matchesFilter = conversation.status === selectedFilter;
        }

        const matchesSearch = conversation.contact?.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conversation.contact?.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conversation.topic.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleSelectConversation = (id: string) => {
        setSelectedConversations(prev =>
            prev.includes(id)
                ? prev.filter(convId => convId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedConversations.length === filteredConversations.length) {
            setSelectedConversations([]);
        } else {
            setSelectedConversations(filteredConversations.map(c => c.id));
        }
    };

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
                    <h1 className="text-2xl font-semibold text-gray-900">Percakapan</h1>
                    <p className="text-sm text-gray-600">
                        Kelola semua percakapan
                    </p>
                </div>
                <div className="flex items-center">
                    <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                        Export Data
                    </button>

                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Chat Aktif</p>
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
                            <p className="text-sm font-medium text-gray-600">Menunggu</p>
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
                            <p className="text-sm font-medium text-gray-600">Rata-rata Respon</p>
                            <p className="text-2xl font-semibold text-gray-900">2.1m</p>
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
                            <p className="text-sm font-medium text-gray-600">Diselesaikan Hari Ini</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {conversations.filter(c => c.status === 'closed').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Filter Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedFilter === filter.id
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.name} ({filter.count})
                            </button>
                        ))}
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari percakapan, nama, email, atau topik..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedConversations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-blue-900">
                                {selectedConversations.length} conversation(s) selected
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Assign Agent
                            </button>
                            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Mark as Resolved
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                Archive
                            </button>
                            <button
                                onClick={() => setSelectedConversations([])}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conversations List */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedConversations.length === filteredConversations.length && filteredConversations.length > 0}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label className="ml-3 text-sm font-medium text-gray-700">
                                Select All
                            </label>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">
                            {filteredConversations.length} conversations
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredConversations.map((conversation) => (
                        <div key={conversation.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {/* Checkbox */}
                                    <div className="flex items-center pt-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedConversations.includes(conversation.id)}
                                            onChange={() => handleSelectConversation(conversation.id)}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                    </div>

                                    {/* Customer Avatar */}
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-white">
                                            {getCustomerInitials(conversation.contact?.company_name || "Unknown")}
                                        </span>
                                    </div>

                                    {/* Conversation Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {conversation.contact?.company_name}
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
                                            {conversation.agent ? (
                                                <div className="flex items-center space-x-1">
                                                    <UserIcon className="h-4 w-4" />
                                                    <span>{conversation.agent.name}</span>
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-1">
                                                    <UserIcon className="h-4 w-4" />
                                                    <span className="text-gray-400">Unassigned</span>
                                                </div>
                                            )}
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
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-2" />
                                        Open Chat
                                    </Link>

                                    {conversation.status === 'active' && (
                                        <button className="inline-flex items-center px-3 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
                                            <PhoneIcon className="h-4 w-4 mr-2" />
                                            Call
                                        </button>
                                    )}

                                    {conversation.status === 'waiting' && (
                                        <button className="inline-flex items-center px-3 py-2 border border-yellow-300 rounded-lg text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                                            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                                            Priority
                                        </button>
                                    )}

                                    {conversation.status === 'closed' && (
                                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                                            Archive
                                        </button>
                                    )}

                                    <div className="relative">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                            <EllipsisVerticalIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Load More */}
            <div className="text-center">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                    Load more conversations
                </button>
            </div>
        </div>
    );
}
