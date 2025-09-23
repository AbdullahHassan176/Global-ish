<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-5xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create Custom Report</h2>
          <p class="text-brand-teal mt-1">Generate comprehensive reports with custom data sources, filters, and visualizations</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Report Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Report Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Report Name</label>
              <input 
                v-model="reportData.name"
                type="text" 
                placeholder="Enter report name"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Report Type</label>
              <select 
                v-model="reportData.type"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select report type</option>
                <option value="financial">Financial Report</option>
                <option value="operational">Operational Report</option>
                <option value="performance">Performance Report</option>
                <option value="compliance">Compliance Report</option>
                <option value="analytics">Analytics Report</option>
                <option value="custom">Custom Report</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Description</label>
            <textarea 
              v-model="reportData.description"
              rows="3"
              placeholder="Enter report description"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Data Sources -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Data Sources</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Primary Data Source</label>
              <select 
                v-model="reportData.primaryDataSource"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select primary data source</option>
                <option value="database">Database</option>
                <option value="api">API</option>
                <option value="file">File Upload</option>
                <option value="integration">Integration</option>
                <option value="manual">Manual Entry</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Additional Data Sources</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label class="flex items-center">
                  <input 
                    v-model="reportData.additionalSources.sales"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Sales Data</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.additionalSources.finance"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Finance Data</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.additionalSources.hr"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">HR Data</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.additionalSources.operations"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Operations Data</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters & Criteria -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Filters & Criteria</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-brand-navy mb-2">Date Range</label>
                <div class="grid grid-cols-2 gap-2">
                  <input 
                    v-model="reportData.dateRange.startDate"
                    type="date" 
                    class="px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                  <input 
                    v-model="reportData.dateRange.endDate"
                    type="date" 
                    class="px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-brand-navy mb-2">Department</label>
                <select 
                  v-model="reportData.department"
                  class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                >
                  <option value="">All Departments</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="engineering">Engineering</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Custom Filters</label>
              <div class="space-y-2">
                <div v-for="(filter, index) in reportData.customFilters" :key="index" class="flex items-center space-x-2">
                  <input 
                    v-model="filter.field"
                    type="text" 
                    placeholder="Field name"
                    class="flex-1 px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                  <select 
                    v-model="filter.operator"
                    class="px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater">Greater Than</option>
                    <option value="less">Less Than</option>
                  </select>
                  <input 
                    v-model="filter.value"
                    type="text" 
                    placeholder="Value"
                    class="flex-1 px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                  <button @click="removeFilter(index)" class="text-red-500 hover:text-red-700">
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <button @click="addFilter" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 text-sm">
                  Add Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Visualizations -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Visualizations</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Chart Types</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label class="flex items-center">
                  <input 
                    v-model="reportData.chartTypes.bar"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Bar Chart</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.chartTypes.line"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Line Chart</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.chartTypes.pie"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Pie Chart</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.chartTypes.table"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Data Table</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Metrics to Display</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label class="flex items-center">
                  <input 
                    v-model="reportData.metrics.revenue"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Revenue</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.metrics.profit"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Profit</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.metrics.customers"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Customers</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.metrics.orders"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Orders</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.metrics.employees"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Employees</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="reportData.metrics.performance"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Performance</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Report Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Report Format</label>
              <select 
                v-model="reportData.format"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select format</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Schedule</label>
              <select 
                v-model="reportData.schedule"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select schedule</option>
                <option value="manual">Manual Only</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  v-model="reportData.autoRefresh"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Auto-refresh data</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="reportData.exportEnabled"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Enable export</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="reportData.shareEnabled"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Enable sharing</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Report will be generated and available in the reports section
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="previewReport" class="px-4 py-2 border-2 border-brand-orange text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all duration-300">
            Preview
          </button>
          <button @click="createReport" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Create Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const reportData = ref({
  name: '',
  type: '',
  description: '',
  primaryDataSource: '',
  additionalSources: {
    sales: false,
    finance: false,
    hr: false,
    operations: false
  },
  dateRange: {
    startDate: '',
    endDate: ''
  },
  department: '',
  customFilters: [],
  chartTypes: {
    bar: false,
    line: false,
    pie: false,
    table: false
  },
  metrics: {
    revenue: false,
    profit: false,
    customers: false,
    orders: false,
    employees: false,
    performance: false
  },
  format: '',
  schedule: '',
  autoRefresh: false,
  exportEnabled: true,
  shareEnabled: false
})

const addFilter = () => {
  reportData.value.customFilters.push({
    field: '',
    operator: 'equals',
    value: ''
  })
}

const removeFilter = (index: number) => {
  reportData.value.customFilters.splice(index, 1)
}

const previewReport = () => {
  console.log('Previewing report:', reportData.value)
  alert('Generating report preview...')
}

const createReport = () => {
  if (!reportData.value.name || !reportData.value.type) {
    alert('Please fill in all required fields')
    return
  }
  
  console.log('Creating report:', reportData.value)
  emit('submit', reportData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving report draft:', reportData.value)
  alert('Report draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  reportData.value = {
    name: '',
    type: '',
    description: '',
    primaryDataSource: '',
    additionalSources: {
      sales: false,
      finance: false,
      hr: false,
      operations: false
    },
    dateRange: {
      startDate: '',
      endDate: ''
    },
    department: '',
    customFilters: [],
    chartTypes: {
      bar: false,
      line: false,
      pie: false,
      table: false
    },
    metrics: {
      revenue: false,
      profit: false,
      customers: false,
      orders: false,
      employees: false,
      performance: false
    },
    format: '',
    schedule: '',
    autoRefresh: false,
    exportEnabled: true,
    shareEnabled: false
  }
}
</script>
