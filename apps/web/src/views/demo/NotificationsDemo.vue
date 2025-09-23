<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Notifications Management Demo</h1>
        <p class="text-gray-600 mt-2">
          Comprehensive notification system with in-app, email, SMS, webhook channels, templating, and preference center
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Bell class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Notifications</p>
              <p class="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <Bell class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Unread</p>
              <p class="text-2xl font-bold text-gray-900">{{ unreadCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <Mail class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Email Sent</p>
              <p class="text-2xl font-bold text-gray-900">892</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <MessageSquare class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">SMS Sent</p>
              <p class="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'notifications'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Notifications
              <span v-if="unreadCount > 0" class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {{ unreadCount }}
              </span>
            </button>
            <button
              @click="activeTab = 'preferences'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Preferences
            </button>
            <button
              @click="activeTab = 'templates'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Templates
            </button>
          </nav>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'" class="card">
        <!-- Filters and Actions -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <button
                  @click="filter = 'all'"
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium',
                    filter === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  All
                </button>
                <button
                  @click="filter = 'unread'"
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium',
                    filter === 'unread'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  Unread
                </button>
                <button
                  @click="filter = 'read'"
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium',
                    filter === 'read'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  Read
                </button>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                v-if="selectedNotifications.length > 0"
                @click="handleMarkAsRead(selectedNotifications)"
                class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm"
              >
                <Check class="h-4 w-4 mr-1" />
                Mark Read
              </button>
              <button
                v-if="selectedNotifications.length > 0"
                @click="handleMarkAsUnread(selectedNotifications)"
                class="px-3 py-1 border-2 border-brand-purple text-brand-purple rounded-md hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center text-sm"
              >
                <EyeOff class="h-4 w-4 mr-1" />
                Mark Unread
              </button>
              <button
                v-if="selectedNotifications.length > 0"
                @click="handleDelete(selectedNotifications)"
                class="px-3 py-1 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center text-sm"
              >
                <X class="h-4 w-4 mr-1" />
                Delete
              </button>
              <button @click="handleMarkAllRead" class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm">
                <Bell class="h-4 w-4 mr-1" />
                Mark All Read
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="divide-y divide-gray-200">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            :class="[
              'p-4 hover:bg-gray-50',
              !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            ]"
          >
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                :checked="selectedNotifications.includes(notification.id)"
                @change="toggleNotificationSelection(notification.id)"
                class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              
              <div :class="`p-2 rounded-lg ${getTypeColor(notification.type)}`">
                <component :is="getTypeIcon(notification.type)" />
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
                  <div class="flex items-center space-x-2">
                    <span :class="getTypeColor(notification.type)">
                      {{ notification.type.replace('_', ' ') }}
                    </span>
                    <span class="text-xs text-gray-500">{{ notification.sentAt }}</span>
                  </div>
                </div>
                
                <p class="text-sm text-gray-600 mb-2">{{ notification.message }}</p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div
                      v-for="(channel, index) in notification.channels"
                      :key="index"
                      class="flex items-center space-x-1 text-xs text-gray-500"
                    >
                      <component :is="getChannelIcon(channel)" />
                      <span>{{ channel.replace('_', ' ') }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="!notification.isRead"
                      @click="handleMarkAsRead([notification.id])"
                      class="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                    <button class="text-xs text-gray-500 hover:text-gray-700">
                      View details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences Tab -->
      <div v-if="activeTab === 'preferences'" class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          <button @click="handleSavePreferences" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Settings class="h-4 w-4 mr-2" />
            Save Preferences
          </button>
        </div>
        
        <div class="space-y-6">
          <div
            v-for="preference in mockPreferences"
            :key="preference.type"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900">
                {{ preference.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
              </h4>
              <span :class="getTypeColor(preference.type)">
                {{ preference.type }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :checked="preference.inApp"
                  @change="updatePreference(preference.type, 'inApp', ($event.target as HTMLInputElement).checked)"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="text-sm text-gray-700 flex items-center space-x-1">
                  <Bell class="h-3 w-3" />
                  <span>In-App</span>
                </label>
              </div>
              
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :checked="preference.email"
                  @change="updatePreference(preference.type, 'email', ($event.target as HTMLInputElement).checked)"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="text-sm text-gray-700 flex items-center space-x-1">
                  <Mail class="h-3 w-3" />
                  <span>Email</span>
                </label>
              </div>
              
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :checked="preference.sms"
                  @change="updatePreference(preference.type, 'sms', ($event.target as HTMLInputElement).checked)"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="text-sm text-gray-700 flex items-center space-x-1">
                  <MessageSquare class="h-3 w-3" />
                  <span>SMS</span>
                </label>
              </div>
              
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :checked="preference.webhook"
                  @change="updatePreference(preference.type, 'webhook', ($event.target as HTMLInputElement).checked)"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="text-sm text-gray-700 flex items-center space-x-1">
                  <Webhook class="h-3 w-3" />
                  <span>Webhook</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Templates Tab -->
      <div v-if="activeTab === 'templates'" class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Notification Templates</h3>
          <button @click="handleCreateTemplate" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Bell class="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="template in notificationTemplates"
            :key="template.name"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">{{ template.name }}</h4>
              <span :class="getTypeColor(template.type)">
                {{ template.type }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-3">
              Channels: {{ template.channels.join(', ') }}
            </p>
            <div class="mb-3">
              <p class="text-xs text-gray-500 mb-1">Variables:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="variable in template.variables"
                  :key="variable"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {{ '{{' + variable + '}}' }}
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <button @click="handleEditTemplate(template)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                Edit
              </button>
              <button @click="handleTestTemplate(template)" class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm">
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Demo -->
      <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
          <ul class="space-y-3">
            <li class="flex items-center space-x-2">
              <Bell class="h-4 w-4 text-blue-600" />
              <span>Multi-channel notifications (in-app, email, SMS, webhook)</span>
            </li>
            <li class="flex items-center space-x-2">
              <Mail class="h-4 w-4 text-green-600" />
              <span>Rich email templates with HTML and plain text</span>
            </li>
            <li class="flex items-center space-x-2">
              <MessageSquare class="h-4 w-4 text-purple-600" />
              <span>SMS notifications with delivery tracking</span>
            </li>
            <li class="flex items-center space-x-2">
              <Webhook class="h-4 w-4 text-orange-600" />
              <span>Webhook integration for external systems</span>
            </li>
            <li class="flex items-center space-x-2">
              <Settings class="h-4 w-4 text-red-600" />
              <span>Granular preference center for each notification type</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Task Management</span>
              <span class="text-sm text-gray-600">Assignments, due dates</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Workflow</span>
              <span class="text-sm text-gray-600">Step completion, approvals</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">File Management</span>
              <span class="text-sm text-gray-600">Uploads, processing</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Security</span>
              <span class="text-sm text-gray-600">Alerts, warnings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Notification Workflow Modal -->
  <CreateNotificationWorkflow
    :is-open="isCreateNotificationOpen"
    @close="closeCreateNotification"
    @submit="handleNotificationSubmit"
  />
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, Mail, MessageSquare, Webhook, Settings, Check, X, Eye, EyeOff } from 'lucide-vue-next'
import SidebarLayout from '@/components/SidebarLayout.vue'
import CreateNotificationWorkflow from '@/components/CreateNotificationWorkflow.vue'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success' | 'task_assigned' | 'task_due' | 'workflow_step' | 'file_uploaded' | 'approval_required'
  title: string
  message: string
  isRead: boolean
  sentAt: string
  readAt?: string
  data: any
  channels: ('in_app' | 'email' | 'sms' | 'webhook')[]
}

interface NotificationPreference {
  type: string
  inApp: boolean
  email: boolean
  sms: boolean
  webhook: boolean
}

const activeTab = ref<'notifications' | 'preferences' | 'templates'>('notifications')
const filter = ref<'all' | 'unread' | 'read'>('all')
const selectedNotifications = ref<string[]>([])

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
  }
]

const mockPreferences: NotificationPreference[] = [
  { type: 'task_assigned', inApp: true, email: true, sms: false, webhook: false },
  { type: 'task_due', inApp: true, email: true, sms: true, webhook: false },
  { type: 'workflow_step', inApp: true, email: true, sms: false, webhook: true },
  { type: 'file_uploaded', inApp: true, email: false, sms: false, webhook: false },
  { type: 'approval_required', inApp: true, email: true, sms: true, webhook: false }
]

const notificationTemplates = [
  { name: 'Task Assignment', type: 'task_assigned', channels: ['in_app', 'email'], variables: ['taskTitle', 'assignedBy'] },
  { name: 'Task Due Reminder', type: 'task_due', channels: ['in_app', 'email', 'sms'], variables: ['taskTitle', 'dueDate'] },
  { name: 'Workflow Step', type: 'workflow_step', channels: ['in_app', 'email', 'webhook'], variables: ['workflowName', 'stepName'] },
  { name: 'File Uploaded', type: 'file_uploaded', channels: ['in_app', 'email'], variables: ['fileName', 'uploadedBy'] },
  { name: 'Approval Required', type: 'approval_required', channels: ['in_app', 'email', 'sms'], variables: ['workflowName', 'stepName'] },
  { name: 'Security Alert', type: 'warning', channels: ['in_app', 'email', 'sms', 'webhook'], variables: ['alertType', 'ipAddress'] }
]

const unreadCount = computed(() => {
  return mockNotifications.filter(n => !n.isRead).length
})

const filteredNotifications = computed(() => {
  if (filter.value === 'unread') return mockNotifications.filter(n => !n.isRead)
  if (filter.value === 'read') return mockNotifications.filter(n => n.isRead)
  return mockNotifications
})

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
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'task_assigned':
    case 'task_due':
      return Check
    case 'workflow_step':
    case 'approval_required':
      return Bell
    case 'file_uploaded':
      return Mail
    case 'warning':
    case 'error':
      return X
    case 'success':
      return Check
    default:
      return Bell
  }
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'in_app':
      return Bell
    case 'email':
      return Mail
    case 'sms':
      return MessageSquare
    case 'webhook':
      return Webhook
    default:
      return Bell
  }
}

