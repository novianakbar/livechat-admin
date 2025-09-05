'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Building } from 'lucide-react';
import { departmentsApi } from '@/lib/api';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';

interface Department {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    can_handle_tickets: boolean;
    max_tickets_per_agent: number;
    support_level?: number;
    parent_dept_id?: string;
    parent_dept_name?: string;
    escalation_dept_id?: string;
    escalation_dept_name?: string;
    max_escalation_level?: number;
    auto_assignment_rule?: string;
    created_at: string;
    updated_at: string;
}

export function DepartmentManagement() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        can_handle_tickets: true,
        max_tickets_per_agent: 10,
        support_level: 0,
        parent_dept_id: '',
        escalation_dept_id: '',
        max_escalation_level: 3,
        auto_assignment_rule: 'round_robin',
    });

    const fetchDepartments = async () => {
        try {
            const apiDepartments = await departmentsApi.getDepartments();
            // Convert API Department to local Department interface
            const convertedDepartments = apiDepartments.map(dept => ({
                id: dept.id as string,
                name: dept.name,
                description: dept.description,
                is_active: dept.is_active,
                can_handle_tickets: true, // Default value since API might not have this
                max_tickets_per_agent: 10, // Default value
                created_at: dept.created_at,
                updated_at: dept.updated_at,
            }));
            setDepartments(convertedDepartments);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDepartment) {
                await departmentsApi.updateDepartment(editingDepartment.id, formData);
            } else {
                await departmentsApi.createDepartment(formData);
            }
            setShowAddModal(false);
            setEditingDepartment(null);
            setFormData({
                name: '',
                description: '',
                is_active: true,
                can_handle_tickets: true,
                max_tickets_per_agent: 10,
                support_level: 0,
                parent_dept_id: '',
                escalation_dept_id: '',
                max_escalation_level: 3,
                auto_assignment_rule: 'round_robin',
            });
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            is_active: true,
            can_handle_tickets: true,
            max_tickets_per_agent: 10,
            support_level: 0,
            parent_dept_id: '',
            escalation_dept_id: '',
            max_escalation_level: 3,
            auto_assignment_rule: 'round_robin',
        });
    };

    const handleEdit = (department: Department) => {
        setEditingDepartment(department);
        setFormData({
            name: department.name,
            description: department.description,
            is_active: department.is_active,
            can_handle_tickets: department.can_handle_tickets,
            max_tickets_per_agent: department.max_tickets_per_agent,
            support_level: department.support_level || 0,
            parent_dept_id: department.parent_dept_id || '',
            escalation_dept_id: department.escalation_dept_id || '',
            max_escalation_level: department.max_escalation_level || 3,
            auto_assignment_rule: department.auto_assignment_rule || 'round_robin',
        });
        // Open modal after a small delay to ensure formData is set
        setTimeout(() => {
            setShowAddModal(true);
        }, 10);
    };

    const handleDelete = async (deptId: string) => {
        if (confirm('Are you sure you want to delete this department?')) {
            try {
                await departmentsApi.deleteDepartment(deptId);
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    const toggleDepartmentStatus = async (deptId: string, currentStatus: boolean) => {
        try {
            await departmentsApi.updateDepartment(deptId, { is_active: !currentStatus });
            fetchDepartments();
        } catch (error) {
            console.error('Error updating department status:', error);
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
                    <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
                    <p className="text-gray-600">Manage departments and their configurations</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDepartment(null);
                        setFormData({
                            name: '',
                            description: '',
                            is_active: true,
                            can_handle_tickets: true,
                            max_tickets_per_agent: 10,
                            support_level: 0,
                            parent_dept_id: '',
                            escalation_dept_id: '',
                            max_escalation_level: 3,
                            auto_assignment_rule: 'round_robin',
                        });
                        setShowAddModal(true);
                    }}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Department</span>
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((dept) => (
                    <div key={dept.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${dept.is_active ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Building className={`h-5 w-5 ${dept.is_active ? 'text-red-600' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
                                    {dept.support_level !== undefined && (
                                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                            Level {dept.support_level}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{dept.description}</p>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Status:</span>
                                <button
                                    onClick={() => toggleDepartmentStatus(dept.id, dept.is_active)}
                                    className={`px-2 py-1 rounded text-xs font-medium ${dept.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {dept.is_active ? 'Active' : 'Inactive'}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Handle Tickets:</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${dept.can_handle_tickets
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {dept.can_handle_tickets ? 'Yes' : 'No'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Max Tickets:</span>
                                <span className="font-medium">{dept.max_tickets_per_agent}</span>
                            </div>

                            {dept.parent_dept_name && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Parent:</span>
                                    <span className="text-red-600 text-xs">{dept.parent_dept_name}</span>
                                </div>
                            )}

                            {dept.escalation_dept_name && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Escalates to:</span>
                                    <span className="text-orange-600 text-xs">{dept.escalation_dept_name}</span>
                                </div>
                            )}

                            {dept.auto_assignment_rule && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Assignment:</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {dept.auto_assignment_rule.replace('_', ' ')}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="text-xs text-gray-400">
                                Created {new Date(dept.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDepartments.length === 0 && (
                <div className="text-center py-12">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new department.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingDepartment(null);
                    resetForm();
                }}
                title={editingDepartment ? 'Edit Department' : 'Add New Department'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <ModalBody className="space-y-6" maxHeight="max-h-[70vh]">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Enter department name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Department description"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Support Level
                                </label>
                                <select
                                    value={formData.support_level}
                                    onChange={(e) => setFormData({ ...formData, support_level: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    <option value={0}>Level 0 - Basic</option>
                                    <option value={1}>Level 1 - Standard</option>
                                    <option value={2}>Level 2 - Advanced</option>
                                    <option value={3}>Level 3 - Expert</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Tickets per Agent
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.max_tickets_per_agent}
                                    onChange={(e) => setFormData({ ...formData, max_tickets_per_agent: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Parent Department
                                </label>
                                <select
                                    value={formData.parent_dept_id}
                                    onChange={(e) => setFormData({ ...formData, parent_dept_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    <option value="">None</option>
                                    {departments.filter(d => d.id !== editingDepartment?.id).map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Escalation Department
                                </label>
                                <select
                                    value={formData.escalation_dept_id}
                                    onChange={(e) => setFormData({ ...formData, escalation_dept_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                >
                                    <option value="">None</option>
                                    {departments.filter(d => d.id !== editingDepartment?.id).map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Auto Assignment Rule
                            </label>
                            <select
                                value={formData.auto_assignment_rule}
                                onChange={(e) => setFormData({ ...formData, auto_assignment_rule: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            >
                                <option value="round_robin">Round Robin</option>
                                <option value="least_loaded">Least Loaded</option>
                                <option value="skill_based">Skill Based</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="dept-active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="dept-active" className="ml-2 block text-sm text-gray-900">
                                    Active department
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="dept-tickets"
                                    checked={formData.can_handle_tickets}
                                    onChange={(e) => setFormData({ ...formData, can_handle_tickets: e.target.checked })}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="dept-tickets" className="ml-2 block text-sm text-gray-900">
                                    Can handle tickets
                                </label>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddModal(false);
                                setEditingDepartment(null);
                                resetForm();
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        >
                            {editingDepartment ? 'Update Department' : 'Create Department'}
                        </button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}
