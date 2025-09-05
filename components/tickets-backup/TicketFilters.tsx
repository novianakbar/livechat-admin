'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { TicketFilter } from '@/lib/types/tickets';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@/lib/types/tickets';

interface TicketFiltersProps {
    filters: TicketFilter;
    onFiltersChange: (filters: TicketFilter) => void;
    onReset: () => void;
}

export function TicketFilters({ filters, onFiltersChange, onReset }: TicketFiltersProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const updateFilter = (key: keyof TicketFilter, value: string | string[] | undefined) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const toggleArrayFilter = (key: 'status' | 'priority', value: string) => {
        const currentArray = filters[key] || [];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];

        updateFilter(key, newArray.length ? newArray : undefined);
    };

    const hasActiveFilters = Object.keys(filters).some(key => {
        const value = filters[key as keyof TicketFilter];
        return value !== undefined && value !== '' &&
            (Array.isArray(value) ? value.length > 0 : true);
    });

    return (
        <div className="space-y-4">
            {/* Quick Search */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={filters.search || ''}
                        onChange={(e) => updateFilter('search', e.target.value || undefined)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filter
                    {showAdvanced && <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">ON</span>}
                </button>
                {hasActiveFilters && (
                    <button onClick={onReset} className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Reset
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="space-y-2">
                                {TICKET_STATUSES.map((status) => (
                                    <label key={status} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.status?.includes(status) || false}
                                            onChange={() => toggleArrayFilter('status', status)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm capitalize">
                                            {status.replace('_', ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
                            <div className="space-y-2">
                                {TICKET_PRIORITIES.map((priority) => (
                                    <label key={priority} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.priority?.includes(priority) || false}
                                            onChange={() => toggleArrayFilter('priority', priority)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm capitalize">{priority}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Dibuat</label>
                            <div className="space-y-2">
                                <input
                                    type="date"
                                    placeholder="Dari"
                                    value={filters.date_from || ''}
                                    onChange={(e) => updateFilter('date_from', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <input
                                    type="date"
                                    placeholder="Sampai"
                                    value={filters.date_to || ''}
                                    onChange={(e) => updateFilter('date_to', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Customer Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Customer</label>
                            <input
                                type="email"
                                placeholder="customer@example.com"
                                value={filters.customer_email || ''}
                                onChange={(e) => updateFilter('customer_email', e.target.value || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan berdasarkan</label>
                            <select
                                value={filters.sort_by || 'created_at'}
                                onChange={(e) => updateFilter('sort_by', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="created_at">Tanggal Dibuat</option>
                                <option value="updated_at">Terakhir Diupdate</option>
                                <option value="priority">Prioritas</option>
                                <option value="status">Status</option>
                                <option value="subject">Subjek</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Urutan</label>
                            <select
                                value={filters.sort_order || 'desc'}
                                onChange={(e) => updateFilter('sort_order', e.target.value as 'asc' | 'desc')}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="desc">Terbaru</option>
                                <option value="asc">Terlama</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
