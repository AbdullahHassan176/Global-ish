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
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Approve Content
              </h3>
              <p class="text-sm text-gray-600">Review and approve this content for publishing</p>
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
          <!-- Content Preview -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Content Preview</h4>
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User class="h-5 w-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="font-medium text-gray-900">{{ content?.creatorName || 'John Doe' }}</span>
                    <span class="text-sm text-gray-500">•</span>
                    <span class="text-sm text-gray-500">{{ content?.platform || 'LinkedIn' }}</span>
                  </div>
                  <p class="text-gray-900 mb-3">{{ content?.description || 'This is a sample content post that demonstrates the content preview functionality.' }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👍 12</span>
                    <span>💬 3</span>
                    <span>🔄 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Approval Details -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Approval Details</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Approval Comments</label>
                <textarea
                  v-model="approvalData.comments"
                  rows="3"
                  placeholder="Add any comments about this approval..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Approval Type</label>
                <select
                  v-model="approvalData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="full_approval">Full Approval</option>
                  <option value="conditional_approval">Conditional Approval</option>
                  <option value="expedited_approval">Expedited Approval</option>
                </select>
              </div>
              <div v-if="approvalData.type === 'conditional_approval'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Conditions</label>
                <textarea
                  v-model="approvalData.conditions"
                  rows="2"
                  placeholder="Specify any conditions for this approval..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Publishing Settings -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Publishing Settings</h4>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <input
                  v-model="approvalData.autoPublish"
                  type="checkbox"
                  class="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <label class="text-sm text-gray-700">Auto-publish when scheduled time arrives</label>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model="approvalData.notifyCreator"
                  type="checkbox"
                  class="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <label class="text-sm text-gray-700">Notify creator of approval</label>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model="approvalData.trackPerformance"
                  type="checkbox"
                  class="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <label class="text-sm text-gray-700">Track performance metrics</label>
              </div>
            </div>
          </div>

          <!-- Content Quality Checklist -->
          <div class="bg-yellow-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-yellow-900 mb-4">Quality Checklist</h4>
            <div class="space-y-3">
              <label class="flex items-center space-x-2">
                <input
                  v-model="approvalData.qualityChecks"
                  type="checkbox"
                  value="grammar"
                  class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                />
                <span class="text-sm text-gray-700">Grammar and spelling checked</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="approvalData.qualityChecks"
                  type="checkbox"
                  value="brand_guidelines"
                  class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                />
                <span class="text-sm text-gray-700">Follows brand guidelines</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="approvalData.qualityChecks"
                  type="checkbox"
                  value="hashtags"
                  class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                />
                <span class="text-sm text-gray-700">Appropriate hashtags included</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="approvalData.qualityChecks"
                  type="checkbox"
                  value="media"
                  class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                />
                <span class="text-sm text-gray-700">Media quality is acceptable</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="approvalData.qualityChecks"
                  type="checkbox"
                  value="compliance"
                  class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                />
                <span class="text-sm text-gray-700">Compliance requirements met</span>
              </label>
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
            @click="handleApprove"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Approve Content
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, CheckCircle, User } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  content?: any
}>()

const emit = defineEmits<{
  close: []
  approve: [data: any]
}>()

const approvalData = ref({
  comments: '',
  type: 'full_approval',
  conditions: '',
  autoPublish: true,
  notifyCreator: true,
  trackPerformance: true,
  qualityChecks: [] as string[]
})

const handleApprove = () => {
  if (approvalData.value.type === 'conditional_approval' && !approvalData.value.conditions) {
    notify.warning('Validation Error', 'Please specify conditions for conditional approval.')
    return
  }
  notify.success('Content Approved', 'Content has been approved successfully!')
  emit('approve', { ...approvalData.value, contentId: props.content?.id })
  close()
}

const close = () => {
  emit('close')
}
</script>
