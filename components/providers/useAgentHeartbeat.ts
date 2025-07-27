"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { agentStatusApi } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";

export type AgentStatusType = "online" | "busy" | "away";

interface UseAgentHeartbeatOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  onError?: (error: Error) => void;
  onSuccess?: (status: string) => void;
}

// Local storage key for agent status persistence
const AGENT_STATUS_STORAGE_KEY = "agent_status";

// Helper functions for localStorage
const getStoredStatus = (): AgentStatusType => {
  if (typeof window === "undefined") return "online";

  try {
    const stored = localStorage.getItem(AGENT_STATUS_STORAGE_KEY);
    console.log("🔍 Reading status from localStorage:", stored);
    if (stored && ["online", "busy", "away"].includes(stored)) {
      console.log("✅ Valid status found:", stored);
      return stored as AgentStatusType;
    }
    console.log("⚠️ No valid status found, using default 'online'");
  } catch (error) {
    console.warn("❌ Failed to read agent status from localStorage:", error);
  }

  return "online";
};

const setStoredStatus = (status: AgentStatusType): void => {
  if (typeof window === "undefined") return;

  try {
    console.log("🔄 Saving status to localStorage:", status);
    // console.log("📍 Stack trace for localStorage save:", new Error().stack);
    localStorage.setItem(AGENT_STATUS_STORAGE_KEY, status);
    const saved = localStorage.getItem(AGENT_STATUS_STORAGE_KEY);
    console.log("✅ Status saved successfully, verification read:", saved);
  } catch (error) {
    console.warn("❌ Failed to save agent status to localStorage:", error);
  }
};

export function useAgentHeartbeat(options: UseAgentHeartbeatOptions = {}) {
  const {
    enabled = true,
    interval = 3 * 60 * 1000, // 3 minutes default
    onError,
    onSuccess,
  } = options;

  const { user, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  // Use useState for reactive status management
  const [currentStatus, setCurrentStatus] = useState<AgentStatusType>(() =>
    getStoredStatus()
  );

  // Check if user is agent/admin
  const isAgent = user?.role === "agent" || user?.role === "admin";

  const sendHeartbeat = useCallback(
    async (status?: AgentStatusType) => {
      if (!isAuthenticated || !isAgent) return;

      try {
        const statusToSend = status || currentStatus;
        const response = await agentStatusApi.sendHeartbeat(statusToSend);
        onSuccess?.(response.status);
      } catch (error) {
        console.error("Heartbeat failed:", error);
        onError?.(error as Error);
      }
    },
    [isAuthenticated, isAgent, currentStatus, onSuccess, onError]
  );

  const setStatus = useCallback(
    (status: AgentStatusType) => {
      console.log("🎯 setStatus called with:", status);
      setCurrentStatus(status);
      setStoredStatus(status);
      if (enabled && isAuthenticated && isAgent) {
        console.log("📡 Sending heartbeat with status:", status);
        sendHeartbeat(status);
      } else {
        console.log(
          "⏸️ Heartbeat not sent - enabled:",
          enabled,
          "isAuthenticated:",
          isAuthenticated,
          "isAgent:",
          isAgent
        );
      }
    },
    [enabled, isAuthenticated, isAgent, sendHeartbeat]
  );

  const startHeartbeat = useCallback(() => {
    if (!enabled || !isAuthenticated || !isAgent) return;

    // Send initial heartbeat
    sendHeartbeat();

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up recurring heartbeat
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        sendHeartbeat();
      }
    }, interval);
  }, [enabled, isAuthenticated, isAgent, interval, sendHeartbeat]);

  const stopHeartbeat = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setOffline = useCallback(async () => {
    try {
      console.log("📴 Setting agent offline");
      await agentStatusApi.setOffline();
      stopHeartbeat();
      // Don't clear localStorage here - only clear on explicit logout
    } catch (error) {
      console.error("Failed to set agent offline:", error);
      onError?.(error as Error);
    }
  }, [stopHeartbeat, onError]);

  // Start/stop heartbeat based on auth state and enabled flag
  useEffect(() => {
    if (enabled && isAuthenticated && isAgent) {
      startHeartbeat();
    } else {
      stopHeartbeat();
    }

    return () => {
      stopHeartbeat();
    };
  }, [enabled, isAuthenticated, isAgent, startHeartbeat, stopHeartbeat]);

  // Initialize status on first authentication
  useEffect(() => {
    if (isAuthenticated && isAgent && enabled) {
      // Send initial heartbeat with stored status on first load
      const timeoutId = setTimeout(() => {
        sendHeartbeat(currentStatus);
      }, 1000); // Small delay to ensure everything is initialized

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAgent, enabled]); // Intentionally limited deps to avoid loops

  // Cleanup on unmount - use ref to track if component is unmounting
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    return () => {
      console.log("🧹 useAgentHeartbeat cleanup on unmount");
      isUnmountingRef.current = true;

      // Only set offline on actual unmount (page reload/close), not on auth state changes
      // We'll rely on server-side timeout for status cleanup instead
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty deps - only run on mount/unmount

  return {
    setStatus,
    setOffline,
    sendHeartbeat: () => sendHeartbeat(),
    currentStatus,
    isActive: isActiveRef.current,
  };
}
