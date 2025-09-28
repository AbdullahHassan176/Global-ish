<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Edit Reminder</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Title</label>
                <input
                  v-model="formData.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter reminder title"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="VISA_EXPIRY">Visa Expiry</option>
                  <option value="LICENSE_RENEWAL">License Renewal</option>
                  <option value="PROBATION_REVIEW">Probation Review</option>
                  <option value="CONTRACT_RENEWAL">Contract Renewal</option>
                  <option value="COMPLIANCE_AUDIT">Compliance Audit</option>
                  <option value="TRAINING_CERTIFICATION">Training Certification</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Enter reminder description"
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  v-model="formData.dueDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <select
                  v-model="formData.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select
                  v-model="formData.assignedTo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select assignee</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
                <select
                  v-model="formData.frequency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="ONCE">Once</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>

            <!-- Status and Completion -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="formData.isCompleted"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option :value="false">Pending</option>
                  <option :value="true">Completed</option>
                </select>
              </div>

              <div v-if="formData.isCompleted">
                <label class="block text-sm font-medium text-gray-700 mb-2">Completed By</label>
                <select
                  v-model="formData.completedBy"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select user</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
              </div>
            </div>

            <!-- Notification Settings -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.sendNotifications"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send email notifications</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.sendSms"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send SMS notifications</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.remindBeforeDue"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send reminder before due date</label>
                </div>
              </div>
            </div>

            <!-- Additional Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                v-model="formData.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Enter any additional notes or comments"
              ></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              type="button"
              @click="handleDelete"
              class="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              Delete Reminder
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
            >
              Update Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface Reminder {
  id: string
  title: string
  description: string
  type: string
  dueDate: string
  priority: string
  assignedTo: string
  frequency: string
  isCompleted: boolean
  completedBy?: string
  sendNotifications: boolean
  sendSms: boolean
  remindBeforeDue: boolean
  notes?: string
}

interface User {
  id: string
  name: string
}

const props = defineProps<{
  isOpen: boolean
  reminder?: Reminder | null
}>()

const emit = defineEmits<{
  close: []
  update: [data: Reminder]
  saveDraft: [data: Reminder]
  delete: [id: string]
}>()

const formData = reactive<Reminder>({
  id: '',
  title: '',
  description: '',
  type: 'VISA_EXPIRY',
  dueDate: '',
  priority: 'MEDIUM',
  assignedTo: '',
  frequency: 'ONCE',
  isCompleted: false,
  completedBy: '',
  sendNotifications: true,
  sendSms: false,
  remindBeforeDue: true,
  notes: ''
})

const users: User[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Wilson' },
  { id: '5', name: 'HR Department' }
]

// Watch for changes in the reminder prop
watch(() => props.reminder, (newReminder) => {
  if (newReminder) {
    Object.assign(formData, newReminder)
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('update', { ...formData })
}

const handleSaveDraft = () => {
  emit('saveDraft', { ...formData })
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this reminder?')) {
    emit('delete', formData.id)
  }
}

const close = () => {
  emit('close')
}
</script>
