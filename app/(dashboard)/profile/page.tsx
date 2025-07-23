'use client';

import { useState } from 'react';
import {
    CameraIcon,
    PencilIcon,
    KeyIcon,
    BellIcon,
    GlobeAltIcon,
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';

const userProfile = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    avatar: 'JD',
    role: 'Administrator',
    department: 'Management',
    joinDate: '2022-01-15',
    location: 'San Francisco, CA',
    timezone: 'PST',
    languages: ['English', 'Spanish']
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState(userProfile);
    const [isEditing, setIsEditing] = useState(false);

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon },
        { id: 'security', name: 'Security', icon: KeyIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'preferences', name: 'Preferences', icon: GlobeAltIcon },
    ];

    const handleSave = () => {
        // Handle saving profile data
        console.log('Saving profile:', profileData);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                    <p className="text-sm text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-medium text-white">
                                {profileData.avatar}
                            </span>
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                            <CameraIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-gray-900">{profileData.name}</h2>
                        <p className="text-gray-600">{profileData.role} • {profileData.department}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Member since {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long'
                            })}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-xl shadow-modern border border-white/20 overflow-hidden">
                <div className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === tab.id
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
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            disabled={!isEditing}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            disabled={!isEditing}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            disabled={!isEditing}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={profileData.timezone}
                                        onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                    >
                                        <option value="PST">Pacific Standard Time</option>
                                        <option value="EST">Eastern Standard Time</option>
                                        <option value="CST">Central Standard Time</option>
                                        <option value="MST">Mountain Standard Time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Languages
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.languages.map((lang, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">Enable 2FA for additional security</p>
                                        <p className="text-xs text-gray-500">Use your phone to receive verification codes</p>
                                    </div>
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">New Messages</p>
                                            <p className="text-xs text-gray-500">Get notified when you receive new messages</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Daily Summary</p>
                                            <p className="text-xs text-gray-500">Receive daily summary of your conversations</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">System Updates</p>
                                            <p className="text-xs text-gray-500">Get notified about system maintenance and updates</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Browser Notifications</p>
                                            <p className="text-xs text-gray-500">Show notifications in your browser</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Sound Alerts</p>
                                            <p className="text-xs text-gray-500">Play sound when receiving new messages</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Theme
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                            <option>Light</option>
                                            <option>Dark</option>
                                            <option>System</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Language
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                            <option>English</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date Format
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                            <option>MM/DD/YYYY</option>
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Auto-assign conversations</p>
                                            <p className="text-xs text-gray-500">Automatically assign new conversations to you</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Show typing indicators</p>
                                            <p className="text-xs text-gray-500">Show when customers are typing</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Auto-reply delay (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="30"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
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
