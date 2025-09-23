<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-brand-navy">Files Management Demo</h1>
        <p class="text-brand-teal mt-2">
          Comprehensive file management with virus scanning, OCR, blockchain anchoring, and access control
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Tooltip text="Total number of files stored in the system across all departments" position="top">
          <div class="card p-6 bg-white/90 backdrop-blur-sm border border-brand-cyan/20 shadow-lg">
            <div class="flex items-center">
              <div class="p-2 bg-gradient-to-br from-brand-orange to-brand-magenta rounded-lg">
                <FileText class="h-6 w-6 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-brand-teal">Total Files</p>
                <p class="text-2xl font-bold text-brand-navy">1,247</p>
              </div>
            </div>
          </div>
        </Tooltip>
        
        <div class="card p-6 bg-white/90 backdrop-blur-sm border border-brand-teal/20 shadow-lg">
          <div class="flex items-center">
            <div class="p-2 bg-gradient-to-br from-brand-teal to-brand-cyan rounded-lg">
              <Shield class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-brand-teal">Clean Files</p>
              <p class="text-2xl font-bold text-brand-navy">1,198</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6 bg-white/90 backdrop-blur-sm border border-brand-purple/20 shadow-lg">
          <div class="flex items-center">
            <div class="p-2 bg-gradient-to-br from-brand-purple to-brand-magenta rounded-lg">
              <Tag class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-brand-teal">OCR Processed</p>
              <p class="text-2xl font-bold text-brand-navy">892</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6 bg-white/90 backdrop-blur-sm border border-brand-pink/20 shadow-lg">
          <div class="flex items-center">
            <div class="p-2 bg-gradient-to-br from-brand-pink to-brand-purple rounded-lg">
              <Shield class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-brand-teal">Blockchain Anchored</p>
              <p class="text-2xl font-bold text-brand-navy">756</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <Tooltip text="Upload new files with automatic virus scanning and OCR processing" position="bottom">
            <button @click="handleUploadFiles" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <Upload class="h-4 w-4 mr-2" />
              Upload Files
            </button>
          </Tooltip>
          <Tooltip text="Create and manage file tags for better organization and search" position="bottom">
            <button @click="handleManageTags" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
              <Tag class="h-4 w-4 mr-2" />
              Manage Tags
            </button>
          </Tooltip>
          <Tooltip text="Configure access permissions and security settings for files" position="bottom">
            <button @click="handleAccessControl" class="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center">
              <Shield class="h-4 w-4 mr-2" />
              Access Control
            </button>
          </Tooltip>
        </div>
        
        <div class="text-sm text-brand-teal">
          {{ selectedFiles.length }} file(s) selected
        </div>
      </div>

      <!-- Data Table -->
      <DataTable
        :data="mockFiles"
        :columns="columns"
        :selectable="true"
        :selected-rows="selectedFiles"
        @selection-change="setSelectedFiles"
        @row-click="handleRowClick"
        @export="handleExport"
        :exportable="true"
        :searchable="true"
        :filterable="true"
        :pagination="pagination"
      />

      <!-- Features Demo -->
      <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card p-6 bg-white/90 backdrop-blur-sm border border-brand-cyan/20 shadow-lg">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Key Features</h3>
          <ul class="space-y-3">
            <li class="flex items-center space-x-2">
              <Shield class="h-4 w-4 text-brand-teal" />
              <span class="text-brand-navy">Virus scanning with multiple providers (ClamAV, VirusTotal, AWS GuardDuty)</span>
            </li>
            <li class="flex items-center space-x-2">
              <FileText class="h-4 w-4 text-brand-cyan" />
              <span class="text-brand-navy">OCR processing with Tesseract, AWS Textract, Azure Cognitive Services</span>
            </li>
            <li class="flex items-center space-x-2">
              <Shield class="h-4 w-4 text-brand-purple" />
              <span class="text-brand-navy">Blockchain anchoring for document integrity verification</span>
            </li>
            <li class="flex items-center space-x-2">
              <Tag class="h-4 w-4 text-brand-orange" />
              <span class="text-brand-navy">Advanced tagging and categorization system</span>
            </li>
            <li class="flex items-center space-x-2">
              <Shield class="h-4 w-4 text-brand-magenta" />
              <span class="text-brand-navy">Granular access control with role-based permissions</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6 bg-white/90 backdrop-blur-sm border border-brand-purple/20 shadow-lg">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Storage Providers</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-brand-cream to-brand-pink/30 rounded-lg border border-brand-cyan/20">
              <span class="font-medium text-brand-navy">Amazon S3</span>
              <span class="text-sm text-brand-teal">Primary storage</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-brand-cream to-brand-pink/30 rounded-lg border border-brand-cyan/20">
              <span class="font-medium text-brand-navy">Azure Blob Storage</span>
              <span class="text-sm text-brand-teal">Secondary storage</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-brand-cream to-brand-pink/30 rounded-lg border border-brand-cyan/20">
              <span class="font-medium text-brand-navy">Local Storage</span>
              <span class="text-sm text-brand-teal">Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tag Management Modal -->
  <TagManagementModal
    :is-open="isTagModalOpen"
    @close="closeTagModal"
  />

  <!-- Access Control Modal -->
  <AccessControlModal
    :is-open="isAccessControlModalOpen"
    :selected-files="selectedFiles"
    @close="closeAccessControlModal"
    @save="handleAccessControlSave"
  />
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, Download, Eye, Trash2, Tag, Shield, FileText } from 'lucide-vue-next'
import DataTable from '@/components/DataTable.vue'
import SidebarLayout from '@/components/SidebarLayout.vue'
import TagManagementModal from '@/components/TagManagementModal.vue'
import AccessControlModal from '@/components/AccessControlModal.vue'
import Tooltip from '@/components/Tooltip.vue'

