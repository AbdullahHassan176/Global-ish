<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create New Contract</h2>
          <p class="text-brand-teal mt-1">Set up a new contract with templates and e-signature workflow</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Contract Details -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Contract Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contract Title</label>
              <input
                v-model="contractData.title"
                type="text"
                placeholder="Enter contract title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
              <select
                v-model="contractData.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="">Select contract type</option>
                <option value="employment">Employment Agreement</option>
                <option value="service">Service Agreement</option>
                <option value="nda">Non-Disclosure Agreement</option>
                <option value="vendor">Vendor Contract</option>
                <option value="lease">Lease Agreement</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                v-model="contractData.startDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                v-model="contractData.endDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Template Selection -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Template Selection</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="template in templates" :key="template.id" class="border border-gray-200 rounded-lg p-4 hover:border-brand-teal transition-colors cursor-pointer" :class="{ 'border-brand-teal bg-brand-teal/5': contractData.templateId === template.id }" @click="contractData.templateId = template.id">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">{{ template.name }}</h4>
                  <p class="text-sm text-gray-600">{{ template.description }}</p>
                </div>
                <div class="flex items-center">
                  <FileText class="h-5 w-5 text-brand-teal" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Parties Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Parties Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Company/Organization</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    v-model="contractData.companyName"
                    type="text"
                    placeholder="Enter company name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    v-model="contractData.companyContact"
                    type="text"
                    placeholder="Enter contact person"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    v-model="contractData.companyEmail"
                    type="email"
                    placeholder="Enter email address"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Counterparty</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Name/Organization</label>
                  <input
                    v-model="contractData.counterpartyName"
                    type="text"
                    placeholder="Enter counterparty name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    v-model="contractData.counterpartyContact"
                    type="text"
                    placeholder="Enter contact person"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    v-model="contractData.counterpartyEmail"
                    type="email"
                    placeholder="Enter email address"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- E-Signature Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">E-Signature Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                v-model="contractData.requireSignature"
                type="checkbox"
                id="requireSignature"
                class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
              />
              <label for="requireSignature" class="ml-2 block text-sm text-gray-900">
                Require e-signature for this contract
              </label>
            </div>
            <div v-if="contractData.requireSignature" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Signature Order</label>
                <select
                  v-model="contractData.signatureOrder"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="sequential">Sequential (one after another)</option>
                  <option value="parallel">Parallel (simultaneous)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
                <select
                  v-model="contractData.reminderFrequency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
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
          @click="createContract"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Create Contract
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, FileText } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

interface Props {
  isOpen: boolean
}

interface ContractData {
  title: string
  type: string
  startDate: string
  endDate: string
  templateId: string
  companyName: string
  companyContact: string
  companyEmail: string
  counterpartyName: string
  counterpartyContact: string
  counterpartyEmail: string
  requireSignature: boolean
  signatureOrder: string
  reminderFrequency: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  create: [data: ContractData]
  saveDraft: [data: ContractData]
}>()

const contractData = ref<ContractData>({
  title: '',
  type: '',
  startDate: '',
  endDate: '',
  templateId: '',
  companyName: '',
  companyContact: '',
  companyEmail: '',
  counterpartyName: '',
  counterpartyContact: '',
  counterpartyEmail: '',
  requireSignature: false,
  signatureOrder: 'sequential',
  reminderFrequency: 'weekly'
})

const templates = ref([
  {
    id: '1',
    name: 'Employment Agreement',
    description: 'Standard employment contract template'
  },
  {
    id: '2',
    name: 'Service Agreement',
    description: 'Professional services contract template'
  },
  {
    id: '3',
    name: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement template'
  },
  {
    id: '4',
    name: 'Vendor Contract',
    description: 'Vendor services agreement template'
  }
])

const createContract = () => {
  if (!contractData.value.title || !contractData.value.type) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Creating contract:', contractData.value)
  notify.success('Contract Created', `Contract "${contractData.value.title}" has been created successfully!`)
  emit('create', contractData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving contract draft:', contractData.value)
  notify.success('Draft Saved', 'Contract draft has been saved successfully!')
  emit('saveDraft', contractData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
