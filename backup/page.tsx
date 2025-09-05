'use client';

import { useState } from 'react';
import { UsersIcon, BuildingOffice2Icon, TagIcon } from '@heroicons/react/24/outline';
import { UserManagement } from '@/components/management/UserManagement';
import { DepartmentManagement } from '@/components/management/DepartmentManagement';
import { CategoryManagement } from '@/components/management/CategoryManagement';

const tabs = [
    {
        id: 'users',
        name: 'Users & Agents',
        icon: UsersIcon,
        component: UserManagement,
    },
    {
        id: 'departments',
        name: 'Departments',
        icon: BuildingOffice2Icon,
        component: DepartmentManagement,
    },
    {
        id: 'categories',
        name: 'Categories',
        icon: TagIcon,
        component: CategoryManagement,
    },
];

export default function ManagementPage() {
    const [activeTab, setActiveTab] = useState('users');
    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || UserManagement;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">System Management</h1>
                <p className="text-gray-600">Manage users, departments, and ticket categories</p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } flex items-center space-x-2 border-b-2 py-4 px-1 text-sm font-medium`}
                        >
                            <tab.icon className="h-5 w-5" />
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow">
                <ActiveComponent />
            </div>
        </div>
    );
}
