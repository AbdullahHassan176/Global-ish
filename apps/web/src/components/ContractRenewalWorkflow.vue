<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Contract Renewal Management</h2>
          <p class="text-brand-teal mt-1">Manage employee contract renewals and extensions</p>
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
                v-model="contractData.employeeName"
                type="text"
                placeholder="Enter employee name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                v-model="contractData.employeeId"
                type="text"
                placeholder="Enter employee ID"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="contractData.department"
                type="text"
                placeholder="Enter department"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                v-model="contractData.position"
                type="text"
                placeholder="Enter position"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Current Contract Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Current Contract Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
              <select
                v-model="contractData.contractType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select contract type</option>
                <option value="Permanent">Permanent</option>
                <option value="Fixed-term">Fixed-term</option>
                <option value="Temporary">Temporary</option>
                <option value="Consultant">Consultant</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Contract Start Date</label>
              <input
                v-model="contractData.currentStartDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Contract End Date</label>
              <input
                v-model="contractData.currentEndDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Salary</label>
              <input
                v-model="contractData.currentSalary"
                type="number"
                step="0.01"
                placeholder="Enter current salary"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Renewal Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Renewal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Renewal Type</label>
              <select
                v-model="contractData.renewalType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select renewal type</option>
                <option value="Extension">Extension</option>
                <option value="Renewal">Renewal</option>
                <option value="Conversion">Conversion to Permanent</option>
                <option value="Termination">Termination</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Contract Start Date</label>
              <input
                v-model="contractData.newStartDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Contract End Date</label>
              <input
                v-model="contractData.newEndDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Salary</label>
              <input
                v-model="contractData.newSalary"
                type="number"
                step="0.01"
                placeholder="Enter new salary"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notice Period (days)</label>
              <input
                v-model="contractData.noticePeriod"
                type="number"
                placeholder="Enter notice period"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <select
                v-model="contractData.priorityLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Terms and Conditions</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Working Hours (per week)</label>
                <input
                  v-model="contractData.workingHours"
                  type="number"
                  placeholder="Enter working hours"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Probation Period (months)</label>
                <select
                  v-model="contractData.probationPeriod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="0">No probation</option>
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Benefits Package</label>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center">
                  <input v-model="contractData.benefits" type="checkbox" value="health_insurance" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Health Insurance</span>
                </label>
                <label class="flex items-center">
                  <input v-model="contractData.benefits" type="checkbox" value="dental_insurance" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Dental Insurance</span>
                </label>
                <label class="flex items-center">
                  <input v-model="contractData.benefits" type="checkbox" value="retirement_plan" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Retirement Plan</span>
                </label>
                <label class="flex items-center">
                  <input v-model="contractData.benefits" type="checkbox" value="vacation_days" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Vacation Days</span>
                </label>
                <label class="flex items-center">
                  <input v-model="contractData.benefits" type="checkbox" value="sick_leave" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Sick Leave</span>
                </label>
                <label class="flex items-center">
                  <input v-model="contractData.benefits" type="checkbox" value="bonus" class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded" />
                  <span class="ml-2 text-sm text-gray-700">Performance Bonus</span>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Special Terms</label>
              <textarea
                v-model="contractData.specialTerms"
                rows="3"
                placeholder="Enter any special terms or conditions"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Approval Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Approval Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">HR Representative</label>
              <input
                v-model="contractData.hrRepresentative"
                type="text"
                placeholder="Enter HR representative name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department Manager</label>
              <input
                v-model="contractData.departmentManager"
                type="text"
                placeholder="Enter department manager name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Legal Review Required</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="contractData.legalReviewRequired"
                    type="radio"
                    value="yes"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="contractData.legalReviewRequired"
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
                v-model="contractData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Additional Notes</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <textarea
              v-model="contractData.comments"
              rows="4"
              placeholder="Enter any additional comments or notes about the contract renewal"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
            ></textarea>
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
          @click="submitRenewal"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Submit Renewal
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

interface ContractData {
  employeeName: string
  employeeId: string
  department: string
  position: string
  contractType: string
  currentStartDate: string
  currentEndDate: string
  currentSalary: string
  renewalType: string
  newStartDate: string
  newEndDate: string
  newSalary: string
  noticePeriod: string
  priorityLevel: string
  workingHours: string
  probationPeriod: string
  benefits: string[]
  specialTerms: string
  hrRepresentative: string
  departmentManager: string
  legalReviewRequired: string
  status: string
  comments: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [data: ContractData]
  saveDraft: [data: ContractData]
}>()

const contractData = ref<ContractData>({
  employeeName: '',
  employeeId: '',
  department: '',
  position: '',
  contractType: '',
  currentStartDate: '',
  currentEndDate: '',
  currentSalary: '',
  renewalType: '',
  newStartDate: '',
  newEndDate: '',
  newSalary: '',
  noticePeriod: '',
  priorityLevel: 'Medium',
  workingHours: '',
  probationPeriod: '3',
  benefits: [],
  specialTerms: '',
  hrRepresentative: '',
  departmentManager: '',
  legalReviewRequired: 'no',
  status: 'Draft',
  comments: ''
})

const submitRenewal = () => {
  if (!contractData.value.employeeName || !contractData.value.renewalType || !contractData.value.newStartDate) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Submitting contract renewal:', contractData.value)
  notify.success('Renewal Submitted', 'Contract renewal has been submitted successfully!')
  emit('submit', contractData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving contract renewal draft:', contractData.value)
  notify.success('Draft Saved', 'Contract renewal draft has been saved!')
  emit('saveDraft', contractData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
