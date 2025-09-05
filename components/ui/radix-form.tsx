'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RadixButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'solid' | 'outline';
    color?: 'red' | 'gray';
    children: React.ReactNode;
    loading?: boolean;
}

export function RadixButton({
    variant = 'solid',
    color = 'red',
    className,
    children,
    loading = false,
    ...props
}: RadixButtonProps) {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer";

    const variantClasses = {
        solid: {
            red: "text-white bg-red-600 border border-transparent hover:bg-red-700 focus:ring-red-500",
            gray: "text-white bg-gray-600 border border-transparent hover:bg-gray-700 focus:ring-gray-500"
        },
        outline: {
            red: "text-red-700 bg-white border border-red-300 hover:bg-red-50 focus:ring-red-500",
            gray: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
        }
    };

    const buttonClasses = cn(
        baseClasses,
        variantClasses[variant][color],
        loading && "opacity-50 cursor-not-allowed",
        className
    );

    return (
        <button
            className={buttonClasses}
            disabled={loading}
            {...props}
        >
            {loading ? '...' : children}
        </button>
    );
}

interface RadixInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
}

export function RadixInput({
    label,
    required = false,
    error,
    helperText,
    className,
    id,
    ...props
}: RadixInputProps) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    "w-full px-3 py-2.5 border border-gray-300 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500",
                    "transition-all duration-200",
                    "placeholder:text-gray-400",
                    error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
                    className
                )}
                {...props}
            />
            {helperText && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface RadixSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

export function RadixSelect({
    label,
    required = false,
    error,
    className,
    id,
    children,
    ...props
}: RadixSelectProps) {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                id={selectId}
                className={cn(
                    "w-full px-3 py-2.5 border border-gray-300 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500",
                    "transition-all duration-200",
                    "bg-white",
                    error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface RadixTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    required?: boolean;
    error?: string;
}

export function RadixTextarea({
    label,
    required = false,
    error,
    className,
    id,
    ...props
}: RadixTextareaProps) {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                id={textareaId}
                className={cn(
                    "w-full px-3 py-2.5 border border-gray-300 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500",
                    "transition-all duration-200",
                    "placeholder:text-gray-400 resize-none",
                    error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface RadixCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function RadixCheckbox({
    label,
    className,
    id,
    ...props
}: RadixCheckboxProps) {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={checkboxId}
                className={cn(
                    "h-4 w-4 text-red-600 border-gray-300 rounded",
                    "focus:ring-2 focus:ring-red-500/20",
                    "transition-all duration-200",
                    className
                )}
                {...props}
            />
            {label && (
                <label
                    htmlFor={checkboxId}
                    className="text-sm text-gray-900 cursor-pointer"
                >
                    {label}
                </label>
            )}
        </div>
    );
}
