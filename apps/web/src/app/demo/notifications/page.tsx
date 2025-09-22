'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Webhook, Settings, Check, X, Eye, EyeOff } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'task_assigned' | 'task_due' | 'workflow_step' | 'file_uploaded' | 'approval_required';
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
  data: any;
  channels: ('in_app' | 'email' | 'sms' | 'webhook')[];
}

interface NotificationPreference {
  type: string;
  inApp: boolean;
  email: boolean;
  sms: boolean;
  webhook: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Implement user authentication" task',
    isRead: false,
    sentAt: '2024-01-17 10:30:00',
    data: { taskId: '1', taskTitle: 'Implement user authentication' },
    channels: ['in_app', 'email']
  },
  {
    id: '2',
    type: 'workflow_step',
    title: 'Workflow Step Completed',
    message: 'Legal Review step has been completed in Contract Approval Process',
    isRead: false,
    sentAt: '2024-01-17 09:15:00',
    data: { workflowId: '1', stepName: 'Legal Review' },
    channels: ['in_app', 'email', 'webhook']
  },
  {
    id: '3',
    type: 'approval_required',
    title: 'Approval Required',
    message: 'Your approval is required for Finance Approval step in Contract Approval Process',
    isRead: true,
    sentAt: '2024-01-17 08:45:00',
    readAt: '2024-01-17 09:00:00',
    data: { workflowId: '1', stepName: 'Finance Approval' },
    channels: ['in_app', 'email', 'sms']
  },
  {
    id: '4',
    type: 'file_uploaded',
    title: 'File Uploaded',
    message: 'contract_agreement.pdf has been uploaded and is ready for review',
    isRead: true,
    sentAt: '2024-01-16 16:20:00',
    readAt: '2024-01-16 16:25:00',
    data: { fileId: '1', fileName: 'contract_agreement.pdf' },
    channels: ['in_app', 'email']
  },
  {
    id: '5',
    type: 'task_due',
    title: 'Task Due Soon',
    message: 'Task "Setup CI/CD pipeline" is due in 2 days',
    isRead: false,
    sentAt: '2024-01-16 14:30:00',
    data: { taskId: '3', taskTitle: 'Setup CI/CD pipeline', dueDate: '2024-01-19' },
    channels: ['in_app', 'email', 'sms']
  },
  {
    id: '6',
    type: 'success',
    title: 'Password Changed',
    message: 'Your password has been successfully changed',
    isRead: true,
    sentAt: '2024-01-16 11:15:00',
    readAt: '2024-01-16 11:16:00',
    data: {},
    channels: ['in_app', 'email']
  },
  {
    id: '7',
    type: 'warning',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from your account',
    isRead: false,
    sentAt: '2024-01-16 10:45:00',
    data: { ipAddress: '192.168.1.100', attempts: 3 },
    channels: ['in_app', 'email', 'sms', 'webhook']
  },
  {
    id: '8',
    type: 'error',
    title: 'Upload Failed',
    message: 'Failed to upload large_file.zip due to size limit exceeded',
    isRead: true,
    sentAt: '2024-01-15 15:30:00',
    readAt: '2024-01-15 15:35:00',
    data: { fileName: 'large_file.zip', error: 'Size limit exceeded' },
    channels: ['in_app', 'email']
  }
];

const mockPreferences: NotificationPreference[] = [
  { type: 'task_assigned', inApp: true, email: true, sms: false, webhook: false },
  { type: 'task_due', inApp: true, email: true, sms: true, webhook: false },
  { type: 'workflow_step', inApp: true, email: true, sms: false, webhook: true },
  { type: 'file_uploaded', inApp: true, email: false, sms: false, webhook: false },
  { type: 'approval_required', inApp: true, email: true, sms: true, webhook: false },
  { type: 'info', inApp: true, email: false, sms: false, webhook: false },
  { type: 'warning', inApp: true, email: true, sms: true, webhook: true },
  { type: 'error', inApp: true, email: true, sms: false, webhook: false },
  { type: 'success', inApp: true, email: false, sms: false, webhook: false }
];

