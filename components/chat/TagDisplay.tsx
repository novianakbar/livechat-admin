'use client';

import { TagIcon } from '@heroicons/react/24/outline';

interface TagDisplayProps {
    tags: string[];
    maxTags?: number;
    size?: 'sm' | 'md';
}

export default function TagDisplay({ tags, maxTags = 3, size = 'sm' }: TagDisplayProps) {
    const displayTags = tags.slice(0, maxTags);
    const remainingCount = tags.length - maxTags;

    const getTagColor = (tag: string) => {
        const tagLower = tag.toLowerCase();

        // Jenis Perizinan
        if (tagLower.includes('nib')) return 'bg-blue-100 text-blue-800';
        if (tagLower.includes('siup')) return 'bg-purple-100 text-purple-800';
        if (tagLower.includes('izin lokasi')) return 'bg-green-100 text-green-800';
        if (tagLower.includes('amdal')) return 'bg-emerald-100 text-emerald-800';
        if (tagLower.includes('slf')) return 'bg-cyan-100 text-cyan-800';
        if (tagLower.includes('iumk')) return 'bg-indigo-100 text-indigo-800';
        if (tagLower.includes('pangan')) return 'bg-orange-100 text-orange-800';
        if (tagLower.includes('konstruksi')) return 'bg-gray-100 text-gray-800';
        if (tagLower.includes('bangunan')) return 'bg-stone-100 text-stone-800';
        if (tagLower.includes('lingkungan')) return 'bg-teal-100 text-teal-800';

        // Status
        if (tagLower.includes('pending')) return 'bg-yellow-100 text-yellow-800';
        if (tagLower.includes('review')) return 'bg-blue-100 text-blue-800';
        if (tagLower.includes('approved')) return 'bg-green-100 text-green-800';
        if (tagLower.includes('rejected')) return 'bg-red-100 text-red-800';
        if (tagLower.includes('completed')) return 'bg-emerald-100 text-emerald-800';
        if (tagLower.includes('selesai')) return 'bg-emerald-100 text-emerald-800';
        if (tagLower.includes('revisi')) return 'bg-amber-100 text-amber-800';
        if (tagLower.includes('dokumen')) return 'bg-orange-100 text-orange-800';

        // Prioritas
        if (tagLower.includes('urgent')) return 'bg-red-200 text-red-900';
        if (tagLower.includes('high')) return 'bg-red-100 text-red-800';
        if (tagLower.includes('medium')) return 'bg-yellow-100 text-yellow-800';
        if (tagLower.includes('low')) return 'bg-gray-100 text-gray-800';
        if (tagLower.includes('vip')) return 'bg-purple-100 text-purple-800';

        // Kategori Bisnis
        if (tagLower.includes('umkm')) return 'bg-purple-100 text-purple-800';
        if (tagLower.includes('korporat')) return 'bg-blue-100 text-blue-800';
        if (tagLower.includes('startup')) return 'bg-violet-100 text-violet-800';
        if (tagLower.includes('manufaktur')) return 'bg-orange-100 text-orange-800';
        if (tagLower.includes('jasa')) return 'bg-cyan-100 text-cyan-800';
        if (tagLower.includes('perdagangan')) return 'bg-emerald-100 text-emerald-800';
        if (tagLower.includes('pariwisata')) return 'bg-pink-100 text-pink-800';
        if (tagLower.includes('kuliner')) return 'bg-rose-100 text-rose-800';
        if (tagLower.includes('salon')) return 'bg-fuchsia-100 text-fuchsia-800';
        if (tagLower.includes('kafe')) return 'bg-amber-100 text-amber-800';

        // Wilayah
        if (tagLower.includes('jakarta')) return 'bg-indigo-100 text-indigo-800';
        if (tagLower.includes('bandung')) return 'bg-blue-100 text-blue-800';
        if (tagLower.includes('surabaya')) return 'bg-green-100 text-green-800';
        if (tagLower.includes('yogyakarta')) return 'bg-purple-100 text-purple-800';

        // Default
        return 'bg-gray-100 text-gray-800';
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1.5 text-sm'
    };

    return (
        <div className="flex flex-wrap gap-1">
            {displayTags.map((tag, index) => (
                <span
                    key={index}
                    className={`inline-flex items-center rounded-full font-medium ${getTagColor(tag)} ${sizeClasses[size]}`}
                >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                </span>
            ))}
            {remainingCount > 0 && (
                <span className={`inline-flex items-center rounded-full font-medium bg-gray-100 text-gray-600 ${sizeClasses[size]}`}>
                    +{remainingCount}
                </span>
            )}
        </div>
    );
}
