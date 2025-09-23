<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Carrier Integrations</h1>
            <p class="text-gray-600 mt-2">
              Manage carrier API connections and webhook configurations
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/demo/logistics" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Back to Logistics
            </router-link>
            <button @click="showAddIntegrationModal = true" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <Plus class="h-4 w-4 mr-2" />
              Add Integration
            </button>
          </div>
        </div>
      </div>

      <!-- Integration Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Integrations</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeIntegrations }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Issues</p>
              <p class="text-2xl font-bold text-gray-900">{{ integrationIssues }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Activity class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">API Calls Today</p>
              <p class="text-2xl font-bold text-gray-900">{{ apiCallsToday }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Webhook class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Webhook Events</p>
              <p class="text-2xl font-bold text-gray-900">{{ webhookEvents }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Integrations List -->
      <div class="space-y-6">
        <div
          v-for="integration in integrations"
          :key="integration.id"
          class="card p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${getCarrierColor(integration.carrier)}`">
                <component :is="getCarrierIcon(integration.carrier)" class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ integration.name }}</h3>
                <p class="text-sm text-gray-500">{{ integration.carrier }} - {{ integration.type }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span :class="getIntegrationStatusColor(integration.isActive)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ integration.isActive ? 'Active' : 'Inactive' }}
              </span>
              <div class="flex items-center space-x-2">
                <button @click="testIntegration(integration)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                  <TestTube class="h-4 w-4 mr-1" />
                  Test
                </button>
                <button @click="editIntegration(integration)" class="px-3 py-1 border-2 border-brand-purple text-brand-purple rounded-md hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center text-sm">
                  <Edit class="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button @click="deleteIntegration(integration)" class="px-3 py-1 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center text-sm">
                  <Trash2 class="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Integration Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Connection Details</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">API Key</span>
                  <span class="text-gray-900">{{ integration.apiKey ? '••••••••' : 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Last Sync</span>
                  <span class="text-gray-900">{{ formatDate(integration.lastSync) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Response Time</span>
                  <span class="text-gray-900">{{ integration.responseTime }}ms</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Webhook Configuration</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Webhook URL</span>
                  <span class="text-gray-900">{{ integration.webhookUrl ? 'Configured' : 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Events Today</span>
                  <span class="text-gray-900">{{ integration.eventsToday }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Last Event</span>
                  <span class="text-gray-900">{{ formatDate(integration.lastEvent) }}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Health Status</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Success Rate</span>
                  <span :class="getSuccessRateColor(integration.successRate)" class="font-medium">
                    {{ integration.successRate }}%
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Error Count</span>
                  <span class="text-gray-900">{{ integration.errorCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Uptime</span>
                  <span class="text-gray-900">{{ integration.uptime }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mt-6">
            <h4 class="font-medium text-gray-900 mb-3">Recent Activity</h4>
            <div class="space-y-2">
              <div
                v-for="activity in integration.recentActivity"
                :key="activity.id"
                class="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 rounded"
              >
                <div class="flex items-center space-x-2">
                  <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-gray-500" />
                  <span class="text-gray-900">{{ activity.description }}</span>
                </div>
                <span class="text-gray-500">{{ formatDate(activity.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Integration Modal -->
      <div v-if="showAddIntegrationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Integration</h3>
            <form @submit.prevent="addIntegration" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
                <select v-model="newIntegration.carrier" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300" required>
                  <option value="">Select Carrier</option>
                  <option value="MAERSK">Maersk</option>
                  <option value="MSC">MSC</option>
                  <option value="CMA_CGM">CMA CGM</option>
                  <option value="DHL">DHL</option>
                  <option value="FEDEX">FedEx</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Integration Type</label>
                <select v-model="newIntegration.type" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300" required>
                  <option value="">Select Type</option>
                  <option value="API">API</option>
                  <option value="WEBHOOK">Webhook</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input v-model="newIntegration.name" type="text" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input v-model="newIntegration.apiKey" type="password" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                <input v-model="newIntegration.apiSecret" type="password" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                <input v-model="newIntegration.webhookUrl" type="url" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300" />
              </div>
              
              <div class="flex items-center justify-end space-x-3 pt-4">
                <button type="button" @click="showAddIntegrationModal = false" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
                  Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
                  Add Integration
                </button>
              </div>
            </form>
          </div>
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
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Webhook, 
  TestTube, 
  Edit, 
  Trash2,
  Ship,
  Truck,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-vue-next'

const showAddIntegrationModal = ref(false)
const newIntegration = ref({
  carrier: '',
  type: '',
  name: '',
  apiKey: '',
  apiSecret: '',
  webhookUrl: ''
})

// Mock data
const integrations = ref([
  {
    id: '1',
    name: 'Maersk API Integration',
    carrier: 'MAERSK',
    type: 'API',
    isActive: true,
    apiKey: 'maersk_api_key_123',
    lastSync: new Date('2024-01-20T15:30:00Z'),
    responseTime: 245,
    webhookUrl: 'https://api.global-next.com/webhooks/maersk',
    eventsToday: 47,
    lastEvent: new Date('2024-01-20T14:45:00Z'),
    successRate: 99.2,
    errorCount: 2,
    uptime: 99.8,
    recentActivity: [
      {
        id: '1',
        type: 'sync',
        description: 'Successfully synced 15 shipments',
        timestamp: new Date('2024-01-20T15:30:00Z')
      },
      {
        id: '2',
        type: 'webhook',
        description: 'Received container status update',
        timestamp: new Date('2024-01-20T14:45:00Z')
      },
      {
        id: '3',
        type: 'error',
        description: 'API timeout for tracking request',
        timestamp: new Date('2024-01-20T13:20:00Z')
      }
    ]
  },
  {
    id: '2',
    name: 'DHL Express Integration',
    carrier: 'DHL',
    type: 'API',
    isActive: true,
    apiKey: 'dhl_api_key_456',
    lastSync: new Date('2024-01-20T15:25:00Z'),
    responseTime: 180,
    webhookUrl: 'https://api.global-next.com/webhooks/dhl',
    eventsToday: 23,
    lastEvent: new Date('2024-01-20T15:10:00Z'),
    successRate: 100,
    errorCount: 0,
    uptime: 100,
    recentActivity: [
      {
        id: '4',
        type: 'sync',
        description: 'Successfully synced 8 express shipments',
        timestamp: new Date('2024-01-20T15:25:00Z')
      },
      {
        id: '5',
        type: 'webhook',
        description: 'Package delivered notification',
        timestamp: new Date('2024-01-20T15:10:00Z')
      }
    ]
  },
  {
    id: '3',
    name: 'MSC Webhook Integration',
    carrier: 'MSC',
    type: 'WEBHOOK',
    isActive: false,
    apiKey: null,
    lastSync: new Date('2024-01-19T10:15:00Z'),
    responseTime: 320,
    webhookUrl: 'https://api.global-next.com/webhooks/msc',
    eventsToday: 0,
    lastEvent: new Date('2024-01-19T10:15:00Z'),
    successRate: 95.5,
    errorCount: 5,
    uptime: 98.2,
    recentActivity: [
      {
        id: '6',
        type: 'error',
        description: 'Webhook authentication failed',
        timestamp: new Date('2024-01-19T10:15:00Z')
      }
    ]
  }
])

const activeIntegrations = computed(() => 
  integrations.value.filter(i => i.isActive).length
)

const integrationIssues = computed(() => 
  integrations.value.filter(i => i.errorCount > 0 || !i.isActive).length
)

const apiCallsToday = computed(() => 
  integrations.value.reduce((sum, i) => sum + i.eventsToday, 0)
)

const webhookEvents = computed(() => 
  integrations.value.reduce((sum, i) => sum + i.eventsToday, 0)
)

const testIntegration = (integration: any) => {
  console.log('Testing integration:', integration.name)
  // Mock test result
  alert(`Testing ${integration.name}... Connection successful!`)
}

const editIntegration = (integration: any) => {
  console.log('Editing integration:', integration.name)
  // Open edit modal or navigate to edit page
}

const deleteIntegration = (integration: any) => {
  if (confirm(`Are you sure you want to delete ${integration.name}?`)) {
    const index = integrations.value.findIndex(i => i.id === integration.id)
    if (index > -1) {
      integrations.value.splice(index, 1)
    }
  }
}

const addIntegration = () => {
  const integration = {
    id: Date.now().toString(),
    ...newIntegration.value,
    isActive: true,
    lastSync: new Date(),
    responseTime: 0,
    eventsToday: 0,
    lastEvent: new Date(),
    successRate: 0,
    errorCount: 0,
    uptime: 0,
    recentActivity: []
  }
  
  integrations.value.push(integration)
  showAddIntegrationModal.value = false
  
  // Reset form
  newIntegration.value = {
    carrier: '',
    type: '',
    name: '',
    apiKey: '',
    apiSecret: '',
    webhookUrl: ''
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCarrierColor = (carrier: string) => {
  const colors = {
    MAERSK: 'bg-blue-500',
    MSC: 'bg-green-500',
    CMA_CGM: 'bg-yellow-500',
    DHL: 'bg-red-500',
    FEDEX: 'bg-purple-500'
  }
  return colors[carrier] || 'bg-gray-500'
}

const getCarrierIcon = (carrier: string) => {
  return carrier === 'DHL' || carrier === 'FEDEX' ? Truck : Ship
}

const getIntegrationStatusColor = (isActive: boolean) => {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800'
}

const getSuccessRateColor = (rate: number) => {
  if (rate >= 99) return 'text-green-600'
  if (rate >= 95) return 'text-yellow-600'
  return 'text-red-600'
}

const getActivityIcon = (type: string) => {
  const icons = {
    sync: CheckCircle2,
    webhook: Webhook,
    error: XCircle
  }
  return icons[type] || Clock
}
</script>