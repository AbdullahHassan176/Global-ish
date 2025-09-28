<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Session Information</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Session Overview -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Session Overview</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Device Name:</span>
                  <span class="font-medium">{{ sessionDeviceName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Device Type:</span>
                  <span class="font-medium">{{ sessionDeviceType }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Browser:</span>
                  <span class="font-medium">{{ sessionBrowser }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Operating System:</span>
                  <span class="font-medium">{{ sessionOs }}</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">IP Address:</span>
                  <span class="font-medium">{{ sessionIpAddress }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Location:</span>
                  <span class="font-medium">{{ sessionLocation }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span :class="sessionIsCurrent ? 'text-green-600' : 'text-blue-600'" class="font-medium">
                    {{ sessionIsCurrent ? 'Current' : 'Active' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Trusted:</span>
                  <span :class="sessionIsTrusted ? 'text-green-600' : 'text-yellow-600'" class="font-medium">
                    {{ sessionIsTrusted ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Session Details -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Session Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Timing Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Created:</span>
                    <span class="text-gray-900">{{ sessionCreatedAt }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Last Activity:</span>
                    <span class="text-gray-900">{{ sessionLastActivity }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Expires:</span>
                    <span class="text-gray-900">{{ sessionExpiresAt }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Duration:</span>
                    <span class="text-gray-900">{{ sessionDuration }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-2">Security Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Authentication Method:</span>
                    <span class="text-gray-900">{{ sessionAuthMethod }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">MFA Enabled:</span>
                    <span class="text-gray-900">{{ sessionMfaEnabled ? 'Yes' : 'No' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Session ID:</span>
                    <span class="text-gray-900 font-mono text-xs">{{ sessionId }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">User Agent:</span>
                    <span class="text-gray-900 text-xs">{{ sessionUserAgent }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Log -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div
                v-for="activity in sessionActivities"
                :key="activity.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div :class="`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
                    <p class="text-xs text-gray-500">{{ activity.description }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Recommendations -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Security Recommendations</h3>
            <div class="space-y-3">
              <div
                v-for="recommendation in securityRecommendations"
                :key="recommendation.id"
                class="flex items-start space-x-3 p-3 border rounded-lg"
                :class="recommendation.severity === 'HIGH' ? 'border-red-200 bg-red-50' : recommendation.severity === 'MEDIUM' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'"
              >
                <div :class="`w-2 h-2 rounded-full mt-2 ${getRecommendationColor(recommendation.severity)}`"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ recommendation.title }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ recommendation.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Available Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                @click="handleRevoke"
                class="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                <LogOut class="h-4 w-4 mr-2" />
                Revoke Session
              </button>
              <button
                @click="handleTrust"
                class="px-4 py-2 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                <Shield class="h-4 w-4 mr-2" />
                {{ sessionIsTrusted ? 'Untrust Device' : 'Trust Device' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            @click="close"
            class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, LogOut, Shield } from 'lucide-vue-next'

interface Activity {
  id: string
  type: string
  action: string
  description: string
  timestamp: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  severity: string
}

const props = defineProps<{
  isOpen: boolean
  sessionDeviceName?: string
  sessionDeviceType?: string
  sessionBrowser?: string
  sessionOs?: string
  sessionIpAddress?: string
  sessionLocation?: string
  sessionIsCurrent?: boolean
  sessionIsTrusted?: boolean
  sessionCreatedAt?: string
  sessionLastActivity?: string
  sessionExpiresAt?: string
  sessionDuration?: string
  sessionAuthMethod?: string
  sessionMfaEnabled?: boolean
  sessionId?: string
  sessionUserAgent?: string
}>()

const emit = defineEmits<{
  close: []
  revoke: []
  trust: []
}>()

const sessionActivities = ref<Activity[]>([
  {
    id: '1',
    type: 'LOGIN',
    action: 'User logged in',
    description: 'Successful authentication',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'PAGE_VIEW',
    action: 'Viewed dashboard',
    description: 'Accessed main dashboard',
    timestamp: '1 hour ago'
  },
  {
    id: '3',
    type: 'ACTION',
    action: 'Updated profile',
    description: 'Modified user profile information',
    timestamp: '30 minutes ago'
  },
  {
    id: '4',
    type: 'PAGE_VIEW',
    action: 'Viewed security settings',
    description: 'Accessed security dashboard',
    timestamp: '5 minutes ago'
  }
])

const securityRecommendations = ref<Recommendation[]>([
  {
    id: '1',
    title: 'Enable Two-Factor Authentication',
    description: 'Add an extra layer of security to your account',
    severity: 'HIGH'
  },
  {
    id: '2',
    title: 'Update Browser',
    description: 'Your browser version is outdated and may have security vulnerabilities',
    severity: 'MEDIUM'
  },
  {
    id: '3',
    title: 'Use HTTPS',
    description: 'Ensure all connections are encrypted',
    severity: 'LOW'
  }
])

const getActivityColor = (type: string) => {
  const colors = {
    LOGIN: 'bg-green-500',
    LOGOUT: 'bg-red-500',
    PAGE_VIEW: 'bg-blue-500',
    ACTION: 'bg-purple-500',
    ERROR: 'bg-red-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getRecommendationColor = (severity: string) => {
  const colors = {
    HIGH: 'bg-red-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-blue-500'
  }
  return colors[severity] || 'bg-gray-500'
}

const handleRevoke = () => {
  emit('revoke')
}

const handleTrust = () => {
  emit('trust')
}

const close = () => {
  emit('close')
}
</script>
