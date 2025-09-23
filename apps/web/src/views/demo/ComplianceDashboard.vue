<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
        <p class="text-gray-600 mt-2">
          Contract templates, e-signature, sensitive records locker, and compliance reminders
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <FileText class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Contracts</p>
              <p class="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Signed Contracts</p>
              <p class="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Reminders</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Shield class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Sensitive Records</p>
              <p class="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'contracts'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'contracts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Contracts
            </button>
            <button
              @click="activeTab = 'templates'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Templates
            </button>
            <button
              @click="activeTab = 'records'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Records Locker
            </button>
            <button
              @click="activeTab = 'reminders'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'reminders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Reminders
            </button>
          </nav>
        </div>
      </div>

      <!-- Contracts Tab -->
      <div v-if="activeTab === 'contracts'" class="space-y-6">
        <!-- Contract Actions -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Contract Management</h2>
          <button @click="createContract" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Plus class="h-4 w-4 mr-2" />
            Create Contract
          </button>
        </div>

        <!-- Contracts List -->
        <div class="card">
          <div class="divide-y divide-gray-200">
            <div
              v-for="contract in mockContracts"
              :key="contract.id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ contract.name }}</h3>
                    <span :class="getContractStatusColor(contract.status)">
                      {{ contract.status }}
                    </span>
                    <span v-if="contract.isSensitive" class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Sensitive
                    </span>
                  </div>
                  
                  <p class="text-gray-600 mb-3">{{ contract.description }}</p>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <User class="h-4 w-4" />
                      <span>Created by {{ contract.createdBy }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Calendar class="h-4 w-4" />
                      <span>Created {{ contract.createdAt }}</span>
                    </div>
                    <div v-if="contract.expiresAt" class="flex items-center space-x-1">
                      <Clock class="h-4 w-4" />
                      <span>Expires {{ contract.expiresAt }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Users class="h-4 w-4" />
                      <span>{{ contract.signaturesCount }} signatures</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button
                    v-if="contract.status === 'PENDING_SIGNATURE'"
                    @click="signContract(contract.id)"
                    class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm"
                  >
                    <PenTool class="h-4 w-4 mr-1" />
                    Send for Signature
                  </button>
                  <button @click="viewContract(contract.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Eye class="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button @click="downloadContract(contract.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Download class="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Templates Tab -->
      <div v-if="activeTab === 'templates'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Contract Templates</h2>
          <button @click="createTemplate" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Plus class="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>

        <!-- Templates Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="template in mockTemplates"
            :key="template.id"
            class="card p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ template.name }}</h3>
              <span :class="getTemplateTypeColor(template.type)">
                {{ template.type }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ template.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Category</span>
                <span class="font-medium">{{ template.category }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Usage Count</span>
                <span class="font-medium">{{ template.usageCount }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Last Updated</span>
                <span class="font-medium">{{ template.lastUpdated }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button @click="useTemplate(template.id)" class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm flex-1">
                <FileText class="h-4 w-4 mr-1" />
                Use Template
              </button>
              <button @click="editTemplate(template.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                <Edit class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Records Locker Tab -->
      <div v-if="activeTab === 'records'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Sensitive Records Locker</h2>
          <div class="flex items-center space-x-4">
            <select class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300">
              <option>All Records</option>
              <option>Contracts</option>
              <option>Licenses</option>
              <option>Certificates</option>
            </select>
            <button @click="createRecord" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <Plus class="h-4 w-4 mr-2" />
              Add Record
            </button>
          </div>
        </div>

        <!-- Records List -->
        <div class="card">
          <div class="divide-y divide-gray-200">
            <div
              v-for="record in mockRecords"
              :key="record.id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ record.name }}</h3>
                    <span :class="getRecordTypeColor(record.type)">
                      {{ record.type }}
                    </span>
                    <span v-if="record.isSensitive" class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Sensitive
                    </span>
                    <span :class="getAccessLevelColor(record.accessLevel)">
                      {{ record.accessLevel }}
                    </span>
                  </div>
                  
                  <p class="text-gray-600 mb-3">{{ record.description }}</p>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <User class="h-4 w-4" />
                      <span>Created by {{ record.createdBy }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Calendar class="h-4 w-4" />
                      <span>{{ record.createdAt }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Shield class="h-4 w-4" />
                      <span>{{ record.category }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button @click="viewRecord(record.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Eye class="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button @click="downloadRecord(record.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Download class="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button @click="editRecord(record.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Edit class="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reminders Tab -->
      <div v-if="activeTab === 'reminders'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Compliance Reminders</h2>
          <div class="flex items-center space-x-2">
            <button
              @click="reminderFilter = 'all'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                reminderFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              All
            </button>
            <button
              @click="reminderFilter = 'pending'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                reminderFilter === 'pending'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Pending
            </button>
            <button
              @click="reminderFilter = 'overdue'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                reminderFilter === 'overdue'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Overdue
            </button>
          </div>
        </div>

        <!-- Reminders List -->
        <div class="card">
          <div class="divide-y divide-gray-200">
            <div
              v-for="reminder in filteredReminders"
              :key="reminder.id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ reminder.title }}</h3>
                    <span :class="getReminderTypeColor(reminder.type)">
                      {{ reminder.type }}
                    </span>
                    <span :class="getReminderStatusColor(reminder.isCompleted)">
                      {{ reminder.isCompleted ? 'Completed' : 'Pending' }}
                    </span>
                  </div>
                  
                  <p class="text-gray-600 mb-3">{{ reminder.description }}</p>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <Calendar class="h-4 w-4" />
                      <span>Due {{ reminder.dueDate }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <User class="h-4 w-4" />
                      <span>Created by {{ reminder.createdBy }}</span>
                    </div>
                    <div v-if="reminder.completedBy" class="flex items-center space-x-1">
                      <CheckCircle class="h-4 w-4" />
                      <span>Completed by {{ reminder.completedBy }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button
                    v-if="!reminder.isCompleted"
                    @click="completeReminder(reminder.id)"
                    class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm"
                  >
                    <CheckCircle class="h-4 w-4 mr-1" />
                    Mark Complete
                  </button>
                  <button @click="editReminder(reminder.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Edit class="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Demo -->
      <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
          <ul class="space-y-3">
            <li class="flex items-center space-x-2">
              <FileText class="h-4 w-4 text-blue-600" />
              <span>Contract template repository with version control</span>
            </li>
            <li class="flex items-center space-x-2">
              <PenTool class="h-4 w-4 text-green-600" />
              <span>E-signature integration (DocuSign, Adobe Sign)</span>
            </li>
            <li class="flex items-center space-x-2">
              <Shield class="h-4 w-4 text-purple-600" />
              <span>Sensitive records locker with access controls</span>
            </li>
            <li class="flex items-center space-x-2">
              <AlertTriangle class="h-4 w-4 text-orange-600" />
              <span>Automated compliance reminders (visa, licenses, probation)</span>
            </li>
            <li class="flex items-center space-x-2">
              <Lock class="h-4 w-4 text-red-600" />
              <span>Role-based access control for sensitive documents</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Reminder Types</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Visa Expiry</span>
              <span class="text-sm text-gray-600">Immigration compliance</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">License Renewal</span>
              <span class="text-sm text-gray-600">Professional licenses</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Probation Review</span>
              <span class="text-sm text-gray-600">Employee reviews</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Contract Renewal</span>
              <span class="text-sm text-gray-600">Contract management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SidebarLayout from '@/components/SidebarLayout.vue'
import Tooltip from '@/components/Tooltip.vue'
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Plus, 
  User, 
  Calendar, 
  Clock, 
  Users, 
  PenTool, 
  Eye, 
  Download, 
  Edit,
  Lock
} from 'lucide-vue-next'

const activeTab = ref<'contracts' | 'templates' | 'records' | 'reminders'>('contracts')
const reminderFilter = ref<'all' | 'pending' | 'overdue'>('all')

const mockContracts = [
  {
    id: '1',
    name: 'Software License Agreement',
    description: 'Enterprise software licensing agreement with annual renewal',
    status: 'PENDING_SIGNATURE',
    isSensitive: false,
    createdBy: 'John Doe',
    createdAt: '2024-01-15',
    expiresAt: '2025-01-15',
    signaturesCount: 2
  },
  {
    id: '2',
    name: 'Confidentiality Agreement',
    description: 'NDA for sensitive project discussions',
    status: 'SIGNED',
    isSensitive: true,
    createdBy: 'Jane Smith',
    createdAt: '2024-01-10',
    expiresAt: '2026-01-10',
    signaturesCount: 3
  },
  {
    id: '3',
    name: 'Service Level Agreement',
    description: 'SLA for cloud services with performance metrics',
    status: 'DRAFT',
    isSensitive: false,
    createdBy: 'Mike Johnson',
    createdAt: '2024-01-20',
    expiresAt: null,
    signaturesCount: 0
  }
]

const mockTemplates = [
  {
    id: '1',
    name: 'Standard Employment Contract',
    description: 'Template for full-time employment agreements',
    type: 'CONTRACT',
    category: 'HR',
    usageCount: 45,
    lastUpdated: '2024-01-10'
  },
  {
    id: '2',
    name: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement template',
    type: 'AGREEMENT',
    category: 'Legal',
    usageCount: 23,
    lastUpdated: '2024-01-05'
  },
  {
    id: '3',
    name: 'Service Agreement',
    description: 'Template for service provider contracts',
    type: 'CONTRACT',
    category: 'Business',
    usageCount: 18,
    lastUpdated: '2024-01-12'
  }
]

const mockRecords = [
  {
    id: '1',
    name: 'Business License - California',
    description: 'State business license for California operations',
    type: 'LICENSE',
    category: 'Business',
    isSensitive: false,
    accessLevel: 'INTERNAL',
    createdBy: 'John Doe',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Employee Background Check - Jane Smith',
    description: 'Comprehensive background verification report',
    type: 'OTHER',
    category: 'HR',
    isSensitive: true,
    accessLevel: 'RESTRICTED',
    createdBy: 'HR Department',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'ISO 27001 Certificate',
    description: 'Information security management system certification',
    type: 'CERTIFICATE',
    category: 'Compliance',
    isSensitive: false,
    accessLevel: 'PUBLIC',
    createdBy: 'Compliance Team',
    createdAt: '2024-01-05'
  }
]

const mockReminders = [
  {
    id: '1',
    title: 'Visa Renewal - John Doe',
    description: 'H-1B visa renewal due in 30 days',
    type: 'VISA_EXPIRY',
    dueDate: '2024-02-15',
    isCompleted: false,
    createdBy: 'HR Department',
    completedBy: null
  },
  {
    id: '2',
    title: 'Professional License - Jane Smith',
    description: 'CPA license renewal required',
    type: 'LICENSE_RENEWAL',
    dueDate: '2024-01-30',
    isCompleted: false,
    createdBy: 'HR Department',
    completedBy: null
  },
  {
    id: '3',
    title: 'Probation Review - Mike Johnson',
    description: '90-day probation period review',
    type: 'PROBATION_REVIEW',
    dueDate: '2024-01-25',
    isCompleted: true,
    createdBy: 'HR Department',
    completedBy: 'Sarah Wilson'
  }
]

const filteredReminders = computed(() => {
  if (reminderFilter.value === 'all') return mockReminders
  if (reminderFilter.value === 'pending') return mockReminders.filter(r => !r.isCompleted)
  if (reminderFilter.value === 'overdue') {
    const today = new Date()
    return mockReminders.filter(r => !r.isCompleted && new Date(r.dueDate) < today)
  }
  return mockReminders
})

const getContractStatusColor = (status: string) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_SIGNATURE: 'bg-yellow-100 text-yellow-800',
    SIGNED: 'bg-green-100 text-green-800',
    EXPIRED: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getTemplateTypeColor = (type: string) => {
  const colors = {
    CONTRACT: 'bg-blue-100 text-blue-800',
    AGREEMENT: 'bg-green-100 text-green-800',
    POLICY: 'bg-purple-100 text-purple-800',
    PROCEDURE: 'bg-orange-100 text-orange-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getRecordTypeColor = (type: string) => {
  const colors = {
    CONTRACT: 'bg-blue-100 text-blue-800',
    LICENSE: 'bg-green-100 text-green-800',
    CERTIFICATE: 'bg-purple-100 text-purple-800',
    OTHER: 'bg-gray-100 text-gray-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getAccessLevelColor = (level: string) => {
  const colors = {
    PUBLIC: 'bg-green-100 text-green-800',
    INTERNAL: 'bg-blue-100 text-blue-800',
    RESTRICTED: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getReminderTypeColor = (type: string) => {
  const colors = {
    VISA_EXPIRY: 'bg-red-100 text-red-800',
    LICENSE_RENEWAL: 'bg-blue-100 text-blue-800',
    PROBATION_REVIEW: 'bg-yellow-100 text-yellow-800',
    CONTRACT_RENEWAL: 'bg-green-100 text-green-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getReminderStatusColor = (isCompleted: boolean) => {
  return `px-2 py-1 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`
}

const completeReminder = (id: string) => {
  console.log('Completing reminder:', id)
  // Update reminder status to completed
  const reminder = mockReminders.find(r => r.id === id)
  if (reminder) {
    reminder.isCompleted = true
  }
}

// Contract management functions
const createContract = () => {
  console.log('Creating new contract')
  alert('Create Contract functionality would open contract creation form')
}

const viewContract = (id: string) => {
  console.log('Viewing contract:', id)
  alert(`Viewing contract ${id} details`)
}

const editContract = (id: string) => {
  console.log('Editing contract:', id)
  alert(`Editing contract ${id}`)
}

const signContract = (id: string) => {
  console.log('Signing contract:', id)
  alert(`Opening e-signature workflow for contract ${id}`)
}

const downloadContract = (id: string) => {
  console.log('Downloading contract:', id)
  alert(`Downloading contract ${id} as PDF`)
}

// Template management functions
const createTemplate = () => {
  console.log('Creating new template')
  alert('Create Template functionality would open template creation form')
}

const viewTemplate = (id: string) => {
  console.log('Viewing template:', id)
  alert(`Viewing template ${id} details`)
}

const editTemplate = (id: string) => {
  console.log('Editing template:', id)
  alert(`Editing template ${id}`)
}

const useTemplate = (id: string) => {
  console.log('Using template:', id)
  alert(`Creating new contract from template ${id}`)
}

// Records management functions
const createRecord = () => {
  console.log('Creating new record')
  alert('Create Record functionality would open record creation form')
}

const viewRecord = (id: string) => {
  console.log('Viewing record:', id)
  alert(`Viewing record ${id} details`)
}

const editRecord = (id: string) => {
  console.log('Editing record:', id)
  alert(`Editing record ${id}`)
}

const downloadRecord = (id: string) => {
  console.log('Downloading record:', id)
  alert(`Downloading record ${id} as PDF`)
}

const lockRecord = (id: string) => {
  console.log('Locking record:', id)
  alert(`Locking record ${id} for security`)
}

const unlockRecord = (id: string) => {
  console.log('Unlocking record:', id)
  alert(`Unlocking record ${id}`)
}

// Reminder management functions
const createReminder = () => {
  console.log('Creating new reminder')
  alert('Create Reminder functionality would open reminder creation form')
}

const viewReminder = (id: string) => {
  console.log('Viewing reminder:', id)
  alert(`Viewing reminder ${id} details`)
}

const editReminder = (id: string) => {
  console.log('Editing reminder:', id)
  alert(`Editing reminder ${id}`)
}

const deleteReminder = (id: string) => {
  console.log('Deleting reminder:', id)
  if (confirm('Are you sure you want to delete this reminder?')) {
    alert(`Reminder ${id} deleted`)
  }
}
</script>
