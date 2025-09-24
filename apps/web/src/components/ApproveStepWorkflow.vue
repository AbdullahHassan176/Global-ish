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
          <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
            Approve Workflow Step
          </h3>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-6">
          <!-- Step Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">{{ step.name }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ step.description }}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Assigned to:</span>
                <span class="ml-2 font-medium">{{ step.assignedTo }}</span>
              </div>
              <div>
                <span class="text-gray-500">SLA:</span>
                <span class="ml-2 font-medium">{{ step.sla }}</span>
              </div>
              <div>
                <span class="text-gray-500">Due Date:</span>
                <span class="ml-2 font-medium">{{ step.dueDate }}</span>
              </div>
              <div>
                <span class="text-gray-500">Status:</span>
                <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {{ step.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Approval Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Approval Decision
              </label>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="approvalData.decision"
                    type="radio"
                    value="approve"
                    class="text-green-600 focus:ring-green-500"
                  />
                  <span class="text-sm text-gray-700">Approve this step</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="approvalData.decision"
                    type="radio"
                    value="reject"
                    class="text-red-600 focus:ring-red-500"
                  />
                  <span class="text-sm text-gray-700">Reject and request changes</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="approvalData.decision"
                    type="radio"
                    value="conditional"
                    class="text-yellow-600 focus:ring-yellow-500"
                  />
                  <span class="text-sm text-gray-700">Conditional approval with requirements</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                v-model="approvalData.comments"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="getCommentsPlaceholder()"
              />
            </div>

            <div v-if="approvalData.decision === 'conditional'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                v-model="approvalData.requirements"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Specify the conditions that must be met for approval"
              />
            </div>

            <div v-if="approvalData.decision === 'reject'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Required Changes
              </label>
              <textarea
                v-model="approvalData.requiredChanges"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what changes are needed"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  v-model="approvalData.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Next Due Date
                </label>
                <input
                  v-model="approvalData.nextDueDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input
                  v-model="approvalData.notifyAssignee"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">Notify assignee about this decision</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="approvalData.escalateIfOverdue"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">Escalate if overdue</span>
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
            @click="submitApproval"
            :class="[
              'px-4 py-2 rounded-md text-white transition-colors flex items-center',
              getButtonClasses()
            ]"
          >
            <CheckCircle class="h-4 w-4 mr-2" />
            {{ getButtonText() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, CheckCircle } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  step: {
    id: string
    name: string
    description: string
    assignedTo: string
    dueDate: string
    sla: string
    status: string
  }
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const approvalData = ref({
  decision: 'approve',
  comments: '',
  requirements: '',
  requiredChanges: '',
  priority: 'normal',
  nextDueDate: '',
  notifyAssignee: true,
  escalateIfOverdue: false
})

const getCommentsPlaceholder = () => {
  switch (approvalData.value.decision) {
    case 'approve':
      return 'Add any comments about the approval (optional)'
    case 'reject':
      return 'Explain why this step is being rejected'
    case 'conditional':
      return 'Explain the conditions for approval'
    default:
      return 'Add your comments here'
  }
}

const getButtonText = () => {
  switch (approvalData.value.decision) {
    case 'approve':
      return 'Approve Step'
    case 'reject':
      return 'Reject Step'
    case 'conditional':
      return 'Conditional Approval'
    default:
      return 'Submit Decision'
  }
}

const getButtonClasses = () => {
  switch (approvalData.value.decision) {
    case 'approve':
      return 'bg-green-600 hover:bg-green-700'
    case 'reject':
      return 'bg-red-600 hover:bg-red-700'
    case 'conditional':
      return 'bg-yellow-600 hover:bg-yellow-700'
    default:
      return 'bg-blue-600 hover:bg-blue-700'
  }
}

const submitApproval = () => {
  if (!approvalData.value.comments.trim() && approvalData.value.decision !== 'approve') {
    notify.warning('Validation Error', 'Please provide comments for your decision')
    return
  }

  const approvalInfo = {
    ...approvalData.value,
    stepId: props.step.id,
    stepName: props.step.name,
    approvedAt: new Date().toISOString(),
    approvedBy: 'Current User' // This would come from auth context
  }

  console.log('Submitting approval:', approvalInfo)
  
  const successMessage = approvalData.value.decision === 'approve' 
    ? `Step "${props.step.name}" has been approved successfully!`
    : `Decision for step "${props.step.name}" has been submitted!`
    
  notify.success('Decision Submitted', successMessage)
  
  emit('submit', approvalInfo)
  close()
}

const close = () => {
  // Reset form
  approvalData.value = {
    decision: 'approve',
    comments: '',
    requirements: '',
    requiredChanges: '',
    priority: 'normal',
    nextDueDate: '',
    notifyAssignee: true,
    escalateIfOverdue: false
  }
  emit('close')
}
</script>
