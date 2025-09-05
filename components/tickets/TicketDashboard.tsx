'use client';

import { useEffect } from 'react';
import {
    TicketIcon,
    Clock,
    CheckCircle,
    AlertTriangle,
    Users,
    TrendingUp
} from 'lucide-react';
import { useTicketStore } from '@/lib/stores/ticket-store';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                    {trend && (
                        <div className={`flex items-center mt-1 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <TrendingUp className={`h-3 w-3 mr-1 ${trend.isPositive ? '' : 'rotate-180'
                                }`} />
                            {Math.abs(trend.value)}% from last month
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export function TicketStats() {
    const { stats, fetchStats } = useTicketStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (!stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Tickets"
                value={stats.total_tickets}
                icon={<TicketIcon className="h-6 w-6 text-white" />}
                color="bg-blue-500"
                trend={{ value: 12, isPositive: true }}
            />

            <StatCard
                title="Open Tickets"
                value={stats.open_tickets}
                icon={<Clock className="h-6 w-6 text-white" />}
                color="bg-yellow-500"
                trend={{ value: 5, isPositive: false }}
            />

            <StatCard
                title="Resolved Tickets"
                value={stats.resolved_tickets}
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                color="bg-green-500"
                trend={{ value: 8, isPositive: true }}
            />

            <StatCard
                title="Escalated"
                value={stats.escalated_tickets}
                icon={<AlertTriangle className="h-6 w-6 text-white" />}
                color="bg-red-500"
                trend={{ value: 3, isPositive: false }}
            />
        </div>
    );
}

export function TicketsByStatus() {
    const { stats } = useTicketStore();

    if (!stats) {
        return (
            <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Tickets by Status</h3>
                <div className="animate-pulse">
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-4 bg-gray-200 rounded w-8"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statusData = [
        { label: 'Open', value: stats.open_tickets, color: 'bg-green-500' },
        { label: 'In Progress', value: stats.in_progress_tickets, color: 'bg-blue-500' },
        { label: 'Resolved', value: stats.resolved_tickets, color: 'bg-purple-500' },
        { label: 'Closed', value: stats.closed_tickets, color: 'bg-gray-500' },
        { label: 'Escalated', value: stats.escalated_tickets, color: 'bg-red-500' },
    ];

    const total = statusData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Tickets by Status</h3>
            <div className="space-y-3">
                {statusData.map((item) => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                        <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${item.color}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8 text-right">{item.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function SLAPerformance() {
    const { stats } = useTicketStore();

    if (!stats) {
        return (
            <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">SLA Performance</h3>
                <div className="animate-pulse">
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </div>
                </div>
            </div>
        );
    }

    const complianceRate = stats.sla_compliance_rate;
    const isGoodCompliance = complianceRate >= 90;

    return (
        <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">SLA Performance</h3>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Compliance Rate</span>
                        <span className={`text-lg font-bold ${isGoodCompliance ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {complianceRate.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${isGoodCompliance ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${complianceRate}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p className="text-sm text-gray-600">Avg First Response</p>
                        <p className="text-lg font-semibold">
                            {(stats.avg_first_response_time / 60).toFixed(1)}h
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Avg Resolution</p>
                        <p className="text-lg font-semibold">
                            {(stats.avg_resolution_time / 3600).toFixed(1)}h
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">SLA Breaches</span>
                        <span className={`text-sm font-medium ${stats.sla_breached_count > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {stats.sla_breached_count} tickets
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RecentActivity() {
    const activities = [
        {
            id: 1,
            type: 'ticket_created',
            message: 'New ticket #TK-001 created by John Doe',
            time: '2 minutes ago',
            icon: <TicketIcon className="h-4 w-4" />,
        },
        {
            id: 2,
            type: 'ticket_resolved',
            message: 'Ticket #TK-002 resolved by Agent Smith',
            time: '15 minutes ago',
            icon: <CheckCircle className="h-4 w-4" />,
        },
        {
            id: 3,
            type: 'ticket_escalated',
            message: 'Ticket #TK-003 escalated to Level 2',
            time: '1 hour ago',
            icon: <AlertTriangle className="h-4 w-4" />,
        },
        {
            id: 4,
            type: 'agent_assigned',
            message: 'Agent Jane assigned to ticket #TK-004',
            time: '2 hours ago',
            icon: <Users className="h-4 w-4" />,
        },
    ];

    return (
        <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
                            {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
