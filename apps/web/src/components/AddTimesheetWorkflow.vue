<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Add Timesheet Entry</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                <select
                  v-model="formData.employeeId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Employee</option>
                  <option v-for="employee in employees" :key="employee.id" :value="employee.id">{{ employee.name }}</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  v-model="formData.projectId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Project</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  v-model="formData.date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hours Worked</label>
                <input
                  v-model="formData.hours"
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="8.0"
                  required
                />
              </div>
            </div>

            <!-- Task Details -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
              <textarea
                v-model="formData.taskDescription"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Describe the work performed..."
                required
              ></textarea>
            </div>

            <!-- Rate and Billing -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    v-model="formData.hourlyRate"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="75.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Billable</label>
                <select
                  v-model="formData.isBillable"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.isOvertime"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Overtime hours</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.isWeekend"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Weekend work</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresApproval"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Requires manager approval</label>
                </div>
              </div>
            </div>

            <!-- Time Tracking -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Time Tracking</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    v-model="formData.startTime"
                    type="time"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    v-model="formData.endTime"
                    type="time"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Break Duration (minutes)</label>
                <input
                  v-model="formData.breakDuration"
                  type="number"
                  min="0"
                  max="480"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="30"
                />
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                v-model="formData.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Any additional notes or comments..."
              ></textarea>
            </div>

            <!-- Summary -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Entry Summary</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Total Hours:</span>
                  <span class="font-medium">{{ formData.hours || 0 }}h</span>
                </div>
                <div>
                  <span class="text-gray-600">Hourly Rate:</span>
                  <span class="font-medium">${{ formData.hourlyRate || 0 }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Total Amount:</span>
                  <span class="font-medium">${{ calculateTotal() }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Billable:</span>
                  <span class="font-medium">{{ formData.isBillable ? 'Yes' : 'No' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
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
              Submit Timesheet
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X } from 'lucide-vue-next'

interface TimesheetEntry {
  id: string
  employeeId: string
  projectId: string
  date: string
  hours: number
  taskDescription: string
  hourlyRate: number
  isBillable: boolean
  isOvertime: boolean
  isWeekend: boolean
  requiresApproval: boolean
  startTime: string
  endTime: string
  breakDuration: number
  notes: string
}

interface Employee {
  id: string
  name: string
  department: string
}

interface Project {
  id: string
  name: string
  clientName: string
  status: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: TimesheetEntry]
  saveDraft: [data: TimesheetEntry]
}>()

const formData = reactive<TimesheetEntry>({
  id: '',
  employeeId: '',
  projectId: '',
  date: new Date().toISOString().split('T')[0],
  hours: 0,
  taskDescription: '',
  hourlyRate: 0,
  isBillable: true,
  isOvertime: false,
  isWeekend: false,
  requiresApproval: true,
  startTime: '',
  endTime: '',
  breakDuration: 0,
  notes: ''
})

const employees: Employee[] = [
  { id: '1', name: 'John Doe', department: 'Development' },
  { id: '2', name: 'Jane Smith', department: 'Design' },
  { id: '3', name: 'Mike Johnson', department: 'Marketing' },
  { id: '4', name: 'Sarah Wilson', department: 'Sales' },
  { id: '5', name: 'David Chen', department: 'Development' }
]

const projects: Project[] = [
  { id: '1', name: 'Website Redesign', clientName: 'Acme Corp', status: 'ACTIVE' },
  { id: '2', name: 'Mobile App Development', clientName: 'TechStart Inc', status: 'ACTIVE' },
  { id: '3', name: 'Database Migration', clientName: 'DataCorp', status: 'COMPLETED' },
  { id: '4', name: 'E-commerce Platform', clientName: 'RetailCo', status: 'ACTIVE' },
  { id: '5', name: 'API Integration', clientName: 'ServiceCorp', status: 'PLANNING' }
]

const calculateTotal = () => {
  const hours = parseFloat(formData.hours.toString()) || 0
  const rate = parseFloat(formData.hourlyRate.toString()) || 0
  return (hours * rate).toFixed(2)
}

const handleSubmit = () => {
  const timesheetData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', timesheetData)
}

const handleSaveDraft = () => {
  const timesheetData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', timesheetData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    id: '',
    employeeId: '',
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    taskDescription: '',
    hourlyRate: 0,
    isBillable: true,
    isOvertime: false,
    isWeekend: false,
    requiresApproval: true,
    startTime: '',
    endTime: '',
    breakDuration: 0,
    notes: ''
  })
  emit('close')
}
</script>
