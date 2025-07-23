'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChatBubbleBottomCenterTextIcon,
    ChartBarIcon,
    UsersIcon,
    CogIcon,
    HomeIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useSidebar } from './SidebarContext';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Conversations', href: '/conversations', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Agents', href: '/agents', icon: UsersIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
];

export function Sidebar() {
    const { isDesktopCollapsed, setIsDesktopCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
    const pathname = usePathname();

    return (
        <>
            {/* Mobile menu button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-lg bg-white shadow-medium text-gray-600 hover:text-gray-900"
                >
                    {isMobileOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 ${isDesktopCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`flex items-center justify-center h-16 border-b border-gray-200 ${isDesktopCollapsed ? 'px-2' : 'px-6'}`}>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-white" />
                            </div>
                            {!isDesktopCollapsed && (
                                <span className="text-xl font-bold text-gray-900">LiveChat</span>
                            )}
                        </div>
                    </div>

                    {/* Desktop toggle button */}
                    <div className={`hidden md:flex justify-center py-3 border-b border-gray-200 ${isDesktopCollapsed ? 'px-2' : 'px-4'}`}>
                        <button
                            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <Bars3Icon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 py-6 space-y-2 ${isDesktopCollapsed ? 'px-2' : 'px-4'}`}>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center ${isDesktopCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-red-50 text-red-600 border-l-4 border-red-500'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => setIsMobileOpen(false)}
                                    title={isDesktopCollapsed ? item.name : undefined}
                                >
                                    <item.icon className={`w-5 h-5 ${isDesktopCollapsed ? '' : 'mr-3'} ${isActive ? 'text-red-500' : 'text-gray-400'}`} />
                                    {!isDesktopCollapsed && item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className={`py-4 border-t border-gray-200 ${isDesktopCollapsed ? 'px-2' : 'px-4'}`}>
                        <div className={`flex items-center p-3 rounded-lg bg-gray-50 ${isDesktopCollapsed ? 'justify-center' : 'space-x-3'}`}>
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            {!isDesktopCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        John Doe
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        Admin
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
