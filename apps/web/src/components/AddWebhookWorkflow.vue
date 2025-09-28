<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Add Webhook</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Webhook Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="e.g., Shipment Updates"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                <input
                  v-model="formData.url"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="https://api.example.com/webhooks/shipments"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                <select
                  v-model="formData.environment"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="PRODUCTION">Production</option>
                  <option value="STAGING">Staging</option>
                  <option value="DEVELOPMENT">Development</option>
                  <option value="TESTING">Testing</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  v-model="formData.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <!-- Events Configuration -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Events Configuration</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Select Events</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="event in availableEvents" :key="event.id" class="flex items-center">
                      <input
                        v-model="formData.events"
                        :value="event.id"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">{{ event.name }}</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Custom Events (comma-separated)</label>
                  <input
                    v-model="formData.customEvents"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="custom.event1, custom.event2"
                  />
                </div>
              </div>
            </div>

            <!-- Authentication -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Authentication Type</label>
                  <select
                    v-model="formData.authType"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="NONE">None</option>
                    <option value="API_KEY">API Key</option>
                    <option value="BASIC_AUTH">Basic Auth</option>
                    <option value="BEARER_TOKEN">Bearer Token</option>
                    <option value="HMAC">HMAC Signature</option>
                  </select>
                </div>

                <div v-if="formData.authType === 'API_KEY'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <input
                    v-model="formData.apiKey"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Enter API key"
                  />
                </div>

                <div v-if="formData.authType === 'BASIC_AUTH'">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        v-model="formData.username"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        v-model="formData.password"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                </div>

                <div v-if="formData.authType === 'BEARER_TOKEN'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bearer Token</label>
                  <input
                    v-model="formData.bearerToken"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Enter bearer token"
                  />
                </div>

                <div v-if="formData.authType === 'HMAC'">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                      <input
                        v-model="formData.secretKey"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter secret key"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
                      <select
                        v-model="formData.algorithm"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      >
                        <option value="SHA256">SHA256</option>
                        <option value="SHA1">SHA1</option>
                        <option value="MD5">MD5</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Configuration -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Configuration</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                    <input
                      v-model="formData.timeout"
                      type="number"
                      min="1"
                      max="300"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Max Retry Attempts</label>
                    <input
                      v-model="formData.maxRetries"
                      type="number"
                      min="0"
                      max="10"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="3"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Retry Delay (seconds)</label>
                    <input
                      v-model="formData.retryDelay"
                      type="number"
                      min="1"
                      max="3600"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
                    <input
                      v-model="formData.batchSize"
                      type="number"
                      min="1"
                      max="100"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Headers Configuration -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Headers Configuration</h3>
              <div class="space-y-4">
                <div v-for="(header, index) in formData.headers" :key="index" class="flex items-center space-x-4">
                  <div class="flex-1">
                    <input
                      v-model="header.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Header name"
                    />
                  </div>
                  <div class="flex-1">
                    <input
                      v-model="header.value"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Header value"
                    />
                  </div>
                  <button
                    type="button"
                    @click="removeHeader(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="addHeader"
                  class="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                >
                  + Add Header
                </button>
              </div>
            </div>

            <!-- Advanced Settings -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Activate webhook immediately</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.enableLogging"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Enable detailed logging</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.verifySSL"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Verify SSL certificates</label>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Optional description for this webhook"
                  ></textarea>
                </div>
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
              Add Webhook
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'

interface Header {
  name: string
  value: string
}

interface Webhook {
  name: string
  url: string
  environment: string
  priority: string
  events: string[]
  customEvents: string
  authType: string
  apiKey: string
  username: string
  password: string
  bearerToken: string
  secretKey: string
  algorithm: string
  timeout: number
  maxRetries: number
  retryDelay: number
  batchSize: number
  headers: Header[]
  isActive: boolean
  enableLogging: boolean
  verifySSL: boolean
  description: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Webhook]
  saveDraft: [data: Webhook]
}>()

const availableEvents = ref([
  { id: 'shipment.created', name: 'Shipment Created' },
  { id: 'milestone.updated', name: 'Milestone Updated' },
  { id: 'doc.hashed', name: 'Document Hashed' },
  { id: 'invoice.created', name: 'Invoice Created' },
  { id: 'kpi.updated', name: 'KPI Updated' },
  { id: 'alert.triggered', name: 'Alert Triggered' },
  { id: 'user.created', name: 'User Created' },
  { id: 'user.updated', name: 'User Updated' }
])

const formData = reactive<Webhook>({
  name: '',
  url: '',
  environment: 'PRODUCTION',
  priority: 'MEDIUM',
  events: [],
  customEvents: '',
  authType: 'NONE',
  apiKey: '',
  username: '',
  password: '',
  bearerToken: '',
  secretKey: '',
  algorithm: 'SHA256',
  timeout: 30,
  maxRetries: 3,
  retryDelay: 60,
  batchSize: 10,
  headers: [],
  isActive: true,
  enableLogging: true,
  verifySSL: true,
  description: ''
})

const addHeader = () => {
  formData.headers.push({ name: '', value: '' })
}

const removeHeader = (index: number) => {
  formData.headers.splice(index, 1)
}

const handleSubmit = () => {
  const webhookData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', webhookData)
}

const handleSaveDraft = () => {
  const webhookData = {
    ...formData,
    id: Date.now().toString(),
    status: 'DRAFT'
  }
  emit('saveDraft', webhookData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    name: '',
    url: '',
    environment: 'PRODUCTION',
    priority: 'MEDIUM',
    events: [],
    customEvents: '',
    authType: 'NONE',
    apiKey: '',
    username: '',
    password: '',
    bearerToken: '',
    secretKey: '',
    algorithm: 'SHA256',
    timeout: 30,
    maxRetries: 3,
    retryDelay: 60,
    batchSize: 10,
    headers: [],
    isActive: true,
    enableLogging: true,
    verifySSL: true,
    description: ''
  })
  emit('close')
}
</script>
