<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-3xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Send for Signature</h2>
          <p class="text-brand-teal mt-1">Configure e-signature workflow and send contract for signing</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Contract Info -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-4 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-brand-navy">{{ contract?.title || 'Contract Title' }}</h3>
            <p class="text-sm text-gray-600">Contract ID: {{ contract?.id || 'N/A' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Status: <span class="font-medium text-yellow-600">Pending Signature</span></p>
            <p class="text-sm text-gray-600">Created: {{ contract?.createdDate || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Signature Configuration -->
      <div class="space-y-6">
        <!-- Signers -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Signers</h3>
          <div class="space-y-4">
            <div v-for="(signer, index) in signers" :key="index" class="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200">
              <div class="flex-1">
                <input
                  v-model="signer.name"
                  type="text"
                  placeholder="Signer name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              <div class="flex-1">
                <input
                  v-model="signer.email"
                  type="email"
                  placeholder="Email address"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              <div class="w-32">
                <select
                  v-model="signer.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="signer">Signer</option>
                  <option value="approver">Approver</option>
                  <option value="cc">CC</option>
                </select>
              </div>
              <div class="w-24">
                <input
                  v-model="signer.order"
                  type="number"
                  placeholder="Order"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              <button
                v-if="signers.length > 1"
                @click="removeSigner(index)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <button
              @click="addSigner"
              class="w-full py-2 border-2 border-dashed border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Signer
            </button>
          </div>
        </div>

        <!-- Signature Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Signature Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Signature Order</label>
              <select
                v-model="signatureSettings.order"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="sequential">Sequential (one after another)</option>
                <option value="parallel">Parallel (simultaneous)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
              <select
                v-model="signatureSettings.reminderFrequency"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
              <input
                v-model="signatureSettings.expirationDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Security Level</label>
              <select
                v-model="signatureSettings.securityLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="standard">Standard</option>
                <option value="high">High Security</option>
                <option value="maximum">Maximum Security</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Message Template -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Message Template</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
              <input
                v-model="messageTemplate.subject"
                type="text"
                placeholder="Enter email subject"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
              <textarea
                v-model="messageTemplate.body"
                rows="4"
                placeholder="Enter email message"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
            <div class="flex items-center">
              <input
                v-model="messageTemplate.includeAttachment"
                type="checkbox"
                id="includeAttachment"
                class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
              />
              <label for="includeAttachment" class="ml-2 block text-sm text-gray-900">
                Include contract as attachment
              </label>
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
          @click="previewSignature"
          class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300"
        >
          Preview
        </button>
        <button
          @click="sendForSignature"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Send for Signature
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Plus } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

interface Props {
  isOpen: boolean
  contract?: {
    id: string
    title: string
    createdDate: string
  }
}

interface Signer {
  name: string
  email: string
  role: string
  order: number
}

interface SignatureSettings {
  order: string
  reminderFrequency: string
  expirationDate: string
  securityLevel: string
}

interface MessageTemplate {
  subject: string
  body: string
  includeAttachment: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  send: [data: any]
  preview: [data: any]
}>()

const signers = ref<Signer[]>([
  { name: '', email: '', role: 'signer', order: 1 }
])

const signatureSettings = ref<SignatureSettings>({
  order: 'sequential',
  reminderFrequency: 'weekly',
  expirationDate: '',
  securityLevel: 'standard'
})

const messageTemplate = ref<MessageTemplate>({
  subject: 'Contract Signature Required',
  body: 'Please review and sign the attached contract. Your signature is required to proceed.',
  includeAttachment: true
})

const addSigner = () => {
  signers.value.push({
    name: '',
    email: '',
    role: 'signer',
    order: signers.value.length + 1
  })
}

const removeSigner = (index: number) => {
  signers.value.splice(index, 1)
  // Update order numbers
  signers.value.forEach((signer, idx) => {
    signer.order = idx + 1
  })
}

const sendForSignature = () => {
  if (!signers.value.some(s => s.name && s.email)) {
    notify.warning('Validation Error', 'Please add at least one signer with name and email')
    return
  }
  
  const data = {
    signers: signers.value,
    settings: signatureSettings.value,
    message: messageTemplate.value,
    contract: props.contract
  }
  
  console.log('Sending for signature:', data)
  notify.success('Signature Request Sent', 'Contract has been sent for signature successfully!')
  emit('send', data)
  close()
}

const previewSignature = () => {
  const data = {
    signers: signers.value,
    settings: signatureSettings.value,
    message: messageTemplate.value,
    contract: props.contract
  }
  
  console.log('Previewing signature workflow:', data)
  notify.info('Preview', 'Opening signature workflow preview...')
  emit('preview', data)
}

const close = () => {
  emit('close')
}
</script>
