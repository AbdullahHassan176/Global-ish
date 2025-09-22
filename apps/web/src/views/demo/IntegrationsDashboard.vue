<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Integrations Hub</h1>
        <p class="text-gray-600 mt-2">
          Manage credentials, webhooks, and tokenization bridge for secure data sharing
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Key class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Credentials</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeCredentials }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <Webhook class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Webhook Endpoints</p>
              <p class="text-2xl font-bold text-gray-900">{{ webhookEndpoints }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Shield class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Events Published</p>
              <p class="text-2xl font-bold text-gray-900">{{ eventsPublished }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <Activity class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Success Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ successRate }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'credentials'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'credentials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Credential Vault
            </button>
            <button
              @click="activeTab = 'webhooks'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'webhooks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Webhook Registry
            </button>
            <button
              @click="activeTab = 'tokenization'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'tokenization'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Tokenization Bridge
            </button>
            <button
              @click="activeTab = 'delivery-log'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'delivery-log'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Delivery Log
            </button>
          </nav>
        </div>
      </div>

      <!-- Credential Vault Tab -->
      <div v-if="activeTab === 'credentials'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Credential Vault</h2>
          <button @click="showAddCredentialModal = true" class="btn btn-primary">
            <Plus class="h-4 w-4 mr-2" />
            Add Credential
          </button>
        </div>

        <!-- Credentials List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="credential in mockCredentials"
            :key="credential.id"
            class="card p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div :class="`w-10 h-10 rounded-lg flex items-center justify-center ${getProviderColor(credential.provider)}`">
                  <component :is="getProviderIcon(credential.provider)" class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ credential.name }}</h3>
                  <p class="text-sm text-gray-500">{{ credential.provider }}</p>
                </div>
              </div>
              <span :class="credential.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ credential.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <div class="space-y-2 text-sm mb-4">
              <div class="flex justify-between">
                <span class="text-gray-500">Type</span>
                <span class="text-gray-900">{{ credential.type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Created</span>
                <span class="text-gray-900">{{ formatDate(credential.createdAt) }}</span>
              </div>
              <div v-if="credential.expiresAt" class="flex justify-between">
                <span class="text-gray-500">Expires</span>
                <span class="text-gray-900">{{ formatDate(credential.expiresAt) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button class="btn btn-outline btn-sm flex-1">
                <TestTube class="h-4 w-4 mr-1" />
                Test
              </button>
              <button class="btn btn-outline btn-sm">
                <Edit class="h-4 w-4" />
              </button>
              <button class="btn btn-outline btn-sm text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Webhook Registry Tab -->
      <div v-if="activeTab === 'webhooks'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Webhook Registry</h2>
          <button @click="showAddWebhookModal = true" class="btn btn-primary">
            <Plus class="h-4 w-4 mr-2" />
            Add Webhook
          </button>
        </div>

        <!-- Webhooks List -->
        <div class="space-y-4">
          <div
            v-for="webhook in mockWebhooks"
            :key="webhook.id"
            class="card p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ webhook.name }}</h3>
                <p class="text-sm text-gray-500">{{ webhook.url }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ webhook.isActive ? 'Active' : 'Inactive' }}
                </span>
                <div class="flex items-center space-x-2">
                  <button class="btn btn-outline btn-sm">
                    <TestTube class="h-4 w-4 mr-1" />
                    Test
                  </button>
                  <button class="btn btn-outline btn-sm">
                    <Edit class="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button class="btn btn-outline btn-sm text-red-600 hover:text-red-800">
                    <Trash2 class="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Events</h4>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="event in webhook.events"
                    :key="event"
                    class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {{ event }}
                  </span>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-2">Recent Activity</h4>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Last Delivery</span>
                    <span class="text-gray-900">{{ webhook.lastDelivery }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Success Rate</span>
                    <span class="text-green-600">{{ webhook.successRate }}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-2">Configuration</h4>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Timeout</span>
                    <span class="text-gray-900">{{ webhook.timeout }}ms</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Retry Policy</span>
                    <span class="text-gray-900">{{ webhook.maxAttempts }} attempts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tokenization Bridge Tab -->
      <div v-if="activeTab === 'tokenization'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Tokenization Bridge</h2>
          <div class="flex items-center space-x-4">
            <button class="btn btn-outline">
              <Settings class="h-4 w-4 mr-2" />
              Configure Events
            </button>
            <button class="btn btn-primary">
              <Shield class="h-4 w-4 mr-2" />
              Publish Events
            </button>
          </div>
        </div>

        <!-- Event Configuration -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Event Publishing Configuration</h3>
          <div class="space-y-4">
            <div
              v-for="eventType in eventTypes"
              :key="eventType.type"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ eventType.name }}</h4>
                <p class="text-sm text-gray-500">{{ eventType.description }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">{{ eventType.count }} events</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="eventType.enabled"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Dashboard -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Published KPIs</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="kpi in mockKPIs"
              :key="kpi.id"
              class="p-4 border rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">{{ kpi.name }}</h4>
                <span :class="kpi.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ kpi.isPublished ? 'Published' : 'Draft' }}
                </span>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ kpi.value }}</p>
              <p class="text-sm text-gray-500">{{ kpi.period }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Log Tab -->
      <div v-if="activeTab === 'delivery-log'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Delivery Log</h2>
          <div class="flex items-center space-x-4">
            <select class="input">
              <option>All Status</option>
              <option>Delivered</option>
              <option>Failed</option>
              <option>Retrying</option>
            </select>
            <button class="btn btn-outline">
              <RefreshCw class="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <!-- Delivery Log Table -->
        <div class="card">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Webhook
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="delivery in mockDeliveries" :key="delivery.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ delivery.webhookName }}</div>
                    <div class="text-sm text-gray-500">{{ delivery.url }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ delivery.eventType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getDeliveryStatusColor(delivery.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ delivery.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ delivery.attemptCount }}/{{ delivery.maxAttempts }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span v-if="delivery.responseCode" :class="delivery.responseCode < 400 ? 'text-green-600' : 'text-red-600'">
                      {{ delivery.responseCode }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(delivery.timestamp) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button v-if="delivery.status === 'FAILED'" class="text-blue-600 hover:text-blue-900">
                        Retry
                      </button>
                      <button class="text-gray-600 hover:text-gray-900">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Credential Modal -->
      <div v-if="showAddCredentialModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Credential</h3>
            <form @submit.prevent="addCredential" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input v-model="newCredential.name" type="text" class="input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                <select v-model="newCredential.provider" class="input w-full" required>
                  <option value="">Select Provider</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="slack">Slack</option>
                  <option value="microsoft">Microsoft</option>
                  <option value="google">Google</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select v-model="newCredential.type" class="input w-full" required>
                  <option value="">Select Type</option>
                  <option value="OAUTH2">OAuth2</option>
                  <option value="API_KEY">API Key</option>
                  <option value="BASIC_AUTH">Basic Auth</option>
                  <option value="JWT">JWT</option>
                </select>
              </div>
              
              <div class="flex items-center justify-end space-x-3 pt-4">
                <button type="button" @click="showAddCredentialModal = false" class="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  Add Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Add Webhook Modal -->
      <div v-if="showAddWebhookModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Webhook</h3>
            <form @submit.prevent="addWebhook" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input v-model="newWebhook.name" type="text" class="input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input v-model="newWebhook.url" type="url" class="input w-full" required />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Events</label>
                <div class="space-y-2">
                  <label v-for="event in availableEvents" :key="event" class="flex items-center">
                    <input v-model="newWebhook.events" :value="event" type="checkbox" class="mr-2" />
                    <span class="text-sm text-gray-700">{{ event }}</span>
                  </label>
                </div>
              </div>
              
              <div class="flex items-center justify-end space-x-3 pt-4">
                <button type="button" @click="showAddWebhookModal = false" class="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  Add Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Key, 
  Webhook, 
  Shield, 
  Activity, 
  Plus, 
  TestTube, 
  Edit, 
  Trash2, 
  Settings, 
  RefreshCw,
  Github,
  Slack,
  Mail,
  Cloud
} from 'lucide-vue-next'

const activeTab = ref<'credentials' | 'webhooks' | 'tokenization' | 'delivery-log'>('credentials')
const showAddCredentialModal = ref(false)
const showAddWebhookModal = ref(false)

const newCredential = ref({
  name: '',
  provider: '',
  type: ''
})

const newWebhook = ref({
  name: '',
  url: '',
  events: [] as string[]
})

const availableEvents = [
  'shipment.created',
  'milestone.updated',
  'doc.hashed',
  'invoice.created',
  'kpi.updated'
]

// Mock data
const mockCredentials = ref([
  {
    id: '1',
    name: 'Salesforce Production',
    provider: 'salesforce',
    type: 'OAUTH2',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-07-15')
  },
  {
    id: '2',
    name: 'HubSpot API Key',
    provider: 'hubspot',
    type: 'API_KEY',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    expiresAt: null
  },
  {
    id: '3',
    name: 'Slack Bot Token',
    provider: 'slack',
    type: 'JWT',
    isActive: false,
    createdAt: new Date('2024-01-05'),
    expiresAt: new Date('2024-04-05')
  }
])

const mockWebhooks = ref([
  {
    id: '1',
    name: 'Shipment Updates',
    url: 'https://api.example.com/webhooks/shipments',
    isActive: true,
    events: ['shipment.created', 'milestone.updated'],
    lastDelivery: '2 min ago',
    successRate: 98.5,
    timeout: 30000,
    maxAttempts: 3
  },
  {
    id: '2',
    name: 'Invoice Notifications',
    url: 'https://api.example.com/webhooks/invoices',
    isActive: true,
    events: ['invoice.created'],
    lastDelivery: '1 hour ago',
    successRate: 100,
    timeout: 30000,
    maxAttempts: 3
  }
])

const eventTypes = ref([
  {
    type: 'shipment.created',
    name: 'Shipment Created',
    description: 'Triggered when a new shipment is created',
    enabled: true,
    count: 24
  },
  {
    type: 'milestone.updated',
    name: 'Milestone Updated',
    description: 'Triggered when a milestone status changes',
    enabled: true,
    count: 156
  },
  {
    type: 'doc.hashed',
    name: 'Document Hashed',
    description: 'Triggered when a document is hashed and anchored',
    enabled: false,
    count: 89
  },
  {
    type: 'invoice.created',
    name: 'Invoice Created',
    description: 'Triggered when a new invoice is generated',
    enabled: true,
    count: 12
  },
  {
    type: 'kpi.updated',
    name: 'KPI Updated',
    description: 'Triggered when KPI values are updated',
    enabled: false,
    count: 45
  }
])

const mockKPIs = ref([
  {
    id: '1',
    name: 'Shipment Volume',
    value: '1,247',
    period: '2024-01',
    isPublished: true
  },
  {
    id: '2',
    name: 'On-Time Delivery',
    value: '94.2%',
    period: '2024-01',
    isPublished: true
  },
  {
    id: '3',
    name: 'Average Cost',
    value: '$2,450',
    period: '2024-01',
    isPublished: false
  },
  {
    id: '4',
    name: 'Customer Satisfaction',
    value: '4.8/5',
    period: '2024-01',
    isPublished: true
  }
])

const mockDeliveries = ref([
  {
    id: '1',
    webhookName: 'Shipment Updates',
    url: 'https://api.example.com/webhooks/shipments',
    eventType: 'shipment.created',
    status: 'DELIVERED',
    attemptCount: 1,
    maxAttempts: 3,
    responseCode: 200,
    timestamp: new Date('2024-01-20T15:30:00Z')
  },
  {
    id: '2',
    webhookName: 'Invoice Notifications',
    url: 'https://api.example.com/webhooks/invoices',
    eventType: 'invoice.created',
    status: 'FAILED',
    attemptCount: 3,
    maxAttempts: 3,
    responseCode: 500,
    timestamp: new Date('2024-01-20T14:45:00Z')
  },
  {
    id: '3',
    webhookName: 'Shipment Updates',
    url: 'https://api.example.com/webhooks/shipments',
    eventType: 'milestone.updated',
    status: 'RETRYING',
    attemptCount: 2,
    maxAttempts: 3,
    responseCode: 408,
    timestamp: new Date('2024-01-20T13:20:00Z')
  }
])

const activeCredentials = computed(() => mockCredentials.value.filter(c => c.isActive).length)
const webhookEndpoints = computed(() => mockWebhooks.value.filter(w => w.isActive).length)
const eventsPublished = computed(() => eventTypes.value.reduce((sum, event) => sum + event.count, 0))
const successRate = computed(() => {
  const totalDeliveries = mockDeliveries.value.length
  const successfulDeliveries = mockDeliveries.value.filter(d => d.status === 'DELIVERED').length
  return totalDeliveries > 0 ? Math.round((successfulDeliveries / totalDeliveries) * 100) : 0
})

const addCredential = () => {
  const credential = {
    id: Date.now().toString(),
    ...newCredential.value,
    isActive: true,
    createdAt: new Date(),
    expiresAt: null
  }
  
  mockCredentials.value.push(credential)
  showAddCredentialModal.value = false
  
  // Reset form
  newCredential.value = {
    name: '',
    provider: '',
    type: ''
  }
}

const addWebhook = () => {
  const webhook = {
    id: Date.now().toString(),
    ...newWebhook.value,
    isActive: true,
    lastDelivery: 'Never',
    successRate: 0,
    timeout: 30000,
    maxAttempts: 3
  }
  
  mockWebhooks.value.push(webhook)
  showAddWebhookModal.value = false
  
  // Reset form
  newWebhook.value = {
    name: '',
    url: '',
    events: []
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getProviderColor = (provider: string) => {
  const colors = {
    salesforce: 'bg-blue-500',
    hubspot: 'bg-orange-500',
    slack: 'bg-purple-500',
    microsoft: 'bg-gray-500',
    google: 'bg-red-500'
  }
  return colors[provider] || 'bg-gray-500'
}

const getProviderIcon = (provider: string) => {
  const icons = {
    salesforce: Cloud,
    hubspot: Mail,
    slack: Slack,
    microsoft: Cloud,
    google: Cloud
  }
  return icons[provider] || Cloud
}

const getDeliveryStatusColor = (status: string) => {
  const colors = {
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    RETRYING: 'bg-yellow-100 text-yellow-800',
    PENDING: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
