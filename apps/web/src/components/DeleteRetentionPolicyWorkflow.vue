<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Delete Retention Policy</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Warning Message -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <AlertTriangle class="h-5 w-5 text-red-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Warning</h3>
                <p class="mt-1 text-sm text-red-700">
                  This action will permanently delete the retention policy. This cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <!-- Policy Details -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Policy Details</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Policy Name:</span>
                <span class="font-medium">{{ policyName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Record Type:</span>
                <span class="font-medium">{{ policyRecordType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Data Category:</span>
                <span class="font-medium">{{ policyDataCategory }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span :class="getStatusColor(policyStatus)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ policyStatus }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Retention Period:</span>
                <span class="font-medium">{{ policyRetentionPeriod }} {{ policyRetentionUnit?.toLowerCase() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Legal Basis:</span>
                <span class="font-medium">{{ policyLegalBasis }}</span>
              </div>
            </div>
          </div>

          <!-- Impact Assessment -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Impact Assessment</h3>
            <div class="space-y-4">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-yellow-800 mb-2">Potential Consequences:</h4>
                <ul class="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Data governed by this policy will no longer be automatically managed</li>
                  <li>Existing retention schedules will be disrupted</li>
                  <li>Compliance requirements may not be met</li>
                  <li>Manual intervention may be required for data lifecycle management</li>
                </ul>
              </div>

              <!-- Affected Records -->
              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-700">Affected Records</h4>
                <div class="bg-gray-100 p-3 rounded-md">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Total Records:</span>
                    <span class="font-medium">{{ affectedRecordCount }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Active Schedules:</span>
                    <span class="font-medium">{{ activeScheduleCount }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Pending Deletions:</span>
                    <span class="font-medium">{{ pendingDeletionCount }}</span>
                  </div>
                </div>
              </div>

              <!-- Alternative Actions -->
              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-700">Alternative Actions</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input
                      v-model="formData.suspendInstead"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Suspend policy instead of deleting</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="formData.transferToDefault"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Transfer affected records to default policy</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="formData.createBackup"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Create backup before deletion</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Deletion Options -->
          <div class="border-t border-gray-200 pt-6" v-if="!formData.suspendInstead">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Deletion Options</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Data Handling</label>
                <select
                  v-model="formData.dataHandling"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="IMMEDIATE_DELETE">Delete data immediately</option>
                  <option value="GRACE_PERIOD">Allow 30-day grace period</option>
                  <option value="MANUAL_REVIEW">Require manual review</option>
                  <option value="TRANSFER_DEFAULT">Transfer to default retention policy</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notification Settings</label>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input
                      v-model="formData.notifyStakeholders"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Notify stakeholders</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="formData.notifyDataOwners"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Notify data owners</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="formData.notifyCompliance"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Notify compliance team</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type "{{ formData.suspendInstead ? 'SUSPEND POLICY' : 'DELETE POLICY' }}" to confirm
                </label>
                <input
                  v-model="formData.confirmationText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  :placeholder="`Type ${formData.suspendInstead ? 'SUSPEND POLICY' : 'DELETE POLICY'} to confirm`"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Action</label>
                <textarea
                  v-model="formData.reason"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  :placeholder="`Enter reason for ${formData.suspendInstead ? 'suspending' : 'deleting'} this policy`"
                ></textarea>
              </div>

              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    v-model="formData.acknowledgeImpact"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">I understand the impact of this action</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.acknowledgeCompliance"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">I confirm this action complies with legal requirements</label>
                </div>

                <div class="flex items-center" v-if="!formData.suspendInstead">
                  <input
                    v-model="formData.acknowledgeIrreversible"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">I understand this action is irreversible</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            @click="close"
            class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            @click="handleAction"
            :disabled="!canPerformAction"
            :class="[
              'px-4 py-2 rounded-lg transition-all duration-300',
              canPerformAction
                ? formData.suspendInstead
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ formData.suspendInstead ? 'Suspend Policy' : 'Delete Policy' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'

interface DeleteConfig {
  suspendInstead: boolean
  transferToDefault: boolean
  createBackup: boolean
  dataHandling: string
  notifyStakeholders: boolean
  notifyDataOwners: boolean
  notifyCompliance: boolean
  confirmationText: string
  reason: string
  acknowledgeImpact: boolean
  acknowledgeCompliance: boolean
  acknowledgeIrreversible: boolean
}

const props = defineProps<{
  isOpen: boolean
  policyId?: string
  policyName?: string
  policyRecordType?: string
  policyDataCategory?: string
  policyStatus?: string
  policyRetentionPeriod?: number
  policyRetentionUnit?: string
  policyLegalBasis?: string
}>()

const emit = defineEmits<{
  close: []
  delete: [data: DeleteConfig & { policyId: string }]
  suspend: [data: DeleteConfig & { policyId: string }]
}>()

const affectedRecordCount = ref(1250)
const activeScheduleCount = ref(45)
const pendingDeletionCount = ref(23)

const formData = reactive<DeleteConfig>({
  suspendInstead: false,
  transferToDefault: false,
  createBackup: true,
  dataHandling: 'GRACE_PERIOD',
  notifyStakeholders: true,
  notifyDataOwners: true,
  notifyCompliance: true,
  confirmationText: '',
  reason: '',
  acknowledgeImpact: false,
  acknowledgeCompliance: false,
  acknowledgeIrreversible: false
})

const canPerformAction = computed(() => {
  const requiredText = formData.suspendInstead ? 'SUSPEND POLICY' : 'DELETE POLICY'
  return formData.confirmationText === requiredText &&
         formData.reason &&
         formData.acknowledgeImpact &&
         formData.acknowledgeCompliance &&
         (formData.suspendInstead || formData.acknowledgeIrreversible)
})

const getStatusColor = (status: string) => {
  const colors = {
    ACTIVE: 'bg-green-100 text-green-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    SUSPENDED: 'bg-orange-100 text-orange-800',
    ARCHIVED: 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const handleAction = () => {
  const actionData = {
    ...formData,
    policyId: props.policyId || '',
    timestamp: new Date().toISOString()
  }

  if (formData.suspendInstead) {
    emit('suspend', actionData)
  } else {
    emit('delete', actionData)
  }
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    suspendInstead: false,
    transferToDefault: false,
    createBackup: true,
    dataHandling: 'GRACE_PERIOD',
    notifyStakeholders: true,
    notifyDataOwners: true,
    notifyCompliance: true,
    confirmationText: '',
    reason: '',
    acknowledgeImpact: false,
    acknowledgeCompliance: false,
    acknowledgeIrreversible: false
  })
  emit('close')
}
</script>
