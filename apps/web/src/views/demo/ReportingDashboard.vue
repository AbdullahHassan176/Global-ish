<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Reporting & Analytics Center</h1>
        <p class="text-gray-600 mt-2">
          Comprehensive reporting, KPI tracking, and predictive analytics
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <BarChart3 class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active KPIs</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeKPIs }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <TrendingUp class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Improving Trends</p>
              <p class="text-2xl font-bold text-gray-900">{{ improvingTrends }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <Clock class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Scheduled Reports</p>
              <p class="text-2xl font-bold text-gray-900">{{ scheduledReports }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Brain class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Predictive Models</p>
              <p class="text-2xl font-bold text-gray-900">{{ predictiveModels }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'kpis'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'kpis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              KPIs & Metrics
            </button>
            <button
              @click="activeTab = 'reports'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Reports & Exports
            </button>
            <button
              @click="activeTab = 'predictions'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'predictions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Predictive Analytics
            </button>
            <button
              @click="activeTab = 'dashboards'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'dashboards'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Role Dashboards
            </button>
          </nav>
        </div>
      </div>

      <!-- KPIs & Metrics Tab -->
      <div v-if="activeTab === 'kpis'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">KPI Dashboard</h2>
          <div class="flex space-x-4">
            <select v-model="selectedPeriod" class="border rounded-md px-3 py-2">
              <option value="2024-01">January 2024</option>
              <option value="2024-02">February 2024</option>
              <option value="2024-03">March 2024</option>
            </select>
            <button @click="calculateKPIs" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <RefreshCw class="h-4 w-4 mr-2" />
              Calculate KPIs
            </button>
          </div>
        </div>

        <!-- KPI Categories -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Logistics KPIs</h3>
            <div class="space-y-4">
              <div
                v-for="kpi in logisticsKPIs"
                :key="kpi.type"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ kpi.name }}</p>
                  <p class="text-sm text-gray-500">{{ kpi.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold" :class="getKPIColor(kpi.value, kpi.target)">
                    {{ kpi.value }}{{ kpi.unit }}
                  </p>
                  <p class="text-sm text-gray-500">Target: {{ kpi.target }}{{ kpi.unit }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Consulting KPIs</h3>
            <div class="space-y-4">
              <div
                v-for="kpi in consultingKPIs"
                :key="kpi.type"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ kpi.name }}</p>
                  <p class="text-sm text-gray-500">{{ kpi.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold" :class="getKPIColor(kpi.value, kpi.target)">
                    {{ kpi.value }}{{ kpi.unit }}
                  </p>
                  <p class="text-sm text-gray-500">Target: {{ kpi.target }}{{ kpi.unit }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Trends Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">KPI Trends</h3>
          <div class="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <p class="text-gray-500">KPI Trends Chart (Chart.js integration)</p>
          </div>
        </div>
      </div>

      <!-- Reports & Exports Tab -->
      <div v-if="activeTab === 'reports'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Reports & Exports</h2>
          <button @click="generateReport" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <FileText class="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>

        <!-- Report Types -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="reportType in reportTypes"
            :key="reportType.type"
            class="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
            @click="selectReportType(reportType.type)"
          >
            <div class="flex items-center mb-4">
              <div class="p-2 bg-blue-100 rounded-lg">
                <component :is="reportType.icon" class="h-6 w-6 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 ml-3">{{ reportType.name }}</h3>
            </div>
            <p class="text-sm text-gray-500 mb-4">{{ reportType.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-400">{{ reportType.category }}</span>
              <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Generate →
              </button>
            </div>
          </div>
        </div>

        <!-- Scheduled Reports -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
          <div class="space-y-4">
            <div
              v-for="schedule in mockSchedules"
              :key="schedule.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ schedule.name }}</h4>
                <p class="text-sm text-gray-500">{{ schedule.description }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ schedule.frequency }} • Next run: {{ schedule.nextRun }}
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">{{ schedule.recipients.length }} recipients</span>
                <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Predictive Analytics Tab -->
      <div v-if="activeTab === 'predictions'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Predictive Analytics</h2>
          <button @click="refreshPredictions" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <RefreshCw class="h-4 w-4 mr-2" />
            Refresh Predictions
          </button>
        </div>

        <!-- ETA Predictions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ETA Predictions</h3>
          <div class="space-y-4">
            <div
              v-for="prediction in mockETAPredictions"
              :key="prediction.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ prediction.shipmentRef }}</h4>
                <p class="text-sm text-gray-500">{{ prediction.milestoneType }} • {{ prediction.route }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  Confidence: {{ Math.round(prediction.confidence * 100) }}%
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ prediction.predictedDate }}</p>
                <p class="text-sm text-gray-500">{{ prediction.historicalDelta }} days vs avg</p>
              </div>
            </div>
          </div>
        </div>

        <!-- HS Code Suggestions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">HS Code Suggestions</h3>
          <div class="space-y-4">
            <div
              v-for="suggestion in mockHSSuggestions"
              :key="suggestion.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ suggestion.productName }}</h4>
                <p class="text-sm text-gray-500">{{ suggestion.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ suggestion.reasoning }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ suggestion.suggestedCode }}</p>
                <p class="text-sm text-gray-500">
                  {{ Math.round(suggestion.confidence * 100) }}% confidence
                </p>
                <button class="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1">
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Demurrage Risk Analysis -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Demurrage Risk Analysis</h3>
          <div class="space-y-4">
            <div
              v-for="risk in mockDemurrageRisks"
              :key="risk.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ risk.shipmentRef }}</h4>
                <p class="text-sm text-gray-500">{{ risk.port }} • {{ risk.carrier }}</p>
                <div class="flex space-x-4 mt-2">
                  <span class="text-xs px-2 py-1 rounded-full" :class="getRiskColor(risk.riskLevel)">
                    {{ risk.riskLevel }} RISK
                  </span>
                  <span class="text-xs text-gray-500">{{ risk.estimatedDays }} days</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">${{ risk.estimatedCost.toLocaleString() }}</p>
                <p class="text-sm text-gray-500">{{ risk.riskScore }}% risk score</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Role Dashboards Tab -->
      <div v-if="activeTab === 'dashboards'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Role-Specific Dashboards</h2>
          <select v-model="selectedRole" class="border rounded-md px-3 py-2">
            <option value="executive">Executive</option>
            <option value="logistics">Logistics</option>
            <option value="consulting">Consulting</option>
            <option value="compliance">Compliance</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <!-- Executive Dashboard -->
        <div v-if="selectedRole === 'executive'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-blue-600">$2.5M</div>
              <p class="text-sm text-gray-500 mt-1">Total Revenue</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-green-600">1,250</div>
              <p class="text-sm text-gray-500 mt-1">Total Shipments</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-purple-600">85%</div>
              <p class="text-sm text-gray-500 mt-1">Utilization Rate</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-yellow-600">92%</div>
              <p class="text-sm text-gray-500 mt-1">On-Time Delivery</p>
            </div>
          </div>
        </div>

        <!-- Logistics Dashboard -->
        <div v-if="selectedRole === 'logistics'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-blue-600">45</div>
              <p class="text-sm text-gray-500 mt-1">Active Shipments</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-green-600">23</div>
              <p class="text-sm text-gray-500 mt-1">Containers in Transit</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-purple-600">14.5</div>
              <p class="text-sm text-gray-500 mt-1">Avg Lead Time (days)</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-red-600">$12.5K</div>
              <p class="text-sm text-gray-500 mt-1">Demurrage Costs</p>
            </div>
          </div>
        </div>

        <!-- Consulting Dashboard -->
        <div v-if="selectedRole === 'consulting'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-blue-600">1,200</div>
              <p class="text-sm text-gray-500 mt-1">Total Hours</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-green-600">900</div>
              <p class="text-sm text-gray-500 mt-1">Billable Hours</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-purple-600">75%</div>
              <p class="text-sm text-gray-500 mt-1">Utilization Rate</p>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-yellow-600">7.2</div>
              <p class="text-sm text-gray-500 mt-1">Avg Cycle Time (days)</p>
            </div>
          </div>
        </div>

        <!-- Other role dashboards would follow similar pattern -->
        <div v-if="['compliance', 'finance', 'marketing'].includes(selectedRole)" class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) }} Dashboard</h3>
          <p class="text-gray-500">Dashboard content for {{ selectedRole }} role would be displayed here.</p>
        </div>
      </div>
    </div>
  </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SidebarLayout from '@/components/SidebarLayout.vue'
import { 
  BarChart3, TrendingUp, Clock, Brain, RefreshCw, FileText, 
  Ship, Users, Shield, DollarSign, Megaphone, Target
} from 'lucide-vue-next'

// Reactive data
const activeTab = ref('kpis')
const selectedPeriod = ref('2024-01')
const selectedRole = ref('executive')

// Mock data
const activeKPIs = ref(24)
const improvingTrends = ref(18)
const scheduledReports = ref(8)
const predictiveModels = ref(5)

const logisticsKPIs = ref([
  {
    type: 'LEAD_TIME_AVERAGE',
    name: 'Average Lead Time',
    description: 'Average time from ETD to ETA',
    value: 14.5,
    target: 14,
    unit: ' days',
    trend: 'UP'
  },
  {
    type: 'ON_TIME_DELIVERY_RATE',
    name: 'On-Time Delivery Rate',
    description: 'Percentage of shipments delivered on time',
    value: 92,
    target: 95,
    unit: '%',
    trend: 'UP'
  },
  {
    type: 'CLEARANCE_DELAY_DAYS',
    name: 'Clearance Delay Days',
    description: 'Average days delayed at customs',
    value: 2.3,
    target: 0,
    unit: ' days',
    trend: 'DOWN'
  },
  {
    type: 'DEMURRAGE_DAYS',
    name: 'Demurrage Days',
    description: 'Average demurrage days per shipment',
    value: 1.8,
    target: 0,
    unit: ' days',
    trend: 'STABLE'
  }
])

const consultingKPIs = ref([
  {
    type: 'UTILIZATION_RATE',
    name: 'Utilization Rate',
    description: 'Percentage of billable hours vs total hours',
    value: 75,
    target: 80,
    unit: '%',
    trend: 'UP'
  },
  {
    type: 'BILLABILITY_RATE',
    name: 'Billability Rate',
    description: 'Percentage of hours that can be billed',
    value: 85,
    target: 90,
    unit: '%',
    trend: 'UP'
  },
  {
    type: 'CYCLE_TIME_AVERAGE',
    name: 'Average Cycle Time',
    description: 'Average time to complete projects',
    value: 7.2,
    target: 7,
    unit: ' days',
    trend: 'DOWN'
  },
  {
    type: 'CLIENT_SATISFACTION',
    name: 'Client Satisfaction',
    description: 'Average client satisfaction score',
    value: 4.5,
    target: 4.5,
    unit: '/5',
    trend: 'STABLE'
  }
])

const reportTypes = ref([
  {
    type: 'LOGISTICS_SUMMARY',
    name: 'Logistics Summary',
    description: 'Comprehensive logistics performance report',
    category: 'Logistics',
    icon: Ship
  },
  {
    type: 'CONSULTING_UTILIZATION',
    name: 'Consulting Utilization',
    description: 'Consulting team utilization and billability report',
    category: 'Consulting',
    icon: Users
  },
  {
    type: 'COMPLIANCE_STATUS',
    name: 'Compliance Status',
    description: 'Compliance and regulatory status report',
    category: 'Compliance',
    icon: Shield
  },
  {
    type: 'FINANCIAL_OVERVIEW',
    name: 'Financial Overview',
    description: 'Financial performance and metrics report',
    category: 'Finance',
    icon: DollarSign
  },
  {
    type: 'SECURITY_AUDIT',
    name: 'Security Audit',
    description: 'Security events and compliance report',
    category: 'Security',
    icon: Shield
  },
  {
    type: 'CUSTOM_DASHBOARD',
    name: 'Custom Dashboard',
    description: 'Customizable dashboard report',
    category: 'Overall',
    icon: Target
  }
])

const mockSchedules = ref([
  {
    id: '1',
    name: 'Weekly Logistics Report',
    description: 'Weekly summary of logistics performance',
    frequency: 'Weekly',
    nextRun: '2024-01-22 09:00',
    recipients: ['logistics@company.com', 'ops@company.com']
  },
  {
    id: '2',
    name: 'Monthly Executive Summary',
    description: 'Monthly executive dashboard',
    frequency: 'Monthly',
    nextRun: '2024-02-01 08:00',
    recipients: ['executives@company.com']
  }
])

const mockETAPredictions = ref([
  {
    id: '1',
    shipmentRef: 'SHP-2024-001',
    milestoneType: 'ETA',
    route: 'Shanghai → Los Angeles',
    predictedDate: '2024-01-25',
    confidence: 0.85,
    historicalDelta: 2
  },
  {
    id: '2',
    shipmentRef: 'SHP-2024-002',
    milestoneType: 'ETA',
    route: 'Hamburg → New York',
    predictedDate: '2024-01-28',
    confidence: 0.92,
    historicalDelta: -1
  }
])

const mockHSSuggestions = ref([
  {
    id: '1',
    productName: 'Electronic Components',
    description: 'Semiconductor chips and microprocessors',
    suggestedCode: '8541.40.00',
    confidence: 0.88,
    reasoning: 'Matches historical classifications for similar electronic components'
  },
  {
    id: '2',
    productName: 'Textile Products',
    description: 'Cotton t-shirts and apparel',
    suggestedCode: '6109.10.00',
    confidence: 0.95,
    reasoning: 'High confidence match based on product description and material'
  }
])

const mockDemurrageRisks = ref([
  {
    id: '1',
    shipmentRef: 'SHP-2024-003',
    port: 'Los Angeles',
    carrier: 'Maersk',
    riskLevel: 'HIGH',
    riskScore: 75,
    estimatedDays: 3,
    estimatedCost: 1500
  },
  {
    id: '2',
    shipmentRef: 'SHP-2024-004',
    port: 'New York',
    carrier: 'MSC',
    riskLevel: 'MEDIUM',
    riskScore: 45,
    estimatedDays: 1,
    estimatedCost: 500
  }
])

// Methods
const calculateKPIs = () => {
  console.log('Calculating KPIs for period:', selectedPeriod.value)
  // In real app, this would call the API
}

const generateReport = () => {
  console.log('Generating report')
  // In real app, this would call the API
}

const selectReportType = (type: string) => {
  console.log('Selected report type:', type)
  // In real app, this would navigate to report generation
}

const refreshPredictions = () => {
  console.log('Refreshing predictions')
  // In real app, this would call the API
}

const getKPIColor = (value: number, target: number) => {
  if (value >= target) return 'text-green-600'
  if (value >= target * 0.9) return 'text-yellow-600'
  return 'text-red-600'
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'LOW': return 'bg-green-100 text-green-800'
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
    case 'HIGH': return 'bg-orange-100 text-orange-800'
    case 'CRITICAL': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>
