'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAgentHeartbeat, AgentStatusType } from './useAgentHeartbeat';

interface AgentHeartbeatContextType {
    setStatus: (status: AgentStatusType) => void;
    setOffline: () => Promise<void>;
    sendHeartbeat: () => void;
    currentStatus: AgentStatusType;
    isActive: boolean;
}

const AgentHeartbeatContext = createContext<AgentHeartbeatContextType | undefined>(undefined);

export function useAgentHeartbeatContext() {
    const context = useContext(AgentHeartbeatContext);
    if (context === undefined) {
        throw new Error('useAgentHeartbeatContext must be used within an AgentHeartbeatProvider');
    }
    return context;
}

interface AgentHeartbeatProviderProps {
    children: ReactNode;
}

export function AgentHeartbeatProvider({ children }: AgentHeartbeatProviderProps) {
    const heartbeat = useAgentHeartbeat({
        enabled: true,
        interval: 3 * 60 * 1000, // 3 minutes
        onError: (error) => {
            console.error('Agent heartbeat error:', error);
        },
        onSuccess: (status) => {
            console.log('Agent heartbeat successful:', status);
        },
    });

    return (
        <AgentHeartbeatContext.Provider value={heartbeat}>
            {children}
        </AgentHeartbeatContext.Provider>
    );
}
