import { UUID } from "crypto";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Types matching backend entities
export interface User {
  id: UUID;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  department_id?: UUID;
  department?: Department;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: UUID;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// export interface Customer {
//   id: UUID;
//   company_name: string;
//   person_name: string;
//   email: string;
//   ip_address: string;
//   created_at: string;
//   updated_at: string;
// }

export interface ChatUser {
  id: UUID;
  browser_uuid: string;
  oss_user_id?: UUID;
  email?: string;
  is_anonymous: boolean;
  ip_address: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Contact {
  id: UUID;
  session_id: UUID;
  session?: ChatSession;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  position: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ChatSession {
  id: UUID;
  chat_user_id: UUID;
  chat_user: ChatUser;
  agent_id?: UUID;
  agent?: User;
  department_id?: UUID;
  department?: Department;
  topic: string;
  status: "waiting" | "active" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  started_at: string;
  ended_at?: string;
  contact?: Contact;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ChatMessage {
  id: UUID;
  session_id: UUID;
  session?: ChatSession;
  sender_id?: UUID;
  sender?: User;
  sender_type: "customer" | "agent" | "system";
  message: string;
  message_type: "text" | "image" | "file" | "system";
  attachments?: string[];
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatTag {
  id: UUID;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface AgentStatus {
  id: UUID;
  agent_id: UUID;
  agent: User;
  status: "online" | "offline" | "busy" | "away";
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatAnalytics {
  id: UUID;
  date: string;
  total_sessions: number;
  completed_sessions: number;
  average_response_time: number;
  total_messages: number;
  department_id?: UUID;
  department?: Department;
  agent_id?: UUID;
  agent?: User;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  activeSessions: number;
  waitingSessions: number;
  completedToday: number;
  averageResponseTime: number;
  totalAgents: number;
  onlineAgents: number;
  topQuestions: { question: string; count: number }[];
  ossCategories: { category: string; count: number; percentage: number }[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

// Auth token management with automatic refresh
let authToken: string | null = null;
let refreshToken: string | null = null;
let tokenRefreshPromise: Promise<string> | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function setRefreshToken(token: string) {
  refreshToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("refresh_token", token);
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("auth_token");
  }
  return authToken;
}

export function getRefreshToken(): string | null {
  if (refreshToken) return refreshToken;
  if (typeof window !== "undefined") {
    refreshToken = localStorage.getItem("refresh_token");
  }
  return refreshToken;
}

export function clearAuthTokens() {
  authToken = null;
  refreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  }
}

// Automatic token refresh
async function refreshAuthToken(): Promise<string | null> {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    return null;
  }

  tokenRefreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: currentRefreshToken }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setAuthToken(data.data.access_token);
        setRefreshToken(data.data.refresh_token);
        return data.data.access_token;
      }
      throw new Error("Invalid refresh response");
    } catch (error) {
      clearAuthTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw error;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
}

// API helper function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add any existing headers
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Important for CORS with cookies
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Try to refresh token first
      const newToken = await refreshAuthToken();
      if (newToken) {
        // Retry the request with new token
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: "include",
        });

        if (retryResponse.ok) {
          return retryResponse.json();
        }
      }

      // If refresh failed or retry failed, redirect to login
      clearAuthTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Unauthorized"));
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; refresh_token: string; user: User }> => {
    const response = await apiCall<
      ApiResponse<{ access_token: string; refresh_token: string; user: User }>
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return {
      token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      user: response.data.user,
    };
  },

  logout: async (): Promise<void> => {
    try {
      await apiCall<ApiResponse<void>>("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      // Clear tokens regardless of API response
      clearAuthTokens();
    }
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> => {
    const response = await apiCall<
      ApiResponse<{ access_token: string; refresh_token: string }>
    >("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: "include",
    });
    return response.data;
  },

  validateSession: async (): Promise<User> => {
    const response = await apiCall<ApiResponse<User>>("/auth/validate");
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    department_id?: UUID;
  }): Promise<User> => {
    const response = await apiCall<ApiResponse<User>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await apiCall<ApiResponse<User>>("/auth/me");
    return response.data;
  },
};

