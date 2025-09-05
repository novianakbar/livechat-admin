import {
  Ticket,
  TicketCategory,
  TicketComment,
  CreateTicketRequest,
  UpdateTicketRequest,
  AssignTicketRequest,
  AddCommentRequest,
  TicketFilter,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types/tickets";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

class TicketApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    // Merge with any existing headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  }

  // Ticket CRUD Operations (berdasarkan routes.go yang sebenarnya)
  async createTicket(data: CreateTicketRequest): Promise<ApiResponse<Ticket>> {
    return this.request<ApiResponse<Ticket>>("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTickets(filter?: TicketFilter): Promise<PaginatedResponse<Ticket>> {
    const queryParams = new URLSearchParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tickets?${queryString}` : "/tickets";

    // GetTicketList mengembalikan PaginatedResponse langsung tanpa wrapper ApiResponse
    return this.request<PaginatedResponse<Ticket>>(endpoint);
  }

  async getTicket(id: string): Promise<ApiResponse<Ticket>> {
    return this.request<ApiResponse<Ticket>>(`/tickets/${id}`);
  }

  async updateTicket(data: UpdateTicketRequest): Promise<ApiResponse<Ticket>> {
    return this.request<ApiResponse<Ticket>>(`/tickets/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getTicketByCode(code: string): Promise<ApiResponse<Ticket>> {
    return this.request<ApiResponse<Ticket>>(`/tickets/code/${code}`);
  }

  // Ticket Actions (berdasarkan routes.go)
  async assignTicket(data: AssignTicketRequest): Promise<ApiResponse<Ticket>> {
    return this.request<ApiResponse<Ticket>>(
      `/tickets/${data.ticket_id}/assign`,
      {
        method: "POST",
        body: JSON.stringify({ agent_id: data.agent_id }),
      }
    );
  }

  async escalateTicket(
    ticketId: string,
    reason?: string
  ): Promise<ApiResponse<Ticket>> {
    return this.request<ApiResponse<Ticket>>(`/tickets/${ticketId}/escalate`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async addComment(
    data: AddCommentRequest
  ): Promise<ApiResponse<TicketComment>> {
    return this.request<ApiResponse<TicketComment>>(
      `/tickets/${data.ticket_id}/comments`,
      {
        method: "POST",
        body: JSON.stringify({
          content: data.content,
          is_public: data.is_public,
          created_by: data.created_by,
        }),
      }
    );
  }

  // Agent and Department Tickets (berdasarkan routes.go)
  async getAgentTickets(
    agentId: string
  ): Promise<{ tickets: Ticket[]; total: number }> {
    // Berdasarkan handler, ini mengembalikan { tickets: [...], total: number }
    return this.request<{ tickets: Ticket[]; total: number }>(
      `/tickets/agents/${agentId}`
    );
  }

  async getDepartmentTickets(
    departmentId: string
  ): Promise<{ tickets: Ticket[]; total: number }> {
    return this.request<{ tickets: Ticket[]; total: number }>(
      `/tickets/departments/${departmentId}`
    );
  }

  // Public Access (berdasarkan routes.go)
  async getTicketByToken(token: string): Promise<ApiResponse<Ticket>> {
    return this.request<ApiResponse<Ticket>>(`/public/tickets/${token}`);
  }

  // Categories (berdasarkan routes.go)
  async getCategories(): Promise<ApiResponse<TicketCategory[]>> {
    return this.request<ApiResponse<TicketCategory[]>>("/ticket-categories");
  }

  async getCategory(id: string): Promise<ApiResponse<TicketCategory>> {
    return this.request<ApiResponse<TicketCategory>>(
      `/ticket-categories/${id}`
    );
  }
}

export const ticketApi = new TicketApiClient();
