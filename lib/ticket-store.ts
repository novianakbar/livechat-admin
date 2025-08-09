import { create } from "zustand";
import { Ticket, TicketComment, CreateTicketData } from "./types/ticket";

// Dummy data
const dummyTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to access my account",
    description:
      'I have been trying to log into my account for the past hour but keep getting an error message saying "Invalid credentials". I am sure I am using the correct email and password. Can you please help me resolve this issue?',
    status: "open",
    priority: "high",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
    },
    assignedAgent: {
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
    },
    createdAt: "2025-01-08T10:30:00Z",
    updatedAt: "2025-01-08T10:30:00Z",
    attachments: [
      {
        name: "error-screenshot.png",
        url: "/uploads/error-screenshot.png",
        size: 2048,
      },
    ],
    comments: [
      {
        id: "CMT-001",
        content:
          "Thank you for contacting us. I will look into this issue right away and get back to you within 2 hours.",
        author: {
          name: "Sarah Wilson",
          role: "agent",
        },
        createdAt: "2025-01-08T10:45:00Z",
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Billing question about last month charge",
    description:
      "I noticed an unexpected charge on my bill last month. The amount seems higher than usual and I would like to understand what services contributed to this increase.",
    status: "in_progress",
    priority: "medium",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    assignedAgent: {
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
    },
    createdAt: "2025-01-07T14:20:00Z",
    updatedAt: "2025-01-08T09:15:00Z",
    comments: [
      {
        id: "CMT-002",
        content:
          "I have reviewed your account and found the additional charges were due to overage fees. Let me prepare a detailed breakdown for you.",
        author: {
          name: "Mike Johnson",
          role: "agent",
        },
        createdAt: "2025-01-08T09:15:00Z",
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "Feature request: Dark mode support",
    description:
      "It would be great if the application had a dark mode option. Many users prefer dark themes, especially when working late hours. This would greatly improve user experience.",
    status: "open",
    priority: "low",
    customer: {
      name: "Alex Chen",
      email: "alex.chen@example.com",
    },
    createdAt: "2025-01-06T16:45:00Z",
    updatedAt: "2025-01-06T16:45:00Z",
    comments: [],
  },
  {
    id: "TKT-004",
    subject: "Application crashes when uploading large files",
    description:
      "Every time I try to upload files larger than 10MB, the application crashes. This is happening consistently across different file types (PDF, images, documents). I need to upload these files for my work.",
    status: "resolved",
    priority: "urgent",
    customer: {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      phone: "+1987654321",
    },
    assignedAgent: {
      name: "David Lee",
      email: "david.lee@company.com",
    },
    createdAt: "2025-01-05T11:30:00Z",
    updatedAt: "2025-01-08T08:20:00Z",
    comments: [
      {
        id: "CMT-003",
        content:
          "I have identified the issue and deployed a fix. Please try uploading your files again and let me know if you encounter any problems.",
        author: {
          name: "David Lee",
          role: "agent",
        },
        createdAt: "2025-01-08T08:20:00Z",
      },
      {
        id: "CMT-004",
        content:
          "Perfect! The upload is working fine now. Thank you for the quick resolution!",
        author: {
          name: "Emily Rodriguez",
          role: "customer",
        },
        createdAt: "2025-01-08T08:45:00Z",
      },
    ],
  },
  {
    id: "TKT-005",
    subject: "Password reset not working",
    description:
      'I clicked on the "Forgot Password" link but I am not receiving any reset emails. I have checked my spam folder as well. Can you please reset my password manually?',
    status: "closed",
    priority: "medium",
    customer: {
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
    },
    assignedAgent: {
      name: "Lisa Brown",
      email: "lisa.brown@company.com",
    },
    createdAt: "2025-01-04T09:15:00Z",
    updatedAt: "2025-01-05T10:30:00Z",
    comments: [
      {
        id: "CMT-005",
        content:
          "I have manually reset your password and sent you a new temporary password via email. Please check your inbox.",
        author: {
          name: "Lisa Brown",
          role: "agent",
        },
        createdAt: "2025-01-04T10:30:00Z",
      },
      {
        id: "CMT-006",
        content:
          "Received the email and was able to login successfully. Thank you!",
        author: {
          name: "Robert Wilson",
          role: "customer",
        },
        createdAt: "2025-01-05T10:30:00Z",
      },
    ],
  },
];

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  createTicket: (data: CreateTicketData) => Promise<Ticket>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  addComment: (
    ticketId: string,
    comment: Omit<TicketComment, "id" | "createdAt">
  ) => Promise<void>;
}

export const ticketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ tickets: dummyTickets, loading: false });
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      set({ error: "Failed to fetch tickets", loading: false });
    }
  },

  createTicket: async (data: CreateTicketData) => {
    const newTicket: Ticket = {
      id: `TKT-${String(Date.now()).slice(-3).padStart(3, "0")}`,
      subject: data.subject,
      description: data.description,
      status: "open",
      priority: data.priority,
      customer: data.customer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: data.attachments || [],
      comments: [],
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentTickets = get().tickets;
    set({ tickets: [newTicket, ...currentTickets] });

    return newTicket;
  },

  updateTicket: async (id: string, updates: Partial<Ticket>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentTickets = get().tickets;
    const updatedTickets = currentTickets.map((ticket) =>
      ticket.id === id
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    );

    set({ tickets: updatedTickets });
  },

  addComment: async (
    ticketId: string,
    comment: Omit<TicketComment, "id" | "createdAt">
  ) => {
    const newComment: TicketComment = {
      id: `CMT-${Date.now()}`,
      ...comment,
      createdAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentTickets = get().tickets;
    const updatedTickets = currentTickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            comments: [...ticket.comments, newComment],
            updatedAt: new Date().toISOString(),
          }
        : ticket
    );

    set({ tickets: updatedTickets });
  },
}));
