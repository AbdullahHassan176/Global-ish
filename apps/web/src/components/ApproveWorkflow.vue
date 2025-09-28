<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Approve Item</h2>
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
              <h3 class="text-lg font-medium text-gray-900 mb-2">Item to Approve</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Type:</span>
                  <span class="font-medium">{{ itemType }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">ID:</span>
                  <span class="font-medium">{{ itemId }}</span>
                </div>
                <div v-if="itemName" class="flex justify-between">
                  <span class="text-gray-600">Name:</span>
                  <span class="font-medium">{{ itemName }}</span>
                </div>
                <div v-if="itemAmount" class="flex justify-between">
                  <span class="text-gray-600">Amount:</span>
                  <span class="font-medium">{{ itemAmount }}</span>
                </div>
              </div>
            </div>

            <!-- Approval Details -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Approval Comments</label>
              <textarea
                v-model="formData.comments"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Add any comments or notes about this approval..."
              ></textarea>
            </div>

            <!-- Approval Level -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Approval Level</label>
              <select
                v-model="formData.approvalLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                required
              >
                <option value="">Select Level</option>
                <option value="MANAGER">Manager Approval</option>
                <option value="DIRECTOR">Director Approval</option>
                <option value="VP">VP Approval</option>
                <option value="PRESIDENT">President Approval</option>
                <option value="BOARD">Board Approval</option>
              </select>
            </div>

            <!-- Priority -->
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

            <!-- Approval Conditions -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Approval Conditions</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.requiresNotification"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send notification to stakeholders</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresDocumentation"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Require supporting documentation</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresBudgetApproval"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Require budget approval</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresLegalReview"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Require legal review</label>
                </div>
              </div>
            </div>

            <!-- Approval Timeline -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Approval Timeline</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Approval Deadline</label>
                  <input
                    v-model="formData.approvalDeadline"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                  <input
                    v-model="formData.effectiveDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>
              </div>
            </div>

            <!-- Additional Approvers -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Approvers</h3>
              <div class="space-y-4">
                <div v-for="(approver, index) in formData.additionalApprovers" :key="index" class="flex items-center space-x-4">
                  <div class="flex-1">
                    <input
                      v-model="approver.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Approver Name"
                    />
                  </div>
                  <div class="flex-1">
                    <input
                      v-model="approver.email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Email"
                    />
                  </div>
                  <div class="w-32">
                    <select
                      v-model="approver.role"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="REVIEWER">Reviewer</option>
                      <option value="APPROVER">Approver</option>
                      <option value="FINAL_APPROVER">Final Approver</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    @click="removeApprover(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="addApprover"
                  class="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                >
                  + Add Approver
                </button>
              </div>
            </div>

            <!-- Risk Assessment -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                  <select
                    v-model="formData.riskLevel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="LOW">Low Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="HIGH">High Risk</option>
                    <option value="CRITICAL">Critical Risk</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Compliance Check</label>
                  <select
                    v-model="formData.complianceCheck"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="REQUIRED">Required</option>
                    <option value="RECOMMENDED">Recommended</option>
                    <option value="NOT_REQUIRED">Not Required</option>
                  </select>
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Risk Notes</label>
                <textarea
                  v-model="formData.riskNotes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Any risk considerations or mitigation strategies..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleReject"
              class="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Reject
            </button>
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
              Approve
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'

interface Approver {
  name: string
  email: string
  role: string
}

interface Approval {
  comments: string
  approvalLevel: string
  priority: string
  requiresNotification: boolean
  requiresDocumentation: boolean
  requiresBudgetApproval: boolean
  requiresLegalReview: boolean
  approvalDeadline: string
  effectiveDate: string
  additionalApprovers: Approver[]
  riskLevel: string
  complianceCheck: string
  riskNotes: string
}

const props = defineProps<{
  isOpen: boolean
  itemType?: string
  itemId?: string
  itemName?: string
  itemAmount?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Approval]
  saveDraft: [data: Approval]
  reject: [data: Approval]
}>()

const formData = reactive<Approval>({
  comments: '',
  approvalLevel: '',
  priority: 'MEDIUM',
  requiresNotification: true,
  requiresDocumentation: false,
  requiresBudgetApproval: false,
  requiresLegalReview: false,
  approvalDeadline: '',
  effectiveDate: '',
  additionalApprovers: [],
  riskLevel: 'LOW',
  complianceCheck: 'RECOMMENDED',
  riskNotes: ''
})

const addApprover = () => {
  formData.additionalApprovers.push({
    name: '',
    email: '',
    role: 'REVIEWER'
  })
}

const removeApprover = (index: number) => {
  formData.additionalApprovers.splice(index, 1)
}

const handleSubmit = () => {
  const approvalData = {
    ...formData,
    id: Date.now().toString(),
    status: 'APPROVED',
    approvedBy: 'Current User',
    approvedAt: new Date().toISOString()
  }
  emit('submit', approvalData)
}

const handleSaveDraft = () => {
  const approvalData = {
    ...formData,
    id: Date.now().toString(),
    status: 'DRAFT'
  }
  emit('saveDraft', approvalData)
}

const handleReject = () => {
  const approvalData = {
    ...formData,
    id: Date.now().toString(),
    status: 'REJECTED',
    rejectedBy: 'Current User',
    rejectedAt: new Date().toISOString()
  }
  emit('reject', approvalData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    comments: '',
    approvalLevel: '',
    priority: 'MEDIUM',
    requiresNotification: true,
    requiresDocumentation: false,
    requiresBudgetApproval: false,
    requiresLegalReview: false,
    approvalDeadline: '',
    effectiveDate: '',
    additionalApprovers: [],
    riskLevel: 'LOW',
    complianceCheck: 'RECOMMENDED',
    riskNotes: ''
  })
  emit('close')
}
</script>
