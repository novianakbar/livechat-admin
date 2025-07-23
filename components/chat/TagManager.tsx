'use client';

import { useState } from 'react';
import {
    PlusIcon,
    XMarkIcon,
    TagIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

interface TagManagerProps {
    tags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
    suggestedTags?: string[];
}

export default function TagManager({ tags, onAddTag, onRemoveTag }: TagManagerProps) {
    const [newTag, setNewTag] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Tag suggestions based on OSS permit types
    const permitTags = [
        'nib', 'siup', 'amdal', 'slf', 'iumk', 'pangan', 'konstruksi',
        'lingkungan', 'perdagangan', 'industri', 'makanan', 'bangunan',
        'urgent', 'selesai', 'pending', 'revisi', 'dokumen', 'panduan'
    ];

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
            onAddTag(newTag.trim().toLowerCase());
            setNewTag('');
            setShowSuggestions(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const filteredSuggestions = permitTags.filter(tag =>
        tag.toLowerCase().includes(newTag.toLowerCase()) &&
        !tags.includes(tag)
    );

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-900 flex items-center">
                    <TagIcon className="h-4 w-4 mr-1" />
                    Tags
                </h5>
                <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                >
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    Smart Tags
                </button>
            </div>

            {/* Current Tags */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                        {tag}
                        <button
                            onClick={() => onRemoveTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                            <XMarkIcon className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Add New Tag */}
            <div className="relative">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add new tag..."
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Tag Suggestions */}
                {(showSuggestions || newTag) && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                        {filteredSuggestions.slice(0, 8).map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    onAddTag(tag);
                                    setNewTag('');
                                    setShowSuggestions(false);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                <TagIcon className="h-3 w-3 mr-2 text-gray-400" />
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Auto-tagging Info */}
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                <SparklesIcon className="h-3 w-3 inline mr-1" />
                Tags otomatis ditambahkan berdasarkan jenis izin dan kata kunci percakapan
            </div>
        </div>
    );
}
