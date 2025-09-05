// Types for Ticket System API Responses
// These match the backend response models exactly

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  department_id?: string;
  department?: Department;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  color?: string;
  sla_first_response: number;
  sla_resolution: number;
  default_department_id?: string;
  default_department?: Department;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id?: string;
  user?: User;
  content: string;
  is_internal: boolean;
  is_from_customer: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  uploaded_by?: string;
  created_at: string;
}

export interface TicketHistory {
  id: string;
  ticket_id: string;
  user_id?: string;
  user?: User;
  action: string;
  old_value?: string;
  new_value?: string;
  description?: string;
  created_at: string;
}

export interface TicketSLA {
  id: string;
  ticket_id: string;
  first_response_due: string;
  first_response_at?: string;
  resolution_due: string;
  resolution_at?: string;
  is_first_response_breached: boolean;
  is_resolution_breached: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  ticket_code: string;
  subject: string;
  description: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed" | "escalated";
  created_via: "customer" | "agent" | "ai";
  category_id?: string;
  category?: TicketCategory;
  assigned_to_id?: string;
  assigned_to?: User;
  department_id?: string;
  department?: Department;
  created_by_id?: string;
  created_by?: User;
  access_token?: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketDetail extends Ticket {
  comments?: TicketComment[];
  attachments?: TicketAttachment[];
  history?: TicketHistory[];
  sla?: TicketSLA;
}

// List item type for table display
export interface TicketListItem {
  id: string;
  ticket_number: string;
  subject: string;
  description?: string;
  customer_name: string;
  customer_email: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed" | "escalated";
  category?: {
    id: string;
    name: string;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

// API Response Types (berdasarkan backend response format)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// Request Types
export interface CreateTicketRequest {
  subject: string;
  description: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  priority: string;
  category_id?: string;
  created_by?: string;
  created_via: string;
}

export interface UpdateTicketRequest {
  id: string;
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  assigned_to?: string;
}

export interface AssignTicketRequest {
  ticket_id: string;
  agent_id: string;
}

export interface EscalateTicketRequest {
  ticket_id: string;
  reason?: string;
}

export interface AddCommentRequest {
  ticket_id: string;
  content: string;
  is_public: boolean;
  created_by: string;
}

// Filter Types
export interface TicketFilter {
  status?: string[];
  priority?: string[];
  category_id?: string;
  assigned_to_id?: string;
  department_id?: string;
  created_by_id?: string;
  customer_email?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Dashboard Stats
export interface TicketStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  escalated_tickets: number;
  avg_first_response_time: number;
  avg_resolution_time: number;
  sla_breached_count: number;
  sla_compliance_rate: number;
}

// Priority and Status Constants
export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export const TICKET_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
  "escalated",
] as const;
export const CREATED_VIA_OPTIONS = ["customer", "agent", "ai"] as const;

// Color mappings for UI
export const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-yellow-100 text-yellow-800",
  urgent: "bg-red-100 text-red-800",
} as const;

export const STATUS_COLORS = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-purple-100 text-purple-800",
  closed: "bg-gray-100 text-gray-800",
  escalated: "bg-red-100 text-red-800",
} as const;