const toggleNotificationSelection = (notificationId: string) => {
  const index = selectedNotifications.value.indexOf(notificationId)
  if (index > -1) {
    selectedNotifications.value.splice(index, 1)
  } else {
    selectedNotifications.value.push(notificationId)
  }
}

const handleMarkAsRead = (notificationIds: string[]) => {
  console.log('Marking as read:', notificationIds)
}

const handleMarkAsUnread = (notificationIds: string[]) => {
  console.log('Marking as unread:', notificationIds)
}

const handleDelete = (notificationIds: string[]) => {
  console.log('Deleting:', notificationIds)
}

const updatePreference = (type: string, channel: string, value: boolean) => {
  console.log('Updating preference:', type, channel, value)
}

// Button click handlers
const handleMarkAsRead = (notifications: any[]) => {
  console.log('Mark as Read clicked:', notifications)
  alert(`${notifications.length} notification(s) marked as read!`)
}

const handleMarkAsUnread = (notifications: any[]) => {
  console.log('Mark as Unread clicked:', notifications)
  alert(`${notifications.length} notification(s) marked as unread!`)
}

const handleDelete = (notifications: any[]) => {
  console.log('Delete clicked:', notifications)
  if (confirm(`Are you sure you want to delete ${notifications.length} notification(s)?`)) {
    alert(`${notifications.length} notification(s) deleted!`)
  }
}

const handleMarkAllRead = () => {
  console.log('Mark All Read clicked')
  alert('All notifications marked as read!')
}

const handleSavePreferences = () => {
  console.log('Save Preferences clicked')
  alert('Notification preferences saved successfully!')
}

const handleCreateTemplate = () => {
  console.log('Create Template clicked')
  alert('Create Template functionality would open template creation dialog')
}

const handleEditTemplate = (template: any) => {
  console.log('Edit Template clicked:', template)
  alert(`Editing template: ${template.name}`)
}

const handleTestTemplate = (template: any) => {
  console.log('Test Template clicked:', template)
  alert(`Testing template: ${template.name}`)
}
</script>
