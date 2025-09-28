<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Revoke Session</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Session Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Session Details</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Device:</span>
                <span class="font-medium">{{ sessionDeviceName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Browser:</span>
                <span class="font-medium">{{ sessionBrowser }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">IP Address:</span>
                <span class="font-medium">{{ sessionIpAddress }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium">{{ sessionLocation }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Activity:</span>
                <span class="font-medium">{{ sessionLastActivity }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Trusted:</span>
                <span :class="sessionIsTrusted ? 'text-green-600' : 'text-yellow-600'" class="font-medium">
                  {{ sessionIsTrusted ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <AlertTriangle class="h-5 w-5 text-yellow-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Notice</h3>
                <p class="mt-1 text-sm text-yellow-700">
                  This action will immediately log out the user from this device. Any unsaved work may be lost.
                </p>
              </div>
            </div>
          </div>

          <!-- Revocation Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Revocation Options</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.notifyUser"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Notify user about session revocation</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.blockDevice"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Block this device from future logins</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.requireReauth"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Require re-authentication for this device</label>
              </div>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type "REVOKE" to confirm</label>
                <input
                  v-model="formData.confirmationText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Type REVOKE to confirm"
                />
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.acknowledgeRisks"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">I understand the risks and want to proceed</label>
              </div>
            </div>
          </div>

          <!-- Additional Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea
                  v-model="formData.reason"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter reason for revoking this session"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Revocation Type</label>
                <select
                  v-model="formData.revocationType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="IMMEDIATE">Immediate (Log out now)</option>
                  <option value="GRACEFUL">Graceful (Allow 2 minutes for user to save work)</option>
                  <option value="SCHEDULED">Scheduled (Revoke in 30 minutes)</option>
                </select>
              </div>

              <div v-if="formData.revocationType === 'SCHEDULED'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Schedule Time</label>
                <input
                  v-model="formData.scheduledTime"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
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
            @click="handleRevoke"
            :disabled="!canRevoke"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revoke Session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'

interface RevokeConfig {
  notifyUser: boolean
  blockDevice: boolean
  requireReauth: boolean
  confirmationText: string
  acknowledgeRisks: boolean
  reason: string
  revocationType: string
  scheduledTime: string
}

const props = defineProps<{
  isOpen: boolean
  sessionDeviceName?: string
  sessionBrowser?: string
  sessionIpAddress?: string
  sessionLocation?: string
  sessionLastActivity?: string
  sessionIsTrusted?: boolean
}>()

const emit = defineEmits<{
  close: []
  revoke: [data: RevokeConfig]
}>()

const formData = reactive<RevokeConfig>({
  notifyUser: true,
  blockDevice: false,
  requireReauth: true,
  confirmationText: '',
  acknowledgeRisks: false,
  reason: '',
  revocationType: 'IMMEDIATE',
  scheduledTime: ''
})

const canRevoke = computed(() => {
  return formData.confirmationText === 'REVOKE' && 
         formData.acknowledgeRisks
})

const handleRevoke = () => {
  const revokeData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('revoke', revokeData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    notifyUser: true,
    blockDevice: false,
    requireReauth: true,
    confirmationText: '',
    acknowledgeRisks: false,
    reason: '',
    revocationType: 'IMMEDIATE',
    scheduledTime: ''
  })
  emit('close')
}
</script>
