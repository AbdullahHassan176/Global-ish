<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Mark as Read</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Item Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Item to Mark as Read</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Type:</span>
                  <span class="font-medium">{{ itemType }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">ID:</span>
                  <span class="font-medium">{{ itemId }}</span>
                </div>
                <div v-if="itemTitle" class="flex justify-between">
                  <span class="text-gray-600">Title:</span>
                  <span class="font-medium">{{ itemTitle }}</span>
                </div>
                <div v-if="itemPriority" class="flex justify-between">
                  <span class="text-gray-600">Priority:</span>
                  <span class="font-medium">{{ itemPriority }}</span>
                </div>
              </div>
            </div>

            <!-- Read Confirmation -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <CheckCircle class="h-5 w-5 text-blue-600" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Confirm Read Status</h3>
                  <p class="mt-1 text-sm text-blue-700">
                    Are you sure you want to mark this item as read? This action will update the read status and may trigger notifications to other users.
                  </p>
                </div>
              </div>
            </div>

            <!-- Read Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Read Notes (Optional)</label>
              <textarea
                v-model="formData.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Add any notes about reading this item..."
              ></textarea>
            </div>

            <!-- Read Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Read Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.markAsRead"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    checked
                  />
                  <label class="ml-2 text-sm text-gray-700">Mark as read</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.sendNotification"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send notification to stakeholders</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.updateStatus"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Update item status</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.archived"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Archive after marking as read</label>
                </div>
              </div>
            </div>

            <!-- Notification Settings -->
            <div v-if="formData.sendNotification" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Notification Recipients</label>
                  <div class="space-y-2">
                    <div v-for="(recipient, index) in formData.notificationRecipients" :key="index" class="flex items-center space-x-4">
                      <div class="flex-1">
                        <input
                          v-model="recipient.name"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                          placeholder="Recipient Name"
                        />
                      </div>
                      <div class="flex-1">
                        <input
                          v-model="recipient.email"
                          type="email"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                          placeholder="Email"
                        />
                      </div>
                      <button
                        type="button"
                        @click="removeRecipient(index)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <X class="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addRecipient"
                      class="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                    >
                      + Add Recipient
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Notification Message</label>
                  <textarea
                    v-model="formData.notificationMessage"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Custom notification message..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Status Update -->
            <div v-if="formData.updateStatus" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Status Update</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                  <select
                    v-model="formData.newStatus"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="READ">Read</option>
                    <option value="ACKNOWLEDGED">Acknowledged</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    v-model="formData.priority"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
            >
              Mark as Read
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, CheckCircle } from 'lucide-vue-next'

interface NotificationRecipient {
  name: string
  email: string
}

interface MarkRead {
  notes: string
  markAsRead: boolean
  sendNotification: boolean
  updateStatus: boolean
  archived: boolean
  notificationRecipients: NotificationRecipient[]
  notificationMessage: string
  newStatus: string
  priority: string
}

const props = defineProps<{
  isOpen: boolean
  itemType?: string
  itemId?: string
  itemTitle?: string
  itemPriority?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [data: MarkRead]
  saveDraft: [data: MarkRead]
}>()

const formData = reactive<MarkRead>({
  notes: '',
  markAsRead: true,
  sendNotification: false,
  updateStatus: false,
  archived: false,
  notificationRecipients: [],
  notificationMessage: '',
  newStatus: 'READ',
  priority: 'MEDIUM'
})

const addRecipient = () => {
  formData.notificationRecipients.push({
    name: '',
    email: ''
  })
}

const removeRecipient = (index: number) => {
  formData.notificationRecipients.splice(index, 1)
}

const handleSubmit = () => {
  const markReadData = {
    ...formData,
    id: Date.now().toString(),
    markedBy: 'Current User',
    markedAt: new Date().toISOString()
  }
  emit('submit', markReadData)
}

const handleSaveDraft = () => {
  const markReadData = {
    ...formData,
    id: Date.now().toString(),
    status: 'DRAFT'
  }
  emit('saveDraft', markReadData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    notes: '',
    markAsRead: true,
    sendNotification: false,
    updateStatus: false,
    archived: false,
    notificationRecipients: [],
    notificationMessage: '',
    newStatus: 'READ',
    priority: 'MEDIUM'
  })
  emit('close')
}
</script>
