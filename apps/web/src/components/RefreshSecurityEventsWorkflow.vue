<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Refresh Security Events</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Current Status -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Current Status</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-600">Last Refresh:</span>
                <span class="text-blue-900">{{ lastRefresh }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-600">Total Events:</span>
                <span class="text-blue-900">{{ totalEvents }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-600">Pending Analysis:</span>
                <span class="text-blue-900">{{ pendingAnalysis }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-600">Data Sources:</span>
                <span class="text-blue-900">{{ activeSources }} active</span>
              </div>
            </div>
          </div>

          <!-- Refresh Options -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Refresh Options</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Refresh Scope</label>
              <select
                v-model="formData.refreshScope"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
              >
                <option value="ALL">All Security Events</option>
                <option value="AUTHENTICATION">Authentication Events</option>
                <option value="ACCESS_CONTROL">Access Control Events</option>
                <option value="DATA_ACCESS">Data Access Events</option>
                <option value="SYSTEM_EVENTS">System Events</option>
                <option value="NETWORK_EVENTS">Network Events</option>
                <option value="COMPLIANCE_EVENTS">Compliance Events</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                v-model="formData.timeRange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
              >
                <option value="LAST_HOUR">Last Hour</option>
                <option value="LAST_24_HOURS">Last 24 Hours</option>
                <option value="LAST_7_DAYS">Last 7 Days</option>
                <option value="LAST_30_DAYS">Last 30 Days</option>
                <option value="CUSTOM">Custom Range</option>
              </select>
            </div>

            <div v-if="formData.timeRange === 'CUSTOM'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  v-model="formData.fromDate"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  v-model="formData.toDate"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                v-model="formData.priorityLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
              >
                <option value="ALL">All Priority Levels</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High and Critical</option>
                <option value="MEDIUM_AND_ABOVE">Medium and Above</option>
                <option value="LOW_AND_ABOVE">All Levels</option>
              </select>
            </div>
          </div>

          <!-- Data Sources -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Data Sources</h3>
            <div class="space-y-3">
              <div v-for="source in dataSources" :key="source.id" class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    v-model="formData.selectedSources"
                    :value="source.id"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">{{ source.name }}</label>
                    <p class="text-xs text-gray-500">{{ source.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="source.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'" class="text-xs">
                    {{ source.status }}
                  </span>
                  <span class="text-xs text-gray-500">{{ source.lastUpdate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Options -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Advanced Options</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                  v-model="formData.forceRefresh"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Force refresh (ignore cache)</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeArchived"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include archived events</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.runAnalysis"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Run threat analysis after refresh</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.updateDashboard"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Update dashboard visualizations</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.sendNotifications"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Send notifications for new critical events</label>
              </div>
            </div>
          </div>

          <!-- Performance Settings -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Performance Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Processing Priority</label>
                <select
                  v-model="formData.processingPriority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="LOW">Low (Background processing)</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High (Expedited processing)</option>
                  <option value="URGENT">Urgent (Immediate processing)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
                <select
                  v-model="formData.batchSize"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="SMALL">Small (100 events)</option>
                  <option value="MEDIUM">Medium (500 events)</option>
                  <option value="LARGE">Large (1000 events)</option>
                  <option value="XLARGE">Extra Large (2500 events)</option>
                </select>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.enableParallelProcessing"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Enable parallel processing</label>
              </div>
            </div>
          </div>

          <!-- Estimated Impact -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-yellow-800 mb-2">Estimated Impact</h3>
            <div class="space-y-1 text-sm text-yellow-700">
              <p><strong>Processing Time:</strong> {{ estimatedProcessingTime }}</p>
              <p><strong>Events to Process:</strong> {{ estimatedEventCount }}</p>
              <p><strong>System Load:</strong> {{ estimatedSystemLoad }}</p>
              <p><strong>Expected Completion:</strong> {{ estimatedCompletion }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            @click="close"
            class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            @click="handleRefresh"
            :disabled="!canRefresh"
            :class="[
              'px-4 py-2 rounded-lg transition-all duration-300 flex items-center',
              canRefresh
                ? 'bg-gradient-to-r from-brand-orange to-brand-magenta text-white hover:from-brand-orange/90 hover:to-brand-magenta/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <RefreshCw class="h-4 w-4 mr-2" />
            Start Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, RefreshCw } from 'lucide-vue-next'

interface RefreshConfig {
  refreshScope: string
  timeRange: string
  fromDate: string
  toDate: string
  priorityLevel: string
  selectedSources: string[]
  forceRefresh: boolean
  includeArchived: boolean
  runAnalysis: boolean
  updateDashboard: boolean
  sendNotifications: boolean
  processingPriority: string
  batchSize: string
  enableParallelProcessing: boolean
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  refresh: [data: RefreshConfig]
}>()

// Current status data
const lastRefresh = ref('2 hours ago')
const totalEvents = ref('15,247')
const pendingAnalysis = ref('342')
const activeSources = ref('8')

const dataSources = ref([
  {
    id: 'auth_logs',
    name: 'Authentication Logs',
    description: 'User login/logout events',
    status: 'ACTIVE',
    lastUpdate: '1 min ago'
  },
  {
    id: 'access_logs',
    name: 'Access Control Logs',
    description: 'Resource access events',
    status: 'ACTIVE',
    lastUpdate: '2 min ago'
  },
  {
    id: 'network_logs',
    name: 'Network Security Logs',
    description: 'Firewall and network events',
    status: 'ACTIVE',
    lastUpdate: '5 min ago'
  },
  {
    id: 'system_logs',
    name: 'System Logs',
    description: 'System and application events',
    status: 'ACTIVE',
    lastUpdate: '3 min ago'
  },
  {
    id: 'compliance_logs',
    name: 'Compliance Logs',
    description: 'Regulatory compliance events',
    status: 'ACTIVE',
    lastUpdate: '10 min ago'
  },
  {
    id: 'threat_intel',
    name: 'Threat Intelligence',
    description: 'External threat intelligence feeds',
    status: 'MAINTENANCE',
    lastUpdate: '1 hour ago'
  }
])

const formData = reactive<RefreshConfig>({
  refreshScope: 'ALL',
  timeRange: 'LAST_24_HOURS',
  fromDate: '',
  toDate: '',
  priorityLevel: 'ALL',
  selectedSources: ['auth_logs', 'access_logs', 'network_logs', 'system_logs', 'compliance_logs'],
  forceRefresh: false,
  includeArchived: false,
  runAnalysis: true,
  updateDashboard: true,
  sendNotifications: true,
  processingPriority: 'NORMAL',
  batchSize: 'MEDIUM',
  enableParallelProcessing: true
})

const canRefresh = computed(() => {
  return formData.selectedSources.length > 0 &&
         (formData.timeRange !== 'CUSTOM' || (formData.fromDate && formData.toDate))
})

const estimatedProcessingTime = computed(() => {
  const baseTime = formData.selectedSources.length * 2 // 2 minutes per source
  const priorityMultiplier = {
    LOW: 2,
    NORMAL: 1,
    HIGH: 0.7,
    URGENT: 0.5
  }[formData.processingPriority] || 1
  
  const parallelDivider = formData.enableParallelProcessing ? 2 : 1
  const totalMinutes = Math.round((baseTime * priorityMultiplier) / parallelDivider)
  
  return `${totalMinutes} minutes`
})

const estimatedEventCount = computed(() => {
  const baseCount = formData.selectedSources.length * 1000
  const timeMultiplier = {
    LAST_HOUR: 0.1,
    LAST_24_HOURS: 1,
    LAST_7_DAYS: 7,
    LAST_30_DAYS: 30,
    CUSTOM: 1
  }[formData.timeRange] || 1
  
  return Math.round(baseCount * timeMultiplier).toLocaleString()
})

const estimatedSystemLoad = computed(() => {
  const load = formData.processingPriority === 'URGENT' ? 'High' : 
              formData.processingPriority === 'HIGH' ? 'Medium-High' :
              formData.processingPriority === 'LOW' ? 'Low' : 'Medium'
  
  return formData.enableParallelProcessing ? `${load} (Parallel)` : load
})

const estimatedCompletion = computed(() => {
  const now = new Date()
  const processingMinutes = parseInt(estimatedProcessingTime.value)
  const completionTime = new Date(now.getTime() + processingMinutes * 60000)
  
  return completionTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const handleRefresh = () => {
  const refreshData = {
    ...formData,
    id: Date.now().toString(),
    requestedAt: new Date().toISOString(),
    estimatedProcessingTime: estimatedProcessingTime.value,
    estimatedEventCount: estimatedEventCount.value,
    estimatedCompletion: estimatedCompletion.value
  }
  emit('refresh', refreshData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    refreshScope: 'ALL',
    timeRange: 'LAST_24_HOURS',
    fromDate: '',
    toDate: '',
    priorityLevel: 'ALL',
    selectedSources: ['auth_logs', 'access_logs', 'network_logs', 'system_logs', 'compliance_logs'],
    forceRefresh: false,
    includeArchived: false,
    runAnalysis: true,
    updateDashboard: true,
    sendNotifications: true,
    processingPriority: 'NORMAL',
    batchSize: 'MEDIUM',
    enableParallelProcessing: true
  })
  emit('close')
}
</script>
