# Conversations Page - Role-Based Access Guide

## Analisis dan Implementasi

### 1. **Analisis Backend API Endpoints**

Backend menyediakan **2 endpoint berbeda** untuk conversations berdasarkan role:

#### **Admin Endpoints** (`/api/chat/admin/`)
- **Path**: `/api/chat/admin/sessions`
- **Middleware**: `RequireAdmin()`  
- **Access**: Semua conversations di sistem
- **Features**:
  - View all conversations
  - Filter by agent_id, department_id, status
  - Assign agents to conversations
  - Bulk operations
  - Analytics dan reporting
  - User management oversight

#### **Agent Endpoints** (`/api/chat/agent/`)
- **Path**: `/api/chat/agent/sessions`
- **Middleware**: `RequireAgent()`
- **Access**: Hanya conversations yang di-assign ke agent tersebut
- **Features**:
  - View only assigned conversations
  - Handle customer interactions
  - Close assigned sessions
  - Limited scope operations

### 2. **Implementasi Frontend**

#### **Struktur File**
```
app/(dashboard)/conversations/
├── page.tsx              # Role-based router
├── admin/
│   └── page.tsx          # Admin view - all conversations
└── agent/
    └── page.tsx          # Agent view - assigned conversations only
```

#### **Router Logic** (page.tsx)
```typescript
// Routes based on user role
switch (user.role) {
    case 'admin':
    case 'supervisor':
        return <AdminConversationsPage />;
    case 'agent':
        return <AgentConversationsPage />;
    default:
        return <AccessDenied />;
}
```

### 3. **Perbedaan Interface**

#### **Admin View** (`/conversations/admin/page.tsx`)
- **Title**: "Percakapan OSS" 
- **Description**: "Kelola semua percakapan layanan OSS perizinan berusaha"
- **Stats**: Global metrics untuk semua conversations
- **Filters**: NIB, Perizinan, semua status, dll
- **Features**:
  - Bulk selection dan actions
  - Assign agents
  - Export data
  - Complete analytics
- **API**: Menggunakan `chatApi.getSessions()` (/admin/sessions)

#### **Agent View** (`/conversations/agent/page.tsx`)  
- **Title**: "Percakapan Saya"
- **Description**: "Kelola percakapan yang ditugaskan kepada Anda - {agent_name}"
- **Stats**: Personal metrics (assigned conversations only)
- **Filters**: Simplified (Active, Waiting, Closed, Urgent)
- **Features**:
  - Focus on assigned conversations
  - Quick actions (Open Chat, Close Session)
  - Personal productivity tools
- **API**: Menggunakan `agentChatApi.getMySessions()` (/agent/sessions)

### 4. **API Implementation**

#### **lib/api.ts** - Extended with agent functions
```typescript
export const chatApi = {
  // Admin functions
  getSessions: () => `/chat/admin/sessions`,
  
  // Agent functions  
  getAgentSessions: () => `/chat/agent/sessions`,
  getAgentSession: (id) => `/chat/agent/sessions/${id}`,
}
```

#### **lib/api-agent.ts** - Agent-specific wrapper
```typescript
export const agentChatApi = {
  getMySessions: chatApi.getAgentSessions,
  getMySession: chatApi.getAgentSession,
  // ... other agent-specific methods
}
```

### 5. **Security & Access Control**

#### **Backend Security**
- **Admin**: Can access all conversations via admin endpoints
- **Agent**: Can only access assigned conversations via agent endpoints
- **Authentication**: JWT tokens with role validation
- **Authorization**: Middleware enforces role-based access

#### **Frontend Security**
- **Role-based routing**: Automatic routing based on user.role
- **API endpoints**: Different endpoints called based on user role  
- **UI adaptation**: Different interfaces and features per role
- **Error handling**: Access denied pages for unauthorized roles

### 6. **Benefits of Separation**

#### **Performance**
- **Agent queries**: Smaller datasets (only assigned conversations)
- **Reduced network load**: Agent API returns minimal required data
- **Faster rendering**: Fewer conversations to process

#### **Security**
- **Data isolation**: Agents can't access unassigned conversations
- **Permission enforcement**: Backend prevents unauthorized access
- **Audit trail**: Clear separation of admin vs agent actions

#### **User Experience**
- **Tailored interface**: Each role sees relevant information only
- **Simplified workflow**: Agents focus on their assigned work
- **Clear context**: Role-specific language and features

#### **Maintainability**  
- **Separate concerns**: Admin and agent logic separated
- **Independent updates**: Can modify admin/agent views independently
- **Clear architecture**: Easy to understand and extend

### 7. **Usage Examples**

#### **Admin Scenario**
```
Admin logs in → Sees "Percakapan OSS" → Views all 150 conversations
→ Can assign unassigned conversations to agents
→ Can see analytics across all agents and departments
→ Can export data for reporting
```

#### **Agent Scenario**  
```
Agent logs in → Sees "Percakapan Saya" → Views only 8 assigned conversations
→ Focuses on responding to customers
→ Can close conversations when resolved
→ Sees personal productivity metrics
```

### 8. **Kesimpulan**

**SANGAT PERLU** memisahkan halaman conversations berdasarkan role karena:

1. **Backend sudah menyediakan endpoint berbeda**
2. **Data scope berbeda** (all vs assigned)
3. **User experience lebih baik** dengan interface yang sesuai role
4. **Security lebih terjamin** dengan access control yang proper
5. **Performance lebih optimal** dengan data filtering di backend
6. **Maintainability lebih baik** dengan separation of concerns

Implementasi ini mengikuti best practices untuk role-based access control dan memberikan experience yang optimal untuk setiap type user.