interface FileItem {
  id: string
  name: string
  size: string
  type: string
  uploadedBy: string
  uploadedAt: string
  status: 'clean' | 'scanning' | 'infected'
  accessLevel: 'public' | 'internal' | 'private' | 'confidential'
  tags: string[]
  version: number
  ocrStatus: 'pending' | 'processing' | 'completed' | 'failed'
  chainAnchor?: string
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'contract_agreement.pdf',
    size: '2.4 MB',
    type: 'PDF',
    uploadedBy: 'John Doe',
    uploadedAt: '2024-01-15',
    status: 'clean',
    accessLevel: 'confidential',
    tags: ['contract', 'legal', 'agreement'],
    version: 1,
    ocrStatus: 'completed',
    chainAnchor: '0x1234...5678'
  },
  {
    id: '2',
    name: 'invoice_2024_001.pdf',
    size: '1.2 MB',
    type: 'PDF',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2024-01-14',
    status: 'clean',
    accessLevel: 'internal',
    tags: ['invoice', 'finance', '2024'],
    version: 1,
    ocrStatus: 'completed'
  },
  {
    id: '3',
    name: 'suspicious_file.exe',
    size: '5.8 MB',
    type: 'Executable',
    uploadedBy: 'Unknown',
    uploadedAt: '2024-01-13',
    status: 'infected',
    accessLevel: 'private',
    tags: ['quarantined'],
    version: 1,
    ocrStatus: 'failed'
  },
  {
    id: '4',
    name: 'presentation_draft.pptx',
    size: '8.1 MB',
    type: 'PowerPoint',
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-01-12',
    status: 'scanning',
    accessLevel: 'internal',
    tags: ['presentation', 'draft'],
    version: 2,
    ocrStatus: 'processing'
  }
]

const selectedFiles = ref<FileItem[]>([])

// Modal states
const isTagModalOpen = ref(false)
const isAccessControlModalOpen = ref(false)

