# Frontend Integration Documentation - Agent Online Status

## Overview
Dokumen ini menjelaskan integrasi fitur Agent Online Status ke dalam livechat-admin frontend. Integrasi ini mencakup heartbeat management, status display, dan monitoring agent yang sedang online.

## Components Added

### 1. API Layer (`lib/api.ts`)

#### New Types
```typescript
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
```

#### New API Functions
```typescript
export const agentStatusApi = {
  sendHeartbeat,
  setOffline,
  getOnlineAgents,
  getOnlineAgentsByDepartment,
  getAgentStatus,
  getDepartmentStats,
}
```

### 2. Heartbeat Hook (`components/providers/useAgentHeartbeat.ts`)

Custom React hook untuk mengelola heartbeat agent:

**Features:**
- Automatic heartbeat setiap 3 menit
- Page visibility detection (auto-away saat tab tidak aktif)
- Status management (online, busy, away)
- Cleanup saat logout/unmount

**Usage:**
```typescript
const {
  setStatus,
  setOffline,
  sendHeartbeat,
  currentStatus,
  isActive,
} = useAgentHeartbeat({
  enabled: true,
  interval: 180000, // 3 minutes
  onError: (error) => console.error(error),
  onSuccess: (status) => console.log(status),
});
```

### 3. Heartbeat Provider (`components/providers/AgentHeartbeatProvider.tsx`)

Context provider yang membungkus heartbeat functionality untuk seluruh aplikasi.

### 4. Agent Status Indicator (`components/layout/AgentStatusIndicator.tsx`)

Komponen UI yang menampilkan status agent di header dengan dropdown untuk mengubah status.

**Features:**
- Visual status indicator (green, red, yellow dots)
- Dropdown menu untuk mengubah status
- Hanya tampil untuk agent/admin

### 5. Online Agents Display (`components/agents/OnlineAgentsDisplay.tsx`)

Komponen untuk menampilkan daftar agent yang sedang online di halaman agents.

**Features:**
- Real-time list agent online
- Filter berdasarkan department
- Status indicator untuk setiap agent
- Department statistics
- Auto-refresh setiap 30 detik

## Integration Points

### 1. Layout Integration (`app/(dashboard)/layout.tsx`)
```tsx
<ProtectedRoute>
  <AgentHeartbeatProvider>
    <SidebarProvider>
      <DashboardContent>
        {children}
      </DashboardContent>
    </SidebarProvider>
  </AgentHeartbeatProvider>
</ProtectedRoute>
```

### 2. Header Integration (`components/layout/Header.tsx`)
```tsx
<div className="flex items-center space-x-4">
  <AgentStatusIndicator />
  {/* other header items */}
</div>
```

### 3. Auth Provider Integration (`components/providers/AuthProvider.tsx`)
Modified logout function to set agent offline before logout:
```tsx
const logout = async () => {
  if (user && (user.role === 'agent' || user.role === 'admin')) {
    await agentStatusApi.setOffline();
  }
  // ... rest of logout logic
};
```

### 4. Agents Page Integration (`app/(dashboard)/agents/page.tsx`)
- Replaced old agent status API with new agentStatusApi
- Added OnlineAgentsDisplay component
- Updated status filtering logic

## User Experience Flow

### For Agents/Admins:

1. **Login**
   - Automatic heartbeat starts when user logs in
   - Status indicator appears in header (default: online)

2. **During Session**
   - Heartbeat sent every 3 minutes automatically
   - Status can be changed via dropdown in header
   - Page visibility changes auto-adjust status (away when tab inactive)

3. **Status Changes**
   - **Online**: Available for new chats
   - **Busy**: Currently handling chats (visual indication)
   - **Away**: Temporarily unavailable

4. **Logout**
   - Agent automatically set to offline
   - Heartbeat stops

### For Admins:

1. **Agent Monitoring**
   - View all online agents in real-time
   - Filter by department
   - See last heartbeat timestamp
   - Department statistics

2. **Dashboard Integration**
   - Live agent count in dashboard
   - Department breakdown
   - Status distribution

## Configuration

