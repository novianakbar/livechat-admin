'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    UserCircleIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import { agentApi, usersApi, agentStatusApi, User, AgentOnlineStatus } from '@/lib/api';
import { OnlineAgentsDisplay } from '@/components/agents/OnlineAgentsDisplay';

export default function AgentsPage() {
    const [agents, setAgents] = useState<User[]>([]);
    const [onlineAgentsMap, setOnlineAgentsMap] = useState<Record<string, AgentOnlineStatus>>({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'online' | 'offline' | 'busy' | 'away'>('all');

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [agentList, onlineAgentsData] = await Promise.all([
                usersApi.getAgents(),
                agentStatusApi.getOnlineAgents()
            ]);

            setAgents(agentList);

            // Create a map of online agents for quick lookup
            const onlineMap: Record<string, AgentOnlineStatus> = {};
            onlineAgentsData.agents.forEach(agent => {
                onlineMap[agent.agent_id] = agent;
            });
            setOnlineAgentsMap(onlineMap);
        } catch (error) {
            console.error('Failed to load agents:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const getAgentStatus = (agentId: string): 'online' | 'offline' | 'busy' | 'away' => {
        const onlineAgent = onlineAgentsMap[agentId];
        return onlineAgent?.status || 'offline';
    };

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchQuery.toLowerCase());
        const agentStatus = getAgentStatus(agent.id);
        const matchesStatus = selectedStatus === 'all' || agentStatus === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const statusFilters = [
        { id: 'all', label: 'All Agents', count: agents.length },
        { id: 'online', label: 'Online', count: Object.values(onlineAgentsMap).filter(agent => agent.status === 'online').length },
        { id: 'offline', label: 'Offline', count: agents.length - Object.keys(onlineAgentsMap).length },
        { id: 'busy', label: 'Busy', count: Object.values(onlineAgentsMap).filter(agent => agent.status === 'busy').length },
        { id: 'away', label: 'Away', count: Object.values(onlineAgentsMap).filter(agent => agent.status === 'away').length }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-100 text-green-800';
            case 'busy': return 'bg-yellow-100 text-yellow-800';
            case 'away': return 'bg-blue-100 text-blue-800';
            case 'offline': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'busy': return 'bg-yellow-500';
            case 'away': return 'bg-blue-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const updateAgentStatus = async (newStatus: 'online' | 'offline' | 'busy' | 'away') => {
        try {
            await agentApi.updateStatus(newStatus);
            await loadData(); // Reload all data
        } catch (error) {
            console.error('Failed to update agent status:', error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading agents...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Agents</h1>
                    <p className="text-sm text-gray-600">
                        Manage your team members and their availability
                    </p>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Agent</span>
                </button>
            </div>

            {/* Online Agents Display */}
            <OnlineAgentsDisplay refreshInterval={30000} />

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-4">
                        {statusFilters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedStatus(filter.id as 'all' | 'online' | 'offline' | 'busy' | 'away')}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedStatus === filter.id
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search agents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map(agent => {
                    const status = getAgentStatus(agent.id);
                    return (
                        <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-white">
                                                {getInitials(agent.name)}
                                            </span>
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(status)}`}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-900">{agent.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <UserCircleIcon className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-900">{agent.role}</span>
                                </div>
                                {agent.department && (
                                    <div className="flex items-center text-sm">
                                        <span className="text-gray-500 mr-3">Department:</span>
                                        <span className="text-gray-900">{agent.department.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                        View Profile
                                    </button>
                                    <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm">
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredAgents.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <UserCircleIcon className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Your Status</h3>
                <div className="flex space-x-2">
                    {['online', 'busy', 'away', 'offline'].map(status => (
                        <button
                            key={status}
                            onClick={() => updateAgentStatus(status as 'online' | 'offline' | 'busy' | 'away')}
                            className={`px-4 py-2 rounded-lg border transition-colors ${getStatusColor(status)
                                } hover:opacity-80`}
                        >
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusDot(status)}`}></div>
                                <span className="capitalize">{status}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
