'use client';

import {
    BellIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { AgentStatusIndicator } from './AgentStatusIndicator';

export function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications] = useState(3);
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left side - Search */}
                    <div className="flex-1 max-w-lg">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations, agents, or settings..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right side - Notifications and Profile */}
                    <div className="flex items-center space-x-4">
                        {/* Agent Status Indicator */}
                        <AgentStatusIndicator />

                        {/* Notifications */}
                        <div className="relative">
                            <button className="p-2 text-gray-400 hover:text-red-600 relative rounded-lg hover:bg-red-50 transition-colors">
                                <BellIcon className="h-6 w-6" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'Agent'}</p>
                                </div>
                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <a
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        Your Profile
                                    </a>
                                    <a
                                        href="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        Settings
                                    </a>
                                    <hr className="my-1 border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
