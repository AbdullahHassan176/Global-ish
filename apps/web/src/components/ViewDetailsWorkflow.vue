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
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Content Details
              </h3>
              <p class="text-sm text-gray-600">View detailed information about this content piece</p>
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
          <!-- Content Overview -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Content Overview</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <p class="text-gray-900 font-medium">{{ content?.title || 'Sample Content Title' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span :class="getStatusColor(content?.status || 'PENDING')" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ content?.status || 'PENDING' }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <p class="text-gray-900">{{ content?.platform || 'LinkedIn' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Creator</label>
                <p class="text-gray-900">{{ content?.creatorName || 'John Doe' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                <p class="text-gray-900">{{ content?.scheduledAt || '2024-01-15 10:00 AM' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <span :class="getPriorityColor(content?.priority || 'medium')" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ content?.priority || 'Medium' }}
                </span>
              </div>
            </div>
          </div>

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
                  <p class="text-gray-900 mb-3">{{ content?.description || 'This is a sample content post that demonstrates the content preview functionality. It includes engaging copy and relevant hashtags.' }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👍 12</span>
                    <span>💬 3</span>
                    <span>🔄 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Approval History -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Approval History</h4>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle class="h-4 w-4 text-green-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Content Created</p>
                  <p class="text-sm text-gray-600">by {{ content?.creatorName || 'John Doe' }} • 2 hours ago</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock class="h-4 w-4 text-yellow-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Pending Manager Review</p>
                  <p class="text-sm text-gray-600">Awaiting approval from Sarah Wilson</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Performance Metrics</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <Eye class="h-5 w-5 text-blue-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Impressions</p>
                    <p class="text-2xl font-bold text-gray-900">1,234</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <MousePointer class="h-5 w-5 text-green-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Clicks</p>
                    <p class="text-2xl font-bold text-gray-900">89</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <Heart class="h-5 w-5 text-purple-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Engagement</p>
                    <p class="text-2xl font-bold text-gray-900">7.2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments & Notes -->
          <div class="bg-orange-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-orange-900 mb-4">Comments & Notes</h4>
            <div class="space-y-4">
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User class="h-4 w-4 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="font-medium text-gray-900">Sarah Wilson</span>
                      <span class="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <p class="text-gray-700">Great content! Just need to adjust the hashtags to be more relevant to our target audience.</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User class="h-4 w-4 text-green-600" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="font-medium text-gray-900">John Doe</span>
                      <span class="text-sm text-gray-500">1 hour ago</span>
                    </div>
                    <p class="text-gray-700">Updated hashtags based on your feedback. Ready for final review!</p>
                  </div>
                </div>
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
            Close
          </button>
          <button
            @click="handleEdit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Content
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, Eye, User, CheckCircle, Clock, MousePointer, Heart } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  content?: any
}>()

const emit = defineEmits<{
  close: []
  edit: [content: any]
}>()

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'PUBLISHED': 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityColor = (priority: string) => {
  const colors: { [key: string]: string } = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}

const handleEdit = () => {
  notify.info('Edit Content', 'Opening content editor...')
  emit('edit', props.content)
  close()
}

const close = () => {
  emit('close')
}
</script>