// Chat API
export const chatApi = {
  getSessions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    agent_id?: UUID;
    department_id?: UUID;
  }): Promise<{ sessions: ChatSession[]; pagination: PaginationInfo }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.status) queryParams.set("status", params.status);
    if (params?.agent_id) queryParams.set("agent_id", params.agent_id);
    if (params?.department_id)
      queryParams.set("department_id", params.department_id);

    const response = await apiCall<PaginatedResponse<ChatSession>>(
      `/chat-management/admin/sessions?${queryParams.toString()}`
    );
    return { sessions: response.data, pagination: response.pagination };
  },

  // Agent-specific endpoints
  getAgentSessions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ sessions: ChatSession[]; pagination: PaginationInfo }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.status) queryParams.set("status", params.status);

    const response = await apiCall<PaginatedResponse<ChatSession>>(
      `/chat-management/agent/sessions?${queryParams.toString()}`
    );
    return { sessions: response.data, pagination: response.pagination };
  },

  getSession: async (sessionId: UUID): Promise<ChatSession> => {
    const response = await apiCall<ApiResponse<ChatSession>>(
      `/chat-management/agent/sessions/${sessionId}`
    );
    return response.data;
  },

  getAgentSession: async (sessionId: UUID): Promise<ChatSession> => {
    const response = await apiCall<ApiResponse<ChatSession>>(
      `/chat-management/agent/sessions/${sessionId}`
    );
    return response.data;
  },

  getSessionConnectionStatus: async (
    sessionId: UUID
  ): Promise<{
    customer_connected: boolean;
    agent_connected: boolean;
    total_customer: number;
    total_agent: number;
  }> => {
    try {
      // Use the new WebSocket server endpoint for connection status with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `http://localhost:8081/api/session/${sessionId}/connection-status`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            "Connection timeout - WebSocket server is not responding"
          );
        }
        if (error.message.includes("fetch")) {
          throw new Error(
            "WebSocket server is unavailable - connection refused"
          );
        }
      }
      throw new Error(
        `Failed to get connection status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  getMessages: async (sessionId: UUID): Promise<ChatMessage[]> => {
    const response = await apiCall<ApiResponse<ChatMessage[]>>(
      `/public/chat/session/${sessionId}/messages`
    );
    return response.data;
  },

  sendMessage: async (
    sessionId: UUID,
    message: {
      message: string;
      message_type?: string;
      attachments?: string[];
    }
  ): Promise<ChatMessage> => {
    const response = await apiCall<ApiResponse<ChatMessage>>(
      `/chat-management/agent/message`,
      {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          ...message,
        }),
      }
    );
    return response.data;
  },

  assignAgent: async (sessionId: UUID, agentId: UUID): Promise<ChatSession> => {
    const response = await apiCall<ApiResponse<ChatSession>>(
      `/chat/admin/assign`,
      {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          agent_id: agentId,
        }),
      }
    );
    return response.data;
  },

  closeSession: async (
    sessionId: UUID,
    data?: { reason?: string; rating?: number; feedback?: string }
  ): Promise<ChatSession> => {
    const response = await apiCall<ApiResponse<ChatSession>>(
      `/chat/admin/close`,
      {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          ...data,
        }),
      }
    );
    return response.data;
  },

  addTag: async (sessionId: UUID, tagId: UUID): Promise<void> => {
    await apiCall(`/chat/sessions/${sessionId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tag_id: tagId }),
    });
  },

  removeTag: async (sessionId: UUID, tagId: UUID): Promise<void> => {
    await apiCall(`/chat/sessions/${sessionId}/tags/${tagId}`, {
      method: "DELETE",
    });
  },
};

