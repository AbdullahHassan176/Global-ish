<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create Contract Template</h2>
          <p class="text-brand-teal mt-1">Create a new contract template for future use</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Template Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Template Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                v-model="templateData.name"
                type="text"
                placeholder="Enter template name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Template Type</label>
              <select
                v-model="templateData.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select template type</option>
                <option value="CONTRACT">Contract</option>
                <option value="AGREEMENT">Agreement</option>
                <option value="POLICY">Policy</option>
                <option value="TERMS">Terms of Service</option>
                <option value="NDA">Non-Disclosure Agreement</option>
                <option value="EMPLOYMENT">Employment</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="templateData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="HR">Human Resources</option>
                <option value="Legal">Legal</option>
                <option value="Business">Business</option>
                <option value="IT">Information Technology</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Version</label>
              <input
                v-model="templateData.version"
                type="text"
                placeholder="e.g., 1.0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="templateData.description"
                rows="3"
                placeholder="Enter template description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Template Content -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Template Content</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Template Body</label>
              <textarea
                v-model="templateData.content"
                rows="10"
                placeholder="Enter the template content with placeholders like {{company_name}}, {{employee_name}}, etc."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent font-mono text-sm"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Available Placeholders</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{company_name}}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{employee_name}}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{start_date}}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{end_date}}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{salary}}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{position}}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{department}}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{{signature_date}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Template Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Template Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
              <select
                v-model="templateData.accessLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Public">Public (All users)</option>
                <option value="Department">Department Only</option>
                <option value="Private">Private (Creator only)</option>
                <option value="Restricted">Restricted Access</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="templateData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Requires Approval</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="templateData.requiresApproval"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="templateData.requiresApproval"
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
                v-model="templateData.autoExpiry"
                type="number"
                placeholder="Enter auto-expiry days (0 for no expiry)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Legal Requirements -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Legal Requirements</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Required Signatures</label>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center">
                  <input v-model="templateData.requiredSignatures" type="checkbox" value="employee" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Employee</span>
                </label>
                <label class="flex items-center">
                  <input v-model="templateData.requiredSignatures" type="checkbox" value="employer" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Employer</span>
                </label>
                <label class="flex items-center">
                  <input v-model="templateData.requiredSignatures" type="checkbox" value="witness" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Witness</span>
                </label>
                <label class="flex items-center">
                  <input v-model="templateData.requiredSignatures" type="checkbox" value="legal" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Legal Counsel</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Legal Review Required</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="templateData.legalReviewRequired"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="templateData.legalReviewRequired"
                    type="radio"
                    value="no"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Compliance Notes</label>
              <textarea
                v-model="templateData.complianceNotes"
                rows="3"
                placeholder="Enter any compliance requirements or legal notes"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
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
          @click="createTemplate"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Create Template
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

interface Props {
  isOpen: boolean
}

interface TemplateData {
  name: string
  type: string
  category: string
  version: string
  description: string
  content: string
  accessLevel: string
  status: string
  requiresApproval: string
  autoExpiry: string
  requiredSignatures: string[]
  legalReviewRequired: string
  complianceNotes: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  create: [data: TemplateData]
  saveDraft: [data: TemplateData]
}>()

const templateData = ref<TemplateData>({
  name: '',
  type: '',
  category: '',
  version: '1.0',
  description: '',
  content: '',
  accessLevel: 'Public',
  status: 'Draft',
  requiresApproval: 'no',
  autoExpiry: '',
  requiredSignatures: [],
  legalReviewRequired: 'no',
  complianceNotes: ''
})

const createTemplate = () => {
  if (!templateData.value.name || !templateData.value.type || !templateData.value.content) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Creating template:', templateData.value)
  notify.success('Template Created', 'Contract template has been created successfully!')
  emit('create', templateData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving template draft:', templateData.value)
  notify.success('Draft Saved', 'Template draft has been saved!')
  emit('saveDraft', templateData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
