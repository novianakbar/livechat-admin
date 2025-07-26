'use client';

import {
    ChatBubbleBottomCenterTextIcon,
    ClockIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';
import TagDisplay from '@/components/chat/TagDisplay';

const stats = [
    {
        name: 'Total Permohonan',
        value: '2,847',
        change: '+12%',
        changeType: 'positive',
        icon: ChatBubbleBottomCenterTextIcon,
    },
    {
        name: 'Admin Aktif',
        value: '12',
        change: '+2',
        changeType: 'positive',
        icon: UserGroupIcon,
    },
    {
        name: 'Waktu Respon Rata-rata',
        value: '2.3m',
        change: '-15%',
        changeType: 'positive',
        icon: ClockIcon,
    },
    {
        name: 'Tingkat Kepuasan',
        value: '94.2%',
        change: '+3%',
        changeType: 'positive',
        icon: ChartBarIcon,
    },
];

const recentConversations = [
    {
        id: 1,
        customer: 'Budi Santoso',
        agent: 'Sari Dewi',
        status: 'active',
        lastMessage: 'Apakah ada biaya untuk pengurusan NIB?',
        time: '2 menit lalu',
        avatar: 'BS',
        businessType: 'Kuliner',
        tags: ['NIB', 'UMKM']
    },
    {
        id: 2,
        customer: 'Siti Rahayu',
        agent: 'Dedi Kurniawan',
        status: 'waiting',
        lastMessage: 'Izin lokasi untuk usaha salon',
        time: '5 menit lalu',
        avatar: 'SR',
        businessType: 'Salon',
        tags: ['Izin Lokasi', 'Jasa']
    },
    {
        id: 3,
        customer: 'Ahmad Fauzi',
        agent: 'Rina Putri',
        status: 'closed',
        lastMessage: 'SIUP sudah diterbitkan, terima kasih!',
        time: '15 menit lalu',
        avatar: 'AF',
        businessType: 'Perdagangan',
        tags: ['SIUP', 'Completed']
    },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-600">
                        Selamat datang kembali! Berikut adalah ringkasan hari ini.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>7 hari terakhir</option>
                        <option>30 hari terakhir</option>
                        <option>90 hari terakhir</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-red-500 rounded-lg">
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
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
                    </div>
                ))}
            </div>      {/* Recent Conversations */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentConversations.map((conversation) => (
                        <div key={conversation.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {conversation.avatar}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{conversation.customer}</p>
                                        <p className="text-sm text-gray-500">Admin: {conversation.agent}</p>
                                        <p className="text-xs text-gray-400 mt-1">{conversation.businessType}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${conversation.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : conversation.status === 'waiting'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {conversation.status === 'active' ? 'Aktif' :
                                                conversation.status === 'waiting' ? 'Menunggu' : 'Selesai'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{conversation.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 ml-14">
                                <TagDisplay tags={conversation.tags} maxTags={3} size="sm" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2 ml-14">{conversation.lastMessage}</p>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
                        Lihat semua percakapan →
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2" />
                            Start New Conversation
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <UserGroupIcon className="h-5 w-5 mr-2" />
                            Add New Agent
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Chat Widget</span>
                            <span className="flex items-center text-green-600 font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">API Status</span>
                            <span className="flex items-center text-green-600 font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Operational
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Database</span>
                            <span className="flex items-center text-green-600 font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Healthy
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
