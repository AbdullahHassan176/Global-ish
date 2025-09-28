<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Export Financial Report</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Report Type Selection -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Select Report Type</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="reportType in reportTypes" 
                  :key="reportType.id"
                  class="p-4 border border-gray-200 rounded-lg hover:border-brand-teal hover:shadow-md transition-all duration-300 cursor-pointer"
                  :class="{ 'border-brand-teal bg-brand-teal/5': selectedReportType === reportType.id }"
                  @click="selectedReportType = reportType.id"
                >
                  <div class="flex items-center space-x-3">
                    <div :class="reportType.iconBg" class="p-2 rounded-lg">
                      <component :is="reportType.icon" class="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">{{ reportType.name }}</h4>
                      <p class="text-sm text-gray-600">{{ reportType.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Date Range -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  v-model="reportData.startDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  v-model="reportData.endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>
            </div>

            <!-- Report Filters -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Report Filters</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Clients</label>
                  <div class="space-y-2 max-h-32 overflow-y-auto">
                    <div v-for="client in clients" :key="client.id" class="flex items-center">
                      <input
                        v-model="reportData.selectedClients"
                        :value="client.id"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">{{ client.name }}</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Projects</label>
                  <div class="space-y-2 max-h-32 overflow-y-auto">
                    <div v-for="project in projects" :key="project.id" class="flex items-center">
                      <input
                        v-model="reportData.selectedProjects"
                        :value="project.id"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">{{ project.name }}</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Employees</label>
                  <div class="space-y-2 max-h-32 overflow-y-auto">
                    <div v-for="employee in employees" :key="employee.id" class="flex items-center">
                      <input
                        v-model="reportData.selectedEmployees"
                        :value="employee.id"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">{{ employee.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Export Format -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  v-for="format in exportFormats" 
                  :key="format.id"
                  class="p-3 border border-gray-200 rounded-lg hover:border-brand-teal hover:shadow-md transition-all duration-300 cursor-pointer"
                  :class="{ 'border-brand-teal bg-brand-teal/5': selectedFormat === format.id }"
                  @click="selectedFormat = format.id"
                >
                  <div class="text-center">
                    <div :class="format.iconBg" class="p-2 rounded-lg mx-auto mb-2 w-fit">
                      <component :is="format.icon" class="h-4 w-4 text-white" />
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ format.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Report Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Report Options</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Group By</label>
                    <select
                      v-model="reportData.groupBy"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="none">No grouping</option>
                      <option value="client">Client</option>
                      <option value="project">Project</option>
                      <option value="employee">Employee</option>
                      <option value="date">Date</option>
                      <option value="month">Month</option>
                      <option value="quarter">Quarter</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      v-model="reportData.sortBy"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="date">Date</option>
                      <option value="client">Client</option>
                      <option value="project">Project</option>
                      <option value="employee">Employee</option>
                      <option value="amount">Amount</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center">
                    <input
                      v-model="reportData.includeCharts"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include charts and graphs</label>
                  </div>

                  <div class="flex items-center">
                    <input
                      v-model="reportData.includeSummary"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include executive summary</label>
                  </div>

                  <div class="flex items-center">
                    <input
                      v-model="reportData.includeDetails"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include detailed breakdown</label>
                  </div>

                  <div class="flex items-center">
                    <input
                      v-model="reportData.includeInactive"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include inactive records</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="reportData.sendEmail"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Email report to recipients</label>
                </div>

                <div v-if="reportData.sendEmail">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
                  <input
                    v-model="reportData.emailRecipients"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="email1@company.com, email2@company.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Report Notes</label>
                  <textarea
                    v-model="reportData.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Add any notes about this report..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Report Preview -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Report Preview</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <div><strong>Report Type:</strong> {{ getSelectedReportTypeName() }}</div>
                <div><strong>Date Range:</strong> {{ reportData.startDate }} to {{ reportData.endDate }}</div>
                <div><strong>Format:</strong> {{ getSelectedFormatName() }}</div>
                <div><strong>Grouping:</strong> {{ reportData.groupBy }}</div>
                <div><strong>Sorting:</strong> {{ reportData.sortBy }}</div>
                <div><strong>Filters:</strong> {{ getSelectedFilters() }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handlePreview"
              class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
            >
              Preview
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
            >
              Export Report
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, FileText, FileSpreadsheet, File, Download, BarChart3, TrendingUp, DollarSign, Clock } from 'lucide-vue-next'

interface ReportType {
  id: string
  name: string
  description: string
  icon: any
  iconBg: string
}

interface ExportFormat {
  id: string
  name: string
  icon: any
  iconBg: string
}

interface ReportData {
  startDate: string
  endDate: string
  selectedClients: string[]
  selectedProjects: string[]
  selectedEmployees: string[]
  groupBy: string
  sortBy: string
  includeCharts: boolean
  includeSummary: boolean
  includeDetails: boolean
  includeInactive: boolean
  sendEmail: boolean
  emailRecipients: string
  notes: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  export: [data: any]
  preview: [data: any]
}>()

const selectedReportType = ref('financial-summary')
const selectedFormat = ref('pdf')

const reportData = reactive<ReportData>({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  endDate: new Date().toISOString().split('T')[0], // today
  selectedClients: [],
  selectedProjects: [],
  selectedEmployees: [],
  groupBy: 'client',
  sortBy: 'date',
  includeCharts: true,
  includeSummary: true,
  includeDetails: true,
  includeInactive: false,
  sendEmail: false,
  emailRecipients: '',
  notes: ''
})

const reportTypes: ReportType[] = [
  {
    id: 'financial-summary',
    name: 'Financial Summary',
    description: 'Revenue, expenses, and profit overview',
    icon: DollarSign,
    iconBg: 'bg-green-500'
  },
  {
    id: 'timesheet-report',
    name: 'Timesheet Report',
    description: 'Detailed timesheet and hours tracking',
    icon: Clock,
    iconBg: 'bg-blue-500'
  },
  {
    id: 'client-analysis',
    name: 'Client Analysis',
    description: 'Revenue and performance by client',
    icon: BarChart3,
    iconBg: 'bg-purple-500'
  },
  {
    id: 'project-profitability',
    name: 'Project Profitability',
    description: 'Profit margins and ROI by project',
    icon: TrendingUp,
    iconBg: 'bg-orange-500'
  }
]

const exportFormats: ExportFormat[] = [
  { id: 'pdf', name: 'PDF', icon: File, iconBg: 'bg-red-500' },
  { id: 'excel', name: 'Excel', icon: FileSpreadsheet, iconBg: 'bg-green-500' },
  { id: 'csv', name: 'CSV', icon: FileText, iconBg: 'bg-blue-500' },
  { id: 'json', name: 'JSON', icon: FileText, iconBg: 'bg-gray-500' }
]

const clients = [
  { id: '1', name: 'Acme Corporation' },
  { id: '2', name: 'TechStart Inc' },
  { id: '3', name: 'DataCorp Solutions' }
]

const projects = [
  { id: '1', name: 'Website Redesign' },
  { id: '2', name: 'Mobile App Development' },
  { id: '3', name: 'Database Migration' }
]

const employees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' }
]

const getSelectedReportTypeName = () => {
  const reportType = reportTypes.find(r => r.id === selectedReportType.value)
  return reportType ? reportType.name : 'Unknown'
}

const getSelectedFormatName = () => {
  const format = exportFormats.find(f => f.id === selectedFormat.value)
  return format ? format.name : 'Unknown'
}

const getSelectedFilters = () => {
  const filters = []
  if (reportData.selectedClients.length > 0) filters.push(`${reportData.selectedClients.length} clients`)
  if (reportData.selectedProjects.length > 0) filters.push(`${reportData.selectedProjects.length} projects`)
  if (reportData.selectedEmployees.length > 0) filters.push(`${reportData.selectedEmployees.length} employees`)
  return filters.length > 0 ? filters.join(', ') : 'No filters'
}

const handleSubmit = () => {
  const exportRequest = {
    reportType: selectedReportType.value,
    format: selectedFormat.value,
    ...reportData
  }
  emit('export', exportRequest)
}

const handlePreview = () => {
  const exportRequest = {
    reportType: selectedReportType.value,
    format: selectedFormat.value,
    ...reportData
  }
  emit('preview', exportRequest)
}

const close = () => {
  emit('close')
}
</script>
