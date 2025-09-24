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
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <Save class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Save Task Draft
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Save your current task as a draft to continue working on it later.
              </p>
            </div>
          </div>
        </div>

        <!-- Draft Options -->
        <div class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Draft Name
            </label>
            <input
              v-model="draftData.name"
              type="text"
              placeholder="Enter a name for this draft"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="draftData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional description of what this draft contains"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              v-model="draftData.tags"
              type="text"
              placeholder="Enter tags (comma separated)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input
              v-model="draftData.isPrivate"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="text-sm text-gray-700">
              Keep this draft private (only visible to you)
            </label>
          </div>

          <div class="flex items-center space-x-2">
            <input
              v-model="draftData.remindMe"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="text-sm text-gray-700">
              Set a reminder to continue working on this draft
            </label>
          </div>

          <div v-if="draftData.remindMe">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reminder Date
            </label>
            <input
              v-model="draftData.reminderDate"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="saveDraft"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save Draft
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
import { Save } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  taskData?: any
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const draftData = ref({
  name: '',
  description: '',
  tags: '',
  isPrivate: false,
  remindMe: false,
  reminderDate: ''
})

const saveDraft = () => {
  if (!draftData.value.name.trim()) {
    notify.warning('Validation Error', 'Please provide a name for the draft')
    return
  }

  const draftInfo = {
    ...draftData.value,
    taskData: props.taskData,
    savedAt: new Date().toISOString(),
    id: `draft-${Date.now()}`
  }

  console.log('Saving draft:', draftInfo)
  
  // Save to localStorage for demo purposes
  const existingDrafts = JSON.parse(localStorage.getItem('taskDrafts') || '[]')
  existingDrafts.push(draftInfo)
  localStorage.setItem('taskDrafts', JSON.stringify(existingDrafts))
  
  notify.success('Draft Saved', `Task draft "${draftData.value.name}" has been saved successfully!`)
  
  emit('submit', draftInfo)
  close()
}

const close = () => {
  // Reset form
  draftData.value = {
    name: '',
    description: '',
    tags: '',
    isPrivate: false,
    remindMe: false,
    reminderDate: ''
  }
  emit('close')
}
</script>
