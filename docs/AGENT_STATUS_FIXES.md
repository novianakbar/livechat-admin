# Agent Status Persistence & Real-time Update Fix

## Problem yang Diperbaiki

### 1. Status Indicator Tidak Update Real-time
**Issue**: Status indicator di header tidak berubah secara real-time setelah mengubah status via dropdown.

**Root Cause**: 
- `useAgentHeartbeat` menggunakan `useRef` untuk menyimpan status
- `useRef` tidak memicu re-render komponen saat nilainya berubah
- Komponen tidak mengetahui perubahan status

**Solution**:
- Mengganti `useRef` dengan `useState` untuk `currentStatus`
- State reaktif yang memicu re-render saat berubah

### 2. Status Tidak Persistent Setelah Refresh
**Issue**: Status kembali ke "online" setelah refresh page, padahal sebelumnya diset ke "busy" atau "away".

**Root Cause**:
- Status hanya disimpan dalam memory (React state)
- Tidak ada persistence layer untuk menyimpan status user

**Solution**:
- Implementasi localStorage untuk menyimpan status
- Load status dari localStorage saat komponen initialize
- Clear localStorage saat logout

## Changes Made

### 1. Updated `useAgentHeartbeat.ts`

#### Before:
```typescript
const statusRef = useRef<AgentStatusType>("online");

const setStatus = useCallback((status: AgentStatusType) => {
  statusRef.current = status; // Tidak memicu re-render
  sendHeartbeat(status);
}, []);

return {
  currentStatus: statusRef.current, // Static value
  // ...
};
```

#### After:
```typescript
// Tambah localStorage helpers
const getStoredStatus = (): AgentStatusType => {
  if (typeof window === "undefined") return "online";
  try {
    const stored = localStorage.getItem("agent_status");
    if (stored && ["online", "busy", "away"].includes(stored)) {
      return stored as AgentStatusType;
    }
  } catch (error) {
    console.warn("Failed to read agent status from localStorage:", error);
  }
  return "online";
};

// State reaktif dengan localStorage init
const [currentStatus, setCurrentStatus] = useState<AgentStatusType>(() => getStoredStatus());

const setStatus = useCallback((status: AgentStatusType) => {
  setCurrentStatus(status); // Memicu re-render
  setStoredStatus(status);   // Simpan ke localStorage
  sendHeartbeat(status);
}, []);

return {
  currentStatus, // Reactive state
  // ...
};
```

### 2. Updated `AuthProvider.tsx`

#### Logout Cleanup:
```typescript
const logout = async () => {
  try {
    // Set agent offline
    if (user && (user.role === 'agent' || user.role === 'admin')) {
      await agentStatusApi.setOffline();
    }
    
    await authApi.logout();
  } finally {
    setUser(null);
    clearAuthTokens();
    
    // Clear agent status dari localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("agent_status");
    }
    
    router.push('/login');
  }
};
```

## Testing Scenarios

### Test 1: Real-time Status Update
1. Login sebagai agent
2. Buka header, klik status dropdown
3. Ubah dari "Online" ke "Busy"
4. **Expected**: Status indicator langsung berubah ke "Busy" tanpa refresh

### Test 2: Status Persistence
1. Login sebagai agent
2. Ubah status ke "Busy"
3. Refresh page (F5)
4. **Expected**: Status tetap "Busy", tidak kembali ke "Online"

### Test 3: Cross-tab Consistency
1. Buka 2 tab admin panel
2. Di tab 1, ubah status ke "Away"
3. Di tab 2, refresh page
4. **Expected**: Tab 2 menampilkan status "Away"

### Test 4: Logout Cleanup
1. Login sebagai agent
2. Ubah status ke "Busy"
3. Logout
4. Login lagi
5. **Expected**: Status kembali ke "Online" (default)

## localStorage Structure

```typescript
// Key: "agent_status"
// Value: "online" | "busy" | "away"

// Example:
localStorage.setItem("agent_status", "busy");
const status = localStorage.getItem("agent_status"); // "busy"
```

## Error Handling

