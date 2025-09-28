<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Export My Data</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Export Information -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Download class="h-5 w-5 text-blue-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Data Export Information</h3>
                <p class="mt-1 text-sm text-blue-700">
                  You can request a copy of all your personal data in a machine-readable format. The export will include all data we have about you.
                </p>
              </div>
            </div>
          </div>

          <!-- Data Categories -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Data Categories to Export</h3>
            <div class="space-y-4">
              <div
                v-for="category in dataCategories"
                :key="category.id"
                class="flex items-center justify-between p-4 border rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="formData.selectedCategories"
                    :value="category.id"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <div>
                    <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                    <p class="text-sm text-gray-500">{{ category.description }}</p>
                    <p class="text-xs text-gray-400">{{ category.recordCount }} records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  v-model="formData.exportFormat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="JSON">JSON (Machine-readable)</option>
                  <option value="CSV">CSV (Spreadsheet compatible)</option>
                  <option value="XML">XML (Structured data)</option>
                  <option value="PDF">PDF (Human-readable)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      v-model="formData.dateFrom"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      v-model="formData.dateTo"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeMetadata"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include metadata and system information</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.includeDeleted"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Include deleted data (if recoverable)</label>
              </div>
            </div>
          </div>

          <!-- Delivery Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                <select
                  v-model="formData.deliveryMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="EMAIL">Email Download Link</option>
                  <option value="SECURE_DOWNLOAD">Secure Download Portal</option>
                  <option value="API">API Access</option>
                </select>
              </div>

              <div v-if="formData.deliveryMethod === 'EMAIL'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-model="formData.emailAddress"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter email address for delivery"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                <select
                  v-model="formData.processingTime"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="STANDARD">Standard (3-5 business days)</option>
                  <option value="PRIORITY">Priority (1-2 business days)</option>
                  <option value="URGENT">Urgent (Same day)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Security & Privacy -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Security & Privacy</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.encryptExport"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Encrypt export with password</label>
              </div>

              <div v-if="formData.encryptExport">
                <label class="block text-sm font-medium text-gray-700 mb-2">Encryption Password</label>
                <input
                  v-model="formData.encryptionPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter encryption password"
                />
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.autoDelete"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Auto-delete export after 30 days</label>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Purpose of Export</label>
                <textarea
                  v-model="formData.purpose"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Describe why you need this data export"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.acknowledgeProcessing"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">I acknowledge that processing may take up to 5 business days</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.acknowledgeSecurity"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">I understand the security implications of data export</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.acknowledgeLegal"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">I confirm this request is for legitimate purposes</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            @click="close"
            class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            @click="handleExport"
            :disabled="!canExport"
            class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Data Export
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, Download } from 'lucide-vue-next'

interface DataCategory {
  id: string
  name: string
  description: string
  recordCount: number
}

interface ExportConfig {
  selectedCategories: string[]
  exportFormat: string
  dateFrom: string
  dateTo: string
  includeMetadata: boolean
  includeDeleted: boolean
  deliveryMethod: string
  emailAddress: string
  processingTime: string
  encryptExport: boolean
  encryptionPassword: string
  autoDelete: boolean
  purpose: string
  acknowledgeProcessing: boolean
  acknowledgeSecurity: boolean
  acknowledgeLegal: boolean
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  export: [data: ExportConfig]
}>()

const dataCategories = ref<DataCategory[]>([
  {
    id: 'profile',
    name: 'Profile Information',
    description: 'Personal details, contact information, preferences',
    recordCount: 15
  },
  {
    id: 'activity',
    name: 'Activity Logs',
    description: 'Login history, actions, system interactions',
    recordCount: 1250
  },
  {
    id: 'documents',
    name: 'Documents & Files',
    description: 'Uploaded files, generated documents, attachments',
    recordCount: 45
  },
  {
    id: 'communications',
    name: 'Communications',
    description: 'Messages, emails, notifications, support tickets',
    recordCount: 320
  },
  {
    id: 'preferences',
    name: 'Settings & Preferences',
    description: 'Account settings, privacy preferences, notifications',
    recordCount: 28
  },
  {
    id: 'analytics',
    name: 'Usage Analytics',
    description: 'Usage patterns, performance data, analytics',
    recordCount: 890
  }
])

const formData = reactive<ExportConfig>({
  selectedCategories: ['profile', 'activity', 'documents', 'communications', 'preferences'],
  exportFormat: 'JSON',
  dateFrom: '',
  dateTo: '',
  includeMetadata: true,
  includeDeleted: false,
  deliveryMethod: 'EMAIL',
  emailAddress: '',
  processingTime: 'STANDARD',
  encryptExport: true,
  encryptionPassword: '',
  autoDelete: true,
  purpose: '',
  acknowledgeProcessing: false,
  acknowledgeSecurity: false,
  acknowledgeLegal: false
})

const canExport = computed(() => {
  return formData.selectedCategories.length > 0 &&
         formData.acknowledgeProcessing &&
         formData.acknowledgeSecurity &&
         formData.acknowledgeLegal &&
         (formData.deliveryMethod !== 'EMAIL' || formData.emailAddress)
})

const handleExport = () => {
  const exportData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('export', exportData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    selectedCategories: ['profile', 'activity', 'documents', 'communications', 'preferences'],
    exportFormat: 'JSON',
    dateFrom: '',
    dateTo: '',
    includeMetadata: true,
    includeDeleted: false,
    deliveryMethod: 'EMAIL',
    emailAddress: '',
    processingTime: 'STANDARD',
    encryptExport: true,
    encryptionPassword: '',
    autoDelete: true,
    purpose: '',
    acknowledgeProcessing: false,
    acknowledgeSecurity: false,
    acknowledgeLegal: false
  })
  emit('close')
}
</script>
