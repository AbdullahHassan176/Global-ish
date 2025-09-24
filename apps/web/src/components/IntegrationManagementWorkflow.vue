<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="close"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                {{ integration?.platform }} Integration Management
              </h3>
              <p class="text-sm text-gray-600">Manage and configure your {{ integration?.platform }} integration</p>
            </div>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-6">
          <!-- Integration Status -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Integration Status</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <CheckCircle class="h-5 w-5 text-green-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Status</p>
                    <p class="text-lg font-bold text-green-900">{{ integration?.status || 'ACTIVE' }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <User class="h-5 w-5 text-blue-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Account</p>
                    <p class="text-lg font-bold text-blue-900">{{ integration?.accountName || 'Connected Account' }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-orange-100 rounded-lg">
                    <Clock class="h-5 w-5 text-orange-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Last Sync</p>
                    <p class="text-lg font-bold text-orange-900">{{ integration?.lastSync || '2 hours ago' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connection Settings -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Connection Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="connectionData.apiKey"
                    type="password"
                    placeholder="Enter API key"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button @click="toggleApiKeyVisibility" class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Eye v-if="!showApiKey" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="connectionData.accessToken"
                    type="password"
                    placeholder="Enter access token"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button @click="toggleTokenVisibility" class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Eye v-if="!showToken" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                <input
                  v-model="connectionData.webhookUrl"
                  type="url"
                  placeholder="https://your-domain.com/webhook"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rate Limit (requests/hour)</label>
                <input
                  v-model="connectionData.rateLimit"
                  type="number"
                  placeholder="1000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Publishing Settings -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Publishing Settings</h4>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default Posting Schedule</label>
                  <select
                    v-model="publishingData.schedule"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Auto-approval</label>
                  <select
                    v-model="publishingData.autoApproval"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="conditional">Conditional</option>
                  </select>
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Content Filters</label>
                <div class="space-y-1">
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="publishingData.filters"
                      type="checkbox"
                      value="profanity"
                      class="form-checkbox h-4 w-4 text-green-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Profanity filter</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="publishingData.filters"
                      type="checkbox"
                      value="hashtags"
                      class="form-checkbox h-4 w-4 text-green-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Hashtag validation</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="publishingData.filters"
                      type="checkbox"
                      value="links"
                      class="form-checkbox h-4 w-4 text-green-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Link validation</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="publishingData.filters"
                      type="checkbox"
                      value="media"
                      class="form-checkbox h-4 w-4 text-green-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Media quality check</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics & Monitoring -->
          <div class="bg-orange-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-orange-900 mb-4">Analytics & Monitoring</h4>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Analytics Tracking</label>
                  <select
                    v-model="analyticsData.tracking"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Report Frequency</label>
                  <select
                    v-model="analyticsData.reportFrequency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Tracked Metrics</label>
                <div class="grid grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="analyticsData.metrics"
                      type="checkbox"
                      value="impressions"
                      class="form-checkbox h-4 w-4 text-orange-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Impressions</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="analyticsData.metrics"
                      type="checkbox"
                      value="clicks"
                      class="form-checkbox h-4 w-4 text-orange-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Clicks</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="analyticsData.metrics"
                      type="checkbox"
                      value="engagement"
                      class="form-checkbox h-4 w-4 text-orange-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Engagement</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="analyticsData.metrics"
                      type="checkbox"
                      value="conversions"
                      class="form-checkbox h-4 w-4 text-orange-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Conversions</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                @click="testConnection"
                class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Zap class="h-5 w-5 text-blue-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Test Connection</h5>
                    <p class="text-sm text-gray-600">Verify API connectivity</p>
                  </div>
                </div>
              </button>
              <button
                @click="syncData"
                class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <RefreshCw class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Sync Data</h5>
                    <p class="text-sm text-gray-600">Refresh integration data</p>
                  </div>
                </div>
              </button>
              <button
                @click="viewLogs"
                class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <FileText class="h-5 w-5 text-purple-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">View Logs</h5>
                    <p class="text-sm text-gray-600">Check integration logs</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex items-center justify-end space-x-3">
          <button
            @click="close"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDisconnect"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
          <button
            @click="handleSave"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Settings, CheckCircle, User, Clock, Eye, EyeOff, Zap, RefreshCw, FileText } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  integration?: any
}>()

const emit = defineEmits<{
  close: []
  save: [data: any]
  disconnect: [integration: any]
}>()

const showApiKey = ref(false)
const showToken = ref(false)

const connectionData = ref({
  apiKey: '',
  accessToken: '',
  webhookUrl: '',
  rateLimit: 1000
})

const publishingData = ref({
  schedule: 'scheduled',
  autoApproval: 'disabled',
  filters: [] as string[]
})

const analyticsData = ref({
  tracking: 'enabled',
  reportFrequency: 'weekly',
  metrics: [] as string[]
})

const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value
}

const toggleTokenVisibility = () => {
  showToken.value = !showToken.value
}

const testConnection = () => {
  notify.info('Testing Connection', 'Verifying API connectivity...')
  // Simulate API call
  setTimeout(() => {
    const success = Math.random() > 0.2 // 80% success rate
    if (success) {
      notify.success('Connection Successful', 'API connection verified successfully!')
    } else {
      notify.error('Connection Failed', 'Could not connect to API. Check your credentials.', 0)
    }
  }, 2000)
}

const syncData = () => {
  notify.info('Syncing Data', 'Refreshing integration data...')
  // Simulate sync
  setTimeout(() => {
    notify.success('Data Synced', 'Integration data has been refreshed successfully!')
  }, 1500)
}

const viewLogs = () => {
  notify.info('Viewing Logs', 'Opening integration logs...')
}

const handleDisconnect = () => {
  notify.warning('Disconnect Integration', 'Are you sure you want to disconnect this integration?')
  emit('disconnect', props.integration)
  close()
}

const handleSave = () => {
  notify.success('Settings Saved', 'Integration settings have been saved successfully!')
  emit('save', {
    connection: connectionData.value,
    publishing: publishingData.value,
    analytics: analyticsData.value
  })
  close()
}

const close = () => {
  emit('close')
}
</script>
