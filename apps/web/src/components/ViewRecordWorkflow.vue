<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">View Record</h2>
          <p class="text-brand-teal mt-1">View sensitive record details and information</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Record Information -->
      <div class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Record Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Record Name</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.name || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.type || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.category || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
              <span 
                :class="getAccessLevelClass(record?.accessLevel)"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ record?.accessLevel || 'N/A' }}
              </span>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.description || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Document Details -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Document Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Created By</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.createdBy || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.createdAt || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.lastModified || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">File Size</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.fileSize || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.fileType || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.version || '1.0' }}</p>
            </div>
          </div>
        </div>

        <!-- Security Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Security Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sensitive Record</label>
              <span 
                :class="record?.isSensitive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ record?.isSensitive ? 'Yes' : 'No' }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Encryption Status</label>
              <span 
                :class="record?.encrypted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ record?.encrypted ? 'Encrypted' : 'Not Encrypted' }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Access Count</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.accessCount || '0' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Accessed</label>
              <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ record?.lastAccessed || 'Never' }}</p>
            </div>
          </div>
        </div>

        <!-- Access History -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Access History</h3>
          <div class="space-y-3">
            <div v-for="(access, index) in mockAccessHistory" :key="index" class="flex items-center justify-between p-3 bg-white rounded border">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-brand-teal/20 rounded-full flex items-center justify-center">
                  <User class="h-4 w-4 text-brand-teal" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ access.user }}</p>
                  <p class="text-xs text-gray-500">{{ access.action }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">{{ access.timestamp }}</p>
                <p class="text-xs text-gray-400">{{ access.ip }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Document Preview -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Document Preview</h3>
          <div class="bg-white border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div class="text-sm text-gray-700">
              <p class="mb-2"><strong>Document Title:</strong> {{ record?.name || 'N/A' }}</p>
              <p class="mb-2"><strong>Type:</strong> {{ record?.type || 'N/A' }}</p>
              <p class="mb-2"><strong>Description:</strong> {{ record?.description || 'N/A' }}</p>
              <p class="mb-2"><strong>Category:</strong> {{ record?.category || 'N/A' }}</p>
              <p class="mb-2"><strong>Access Level:</strong> {{ record?.accessLevel || 'N/A' }}</p>
              <p class="mb-2"><strong>Created:</strong> {{ record?.createdAt || 'N/A' }}</p>
              <p class="mb-2"><strong>Created By:</strong> {{ record?.createdBy || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
        <button
          @click="close"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button
          @click="downloadRecord"
          class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center"
        >
          <Download class="h-4 w-4 mr-2" />
          Download
        </button>
        <button
          @click="editRecord"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center"
        >
          <Edit class="h-4 w-4 mr-2" />
          Edit Record
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, User, Download, Edit } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

interface Props {
  isOpen: boolean
  record?: {
    id: string
    name: string
    description: string
    type: string
    category: string
    accessLevel: string
    createdBy: string
    createdAt: string
    lastModified?: string
    fileSize?: string
    fileType?: string
    version?: string
    isSensitive: boolean
    encrypted?: boolean
    accessCount?: number
    lastAccessed?: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  download: [record: any]
  edit: [record: any]
}>()

const mockAccessHistory = ref([
  {
    user: 'John Doe',
    action: 'Viewed record',
    timestamp: '2024-01-15 10:30 AM',
    ip: '192.168.1.100'
  },
  {
    user: 'Jane Smith',
    action: 'Downloaded record',
    timestamp: '2024-01-14 2:15 PM',
    ip: '192.168.1.101'
  },
  {
    user: 'Mike Johnson',
    action: 'Viewed record',
    timestamp: '2024-01-13 9:45 AM',
    ip: '192.168.1.102'
  }
])

const getAccessLevelClass = (accessLevel: string) => {
  switch (accessLevel) {
    case 'PUBLIC':
      return 'bg-green-100 text-green-800'
    case 'INTERNAL':
      return 'bg-blue-100 text-blue-800'
    case 'CONFIDENTIAL':
      return 'bg-yellow-100 text-yellow-800'
    case 'RESTRICTED':
      return 'bg-orange-100 text-orange-800'
    case 'TOP_SECRET':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const downloadRecord = () => {
  console.log('Downloading record:', props.record)
  notify.success('Download Started', 'Record download has been initiated!')
  emit('download', props.record)
}

const editRecord = () => {
  console.log('Editing record:', props.record)
  notify.info('Edit Record', 'Opening record editor...')
  emit('edit', props.record)
  close()
}

const close = () => {
  emit('close')
}
</script>
