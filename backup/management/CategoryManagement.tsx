'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag, Clock, ArrowRight } from 'lucide-react';
import { ticketCategoriesApi, departmentsApi } from '@/lib/api';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';

interface TicketCategory {
    id: string;
    name: string;
    code: string;
    description: string;
    color: string;
    is_active: boolean;
    sla_first_response: number; // in minutes
    sla_resolution: number; // in minutes
    default_department_id: string;
    default_department_name?: string;
    created_at: string;
    updated_at: string;
}

interface Department {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
}

const COLOR_OPTIONS = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6c757d'
];

export function CategoryManagement() {
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        color: '#007bff',
        is_active: true,
        sla_first_response: 60, // 1 hour default
        sla_resolution: 1440, // 24 hours default
        default_department_id: '',
    });

    const fetchCategories = async () => {
        try {
            const categories = await ticketCategoriesApi.getCategories();
            setCategories(categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
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
            await Promise.all([fetchCategories(), fetchDepartments()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatSLATime = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}m`;
        } else if (minutes < 1440) {
            return `${Math.floor(minutes / 60)}h`;
        } else {
            return `${Math.floor(minutes / 1440)}d`;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await ticketCategoriesApi.updateCategory(editingCategory.id, formData);
            } else {
                await ticketCategoriesApi.createCategory(formData);
            }
            setShowAddModal(false);
            setEditingCategory(null);
            setFormData({
                name: '',
                code: '',
                description: '',
                color: '#007bff',
                is_active: true,
                sla_first_response: 60,
                sla_resolution: 1440,
                default_department_id: '',
            });
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            description: '',
            color: '#007bff',
            is_active: true,
            sla_first_response: 60,
            sla_resolution: 1440,
            default_department_id: '',
        });
    };

    const handleEdit = (category: TicketCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            code: category.code,
            description: category.description,
            color: category.color,
            is_active: category.is_active,
            sla_first_response: category.sla_first_response,
            sla_resolution: category.sla_resolution,
            default_department_id: category.default_department_id,
        });
        // Open modal after a small delay to ensure formData is set
        setTimeout(() => {
            setShowAddModal(true);
        }, 10);
    };

    const handleDelete = async (categoryId: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await ticketCategoriesApi.deleteCategory(categoryId);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
        try {
            await ticketCategoriesApi.updateCategory(categoryId, { is_active: !currentStatus });
            fetchCategories();
        } catch (error) {
            console.error('Error updating category status:', error);
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
                    <h2 className="text-xl font-semibold text-gray-900">Ticket Categories</h2>
                    <p className="text-gray-600">Manage ticket categories, SLA settings, and assignments</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({
                            name: '',
                            code: '',
                            description: '',
                            color: '#007bff',
                            is_active: true,
                            sla_first_response: 60,
                            sla_resolution: 1440,
                            default_department_id: '',
                        });
                        setShowAddModal(true);
                    }}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: `${category.color}20` }}
                                >
                                    <Tag className="h-5 w-5" style={{ color: category.color }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        {category.code}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                        <div className="space-y-3">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Status:</span>
                                <button
                                    onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                                    className={`px-2 py-1 rounded text-xs font-medium ${category.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </button>
                            </div>

                            {/* SLA Times */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center text-xs text-gray-600 mb-2">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>SLA Requirements</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>First Response</span>
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                    <span className="font-medium">{formatSLATime(category.sla_first_response)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <span>Resolution</span>
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                    <span className="font-medium">{formatSLATime(category.sla_resolution)}</span>
                                </div>
                            </div>

                            {/* Default Department */}
                            {category.default_department_name && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 text-sm">Default Dept:</span>
                                    <span className="text-red-600 text-sm font-medium">
                                        {category.default_department_name}
                                    </span>
                                </div>
                            )}

                            {/* Color Preview */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Color:</span>
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: category.color }}
                                    />
                                    <span className="text-xs text-gray-600">{category.color}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="text-xs text-gray-400">
                                Created {new Date(category.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                    <Tag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    resetForm();
                }}
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <ModalBody className="space-y-6" maxHeight="max-h-[70vh]">
                        <div className="grid grid-cols-2 gap-4">
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
                                    placeholder="Category name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                    placeholder="e.g., TECH, BILLING"
                                />
                            </div>
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
                                placeholder="Category description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="grid grid-cols-5 gap-2">
                                    {COLOR_OPTIONS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${formData.color === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                                                }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                        placeholder="#007bff"
                                    />
                                </div>
                                <div
                                    className="w-10 h-8 rounded border border-gray-300"
                                    style={{ backgroundColor: formData.color }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Response SLA (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.sla_first_response}
                                    onChange={(e) => setFormData({ ...formData, sla_first_response: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {Math.floor(formData.sla_first_response / 60)}h {formData.sla_first_response % 60}m
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Resolution SLA (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.sla_resolution}
                                    onChange={(e) => setFormData({ ...formData, sla_resolution: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {Math.floor(formData.sla_resolution / 60)}h {formData.sla_resolution % 60}m
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Default Department
                            </label>
                            <select
                                value={formData.default_department_id}
                                onChange={(e) => setFormData({ ...formData, default_department_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="category-active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor="category-active" className="ml-2 block text-sm text-gray-900">
                                Active category
                            </label>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddModal(false);
                                setEditingCategory(null);
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
                            {editingCategory ? 'Update Category' : 'Create Category'}
                        </button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}
