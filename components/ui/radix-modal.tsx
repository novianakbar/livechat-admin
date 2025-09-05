'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface RadixModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function RadixModal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    className = ''
}: RadixModalProps) {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className={`
                        fixed left-[50%] top-[50%] z-50 grid w-full ${sizeClasses[size]}
                        translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-0 shadow-2xl 
                        duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out 
                        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
                        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
                        data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] 
                        data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] 
                        rounded-2xl ring-1 ring-black/5 ${className}
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200/80 px-6 py-5">
                        <Dialog.Title className="text-xl font-semibold text-gray-900 tracking-tight">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 transition-all duration-200">
                            <Cross2Icon className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Dialog.Close>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

interface RadixModalBodyProps {
    children: React.ReactNode;
    className?: string;
    maxHeight?: string;
}

export function RadixModalBody({ children, className = '', maxHeight = 'max-h-96' }: RadixModalBodyProps) {
    return (
        <div className={`${maxHeight} overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${className}`}>
            {children}
        </div>
    );
}

interface RadixModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function RadixModalFooter({ children, className = '' }: RadixModalFooterProps) {
    return (
        <div className={`border-t border-gray-200/80 px-6 py-5 bg-gray-50/80 backdrop-blur-sm rounded-b-2xl -mx-6 -mb-6 mt-4 ${className}`}>
            <div className="flex justify-end space-x-3">
                {children}
            </div>
        </div>
    );
}
