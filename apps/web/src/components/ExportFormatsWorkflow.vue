<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Export Data</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Export Type Selection -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Select Export Format</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="format in exportFormats" 
                  :key="format.id"
                  class="p-4 border border-gray-200 rounded-lg hover:border-brand-teal hover:shadow-md transition-all duration-300 cursor-pointer"
                  :class="{ 'border-brand-teal bg-brand-teal/5': selectedFormat === format.id }"
                  @click="selectedFormat = format.id"
                >
                  <div class="flex items-center space-x-3">
                    <div :class="format.iconBg" class="p-2 rounded-lg">
                      <component :is="format.icon" class="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">{{ format.name }}</h4>
                      <p class="text-sm text-gray-600">{{ format.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Selection -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Select Data to Export</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    v-model="exportData.timesheets"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Timesheets</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="exportData.projects"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Projects</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="exportData.clients"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Clients</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="exportData.financialReports"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Financial Reports</label>
                </div>
              </div>
            </div>

            <!-- Date Range -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  v-model="exportData.startDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  v-model="exportData.endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>
            </div>

            <!-- Advanced Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Advanced Options</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Include Inactive Records</label>
                  <div class="flex items-center">
                    <input
                      v-model="exportData.includeInactive"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Include inactive projects and clients</label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Group By</label>
                  <select
                    v-model="exportData.groupBy"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="none">No grouping</option>
                    <option value="employee">Employee</option>
                    <option value="project">Project</option>
                    <option value="client">Client</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    v-model="exportData.sortBy"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="date">Date</option>
                    <option value="employee">Employee</option>
                    <option value="project">Project</option>
                    <option value="client">Client</option>
                    <option value="amount">Amount</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Email Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="exportData.sendEmail"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Email export to recipients</label>
                </div>

                <div v-if="exportData.sendEmail">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
                  <input
                    v-model="exportData.emailRecipients"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="email1@company.com, email2@company.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Export Notes</label>
                  <textarea
                    v-model="exportData.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Add any notes about this export..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Export Preview</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <div><strong>Format:</strong> {{ getSelectedFormatName() }}</div>
                <div><strong>Data:</strong> {{ getSelectedDataTypes() }}</div>
                <div><strong>Date Range:</strong> {{ exportData.startDate }} to {{ exportData.endDate }}</div>
                <div><strong>Grouping:</strong> {{ exportData.groupBy }}</div>
                <div><strong>Sorting:</strong> {{ exportData.sortBy }}</div>
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
              Export Data
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, FileText, FileSpreadsheet, File, Download, Database } from 'lucide-vue-next'

interface ExportFormat {
  id: string
  name: string
  description: string
  icon: any
  iconBg: string
}

interface ExportData {
  timesheets: boolean
  projects: boolean
  clients: boolean
  financialReports: boolean
  startDate: string
  endDate: string
  includeInactive: boolean
  groupBy: string
  sortBy: string
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

const selectedFormat = ref('csv')

const exportData = reactive<ExportData>({
  timesheets: true,
  projects: false,
  clients: false,
  financialReports: false,
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  endDate: new Date().toISOString().split('T')[0], // today
  includeInactive: false,
  groupBy: 'none',
  sortBy: 'date',
  sendEmail: false,
  emailRecipients: '',
  notes: ''
})

const exportFormats: ExportFormat[] = [
  {
    id: 'csv',
    name: 'CSV',
    description: 'Comma-separated values for spreadsheets',
    icon: FileText,
    iconBg: 'bg-green-500'
  },
  {
    id: 'excel',
    name: 'Excel',
    description: 'Microsoft Excel format (.xlsx)',
    icon: FileSpreadsheet,
    iconBg: 'bg-blue-500'
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Portable Document Format for printing',
    icon: File,
    iconBg: 'bg-red-500'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'QuickBooks integration format',
    icon: Database,
    iconBg: 'bg-purple-500'
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'JavaScript Object Notation for APIs',
    icon: FileText,
    iconBg: 'bg-orange-500'
  },
  {
    id: 'xml',
    name: 'XML',
    description: 'Extensible Markup Language',
    icon: FileText,
    iconBg: 'bg-gray-500'
  }
]

const getSelectedFormatName = () => {
  const format = exportFormats.find(f => f.id === selectedFormat.value)
  return format ? format.name : 'Unknown'
}

const getSelectedDataTypes = () => {
  const types = []
  if (exportData.timesheets) types.push('Timesheets')
  if (exportData.projects) types.push('Projects')
  if (exportData.clients) types.push('Clients')
  if (exportData.financialReports) types.push('Financial Reports')
  return types.length > 0 ? types.join(', ') : 'None selected'
}

const handleSubmit = () => {
  const exportRequest = {
    format: selectedFormat.value,
    ...exportData
  }
  emit('export', exportRequest)
}

const handlePreview = () => {
  const exportRequest = {
    format: selectedFormat.value,
    ...exportData
  }
  emit('preview', exportRequest)
}

const close = () => {
  emit('close')
}
</script>
