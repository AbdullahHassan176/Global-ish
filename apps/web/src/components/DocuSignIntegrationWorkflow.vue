<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="close"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                DocuSign Integration Configuration
              </h3>
              <p class="text-sm text-gray-600">Configure DocuSign e-signature integration for your workflows</p>
            </div>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-6">
          <!-- API Configuration -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">API Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  DocuSign Account ID
                </label>
                <input
                  v-model="configData.accountId"
                  type="text"
                  placeholder="Enter your DocuSign Account ID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Integration Key
                </label>
                <input
                  v-model="configData.integrationKey"
                  type="text"
                  placeholder="Enter your Integration Key"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Client Secret
                </label>
                <input
                  v-model="configData.clientSecret"
                  type="password"
                  placeholder="Enter your Client Secret"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Base URL
                </label>
                <select
                  v-model="configData.baseUrl"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="https://demo.docusign.net">Demo Environment</option>
                  <option value="https://www.docusign.net">Production Environment</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Workflow Settings -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Workflow Settings</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Signing Order
                </label>
                <select
                  v-model="configData.signingOrder"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="parallel">Parallel (All signers at once)</option>
                  <option value="sequential">Sequential (One after another)</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Default Expiration (Days)
                  </label>
                  <input
                    v-model="configData.expirationDays"
                    type="number"
                    min="1"
                    max="365"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Frequency (Days)
                  </label>
                  <input
                    v-model="configData.reminderDays"
                    type="number"
                    min="1"
                    max="30"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div class="space-y-3">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.requireAuthentication"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Require signer authentication</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.allowReassign"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Allow signer reassignment</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.enableReminders"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Enable automatic reminders</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.autoComplete"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Auto-complete when all signed</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Template Configuration -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Template Configuration</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Template ID
                </label>
                <input
                  v-model="configData.defaultTemplateId"
                  type="text"
                  placeholder="Enter default DocuSign template ID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Custom Branding
                </label>
                <div class="space-y-2">
                  <input
                    v-model="configData.brandId"
                    type="text"
                    placeholder="Brand ID (optional)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <input
                    v-model="configData.brandName"
                    type="text"
                    placeholder="Brand Name (optional)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Test Connection -->
          <div class="bg-yellow-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-yellow-900 mb-4">Test Connection</h4>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-yellow-800">Test your DocuSign connection to ensure everything is working correctly.</p>
              </div>
              <button
                @click="testConnection"
                :disabled="!canTestConnection"
                class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex items-center justify-end space-x-3">
          <button
            @click="close"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveConfiguration"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save class="h-4 w-4 mr-2" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, FileText, Save } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const configData = ref({
  accountId: '',
  integrationKey: '',
  clientSecret: '',
  baseUrl: 'https://demo.docusign.net',
  signingOrder: 'parallel',
  expirationDays: 30,
  reminderDays: 3,
  requireAuthentication: true,
  allowReassign: false,
  enableReminders: true,
  autoComplete: true,
  defaultTemplateId: '',
  brandId: '',
  brandName: ''
})

const canTestConnection = computed(() => {
  return configData.value.accountId && configData.value.integrationKey && configData.value.clientSecret
})

const testConnection = () => {
  notify.info('Testing Connection', 'Testing DocuSign connection...')
  // Simulate API test
  setTimeout(() => {
    notify.success('Connection Successful', 'DocuSign connection test passed!')
  }, 2000)
}

const saveConfiguration = () => {
  if (!configData.value.accountId || !configData.value.integrationKey || !configData.value.clientSecret) {
    notify.warning('Validation Error', 'Please fill in all required API configuration fields')
    return
  }

  console.log('Saving DocuSign configuration:', configData.value)
  notify.success('Configuration Saved', 'DocuSign integration has been configured successfully!')
  
  emit('submit', configData.value)
  close()
}

const close = () => {
  // Reset form
  configData.value = {
    accountId: '',
    integrationKey: '',
    clientSecret: '',
    baseUrl: 'https://demo.docusign.net',
    signingOrder: 'parallel',
    expirationDays: 30,
    reminderDays: 3,
    requireAuthentication: true,
    allowReassign: false,
    enableReminders: true,
    autoComplete: true,
    defaultTemplateId: '',
    brandId: '',
    brandName: ''
  }
  emit('close')
}
</script>
