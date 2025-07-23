'use client';

import { useState, useEffect } from 'react';
import { SparklesIcon, PlusIcon } from '@heroicons/react/24/outline';

interface AutoTagSuggestionsProps {
    conversationContent: string;
    currentTags: string[];
    onAddTag: (tag: string) => void;
}

export default function AutoTagSuggestions({
    conversationContent,
    currentTags,
    onAddTag
}: AutoTagSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Simulate auto-tagging logic based on conversation content
    useEffect(() => {
        const generateSuggestions = () => {
            setLoading(true);
            const content = conversationContent.toLowerCase();
            const newSuggestions: string[] = [];

            // Detect permit types
            if (content.includes('nib')) newSuggestions.push('NIB');
            if (content.includes('siup')) newSuggestions.push('SIUP');
            if (content.includes('izin lokasi')) newSuggestions.push('Izin Lokasi');
            if (content.includes('amdal')) newSuggestions.push('AMDAL');
            if (content.includes('slf')) newSuggestions.push('SLF');
            if (content.includes('iumk')) newSuggestions.push('IUMK');
            if (content.includes('pangan')) newSuggestions.push('Pangan');
            if (content.includes('bangunan')) newSuggestions.push('Bangunan');
            if (content.includes('lingkungan')) newSuggestions.push('Lingkungan');
            if (content.includes('gangguan')) newSuggestions.push('Izin Gangguan');

            // Detect business types
            if (content.includes('kuliner') || content.includes('makanan') || content.includes('warung')) {
                newSuggestions.push('Kuliner');
            }
            if (content.includes('salon') || content.includes('kecantikan')) {
                newSuggestions.push('Salon');
            }
            if (content.includes('kafe') || content.includes('coffee')) {
                newSuggestions.push('Kafe');
            }
            if (content.includes('toko') || content.includes('jual')) {
                newSuggestions.push('Perdagangan');
            }
            if (content.includes('usaha kecil') || content.includes('umkm')) {
                newSuggestions.push('UMKM');
            }

            // Detect priority
            if (content.includes('urgent') || content.includes('mendesak')) {
                newSuggestions.push('Urgent');
            }
            if (content.includes('penting') || content.includes('segera')) {
                newSuggestions.push('High');
            }

            // Detect status
            if (content.includes('dokumen') || content.includes('berkas')) {
                newSuggestions.push('Need Document');
            }
            if (content.includes('revisi') || content.includes('perbaikan')) {
                newSuggestions.push('Revisi');
            }

            // Filter out existing tags
            const filtered = newSuggestions.filter(tag => !currentTags.includes(tag));
            setSuggestions(filtered);
            setLoading(false);
        };

        if (conversationContent) {
            const timer = setTimeout(generateSuggestions, 1000);
            return () => clearTimeout(timer);
        }
    }, [conversationContent, currentTags]);

    if (loading) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                    <SparklesIcon className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-blue-700">Menganalisis percakapan...</span>
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
                <SparklesIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Tag Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => onAddTag(tag)}
                        className="inline-flex items-center px-2 py-1 bg-white border border-blue-300 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        {tag}
                    </button>
                ))}
            </div>
            <p className="text-xs text-blue-600 mt-2">
                Suggestions berdasarkan analisis konten percakapan
            </p>
        </div>
    );
}
