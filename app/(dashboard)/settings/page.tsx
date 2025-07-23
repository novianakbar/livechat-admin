'use client';

import { useState } from 'react';
import {
    CogIcon,
    ClockIcon,
    ChatBubbleBottomCenterTextIcon,
    BellIcon,
    CodeBracketIcon,
    ShieldCheckIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        general: {
            companyName: 'Your Company',
            chatTitle: 'Live Chat Support',
            welcomeMessage: 'Hi! How can we help you today?',
            offlineMessage: 'We are currently offline. Please leave a message.',
            theme: 'light',
            language: 'en'
        },
        workingHours: {
            timezone: 'PST',
            days: {
                monday: { enabled: true, start: '09:00', end: '17:00' },
                tuesday: { enabled: true, start: '09:00', end: '17:00' },
                wednesday: { enabled: true, start: '09:00', end: '17:00' },
                thursday: { enabled: true, start: '09:00', end: '17:00' },
                friday: { enabled: true, start: '09:00', end: '17:00' },
                saturday: { enabled: false, start: '09:00', end: '17:00' },
                sunday: { enabled: false, start: '09:00', end: '17:00' }
            }
        },
        chat: {
            maxConcurrentChats: 5,
            chatTimeout: 30,
            showTypingIndicator: true,
            allowFileUpload: true,
            maxFileSize: 10,
            allowedFileTypes: ['jpg', 'png', 'pdf', 'doc'],
            chatRating: true,
            chatTranscript: true,
            proactiveChat: true,
            proactiveChatDelay: 30
        },
        autoReply: {
            enabled: true,
            delay: 30,
            message: 'Thank you for your message. We will get back to you shortly!',
            awayMessage: 'We are currently away. Our team will respond as soon as possible.'
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            soundAlerts: true,
            desktopNotifications: true
        }
    });

    const tabs = [
        { id: 'general', name: 'General', icon: CogIcon },
        { id: 'hours', name: 'Working Hours', icon: ClockIcon },
        { id: 'chat', name: 'Chat Settings', icon: ChatBubbleBottomCenterTextIcon },
        { id: 'auto-reply', name: 'Auto Reply', icon: PaperAirplaneIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'widget', name: 'Widget', icon: CodeBracketIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    ];

    const days = [
        { id: 'monday', name: 'Monday' },
        { id: 'tuesday', name: 'Tuesday' },
        { id: 'wednesday', name: 'Wednesday' },
        { id: 'thursday', name: 'Thursday' },
        { id: 'friday', name: 'Friday' },
        { id: 'saturday', name: 'Saturday' },
        { id: 'sunday', name: 'Sunday' }
    ];

    const handleSave = () => {
        console.log('Saving settings:', settings);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-600">
                        Configure your LiveChat system preferences
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Save Changes
                </button>
            </div>

            {/* Settings Tabs */}
            <div className="bg-white rounded-lg shadow-soft">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="h-5 w-5 mr-2" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.companyName}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, companyName: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chat Title
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.chatTitle}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, chatTitle: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Welcome Message
                                </label>
                                <textarea
                                    value={settings.general.welcomeMessage}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, welcomeMessage: e.target.value }
                                    })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Offline Message
                                </label>
                                <textarea
                                    value={settings.general.offlineMessage}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, offlineMessage: e.target.value }
                                    })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Theme
                                    </label>
                                    <select
                                        value={settings.general.theme}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, theme: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Default Language
                                    </label>
                                    <select
                                        value={settings.general.language}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, language: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hours' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timezone
                                </label>
                                <select
                                    value={settings.workingHours.timezone}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        workingHours: { ...settings.workingHours, timezone: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="PST">Pacific Standard Time</option>
                                    <option value="EST">Eastern Standard Time</option>
                                    <option value="CST">Central Standard Time</option>
                                    <option value="MST">Mountain Standard Time</option>
                                </select>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
                                <div className="space-y-3">
                                    {days.map((day) => (
                                        <div key={day.id} className="flex items-center space-x-4">
                                            <div className="w-20">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.workingHours.days[day.id as keyof typeof settings.workingHours.days]?.enabled || false}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        workingHours: {
                                                            ...settings.workingHours,
                                                            days: {
                                                                ...settings.workingHours.days,
                                                                [day.id]: {
                                                                    ...settings.workingHours.days[day.id as keyof typeof settings.workingHours.days],
                                                                    enabled: e.target.checked
                                                                }
                                                            }
                                                        }
                                                    })}
                                                    className="h-4 w-4 text-primary-600 rounded mr-2"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{day.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="time"
                                                    value={settings.workingHours.days[day.id as keyof typeof settings.workingHours.days]?.start || '09:00'}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        workingHours: {
                                                            ...settings.workingHours,
                                                            days: {
                                                                ...settings.workingHours.days,
                                                                [day.id]: {
                                                                    ...settings.workingHours.days[day.id as keyof typeof settings.workingHours.days],
                                                                    start: e.target.value
                                                                }
                                                            }
                                                        }
                                                    })}
                                                    disabled={!settings.workingHours.days[day.id as keyof typeof settings.workingHours.days]?.enabled}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                                <span className="text-gray-500">to</span>
                                                <input
                                                    type="time"
                                                    value={settings.workingHours.days[day.id as keyof typeof settings.workingHours.days]?.end || '17:00'}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        workingHours: {
                                                            ...settings.workingHours,
                                                            days: {
                                                                ...settings.workingHours.days,
                                                                [day.id]: {
                                                                    ...settings.workingHours.days[day.id as keyof typeof settings.workingHours.days],
                                                                    end: e.target.value
                                                                }
                                                            }
                                                        }
                                                    })}
                                                    disabled={!settings.workingHours.days[day.id as keyof typeof settings.workingHours.days]?.enabled}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Behavior</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Max Concurrent Chats per Agent
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={settings.chat.maxConcurrentChats}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                chat: { ...settings.chat, maxConcurrentChats: parseInt(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chat Timeout (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            min="5"
                                            max="120"
                                            value={settings.chat.chatTimeout}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                chat: { ...settings.chat, chatTimeout: parseInt(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Features</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Show Typing Indicator</p>
                                            <p className="text-xs text-gray-500">Display when agents are typing</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.chat.showTypingIndicator}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                chat: { ...settings.chat, showTypingIndicator: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Chat Rating</p>
                                            <p className="text-xs text-gray-500">Allow customers to rate conversations</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.chat.chatRating}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                chat: { ...settings.chat, chatRating: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Chat Transcript</p>
                                            <p className="text-xs text-gray-500">Send chat transcript via email</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.chat.chatTranscript}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                chat: { ...settings.chat, chatTranscript: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">File Upload</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Allow File Upload</p>
                                            <p className="text-xs text-gray-500">Let customers upload files</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.chat.allowFileUpload}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                chat: { ...settings.chat, allowFileUpload: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                    {settings.chat.allowFileUpload && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Max File Size (MB)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={settings.chat.maxFileSize}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        chat: { ...settings.chat, maxFileSize: parseInt(e.target.value) }
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Allowed File Types
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'zip'].map((type) => (
                                                        <label key={type} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={settings.chat.allowedFileTypes.includes(type)}
                                                                onChange={(e) => {
                                                                    const newTypes = e.target.checked
                                                                        ? [...settings.chat.allowedFileTypes, type]
                                                                        : settings.chat.allowedFileTypes.filter(t => t !== type);
                                                                    setSettings({
                                                                        ...settings,
                                                                        chat: { ...settings.chat, allowedFileTypes: newTypes }
                                                                    });
                                                                }}
                                                                className="h-4 w-4 text-primary-600 rounded mr-2"
                                                            />
                                                            <span className="text-sm text-gray-700">{type.toUpperCase()}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Proactive Chat</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Enable Proactive Chat</p>
                                            <p className="text-xs text-gray-500">Automatically start conversations with visitors</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.chat.proactiveChat}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                chat: { ...settings.chat, proactiveChat: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                    {settings.chat.proactiveChat && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Proactive Chat Delay (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                min="5"
                                                max="300"
                                                value={settings.chat.proactiveChatDelay}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    chat: { ...settings.chat, proactiveChatDelay: parseInt(e.target.value) }
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'auto-reply' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Auto Reply</h3>
                                    <p className="text-sm text-gray-600">Automatically respond to new messages</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.autoReply.enabled}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        autoReply: { ...settings.autoReply, enabled: e.target.checked }
                                    })}
                                    className="h-4 w-4 text-primary-600 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delay (seconds)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={settings.autoReply.delay}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        autoReply: { ...settings.autoReply, delay: parseInt(e.target.value) }
                                    })}
                                    disabled={!settings.autoReply.enabled}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Auto Reply Message
                                </label>
                                <textarea
                                    value={settings.autoReply.message}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        autoReply: { ...settings.autoReply, message: e.target.value }
                                    })}
                                    disabled={!settings.autoReply.enabled}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Away Message
                                </label>
                                <textarea
                                    value={settings.autoReply.awayMessage}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        autoReply: { ...settings.autoReply, awayMessage: e.target.value }
                                    })}
                                    disabled={!settings.autoReply.enabled}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                                            <p className="text-xs text-gray-500">Receive notifications via email</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.emailNotifications}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                                            <p className="text-xs text-gray-500">Receive push notifications</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.pushNotifications}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, pushNotifications: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Sound Alerts</p>
                                            <p className="text-xs text-gray-500">Play sound for new messages</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.soundAlerts}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, soundAlerts: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Desktop Notifications</p>
                                            <p className="text-xs text-gray-500">Show desktop notifications</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.desktopNotifications}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, desktopNotifications: e.target.checked }
                                            })}
                                            className="h-4 w-4 text-primary-600 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'widget' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Widget Installation</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Copy and paste this code into your website&apos;s HTML before the closing &lt;/body&gt; tag.
                                </p>
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <code className="text-sm text-gray-800">
                                        {`<!-- LiveChat Widget -->
<script>
  (function() {
    var lc = document.createElement('script');
    lc.async = true;
    lc.src = 'https://widget.livechat.com/widget.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(lc, s);
  })();
</script>
<!-- End LiveChat Widget -->`}
                                    </code>
                                </div>
                                <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                    Copy Code
                                </button>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Widget Preview</h3>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-center h-32">
                                        <div className="bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg">
                                            <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 text-center mt-2">
                                        Chat widget preview
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Require 2FA for all agents</p>
                                            <p className="text-xs text-gray-500">Force two-factor authentication for all team members</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Session timeout</p>
                                            <p className="text-xs text-gray-500">Auto-logout after period of inactivity</p>
                                        </div>
                                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                            <option value="480">8 hours</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">IP Restrictions</p>
                                            <p className="text-xs text-gray-500">Only allow access from specific IP addresses</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Data retention</p>
                                            <p className="text-xs text-gray-500">How long to keep chat history</p>
                                        </div>
                                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                            <option value="30">30 days</option>
                                            <option value="90">90 days</option>
                                            <option value="365">1 year</option>
                                            <option value="0">Forever</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">GDPR Compliance</p>
                                            <p className="text-xs text-gray-500">Enable GDPR compliance features</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
