<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-5xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create Workflow Template</h2>
          <p class="text-brand-teal mt-1">Design a reusable workflow template with steps, approvals, and automation</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Template Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Template Name</label>
              <input 
                v-model="templateData.name"
                type="text" 
                placeholder="Enter template name"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Category</label>
              <select 
                v-model="templateData.category"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select category</option>
                <option value="approval">Approval Workflow</option>
                <option value="onboarding">Onboarding</option>
                <option value="offboarding">Offboarding</option>
                <option value="project">Project Management</option>
                <option value="compliance">Compliance</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Description</label>
            <textarea 
              v-model="templateData.description"
              rows="3"
              placeholder="Enter template description"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Workflow Steps -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-brand-navy">Workflow Steps</h3>
            <button @click="addStep" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center">
              <Plus class="h-4 w-4 mr-2" />
              Add Step
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="(step, index) in templateData.steps" :key="index" class="bg-white/80 rounded-lg border border-brand-cyan/20 p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-brand-navy">Step {{ index + 1 }}</h4>
                <button @click="removeStep(index)" class="text-red-500 hover:text-red-700">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-2">Step Name</label>
                  <input 
                    v-model="step.name"
                    type="text" 
                    placeholder="Enter step name"
                    class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-2">Type</label>
                  <select 
                    v-model="step.type"
                    class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  >
                    <option value="manual">Manual</option>
                    <option value="approval">Approval</option>
                    <option value="automated">Automated</option>
                    <option value="notification">Notification</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-2">Assignee</label>
                  <select 
                    v-model="step.assignee"
                    class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  >
                    <option value="">Select assignee</option>
                    <option value="user">Specific User</option>
                    <option value="role">Role-based</option>
                    <option value="department">Department</option>
                    <option value="any">Any Available</option>
                  </select>
                </div>
              </div>
              <div class="mt-3">
                <label class="block text-sm font-medium text-brand-navy mb-2">Description</label>
                <textarea 
                  v-model="step.description"
                  rows="2"
                  placeholder="Enter step description"
                  class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Workflow Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Workflow Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">SLA (Hours)</label>
              <input 
                v-model="templateData.sla"
                type="number" 
                placeholder="Enter SLA in hours"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Priority</label>
              <select 
                v-model="templateData.priority"
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
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  v-model="templateData.requiresApproval"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Requires approval</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="templateData.autoStart"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Auto-start when triggered</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="templateData.notifications"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Send notifications</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Triggers & Conditions -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Triggers & Conditions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Trigger Type</label>
              <select 
                v-model="templateData.triggerType"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="manual">Manual Start</option>
                <option value="event">Event Triggered</option>
                <option value="schedule">Scheduled</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Conditions</label>
              <input 
                v-model="templateData.conditions"
                type="text" 
                placeholder="Enter trigger conditions"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Template will be available for use after creation
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="createTemplate" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Create Template
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Plus, Trash2 } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const templateData = ref({
  name: '',
  description: '',
  category: '',
  steps: [
    {
      name: '',
      type: 'manual',
      assignee: '',
      description: ''
    }
  ],
  sla: '',
  priority: 'normal',
  requiresApproval: false,
  autoStart: false,
  notifications: true,
  triggerType: 'manual',
  conditions: ''
})

const addStep = () => {
  templateData.value.steps.push({
    name: '',
    type: 'manual',
    assignee: '',
    description: ''
  })
}

const removeStep = (index: number) => {
  templateData.value.steps.splice(index, 1)
}

const createTemplate = () => {
  if (!templateData.value.name || templateData.value.steps.length === 0) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Creating workflow template:', templateData.value)
  emit('submit', templateData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving template draft:', templateData.value)
  notify.success('Draft Saved', 'Template draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  templateData.value = {
    name: '',
    description: '',
    category: '',
    steps: [
      {
        name: '',
        type: 'manual',
        assignee: '',
        description: ''
      }
    ],
    sla: '',
    priority: 'normal',
    requiresApproval: false,
    autoStart: false,
    notifications: true,
    triggerType: 'manual',
    conditions: ''
  }
}
</script>
