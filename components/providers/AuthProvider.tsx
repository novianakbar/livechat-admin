'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/api';
import { authApi, setAuthToken, setRefreshToken, clearAuthTokens, getAuthToken } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAuthenticated = !!user;

    // Initialize authentication state
    useEffect(() => {
        initializeAuth();
    }, []);

    // Set up token refresh interval
    useEffect(() => {
        if (isAuthenticated) {
            // Refresh token every 10 minutes (token expires in 15 minutes)
            const interval = setInterval(refreshSession, 10 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const initializeAuth = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            // Validate current session
            const userData = await authApi.validateSession();
            setUser(userData);
        } catch (error) {
            console.error('Session validation failed:', error);
            clearAuthTokens();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login(email, password);

            setAuthToken(response.token);
            setRefreshToken(response.refresh_token);
            setUser(response.user);

            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            clearAuthTokens();
            router.push('/login');
        }
    };

    const refreshSession = async () => {
        try {
            const userData = await authApi.validateSession();
            setUser(userData);
        } catch (error) {
            console.error('Session refresh failed:', error);
            // Don't logout automatically on refresh failure
            // The API layer will handle token refresh automatically
        }
    };

    const contextValue: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshSession,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
