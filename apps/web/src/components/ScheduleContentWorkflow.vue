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
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Schedule Content
              </h3>
              <p class="text-sm text-gray-600">Create and schedule content across multiple platforms</p>
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
          <!-- Content Details -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Content Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Content Title <span class="text-red-500">*</span></label>
                <input
                  v-model="contentData.title"
                  type="text"
                  placeholder="Enter content title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  v-model="contentData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="post">Social Media Post</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="story">Story</option>
                  <option value="reel">Reel</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Content Text <span class="text-red-500">*</span></label>
                <textarea
                  v-model="contentData.text"
                  rows="4"
                  placeholder="Write your content here..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
                <p class="text-sm text-gray-500 mt-1">{{ contentData.text.length }}/280 characters</p>
              </div>
            </div>
          </div>

          <!-- Scheduling -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Scheduling</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Publish Date <span class="text-red-500">*</span></label>
                <input
                  v-model="contentData.publishDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Publish Time <span class="text-red-500">*</span></label>
                <input
                  v-model="contentData.publishTime"
                  type="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  v-model="contentData.timezone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  v-model="contentData.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Platforms -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Target Platforms</h4>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="contentData.platforms"
                    type="checkbox"
                    value="linkedin"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Linkedin class="h-5 w-5 text-blue-600" />
                    <span class="text-gray-700">LinkedIn</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="contentData.platforms"
                    type="checkbox"
                    value="facebook"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Facebook class="h-5 w-5 text-blue-600" />
                    <span class="text-gray-700">Facebook</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="contentData.platforms"
                    type="checkbox"
                    value="instagram"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Instagram class="h-5 w-5 text-pink-600" />
                    <span class="text-gray-700">Instagram</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="contentData.platforms"
                    type="checkbox"
                    value="twitter"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Twitter class="h-5 w-5 text-blue-400" />
                    <span class="text-gray-700">Twitter</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Media Attachments -->
          <div class="bg-orange-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-orange-900 mb-4">Media Attachments</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Upload Images/Videos</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-600">Drag and drop files here, or click to select</p>
                  <input type="file" multiple accept="image/*,video/*" class="hidden" />
                </div>
              </div>
              <div v-if="contentData.attachments.length > 0" class="space-y-2">
                <h5 class="text-sm font-medium text-gray-700">Attached Files:</h5>
                <div
                  v-for="(attachment, index) in contentData.attachments"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <span class="text-sm text-gray-700">{{ attachment.name }}</span>
                  <button @click="removeAttachment(index)" class="text-red-500 hover:text-red-700">
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hashtags & Mentions -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Hashtags & Mentions</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                <input
                  v-model="contentData.hashtags"
                  type="text"
                  placeholder="#marketing #socialmedia #business"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
                <p class="text-sm text-gray-500 mt-1">Separate hashtags with spaces</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mentions</label>
                <input
                  v-model="contentData.mentions"
                  type="text"
                  placeholder="@company @team @client"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
                <p class="text-sm text-gray-500 mt-1">Separate mentions with spaces</p>
              </div>
            </div>
          </div>

          <!-- Approval Settings -->
          <div class="bg-yellow-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-yellow-900 mb-4">Approval Settings</h4>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <input
                  v-model="contentData.requiresApproval"
                  type="checkbox"
                  class="form-checkbox h-5 w-5 text-yellow-600 rounded"
                />
                <label class="text-sm text-gray-700">Requires approval before publishing</label>
              </div>
              <div v-if="contentData.requiresApproval">
                <label class="block text-sm font-medium text-gray-700 mb-2">Approver</label>
                <select
                  v-model="contentData.approver"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select approver</option>
                  <option value="sarah-wilson">Sarah Wilson (Marketing Manager)</option>
                  <option value="john-doe">John Doe (Content Director)</option>
                  <option value="mike-smith">Mike Smith (Creative Lead)</option>
                </select>
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
            @click="handleSaveDraft"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Save Draft
          </button>
          <button
            @click="handleScheduleContent"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Schedule Content
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Calendar, Linkedin, Facebook, Instagram, Twitter, Upload } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  schedule: [content: any]
  saveDraft: [content: any]
}>()

const contentData = ref({
  title: '',
  type: 'post',
  text: '',
  publishDate: '',
  publishTime: '',
  timezone: 'America/New_York',
  priority: 'medium',
  platforms: [] as string[],
  attachments: [] as any[],
  hashtags: '',
  mentions: '',
  requiresApproval: false,
  approver: ''
})

const removeAttachment = (index: number) => {
  contentData.value.attachments.splice(index, 1)
}

const handleSaveDraft = () => {
  if (!contentData.value.title || !contentData.value.text) {
    notify.warning('Validation Error', 'Please fill in title and content text before saving draft.')
    return
  }
  notify.success('Draft Saved', 'Content draft has been saved successfully!')
  emit('saveDraft', contentData.value)
  close()
}

const handleScheduleContent = () => {
  if (!contentData.value.title || !contentData.value.text || !contentData.value.publishDate || !contentData.value.publishTime) {
    notify.warning('Validation Error', 'Please fill in all required fields to schedule content.')
    return
  }
  if (contentData.value.platforms.length === 0) {
    notify.warning('Validation Error', 'Please select at least one platform for the content.')
    return
  }
  if (contentData.value.requiresApproval && !contentData.value.approver) {
    notify.warning('Validation Error', 'Please select an approver if approval is required.')
    return
  }
  notify.success('Content Scheduled', 'Content has been scheduled successfully!')
  emit('schedule', contentData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
