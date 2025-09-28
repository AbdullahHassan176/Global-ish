<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Revoke All Sessions</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Warning Message -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <AlertTriangle class="h-5 w-5 text-red-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Warning</h3>
                <p class="mt-1 text-sm text-red-700">
                  This action will immediately revoke all active sessions across all devices. You will be logged out from all devices and will need to log in again.
                </p>
              </div>
            </div>
          </div>

          <!-- Session Summary -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Active Sessions</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Sessions:</span>
                <span class="font-medium">{{ totalSessions }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Trusted Devices:</span>
                <span class="font-medium">{{ trustedDevices }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Current Device:</span>
                <span class="font-medium">{{ currentDevice }}</span>
              </div>
            </div>
          </div>

          <!-- Impact Assessment -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Impact Assessment</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.notifyUsers"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Send notification to affected users</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.allowCurrentSession"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Keep current session active</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.requireReauth"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Require re-authentication for sensitive operations</label>
              </div>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type "REVOKE ALL" to confirm</label>
                <input
                  v-model="formData.confirmationText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Type REVOKE ALL to confirm"
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

          <!-- Revocation Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Revocation Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Revocation Type</label>
                <select
                  v-model="formData.revocationType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="IMMEDIATE">Immediate (Log out all devices now)</option>
                  <option value="GRACEFUL">Graceful (Allow 5 minutes for users to save work)</option>
                  <option value="SCHEDULED">Scheduled (Revoke in 1 hour)</option>
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea
                  v-model="formData.reason"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter reason for revoking all sessions"
                ></textarea>
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
            @click="handleRevokeAll"
            :disabled="!canRevoke"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revoke All Sessions
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
  notifyUsers: boolean
  allowCurrentSession: boolean
  requireReauth: boolean
  confirmationText: string
  acknowledgeRisks: boolean
  revocationType: string
  scheduledTime: string
  reason: string
}

const props = defineProps<{
  isOpen: boolean
  totalSessions?: number
  trustedDevices?: number
  currentDevice?: string
}>()

const emit = defineEmits<{
  close: []
  revoke: [data: RevokeConfig]
}>()

const formData = reactive<RevokeConfig>({
  notifyUsers: true,
  allowCurrentSession: false,
  requireReauth: true,
  confirmationText: '',
  acknowledgeRisks: false,
  revocationType: 'IMMEDIATE',
  scheduledTime: '',
  reason: ''
})

const canRevoke = computed(() => {
  return formData.confirmationText === 'REVOKE ALL' && 
         formData.acknowledgeRisks
})

const handleRevokeAll = () => {
  const revokeData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('revoke', revokeData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    notifyUsers: true,
    allowCurrentSession: false,
    requireReauth: true,
    confirmationText: '',
    acknowledgeRisks: false,
    revocationType: 'IMMEDIATE',
    scheduledTime: '',
    reason: ''
  })
  emit('close')
}
</script>
