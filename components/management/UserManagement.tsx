'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserPlus, Shield, Mail } from 'lucide-react';
import { usersApi, departmentsApi } from '@/lib/api';
import { RadixModal, RadixModalBody, RadixModalFooter } from '@/components/ui/radix-modal';
import { RadixButton, RadixInput, RadixSelect, RadixCheckbox } from '@/components/ui/radix-form';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'agent';
    is_active: boolean;
    department_id: string | null;
    department_name?: string;
    created_at: string;
    updated_at: string;
}

interface Department {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: 'agent' as 'admin' | 'agent',
        department_id: '',
        is_active: true,
    });

    const fetchUsers = async () => {
        try {
            const result = await usersApi.getUsers();
            // Convert API User to local User interface
            const convertedUsers = result.users.map(user => ({
                id: user.id as string,
                email: user.email,
                name: user.name,
                role: user.role as 'admin' | 'agent',
                is_active: user.is_active,
                department_id: user.department_id as string | null,
                department_name: user.department?.name,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }));
            setUsers(convertedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const apiDepartments = await departmentsApi.getDepartments();
            // Convert API Department to local Department interface
            const convertedDepartments = apiDepartments.map(dept => ({
                id: dept.id as string,
                name: dept.name,
                description: dept.description,
                is_active: dept.is_active,
            }));
            setDepartments(convertedDepartments);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchDepartments()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        const matchesDepartment = selectedDepartment === 'all' || user.department_id === selectedDepartment;

        return matchesSearch && matchesRole && matchesDepartment;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await usersApi.updateUser(editingUser.id, formData);
            } else {
                await usersApi.createUser(formData);
            }
            setShowAddModal(false);
            setEditingUser(null);
            setFormData({
                email: '',
                name: '',
                password: '',
                role: 'agent',
                department_id: '',
                is_active: true,
            });
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            name: '',
            password: '',
            role: 'agent',
            department_id: '',
            is_active: true,
        });
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            name: user.name,
            password: '', // Don't populate password for edit
            role: user.role,
            department_id: user.department_id || '',
            is_active: user.is_active,
        });
        // Open modal after a small delay to ensure formData is set
        setTimeout(() => {
            setShowAddModal(true);
        }, 10);
    };

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await usersApi.deleteUser(userId);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await usersApi.updateUser(userId, { is_active: !currentStatus });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Users & Agents</h2>
                    <p className="text-gray-600">Manage system users and their permissions</p>
                </div>
                <RadixButton
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({
                            email: '',
                            name: '',
                            password: '',
                            role: 'agent',
                            department_id: '',
                            is_active: true,
                        });
                        setShowAddModal(true);
                    }}
                    variant="solid"
                    color="red"
                    className="flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add User</span>
                </RadixButton>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                    <RadixInput
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <RadixSelect
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                </RadixSelect>
                <RadixSelect
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </RadixSelect>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.role === 'admin' ? (
                                                <Shield className="h-3 w-3 mr-1" />
                                            ) : (
                                                <UserPlus className="h-3 w-3 mr-1" />
                                            )}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.department_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            <RadixModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                    resetForm();
                }}
                title={editingUser ? 'Edit User' : 'Add New User'}
            >
                <form onSubmit={handleSubmit}>
                    <RadixModalBody className="space-y-4">
                        <RadixInput
                            label="Name"
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter full name"
                        />

                        <RadixInput
                            label="Email"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="user@example.com"
                        />

                        {!editingUser && (
                            <RadixInput
                                label="Password"
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter password"
                            />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <RadixSelect
                                label="Role"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'agent' })}
                            >
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                            </RadixSelect>

                            <RadixSelect
                                label="Department"
                                value={formData.department_id}
                                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </RadixSelect>
                        </div>

                        <RadixCheckbox
                            label="Active user"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                    </RadixModalBody>

                    <RadixModalFooter>
                        <RadixButton
                            type="button"
                            variant="outline"
                            color="gray"
                            onClick={() => {
                                setShowAddModal(false);
                                setEditingUser(null);
                                resetForm();
                            }}
                        >
                            Cancel
                        </RadixButton>
                        <RadixButton
                            type="submit"
                            variant="solid"
                            color="red"
                        >
                            {editingUser ? 'Update User' : 'Create User'}
                        </RadixButton>
                    </RadixModalFooter>
                </form>
            </RadixModal>
        </div>
    );
}
