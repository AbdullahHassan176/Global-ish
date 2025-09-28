<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Resolve Item</h2>
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
              <h3 class="text-lg font-medium text-gray-900 mb-2">Item to Resolve</h3>
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

            <!-- Resolution Details -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Resolution Summary</label>
              <textarea
                v-model="formData.resolutionSummary"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Describe how this item was resolved..."
                required
              ></textarea>
            </div>

            <!-- Resolution Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Resolution Type</label>
              <select
                v-model="formData.resolutionType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                required
              >
                <option value="">Select Resolution Type</option>
                <option value="FIXED">Fixed</option>
                <option value="WORKAROUND">Workaround Applied</option>
                <option value="DUPLICATE">Duplicate</option>
                <option value="NOT_REPRODUCIBLE">Not Reproducible</option>
                <option value="WONT_FIX">Won't Fix</option>
                <option value="INVALID">Invalid</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <!-- Resolution Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Resolution Status</label>
                <select
                  v-model="formData.resolutionStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
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

            <!-- Resolution Actions -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Resolution Actions</h3>
              <div class="space-y-4">
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
                    v-model="formData.updateRelatedItems"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Update related items</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.createFollowUp"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Create follow-up task</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.archiveItem"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Archive item after resolution</label>
                </div>
              </div>
            </div>

            <!-- Follow-up Task -->
            <div v-if="formData.createFollowUp" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Follow-up Task</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Follow-up Title</label>
                  <input
                    v-model="formData.followUpTitle"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Follow-up task title"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Follow-up Description</label>
                  <textarea
                    v-model="formData.followUpDescription"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Follow-up task description"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      v-model="formData.followUpDueDate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <input
                      v-model="formData.followUpAssignedTo"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Assignee name"
                    />
                  </div>
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

            <!-- Resolution Notes -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
                  <textarea
                    v-model="formData.resolutionNotes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Any additional notes about the resolution..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Lessons Learned</label>
                  <textarea
                    v-model="formData.lessonsLearned"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="What lessons were learned from this resolution?"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Resolution Confirmation -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <CheckCircle class="h-5 w-5 text-green-600" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Resolution Confirmation</h3>
                  <p class="mt-1 text-sm text-green-700">
                    By resolving this item, you confirm that the issue has been adequately addressed and all necessary actions have been taken.
                  </p>
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
              Resolve Item
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

interface Resolve {
  resolutionSummary: string
  resolutionType: string
  resolutionStatus: string
  priority: string
  sendNotification: boolean
  updateRelatedItems: boolean
  createFollowUp: boolean
  archiveItem: boolean
  followUpTitle: string
  followUpDescription: string
  followUpDueDate: string
  followUpAssignedTo: string
  notificationRecipients: NotificationRecipient[]
  notificationMessage: string
  resolutionNotes: string
  lessonsLearned: string
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
  submit: [data: Resolve]
  saveDraft: [data: Resolve]
}>()

const formData = reactive<Resolve>({
  resolutionSummary: '',
  resolutionType: '',
  resolutionStatus: 'RESOLVED',
  priority: 'MEDIUM',
  sendNotification: true,
  updateRelatedItems: false,
  createFollowUp: false,
  archiveItem: false,
  followUpTitle: '',
  followUpDescription: '',
  followUpDueDate: '',
  followUpAssignedTo: '',
  notificationRecipients: [],
  notificationMessage: '',
  resolutionNotes: '',
  lessonsLearned: ''
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
  const resolveData = {
    ...formData,
    id: Date.now().toString(),
    resolvedBy: 'Current User',
    resolvedAt: new Date().toISOString()
  }
  emit('submit', resolveData)
}

const handleSaveDraft = () => {
  const resolveData = {
    ...formData,
    id: Date.now().toString(),
    status: 'DRAFT'
  }
  emit('saveDraft', resolveData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    resolutionSummary: '',
    resolutionType: '',
    resolutionStatus: 'RESOLVED',
    priority: 'MEDIUM',
    sendNotification: true,
    updateRelatedItems: false,
    createFollowUp: false,
    archiveItem: false,
    followUpTitle: '',
    followUpDescription: '',
    followUpDueDate: '',
    followUpAssignedTo: '',
    notificationRecipients: [],
    notificationMessage: '',
    resolutionNotes: '',
    lessonsLearned: ''
  })
  emit('close')
}
</script>
