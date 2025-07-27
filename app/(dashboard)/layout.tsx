'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import ProtectedRoute from "@/components/providers/ProtectedRoute";
import { AgentHeartbeatProvider } from "@/components/providers/AgentHeartbeatProvider";
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <AgentHeartbeatProvider>
                <SidebarProvider>
                    <DashboardContent>
                        {children}
                    </DashboardContent>
                </SidebarProvider>
            </AgentHeartbeatProvider>
        </ProtectedRoute>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = pathname?.includes('/chat/');

    return (
        <div className="flex h-screen overflow-hidden">
            {!isChatPage && <Sidebar />}
            <div className="flex-1 flex flex-col overflow-hidden">
                {!isChatPage && <Header />}
                <main className={`flex-1 ${isChatPage ? 'overflow-hidden' : 'overflow-y-auto p-6 bg-gray-50'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
