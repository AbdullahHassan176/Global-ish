<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Revenue by Client Analysis</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Chart Controls -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  v-model="selectedPeriod"
                  @change="updateChart"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              
              <div v-if="selectedPeriod === 'custom'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  v-model="customStartDate"
                  type="date"
                  @change="updateChart"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
              
              <div v-if="selectedPeriod === 'custom'">
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  v-model="customEndDate"
                  type="date"
                  @change="updateChart"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button @click="exportChart" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
                <Download class="h-4 w-4 mr-2" />
                Export
              </button>
              <button @click="refreshChart" class="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center">
                <RefreshCw class="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          <!-- Chart Display -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Revenue by Client</h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Total Revenue:</span>
                <span class="text-lg font-bold text-green-600">${{ totalRevenue.toLocaleString() }}</span>
              </div>
            </div>
            
            <!-- Chart Placeholder with Interactive Elements -->
            <div class="h-96 bg-white rounded-lg border border-gray-200 p-4">
              <div class="h-full flex items-end justify-between space-x-2">
                <div 
                  v-for="(client, index) in chartData" 
                  :key="client.id"
                  class="flex-1 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                  @click="selectClient(client)"
                >
                  <div 
                    class="w-full rounded-t-lg transition-all duration-300 hover:shadow-lg"
                    :style="{ 
                      height: `${(client.revenue / maxRevenue) * 300}px`,
                      backgroundColor: getClientColor(index)
                    }"
                    :class="{ 'ring-2 ring-brand-teal': selectedClient?.id === client.id }"
                  ></div>
                  <div class="text-xs text-gray-600 mt-2 text-center">
                    <div class="font-medium">{{ client.name }}</div>
                    <div class="text-green-600">${{ client.revenue.toLocaleString() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Details -->
          <div v-if="selectedClient" class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedClient.name }} - Revenue Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">${{ selectedClient.revenue.toLocaleString() }}</div>
                <div class="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ selectedClient.projectsCount }}</div>
                <div class="text-sm text-gray-600">Active Projects</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ selectedClient.hoursLogged }}h</div>
                <div class="text-sm text-gray-600">Hours Logged</div>
              </div>
            </div>
          </div>

          <!-- Revenue Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Clients</h3>
              <div class="space-y-3">
                <div 
                  v-for="(client, index) in topClients" 
                  :key="client.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  @click="selectClient(client)"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getClientColor(index) }"></div>
                    <span class="font-medium">{{ client.name }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-green-600">${{ client.revenue.toLocaleString() }}</div>
                    <div class="text-xs text-gray-500">{{ ((client.revenue / totalRevenue) * 100).toFixed(1) }}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">This Month</span>
                  <span class="font-medium text-green-600">+12.5%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Last Month</span>
                  <span class="font-medium text-blue-600">+8.2%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Quarterly Growth</span>
                  <span class="font-medium text-purple-600">+15.3%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Yearly Growth</span>
                  <span class="font-medium text-orange-600">+28.7%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            <div class="flex items-center space-x-4">
              <button @click="exportToPDF" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center">
                <File class="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button @click="exportToExcel" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center">
                <FileSpreadsheet class="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button @click="exportToCSV" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <FileText class="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Download, RefreshCw, File, FileSpreadsheet, FileText } from 'lucide-vue-next'

interface Client {
  id: string
  name: string
  revenue: number
  projectsCount: number
  hoursLogged: number
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  export: [data: any]
}>()

const selectedPeriod = ref('30d')
const customStartDate = ref('')
const customEndDate = ref('')
const selectedClient = ref<Client | null>(null)

const chartData = ref<Client[]>([
  { id: '1', name: 'Acme Corp', revenue: 45000, projectsCount: 3, hoursLogged: 320 },
  { id: '2', name: 'TechStart Inc', revenue: 32000, projectsCount: 2, hoursLogged: 280 },
  { id: '3', name: 'DataCorp', revenue: 15000, projectsCount: 1, hoursLogged: 120 },
  { id: '4', name: 'RetailCo', revenue: 28000, projectsCount: 2, hoursLogged: 200 },
  { id: '5', name: 'ServiceCorp', revenue: 18000, projectsCount: 1, hoursLogged: 150 }
])

const totalRevenue = computed(() => {
  return chartData.value.reduce((sum, client) => sum + client.revenue, 0)
})

const maxRevenue = computed(() => {
  return Math.max(...chartData.value.map(client => client.revenue))
})

const topClients = computed(() => {
  return [...chartData.value].sort((a, b) => b.revenue - a.revenue)
})

const getClientColor = (index: number) => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6'  // purple
  ]
  return colors[index % colors.length]
}

const selectClient = (client: Client) => {
  selectedClient.value = client
}

const updateChart = () => {
  // Simulate chart update based on selected period
  console.log('Updating chart for period:', selectedPeriod.value)
}

const refreshChart = () => {
  // Simulate data refresh
  console.log('Refreshing chart data')
}

const exportChart = () => {
  emit('export', {
    type: 'chart',
    data: chartData.value,
    period: selectedPeriod.value
  })
}

const exportToPDF = () => {
  console.log('Exporting to PDF')
}

const exportToExcel = () => {
  console.log('Exporting to Excel')
}

const exportToCSV = () => {
  console.log('Exporting to CSV')
}

const close = () => {
  selectedClient.value = null
  emit('close')
}
</script>
