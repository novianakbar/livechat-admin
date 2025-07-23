import { create } from "zustand";
import {
  User,
  ChatSession,
  ChatMessage,
  AgentStatus,
  ChatTag,
} from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  setLoading: (loading: boolean) => void;
}

interface AgentState {
  agents: User[];
  agentStatuses: AgentStatus[];
  currentStatus: "online" | "offline" | "busy" | "away";
  setAgents: (agents: User[]) => void;
  setAgentStatuses: (statuses: AgentStatus[]) => void;
  setCurrentStatus: (status: "online" | "offline" | "busy" | "away") => void;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
}

interface TagState {
  tags: ChatTag[];
  setTags: (tags: ChatTag[]) => void;
  addTag: (tag: ChatTag) => void;
  updateTag: (tagId: string, updates: Partial<ChatTag>) => void;
  removeTag: (tagId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user: User) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  isLoading: false,
  setSessions: (sessions: ChatSession[]) => set({ sessions }),
  setCurrentSession: (currentSession: ChatSession | null) =>
    set({ currentSession, messages: [] }),
  setMessages: (messages: ChatMessage[]) => set({ messages }),
  addMessage: (message: ChatMessage) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
  },
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => {
    const { sessions } = get();
    set({
      sessions: sessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      ),
    });
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  agentStatuses: [],
  currentStatus: "offline" as const,
  setAgents: (agents: User[]) => set({ agents }),
  setAgentStatuses: (agentStatuses: AgentStatus[]) => set({ agentStatuses }),
  setCurrentStatus: (currentStatus: "online" | "offline" | "busy" | "away") =>
    set({ currentStatus }),
  updateAgentStatus: (agentId: string, status: AgentStatus) => {
    const { agentStatuses } = get();
    set({
      agentStatuses: agentStatuses.map((s) =>
        s.agent_id === agentId ? status : s
      ),
    });
  },
}));

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  setTags: (tags: ChatTag[]) => set({ tags }),
  addTag: (tag: ChatTag) => {
    const { tags } = get();
    set({ tags: [...tags, tag] });
  },
  updateTag: (tagId: string, updates: Partial<ChatTag>) => {
    const { tags } = get();
    set({
      tags: tags.map((tag) =>
        tag.id === tagId ? { ...tag, ...updates } : tag
      ),
    });
  },
  removeTag: (tagId: string) => {
    const { tags } = get();
    set({ tags: tags.filter((tag) => tag.id !== tagId) });
  },
}));
