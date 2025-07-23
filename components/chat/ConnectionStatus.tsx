'use client';

import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '@/lib/api';
import { UUID } from 'crypto';

interface ConnectionStatusProps {
    sessionId: string;
}

interface ConnectionInfo {
    customer_connected: boolean;
    agent_connected: boolean;
    total_customer: number;
    total_agent: number;
}

export default function ConnectionStatus({ sessionId }: ConnectionStatusProps) {
    const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadInitialConnectionStatus = useCallback(async () => {
        try {
            setLoading(true);
            const status = await chatApi.getSessionConnectionStatus(sessionId as UUID);
            setConnectionInfo(status);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to load connection status:', error);
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        // Load initial status once
        loadInitialConnectionStatus();

        // Listen untuk real-time updates via WebSocket events
        const handleConnectionUpdate = (event: CustomEvent) => {
            console.log('📡 Connection status updated via WebSocket:', event.detail);
            setConnectionInfo(event.detail);
            setLastUpdated(new Date());
            setLoading(false); // Ensure loading is false when we get updates
        };

        window.addEventListener('connection-status-update', handleConnectionUpdate as EventListener);

        return () => {
            window.removeEventListener('connection-status-update', handleConnectionUpdate as EventListener);
        };
    }, [loadInitialConnectionStatus]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                <span>Checking...</span>
            </div>
        );
    }

    if (!connectionInfo) {
        return null;
    }

    return (
        <div className="flex items-center gap-4 text-sm">
            {/* Customer Status */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connectionInfo.customer_connected ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                <span className="text-gray-600">
                    Customer: <span className={connectionInfo.customer_connected ? 'text-green-600 font-medium' : 'text-gray-500'}>
                        {connectionInfo.customer_connected ? 'Connected' : 'Disconnected'}
                    </span>
                </span>
            </div>

            {/* Agent Status */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connectionInfo.agent_connected ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                <span className="text-gray-600">
                    Agent: <span className={connectionInfo.agent_connected ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                        {connectionInfo.agent_connected ? 'Connected' : 'Disconnected'}
                    </span>
                </span>
            </div>

            {/* Total Clients */}
            <div className="text-gray-500 text-xs">
                ({connectionInfo.total_agent} agent)
                {lastUpdated && (
                    <span className="ml-1 text-gray-400">
                        • {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}
