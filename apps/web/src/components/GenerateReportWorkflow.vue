<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Generate Report</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Report Type Selection -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <FileText class="h-5 w-5 text-blue-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Report Generation</h3>
                <p class="mt-1 text-sm text-blue-700">
                  Select the type of report you want to generate and configure the parameters.
                </p>
              </div>
            </div>
          </div>

          <!-- Report Type -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Report Type</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="reportType in reportTypes"
                :key="reportType.id"
                class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="formData.selectedReportType === reportType.id ? 'border-brand-teal bg-brand-teal/5' : 'border-gray-200'"
                @click="formData.selectedReportType = reportType.id"
              >
                <input
                  v-model="formData.selectedReportType"
                  :value="reportType.id"
                  type="radio"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                />
                <div class="ml-3">
                  <h4 class="font-medium text-gray-900">{{ reportType.name }}</h4>
                  <p class="text-sm text-gray-500">{{ reportType.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Report Configuration -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Report Configuration</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
                <select
                  v-model="formData.reportPeriod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="LAST_7_DAYS">Last 7 Days</option>
                  <option value="LAST_30_DAYS">Last 30 Days</option>
                  <option value="LAST_QUARTER">Last Quarter</option>
                  <option value="LAST_YEAR">Last Year</option>
                  <option value="CUSTOM">Custom Range</option>
                </select>
              </div>

              <div v-if="formData.reportPeriod === 'CUSTOM'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Custom Date Range</label>
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="formData.startDate"
                    type="date"
                    class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                  <input
                    v-model="formData.endDate"
                    type="date"
                    class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                <select
                  v-model="formData.reportFormat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="EXCEL">Excel Spreadsheet</option>
                  <option value="CSV">CSV Data</option>
                  <option value="JSON">JSON Data</option>
                  <option value="HTML">HTML Report</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Report Template</label>
                <select
                  v-model="formData.reportTemplate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="STANDARD">Standard Template</option>
                  <option value="EXECUTIVE">Executive Summary</option>
                  <option value="DETAILED">Detailed Analysis</option>
                  <option value="CUSTOM">Custom Template</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Data Sources -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Data Sources</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <!-- Report Sections -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Report Sections</h3>
            <div class="space-y-4">
              <div
                v-for="section in reportSections"
                :key="section.id"
                class="flex items-center justify-between p-4 border rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="formData.selectedSections"
                    :value="section.id"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <div>
                    <h4 class="font-medium text-gray-900">{{ section.name }}</h4>
                    <p class="text-sm text-gray-500">{{ section.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Advanced Options</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.includeCharts"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include charts and visualizations</label>
              </div>

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
                  v-model="formData.includeRecommendations"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include recommendations and insights</label>
              </div>
            </div>
          </div>

          <!-- Delivery Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                <select
                  v-model="formData.deliveryMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="DOWNLOAD">Download Now</option>
                  <option value="EMAIL">Email Report</option>
                  <option value="SCHEDULE">Schedule Delivery</option>
                </select>
              </div>

              <div v-if="formData.deliveryMethod === 'EMAIL'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-model="formData.emailAddress"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter email address"
                />
              </div>

              <div v-if="formData.deliveryMethod === 'SCHEDULE'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Schedule Time</label>
                <input
                  v-model="formData.scheduleTime"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
            </div>
          </div>

          <!-- Report Preview -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Estimated Pages</p>
                  <p class="text-lg font-bold text-gray-900">{{ estimatedPages }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Data Points</p>
                  <p class="text-lg font-bold text-gray-900">{{ estimatedDataPoints }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Processing Time</p>
                  <p class="text-lg font-bold text-gray-900">{{ estimatedProcessingTime }}</p>
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
            @click="handleGenerate"
            :disabled="!canGenerate"
            class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, FileText } from 'lucide-vue-next'

interface ReportType {
  id: string
  name: string
  description: string
}

interface ReportSection {
  id: string
  name: string
  description: string
}

interface ReportConfig {
  selectedReportType: string
  reportPeriod: string
  startDate: string
  endDate: string
  reportFormat: string
  reportTemplate: string
  includeLogisticsData: boolean
  includeConsultingData: boolean
  includeFinancialData: boolean
  includeComplianceData: boolean
  selectedSections: string[]
  includeCharts: boolean
  includeTrends: boolean
  includeBenchmarks: boolean
  includeRecommendations: boolean
  deliveryMethod: string
  emailAddress: string
  scheduleTime: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  generate: [data: ReportConfig]
}>()

const reportTypes = ref<ReportType[]>([
  {
    id: 'LOGISTICS_SUMMARY',
    name: 'Logistics Summary',
    description: 'Comprehensive logistics performance report'
  },
  {
    id: 'CONSULTING_UTILIZATION',
    name: 'Consulting Utilization',
    description: 'Consulting team utilization and billability report'
  },
  {
    id: 'COMPLIANCE_STATUS',
    name: 'Compliance Status',
    description: 'Compliance and regulatory status report'
  },
  {
    id: 'FINANCIAL_OVERVIEW',
    name: 'Financial Overview',
    description: 'Financial performance and metrics report'
  },
  {
    id: 'SECURITY_AUDIT',
    name: 'Security Audit',
    description: 'Security events and compliance report'
  },
  {
    id: 'CUSTOM_DASHBOARD',
    name: 'Custom Dashboard',
    description: 'Customizable dashboard report'
  }
])

const reportSections = ref<ReportSection[]>([
  {
    id: 'EXECUTIVE_SUMMARY',
    name: 'Executive Summary',
    description: 'High-level overview and key metrics'
  },
  {
    id: 'KPI_ANALYSIS',
    name: 'KPI Analysis',
    description: 'Detailed analysis of key performance indicators'
  },
  {
    id: 'TREND_ANALYSIS',
    name: 'Trend Analysis',
    description: 'Historical trends and pattern analysis'
  },
  {
    id: 'BENCHMARK_COMPARISON',
    name: 'Benchmark Comparison',
    description: 'Comparison with industry benchmarks'
  },
  {
    id: 'RECOMMENDATIONS',
    name: 'Recommendations',
    description: 'Actionable insights and recommendations'
  },
  {
    id: 'APPENDICES',
    name: 'Appendices',
    description: 'Supporting data and detailed tables'
  }
])

const formData = reactive<ReportConfig>({
  selectedReportType: 'LOGISTICS_SUMMARY',
  reportPeriod: 'LAST_30_DAYS',
  startDate: '',
  endDate: '',
  reportFormat: 'PDF',
  reportTemplate: 'STANDARD',
  includeLogisticsData: true,
  includeConsultingData: false,
  includeFinancialData: false,
  includeComplianceData: false,
  selectedSections: ['EXECUTIVE_SUMMARY', 'KPI_ANALYSIS'],
  includeCharts: true,
  includeTrends: true,
  includeBenchmarks: false,
  includeRecommendations: true,
  deliveryMethod: 'DOWNLOAD',
  emailAddress: '',
  scheduleTime: ''
})

const canGenerate = computed(() => {
  return formData.selectedReportType &&
         formData.selectedSections.length > 0 &&
         (formData.deliveryMethod !== 'EMAIL' || formData.emailAddress) &&
         (formData.deliveryMethod !== 'SCHEDULE' || formData.scheduleTime)
})

const estimatedPages = computed(() => {
  const basePages = 10
  const sectionMultiplier = formData.selectedSections.length * 2
  const dataMultiplier = (formData.includeLogisticsData ? 1 : 0) + 
                        (formData.includeConsultingData ? 1 : 0) + 
                        (formData.includeFinancialData ? 1 : 0) + 
                        (formData.includeComplianceData ? 1 : 0)
  return basePages + sectionMultiplier + dataMultiplier
})

const estimatedDataPoints = computed(() => {
  const basePoints = 500
  const sectionMultiplier = formData.selectedSections.length * 100
  const dataMultiplier = (formData.includeLogisticsData ? 1 : 0) + 
                        (formData.includeConsultingData ? 1 : 0) + 
                        (formData.includeFinancialData ? 1 : 0) + 
                        (formData.includeComplianceData ? 1 : 0)
  return (basePoints + sectionMultiplier + dataMultiplier * 200).toLocaleString()
})

const estimatedProcessingTime = computed(() => {
  const baseTime = 3 // minutes
  const sectionMultiplier = formData.selectedSections.length * 1
  const dataMultiplier = (formData.includeLogisticsData ? 1 : 0) + 
                        (formData.includeConsultingData ? 1 : 0) + 
                        (formData.includeFinancialData ? 1 : 0) + 
                        (formData.includeComplianceData ? 1 : 0)
  return `${baseTime + sectionMultiplier + dataMultiplier} minutes`
})

const handleGenerate = () => {
  const reportData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('generate', reportData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    selectedReportType: 'LOGISTICS_SUMMARY',
    reportPeriod: 'LAST_30_DAYS',
    startDate: '',
    endDate: '',
    reportFormat: 'PDF',
    reportTemplate: 'STANDARD',
    includeLogisticsData: true,
    includeConsultingData: false,
    includeFinancialData: false,
    includeComplianceData: false,
    selectedSections: ['EXECUTIVE_SUMMARY', 'KPI_ANALYSIS'],
    includeCharts: true,
    includeTrends: true,
    includeBenchmarks: false,
    includeRecommendations: true,
    deliveryMethod: 'DOWNLOAD',
    emailAddress: '',
    scheduleTime: ''
  })
  emit('close')
}
</script>
