<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Edit Record</h2>
          <p class="text-brand-teal mt-1">Edit sensitive record information and settings</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Record Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Record Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Record Name</label>
              <input
                v-model="recordData.name"
                type="text"
                placeholder="Enter record name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
              <select
                v-model="recordData.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select record type</option>
                <option value="LICENSE">License</option>
                <option value="CERTIFICATE">Certificate</option>
                <option value="CONTRACT">Contract</option>
                <option value="AGREEMENT">Agreement</option>
                <option value="POLICY">Policy</option>
                <option value="REPORT">Report</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="recordData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Business">Business</option>
                <option value="HR">Human Resources</option>
                <option value="Legal">Legal</option>
                <option value="Compliance">Compliance</option>
                <option value="Finance">Finance</option>
                <option value="IT">Information Technology</option>
                <option value="Operations">Operations</option>
                <option value="Security">Security</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
              <select
                v-model="recordData.accessLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="PUBLIC">Public</option>
                <option value="INTERNAL">Internal</option>
                <option value="CONFIDENTIAL">Confidential</option>
                <option value="RESTRICTED">Restricted</option>
                <option value="TOP_SECRET">Top Secret</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="recordData.description"
                rows="3"
                placeholder="Enter record description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Document Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Document Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
              <input
                v-model="recordData.documentTitle"
                type="text"
                placeholder="Enter document title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
              <input
                v-model="recordData.documentNumber"
                type="text"
                placeholder="Enter document number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
              <input
                v-model="recordData.issueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                v-model="recordData.expiryDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Issuing Authority</label>
              <input
                v-model="recordData.issuingAuthority"
                type="text"
                placeholder="Enter issuing authority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="recordData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Suspended">Suspended</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Security Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                v-model="recordData.isSensitive"
                type="checkbox"
                id="isSensitive"
                class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
              />
              <label for="isSensitive" class="ml-2 block text-sm text-gray-900">
                Mark as sensitive record
              </label>
            </div>
            <div class="flex items-center">
              <input
                v-model="recordData.requiresEncryption"
                type="checkbox"
                id="requiresEncryption"
                class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
              />
              <label for="requiresEncryption" class="ml-2 block text-sm text-gray-900">
                Requires encryption
              </label>
            </div>
            <div class="flex items-center">
              <input
                v-model="recordData.auditRequired"
                type="checkbox"
                id="auditRequired"
                class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
              />
              <label for="auditRequired" class="ml-2 block text-sm text-gray-900">
                Audit access required
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period (years)</label>
              <input
                v-model="recordData.retentionPeriod"
                type="number"
                placeholder="Enter retention period in years"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Access Control -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Access Control</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Authorized Users</label>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center">
                  <input v-model="recordData.authorizedUsers" type="checkbox" value="hr" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">HR Department</span>
                </label>
                <label class="flex items-center">
                  <input v-model="recordData.authorizedUsers" type="checkbox" value="legal" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Legal Team</span>
                </label>
                <label class="flex items-center">
                  <input v-model="recordData.authorizedUsers" type="checkbox" value="compliance" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Compliance Team</span>
                </label>
                <label class="flex items-center">
                  <input v-model="recordData.authorizedUsers" type="checkbox" value="management" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Management</span>
                </label>
                <label class="flex items-center">
                  <input v-model="recordData.authorizedUsers" type="checkbox" value="audit" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Audit Team</span>
                </label>
                <label class="flex items-center">
                  <input v-model="recordData.authorizedUsers" type="checkbox" value="security" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Security Team</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                v-model="recordData.notes"
                rows="3"
                placeholder="Enter any additional notes or special instructions"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Change Log -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Change Log</h3>
          <div class="space-y-3">
            <div v-for="(change, index) in mockChangeLog" :key="index" class="flex items-center justify-between p-3 bg-white rounded border">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-brand-teal/20 rounded-full flex items-center justify-center">
                  <User class="h-4 w-4 text-brand-teal" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ change.user }}</p>
                  <p class="text-xs text-gray-500">{{ change.action }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">{{ change.timestamp }}</p>
                <p class="text-xs text-gray-400">{{ change.field }}</p>
              </div>
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
          Cancel
        </button>
        <button
          @click="saveDraft"
          class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300"
        >
          Save Draft
        </button>
        <button
          @click="updateRecord"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Update Record
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, User } from 'lucide-vue-next'
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
    isSensitive: boolean
  }
}

interface RecordData {
  name: string
  type: string
  category: string
  accessLevel: string
  description: string
  documentTitle: string
  documentNumber: string
  issueDate: string
  expiryDate: string
  issuingAuthority: string
  status: string
  isSensitive: boolean
  requiresEncryption: boolean
  auditRequired: boolean
  retentionPeriod: string
  authorizedUsers: string[]
  notes: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  update: [data: RecordData]
  saveDraft: [data: RecordData]
}>()

const recordData = ref<RecordData>({
  name: '',
  type: '',
  category: '',
  accessLevel: 'INTERNAL',
  description: '',
  documentTitle: '',
  documentNumber: '',
  issueDate: '',
  expiryDate: '',
  issuingAuthority: '',
  status: 'Active',
  isSensitive: false,
  requiresEncryption: false,
  auditRequired: false,
  retentionPeriod: '',
  authorizedUsers: [],
  notes: ''
})

const mockChangeLog = ref([
  {
    user: 'John Doe',
    action: 'Updated record name',
    timestamp: '2024-01-15 10:30 AM',
    field: 'name'
  },
  {
    user: 'Jane Smith',
    action: 'Changed access level',
    timestamp: '2024-01-14 2:15 PM',
    field: 'accessLevel'
  },
  {
    user: 'Mike Johnson',
    action: 'Updated description',
    timestamp: '2024-01-13 9:45 AM',
    field: 'description'
  }
])

// Watch for record changes to populate form
watch(() => props.record, (newRecord) => {
  if (newRecord) {
    recordData.value = {
      name: newRecord.name || '',
      type: newRecord.type || '',
      category: newRecord.category || '',
      accessLevel: newRecord.accessLevel || 'INTERNAL',
      description: newRecord.description || '',
      documentTitle: newRecord.name || '',
      documentNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      status: 'Active',
      isSensitive: newRecord.isSensitive || false,
      requiresEncryption: false,
      auditRequired: false,
      retentionPeriod: '',
      authorizedUsers: [],
      notes: ''
    }
  }
}, { immediate: true })

const updateRecord = () => {
  if (!recordData.value.name || !recordData.value.type || !recordData.value.category) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Updating record:', recordData.value)
  notify.success('Record Updated', 'Sensitive record has been updated successfully!')
  emit('update', recordData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving record draft:', recordData.value)
  notify.success('Draft Saved', 'Record draft has been saved!')
  emit('saveDraft', recordData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
