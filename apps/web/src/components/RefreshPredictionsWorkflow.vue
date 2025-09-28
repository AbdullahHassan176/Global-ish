<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Refresh Predictions</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Refresh Information -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <RefreshCw class="h-5 w-5 text-blue-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Prediction Refresh</h3>
                <p class="mt-1 text-sm text-blue-700">
                  This will refresh all predictive models with the latest data and recalculate predictions.
                </p>
              </div>
            </div>
          </div>

          <!-- Prediction Types -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Prediction Types to Refresh</h3>
            <div class="space-y-4">
              <div
                v-for="predictionType in predictionTypes"
                :key="predictionType.id"
                class="flex items-center justify-between p-4 border rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="formData.selectedTypes"
                    :value="predictionType.id"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <div>
                    <h4 class="font-medium text-gray-900">{{ predictionType.name }}</h4>
                    <p class="text-sm text-gray-500">{{ predictionType.description }}</p>
                    <p class="text-xs text-gray-400">{{ predictionType.modelCount }} models</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Last updated</p>
                  <p class="text-xs text-gray-400">{{ predictionType.lastUpdated }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Refresh Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Refresh Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Refresh Method</label>
                <select
                  v-model="formData.refreshMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="INCREMENTAL">Incremental (Update with new data only)</option>
                  <option value="FULL">Full Refresh (Rebuild all models)</option>
                  <option value="VALIDATION">Validation (Test model accuracy)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Data Range</label>
                <select
                  v-model="formData.dataRange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="LAST_30_DAYS">Last 30 Days</option>
                  <option value="LAST_90_DAYS">Last 90 Days</option>
                  <option value="LAST_YEAR">Last Year</option>
                  <option value="ALL_HISTORICAL">All Historical Data</option>
                </select>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeRealTimeData"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include real-time data streams</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.forceRetraining"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Force model retraining</label>
              </div>
            </div>
          </div>

          <!-- Model Configuration -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Model Configuration</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Model Accuracy Threshold</label>
                <select
                  v-model="formData.accuracyThreshold"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="0.8">80% (Standard)</option>
                  <option value="0.85">85% (High)</option>
                  <option value="0.9">90% (Very High)</option>
                  <option value="0.95">95% (Maximum)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prediction Horizon</label>
                <select
                  v-model="formData.predictionHorizon"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="7_DAYS">7 Days</option>
                  <option value="30_DAYS">30 Days</option>
                  <option value="90_DAYS">90 Days</option>
                  <option value="180_DAYS">180 Days</option>
                </select>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.enableEnsemble"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Enable ensemble learning</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.enableCrossValidation"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Enable cross-validation</label>
              </div>
            </div>
          </div>

          <!-- Notification Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Options</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.sendNotification"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Send notification when refresh is complete</label>
              </div>

              <div v-if="formData.sendNotification">
                <label class="block text-sm font-medium text-gray-700 mb-2">Notification Recipients</label>
                <input
                  v-model="formData.notificationRecipients"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter email addresses (comma-separated)"
                />
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeAccuracyReport"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include accuracy report in notification</label>
              </div>
            </div>
          </div>

          <!-- Processing Information -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Processing Information</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Estimated Processing Time</p>
                  <p class="text-lg font-bold text-gray-900">{{ estimatedProcessingTime }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Models to Refresh</p>
                  <p class="text-lg font-bold text-gray-900">{{ selectedModelCount }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Data Points</p>
                  <p class="text-lg font-bold text-gray-900">{{ estimatedDataPoints }}</p>
                </div>
              </div>
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
            class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refresh Predictions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, RefreshCw } from 'lucide-vue-next'

interface PredictionType {
  id: string
  name: string
  description: string
  modelCount: number
  lastUpdated: string
}

interface RefreshConfig {
  selectedTypes: string[]
  refreshMethod: string
  dataRange: string
  includeRealTimeData: boolean
  forceRetraining: boolean
  accuracyThreshold: string
  predictionHorizon: string
  enableEnsemble: boolean
  enableCrossValidation: boolean
  sendNotification: boolean
  notificationRecipients: string
  includeAccuracyReport: boolean
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  refresh: [data: RefreshConfig]
}>()

const predictionTypes = ref<PredictionType[]>([
  {
    id: 'ETA_PREDICTIONS',
    name: 'ETA Predictions',
    description: 'Estimated time of arrival for shipments',
    modelCount: 3,
    lastUpdated: '2 hours ago'
  },
  {
    id: 'HS_CODE_SUGGESTIONS',
    name: 'HS Code Suggestions',
    description: 'Harmonized System code recommendations',
    modelCount: 2,
    lastUpdated: '1 day ago'
  },
  {
    id: 'DEMURRAGE_RISK',
    name: 'Demurrage Risk Analysis',
    description: 'Risk assessment for demurrage costs',
    modelCount: 4,
    lastUpdated: '3 hours ago'
  },
  {
    id: 'DEMAND_FORECASTING',
    name: 'Demand Forecasting',
    description: 'Predictive demand analysis',
    modelCount: 2,
    lastUpdated: '6 hours ago'
  },
  {
    id: 'PRICE_PREDICTIONS',
    name: 'Price Predictions',
    description: 'Market price forecasting',
    modelCount: 3,
    lastUpdated: '4 hours ago'
  }
])

const formData = reactive<RefreshConfig>({
  selectedTypes: ['ETA_PREDICTIONS', 'HS_CODE_SUGGESTIONS', 'DEMURRAGE_RISK'],
  refreshMethod: 'INCREMENTAL',
  dataRange: 'LAST_30_DAYS',
  includeRealTimeData: true,
  forceRetraining: false,
  accuracyThreshold: '0.85',
  predictionHorizon: '30_DAYS',
  enableEnsemble: true,
  enableCrossValidation: true,
  sendNotification: true,
  notificationRecipients: '',
  includeAccuracyReport: true
})

const canRefresh = computed(() => {
  return formData.selectedTypes.length > 0 &&
         (!formData.sendNotification || formData.notificationRecipients)
})

const selectedModelCount = computed(() => {
  return formData.selectedTypes.reduce((total, typeId) => {
    const type = predictionTypes.value.find(t => t.id === typeId)
    return total + (type?.modelCount || 0)
  }, 0)
})

const estimatedProcessingTime = computed(() => {
  const baseTime = 10 // minutes
  const modelMultiplier = selectedModelCount.value * 3
  const methodMultiplier = formData.refreshMethod === 'FULL' ? 5 : 0
  return `${baseTime + modelMultiplier + methodMultiplier} minutes`
})

const estimatedDataPoints = computed(() => {
  const basePoints = 5000
  const typeMultiplier = formData.selectedTypes.length * 2000
  const rangeMultiplier = formData.dataRange === 'ALL_HISTORICAL' ? 10000 : 0
  return (basePoints + typeMultiplier + rangeMultiplier).toLocaleString()
})

const handleRefresh = () => {
  const refreshData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('refresh', refreshData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    selectedTypes: ['ETA_PREDICTIONS', 'HS_CODE_SUGGESTIONS', 'DEMURRAGE_RISK'],
    refreshMethod: 'INCREMENTAL',
    dataRange: 'LAST_30_DAYS',
    includeRealTimeData: true,
    forceRetraining: false,
    accuracyThreshold: '0.85',
    predictionHorizon: '30_DAYS',
    enableEnsemble: true,
    enableCrossValidation: true,
    sendNotification: true,
    notificationRecipients: '',
    includeAccuracyReport: true
  })
  emit('close')
}
</script>