### localStorage Failures
```typescript
const getStoredStatus = (): AgentStatusType => {
  try {
    const stored = localStorage.getItem("agent_status");
    // Validate stored value
    if (stored && ["online", "busy", "away"].includes(stored)) {
      return stored as AgentStatusType;
    }
  } catch (error) {
    console.warn("Failed to read agent status:", error);
    // Graceful fallback to default
  }
  return "online"; // Default fallback
};
```

### State Synchronization
- Initial state load dari localStorage
- State update memicu localStorage save
- Logout membersihkan localStorage
- Error tidak mengganggu user experience

## Performance Considerations

### localStorage Operations
- Read: Hanya saat component mount
- Write: Hanya saat status berubah (user action)
- Clear: Hanya saat logout
- Minimal impact pada performance

### Re-render Optimization
- State change hanya pada status update
- No unnecessary re-renders
- Optimized useCallback dependencies

## Browser Compatibility

### localStorage Support
- Modern browsers: ✅ Full support
- Private/Incognito mode: ⚠️ May be limited
- Old browsers: ⚠️ Graceful fallback

### Fallback Strategy
```typescript
if (typeof window === "undefined") return "online"; // SSR
try {
  localStorage.setItem("test", "test");
  localStorage.removeItem("test");
} catch (error) {
  // localStorage tidak tersedia, gunakan memory only
  console.warn("localStorage not available, using memory only");
}
```

## Future Enhancements

### 1. Real-time Sync Across Tabs
```typescript
// Broadcast Channel API untuk sync antar tab
const channel = new BroadcastChannel('agent_status');

channel.addEventListener('message', (event) => {
  if (event.data.type === 'STATUS_CHANGE') {
    setCurrentStatus(event.data.status);
  }
});

const setStatus = (status: AgentStatusType) => {
  setCurrentStatus(status);
  setStoredStatus(status);
  
  // Broadcast ke tab lain
  channel.postMessage({
    type: 'STATUS_CHANGE',
    status: status
  });
  
  sendHeartbeat(status);
};
```

### 2. Server-side Status Validation
```typescript
// Validate stored status dengan server
const validateStoredStatus = async () => {
  try {
    const serverStatus = await agentStatusApi.getAgentStatus(user.id);
    const localStatus = getStoredStatus();
    
    if (serverStatus.online && serverStatus.agent?.status !== localStatus) {
      // Sync dengan server status
      setCurrentStatus(serverStatus.agent.status);
      setStoredStatus(serverStatus.agent.status);
    }
  } catch (error) {
    // Fallback ke local status
  }
};
```

### 3. Status History Tracking
```typescript
// Track status changes untuk analytics
const statusHistory = JSON.parse(
  localStorage.getItem("agent_status_history") || "[]"
);

const logStatusChange = (oldStatus: AgentStatusType, newStatus: AgentStatusType) => {
  const historyEntry = {
    from: oldStatus,
    to: newStatus,
    timestamp: new Date().toISOString(),
    duration: Date.now() - lastStatusChangeTime
  };
  
  statusHistory.push(historyEntry);
  localStorage.setItem("agent_status_history", JSON.stringify(statusHistory));
};
```

## Troubleshooting

### Status Tidak Update di UI
1. Check browser console untuk errors
2. Verify localStorage permissions
3. Check component re-render dengan React DevTools
4. Validate network requests di Network tab

### Status Tidak Persistent
1. Check localStorage di Application tab DevTools
2. Verify tidak ada localStorage.clear() calls
3. Check private/incognito mode restrictions
4. Validate browser localStorage quota

### Memory Leaks
1. Verify useEffect cleanup functions
2. Check for unmounted component state updates
3. Monitor memory usage di Performance tab
4. Clear intervals dan timeouts properly

## Migration Notes

### Breaking Changes
- `currentStatus` sekarang reactive state (tidak lagi static ref)
- localStorage dependency tambahan
- Cleanup logic di logout updated

### Backward Compatibility
- Graceful fallback untuk browser tanpa localStorage
- Default status "online" jika localStorage kosong
- No breaking changes untuk existing API calls
