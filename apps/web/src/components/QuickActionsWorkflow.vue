<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Action Categories -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Integration Actions -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-blue-900 mb-4 flex items-center">
                <RefreshCw class="h-5 w-5 mr-2" />
                Integration Actions
              </h3>
              <div class="space-y-3">
                <button
                  @click="handleSyncAllIntegrations"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <RefreshCw class="h-4 w-4 mr-2" />
                  Sync All Integrations
                </button>
                <button
                  @click="handleTestAllConnections"
                  class="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <TestTube class="h-4 w-4 mr-2" />
                  Test All Connections
                </button>
                <button
                  @click="handleConfigureWebhooks"
                  class="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Settings class="h-4 w-4 mr-2" />
                  Configure Webhooks
                </button>
              </div>
            </div>

            <!-- Shipment Actions -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-green-900 mb-4 flex items-center">
                <Ship class="h-5 w-5 mr-2" />
                Shipment Actions
              </h3>
              <div class="space-y-3">
                <button
                  @click="handleBulkShipmentUpdate"
                  class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Package class="h-4 w-4 mr-2" />
                  Bulk Update Shipments
                </button>
                <button
                  @click="handleExportShipments"
                  class="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <FileText class="h-4 w-4 mr-2" />
                  Export Shipments
                </button>
                <button
                  @click="handleShipmentAnalytics"
                  class="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <BarChart3 class="h-4 w-4 mr-2" />
                  Shipment Analytics
                </button>
              </div>
            </div>

            <!-- Container Actions -->
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-purple-900 mb-4 flex items-center">
                <Warehouse class="h-5 w-5 mr-2" />
                Container Actions
              </h3>
              <div class="space-y-3">
                <button
                  @click="handleContainerStatusUpdate"
                  class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <RefreshCw class="h-4 w-4 mr-2" />
                  Update Container Status
                </button>
                <button
                  @click="handleContainerTracking"
                  class="w-full px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <MapPin class="h-4 w-4 mr-2" />
                  Container Tracking
                </button>
                <button
                  @click="handleContainerReports"
                  class="w-full px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <FileText class="h-4 w-4 mr-2" />
                  Container Reports
                </button>
              </div>
            </div>

            <!-- Cost Management -->
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-orange-900 mb-4 flex items-center">
                <DollarSign class="h-5 w-5 mr-2" />
                Cost Management
              </h3>
              <div class="space-y-3">
                <button
                  @click="handleBulkCostUpdate"
                  class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                >
                  <DollarSign class="h-4 w-4 mr-2" />
                  Bulk Cost Update
                </button>
                <button
                  @click="handleCostAnalysis"
                  class="w-full px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <BarChart3 class="h-4 w-4 mr-2" />
                  Cost Analysis
                </button>
                <button
                  @click="handleInvoiceGeneration"
                  class="w-full px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <FileText class="h-4 w-4 mr-2" />
                  Generate Invoices
                </button>
              </div>
            </div>

            <!-- Alert Management -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-red-900 mb-4 flex items-center">
                <AlertTriangle class="h-5 w-5 mr-2" />
                Alert Management
              </h3>
              <div class="space-y-3">
                <button
                  @click="handleBulkAlertUpdate"
                  class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <AlertTriangle class="h-4 w-4 mr-2" />
                  Bulk Alert Update
                </button>
                <button
                  @click="handleAlertEscalation"
                  class="w-full px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <AlertCircle class="h-4 w-4 mr-2" />
                  Escalate Alerts
                </button>
                <button
                  @click="handleAlertReports"
                  class="w-full px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <FileText class="h-4 w-4 mr-2" />
                  Alert Reports
                </button>
              </div>
            </div>

            <!-- System Actions -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Settings class="h-5 w-5 mr-2" />
                System Actions
              </h3>
              <div class="space-y-3">
                <button
                  @click="handleSystemRefresh"
                  class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <RefreshCw class="h-4 w-4 mr-2" />
                  System Refresh
                </button>
                <button
                  @click="handleDataBackup"
                  class="w-full px-4 py-2 border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Database class="h-4 w-4 mr-2" />
                  Data Backup
                </button>
                <button
                  @click="handleSystemMaintenance"
                  class="w-full px-4 py-2 border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Wrench class="h-4 w-4 mr-2" />
                  System Maintenance
                </button>
              </div>
            </div>
          </div>

          <!-- Custom Actions -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Custom Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Action Name</label>
                <input
                  v-model="customAction.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter custom action name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                <select
                  v-model="customAction.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="BULK_UPDATE">Bulk Update</option>
                  <option value="EXPORT">Export</option>
                  <option value="ANALYSIS">Analysis</option>
                  <option value="NOTIFICATION">Notification</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Action Description</label>
              <textarea
                v-model="customAction.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Describe the custom action..."
              ></textarea>
            </div>
            <div class="mt-4 flex justify-end">
              <button
                @click="handleCreateCustomAction"
                class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
              >
                Create Custom Action
              </button>
            </div>
          </div>

          <!-- Action History -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Actions</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="space-y-2">
                <div v-for="action in recentActions" :key="action.id" class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span class="text-sm text-gray-700">{{ action.name }}</span>
                  </div>
                  <span class="text-xs text-gray-500">{{ action.timestamp }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            @click="handleSaveDraft"
            class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Save Draft
          </button>
          <button
            @click="handleExecuteAll"
            class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
          >
            Execute All Actions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  X, 
  RefreshCw, 
  TestTube, 
  Settings, 
  Ship, 
  Package, 
  FileText, 
  BarChart3, 
  Warehouse, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  AlertCircle, 
  Database, 
  Wrench 
} from 'lucide-vue-next'

