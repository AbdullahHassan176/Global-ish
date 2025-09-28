<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Refresh Data</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Refresh Options -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Select Data to Refresh</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.refreshShipments"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Shipments</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="formData.refreshContainers"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Containers</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="formData.refreshCosts"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Costs</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="formData.refreshAlerts"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Alerts</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="formData.refreshIntegrations"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Integrations</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="formData.refreshAll"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    @change="handleSelectAll"
                  />
                  <label class="ml-2 text-sm text-gray-700 font-medium">Refresh All Data</label>
                </div>
              </div>
            </div>

            <!-- Refresh Scope -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Refresh Scope</h3>
              <div class="space-y-4">
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
                    <option value="ALL">All Data</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Refresh Type</label>
                  <select
                    v-model="formData.refreshType"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="INCREMENTAL">Incremental (New/Updated Only)</option>
                    <option value="FULL">Full Refresh</option>
                    <option value="FORCE">Force Refresh (Overwrite All)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Advanced Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Advanced Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.includeArchived"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Include Archived Data</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.updateTimestamps"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Update Timestamps</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.validateData"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Validate Data Integrity</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.sendNotifications"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send Notifications</label>
                </div>
              </div>
            </div>

            <!-- Refresh Schedule -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Refresh Schedule</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.scheduleRefresh"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Schedule Automatic Refresh</label>
                </div>

                <div v-if="formData.scheduleRefresh" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select
                      v-model="formData.refreshFrequency"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="HOURLY">Hourly</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      v-model="formData.refreshTime"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Refresh Status -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Refresh Status</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Last Refresh:</span>
                    <span class="text-sm font-medium text-gray-900">{{ lastRefresh }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Next Scheduled:</span>
                    <span class="text-sm font-medium text-gray-900">{{ nextScheduled }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Total Records:</span>
                    <span class="text-sm font-medium text-gray-900">{{ totalRecords }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Refresh Progress -->
            <div v-if="isRefreshing" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Refresh Progress</h3>
              <div class="space-y-4">
                <div class="bg-gray-200 rounded-full h-2">
                  <div class="bg-brand-teal h-2 rounded-full transition-all duration-300" :style="{ width: `${refreshProgress}%` }"></div>
                </div>
                <div class="text-center">
                  <span class="text-sm text-gray-600">{{ refreshProgress }}% Complete</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              :disabled="isRefreshing"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isRefreshing ? 'Refreshing...' : 'Start Refresh' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'

interface RefreshConfig {
  refreshShipments: boolean
  refreshContainers: boolean
  refreshCosts: boolean
  refreshAlerts: boolean
  refreshIntegrations: boolean
  refreshAll: boolean
  timeRange: string
  refreshType: string
  includeArchived: boolean
  updateTimestamps: boolean
  validateData: boolean
  sendNotifications: boolean
  scheduleRefresh: boolean
  refreshFrequency: string
  refreshTime: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: RefreshConfig]
  saveDraft: [data: RefreshConfig]
}>()

const isRefreshing = ref(false)
const refreshProgress = ref(0)
const lastRefresh = ref('2 minutes ago')
const nextScheduled = ref('Tomorrow at 2:00 AM')
const totalRecords = ref('15,847')

const formData = reactive<RefreshConfig>({
  refreshShipments: true,
  refreshContainers: true,
  refreshCosts: true,
  refreshAlerts: true,
  refreshIntegrations: true,
  refreshAll: false,
  timeRange: 'LAST_24_HOURS',
  refreshType: 'INCREMENTAL',
  includeArchived: false,
  updateTimestamps: true,
  validateData: true,
  sendNotifications: true,
  scheduleRefresh: false,
  refreshFrequency: 'DAILY',
  refreshTime: '02:00'
})

const handleSelectAll = () => {
  if (formData.refreshAll) {
    formData.refreshShipments = true
    formData.refreshContainers = true
    formData.refreshCosts = true
    formData.refreshAlerts = true
    formData.refreshIntegrations = true
  } else {
    formData.refreshShipments = false
    formData.refreshContainers = false
    formData.refreshCosts = false
    formData.refreshAlerts = false
    formData.refreshIntegrations = false
  }
}

const handleSubmit = () => {
  isRefreshing.value = true
  refreshProgress.value = 0
  
  // Simulate refresh progress
  const interval = setInterval(() => {
    refreshProgress.value += 10
    if (refreshProgress.value >= 100) {
      clearInterval(interval)
      isRefreshing.value = false
      refreshProgress.value = 0
    }
  }, 200)

  const refreshData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', refreshData)
}

const handleSaveDraft = () => {
  const refreshData = {
    ...formData,
    id: Date.now().toString(),
    status: 'DRAFT'
  }
  emit('saveDraft', refreshData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    refreshShipments: true,
    refreshContainers: true,
    refreshCosts: true,
    refreshAlerts: true,
    refreshIntegrations: true,
    refreshAll: false,
    timeRange: 'LAST_24_HOURS',
    refreshType: 'INCREMENTAL',
    includeArchived: false,
    updateTimestamps: true,
    validateData: true,
    sendNotifications: true,
    scheduleRefresh: false,
    refreshFrequency: 'DAILY',
    refreshTime: '02:00'
  })
  isRefreshing.value = false
  refreshProgress.value = 0
  emit('close')
}
</script>
