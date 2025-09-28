<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Calculate KPIs</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Calculation Period -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Calendar class="h-5 w-5 text-blue-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Calculation Period</h3>
                <p class="mt-1 text-sm text-blue-700">
                  Select the time period for KPI calculation. This will recalculate all metrics for the specified period.
                </p>
              </div>
            </div>
          </div>

          <!-- Period Selection -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Period Selection</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  v-model="formData.endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
            </div>
          </div>

          <!-- KPI Categories -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">KPI Categories to Calculate</h3>
            <div class="space-y-4">
              <div
                v-for="category in kpiCategories"
                :key="category.id"
                class="flex items-center justify-between p-4 border rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="formData.selectedCategories"
                    :value="category.id"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <div>
                    <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                    <p class="text-sm text-gray-500">{{ category.description }}</p>
                    <p class="text-xs text-gray-400">{{ category.metricCount }} metrics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calculation Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Calculation Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Calculation Method</label>
                <select
                  v-model="formData.calculationMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="STANDARD">Standard (Real-time data)</option>
                  <option value="BATCH">Batch (Historical data)</option>
                  <option value="HYBRID">Hybrid (Combined approach)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Data Sources</label>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input
                      v-model="formData.includeLogisticsData"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include Logistics Data</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="formData.includeConsultingData"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include Consulting Data</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="formData.includeFinancialData"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include Financial Data</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="formData.includeComplianceData"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include Compliance Data</label>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Calculation Priority</label>
                <select
                  v-model="formData.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="LOW">Low (Background processing)</option>
                  <option value="NORMAL">Normal (Standard processing)</option>
                  <option value="HIGH">High (Priority processing)</option>
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
                  v-model="formData.includeTrends"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include trend analysis</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeBenchmarks"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include industry benchmarks</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeForecasts"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include predictive forecasts</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeAlerts"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Generate alerts for threshold breaches</label>
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
                <label class="ml-2 text-sm text-gray-700">Send notification when calculation is complete</label>
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                <select
                  v-model="formData.reportFormat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="DASHBOARD">Dashboard View</option>
                  <option value="PDF">PDF Report</option>
                  <option value="EXCEL">Excel Spreadsheet</option>
                  <option value="JSON">JSON Data</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Estimated Processing Time -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Processing Information</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Estimated Processing Time</p>
                  <p class="text-lg font-bold text-gray-900">{{ estimatedProcessingTime }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Data Points to Process</p>
                  <p class="text-lg font-bold text-gray-900">{{ estimatedDataPoints }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">KPIs to Calculate</p>
                  <p class="text-lg font-bold text-gray-900">{{ selectedKpiCount }}</p>
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
            @click="handleCalculate"
            :disabled="!canCalculate"
            class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate KPIs
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, Calendar } from 'lucide-vue-next'

interface KPICategory {
  id: string
  name: string
  description: string
  metricCount: number
}

interface CalculationConfig {
  startDate: string
  endDate: string
  selectedCategories: string[]
  calculationMethod: string
  includeLogisticsData: boolean
  includeConsultingData: boolean
  includeFinancialData: boolean
  includeComplianceData: boolean
  priority: string
  includeTrends: boolean
  includeBenchmarks: boolean
  includeForecasts: boolean
  includeAlerts: boolean
  sendNotification: boolean
  notificationRecipients: string
  reportFormat: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  calculate: [data: CalculationConfig]
}>()

const kpiCategories = ref<KPICategory[]>([
  {
    id: 'logistics',
    name: 'Logistics KPIs',
    description: 'Shipping, delivery, and logistics performance metrics',
    metricCount: 12
  },
  {
    id: 'consulting',
    name: 'Consulting KPIs',
    description: 'Team utilization, billability, and project metrics',
    metricCount: 8
  },
  {
    id: 'financial',
    name: 'Financial KPIs',
    description: 'Revenue, costs, profitability, and financial performance',
    metricCount: 15
  },
  {
    id: 'compliance',
    name: 'Compliance KPIs',
    description: 'Regulatory compliance, audit scores, and risk metrics',
    metricCount: 6
  },
  {
    id: 'operational',
    name: 'Operational KPIs',
    description: 'Process efficiency, quality, and operational metrics',
    metricCount: 10
  }
])

const formData = reactive<CalculationConfig>({
  startDate: '',
  endDate: '',
  selectedCategories: ['logistics', 'consulting'],
  calculationMethod: 'STANDARD',
  includeLogisticsData: true,
  includeConsultingData: true,
  includeFinancialData: false,
  includeComplianceData: false,
  priority: 'NORMAL',
  includeTrends: true,
  includeBenchmarks: false,
  includeForecasts: false,
  includeAlerts: true,
  sendNotification: true,
  notificationRecipients: '',
  reportFormat: 'DASHBOARD'
})

const canCalculate = computed(() => {
  return formData.startDate && 
         formData.endDate && 
         formData.selectedCategories.length > 0 &&
         (!formData.sendNotification || formData.notificationRecipients)
})

const selectedKpiCount = computed(() => {
  return formData.selectedCategories.reduce((total, categoryId) => {
    const category = kpiCategories.value.find(c => c.id === categoryId)
    return total + (category?.metricCount || 0)
  }, 0)
})

const estimatedProcessingTime = computed(() => {
  const baseTime = 5 // minutes
  const categoryMultiplier = formData.selectedCategories.length * 2
  const dataMultiplier = (formData.includeLogisticsData ? 1 : 0) + 
                        (formData.includeConsultingData ? 1 : 0) + 
                        (formData.includeFinancialData ? 1 : 0) + 
                        (formData.includeComplianceData ? 1 : 0)
  return `${baseTime + categoryMultiplier + dataMultiplier} minutes`
})

const estimatedDataPoints = computed(() => {
  const basePoints = 1000
  const categoryMultiplier = formData.selectedCategories.length * 500
  const dataMultiplier = (formData.includeLogisticsData ? 1 : 0) + 
                        (formData.includeConsultingData ? 1 : 0) + 
                        (formData.includeFinancialData ? 1 : 0) + 
                        (formData.includeComplianceData ? 1 : 0)
  return (basePoints + categoryMultiplier + dataMultiplier * 200).toLocaleString()
})

const handleCalculate = () => {
  const calculationData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('calculate', calculationData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    startDate: '',
    endDate: '',
    selectedCategories: ['logistics', 'consulting'],
    calculationMethod: 'STANDARD',
    includeLogisticsData: true,
    includeConsultingData: true,
    includeFinancialData: false,
    includeComplianceData: false,
    priority: 'NORMAL',
    includeTrends: true,
    includeBenchmarks: false,
    includeForecasts: false,
    includeAlerts: true,
    sendNotification: true,
    notificationRecipients: '',
    reportFormat: 'DASHBOARD'
  })
  emit('close')
}
</script>
