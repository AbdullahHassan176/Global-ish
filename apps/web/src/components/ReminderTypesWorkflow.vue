<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Reminder Types Management</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Reminder Types Overview -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Available Reminder Types</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="reminderType in reminderTypes" 
              :key="reminderType.id"
              class="p-4 border border-gray-200 rounded-lg hover:border-brand-teal hover:shadow-md transition-all duration-300 cursor-pointer"
              @click="selectReminderType(reminderType)"
            >
              <div class="flex items-center space-x-3">
                <div :class="reminderType.iconBg" class="p-2 rounded-lg">
                  <component :is="reminderType.icon" class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ reminderType.name }}</h4>
                  <p class="text-sm text-gray-600">{{ reminderType.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Reminder Type Details -->
        <div v-if="selectedReminderType" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Configure {{ selectedReminderType.name }}</h3>
          <div class="bg-gray-50 p-6 rounded-lg">
            <form @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Basic Information -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Title</label>
                    <input
                      v-model="formData.title"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter reminder title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      v-model="formData.description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter reminder description"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      v-model="formData.dueDate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      required
                    />
                  </div>
                </div>

                <!-- Advanced Settings -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                    <select
                      v-model="formData.priority"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <select
                      v-model="formData.assignedTo"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="">Select assignee</option>
                      <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
                    <select
                      v-model="formData.frequency"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="ONCE">Once</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>

                  <div class="flex items-center">
                    <input
                      v-model="formData.sendNotifications"
                      type="checkbox"
                      class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Send email notifications</label>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="handleSaveDraft"
                  class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
                >
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Recent Reminders -->
        <div v-if="!selectedReminderType">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Reminders</h3>
          <div class="space-y-3">
            <div 
              v-for="reminder in recentReminders" 
              :key="reminder.id"
              class="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div :class="getReminderTypeColor(reminder.type)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ reminder.type }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ reminder.title }}</h4>
                    <p class="text-sm text-gray-600">{{ reminder.description }}</p>
                  </div>
                </div>
                <div class="text-sm text-gray-500">
                  Due: {{ reminder.dueDate }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Calendar, AlertTriangle, Shield, Clock, User, FileText } from 'lucide-vue-next'

interface ReminderType {
  id: string
  name: string
  description: string
  icon: any
  iconBg: string
}

interface Reminder {
  id: string
  title: string
  description: string
  type: string
  dueDate: string
  priority: string
  assignedTo: string
  frequency: string
  sendNotifications: boolean
}

interface User {
  id: string
  name: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Reminder]
  saveDraft: [data: Reminder]
}>()

const selectedReminderType = ref<ReminderType | null>(null)

const formData = reactive<Reminder>({
  id: '',
  title: '',
  description: '',
  type: '',
  dueDate: '',
  priority: 'MEDIUM',
  assignedTo: '',
  frequency: 'ONCE',
  sendNotifications: true
})

const reminderTypes: ReminderType[] = [
  {
    id: 'visa-expiry',
    name: 'Visa Expiry',
    description: 'Track employee visa expiration dates',
    icon: Calendar,
    iconBg: 'bg-red-500'
  },
  {
    id: 'license-renewal',
    name: 'License Renewal',
    description: 'Professional license renewal reminders',
    icon: Shield,
    iconBg: 'bg-blue-500'
  },
  {
    id: 'probation-review',
    name: 'Probation Review',
    description: 'Employee probation period reviews',
    icon: User,
    iconBg: 'bg-yellow-500'
  },
  {
    id: 'contract-renewal',
    name: 'Contract Renewal',
    description: 'Contract expiration and renewal tracking',
    icon: FileText,
    iconBg: 'bg-green-500'
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit',
    description: 'Regular compliance audit schedules',
    icon: AlertTriangle,
    iconBg: 'bg-purple-500'
  },
  {
    id: 'training-certification',
    name: 'Training Certification',
    description: 'Employee training and certification renewals',
    icon: Clock,
    iconBg: 'bg-orange-500'
  }
]

const users: User[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Wilson' },
  { id: '5', name: 'HR Department' }
]

const recentReminders = ref([
  {
    id: '1',
    title: 'Visa Renewal - John Doe',
    description: 'H-1B visa renewal due in 30 days',
    type: 'VISA_EXPIRY',
    dueDate: '2024-02-15'
  },
  {
    id: '2',
    title: 'Professional License - Jane Smith',
    description: 'CPA license renewal required',
    type: 'LICENSE_RENEWAL',
    dueDate: '2024-01-30'
  },
  {
    id: '3',
    title: 'Probation Review - Mike Johnson',
    description: '90-day probation period review',
    type: 'PROBATION_REVIEW',
    dueDate: '2024-01-25'
  }
])

const selectReminderType = (reminderType: ReminderType) => {
  selectedReminderType.value = reminderType
  formData.type = reminderType.id.toUpperCase().replace('-', '_')
  formData.title = `${reminderType.name} Reminder`
  formData.description = reminderType.description
}

const handleSubmit = () => {
  const reminderData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', reminderData)
}

const handleSaveDraft = () => {
  const reminderData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', reminderData)
}

const close = () => {
  selectedReminderType.value = null
  formData.title = ''
  formData.description = ''
  formData.type = ''
  formData.dueDate = ''
  formData.priority = 'MEDIUM'
  formData.assignedTo = ''
  formData.frequency = 'ONCE'
  formData.sendNotifications = true
  emit('close')
}

const getReminderTypeColor = (type: string) => {
  const colors = {
    VISA_EXPIRY: 'bg-red-100 text-red-800',
    LICENSE_RENEWAL: 'bg-blue-100 text-blue-800',
    PROBATION_REVIEW: 'bg-yellow-100 text-yellow-800',
    CONTRACT_RENEWAL: 'bg-green-100 text-green-800',
    COMPLIANCE_AUDIT: 'bg-purple-100 text-purple-800',
    TRAINING_CERTIFICATION: 'bg-orange-100 text-orange-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}
</script>
