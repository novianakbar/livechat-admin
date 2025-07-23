// Agent-specific API calls - Simple wrapper around existing API
import { chatApi } from "./api";

// Agent Chat API - only for agents, uses existing chatApi functions
export const agentChatApi = {
  // Get sessions assigned to current agent
  getMySessions: chatApi.getAgentSessions,

  // Get specific session (if assigned to current agent)
  getMySession: chatApi.getAgentSession,

  // Get connection status for agent session - use admin endpoint as agent can access their assigned sessions
  getMySessionConnectionStatus: chatApi.getSessionConnectionStatus,

  // Send message as agent
  sendMessage: chatApi.sendMessage,

  // Close session as agent - use admin endpoint as agent can close their assigned sessions
  closeSession: chatApi.closeSession,
};
