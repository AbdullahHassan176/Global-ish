<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">{{ item?.name || 'View Details' }}</h2>
        <div class="flex items-center space-x-2">
          <button @click="handleEdit" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
            <Edit class="h-4 w-4 mr-1" />
            Edit
          </button>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="item" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p class="text-lg font-semibold text-gray-900">{{ item.name }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p class="text-gray-900">{{ item.description }}</p>
              </div>

              <div v-if="item.status">
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span :class="getStatusColor(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ item.status }}
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <div v-if="item.clientName">
                <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <p class="text-gray-900">{{ item.clientName }}</p>
              </div>

              <div v-if="item.budget">
                <label class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <p class="text-gray-900">{{ item.budget }}</p>
              </div>

              <div v-if="item.hoursLogged">
                <label class="block text-sm font-medium text-gray-700 mb-1">Hours Logged</label>
                <p class="text-gray-900">{{ item.hoursLogged }}h</p>
              </div>

              <div v-if="item.progress !== undefined">
                <label class="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${item.progress}%` }"
                    />
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ item.progress }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Details (if it's a project) -->
          <div v-if="itemType === 'project'" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <p class="text-gray-900">{{ item.startDate || 'Not specified' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <p class="text-gray-900">{{ item.endDate || 'Not specified' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                <p class="text-gray-900">{{ item.teamMembers || 'Not specified' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                <p class="text-gray-900">{{ item.technologies || 'Not specified' }}</p>
              </div>
            </div>
          </div>

          <!-- Client Details (if it's a client) -->
          <div v-if="itemType === 'client'" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Client Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <p class="text-gray-900">{{ item.contactPerson }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p class="text-gray-900">{{ item.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p class="text-gray-900">{{ item.phone || 'Not specified' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p class="text-gray-900">{{ item.address || 'Not specified' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Projects Count</label>
                <p class="text-gray-900">{{ item.projectsCount }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Revenue</label>
                <p class="text-gray-900">{{ item.totalRevenue }}</p>
              </div>
            </div>
          </div>

          <!-- Timesheet Details (if it's a timesheet) -->
          <div v-if="itemType === 'timesheet'" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Timesheet Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <p class="text-gray-900">{{ item.userName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p class="text-gray-900">{{ item.date }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <p class="text-gray-900">{{ item.hours }}h</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                <p class="text-gray-900">${{ item.rate }}/h</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p class="text-gray-900">${{ item.amount }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span :class="getTimesheetStatusColor(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div v-if="itemType === 'project' || itemType === 'client'" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="flex items-center">
                  <DollarSign class="h-5 w-5 text-green-600" />
                  <div class="ml-2">
                    <p class="text-sm font-medium text-green-600">Total Revenue</p>
                    <p class="text-lg font-bold text-green-900">{{ item.totalRevenue || '$0' }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <div class="flex items-center">
                  <Clock class="h-5 w-5 text-blue-600" />
                  <div class="ml-2">
                    <p class="text-sm font-medium text-blue-600">Hours Logged</p>
                    <p class="text-lg font-bold text-blue-900">{{ item.hoursLogged || '0' }}h</p>
                  </div>
                </div>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <div class="flex items-center">
                  <TrendingUp class="h-5 w-5 text-purple-600" />
                  <div class="ml-2">
                    <p class="text-sm font-medium text-purple-600">Average Rate</p>
                    <p class="text-lg font-bold text-purple-900">${{ item.averageRate || '0' }}/h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div :class="activity.iconBg" class="p-2 rounded-full">
                  <component :is="activity.icon" class="h-4 w-4 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button @click="handleDownload" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
                  <Download class="h-4 w-4 mr-2" />
                  Download
                </button>
                <button @click="handleShare" class="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center">
                  <Share class="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
              <div class="flex items-center space-x-3">
                <button @click="handlePrint" class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center">
                  <Printer class="h-4 w-4 mr-2" />
                  Print
                </button>
                <button @click="handleEmail" class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center">
                  <Mail class="h-4 w-4 mr-2" />
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Edit, Download, Share, Printer, Mail, DollarSign, Clock, TrendingUp, Calendar, User, FileText } from 'lucide-vue-next'

interface ViewItem {
  id: string
  name: string
  description: string
  status?: string
  clientName?: string
  budget?: string
  hoursLogged?: number
  progress?: number
  startDate?: string
  endDate?: string
  teamMembers?: string
  technologies?: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  projectsCount?: number
  totalRevenue?: string
  userName?: string
  date?: string
  hours?: number
  rate?: number
  amount?: number
  averageRate?: number
}

interface Activity {
  id: string
  description: string
  timestamp: string
  icon: any
  iconBg: string
}

const props = defineProps<{
  isOpen: boolean
  item?: ViewItem | null
  itemType?: 'project' | 'client' | 'timesheet'
}>()

const emit = defineEmits<{
  close: []
  edit: [item: ViewItem]
  download: [item: ViewItem]
  share: [item: ViewItem]
  print: [item: ViewItem]
  email: [item: ViewItem]
}>()

const recentActivity = ref<Activity[]>([
  {
    id: '1',
    description: 'Project status updated to Active',
    timestamp: '2 hours ago',
    icon: Calendar,
    iconBg: 'bg-blue-500'
  },
  {
    id: '2',
    description: 'New timesheet entry added',
    timestamp: '1 day ago',
    icon: FileText,
    iconBg: 'bg-green-500'
  },
  {
    id: '3',
    description: 'Client information updated',
    timestamp: '3 days ago',
    icon: User,
    iconBg: 'bg-purple-500'
  }
])

const getStatusColor = (status: string) => {
  const colors = {
    ACTIVE: 'bg-green-100 text-green-800',
    PLANNING: 'bg-gray-100 text-gray-800',
    ON_HOLD: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getTimesheetStatusColor = (status: string) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const handleEdit = () => {
  if (props.item) {
    emit('edit', props.item)
  }
}

const handleDownload = () => {
  if (props.item) {
    emit('download', props.item)
  }
}

const handleShare = () => {
  if (props.item) {
    emit('share', props.item)
  }
}

const handlePrint = () => {
  if (props.item) {
    emit('print', props.item)
  }
}

const handleEmail = () => {
  if (props.item) {
    emit('email', props.item)
  }
}

const close = () => {
  emit('close')
}
</script>