<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Visa Expiry Management</h2>
          <p class="text-brand-teal mt-1">Track and manage employee visa expiry dates and immigration compliance</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Employee Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Employee Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
              <input
                v-model="visaData.employeeName"
                type="text"
                placeholder="Enter employee name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                v-model="visaData.employeeId"
                type="text"
                placeholder="Enter employee ID"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="visaData.department"
                type="text"
                placeholder="Enter department"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                v-model="visaData.position"
                type="text"
                placeholder="Enter position"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Visa Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Visa Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Visa Type</label>
              <select
                v-model="visaData.visaType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select visa type</option>
                <option value="H1B">H-1B</option>
                <option value="L1">L-1</option>
                <option value="F1">F-1</option>
                <option value="J1">J-1</option>
                <option value="O1">O-1</option>
                <option value="TN">TN</option>
                <option value="E2">E-2</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Visa Number</label>
              <input
                v-model="visaData.visaNumber"
                type="text"
                placeholder="Enter visa number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
              <input
                v-model="visaData.issueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                v-model="visaData.expiryDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Country of Origin</label>
              <input
                v-model="visaData.countryOfOrigin"
                type="text"
                placeholder="Enter country of origin"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="visaData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Under Review">Under Review</option>
                <option value="Renewal Pending">Renewal Pending</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Renewal Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Renewal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Renewal Required</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="visaData.renewalRequired"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="visaData.renewalRequired"
                    type="radio"
                    value="no"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div v-if="visaData.renewalRequired === 'yes'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Renewal Deadline</label>
              <input
                v-model="visaData.renewalDeadline"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                v-model="visaData.priorityLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Assigned HR Representative</label>
              <input
                v-model="visaData.hrRepresentative"
                type="text"
                placeholder="Enter HR representative name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Notes and Documents -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Notes and Documents</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                v-model="visaData.notes"
                rows="3"
                placeholder="Enter any additional notes or comments"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
            <div class="flex items-center">
              <input
                v-model="visaData.requiresDocumentation"
                type="checkbox"
                id="requiresDocumentation"
                class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
              />
              <label for="requiresDocumentation" class="ml-2 block text-sm text-gray-900">
                Requires additional documentation
              </label>
            </div>
            <div v-if="visaData.requiresDocumentation">
              <label class="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input v-model="visaData.documents" type="checkbox" value="passport" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Passport Copy</span>
                </label>
                <label class="flex items-center">
                  <input v-model="visaData.documents" type="checkbox" value="i94" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">I-94 Record</span>
                </label>
                <label class="flex items-center">
                  <input v-model="visaData.documents" type="checkbox" value="employment_letter" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Employment Letter</span>
                </label>
                <label class="flex items-center">
                  <input v-model="visaData.documents" type="checkbox" value="pay_stubs" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Pay Stubs</span>
                </label>
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
          @click="submitVisaInfo"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Submit Visa Information
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

interface VisaData {
  employeeName: string
  employeeId: string
  department: string
  position: string
  visaType: string
  visaNumber: string
  issueDate: string
  expiryDate: string
  countryOfOrigin: string
  status: string
  renewalRequired: string
  renewalDeadline: string
  priorityLevel: string
  hrRepresentative: string
  notes: string
  requiresDocumentation: boolean
  documents: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [data: VisaData]
  saveDraft: [data: VisaData]
}>()

const visaData = ref<VisaData>({
  employeeName: '',
  employeeId: '',
  department: '',
  position: '',
  visaType: '',
  visaNumber: '',
  issueDate: '',
  expiryDate: '',
  countryOfOrigin: '',
  status: 'Active',
  renewalRequired: 'no',
  renewalDeadline: '',
  priorityLevel: 'Medium',
  hrRepresentative: '',
  notes: '',
  requiresDocumentation: false,
  documents: []
})

const submitVisaInfo = () => {
  if (!visaData.value.employeeName || !visaData.value.visaType || !visaData.value.expiryDate) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Submitting visa information:', visaData.value)
  notify.success('Visa Information Submitted', 'Visa information has been submitted successfully!')
  emit('submit', visaData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving visa draft:', visaData.value)
  notify.success('Draft Saved', 'Visa information draft has been saved!')
  emit('saveDraft', visaData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