interface CustomAction {
  name: string
  type: string
  description: string
}

interface RecentAction {
  id: string
  name: string
  timestamp: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
  saveDraft: [data: any]
}>()

const customAction = reactive<CustomAction>({
  name: '',
  type: 'BULK_UPDATE',
  description: ''
})

const recentActions = ref<RecentAction[]>([
  { id: '1', name: 'Sync All Integrations', timestamp: '2 minutes ago' },
  { id: '2', name: 'Bulk Update Shipments', timestamp: '5 minutes ago' },
  { id: '3', name: 'Generate Invoices', timestamp: '10 minutes ago' },
  { id: '4', name: 'Test All Connections', timestamp: '15 minutes ago' }
])

// Integration Actions
const handleSyncAllIntegrations = () => {
  emit('submit', { action: 'SYNC_ALL_INTEGRATIONS', data: {} })
}

const handleTestAllConnections = () => {
  emit('submit', { action: 'TEST_ALL_CONNECTIONS', data: {} })
}

const handleConfigureWebhooks = () => {
  emit('submit', { action: 'CONFIGURE_WEBHOOKS', data: {} })
}

// Shipment Actions
const handleBulkShipmentUpdate = () => {
  emit('submit', { action: 'BULK_SHIPMENT_UPDATE', data: {} })
}

const handleExportShipments = () => {
  emit('submit', { action: 'EXPORT_SHIPMENTS', data: {} })
}

const handleShipmentAnalytics = () => {
  emit('submit', { action: 'SHIPMENT_ANALYTICS', data: {} })
}

// Container Actions
const handleContainerStatusUpdate = () => {
  emit('submit', { action: 'CONTAINER_STATUS_UPDATE', data: {} })
}

const handleContainerTracking = () => {
  emit('submit', { action: 'CONTAINER_TRACKING', data: {} })
}

const handleContainerReports = () => {
  emit('submit', { action: 'CONTAINER_REPORTS', data: {} })
}

// Cost Management
const handleBulkCostUpdate = () => {
  emit('submit', { action: 'BULK_COST_UPDATE', data: {} })
}

const handleCostAnalysis = () => {
  emit('submit', { action: 'COST_ANALYSIS', data: {} })
}

const handleInvoiceGeneration = () => {
  emit('submit', { action: 'INVOICE_GENERATION', data: {} })
}

// Alert Management
const handleBulkAlertUpdate = () => {
  emit('submit', { action: 'BULK_ALERT_UPDATE', data: {} })
}

const handleAlertEscalation = () => {
  emit('submit', { action: 'ALERT_ESCALATION', data: {} })
}

const handleAlertReports = () => {
  emit('submit', { action: 'ALERT_REPORTS', data: {} })
}

// System Actions
const handleSystemRefresh = () => {
  emit('submit', { action: 'SYSTEM_REFRESH', data: {} })
}

const handleDataBackup = () => {
  emit('submit', { action: 'DATA_BACKUP', data: {} })
}

const handleSystemMaintenance = () => {
  emit('submit', { action: 'SYSTEM_MAINTENANCE', data: {} })
}

// Custom Actions
const handleCreateCustomAction = () => {
  if (customAction.name && customAction.description) {
    emit('submit', { action: 'CUSTOM_ACTION', data: { ...customAction } })
    // Reset form
    Object.assign(customAction, {
      name: '',
      type: 'BULK_UPDATE',
      description: ''
    })
  }
}

const handleSaveDraft = () => {
  emit('saveDraft', { action: 'SAVE_DRAFT', data: {} })
}

const handleExecuteAll = () => {
  emit('submit', { action: 'EXECUTE_ALL', data: {} })
}

const close = () => {
  emit('close')
}
</script>
