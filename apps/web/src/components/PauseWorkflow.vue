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
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
            <Pause class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Pause Workflow
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Are you sure you want to pause the workflow "{{ workflowName }}"? This will temporarily stop execution until resumed.
              </p>
            </div>
          </div>
        </div>

        <!-- Pause Options -->
        <div class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reason for Pause
            </label>
            <select
              v-model="pauseData.reason"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a reason</option>
              <option value="waiting_for_approval">Waiting for approval</option>
              <option value="resource_unavailable">Resource unavailable</option>
              <option value="external_dependency">External dependency</option>
              <option value="manual_review_required">Manual review required</option>
              <option value="system_maintenance">System maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              v-model="pauseData.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional notes about why the workflow is being paused"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Expected Resume Time
            </label>
            <input
              v-model="pauseData.expectedResume"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input
              v-model="pauseData.notifyStakeholders"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="text-sm text-gray-700">
              Notify stakeholders about the pause
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="pauseWorkflow"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Pause Workflow
          </button>
          <button
            type="button"
            @click="close"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pause } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  workflowName: string
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const pauseData = ref({
  reason: '',
  notes: '',
  expectedResume: '',
  notifyStakeholders: true
})

const pauseWorkflow = () => {
  if (!pauseData.value.reason) {
    notify.warning('Validation Error', 'Please select a reason for pausing the workflow')
    return
  }

  const pauseInfo = {
    ...pauseData.value,
    pausedAt: new Date().toISOString(),
    pausedBy: 'Current User' // This would come from auth context
  }

  console.log('Pausing workflow:', pauseInfo)
  notify.success('Workflow Paused', `Workflow "${props.workflowName}" has been paused successfully!`)
  
  emit('submit', pauseInfo)
  close()
}

const close = () => {
  // Reset form
  pauseData.value = {
    reason: '',
    notes: '',
    expectedResume: '',
    notifyStakeholders: true
  }
  emit('close')
}
</script>
