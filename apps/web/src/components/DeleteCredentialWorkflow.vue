<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Delete Credential</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Credential Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Credential to Delete</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Name:</span>
                <span class="font-medium">{{ credentialName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Provider:</span>
                <span class="font-medium">{{ credentialProvider }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium">{{ credentialType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Environment:</span>
                <span class="font-medium">{{ credentialEnvironment }}</span>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <AlertTriangle class="h-5 w-5 text-red-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Warning</h3>
                <p class="mt-1 text-sm text-red-700">
                  This action cannot be undone. Deleting this credential will permanently remove all associated data and may break existing integrations.
                </p>
              </div>
            </div>
          </div>

          <!-- Impact Assessment -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Impact Assessment</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.checkDependencies"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Check for dependent integrations</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.notifyUsers"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Notify affected users</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.createBackup"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Create backup before deletion</label>
              </div>
            </div>
          </div>

          <!-- Dependencies Check -->
          <div v-if="formData.checkDependencies" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Dependencies</h3>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Active Integrations:</span>
                  <span class="text-sm font-medium text-yellow-800">{{ dependencies.activeIntegrations }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Webhook Endpoints:</span>
                  <span class="text-sm font-medium text-yellow-800">{{ dependencies.webhookEndpoints }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Scheduled Jobs:</span>
                  <span class="text-sm font-medium text-yellow-800">{{ dependencies.scheduledJobs }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type the credential name to confirm deletion</label>
                <input
                  v-model="formData.confirmationText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  :placeholder="`Type '${credentialName}' to confirm`"
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

          <!-- Deletion Options -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Deletion Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Deletion Type</label>
                <select
                  v-model="formData.deletionType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="SOFT">Soft Delete (Reversible)</option>
                  <option value="HARD">Hard Delete (Permanent)</option>
                </select>
              </div>

              <div v-if="formData.deletionType === 'SOFT'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                <input
                  v-model="formData.retentionPeriod"
                  type="number"
                  min="1"
                  max="365"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="30"
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
            @click="handleDelete"
            :disabled="!canDelete"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Credential
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'

interface DeleteConfig {
  checkDependencies: boolean
  notifyUsers: boolean
  createBackup: boolean
  confirmationText: string
  acknowledgeRisks: boolean
  deletionType: string
  retentionPeriod: number
}

const props = defineProps<{
  isOpen: boolean
  credentialName?: string
  credentialProvider?: string
  credentialType?: string
  credentialEnvironment?: string
}>()

const emit = defineEmits<{
  close: []
  delete: [data: DeleteConfig]
}>()

const formData = reactive<DeleteConfig>({
  checkDependencies: true,
  notifyUsers: true,
  createBackup: true,
  confirmationText: '',
  acknowledgeRisks: false,
  deletionType: 'SOFT',
  retentionPeriod: 30
})

const dependencies = ref({
  activeIntegrations: 3,
  webhookEndpoints: 2,
  scheduledJobs: 1
})

const canDelete = computed(() => {
  return formData.confirmationText === props.credentialName && 
         formData.acknowledgeRisks
})

const handleDelete = () => {
  const deleteData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('delete', deleteData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    checkDependencies: true,
    notifyUsers: true,
    createBackup: true,
    confirmationText: '',
    acknowledgeRisks: false,
    deletionType: 'SOFT',
    retentionPeriod: 30
  })
  emit('close')
}
</script>
