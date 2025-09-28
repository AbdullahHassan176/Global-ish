<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Hours by Project Analysis</h2>
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
              <h3 class="text-lg font-semibold text-gray-900">Hours by Project</h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Total Hours:</span>
                <span class="text-lg font-bold text-blue-600">{{ totalHours.toLocaleString() }}h</span>
              </div>
            </div>
            
            <!-- Chart Placeholder with Interactive Elements -->
            <div class="h-96 bg-white rounded-lg border border-gray-200 p-4">
              <div class="h-full flex items-end justify-between space-x-2">
                <div 
                  v-for="(project, index) in chartData" 
                  :key="project.id"
                  class="flex-1 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                  @click="selectProject(project)"
                >
                  <div 
                    class="w-full rounded-t-lg transition-all duration-300 hover:shadow-lg"
                    :style="{ 
                      height: `${(project.hours / maxHours) * 300}px`,
                      backgroundColor: getProjectColor(index)
                    }"
                    :class="{ 'ring-2 ring-brand-teal': selectedProject?.id === project.id }"
                  ></div>
                  <div class="text-xs text-gray-600 mt-2 text-center">
                    <div class="font-medium">{{ project.name }}</div>
                    <div class="text-blue-600">{{ project.hours }}h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Details -->
          <div v-if="selectedProject" class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedProject.name }} - Hours Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ selectedProject.hours }}h</div>
                <div class="text-sm text-gray-600">Total Hours</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">${{ selectedProject.revenue.toLocaleString() }}</div>
                <div class="text-sm text-gray-600">Revenue</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ selectedProject.teamSize }}</div>
                <div class="text-sm text-gray-600">Team Size</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">{{ selectedProject.progress }}%</div>
                <div class="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </div>

          <!-- Hours Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Projects by Hours</h3>
              <div class="space-y-3">
                <div 
                  v-for="(project, index) in topProjects" 
                  :key="project.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  @click="selectProject(project)"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getProjectColor(index) }"></div>
                    <span class="font-medium">{{ project.name }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-blue-600">{{ project.hours }}h</div>
                    <div class="text-xs text-gray-500">{{ ((project.hours / totalHours) * 100).toFixed(1) }}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Hours Trends</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">This Week</span>
                  <span class="font-medium text-green-600">+15.2%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Last Week</span>
                  <span class="font-medium text-blue-600">+8.7%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Monthly Average</span>
                  <span class="font-medium text-purple-600">1,247h</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Utilization Rate</span>
                  <span class="font-medium text-orange-600">87.3%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Performance -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Team Performance by Project</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="member in teamPerformance" :key="member.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ member.project }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ member.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ member.hours }}h</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ member.rate }}/h</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ member.amount }}</td>
                  </tr>
                </tbody>
              </table>
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

interface Project {
  id: string
  name: string
  hours: number
  revenue: number
  teamSize: number
  progress: number
}

interface TeamMember {
  id: string
  name: string
  project: string
  hours: number
  rate: number
  amount: number
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
const selectedProject = ref<Project | null>(null)

const chartData = ref<Project[]>([
  { id: '1', name: 'Website Redesign', hours: 320, revenue: 24000, teamSize: 3, progress: 65 },
  { id: '2', name: 'Mobile App', hours: 280, revenue: 32000, teamSize: 4, progress: 40 },
  { id: '3', name: 'Database Migration', hours: 120, revenue: 15000, teamSize: 2, progress: 100 },
  { id: '4', name: 'E-commerce Platform', hours: 200, revenue: 28000, teamSize: 3, progress: 75 },
  { id: '5', name: 'API Integration', hours: 150, revenue: 18000, teamSize: 2, progress: 30 }
])

const teamPerformance = ref<TeamMember[]>([
  { id: '1', name: 'John Doe', project: 'Website Redesign', hours: 120, rate: 75, amount: 9000 },
  { id: '2', name: 'Jane Smith', project: 'Mobile App', hours: 100, rate: 85, amount: 8500 },
  { id: '3', name: 'Mike Johnson', project: 'Database Migration', hours: 80, rate: 90, amount: 7200 },
  { id: '4', name: 'Sarah Wilson', project: 'E-commerce Platform', hours: 90, rate: 80, amount: 7200 },
  { id: '5', name: 'David Chen', project: 'API Integration', hours: 70, rate: 95, amount: 6650 }
])

const totalHours = computed(() => {
  return chartData.value.reduce((sum, project) => sum + project.hours, 0)
})

const maxHours = computed(() => {
  return Math.max(...chartData.value.map(project => project.hours))
})

const topProjects = computed(() => {
  return [...chartData.value].sort((a, b) => b.hours - a.hours)
})

const getProjectColor = (index: number) => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6'  // purple
  ]
  return colors[index % colors.length]
}

const selectProject = (project: Project) => {
  selectedProject.value = project
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
  selectedProject.value = null
  emit('close')
}
</script>
