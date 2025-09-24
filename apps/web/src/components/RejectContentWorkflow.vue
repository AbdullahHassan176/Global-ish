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
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle class="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Reject Content
              </h3>
              <p class="text-sm text-gray-600">Provide feedback for content rejection</p>
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

          <!-- Rejection Details -->
          <div class="bg-red-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-red-900 mb-4">Rejection Details</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rejection Reason <span class="text-red-500">*</span></label>
                <select
                  v-model="rejectionData.reason"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select a reason</option>
                  <option value="quality_issues">Quality Issues</option>
                  <option value="brand_guidelines">Brand Guidelines Violation</option>
                  <option value="grammar_spelling">Grammar/Spelling Errors</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="missing_requirements">Missing Requirements</option>
                  <option value="timing_issues">Timing Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Detailed Feedback <span class="text-red-500">*</span></label>
                <textarea
                  v-model="rejectionData.feedback"
                  rows="4"
                  placeholder="Provide detailed feedback on why this content is being rejected..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>
              <div v-if="rejectionData.reason === 'other'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Specify Other Reason</label>
                <input
                  v-model="rejectionData.otherReason"
                  type="text"
                  placeholder="Please specify the reason"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <!-- Improvement Suggestions -->
          <div class="bg-yellow-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-yellow-900 mb-4">Improvement Suggestions</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Suggested Changes</label>
                <textarea
                  v-model="rejectionData.suggestions"
                  rows="3"
                  placeholder="Provide specific suggestions for improvement..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                ></textarea>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Common Issues to Address:</label>
                <div class="space-y-1">
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="rejectionData.issues"
                      type="checkbox"
                      value="grammar"
                      class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Fix grammar and spelling errors</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="rejectionData.issues"
                      type="checkbox"
                      value="tone"
                      class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Adjust tone to match brand voice</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="rejectionData.issues"
                      type="checkbox"
                      value="hashtags"
                      class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Review and update hashtags</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="rejectionData.issues"
                      type="checkbox"
                      value="media"
                      class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Improve media quality</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="rejectionData.issues"
                      type="checkbox"
                      value="call_to_action"
                      class="form-checkbox h-4 w-4 text-yellow-600 rounded"
                    />
                    <span class="text-sm text-gray-700">Add or improve call-to-action</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Next Steps</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Action Required</label>
                <select
                  v-model="rejectionData.actionRequired"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="revise_and_resubmit">Revise and Resubmit</option>
                  <option value="start_over">Start Over</option>
                  <option value="consult_with_team">Consult with Team</option>
                  <option value="schedule_review">Schedule Review Meeting</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Deadline for Resubmission</label>
                <input
                  v-model="rejectionData.deadline"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model="rejectionData.notifyCreator"
                  type="checkbox"
                  class="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <label class="text-sm text-gray-700">Notify creator immediately</label>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model="rejectionData.scheduleFollowUp"
                  type="checkbox"
                  class="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <label class="text-sm text-gray-700">Schedule follow-up meeting</label>
              </div>
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
            @click="handleReject"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reject Content
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, XCircle, User } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  content?: any
}>()

const emit = defineEmits<{
  close: []
  reject: [data: any]
}>()

const rejectionData = ref({
  reason: '',
  feedback: '',
  otherReason: '',
  suggestions: '',
  issues: [] as string[],
  actionRequired: 'revise_and_resubmit',
  deadline: '',
  notifyCreator: true,
  scheduleFollowUp: false
})

const handleReject = () => {
  if (!rejectionData.value.reason) {
    notify.warning('Validation Error', 'Please select a rejection reason.')
    return
  }
  if (!rejectionData.value.feedback) {
    notify.warning('Validation Error', 'Please provide detailed feedback.')
    return
  }
  if (rejectionData.value.reason === 'other' && !rejectionData.value.otherReason) {
    notify.warning('Validation Error', 'Please specify the other reason.')
    return
  }
  notify.success('Content Rejected', 'Content has been rejected with feedback provided.')
  emit('reject', { ...rejectionData.value, contentId: props.content?.id })
  close()
}

const close = () => {
  emit('close')
}
</script>
