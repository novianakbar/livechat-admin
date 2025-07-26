'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChatBubbleLeftEllipsisIcon,
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    XMarkIcon,
    TagIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { chatApi, ChatSession, ChatMessage } from '@/lib/api';
import ConnectionStatus from '@/components/chat/ConnectionStatus';

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    // Core state
    const [session, setSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Message composition
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [customerTyping, setCustomerTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // WebSocket
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // UI state
    const [showCustomerInfo, setShowCustomerInfo] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const customerInfoRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (customerInfoRef.current && !customerInfoRef.current.contains(event.target as Node)) {
                setShowCustomerInfo(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load session data
    const loadSession = useCallback(async () => {
        try {
            setLoading(true);
            const [sessionData, messagesData] = await Promise.all([
                chatApi.getSession(sessionId as `${string}-${string}-${string}-${string}-${string}`),
                chatApi.getMessages(sessionId as `${string}-${string}-${string}-${string}-${string}`),
            ]);

            setSession(sessionData);
            setMessages(messagesData);
        } catch (err) {
            setError('Failed to load chat session');
            console.error('Error loading session:', err);
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    // WebSocket connection
    useEffect(() => {
        const connectWebSocket = () => {
            // Ganti ke endpoint livechat-ws
            const agentId = 'current-agent-id'; // TODO: Ganti dengan ID agent dari context/auth
            const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081'}/ws/${sessionId}/${agentId}/agent`;
            const websocket = new WebSocket(wsUrl);

            websocket.onopen = () => {
                setIsConnected(true);
                console.log('WebSocket connected');
                // Join the session as agent
                websocket.send(JSON.stringify({
                    type: 'join_session',
                    session_id: sessionId,
                    data: {
                        agent_id: agentId
                    },
                    timestamp: new Date().toISOString()
                }));
            };

            websocket.onmessage = (event) => {
                try {
                    const wsMessage = JSON.parse(event.data);
                    console.log('WebSocket message received:', wsMessage);

                    switch (wsMessage.type) {
                        case 'joined_session':
                            console.log('Successfully joined session:', wsMessage.data);
                            break;

                        case 'new_message':
                            if (wsMessage.data.session_id === sessionId) {
                                console.log('Received new message:', wsMessage.data);

                                // Create message object compatible with our state
                                const newMessage: ChatMessage = {
                                    id: wsMessage.data.message_id || `ws-${Date.now()}`,
                                    session_id: wsMessage.data.session_id,
                                    sender_id: wsMessage.data.sender_id || undefined,
                                    sender_type: wsMessage.data.sender_type,
                                    message: wsMessage.data.message,
                                    message_type: wsMessage.data.message_type || 'text',
                                    attachments: [],
                                    read_at: undefined,
                                    created_at: wsMessage.data.timestamp || new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                                    session: session!,
                                    sender: undefined
                                };

                                console.log('Adding message to state:', newMessage);

                                setMessages(prev => {
                                    // Avoid duplicates by checking both ID and content
                                    const exists = prev.some(msg =>
                                        msg.id === newMessage.id ||
                                        (msg.message === newMessage.message &&
                                            msg.sender_type === newMessage.sender_type &&
                                            Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 1000)
                                    );
                                    if (exists) {
                                        console.log('Message already exists, skipping');
                                        return prev;
                                    }
                                    console.log('Adding new message to list');
                                    return [...prev, newMessage];
                                });
                                scrollToBottom();
                            }
                            break;

                        case 'typing_indicator':
                            if (wsMessage.data.session_id === sessionId && wsMessage.data.sender_type === 'customer') {
                                setCustomerTyping(wsMessage.data.is_typing || false);
                                scrollToBottom();
                            }
                            break;

                        case 'session_update':
                            if (wsMessage.data.session_id === sessionId && wsMessage.data.status) {
                                const status = wsMessage.data.status as 'waiting' | 'active' | 'closed';
                                setSession(prev => prev ? { ...prev, status } : null);
                            }
                            break;

                        case 'user_joined':
                            console.log('User joined session:', wsMessage.data);
                            if (wsMessage.data.session_id === sessionId) {
                                // Update session status to active if customer joins
                                if (wsMessage.data.user_type === 'customer' && session?.status === 'waiting') {
                                    setSession(prev => prev ? { ...prev, status: 'active' } : null);
                                }
                            }
                            break;

                        case 'connection_status_update':
                            console.log('Connection status update via WebSocket:', wsMessage.data);
                            // Real-time update via WebSocket - no need for API polling!
                            if (wsMessage.data.session_id === sessionId) {
                                window.dispatchEvent(new CustomEvent('connection-status-update', {
                                    detail: wsMessage.data.connection_status
                                }));
                            }
                            break;
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            };

            websocket.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setIsConnected(false);
                // Attempt to reconnect after 3 seconds
                setTimeout(() => {
                    console.log('Attempting to reconnect WebSocket...');
                    connectWebSocket();
                }, 3000);
            };

            setWs(websocket);
        };

        connectWebSocket();

        return () => {
            if (ws) {
                console.log('Closing WebSocket connection');
                ws.close();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    // Load initial data
    useEffect(() => {
        loadSession();
    }, [loadSession]);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle auto-resize of textarea
    useEffect(() => {
        if (messageInputRef.current) {
            messageInputRef.current.style.height = 'auto';
            messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
        }
    }, [messageInput]);    // Send message
    const sendMessage = async () => {
        if (!messageInput.trim() || isSending || !session) return;

        const messageText = messageInput.trim();
        setIsSending(true);
        setMessageInput(''); // Clear input immediately for better UX

        try {
            console.log('Sending message:', messageText);
            const response = await chatApi.sendMessage(session.id, {
                message: messageText,
                message_type: 'text'
            });
            console.log('Message sent successfully:', response);

            // Add message to local state immediately for better UX
            // The message will also come via WebSocket, so we need to prevent duplicates
            // const agentMessage: ChatMessage = {
            //     id: response.id,
            //     session_id: response.session_id,
            //     sender_id: response.sender_id,
            //     sender_type: response.sender_type,
            //     message: response.message,
            //     message_type: response.message_type,
            //     attachments: response.attachments || [],
            //     read_at: response.read_at,
            //     created_at: response.created_at,
            //     updated_at: response.updated_at,
            //     session: session,
            //     sender: response.sender
            // };

            // setMessages(prev => {
            //     // Check if message already exists
            //     const exists = prev.some(msg => msg.id === agentMessage.id);
            //     if (exists) return prev;
            //     return [...prev, agentMessage];
            // });

            // Scroll to bottom after adding message
            setTimeout(scrollToBottom, 100);

        } catch (err) {
            // Restore message input if sending failed
            setMessageInput(messageText);
            console.error('Error sending message:', err);
            setError('Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    // Handle typing indicators
    const handleTyping = () => {
        if (!isTyping && ws && isConnected) {
            setIsTyping(true);
            ws.send(JSON.stringify({
                type: 'agent_typing',
                session_id: sessionId,
                data: { is_typing: true },
                timestamp: new Date().toISOString()
            }));
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            if (ws && isConnected) {
                ws.send(JSON.stringify({
                    type: 'agent_typing',
                    session_id: sessionId,
                    data: { is_typing: false },
                    timestamp: new Date().toISOString()
                }));
            }
        }, 1000);
    };

    // Handle key press in message input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        } else {
            handleTyping();
        }
    };

    // Close session
    const closeSession = async (reason: string = '') => {
        if (!session) return;

        try {
            await chatApi.closeSession(session.id, { reason });
            setSession(prev => prev ? { ...prev, status: 'closed' } : null);
            setShowCloseModal(false);
        } catch (err) {
            console.error('Error closing session:', err);
            setError('Failed to close session');
        }
    };

    // Format timestamp with proper error handling
    const formatTimestamp = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                // If the timestamp is invalid, return current time formatted
                console.warn('Invalid timestamp received:', timestamp);
                return new Date().toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            return date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.warn('Error formatting timestamp:', timestamp, error);
            return new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'waiting': return 'text-yellow-600 bg-yellow-100';
            case 'closed': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Get priority color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-red-600';
            case 'high': return 'text-orange-600';
            case 'normal': return 'text-blue-600';
            case 'low': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading chat session...</p>
                </div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-2">{error || 'Session not found'}</p>
                    <button
                        onClick={() => router.push('/conversations')}
                        className="text-red-600 hover:text-red-700 font-medium"
                    >
                        Back to Conversations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/conversations')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-white">
                                    {session.contact?.contact_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg font-semibold text-gray-900 truncate">
                                    {session.contact?.contact_name}
                                </h1>
                                <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                        {session.status}
                                    </span>
                                    <span className={`font-medium ${getPriorityColor(session.priority)}`}>
                                        {session.priority} priority
                                    </span>
                                    <span className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        Websocket : {isConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                                {/* Connection Status */}
                                <div className="mt-2">
                                    <ConnectionStatus sessionId={sessionId} />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="relative" ref={customerInfoRef}>
                            <button
                                onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                                className={`p-2 rounded-lg transition-colors ${showCustomerInfo ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            >
                                <InformationCircleIcon className="h-5 w-5" />
                            </button>

                            {/* Customer Info Dropdown */}
                            {showCustomerInfo && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Customer Info</h3>
                                            <button
                                                onClick={() => setShowCustomerInfo(false)}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <XMarkIcon className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>

                                        {/* Customer Avatar & Name */}
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-medium text-white">
                                                    {session.contact?.contact_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {session.contact?.contact_name}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {session.contact?.company_name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                                        <div className="text-xs">
                                            <p className="text-gray-500 mb-1">Email</p>
                                            <p className="text-gray-900 truncate">{session.contact?.contact_email}</p>
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-gray-500 mb-1">Company</p>
                                            <p className="text-gray-900 truncate">{session.contact?.company_name}</p>
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-gray-500 mb-1">Chat Started</p>
                                            <p className="text-gray-900">{new Date(session.started_at).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-gray-500 mb-1">Topic</p>
                                            <p className="text-gray-900">{session.topic}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                            <span className={`text-xs font-medium ${getPriorityColor(session.priority)}`}>
                                                {session.priority} priority
                                            </span>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="pt-2 border-t border-gray-200">
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => { alert('Tag feature will be available soon'); setShowCustomerInfo(false); }}
                                                    className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded text-xs transition-colors group"
                                                >
                                                    <TagIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                                    <span className="text-gray-700 group-hover:text-gray-900">Add Tags</span>
                                                </button>

                                                {(session.status === 'active' || session.status === 'waiting') && (
                                                    <>
                                                        <button
                                                            onClick={() => { alert('Transfer feature will be available soon'); setShowCustomerInfo(false); }}
                                                            className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded text-xs transition-colors group"
                                                        >
                                                            <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                                            <span className="text-gray-700 group-hover:text-gray-900">Transfer Chat</span>
                                                        </button>

                                                        <button
                                                            onClick={() => { setShowCloseModal(true); setShowCustomerInfo(false); }}
                                                            className="w-full flex items-center space-x-2 p-2 text-left hover:bg-red-50 rounded text-xs transition-colors group"
                                                        >
                                                            <CheckCircleIcon className="h-4 w-4 text-red-400 group-hover:text-red-600" />
                                                            <span className="text-red-700 group-hover:text-red-900">Close Chat</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(session.status === 'active' || session.status === 'waiting') && (
                            <button
                                onClick={() => setShowCloseModal(true)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                Close Chat
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Main Chat Area - Full Width */}
                <div className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No messages yet</p>
                                    <p className="text-gray-400 text-sm">Start the conversation with your customer</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <div
                                        key={`${message.id}-${index}`}
                                        className={`flex ${message.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${message.sender_type === 'agent'
                                            ? 'bg-red-600 text-white'
                                            : message.sender_type === 'system'
                                                ? 'bg-gray-100 text-gray-600 italic text-center mx-auto'
                                                : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                            <p className={`text-xs mt-1 ${message.sender_type === 'agent'
                                                ? 'text-red-100'
                                                : 'text-gray-500'
                                                }`}>
                                                {formatTimestamp(message.created_at)}
                                                {message.sender_type === 'agent' && (
                                                    <span className="ml-2">✓</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {customerTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-900 shadow-sm border border-gray-200 rounded-lg px-4 py-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500">Customer is typing</span>
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    {session.status !== 'closed' ? (
                        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
                            <div className="flex items-end space-x-3">
                                <button
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                                    onClick={() => alert('Attachment feature coming soon')}
                                >
                                    <PaperClipIcon className="h-5 w-5" />
                                </button>

                                <div className="flex-1 relative">
                                    <textarea
                                        ref={messageInputRef}
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        rows={1}
                                        className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none max-h-32"
                                        disabled={isSending}
                                        style={{ minHeight: '48px' }}
                                    />
                                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
                                        {!messageInput.trim() && 'Press Enter to send'}
                                        {messageInput.trim() && (isSending ? 'Sending...' : 'Enter to send')}
                                    </div>
                                </div>

                                <button
                                    onClick={sendMessage}
                                    disabled={!messageInput.trim() || isSending}
                                    className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSending ? (
                                        <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                                    ) : (
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 border-t border-gray-200 p-4 text-center flex-shrink-0">
                            <p className="text-gray-600">This conversation has been closed.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Close Modal */}
            {showCloseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Close Chat Session</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to close this chat session with {session.contact?.contact_name}?
                            This action cannot be undone.
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowCloseModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => closeSession('Resolved by agent')}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Close Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