const columns = computed(() => [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (value: string, row: FileItem) => ({
      component: 'div',
      class: 'flex items-center space-x-2',
      children: [
        { component: FileText, props: { class: 'h-4 w-4 text-gray-500' } },
        { component: 'span', props: { class: 'font-medium' }, children: value },
        ...(row.version > 1 ? [{
          component: 'span',
          props: { class: 'bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full' },
          children: `v${row.version}`
        }] : [])
      ]
    })
  },
  {
    key: 'size',
    title: 'Size',
    sortable: true,
    width: '100px'
  },
  {
    key: 'type',
    title: 'Type',
    sortable: true,
    width: '100px'
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    width: '120px',
    render: (value: string) => {
      const statusColors = {
        clean: 'bg-green-100 text-green-800',
        scanning: 'bg-yellow-100 text-yellow-800',
        infected: 'bg-red-100 text-red-800'
      }
      return {
        component: 'span',
        props: { class: `px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}` },
        children: value
      }
    }
  },
  {
    key: 'accessLevel',
    title: 'Access',
    sortable: true,
    width: '120px',
    render: (value: string) => {
      const accessColors = {
        public: 'bg-green-100 text-green-800',
        internal: 'bg-blue-100 text-blue-800',
        private: 'bg-gray-100 text-gray-800',
        confidential: 'bg-red-100 text-red-800'
      }
      return {
        component: 'span',
        props: { class: `px-2 py-1 rounded-full text-xs font-medium ${accessColors[value as keyof typeof accessColors]}` },
        children: value
      }
    }
  },
  {
    key: 'ocrStatus',
    title: 'OCR',
    sortable: true,
    width: '100px',
    render: (value: string) => {
      const ocrColors = {
        pending: 'bg-gray-100 text-gray-800',
        processing: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
      return {
        component: 'span',
        props: { class: `px-2 py-1 rounded-full text-xs font-medium ${ocrColors[value as keyof typeof ocrColors]}` },
        children: value
      }
    }
  },
  {
    key: 'chainAnchor',
    title: 'Blockchain',
    width: '120px',
    render: (value: string) => value ? {
      component: 'div',
      class: 'flex items-center space-x-1',
      children: [
        { component: Shield, props: { class: 'h-3 w-3 text-green-600' } },
        { component: 'span', props: { class: 'text-xs text-green-600' }, children: 'Anchored' }
      ]
    } : {
      component: 'span',
      props: { class: 'text-xs text-gray-400' },
      children: 'Pending'
    }
  },
  {
    key: 'uploadedBy',
    title: 'Uploaded By',
    sortable: true,
    width: '120px'
  },
  {
    key: 'uploadedAt',
    title: 'Date',
    sortable: true,
    width: '100px'
  },
  {
    key: 'actions',
    title: 'Actions',
    width: '120px',
    render: () => ({
      component: 'div',
      class: 'flex items-center space-x-1',
      children: [
        { component: 'button', props: { class: 'p-1 text-gray-400 hover:text-gray-600' }, children: [{ component: Eye, props: { class: 'h-4 w-4' } }] },
        { component: 'button', props: { class: 'p-1 text-gray-400 hover:text-gray-600' }, children: [{ component: Download, props: { class: 'h-4 w-4' } }] },
        { component: 'button', props: { class: 'p-1 text-gray-400 hover:text-red-600' }, children: [{ component: Trash2, props: { class: 'h-4 w-4' } }] }
      ]
    })
  }
])

const pagination = computed(() => ({
  page: 1,
  limit: 20,
  total: mockFiles.length,
  onPageChange: (page: number) => console.log('Page changed:', page),
  onLimitChange: (limit: number) => console.log('Limit changed:', limit)
}))

const setSelectedFiles = (files: FileItem[]) => {
  selectedFiles.value = files
}

const handleRowClick = (row: FileItem) => {
  console.log('File clicked:', row)
}

const handleExport = () => {
  console.log('Exporting files...')
}

// Button click handlers
const handleUploadFiles = () => {
  console.log('Upload Files clicked')
  alert('Upload Files functionality would open file picker dialog')
}

const handleManageTags = () => {
  console.log('Manage Tags clicked')
  isTagModalOpen.value = true
}

const handleAccessControl = () => {
  console.log('Access Control clicked')
  isAccessControlModalOpen.value = true
}

// Modal handlers
const closeTagModal = () => {
  isTagModalOpen.value = false
}

const closeAccessControlModal = () => {
  isAccessControlModalOpen.value = false
}

const handleAccessControlSave = (settings: any) => {
  console.log('Access control settings saved:', settings)
  isAccessControlModalOpen.value = false
}
</script>
