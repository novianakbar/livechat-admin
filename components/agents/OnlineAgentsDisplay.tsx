'use client';

import { useState, useEffect, useCallback } from 'react';
import { agentStatusApi, AgentOnlineStatus, DepartmentStats } from '@/lib/api';
import {
    UserIcon,
    ClockIcon,
    BuildingOfficeIcon,
    SignalIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface OnlineAgentsDisplayProps {
    refreshInterval?: number;
}

export function OnlineAgentsDisplay({ refreshInterval = 30000 }: OnlineAgentsDisplayProps) {
    const [onlineAgents, setOnlineAgents] = useState<AgentOnlineStatus[]>([]);
    const [departmentStats, setDepartmentStats] = useState<DepartmentStats>({});
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

    const loadOnlineAgents = useCallback(async () => {
        try {
            const [agentsData, statsData] = await Promise.all([
                agentStatusApi.getOnlineAgents(),
                agentStatusApi.getDepartmentStats(),
            ]);

            setOnlineAgents(agentsData.agents);
            setDepartmentStats(statsData.departments);
        } catch (error) {
            console.error('Failed to load online agents:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOnlineAgents();

        // Set up refresh interval
        const interval = setInterval(loadOnlineAgents, refreshInterval);
        return () => clearInterval(interval);
    }, [loadOnlineAgents, refreshInterval]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'text-green-600 bg-green-100';
            case 'busy':
                return 'text-red-600 bg-red-100';
            case 'away':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        return <div className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-green-500' :
                status === 'busy' ? 'bg-red-500' :
                    status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />;
    };

    const filteredAgents = selectedDepartment === 'all'
        ? onlineAgents
        : onlineAgents.filter(agent => agent.department === selectedDepartment);

    const departmentOptions = ['all', ...Object.keys(departmentStats)];

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <SignalIcon className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-medium text-gray-900">
                            Online Agents ({filteredAgents.length})
                        </h3>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Department Filter */}
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            {departmentOptions.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept === 'all' ? 'All Departments' : `${dept} (${departmentStats[dept] || 0})`}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={loadOnlineAgents}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {filteredAgents.length === 0 ? (
                    <div className="text-center py-8">
                        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No agents online</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {selectedDepartment === 'all'
                                ? 'No agents are currently online.'
                                : `No agents are online in the ${selectedDepartment} department.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredAgents.map((agent) => (
                            <div
                                key={agent.agent_id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-gray-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{agent.name}</h4>
                                        <p className="text-sm text-gray-500">{agent.email}</p>
                                        {agent.department && (
                                            <div className="flex items-center mt-1">
                                                <BuildingOfficeIcon className="h-3 w-3 text-gray-400 mr-1" />
                                                <span className="text-xs text-gray-500">{agent.department}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(agent.status)}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                                                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <ClockIcon className="h-3 w-3 mr-1" />
                                            {formatDistanceToNow(new Date(agent.last_heartbeat), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Department Statistics Summary */}
            {Object.keys(departmentStats).length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Department Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(departmentStats).map(([department, count]) => (
                            <div key={department} className="text-center">
                                <div className="text-lg font-semibold text-gray-900">{count}</div>
                                <div className="text-xs text-gray-500 truncate" title={department}>
                                    {department}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
