import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Ticket,
  TicketCategory,
  TicketFilter,
  TicketStats,
  CreateTicketRequest,
  UpdateTicketRequest,
  AssignTicketRequest,
  AddCommentRequest,
  PaginatedResponse,
} from "@/lib/types/tickets";
import { ticketApi } from "@/lib/api/tickets";

interface TicketStore {
  // State
  tickets: Ticket[];
  categories: TicketCategory[];
  currentTicket: Ticket | null;
  stats: TicketStats | null;
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };

  // Filters
  filters: TicketFilter;

  // Actions
  fetchTickets: (filter?: TicketFilter) => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  fetchTicketByCode: (code: string) => Promise<void>;
  createTicket: (data: CreateTicketRequest) => Promise<void>;
  updateTicket: (data: UpdateTicketRequest) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  assignTicket: (data: AssignTicketRequest) => Promise<void>;
  escalateTicket: (ticketId: string, reason?: string) => Promise<void>;
  addComment: (data: AddCommentRequest) => Promise<void>;

  // Categories
  fetchCategories: () => Promise<void>;

  // Dashboard
  fetchStats: () => Promise<void>;

  // Filters and pagination
  setFilters: (filters: Partial<TicketFilter>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  // Utilities
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

const initialFilters: TicketFilter = {
  limit: 20,
  offset: 0,
  sort_by: "created_at",
  sort_order: "desc",
};

const initialPagination = {
  page: 1,
  limit: 20,
  total: 0,
  total_pages: 0,
};

export const useTicketStore = create<TicketStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      tickets: [],
      categories: [],
      currentTicket: null,
      stats: null,
      loading: false,
      error: null,
      pagination: initialPagination,
      filters: initialFilters,

      // Fetch tickets with pagination and filters
      fetchTickets: async (filter?: TicketFilter) => {
        set({ loading: true, error: null });
        try {
          const currentFilters = { ...get().filters, ...filter };
          const response: PaginatedResponse<Ticket> =
            await ticketApi.getTickets(currentFilters);

          set({
            tickets: response.data,
            pagination: {
              page: response.page,
              limit: response.limit,
              total: response.total,
              total_pages: response.total_pages,
            },
            filters: currentFilters,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch tickets",
            loading: false,
          });
        }
      },

      // Fetch single ticket
      fetchTicket: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await ticketApi.getTicket(id);
          set({
            currentTicket: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch ticket",
            loading: false,
          });
        }
      },

      // Fetch ticket by code
      fetchTicketByCode: async (code: string) => {
        set({ loading: true, error: null });
        try {
          const response = await ticketApi.getTicketByCode(code);
          set({
            currentTicket: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch ticket",
            loading: false,
          });
        }
      },

      // Create new ticket
      createTicket: async (data: CreateTicketRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await ticketApi.createTicket(data);
          const newTicket = response.data;

          set((state) => ({
            tickets: [newTicket, ...state.tickets],
            loading: false,
          }));

          // Refresh tickets to get updated pagination
          await get().fetchTickets();
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to create ticket",
            loading: false,
          });
        }
      },

      // Update ticket
      updateTicket: async (data: UpdateTicketRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await ticketApi.updateTicket(data);
          const updatedTicket = response.data;

          set((state) => ({
            tickets: state.tickets.map((ticket) =>
              ticket.id === updatedTicket.id ? updatedTicket : ticket
            ),
            currentTicket:
              state.currentTicket?.id === updatedTicket.id
                ? updatedTicket
                : state.currentTicket,
            loading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update ticket",
            loading: false,
          });
        }
      },

      // Delete ticket (tidak tersedia di backend, hapus action ini)
      deleteTicket: async () => {
        set({ loading: true, error: null });
        try {
          // Backend tidak memiliki endpoint delete ticket
          // Untuk sekarang, buat error
          throw new Error("Delete ticket functionality not available");
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete ticket",
            loading: false,
          });
        }
      },

      // Assign ticket
      assignTicket: async (data: AssignTicketRequest) => {
        set({ loading: true, error: null });
        try {
          await ticketApi.assignTicket(data);

          // Refresh the specific ticket
          await get().fetchTicket(data.ticket_id);

          // Refresh tickets list
          await get().fetchTickets();

          set({ loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to assign ticket",
            loading: false,
          });
        }
      },

      // Escalate ticket
      escalateTicket: async (ticketId: string, reason?: string) => {
        set({ loading: true, error: null });
        try {
          await ticketApi.escalateTicket(ticketId, reason);

          // Refresh the specific ticket
          await get().fetchTicket(ticketId);

          // Refresh tickets list
          await get().fetchTickets();

          set({ loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to escalate ticket",
            loading: false,
          });
        }
      },

      // Add comment
      addComment: async (data: AddCommentRequest) => {
        set({ loading: true, error: null });
        try {
          await ticketApi.addComment(data);

          // Refresh the current ticket to show new comment
          if (get().currentTicket?.id === data.ticket_id) {
            await get().fetchTicket(data.ticket_id);
          }

          set({ loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to add comment",
            loading: false,
          });
        }
      },

      // Fetch categories
      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await ticketApi.getCategories();
          set({
            categories: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch categories",
            loading: false,
          });
        }
      },

      // Fetch dashboard stats (tidak tersedia di backend saat ini)
      fetchStats: async () => {
        set({ loading: true, error: null });
        try {
          // Backend belum memiliki endpoint stats, buat mock stats dari data tickets
          const tickets = get().tickets;
          const mockStats = {
            total_tickets: tickets.length,
            open_tickets: tickets.filter((t) => t.status === "open").length,
            in_progress_tickets: tickets.filter(
              (t) => t.status === "in_progress"
            ).length,
            resolved_tickets: tickets.filter((t) => t.status === "resolved")
              .length,
            closed_tickets: tickets.filter((t) => t.status === "closed").length,
            escalated_tickets: tickets.filter((t) => t.status === "escalated")
              .length,
            avg_first_response_time: 0,
            avg_resolution_time: 0,
            sla_breached_count: 0,
            sla_compliance_rate: 100,
          };

          set({
            stats: mockStats,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch stats",
            loading: false,
          });
        }
      },

      // Filter and pagination actions
      setFilters: (newFilters: Partial<TicketFilter>) => {
        const updatedFilters = { ...get().filters, ...newFilters };
        set({ filters: updatedFilters });
        get().fetchTickets(updatedFilters);
      },

      clearFilters: () => {
        set({ filters: initialFilters });
        get().fetchTickets(initialFilters);
      },

      setPage: (page: number) => {
        const { filters } = get();
        const offset = (page - 1) * (filters.limit || 20);
        get().setFilters({ offset, limit: filters.limit });
      },

      setLimit: (limit: number) => {
        get().setFilters({ limit, offset: 0 });
      },

      // Utility actions
      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: "ticket-store",
    }
  )
);
