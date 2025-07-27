'use client';

import { useState, useEffect } from 'react';
import { useAgentHeartbeatContext } from '@/components/providers/AgentHeartbeatProvider';
import { AgentStatusType } from '@/components/providers/useAgentHeartbeat';
import { useAuth } from '@/components/providers/AuthProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export function AgentStatusIndicator() {
    const { user } = useAuth();
    const { setStatus, currentStatus, isActive } = useAgentHeartbeatContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Debug logging
    console.log("🎯 AgentStatusIndicator render - currentStatus:", currentStatus);

    // Monitor localStorage for debugging
    useEffect(() => {
        const interval = setInterval(() => {
            const stored = localStorage.getItem("agent_status");
            console.log("🔍 localStorage monitoring - stored:", stored, "currentStatus:", currentStatus);
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [currentStatus]);

    // Only show for agents and admins
    if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
        return null;
    }

    const getStatusColor = (status: AgentStatusType) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'busy':
                return 'bg-red-500';
            case 'away':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (status: AgentStatusType) => {
        switch (status) {
            case 'online':
                return 'Online';
            case 'busy':
                return 'Busy';
            case 'away':
                return 'Away';
            default:
                return 'Offline';
        }
    };

    const statusOptions: { value: AgentStatusType; label: string; color: string }[] = [
        { value: 'online', label: 'Online', color: 'bg-green-500' },
        { value: 'busy', label: 'Busy', color: 'bg-red-500' },
        { value: 'away', label: 'Away', color: 'bg-yellow-500' },
    ];

    const handleStatusChange = (newStatus: AgentStatusType) => {
        console.log("🖱️ User clicked status change:", newStatus);
        console.log("📋 Current status before change:", currentStatus);

        setStatus(newStatus);
        setIsDropdownOpen(false);

        // Check localStorage after a brief delay
        setTimeout(() => {
            const stored = localStorage.getItem("agent_status");
            console.log("🔍 localStorage after status change:", stored);
        }, 100);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(currentStatus)} ${isActive ? '' : 'opacity-50'}`} />
                    <span className="text-sm font-medium text-gray-700">
                        {getStatusText(currentStatus)}
                    </span>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${currentStatus === option.value ? 'bg-gray-50' : ''
                                }`}
                        >
                            <div className={`h-3 w-3 rounded-full ${option.color}`} />
                            <span className="text-gray-700">{option.label}</span>
                            {currentStatus === option.value && (
                                <div className="ml-auto h-2 w-2 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
