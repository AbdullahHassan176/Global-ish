<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Contract Details</h2>
          <p class="text-brand-teal mt-1">View and download contract information and documents</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Contract Information -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Contract Information</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-600">Contract Title</label>
                <p class="text-gray-900">{{ contract?.title || 'Contract Title' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Contract ID</label>
                <p class="text-gray-900">{{ contract?.id || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Status</label>
                <span :class="getStatusClass(contract?.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ contract?.status || 'Unknown' }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Created Date</label>
                <p class="text-gray-900">{{ contract?.createdDate || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Parties</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-600">Company</label>
                <p class="text-gray-900">{{ contract?.companyName || 'Company Name' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Counterparty</label>
                <p class="text-gray-900">{{ contract?.counterpartyName || 'Counterparty Name' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Contract Type</label>
                <p class="text-gray-900">{{ contract?.type || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Duration</label>
                <p class="text-gray-900">{{ contract?.duration || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Actions -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6 mb-6">
        <h3 class="text-lg font-semibold text-brand-navy mb-4">Document Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            @click="viewDocument"
            class="flex items-center justify-center p-4 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            <Eye class="h-5 w-5 mr-2" />
            View Document
          </button>
          <button
            @click="downloadPDF"
            class="flex items-center justify-center p-4 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            <Download class="h-5 w-5 mr-2" />
            Download PDF
          </button>
          <button
            @click="downloadWord"
            class="flex items-center justify-center p-4 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            <FileText class="h-5 w-5 mr-2" />
            Download Word
          </button>
          <button
            @click="shareDocument"
            class="flex items-center justify-center p-4 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            <Share class="h-5 w-5 mr-2" />
            Share Document
          </button>
          <button
            @click="printDocument"
            class="flex items-center justify-center p-4 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            <Printer class="h-5 w-5 mr-2" />
            Print Document
          </button>
          <button
            @click="emailDocument"
            class="flex items-center justify-center p-4 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            <Mail class="h-5 w-5 mr-2" />
            Email Document
          </button>
        </div>
      </div>

      <!-- Signature Status -->
      <div v-if="contract?.status === 'PENDING_SIGNATURE' || contract?.status === 'SIGNED'" class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6 mb-6">
        <h3 class="text-lg font-semibold text-brand-navy mb-4">Signature Status</h3>
        <div class="space-y-4">
          <div v-for="signature in signatures" :key="signature.id" class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User class="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ signature.signerName }}</p>
                <p class="text-sm text-gray-600">{{ signature.signerEmail }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="getSignatureStatusClass(signature.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ signature.status }}
              </span>
              <span class="text-sm text-gray-600">{{ signature.signedDate || 'Not signed' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Document History -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
        <h3 class="text-lg font-semibold text-brand-navy mb-4">Document History</h3>
        <div class="space-y-3">
          <div v-for="event in documentHistory" :key="event.id" class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <component :is="getEventIcon(event.type)" class="h-4 w-4 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ event.description }}</p>
              <p class="text-sm text-gray-600">{{ event.timestamp }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">{{ event.user }}</p>
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
          Close
        </button>
        <button
          @click="editContract"
          class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300"
        >
          Edit Contract
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Eye, Download, FileText, Share, Printer, Mail, User, Edit, Clock, CheckCircle, AlertTriangle } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

interface Props {
  isOpen: boolean
  contract?: {
    id: string
    title: string
    status: string
    createdDate: string
    companyName: string
    counterpartyName: string
    type: string
    duration: string
  }
}

interface Signature {
  id: string
  signerName: string
  signerEmail: string
  status: string
  signedDate?: string
}

interface DocumentEvent {
  id: string
  type: string
  description: string
  timestamp: string
  user: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  edit: [contract: any]
  view: [contract: any]
  download: [contract: any, format: string]
  share: [contract: any]
  print: [contract: any]
  email: [contract: any]
}>()

const signatures = ref<Signature[]>([
  {
    id: '1',
    signerName: 'John Doe',
    signerEmail: 'john.doe@company.com',
    status: 'SIGNED',
    signedDate: '2024-01-15'
  },
  {
    id: '2',
    signerName: 'Jane Smith',
    signerEmail: 'jane.smith@counterparty.com',
    status: 'PENDING',
    signedDate: undefined
  }
])

const documentHistory = ref<DocumentEvent[]>([
  {
    id: '1',
    type: 'created',
    description: 'Contract created and sent for review',
    timestamp: '2024-01-10 10:30 AM',
    user: 'System Admin'
  },
  {
    id: '2',
    type: 'reviewed',
    description: 'Contract reviewed by legal team',
    timestamp: '2024-01-12 2:15 PM',
    user: 'Legal Team'
  },
  {
    id: '3',
    type: 'sent',
    description: 'Contract sent for signature',
    timestamp: '2024-01-13 9:00 AM',
    user: 'Contract Manager'
  },
  {
    id: '4',
    type: 'signed',
    description: 'Contract signed by John Doe',
    timestamp: '2024-01-15 11:45 AM',
    user: 'John Doe'
  }
])

const getStatusClass = (status: string) => {
  switch (status) {
    case 'SIGNED':
      return 'bg-green-100 text-green-800'
    case 'PENDING_SIGNATURE':
      return 'bg-yellow-100 text-yellow-800'
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800'
    case 'EXPIRED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSignatureStatusClass = (status: string) => {
  switch (status) {
    case 'SIGNED':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'DECLINED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'created':
      return FileText
    case 'reviewed':
      return Eye
    case 'sent':
      return Mail
    case 'signed':
      return CheckCircle
    case 'expired':
      return AlertTriangle
    default:
      return Clock
  }
}

const viewDocument = () => {
  console.log('Viewing document:', props.contract)
  notify.info('View Document', 'Opening document viewer...')
  emit('view', props.contract)
}

const downloadPDF = () => {
  console.log('Downloading PDF:', props.contract)
  notify.success('Download Started', 'Downloading contract as PDF...')
  emit('download', props.contract, 'pdf')
}

const downloadWord = () => {
  console.log('Downloading Word:', props.contract)
  notify.success('Download Started', 'Downloading contract as Word document...')
  emit('download', props.contract, 'word')
}

const shareDocument = () => {
  console.log('Sharing document:', props.contract)
  notify.info('Share Document', 'Opening share options...')
  emit('share', props.contract)
}

const printDocument = () => {
  console.log('Printing document:', props.contract)
  notify.info('Print Document', 'Opening print dialog...')
  emit('print', props.contract)
}

const emailDocument = () => {
  console.log('Emailing document:', props.contract)
  notify.info('Email Document', 'Opening email composer...')
  emit('email', props.contract)
}

const editContract = () => {
  console.log('Editing contract:', props.contract)
  notify.info('Edit Contract', 'Opening contract editor...')
  emit('edit', props.contract)
}

const close = () => {
  emit('close')
}
</script>