export default function NotificationsDemoPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences' | 'templates'>('notifications');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
      task_assigned: 'bg-purple-100 text-purple-800',
      task_due: 'bg-orange-100 text-orange-800',
      workflow_step: 'bg-indigo-100 text-indigo-800',
      file_uploaded: 'bg-cyan-100 text-cyan-800',
      approval_required: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
      case 'task_due':
        return <Check className="h-4 w-4" />;
      case 'workflow_step':
      case 'approval_required':
        return <Bell className="h-4 w-4" />;
      case 'file_uploaded':
        return <Mail className="h-4 w-4" />;
      case 'warning':
        return <X className="h-4 w-4" />;
      case 'error':
        return <X className="h-4 w-4" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'in_app':
        return <Bell className="h-3 w-3" />;
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'sms':
        return <MessageSquare className="h-3 w-3" />;
      case 'webhook':
        return <Webhook className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationIds: string[]) => {
    console.log('Marking as read:', notificationIds);
  };

  const handleMarkAsUnread = (notificationIds: string[]) => {
    console.log('Marking as unread:', notificationIds);
  };

  const handleDelete = (notificationIds: string[]) => {
    console.log('Deleting:', notificationIds);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications Management Demo</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive notification system with in-app, email, SMS, webhook channels, templating, and preference center
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Email Sent</p>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SMS Sent</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Templates
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Filters and Actions */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filter === 'all'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filter === 'unread'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => setFilter('read')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filter === 'read'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Read
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedNotifications.length > 0 && (
                    <>
                      <button
                        onClick={() => handleMarkAsRead(selectedNotifications)}
                        className="btn btn-outline btn-sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Read
                      </button>
                      <button
                        onClick={() => handleMarkAsUnread(selectedNotifications)}
                        className="btn btn-outline btn-sm"
                      >
                        <EyeOff className="h-4 w-4 mr-1" />
                        Mark Unread
                      </button>
                      <button
                        onClick={() => handleDelete(selectedNotifications)}
                        className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                  <button className="btn btn-primary btn-sm">
                    <Bell className="h-4 w-4 mr-1" />
                    Mark All Read
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications([...selectedNotifications, notification.id]);
                        } else {
                          setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                        }
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">{notification.sentAt}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {notification.channels.map((channel, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-500">
                              {getChannelIcon(channel)}
                              <span>{channel.replace('_', ' ')}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead([notification.id])}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark as read
                            </button>
                          )}
                          <button className="text-xs text-gray-500 hover:text-gray-700">
                            View details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              <button className="btn btn-primary">
                <Settings className="h-4 w-4 mr-2" />
                Save Preferences
              </button>
            </div>
            
            <div className="space-y-6">
              {mockPreferences.map((preference) => (
                <div key={preference.type} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {preference.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(preference.type)}`}>
                      {preference.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preference.inApp}
                        onChange={(e) => console.log('In-app changed:', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700 flex items-center space-x-1">
                        <Bell className="h-3 w-3" />
                        <span>In-App</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preference.email}
                        onChange={(e) => console.log('Email changed:', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700 flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>Email</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preference.sms}
                        onChange={(e) => console.log('SMS changed:', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700 flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>SMS</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preference.webhook}
                        onChange={(e) => console.log('Webhook changed:', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700 flex items-center space-x-1">
                        <Webhook className="h-3 w-3" />
                        <span>Webhook</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
              <button className="btn btn-primary">
                <Bell className="h-4 w-4 mr-2" />
                Create Template
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Task Assignment', type: 'task_assigned', channels: ['in_app', 'email'], variables: ['taskTitle', 'assignedBy'] },
                { name: 'Task Due Reminder', type: 'task_due', channels: ['in_app', 'email', 'sms'], variables: ['taskTitle', 'dueDate'] },
                { name: 'Workflow Step', type: 'workflow_step', channels: ['in_app', 'email', 'webhook'], variables: ['workflowName', 'stepName'] },
                { name: 'File Uploaded', type: 'file_uploaded', channels: ['in_app', 'email'], variables: ['fileName', 'uploadedBy'] },
                { name: 'Approval Required', type: 'approval_required', channels: ['in_app', 'email', 'sms'], variables: ['workflowName', 'stepName'] },
                { name: 'Security Alert', type: 'warning', channels: ['in_app', 'email', 'sms', 'webhook'], variables: ['alertType', 'ipAddress'] }
              ].map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                      {template.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Channels: {template.channels.join(', ')}
                  </p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="btn btn-outline btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-primary btn-sm">
                      Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Demo */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span>Multi-channel notifications (in-app, email, SMS, webhook)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-600" />
                <span>Rich email templates with HTML and plain text</span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span>SMS notifications with delivery tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <Webhook className="h-4 w-4 text-orange-600" />
                <span>Webhook integration for external systems</span>
              </li>
              <li className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-red-600" />
                <span>Granular preference center for each notification type</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Task Management</span>
                <span className="text-sm text-gray-600">Assignments, due dates</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Workflow</span>
                <span className="text-sm text-gray-600">Step completion, approvals</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">File Management</span>
                <span className="text-sm text-gray-600">Uploads, processing</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Security</span>
                <span className="text-sm text-gray-600">Alerts, warnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
