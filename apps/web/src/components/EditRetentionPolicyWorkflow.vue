<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Edit Retention Policy</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Policy Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Policy Information</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-blue-600">Policy ID:</span>
                <span class="ml-2 text-blue-900">{{ policy?.id || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-blue-600">Created:</span>
                <span class="ml-2 text-blue-900">{{ policy?.createdAt || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-blue-600">Status:</span>
                <span class="ml-2 text-blue-900">{{ policy?.status || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-blue-600">Last Modified:</span>
                <span class="ml-2 text-blue-900">{{ policy?.lastModified || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Policy Name</label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Enter policy name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Describe the purpose and scope of this retention policy"
              ></textarea>
            </div>
          </div>

          <!-- Data Classification -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Data Classification</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
                <select
                  v-model="formData.recordType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select record type</option>
                  <option value="USER_PROFILE">User Profile Data</option>
                  <option value="SESSION_DATA">Session Data</option>
                  <option value="AUDIT_LOGS">Audit Logs</option>
                  <option value="FINANCIAL_RECORDS">Financial Records</option>
                  <option value="COMMUNICATION_LOGS">Communication Logs</option>
                  <option value="MARKETING_DATA">Marketing Data</option>
                  <option value="ANALYTICS_DATA">Analytics Data</option>
                  <option value="BACKUP_DATA">Backup Data</option>
                  <option value="TEMPORARY_FILES">Temporary Files</option>
                  <option value="CUSTOM">Custom Record Type</option>
                </select>
              </div>

              <div v-if="formData.recordType === 'CUSTOM'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Custom Record Type</label>
                <input
                  v-model="formData.customRecordType"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Specify custom record type"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Data Category</label>
                <select
                  v-model="formData.dataCategory"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select data category</option>
                  <option value="PERSONAL_DATA">Personal Data</option>
                  <option value="SENSITIVE_DATA">Sensitive Personal Data</option>
                  <option value="BUSINESS_DATA">Business Data</option>
                  <option value="TECHNICAL_DATA">Technical Data</option>
                  <option value="PSEUDONYMIZED_DATA">Pseudonymized Data</option>
                  <option value="ANONYMIZED_DATA">Anonymized Data</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Classification Level</label>
                <select
                  v-model="formData.classificationLevel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select classification level</option>
                  <option value="PUBLIC">Public</option>
                  <option value="INTERNAL">Internal</option>
                  <option value="CONFIDENTIAL">Confidential</option>
                  <option value="RESTRICTED">Restricted</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Retention Configuration -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Retention Configuration</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      v-model.number="formData.retentionPeriod"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter number"
                    />
                  </div>
                  <div>
                    <select
                      v-model="formData.retentionUnit"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="DAYS">Days</option>
                      <option value="WEEKS">Weeks</option>
                      <option value="MONTHS">Months</option>
                      <option value="YEARS">Years</option>
                    </select>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Total retention period: {{ calculateTotalDays() }} days
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Retention Start</label>
                <select
                  v-model="formData.retentionStart"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="CREATION_DATE">From creation date</option>
                  <option value="LAST_ACCESS">From last access date</option>
                  <option value="LAST_MODIFIED">From last modified date</option>
                  <option value="EXPIRATION_DATE">From expiration date</option>
                  <option value="CUSTOM_DATE">From custom date</option>
                </select>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.autoDelete"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Enable automatic deletion</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.softDelete"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Use soft delete (archive first)</label>
                </div>
              </div>

              <div v-if="formData.softDelete">
                <label class="block text-sm font-medium text-gray-700 mb-2">Archive Period Before Deletion</label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      v-model.number="formData.archivePeriod"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter number"
                    />
                  </div>
                  <div>
                    <select
                      v-model="formData.archiveUnit"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="DAYS">Days</option>
                      <option value="WEEKS">Weeks</option>
                      <option value="MONTHS">Months</option>
                      <option value="YEARS">Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Legal Basis -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Legal Basis</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Legal Basis for Retention</label>
                <select
                  v-model="formData.legalBasis"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select legal basis</option>
                  <option value="LEGAL_OBLIGATION">Legal Obligation</option>
                  <option value="LEGITIMATE_INTEREST">Legitimate Interest</option>
                  <option value="CONTRACT">Contract Performance</option>
                  <option value="CONSENT">User Consent</option>
                  <option value="VITAL_INTERESTS">Vital Interests</option>
                  <option value="PUBLIC_TASK">Public Task</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Legal Reference</label>
                <input
                  v-model="formData.legalReference"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="e.g., GDPR Art. 6(1)(c), Tax Code Section 123"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Regulatory Requirements</label>
                <textarea
                  v-model="formData.regulatoryRequirements"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Describe relevant regulatory requirements"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="formData.notifyBeforeDeletion"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Send notification before deletion</label>
              </div>

              <div v-if="formData.notifyBeforeDeletion">
                <label class="block text-sm font-medium text-gray-700 mb-2">Notification Period Before Deletion</label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      v-model.number="formData.notificationPeriod"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter number"
                    />
                  </div>
                  <div>
                    <select
                      v-model="formData.notificationUnit"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="DAYS">Days</option>
                      <option value="WEEKS">Weeks</option>
                      <option value="MONTHS">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notification Recipients</label>
                <textarea
                  v-model="formData.notificationRecipients"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter email addresses separated by commas"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Exceptions -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Exceptions & Special Conditions</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hold Conditions</label>
                <textarea
                  v-model="formData.holdConditions"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Conditions under which retention should be extended (e.g., legal hold, active investigation)"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Destruction Method</label>
                <select
                  v-model="formData.destructionMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select destruction method</option>
                  <option value="SECURE_DELETE">Secure Delete</option>
                  <option value="OVERWRITE">Overwrite</option>
                  <option value="PHYSICAL_DESTRUCTION">Physical Destruction</option>
                  <option value="CRYPTOGRAPHIC_ERASURE">Cryptographic Erasure</option>
                  <option value="ANONYMIZATION">Anonymization</option>
                </select>
              </div>

              <div class="flex items-center">
                <input
                  v-model="formData.verifyDestruction"
                  type="checkbox"
                  class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Require destruction verification</label>
              </div>
            </div>
          </div>

          <!-- Policy Status -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Policy Status</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                <input
                  v-model="formData.effectiveDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Review Date</label>
                <input
                  v-model="formData.reviewDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
            </div>
          </div>

          <!-- Change Log -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Change Log</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Changes</label>
              <textarea
                v-model="formData.changeReason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Describe the reason for these changes"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            @click="handleDeletePolicy"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Delete Policy
          </button>
          <div class="flex items-center space-x-3">
            <button
              @click="close"
              class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              @click="saveDraft"
              class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              @click="handleUpdatePolicy"
              :disabled="!canUpdatePolicy"
              :class="[
                'px-4 py-2 rounded-lg transition-all duration-300',
                canUpdatePolicy
                  ? 'bg-gradient-to-r from-brand-orange to-brand-magenta text-white hover:from-brand-orange/90 hover:to-brand-magenta/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              Update Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface RetentionPolicyData {
  name: string
  description: string
  recordType: string
  customRecordType: string
  dataCategory: string
  classificationLevel: string
  retentionPeriod: number
  retentionUnit: string
  retentionStart: string
  autoDelete: boolean
  softDelete: boolean
  archivePeriod: number
  archiveUnit: string
  legalBasis: string
  legalReference: string
  regulatoryRequirements: string
  notifyBeforeDeletion: boolean
  notificationPeriod: number
  notificationUnit: string
  notificationRecipients: string
  holdConditions: string
  destructionMethod: string
  verifyDestruction: boolean
  status: string
  effectiveDate: string
  reviewDate: string
  changeReason: string
}

const props = defineProps<{
  isOpen: boolean
  policy?: any
}>()

const emit = defineEmits<{
  close: []
  update: [data: RetentionPolicyData]
  delete: [id: string]
  saveDraft: [data: RetentionPolicyData]
}>()

const formData = reactive<RetentionPolicyData>({
  name: '',
  description: '',
  recordType: '',
  customRecordType: '',
  dataCategory: '',
  classificationLevel: '',
  retentionPeriod: 365,
  retentionUnit: 'DAYS',
  retentionStart: 'CREATION_DATE',
  autoDelete: false,
  softDelete: false,
  archivePeriod: 30,
  archiveUnit: 'DAYS',
  legalBasis: '',
  legalReference: '',
  regulatoryRequirements: '',
  notifyBeforeDeletion: false,
  notificationPeriod: 7,
  notificationUnit: 'DAYS',
  notificationRecipients: '',
  holdConditions: '',
  destructionMethod: '',
  verifyDestruction: false,
  status: 'DRAFT',
  effectiveDate: '',
  reviewDate: '',
  changeReason: ''
})

// Watch for policy changes and populate form
watch(() => props.policy, (newPolicy) => {
  if (newPolicy) {
    Object.assign(formData, {
      name: newPolicy.name || '',
      description: newPolicy.description || '',
      recordType: newPolicy.recordType || '',
      customRecordType: newPolicy.customRecordType || '',
      dataCategory: newPolicy.dataCategory || '',
      classificationLevel: newPolicy.classificationLevel || '',
      retentionPeriod: newPolicy.retentionPeriod || 365,
      retentionUnit: newPolicy.retentionUnit || 'DAYS',
      retentionStart: newPolicy.retentionStart || 'CREATION_DATE',
      autoDelete: newPolicy.autoDelete || false,
      softDelete: newPolicy.softDelete || false,
      archivePeriod: newPolicy.archivePeriod || 30,
      archiveUnit: newPolicy.archiveUnit || 'DAYS',
      legalBasis: newPolicy.legalBasis || '',
      legalReference: newPolicy.legalReference || '',
      regulatoryRequirements: newPolicy.regulatoryRequirements || '',
      notifyBeforeDeletion: newPolicy.notifyBeforeDeletion || false,
      notificationPeriod: newPolicy.notificationPeriod || 7,
      notificationUnit: newPolicy.notificationUnit || 'DAYS',
      notificationRecipients: newPolicy.notificationRecipients || '',
      holdConditions: newPolicy.holdConditions || '',
      destructionMethod: newPolicy.destructionMethod || '',
      verifyDestruction: newPolicy.verifyDestruction || false,
      status: newPolicy.status || 'DRAFT',
      effectiveDate: newPolicy.effectiveDate || '',
      reviewDate: newPolicy.reviewDate || '',
      changeReason: ''
    })
  }
}, { immediate: true })

const canUpdatePolicy = computed(() => {
  return formData.name &&
         formData.recordType &&
         formData.dataCategory &&
         formData.classificationLevel &&
         formData.retentionPeriod > 0 &&
         formData.legalBasis &&
         formData.effectiveDate &&
         formData.changeReason
})

const calculateTotalDays = () => {
  const multipliers = {
    DAYS: 1,
    WEEKS: 7,
    MONTHS: 30,
    YEARS: 365
  }
  return formData.retentionPeriod * (multipliers[formData.retentionUnit] || 1)
}

const handleUpdatePolicy = () => {
  const policyData = {
    ...formData,
    id: props.policy?.id,
    lastModified: new Date().toISOString()
  }
  emit('update', policyData)
}

const handleDeletePolicy = () => {
  if (props.policy?.id) {
    emit('delete', props.policy.id)
  }
}

const saveDraft = () => {
  const draftData = {
    ...formData,
    id: props.policy?.id,
    status: 'DRAFT',
    lastModified: new Date().toISOString()
  }
  emit('saveDraft', draftData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    name: '',
    description: '',
    recordType: '',
    customRecordType: '',
    dataCategory: '',
    classificationLevel: '',
    retentionPeriod: 365,
    retentionUnit: 'DAYS',
    retentionStart: 'CREATION_DATE',
    autoDelete: false,
    softDelete: false,
    archivePeriod: 30,
    archiveUnit: 'DAYS',
    legalBasis: '',
    legalReference: '',
    regulatoryRequirements: '',
    notifyBeforeDeletion: false,
    notificationPeriod: 7,
    notificationUnit: 'DAYS',
    notificationRecipients: '',
    holdConditions: '',
    destructionMethod: '',
    verifyDestruction: false,
    status: 'DRAFT',
    effectiveDate: '',
    reviewDate: '',
    changeReason: ''
  })
  emit('close')
}
</script>
