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
            Start Workflow
          </h3>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-6">
          <!-- Template Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">{{ template.name }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ template.description }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span class="flex items-center space-x-1">
                <FileText class="h-4 w-4" />
                <span>{{ template.steps }} steps</span>
              </span>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ template.category }}
              </span>
            </div>
          </div>

          <!-- Workflow Configuration -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name
              </label>
              <input
                v-model="workflowData.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="`${template.name} - ${new Date().toLocaleDateString()}`"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                v-model="workflowData.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional description for this workflow instance"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  v-model="workflowData.priority"
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
                  Due Date
                </label>
                <input
                  v-model="workflowData.dueDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Assignees -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Assignees
              </label>
              <div class="space-y-2">
                <div
                  v-for="(assignee, index) in workflowData.assignees"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="assignee.name"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Assignee name"
                  />
                  <input
                    v-model="assignee.email"
                    type="email"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                  />
                  <button
                    @click="removeAssignee(index)"
                    class="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <button
                  @click="addAssignee"
                  class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Plus class="h-4 w-4" />
                  <span>Add Assignee</span>
                </button>
              </div>
            </div>

            <!-- Notifications -->
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">Notification Settings</h4>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="workflowData.notifications.email"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Email notifications</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="workflowData.notifications.sms"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">SMS notifications</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="workflowData.notifications.inApp"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">In-app notifications</span>
                </label>
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
            @click="startWorkflow"
            class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center"
          >
            <Play class="h-4 w-4 mr-2" />
            Start Workflow
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, FileText, Plus, Play } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  template: {
    name: string
    description: string
    steps: number
    category: string
  }
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const workflowData = ref({
  name: '',
  description: '',
  priority: 'normal',
  dueDate: '',
  assignees: [
    { name: '', email: '' }
  ],
  notifications: {
    email: true,
    sms: false,
    inApp: true
  }
})

// Watch for template changes to update default name
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    workflowData.value.name = `${newTemplate.name} - ${new Date().toLocaleDateString()}`
  }
}, { immediate: true })

const addAssignee = () => {
  workflowData.value.assignees.push({ name: '', email: '' })
}

const removeAssignee = (index: number) => {
  if (workflowData.value.assignees.length > 1) {
    workflowData.value.assignees.splice(index, 1)
  }
}

const startWorkflow = () => {
  if (!workflowData.value.name.trim()) {
    notify.warning('Validation Error', 'Please enter a workflow name')
    return
  }

  if (!workflowData.value.assignees.some(a => a.name.trim() && a.email.trim())) {
    notify.warning('Validation Error', 'Please add at least one assignee with name and email')
    return
  }

  const workflowInstance = {
    ...workflowData.value,
    template: props.template,
    startedAt: new Date().toISOString(),
    status: 'running',
    progress: 0,
    currentStep: 1
  }

  console.log('Starting workflow:', workflowInstance)
  notify.success('Workflow Started', `Workflow "${workflowData.value.name}" has been started successfully!`)
  
  emit('submit', workflowInstance)
  close()
}

const close = () => {
  // Reset form
  workflowData.value = {
    name: '',
    description: '',
    priority: 'normal',
    dueDate: '',
    assignees: [{ name: '', email: '' }],
    notifications: {
      email: true,
      sms: false,
      inApp: true
    }
  }
  emit('close')
}
</script>
