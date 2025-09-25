<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Use Template</h2>
          <p class="text-brand-teal mt-1">Create a new document using the selected template</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Template Information -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-brand-navy">{{ template?.name || 'Template Name' }}</h3>
            <p class="text-sm text-gray-600">{{ template?.description || 'Template description' }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{{ template?.type || 'TYPE' }}</span>
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{{ template?.category || 'Category' }}</span>
              <span class="text-xs text-gray-500">Used {{ template?.usageCount || 0 }} times</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Last Updated: {{ template?.lastUpdated || 'N/A' }}</p>
            <p class="text-sm text-gray-600">Version: {{ template?.version || '1.0' }}</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Document Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Document Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
              <input
                v-model="documentData.title"
                type="text"
                placeholder="Enter document title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select
                v-model="documentData.documentType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select document type</option>
                <option value="Contract">Contract</option>
                <option value="Agreement">Agreement</option>
                <option value="Policy">Policy</option>
                <option value="Terms">Terms of Service</option>
                <option value="NDA">Non-Disclosure Agreement</option>
                <option value="Employment">Employment</option>
                <option value="Service">Service</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                v-model="documentData.priorityLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="documentData.department"
                type="text"
                placeholder="Enter department"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Template Variables -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Template Variables</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                v-model="documentData.companyName"
                type="text"
                placeholder="Enter company name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
              <input
                v-model="documentData.employeeName"
                type="text"
                placeholder="Enter employee name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                v-model="documentData.startDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                v-model="documentData.endDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Salary</label>
              <input
                v-model="documentData.salary"
                type="number"
                step="0.01"
                placeholder="Enter salary amount"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                v-model="documentData.position"
                type="text"
                placeholder="Enter position title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="documentData.department"
                type="text"
                placeholder="Enter department"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Signature Date</label>
              <input
                v-model="documentData.signatureDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Document Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Document Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Requires Signature</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="documentData.requiresSignature"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="documentData.requiresSignature"
                    type="radio"
                    value="no"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Auto-Expiry (days)</label>
              <input
                v-model="documentData.autoExpiry"
                type="number"
                placeholder="Enter auto-expiry days (0 for no expiry)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Legal Review Required</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="documentData.legalReviewRequired"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="documentData.legalReviewRequired"
                    type="radio"
                    value="no"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="documentData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Under Review">Under Review</option>
                <option value="Ready for Signature">Ready for Signature</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Document Preview</h3>
          <div class="bg-white border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ previewContent }}</div>
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
          @click="createDocument"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Create Document
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

interface Props {
  isOpen: boolean
  template?: {
    id: string
    name: string
    description: string
    type: string
    category: string
    usageCount: number
    lastUpdated: string
    version: string
    content: string
  }
}

interface DocumentData {
  title: string
  documentType: string
  priorityLevel: string
  department: string
  companyName: string
  employeeName: string
  startDate: string
  endDate: string
  salary: string
  position: string
  signatureDate: string
  requiresSignature: string
  autoExpiry: string
  legalReviewRequired: string
  status: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  create: [data: DocumentData]
  saveDraft: [data: DocumentData]
}>()

const documentData = ref<DocumentData>({
  title: '',
  documentType: '',
  priorityLevel: 'Medium',
  department: '',
  companyName: '',
  employeeName: '',
  startDate: '',
  endDate: '',
  salary: '',
  position: '',
  signatureDate: '',
  requiresSignature: 'yes',
  autoExpiry: '',
  legalReviewRequired: 'no',
  status: 'Draft'
})

const previewContent = computed(() => {
  if (!props.template?.content) return 'No template content available'
  
  let content = props.template.content
  
  // Replace placeholders with actual values
  content = content.replace(/\{\{company_name\}\}/g, documentData.value.companyName || '{{company_name}}')
  content = content.replace(/\{\{employee_name\}\}/g, documentData.value.employeeName || '{{employee_name}}')
  content = content.replace(/\{\{start_date\}\}/g, documentData.value.startDate || '{{start_date}}')
  content = content.replace(/\{\{end_date\}\}/g, documentData.value.endDate || '{{end_date}}')
  content = content.replace(/\{\{salary\}\}/g, documentData.value.salary || '{{salary}}')
  content = content.replace(/\{\{position\}\}/g, documentData.value.position || '{{position}}')
  content = content.replace(/\{\{department\}\}/g, documentData.value.department || '{{department}}')
  content = content.replace(/\{\{signature_date\}\}/g, documentData.value.signatureDate || '{{signature_date}}')
  
  return content
})

const createDocument = () => {
  if (!documentData.value.title || !documentData.value.documentType) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Creating document:', documentData.value)
  notify.success('Document Created', 'Document has been created successfully using the template!')
  emit('create', documentData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving document draft:', documentData.value)
  notify.success('Draft Saved', 'Document draft has been saved!')
  emit('saveDraft', documentData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
