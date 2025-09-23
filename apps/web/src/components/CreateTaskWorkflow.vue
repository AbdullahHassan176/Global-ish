<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create New Task</h2>
          <p class="text-brand-teal mt-1">Set up a new task with assignments, due dates, and priority settings</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Task Title</label>
              <input 
                v-model="taskData.title"
                type="text" 
                placeholder="Enter task title"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Priority</label>
              <select 
                v-model="taskData.priority"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Description</label>
            <textarea 
              v-model="taskData.description"
              rows="3"
              placeholder="Enter task description"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Assignment & Dates -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Assignment & Timeline</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Assigned To</label>
              <select 
                v-model="taskData.assignedTo"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select assignee</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="mike-wilson">Mike Wilson</option>
                <option value="sarah-jones">Sarah Jones</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Due Date</label>
              <input 
                v-model="taskData.dueDate"
                type="date" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Estimated Hours</label>
              <input 
                v-model="taskData.estimatedHours"
                type="number" 
                placeholder="Enter hours"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Task Details -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Task Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Category</label>
              <select 
                v-model="taskData.category"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select category</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="support">Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Tags</label>
              <input 
                v-model="taskData.tags"
                type="text" 
                placeholder="Enter tags (comma separated)"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Additional Notes</label>
            <textarea 
              v-model="taskData.notes"
              rows="3"
              placeholder="Enter any additional notes or requirements"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Dependencies & Attachments -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Dependencies & Attachments</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Dependencies</label>
              <select 
                v-model="taskData.dependencies"
                multiple
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="task-1">Task 1: Setup Project</option>
                <option value="task-2">Task 2: Design Mockups</option>
                <option value="task-3">Task 3: Database Schema</option>
                <option value="task-4">Task 4: API Development</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Attachments</label>
              <div class="border-2 border-dashed border-brand-teal/30 rounded-lg p-4 text-center">
                <Upload class="h-8 w-8 text-brand-teal mx-auto mb-2" />
                <p class="text-sm text-brand-navy">Drop files here or click to upload</p>
                <input type="file" multiple class="hidden" @change="handleFileUpload" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          All fields marked with * are required
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="createTask" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Create Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Upload } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const taskData = ref({
  title: '',
  description: '',
  priority: 'normal',
  assignedTo: '',
  dueDate: '',
  estimatedHours: '',
  category: '',
  tags: '',
  notes: '',
  dependencies: [],
  attachments: []
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    taskData.value.attachments = Array.from(target.files)
  }
}

const createTask = () => {
  if (!taskData.value.title || !taskData.value.assignedTo) {
    alert('Please fill in all required fields')
    return
  }
  
  console.log('Creating task:', taskData.value)
  emit('submit', taskData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving task draft:', taskData.value)
  alert('Task draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  taskData.value = {
    title: '',
    description: '',
    priority: 'normal',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    category: '',
    tags: '',
    notes: '',
    dependencies: [],
    attachments: []
  }
}
</script>
