<template>
  <SidebarLayout>
    <!-- Company Dashboard Header -->
    <div class="bg-gradient-to-r from-brand-navy via-brand-teal to-brand-purple">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-brand-cream sm:text-4xl">
              Global Next
              <span class="text-brand-orange">Company Dashboard</span>
            </h1>
            <p class="mt-2 text-brand-cream/90">
              Real-time overview of all company operations and performance metrics
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="text-sm text-brand-cream/80">Last Updated</div>
              <div class="text-lg font-semibold text-brand-cream">{{ lastUpdated }}</div>
            </div>
            <Tooltip text="Refresh all company data and metrics in real-time" position="bottom">
              <button @click="refreshData" class="px-4 py-2 bg-brand-orange/20 text-brand-cream rounded-lg hover:bg-brand-orange/30 transition-all duration-300 flex items-center">
                <RefreshCw class="h-4 w-4 mr-2" />
                Refresh
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Overview Metrics -->
    <div class="bg-gradient-to-b from-background-cream to-brand-pink/20 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Revenue -->
          <Tooltip text="Total company revenue for the current fiscal year with month-over-month growth" position="top">
            <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-cyan/20 shadow-lg p-6">
              <div class="flex items-center">
                <div class="p-3 bg-gradient-to-br from-brand-orange to-brand-magenta rounded-lg">
                  <DollarSign class="h-6 w-6 text-white" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-brand-teal">Total Revenue</p>
                  <p class="text-2xl font-bold text-brand-navy">${{ formatCurrency(companyMetrics.totalRevenue) }}</p>
                  <p class="text-xs text-green-600">+12.5% from last month</p>
                </div>
        </div>
            </div>
          </Tooltip>

          <!-- Active Projects -->
          <Tooltip text="Currently active projects across all departments with completion tracking" position="top">
            <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-teal/20 shadow-lg p-6">
              <div class="flex items-center">
                <div class="p-3 bg-gradient-to-br from-brand-teal to-brand-cyan rounded-lg">
                  <Briefcase class="h-6 w-6 text-white" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-brand-teal">Active Projects</p>
                  <p class="text-2xl font-bold text-brand-navy">{{ companyMetrics.activeProjects }}</p>
                  <p class="text-xs text-brand-purple">{{ companyMetrics.completedThisMonth }} completed this month</p>
                </div>
              </div>
            </div>
          </Tooltip>

          <!-- Team Members -->
          <Tooltip text="Total team members and currently active users across all departments" position="top">
            <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-purple/20 shadow-lg p-6">
              <div class="flex items-center">
                <div class="p-3 bg-gradient-to-br from-brand-purple to-brand-magenta rounded-lg">
                  <Users class="h-6 w-6 text-white" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-brand-teal">Team Members</p>
                  <p class="text-2xl font-bold text-brand-navy">{{ companyMetrics.teamMembers }}</p>
                  <p class="text-xs text-brand-orange">{{ companyMetrics.activeUsers }} online now</p>
                </div>
              </div>
            </div>
          </Tooltip>

          <!-- System Health -->
          <Tooltip text="Overall system uptime and performance across all company infrastructure" position="top">
            <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-pink/20 shadow-lg p-6">
              <div class="flex items-center">
                <div class="p-3 bg-gradient-to-br from-brand-pink to-brand-purple rounded-lg">
                  <Activity class="h-6 w-6 text-white" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-brand-teal">System Health</p>
                  <p class="text-2xl font-bold text-brand-navy">{{ companyMetrics.systemHealth }}%</p>
                  <p class="text-xs text-green-600">All systems operational</p>
                </div>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>

    <!-- Department Status Overview -->
    <div class="py-8 bg-gradient-to-b from-background-cream to-brand-pink/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-brand-navy">Department Status</h2>
          <p class="mt-4 text-lg text-brand-teal">
            Real-time status of all company departments and operations
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Marketing Department -->
          <Tooltip text="Marketing department handles content creation, campaign management, and brand promotion" position="top">
            <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-purple/20 shadow-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="p-2 bg-gradient-to-br from-brand-purple to-brand-magenta rounded-lg">
                    <Calendar class="h-5 w-5 text-white" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-semibold text-brand-navy">Marketing</h3>
                    <p class="text-sm text-brand-teal">Content & Campaigns</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div :class="getStatusColor(departmentStatus.marketing.status)" class="w-3 h-3 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-brand-navy">{{ departmentStatus.marketing.status }}</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-brand-teal">Active Campaigns:</span>
                  <span class="font-medium text-brand-navy">{{ departmentStatus.marketing.activeCampaigns }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-brand-teal">Content Published:</span>
                  <span class="font-medium text-brand-navy">{{ departmentStatus.marketing.contentPublished }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-brand-teal">Engagement Rate:</span>
                  <span class="font-medium text-green-600">{{ departmentStatus.marketing.engagementRate }}%</span>
                </div>
              </div>
              <div class="mt-4">
                <Tooltip text="Access detailed marketing analytics, campaign management, and content calendar" position="top">
                  <router-link to="/demo/marketing" class="text-brand-purple hover:text-brand-magenta text-sm font-medium transition-colors">
                    View Marketing Dashboard →
                  </router-link>
                </Tooltip>
              </div>
            </div>
          </Tooltip>

          <!-- Logistics Department -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-orange/20 shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="p-2 bg-gradient-to-br from-brand-orange to-brand-magenta rounded-lg">
                  <Ship class="h-5 w-5 text-white" />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-brand-navy">Logistics</h3>
                  <p class="text-sm text-brand-teal">Shipping & Tracking</p>
                </div>
              </div>
              <div class="flex items-center">
                <div :class="getStatusColor(departmentStatus.logistics.status)" class="w-3 h-3 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-brand-navy">{{ departmentStatus.logistics.status }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Active Shipments:</span>
                <span class="font-medium text-brand-navy">{{ departmentStatus.logistics.activeShipments }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">On-Time Delivery:</span>
                <span class="font-medium text-green-600">{{ departmentStatus.logistics.onTimeDelivery }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Cost Efficiency:</span>
                <span class="font-medium text-brand-orange">{{ departmentStatus.logistics.costEfficiency }}%</span>
          </div>
            </div>
            <div class="mt-4">
              <router-link to="/demo/logistics" class="text-brand-orange hover:text-brand-magenta text-sm font-medium transition-colors">
                View Logistics Dashboard →
              </router-link>
            </div>
          </div>

          <!-- HR & Finance Department -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-pink/20 shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="p-2 bg-gradient-to-br from-brand-pink to-brand-purple rounded-lg">
                  <Clock class="h-5 w-5 text-white" />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-brand-navy">HR & Finance</h3>
                  <p class="text-sm text-brand-teal">People & Resources</p>
                </div>
              </div>
              <div class="flex items-center">
                <div :class="getStatusColor(departmentStatus.hrFinance.status)" class="w-3 h-3 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-brand-navy">{{ departmentStatus.hrFinance.status }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Active Timesheets:</span>
                <span class="font-medium text-brand-navy">{{ departmentStatus.hrFinance.activeTimesheets }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Budget Utilization:</span>
                <span class="font-medium text-brand-orange">{{ departmentStatus.hrFinance.budgetUtilization }}%</span>
            </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Employee Satisfaction:</span>
                <span class="font-medium text-green-600">{{ departmentStatus.hrFinance.employeeSatisfaction }}%</span>
          </div>
            </div>
            <div class="mt-4">
              <router-link to="/demo/hr-finance" class="text-brand-purple hover:text-brand-magenta text-sm font-medium transition-colors">
                View HR & Finance Dashboard →
              </router-link>
        </div>
      </div>

          <!-- Compliance Department -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-teal/20 shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="p-2 bg-gradient-to-br from-brand-teal to-brand-cyan rounded-lg">
                  <Shield class="h-5 w-5 text-white" />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-brand-navy">Compliance</h3>
                  <p class="text-sm text-brand-teal">Legal & Regulatory</p>
          </div>
              </div>
              <div class="flex items-center">
                <div :class="getStatusColor(departmentStatus.compliance.status)" class="w-3 h-3 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-brand-navy">{{ departmentStatus.compliance.status }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Active Audits:</span>
                <span class="font-medium text-brand-navy">{{ departmentStatus.compliance.activeAudits }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Compliance Score:</span>
                <span class="font-medium text-green-600">{{ departmentStatus.compliance.complianceScore }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Risk Level:</span>
                <span class="font-medium text-brand-orange">{{ departmentStatus.compliance.riskLevel }}</span>
              </div>
            </div>
              <div class="mt-4">
              <router-link to="/demo/compliance" class="text-brand-teal hover:text-brand-cyan text-sm font-medium transition-colors">
                View Compliance Dashboard →
                </router-link>
        </div>
      </div>

          <!-- Technology Department -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-cyan/20 shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="p-2 bg-gradient-to-br from-brand-cyan to-brand-teal rounded-lg">
                  <Settings class="h-5 w-5 text-white" />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-brand-navy">Technology</h3>
                  <p class="text-sm text-brand-teal">IT & Development</p>
          </div>
              </div>
              <div class="flex items-center">
                <div :class="getStatusColor(departmentStatus.technology.status)" class="w-3 h-3 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-brand-navy">{{ departmentStatus.technology.status }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Active Projects:</span>
                <span class="font-medium text-brand-navy">{{ departmentStatus.technology.activeProjects }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">System Uptime:</span>
                <span class="font-medium text-green-600">{{ departmentStatus.technology.systemUptime }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Code Quality:</span>
                <span class="font-medium text-brand-orange">{{ departmentStatus.technology.codeQuality }}%</span>
              </div>
            </div>
            <div class="mt-4">
              <router-link to="/demo/integrations" class="text-brand-teal hover:text-brand-cyan text-sm font-medium transition-colors">
                View Technology Dashboard →
              </router-link>
            </div>
          </div>

          <!-- Operations Department -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-magenta/20 shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="p-2 bg-gradient-to-br from-brand-magenta to-brand-purple rounded-lg">
                  <Activity class="h-5 w-5 text-white" />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-brand-navy">Operations</h3>
                  <p class="text-sm text-brand-teal">Core Business</p>
                </div>
              </div>
              <div class="flex items-center">
                <div :class="getStatusColor(departmentStatus.operations.status)" class="w-3 h-3 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-brand-navy">{{ departmentStatus.operations.status }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Active Workflows:</span>
                <span class="font-medium text-brand-navy">{{ departmentStatus.operations.activeWorkflows }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Process Efficiency:</span>
                <span class="font-medium text-green-600">{{ departmentStatus.operations.processEfficiency }}%</span>
            </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-teal">Customer Satisfaction:</span>
                <span class="font-medium text-brand-orange">{{ departmentStatus.operations.customerSatisfaction }}%</span>
          </div>
            </div>
            <div class="mt-4">
              <router-link to="/demo/workflows" class="text-brand-magenta hover:text-brand-purple text-sm font-medium transition-colors">
                View Operations Dashboard →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Charts & Analytics -->
    <div class="py-8 bg-gradient-to-b from-brand-pink/10 to-brand-purple/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-brand-navy">Performance Analytics</h2>
          <p class="mt-4 text-lg text-brand-teal">
            Key performance indicators and trend analysis across all departments
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Revenue Trend Chart -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-cyan/20 shadow-lg p-6">
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Revenue Trend (Last 6 Months)</h3>
            <div class="h-64 flex items-end space-x-2">
              <div v-for="(month, index) in revenueData" :key="index" class="flex-1 flex flex-col items-center">
                <div 
                  :style="{ height: `${(month.value / Math.max(...revenueData.map(d => d.value))) * 200}px` }"
                  class="w-full bg-gradient-to-t from-brand-orange to-brand-magenta rounded-t"
                ></div>
                <div class="text-xs text-brand-teal mt-2">{{ month.month }}</div>
                <div class="text-xs font-medium text-brand-navy">${{ formatCurrency(month.value) }}</div>
              </div>
            </div>
          </div>

          <!-- Department Performance -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-purple/20 shadow-lg p-6">
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Department Performance</h3>
            <div class="space-y-4">
              <div v-for="dept in departmentPerformance" :key="dept.name" class="flex items-center justify-between">
                <div class="flex items-center">
                  <div :class="dept.color" class="w-3 h-3 rounded-full mr-3"></div>
                  <span class="text-sm font-medium text-brand-navy">{{ dept.name }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div :class="dept.color" :style="{ width: `${dept.score}%` }" class="h-2 rounded-full"></div>
                  </div>
                  <span class="text-sm font-medium text-brand-navy">{{ dept.score }}%</span>
                </div>
              </div>
            </div>
          </div>
          </div>

        <!-- Recent Activity Feed -->
        <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-teal/20 shadow-lg p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Recent Company Activity</h3>
          <div class="space-y-3">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3 p-3 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20">
              <div :class="activity.iconBg" class="p-2 rounded-full">
                <component :is="activity.icon" class="h-4 w-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-brand-navy">{{ activity.description }}</p>
                <p class="text-xs text-brand-teal">{{ activity.timestamp }}</p>
            </div>
              <div :class="activity.statusColor" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ activity.status }}
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-brand-navy to-brand-teal">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-brand-cream">
            © 2025 Global Next.
          </p>
        </div>
      </div>
    </footer>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SidebarLayout from '@/components/SidebarLayout.vue'
import Tooltip from '@/components/Tooltip.vue'
import { 
  DollarSign, Briefcase, Users, Activity, RefreshCw, Calendar, Ship, Clock, 
  Shield, Settings, CheckCircle
} from 'lucide-vue-next'

// Reactive data
const lastUpdated = ref('')
const companyMetrics = ref({
  totalRevenue: 2847500,
  activeProjects: 23,
  teamMembers: 47,
  activeUsers: 12,
  systemHealth: 99.8,
  completedThisMonth: 8
})

const departmentStatus = ref({
  marketing: {
    status: 'Active',
    activeCampaigns: 5,
    contentPublished: 23,
    engagementRate: 87
  },
  logistics: {
    status: 'Active',
    activeShipments: 156,
    onTimeDelivery: 94,
    costEfficiency: 78
  },
  hrFinance: {
    status: 'Active',
    activeTimesheets: 34,
    budgetUtilization: 67,
    employeeSatisfaction: 92
  },
  compliance: {
    status: 'Active',
    activeAudits: 3,
    complianceScore: 96,
    riskLevel: 'Low'
  },
  technology: {
    status: 'Active',
    activeProjects: 7,
    systemUptime: 99.9,
    codeQuality: 94
  },
  operations: {
    status: 'Active',
    activeWorkflows: 12,
    processEfficiency: 89,
    customerSatisfaction: 95
  }
})

const revenueData = ref([
  { month: 'Jul', value: 2400000 },
  { month: 'Aug', value: 2600000 },
  { month: 'Sep', value: 2500000 },
  { month: 'Oct', value: 2700000 },
  { month: 'Nov', value: 2800000 },
  { month: 'Dec', value: 2847500 }
])

const departmentPerformance = ref([
  { name: 'Marketing', score: 87, color: 'bg-brand-purple' },
  { name: 'Logistics', score: 94, color: 'bg-brand-orange' },
  { name: 'HR & Finance', score: 92, color: 'bg-brand-pink' },
  { name: 'Compliance', score: 96, color: 'bg-brand-teal' },
  { name: 'Technology', score: 94, color: 'bg-brand-cyan' },
  { name: 'Operations', score: 89, color: 'bg-brand-magenta' }
])

const recentActivity = ref([
  {
    id: 1,
    description: 'New marketing campaign launched successfully',
    timestamp: '2 minutes ago',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    iconBg: 'bg-gradient-to-br from-brand-purple to-brand-magenta'
  },
  {
    id: 2,
    description: 'Logistics shipment #LT-2024-001 delivered on time',
    timestamp: '15 minutes ago',
    status: 'Success',
    statusColor: 'bg-green-100 text-green-800',
    icon: Ship,
    iconBg: 'bg-gradient-to-br from-brand-orange to-brand-magenta'
  },
  {
    id: 3,
    description: 'Monthly compliance audit completed',
    timestamp: '1 hour ago',
    status: 'Passed',
    statusColor: 'bg-green-100 text-green-800',
    icon: Shield,
    iconBg: 'bg-gradient-to-br from-brand-teal to-brand-cyan'
  },
  {
    id: 4,
    description: 'System maintenance scheduled for tonight',
    timestamp: '2 hours ago',
    status: 'Scheduled',
    statusColor: 'bg-blue-100 text-blue-800',
    icon: Settings,
    iconBg: 'bg-gradient-to-br from-brand-cyan to-brand-teal'
  },
  {
    id: 5,
    description: 'New employee onboarding completed',
    timestamp: '3 hours ago',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800',
    icon: Users,
    iconBg: 'bg-gradient-to-br from-brand-pink to-brand-purple'
  }
])

// Computed properties
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('$', '')
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'critical':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

// Methods
const refreshData = () => {
  console.log('Refreshing company data...')
  // Simulate data refresh
  lastUpdated.value = new Date().toLocaleTimeString()
  
  // Update some metrics with slight variations
  companyMetrics.value.activeUsers = Math.floor(Math.random() * 20) + 5
  companyMetrics.value.systemHealth = 99.5 + Math.random() * 0.5
  
  // Update department statuses
  Object.keys(departmentStatus.value).forEach(dept => {
    const deptData = departmentStatus.value[dept as keyof typeof departmentStatus.value]
    if ('activeCampaigns' in deptData) deptData.activeCampaigns += Math.floor(Math.random() * 3) - 1
    if ('activeShipments' in deptData) deptData.activeShipments += Math.floor(Math.random() * 5) - 2
    if ('activeTimesheets' in deptData) deptData.activeTimesheets += Math.floor(Math.random() * 3) - 1
    if ('activeAudits' in deptData) deptData.activeAudits += Math.floor(Math.random() * 2) - 1
    if ('activeProjects' in deptData) deptData.activeProjects += Math.floor(Math.random() * 2) - 1
    if ('activeWorkflows' in deptData) deptData.activeWorkflows += Math.floor(Math.random() * 3) - 1
  })
  
}

// Lifecycle
onMounted(() => {
  lastUpdated.value = new Date().toLocaleTimeString()
  
  // Simulate real-time updates every 30 seconds
  setInterval(() => {
    refreshData()
  }, 30000)
})
</script>