// Agent API
export const agentApi = {
  getAgents: async (): Promise<User[]> => {
    const response = await apiCall<ApiResponse<User[]>>("/agents");
    return response.data;
  },

  getAgentStatus: async (): Promise<AgentStatus[]> => {
    const response = await apiCall<ApiResponse<AgentStatus[]>>(
      "/agents/status"
    );
    return response.data;
  },

  updateStatus: async (
    status: "online" | "offline" | "busy" | "away"
  ): Promise<AgentStatus> => {
    const response = await apiCall<ApiResponse<AgentStatus>>("/agents/status", {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },
};

// Agent Status API - New Agent Online Status feature
export const agentStatusApi = {
  // Send heartbeat to mark agent as online
  sendHeartbeat: async (
    status?: "online" | "busy" | "away"
  ): Promise<{ agent_id: string; status: string }> => {
    const response = await apiCall<
      ApiResponse<{ agent_id: string; status: string }>
    >("/agent-status/heartbeat", {
      method: "POST",
      body: JSON.stringify({ status: status || "online" }),
    });
    return response.data;
  },

  // Set agent as offline
  setOffline: async (): Promise<{ agent_id: string; status: string }> => {
    const response = await apiCall<
      ApiResponse<{ agent_id: string; status: string }>
    >("/agent-status/offline", {
      method: "POST",
    });
    return response.data;
  },

  // Get all online agents
  getOnlineAgents: async (): Promise<{
    agents: AgentOnlineStatus[];
    count: number;
  }> => {
    const response = await apiCall<
      ApiResponse<{ agents: AgentOnlineStatus[]; count: number }>
    >("/agent-status/online");
    return response.data;
  },

  // Get online agents by department
  getOnlineAgentsByDepartment: async (
    departmentId: string
  ): Promise<{
    department_id: string;
    agents: AgentOnlineStatus[];
    count: number;
  }> => {
    const response = await apiCall<
      ApiResponse<{
        department_id: string;
        agents: AgentOnlineStatus[];
        count: number;
      }>
    >(`/agent-status/department/${departmentId}`);
    return response.data;
  },

  // Get specific agent status
  getAgentStatus: async (
    agentId: string
  ): Promise<{
    agent?: AgentOnlineStatus;
    online: boolean;
  }> => {
    const response = await apiCall<
      ApiResponse<{
        agent?: AgentOnlineStatus;
        online: boolean;
      }>
    >(`/agent-status/agent/${agentId}`);
    return response.data;
  },

  // Get department statistics
  getDepartmentStats: async (): Promise<{ departments: DepartmentStats }> => {
    const response = await apiCall<
      ApiResponse<{ departments: DepartmentStats }>
    >("/agent-status/stats");
    return response.data;
  },
};

// Tags API
export const tagsApi = {
  getTags: async (): Promise<ChatTag[]> => {
    const response = await apiCall<ApiResponse<ChatTag[]>>("/tags");
    return response.data;
  },

  createTag: async (tag: {
    name: string;
    color?: string;
  }): Promise<ChatTag> => {
    const response = await apiCall<ApiResponse<ChatTag>>("/tags", {
      method: "POST",
      body: JSON.stringify(tag),
    });
    return response.data;
  },

  updateTag: async (
    tagId: UUID,
    tag: { name?: string; color?: string }
  ): Promise<ChatTag> => {
    const response = await apiCall<ApiResponse<ChatTag>>(`/tags/${tagId}`, {
      method: "PUT",
      body: JSON.stringify(tag),
    });
    return response.data;
  },

  deleteTag: async (tagId: UUID): Promise<void> => {
    await apiCall(`/tags/${tagId}`, {
      method: "DELETE",
    });
  },
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiCall<ApiResponse<DashboardStats>>(
      "/analytics/dashboard"
    );
    return response.data;
  },

  getAnalytics: async (params?: {
    start_date?: string;
    end_date?: string;
    department_id?: UUID;
    agent_id?: UUID;
  }): Promise<{ analytics: ChatAnalytics[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.set("start_date", params.start_date);
    if (params?.end_date) queryParams.set("end_date", params.end_date);
    if (params?.department_id)
      queryParams.set("department_id", params.department_id);
    if (params?.agent_id) queryParams.set("agent_id", params.agent_id);

    const response = await apiCall<ApiResponse<ChatAnalytics[]>>(
      `/analytics?${queryParams.toString()}`
    );
    return { analytics: response.data };
  },
};

// Departments API
export const departmentsApi = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiCall<ApiResponse<Department[]>>("/departments");
    return response.data;
  },

  createDepartment: async (department: {
    name: string;
    description?: string;
  }): Promise<Department> => {
    const response = await apiCall<ApiResponse<Department>>("/departments", {
      method: "POST",
      body: JSON.stringify(department),
    });
    return response.data;
  },
};

export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: string;
}

// WebSocket connection
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    private onMessage: (data: WebSocketMessage) => void,
    private onError?: (error: Event) => void
  ) {}

  connect() {
    const token = getAuthToken();
    if (!token) {
      console.error("No auth token available for WebSocket connection");
      return;
    }

    // Connect to the new WebSocket server
    const wsUrl = `ws://localhost:8081/ws/session_id/agent_id/agent`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket connected to livechat-ws server");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage(data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (this.onError) {
        this.onError(error);
      }
    };
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  sendMessage(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Users API
export const usersApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    department_id?: UUID;
  }): Promise<{ users: User[]; pagination: PaginationInfo }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.role) queryParams.set("role", params.role);
    if (params?.department_id)
      queryParams.set("department_id", params.department_id);

    const response = await apiCall<PaginatedResponse<User>>(
      `/users?${queryParams.toString()}`
    );
    return { users: response.data, pagination: response.pagination };
  },

  getUser: async (userId: UUID): Promise<User> => {
    const response = await apiCall<ApiResponse<User>>(`/users/${userId}`);
    return response.data;
  },

  getAgents: async (): Promise<User[]> => {
    const response = await apiCall<ApiResponse<User[]>>(`/users/agents`);
    return response.data;
  },
};

export interface AgentOnlineStatus {
  agent_id: string;
  name: string;
  email: string;
  department_id?: string;
  department: string;
  status: "online" | "busy" | "away";
  last_heartbeat: string;
}

export interface DepartmentStats {
  [department: string]: number;
}
