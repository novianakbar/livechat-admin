export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  assignedAgent?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  content: string;
  author: {
    name: string;
    role: "customer" | "agent";
  };
  createdAt: string;
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
}

export interface CreateTicketData {
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
}
