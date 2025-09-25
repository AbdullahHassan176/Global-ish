<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">License Renewal Management</h2>
          <p class="text-brand-teal mt-1">Track and manage professional license renewals and compliance</p>
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
                v-model="licenseData.employeeName"
                type="text"
                placeholder="Enter employee name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                v-model="licenseData.employeeId"
                type="text"
                placeholder="Enter employee ID"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="licenseData.department"
                type="text"
                placeholder="Enter department"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                v-model="licenseData.position"
                type="text"
                placeholder="Enter position"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- License Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">License Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">License Type</label>
              <select
                v-model="licenseData.licenseType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select license type</option>
                <option value="Professional Engineer">Professional Engineer (PE)</option>
                <option value="CPA">Certified Public Accountant (CPA)</option>
                <option value="Attorney">Attorney License</option>
                <option value="Medical">Medical License</option>
                <option value="Nursing">Nursing License</option>
                <option value="Teaching">Teaching License</option>
                <option value="Real Estate">Real Estate License</option>
                <option value="Insurance">Insurance License</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input
                v-model="licenseData.licenseNumber"
                type="text"
                placeholder="Enter license number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Issuing Authority</label>
              <input
                v-model="licenseData.issuingAuthority"
                type="text"
                placeholder="Enter issuing authority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
              <input
                v-model="licenseData.issueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                v-model="licenseData.expiryDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="licenseData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Under Review">Under Review</option>
                <option value="Renewal Pending">Renewal Pending</option>
                <option value="Suspended">Suspended</option>
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
                    v-model="licenseData.renewalRequired"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="licenseData.renewalRequired"
                    type="radio"
                    value="no"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div v-if="licenseData.renewalRequired === 'yes'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Renewal Deadline</label>
              <input
                v-model="licenseData.renewalDeadline"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Renewal Cost</label>
              <input
                v-model="licenseData.renewalCost"
                type="number"
                step="0.01"
                placeholder="Enter renewal cost"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                v-model="licenseData.priorityLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Continuing Education Required</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="licenseData.ceRequired"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="licenseData.ceRequired"
                    type="radio"
                    value="no"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div v-if="licenseData.ceRequired === 'yes'">
              <label class="block text-sm font-medium text-gray-700 mb-2">CE Hours Required</label>
              <input
                v-model="licenseData.ceHours"
                type="number"
                placeholder="Enter CE hours required"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Requirements and Documents -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Requirements and Documents</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center">
                  <input v-model="licenseData.documents" type="checkbox" value="application" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Renewal Application</span>
                </label>
                <label class="flex items-center">
                  <input v-model="licenseData.documents" type="checkbox" value="fee_payment" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Fee Payment</span>
                </label>
                <label class="flex items-center">
                  <input v-model="licenseData.documents" type="checkbox" value="ce_certificate" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">CE Certificate</span>
                </label>
                <label class="flex items-center">
                  <input v-model="licenseData.documents" type="checkbox" value="background_check" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Background Check</span>
                </label>
                <label class="flex items-center">
                  <input v-model="licenseData.documents" type="checkbox" value="fingerprints" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Fingerprints</span>
                </label>
                <label class="flex items-center">
                  <input v-model="licenseData.documents" type="checkbox" value="references" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Professional References</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                v-model="licenseData.notes"
                rows="3"
                placeholder="Enter any additional notes or comments"
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
          @click="submitLicenseInfo"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Submit License Information
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

interface LicenseData {
  employeeName: string
  employeeId: string
  department: string
  position: string
  licenseType: string
  licenseNumber: string
  issuingAuthority: string
  issueDate: string
  expiryDate: string
  status: string
  renewalRequired: string
  renewalDeadline: string
  renewalCost: string
  priorityLevel: string
  ceRequired: string
  ceHours: string
  documents: string[]
  notes: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [data: LicenseData]
  saveDraft: [data: LicenseData]
}>()

const licenseData = ref<LicenseData>({
  employeeName: '',
  employeeId: '',
  department: '',
  position: '',
  licenseType: '',
  licenseNumber: '',
  issuingAuthority: '',
  issueDate: '',
  expiryDate: '',
  status: 'Active',
  renewalRequired: 'no',
  renewalDeadline: '',
  renewalCost: '',
  priorityLevel: 'Medium',
  ceRequired: 'no',
  ceHours: '',
  documents: [],
  notes: ''
})

const submitLicenseInfo = () => {
  if (!licenseData.value.employeeName || !licenseData.value.licenseType || !licenseData.value.expiryDate) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Submitting license information:', licenseData.value)
  notify.success('License Information Submitted', 'License information has been submitted successfully!')
  emit('submit', licenseData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving license draft:', licenseData.value)
  notify.success('Draft Saved', 'License information draft has been saved!')
  emit('saveDraft', licenseData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