### Environment Variables
```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Heartbeat Settings
```typescript
// In useAgentHeartbeat hook
const HEARTBEAT_INTERVAL = 180000; // 3 minutes
const VISIBILITY_CHANGE_DELAY = 1000; // 1 second delay for visibility changes
```

## Error Handling

### Heartbeat Failures
- Logged to console
- No automatic retry (relies on next interval)
- Does not disrupt user experience

### API Errors
- Graceful degradation
- User remains in previous state
- Error logging for debugging

### Network Issues
- Heartbeat automatically resumes when connection restored
- Agent marked offline after TTL expires on backend

## Testing Scenarios

### Manual Testing
1. **Basic Heartbeat**
   - Login as agent
   - Check agent appears in online list
   - Wait 5+ minutes, verify agent disappears from list

2. **Status Changes**
   - Change status via header dropdown
   - Verify status updates in agents list
   - Check status persists across page refresh

3. **Page Visibility**
   - Set status to online
   - Switch to another tab/window
   - Return to app, verify status handling

4. **Multi-Department**
   - Login agents from different departments
   - Verify department filtering works
   - Check statistics accuracy

### Automated Testing
```typescript
// Example test structure
describe('Agent Online Status', () => {
  test('should send heartbeat on login', async () => {
    // Mock API and test heartbeat initiation
  });

  test('should update status via dropdown', async () => {
    // Mock status change and verify API call
  });

  test('should handle page visibility changes', async () => {
    // Mock visibility API and test status changes
  });
});
```

## Performance Considerations

### API Calls
- Heartbeat: Every 3 minutes per agent
- Online agents list: Every 30 seconds on agents page
- Department stats: Every 30 seconds on agents page

### Memory Usage
- Minimal state in context
- Cleanup intervals on unmount
- No persistent local storage for status

### Network Optimization
- Small payload for heartbeat (agent ID + status only)
- Efficient Redis queries on backend
- Batch operations where possible

## Future Enhancements

### 1. Real-time Updates
```typescript
// WebSocket integration for instant updates
const useRealtimeAgentStatus = () => {
  useEffect(() => {
    const socket = io('/agent-status');
    socket.on('agent-online', handleAgentOnline);
    socket.on('agent-offline', handleAgentOffline);
    return () => socket.disconnect();
  }, []);
};
```

### 2. Advanced Status Types
```typescript
// Additional status options
type AgentStatus = 
  | 'online' 
  | 'busy' 
  | 'away' 
  | 'break' 
  | 'training' 
  | 'meeting';
```

### 3. Workload Tracking
```typescript
// Track active chats per agent
interface AgentOnlineStatusExtended extends AgentOnlineStatus {
  current_chats: number;
  max_chats: number;
  workload_percentage: number;
}
```

### 4. Status History
```typescript
// Track status changes over time
interface AgentStatusHistory {
  agent_id: string;
  status: AgentStatus;
  changed_at: string;
  duration: number; // in seconds
}
```

## Troubleshooting

### Common Issues

1. **Agent not appearing online**
   - Check JWT token validity
   - Verify agent role in database
   - Check browser console for heartbeat errors
   - Verify backend API connectivity

2. **Status not updating**
   - Check network connectivity
   - Verify API endpoint responses
   - Check browser developer tools for failed requests

3. **Heartbeat not working**
   - Verify AgentHeartbeatProvider is properly wrapped
   - Check useAgentHeartbeat hook initialization
   - Ensure user has agent/admin role

### Debug Tools

```typescript
// Add to component for debugging
const { currentStatus, isActive } = useAgentHeartbeatContext();
console.log('Agent Status Debug:', {
  currentStatus,
  isActive,
  user: user?.role,
  timestamp: new Date().toISOString()
});
```

### API Testing
```bash
# Test heartbeat endpoint
curl -X POST http://localhost:8080/api/agent-status/heartbeat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "online"}'

# Test get online agents
curl http://localhost:8080/api/agent-status/online \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Migration Notes

### Breaking Changes
- Old `agentApi.getAgentStatus()` replaced with `agentStatusApi.getOnlineAgents()`
- Agent status now stored in Redis instead of database
- Status structure changed from database entity to Redis JSON

### Backward Compatibility
- Old API endpoints still available
- Gradual migration recommended
- Database agent status table can be deprecated after full migration

## Monitoring & Analytics

### Key Metrics
- Average agents online per hour
- Status change frequency
- Heartbeat success rate
- Department utilization

### Dashboard Integration
```typescript
// Example dashboard stats
const useAgentDashboardStats = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    onlineAgents: 0,
    utilization: 0,
    departmentBreakdown: {}
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await agentStatusApi.getDepartmentStats();
      // Process and set stats
    };
  }, []);

  return stats;
};
```
