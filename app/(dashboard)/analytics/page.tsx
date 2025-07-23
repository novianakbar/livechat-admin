'use client';

import {
    ClockIcon,
    UserGroupIcon,
    ChatBubbleBottomCenterTextIcon,
    FaceSmileIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

const stats = [
    {
        name: 'Total Conversations',
        value: '2,847',
        previousValue: '2,542',
        change: '+12%',
        changeType: 'positive',
        icon: ChatBubbleBottomCenterTextIcon,
    },
    {
        name: 'Average Response Time',
        value: '2.3 min',
        previousValue: '2.7 min',
        change: '-15%',
        changeType: 'positive',
        icon: ClockIcon,
    },
    {
        name: 'Customer Satisfaction',
        value: '94.2%',
        previousValue: '91.5%',
        change: '+3%',
        changeType: 'positive',
        icon: FaceSmileIcon,
    },
    {
        name: 'Active Agents',
        value: '12',
        previousValue: '10',
        change: '+20%',
        changeType: 'positive',
        icon: UserGroupIcon,
    },
];

const chartData = [
    { period: 'Jan', conversations: 1200, resolved: 1100 },
    { period: 'Feb', conversations: 1400, resolved: 1250 },
    { period: 'Mar', conversations: 1800, resolved: 1650 },
    { period: 'Apr', conversations: 2100, resolved: 1950 },
    { period: 'May', conversations: 2400, resolved: 2200 },
    { period: 'Jun', conversations: 2847, resolved: 2650 },
];

const topAgents = [
    { name: 'Mike Chen', conversations: 245, avgResponseTime: '1.8 min', satisfaction: '96%', avatar: 'MC' },
    { name: 'Emma Davis', conversations: 232, avgResponseTime: '2.1 min', satisfaction: '95%', avatar: 'ED' },
    { name: 'John Smith', conversations: 198, avgResponseTime: '2.3 min', satisfaction: '94%', avatar: 'JS' },
    { name: 'Lisa Wong', conversations: 189, avgResponseTime: '2.0 min', satisfaction: '97%', avatar: 'LW' },
    { name: 'Alex Kumar', conversations: 156, avgResponseTime: '2.5 min', satisfaction: '93%', avatar: 'AK' },
];

const timeRanges = [
    { id: '7d', name: 'Last 7 days' },
    { id: '30d', name: 'Last 30 days' },
    { id: '90d', name: 'Last 90 days' },
    { id: 'custom', name: 'Custom range' },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-600">
                        Track your team&apos;s performance and customer satisfaction
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        {timeRanges.map((range) => (
                            <option key={range.id} value={range.id}>
                                {range.name}
                            </option>
                        ))}
                    </select>
                    <button className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <CalendarDaysIcon className="h-4 w-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-500 rounded-lg">
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.changeType === 'positive' ? (
                                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                                ) : (
                                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                                )}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Previous: {stat.previousValue}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversations Chart */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations Over Time</h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {chartData.map((data) => (
                            <div key={data.period} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex flex-col items-center space-y-1">
                                    <div
                                        className="w-full bg-red-500 rounded-t"
                                        style={{ height: `${(data.conversations / 3000) * 200}px` }}
                                    ></div>
                                    <div
                                        className="w-full bg-red-300 rounded-b"
                                        style={{ height: `${(data.resolved / 3000) * 200}px` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-600 mt-2">{data.period}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-primary-500 rounded mr-2"></div>
                            <span className="text-sm text-gray-600">Total Conversations</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-primary-300 rounded mr-2"></div>
                            <span className="text-sm text-gray-600">Resolved</span>
                        </div>
                    </div>
                </div>

                {/* Response Time Chart */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {[2.8, 2.5, 2.3, 2.1, 2.0, 1.8].map((time, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-green-500 rounded-t"
                                    style={{ height: `${(time / 3) * 200}px` }}
                                ></div>
                                <span className="text-xs text-gray-600 mt-2">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <span className="text-sm text-gray-600">Average Response Time (minutes)</span>
                    </div>
                </div>
            </div>

            {/* Top Agents */}
            <div className="bg-white rounded-lg shadow-soft">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Top Performing Agents</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agent
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Conversations
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Response Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Satisfaction
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topAgents.map((agent, index) => (
                                <tr key={agent.name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-sm font-medium text-primary-600">
                                                    {agent.avatar}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                                <div className="text-sm text-gray-500">Rank #{index + 1}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {agent.conversations}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {agent.avgResponseTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-900">{agent.satisfaction}</span>
                                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: agent.satisfaction }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Online
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">9:00 AM - 11:00 AM</span>
                            <span className="text-sm font-medium text-gray-900">342 chats</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">2:00 PM - 4:00 PM</span>
                            <span className="text-sm font-medium text-gray-900">298 chats</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">7:00 PM - 9:00 PM</span>
                            <span className="text-sm font-medium text-gray-900">256 chats</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Issues</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Order Status</span>
                            <span className="text-sm font-medium text-gray-900">32%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Technical Support</span>
                            <span className="text-sm font-medium text-gray-900">28%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Billing</span>
                            <span className="text-sm font-medium text-gray-900">24%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Channels</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Website Widget</span>
                            <span className="text-sm font-medium text-gray-900">68%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Mobile App</span>
                            <span className="text-sm font-medium text-gray-900">22%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Email</span>
                            <span className="text-sm font-medium text-gray-900">10%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
