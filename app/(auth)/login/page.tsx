'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/providers/AuthProvider';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, authLoading, router]);

    // Show loading while checking auth status
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Don't render login form if authenticated
    if (isAuthenticated) {
        return null;
    }

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError('');

        try {
            await login(data.email, data.password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">LiveChat</span>
                    </div>
                </div>

                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    LiveChat Admin - OSS Perizinan Berusaha
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sistem Bantuan Pelayanan OSS
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-strong sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register('email', {
                                        required: 'Email wajib diisi',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Format email tidak valid'
                                        }
                                    })}
                                    type="email"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="admin@oss.go.id"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    {...register('password', {
                                        required: 'Password wajib diisi',
                                        minLength: {
                                            value: 6,
                                            message: 'Password minimal 6 karakter'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Demo Login:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-50 rounded-md p-3">
                                    <p className="font-medium text-gray-700">Admin</p>
                                    <p className="text-gray-600">admin@oss.go.id</p>
                                    <p className="text-gray-600">password123</p>
                                </div>
                                <div className="bg-gray-50 rounded-md p-3">
                                    <p className="font-medium text-gray-700">Agent</p>
                                    <p className="text-gray-600">agent@oss.go.id</p>
                                    <p className="text-gray-600">password123</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
