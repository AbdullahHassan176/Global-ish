<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Carrier Integrations</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Integration Selection -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Select Carrier Integration</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="carrier in carriers"
                  :key="carrier.id"
                  @click="selectCarrier(carrier.id)"
                  :class="[
                    'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                    selectedCarrier === carrier.id
                      ? 'border-brand-teal bg-brand-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Truck class="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">{{ carrier.name }}</h4>
                      <p class="text-sm text-gray-500">{{ carrier.type }}</p>
                    </div>
                  </div>
                  <div class="mt-2">
                    <span :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      carrier.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ carrier.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Integration Configuration -->
            <div v-if="selectedCarrier" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Integration Configuration</h3>
              <div class="space-y-6">
                <!-- API Configuration -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-3">API Configuration</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <input
                        v-model="formData.apiKey"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter API key"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                      <input
                        v-model="formData.apiSecret"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter API secret"
                      />
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
                    <input
                      v-model="formData.baseUrl"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="https://api.carrier.com"
                    />
                  </div>
                </div>

                <!-- Service Configuration -->
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-3">Service Configuration</h4>
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <input
                        v-model="formData.enableTracking"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">Enable Shipment Tracking</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        v-model="formData.enableRates"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">Enable Rate Quoting</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        v-model="formData.enableLabels"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">Enable Label Generation</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        v-model="formData.enableNotifications"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">Enable Status Notifications</label>
                    </div>
                  </div>
                </div>

                <!-- Webhook Configuration -->
                <div class="bg-green-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-3">Webhook Configuration</h4>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                      <input
                        v-model="formData.webhookUrl"
                        type="url"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="https://your-domain.com/webhooks/carrier"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Webhook Events</label>
                      <div class="space-y-2">
                        <div v-for="event in webhookEvents" :key="event.id" class="flex items-center">
                          <input
                            v-model="formData.webhookEvents"
                            :value="event.id"
                            type="checkbox"
                            class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                          />
                          <label class="ml-2 text-sm text-gray-700">{{ event.name }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Test Configuration -->
                <div class="bg-yellow-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-3">Test Configuration</h4>
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <input
                        v-model="formData.useSandbox"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">Use Sandbox Environment</label>
                    </div>
                    <div v-if="formData.useSandbox">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Sandbox URL</label>
                      <input
                        v-model="formData.sandboxUrl"
                        type="url"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="https://sandbox-api.carrier.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Integration Status -->
            <div v-if="selectedCarrier" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Integration Status</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">Connection Status</span>
                    <span :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      connectionStatus === 'CONNECTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ connectionStatus }}
                    </span>
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">Last Sync</span>
                    <span class="text-sm text-gray-500">{{ lastSync }}</span>
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">Total Shipments</span>
                    <span class="text-sm font-medium text-gray-900">{{ totalShipments }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Integration Actions -->
            <div v-if="selectedCarrier" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Integration Actions</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  @click="handleTestConnection"
                  type="button"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <TestTube class="h-4 w-4 mr-2" />
                  Test Connection
                </button>
                <button
                  @click="handleSyncData"
                  type="button"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <RefreshCw class="h-4 w-4 mr-2" />
                  Sync Data
                </button>
                <button
                  @click="handleViewLogs"
                  type="button"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <FileText class="h-4 w-4 mr-2" />
                  View Logs
                </button>
                <button
                  @click="handleConfigureWebhooks"
                  type="button"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Settings class="h-4 w-4 mr-2" />
                  Configure Webhooks
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
            >
              Save Integration
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Truck, TestTube, RefreshCw, FileText, Settings } from 'lucide-vue-next'

interface Carrier {
  id: string
  name: string
  type: string
  status: string
}

interface IntegrationConfig {
  apiKey: string
  apiSecret: string
  baseUrl: string
  enableTracking: boolean
  enableRates: boolean
  enableLabels: boolean
  enableNotifications: boolean
  webhookUrl: string
  webhookEvents: string[]
  useSandbox: boolean
  sandboxUrl: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
  saveDraft: [data: any]
}>()

const selectedCarrier = ref<string>('')
const connectionStatus = ref<string>('CONNECTED')
const lastSync = ref<string>('2 minutes ago')
const totalShipments = ref<number>(1247)

const carriers = ref<Carrier[]>([
  { id: 'fedex', name: 'FedEx', type: 'Express', status: 'ACTIVE' },
  { id: 'ups', name: 'UPS', type: 'Express', status: 'ACTIVE' },
  { id: 'dhl', name: 'DHL', type: 'Express', status: 'INACTIVE' },
  { id: 'usps', name: 'USPS', type: 'Postal', status: 'ACTIVE' },
  { id: 'amazon', name: 'Amazon Logistics', type: 'E-commerce', status: 'ACTIVE' },
  { id: 'ontrac', name: 'OnTrac', type: 'Regional', status: 'INACTIVE' }
])

const webhookEvents = ref([
  { id: 'shipment_created', name: 'Shipment Created' },
  { id: 'shipment_updated', name: 'Shipment Updated' },
  { id: 'shipment_delivered', name: 'Shipment Delivered' },
  { id: 'shipment_exception', name: 'Shipment Exception' },
  { id: 'rate_quote', name: 'Rate Quote' },
  { id: 'label_generated', name: 'Label Generated' }
])

const formData = reactive<IntegrationConfig>({
  apiKey: '',
  apiSecret: '',
  baseUrl: '',
  enableTracking: true,
  enableRates: true,
  enableLabels: true,
  enableNotifications: true,
  webhookUrl: '',
  webhookEvents: [],
  useSandbox: false,
  sandboxUrl: ''
})

const selectCarrier = (carrierId: string) => {
  selectedCarrier.value = carrierId
  // Load carrier-specific configuration
  const carrier = carriers.value.find(c => c.id === carrierId)
  if (carrier) {
    // Set default values based on carrier
    formData.baseUrl = `https://api.${carrierId}.com`
    formData.webhookUrl = `https://your-domain.com/webhooks/${carrierId}`
  }
}

const handleTestConnection = () => {
  emit('submit', { action: 'TEST_CONNECTION', carrierId: selectedCarrier.value, data: formData })
}

const handleSyncData = () => {
  emit('submit', { action: 'SYNC_DATA', carrierId: selectedCarrier.value, data: formData })
}

const handleViewLogs = () => {
  emit('submit', { action: 'VIEW_LOGS', carrierId: selectedCarrier.value, data: formData })
}

const handleConfigureWebhooks = () => {
  emit('submit', { action: 'CONFIGURE_WEBHOOKS', carrierId: selectedCarrier.value, data: formData })
}

const handleSubmit = () => {
  const integrationData = {
    ...formData,
    carrierId: selectedCarrier.value,
    id: Date.now().toString()
  }
  emit('submit', integrationData)
}

const handleSaveDraft = () => {
  const integrationData = {
    ...formData,
    carrierId: selectedCarrier.value,
    id: Date.now().toString(),
    status: 'DRAFT'
  }
  emit('saveDraft', integrationData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    apiKey: '',
    apiSecret: '',
    baseUrl: '',
    enableTracking: true,
    enableRates: true,
    enableLabels: true,
    enableNotifications: true,
    webhookUrl: '',
    webhookEvents: [],
    useSandbox: false,
    sandboxUrl: ''
  })
  selectedCarrier.value = ''
  emit('close')
}
</script>
