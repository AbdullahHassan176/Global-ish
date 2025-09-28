<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Test Webhook</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Webhook Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Webhook Details</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Name:</span>
                <span class="font-medium">{{ webhookName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">URL:</span>
                <span class="font-medium text-sm">{{ webhookUrl }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium">{{ webhookStatus }}</span>
              </div>
            </div>
          </div>

          <!-- Test Configuration -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Test Configuration</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Test Event Type</label>
                <select
                  v-model="formData.eventType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select Event Type</option>
                  <option value="shipment.created">Shipment Created</option>
                  <option value="milestone.updated">Milestone Updated</option>
                  <option value="doc.hashed">Document Hashed</option>
                  <option value="invoice.created">Invoice Created</option>
                  <option value="kpi.updated">KPI Updated</option>
                  <option value="custom">Custom Event</option>
                </select>
              </div>

              <div v-if="formData.eventType === 'custom'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Custom Event Type</label>
                <input
                  v-model="formData.customEventType"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="custom.event.type"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Test Payload (JSON)</label>
                <textarea
                  v-model="formData.testPayload"
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder='{"event": "shipment.created", "data": {...}}'
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                  <input
                    v-model="formData.timeout"
                    type="number"
                    min="1"
                    max="60"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
                  <input
                    v-model="formData.retryAttempts"
                    type="number"
                    min="0"
                    max="5"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="3"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Test Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Test Options</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.validateResponse"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Validate response format</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.checkHeaders"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Check response headers</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.testAuthentication"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Test authentication</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.saveResults"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Save test results</label>
              </div>
            </div>
          </div>

          <!-- Test Progress -->
          <div v-if="isTesting" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Test Progress</h3>
            <div class="space-y-4">
              <div class="bg-gray-200 rounded-full h-2">
                <div class="bg-brand-teal h-2 rounded-full transition-all duration-300" :style="{ width: `${testProgress}%` }"></div>
              </div>
              <div class="text-center">
                <span class="text-sm text-gray-600">{{ testStatus }}</span>
              </div>
            </div>
          </div>

          <!-- Test Results -->
          <div v-if="testResults" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Test Results</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Status:</span>
                  <span :class="testResults.success ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                    {{ testResults.success ? 'Success' : 'Failed' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Response Code:</span>
                  <span class="text-sm font-medium">{{ testResults.responseCode }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Response Time:</span>
                  <span class="text-sm font-medium">{{ testResults.responseTime }}ms</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Content Length:</span>
                  <span class="text-sm font-medium">{{ testResults.contentLength }} bytes</span>
                </div>
                <div v-if="testResults.error" class="mt-4">
                  <span class="text-sm text-gray-600">Error:</span>
                  <p class="text-sm text-red-600 mt-1">{{ testResults.error }}</p>
                </div>
                <div v-if="testResults.responseBody" class="mt-4">
                  <span class="text-sm text-gray-600">Response Body:</span>
                  <pre class="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">{{ testResults.responseBody }}</pre>
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
            @click="handleTest"
            :disabled="isTesting"
            class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isTesting ? 'Testing...' : 'Run Test' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'

interface TestConfig {
  eventType: string
  customEventType: string
  testPayload: string
  timeout: number
  retryAttempts: number
  validateResponse: boolean
  checkHeaders: boolean
  testAuthentication: boolean
  saveResults: boolean
}

interface TestResults {
  success: boolean
  responseCode: number
  responseTime: number
  contentLength: number
  error?: string
  responseBody?: string
}

const props = defineProps<{
  isOpen: boolean
  webhookName?: string
  webhookUrl?: string
  webhookStatus?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [data: TestConfig]
  saveDraft: [data: TestConfig]
}>()

const isTesting = ref(false)
const testProgress = ref(0)
const testStatus = ref('')
const testResults = ref<TestResults | null>(null)

const formData = reactive<TestConfig>({
  eventType: '',
  customEventType: '',
  testPayload: '',
  timeout: 30,
  retryAttempts: 3,
  validateResponse: true,
  checkHeaders: true,
  testAuthentication: true,
  saveResults: true
})

const handleTest = () => {
  isTesting.value = true
  testProgress.value = 0
  testStatus.value = 'Preparing test...'
  testResults.value = null

  // Simulate test progress
  const interval = setInterval(() => {
    testProgress.value += 10
    if (testProgress.value >= 30) {
      testStatus.value = 'Sending webhook...'
    } else if (testProgress.value >= 70) {
      testStatus.value = 'Waiting for response...'
    } else if (testProgress.value >= 100) {
      testStatus.value = 'Test completed'
      clearInterval(interval)
      isTesting.value = false
      
      // Simulate test results
      testResults.value = {
        success: Math.random() > 0.2, // 80% success rate
        responseCode: Math.random() > 0.2 ? 200 : 400,
        responseTime: Math.floor(Math.random() * 500) + 50,
        contentLength: Math.floor(Math.random() * 1000) + 100,
        error: Math.random() > 0.8 ? 'Connection timeout' : undefined,
        responseBody: Math.random() > 0.3 ? '{"status": "success", "message": "Webhook received"}' : undefined
      }
    }
  }, 200)

  const testData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', testData)
}

const handleSaveDraft = () => {
  const testData = {
    ...formData,
    id: Date.now().toString(),
    status: 'DRAFT'
  }
  emit('saveDraft', testData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    eventType: '',
    customEventType: '',
    testPayload: '',
    timeout: 30,
    retryAttempts: 3,
    validateResponse: true,
    checkHeaders: true,
    testAuthentication: true,
    saveResults: true
  })
  isTesting.value = false
  testProgress.value = 0
  testStatus.value = ''
  testResults.value = null
  emit('close')
}
</script>
