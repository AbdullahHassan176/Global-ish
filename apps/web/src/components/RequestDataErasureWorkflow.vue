<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Request Data Erasure</h2>
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
                <h3 class="text-sm font-medium text-red-800">Important Notice</h3>
                <p class="mt-1 text-sm text-red-700">
                  This action will permanently delete your personal data from our systems. This action cannot be undone.
                  Some data may be retained for legal or regulatory purposes.
                </p>
              </div>
            </div>
          </div>

          <!-- Data Categories -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Data to be Erased</h3>
            <div class="space-y-3">
              <div v-for="category in dataCategories" :key="category.id" class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    v-model="formData.selectedCategories"
                    :value="category.id"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">{{ category.name }}</label>
                    <p class="text-xs text-gray-500">{{ category.description }}</p>
                  </div>
                </div>
                <span class="text-sm text-gray-500">{{ category.recordCount }} records</span>
              </div>
            </div>
          </div>

          <!-- Erasure Details -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Erasure</label>
              <select
                v-model="formData.erasureReason"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
              >
                <option value="">Select reason</option>
                <option value="WITHDRAWAL_OF_CONSENT">Withdrawal of consent</option>
                <option value="NO_LONGER_NECESSARY">Data no longer necessary</option>
                <option value="OBJECTION_TO_PROCESSING">Objection to processing</option>
                <option value="UNLAWFUL_PROCESSING">Unlawful processing</option>
                <option value="LEGAL_OBLIGATION">Legal obligation for erasure</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div v-if="formData.erasureReason === 'OTHER'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Specify Reason</label>
              <textarea
                v-model="formData.customReason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Please specify your reason for data erasure"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Processing Priority</label>
              <select
                v-model="formData.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
              >
                <option value="STANDARD">Standard (30 days)</option>
                <option value="URGENT">Urgent (7 days)</option>
                <option value="IMMEDIATE">Immediate (24 hours - requires justification)</option>
              </select>
            </div>

            <div v-if="formData.priority === 'IMMEDIATE'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Justification for Immediate Processing</label>
              <textarea
                v-model="formData.urgentJustification"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Please provide justification for immediate processing"
              ></textarea>
            </div>
          </div>

          <!-- Impact Assessment -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Impact Assessment</h3>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-yellow-800 mb-2">Services that will be affected:</h4>
              <ul class="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>You will lose access to your account and all associated services</li>
                <li>All saved preferences and settings will be permanently deleted</li>
                <li>Historical data and reports will no longer be accessible</li>
                <li>Active subscriptions and services will be cancelled</li>
                <li>You will need to create a new account to use our services again</li>
              </ul>
            </div>
          </div>

          <!-- Legal Information -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Legal Information</h3>
            <div class="space-y-4">
              <div class="text-sm text-gray-600">
                <p class="mb-2"><strong>Your Rights:</strong></p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Right to erasure under GDPR Article 17</li>
                  <li>Right to be informed about the processing of your request</li>
                  <li>Right to lodge a complaint with a supervisory authority</li>
                </ul>
              </div>

              <div class="text-sm text-gray-600">
                <p class="mb-2"><strong>Data Retention:</strong></p>
                <p>Some data may be retained for:</p>
                <ul class="list-disc list-inside space-y-1 mt-1">
                  <li>Legal compliance (tax records, audit logs)</li>
                  <li>Fraud prevention and security</li>
                  <li>Regulatory requirements</li>
                  <li>Legitimate business interests</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email (for confirmation)</label>
              <input
                v-model="formData.contactEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Comments (Optional)</label>
              <textarea
                v-model="formData.comments"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Any additional information or special requests"
              ></textarea>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmation</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type "DELETE MY DATA" to confirm</label>
                <input
                  v-model="formData.confirmationText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Type DELETE MY DATA to confirm"
                />
              </div>

              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    v-model="formData.acknowledgeConsequences"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">I understand the consequences of data erasure</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.acknowledgeIrreversible"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">I understand this action is irreversible</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.acknowledgeLegal"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">I acknowledge some data may be retained for legal purposes</label>
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
            @click="handleRequestErasure"
            :disabled="!canRequestErasure"
            :class="[
              'px-4 py-2 rounded-lg transition-all duration-300',
              canRequestErasure
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Request Data Erasure
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'

interface DataCategory {
  id: string
  name: string
  description: string
  recordCount: number
}

interface ErasureConfig {
  selectedCategories: string[]
  erasureReason: string
  customReason: string
  priority: string
  urgentJustification: string
  contactEmail: string
  comments: string
  confirmationText: string
  acknowledgeConsequences: boolean
  acknowledgeIrreversible: boolean
  acknowledgeLegal: boolean
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  erase: [data: ErasureConfig]
}>()

const dataCategories = ref<DataCategory[]>([
  {
    id: 'profile',
    name: 'Profile Information',
    description: 'Personal details, contact information, preferences',
    recordCount: 15
  },
  {
    id: 'activity',
    name: 'Activity Logs',
    description: 'Login history, actions, system interactions',
    recordCount: 1250
  },
  {
    id: 'documents',
    name: 'Documents & Files',
    description: 'Uploaded files, generated documents, attachments',
    recordCount: 45
  },
  {
    id: 'communications',
    name: 'Communications',
    description: 'Messages, emails, notifications, support tickets',
    recordCount: 320
  },
  {
    id: 'preferences',
    name: 'Settings & Preferences',
    description: 'Account settings, privacy preferences, notifications',
    recordCount: 28
  },
  {
    id: 'analytics',
    name: 'Usage Analytics',
    description: 'Usage patterns, performance data, analytics',
    recordCount: 890
  },
  {
    id: 'financial',
    name: 'Financial Data',
    description: 'Payment history, billing information, invoices',
    recordCount: 156
  }
])

const formData = reactive<ErasureConfig>({
  selectedCategories: ['profile', 'activity', 'documents', 'communications', 'preferences', 'analytics'],
  erasureReason: '',
  customReason: '',
  priority: 'STANDARD',
  urgentJustification: '',
  contactEmail: '',
  comments: '',
  confirmationText: '',
  acknowledgeConsequences: false,
  acknowledgeIrreversible: false,
  acknowledgeLegal: false
})

const canRequestErasure = computed(() => {
  return formData.selectedCategories.length > 0 &&
         formData.erasureReason &&
         formData.contactEmail &&
         formData.confirmationText === 'DELETE MY DATA' &&
         formData.acknowledgeConsequences &&
         formData.acknowledgeIrreversible &&
         formData.acknowledgeLegal &&
         (formData.erasureReason !== 'OTHER' || formData.customReason) &&
         (formData.priority !== 'IMMEDIATE' || formData.urgentJustification)
})

const handleRequestErasure = () => {
  const erasureData = {
    ...formData,
    id: Date.now().toString(),
    requestedAt: new Date().toISOString()
  }
  emit('erase', erasureData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    selectedCategories: ['profile', 'activity', 'documents', 'communications', 'preferences', 'analytics'],
    erasureReason: '',
    customReason: '',
    priority: 'STANDARD',
    urgentJustification: '',
    contactEmail: '',
    comments: '',
    confirmationText: '',
    acknowledgeConsequences: false,
    acknowledgeIrreversible: false,
    acknowledgeLegal: false
  })
  emit('close')
}
</script>
