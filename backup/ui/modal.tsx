'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle escape key press and focus management
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            // Store the currently focused element
            previousActiveElement.current = document.activeElement as HTMLElement;

            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';

            // Focus the first input field instead of the modal container
            setTimeout(() => {
                const modal = modalRef.current;
                if (modal) {
                    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea') as HTMLElement;
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            }, 150);
        } else {
            // Restore focus to the previously active element
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle focus trap within modal - improved version
    const handleTabKey = (e: KeyboardEvent) => {
        // Only handle Tab key, not other keys that might interfere with input
        if (e.key !== 'Tab') return;

        // Don't interfere if user is actively typing in an input
        const activeElement = document.activeElement;
        if (activeElement &&
            (activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT')) {
            // Let natural tab behavior work for form elements
            return;
        }

        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Only prevent default and redirect focus when actually at the boundaries
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Add focus trap event listener
            const handleKeyDown = (e: KeyboardEvent) => handleTabKey(e);
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto modal-focus-custom"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop with enhanced blur effect */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-out modal-focus-custom focus:outline-none"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal container with improved centering */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div
                    ref={modalRef}
                    className={`
                        relative w-full ${sizeClasses[size]} 
                        transform rounded-2xl bg-white shadow-2xl ring-1 ring-black/5
                        transition-all duration-300 ease-out
                        animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4
                        modal-focus-custom focus:outline-none
                        ${className}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with improved styling */}
                    <div className="flex items-center justify-between border-b border-gray-200/80 px-6 py-5">
                        <h3
                            id="modal-title"
                            className="text-xl font-semibold text-gray-900 tracking-tight"
                        >
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 transition-all duration-200 modal-focus-custom"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content with improved spacing */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
    return (
        <div className={`border-t border-gray-200/80 px-6 py-5 bg-gray-50/80 backdrop-blur-sm rounded-b-2xl ${className}`}>
            <div className="flex justify-end space-x-3">
                {children}
            </div>
        </div>
    );
}

interface ModalBodyProps {
    children: ReactNode;
    className?: string;
    maxHeight?: string;
}

export function ModalBody({ children, className = '', maxHeight = 'max-h-96' }: ModalBodyProps) {
    return (
        <div className={`${maxHeight} overflow-y-auto modal-scrollbar pr-1 ${className}`}>
            {children}
        </div>
    );
}
