<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Create New Project</h2>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <select
                  v-model="formData.clientId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Client</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Describe the project objectives and scope..."
                required
              ></textarea>
            </div>

            <!-- Project Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  v-model="formData.endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    v-model="formData.budget"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="25000.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
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
            </div>

            <!-- Team Assignment -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Team Assignment</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Project Manager</label>
                  <select
                    v-model="formData.projectManager"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  >
                    <option value="">Select Project Manager</option>
                    <option v-for="manager in projectManagers" :key="manager.id" :value="manager.id">{{ manager.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                  <div class="space-y-2">
                    <div v-for="member in teamMembers" :key="member.id" class="flex items-center">
                      <input
                        v-model="formData.selectedTeamMembers"
                        :value="member.id"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">{{ member.name }} ({{ member.role }})</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Technical Details</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div v-for="tech in technologies" :key="tech" class="flex items-center">
                      <input
                        v-model="formData.selectedTechnologies"
                        :value="tech"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">{{ tech }}</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select
                    v-model="formData.projectType"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="WEB_DEVELOPMENT">Web Development</option>
                    <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
                    <option value="DESIGN">Design</option>
                    <option value="CONSULTING">Consulting</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Complexity Level</label>
                  <select
                    v-model="formData.complexity"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="SIMPLE">Simple</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="COMPLEX">Complex</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Milestones -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Project Milestones</h3>
              <div class="space-y-3">
                <div v-for="(milestone, index) in formData.milestones" :key="index" class="flex items-center space-x-3">
                  <input
                    v-model="milestone.name"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Milestone name"
                  />
                  <input
                    v-model="milestone.date"
                    type="date"
                    class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                  <button
                    type="button"
                    @click="removeMilestone(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="addMilestone"
                  class="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                >
                  + Add Milestone
                </button>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.isBillable"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Billable project</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresApproval"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Requires client approval for major changes</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.trackTime"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Track time for this project</label>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                v-model="formData.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Any additional notes or special requirements..."
              ></textarea>
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'

interface Project {
  id: string
  name: string
  description: string
  clientId: string
  startDate: string
  endDate: string
  budget: number
  priority: string
  projectManager: string
  selectedTeamMembers: string[]
  selectedTechnologies: string[]
  projectType: string
  complexity: string
  milestones: Array<{ name: string; date: string }>
  isBillable: boolean
  requiresApproval: boolean
  trackTime: boolean
  notes: string
}

interface Client {
  id: string
  name: string
}

interface TeamMember {
  id: string
  name: string
  role: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Project]
  saveDraft: [data: Project]
}>()

const formData = reactive<Project>({
  id: '',
  name: '',
  description: '',
  clientId: '',
  startDate: '',
  endDate: '',
  budget: 0,
  priority: 'MEDIUM',
  projectManager: '',
  selectedTeamMembers: [],
  selectedTechnologies: [],
  projectType: 'WEB_DEVELOPMENT',
  complexity: 'MODERATE',
  milestones: [],
  isBillable: true,
  requiresApproval: true,
  trackTime: true,
  notes: ''
})

const clients: Client[] = [
  { id: '1', name: 'Acme Corporation' },
  { id: '2', name: 'TechStart Inc' },
  { id: '3', name: 'DataCorp Solutions' },
  { id: '4', name: 'RetailCo' },
  { id: '5', name: 'ServiceCorp' }
]

const projectManagers: TeamMember[] = [
  { id: '1', name: 'Sarah Wilson', role: 'Senior PM' },
  { id: '2', name: 'Mike Johnson', role: 'Project Manager' },
  { id: '3', name: 'Lisa Rodriguez', role: 'Lead PM' }
]

const teamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', role: 'Developer' },
  { id: '2', name: 'Jane Smith', role: 'Designer' },
  { id: '3', name: 'David Chen', role: 'Developer' },
  { id: '4', name: 'Emily Brown', role: 'QA Engineer' },
  { id: '5', name: 'Alex Kim', role: 'DevOps Engineer' }
]

const technologies = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java',
  'PHP', 'MySQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker',
  'Kubernetes', 'Git', 'Figma', 'Adobe XD'
]

const addMilestone = () => {
  formData.milestones.push({ name: '', date: '' })
}

const removeMilestone = (index: number) => {
  formData.milestones.splice(index, 1)
}

const handleSubmit = () => {
  const projectData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', projectData)
}

const handleSaveDraft = () => {
  const projectData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', projectData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    id: '',
    name: '',
    description: '',
    clientId: '',
    startDate: '',
    endDate: '',
    budget: 0,
    priority: 'MEDIUM',
    projectManager: '',
    selectedTeamMembers: [],
    selectedTechnologies: [],
    projectType: 'WEB_DEVELOPMENT',
    complexity: 'MODERATE',
    milestones: [],
    isBillable: true,
    requiresApproval: true,
    trackTime: true,
    notes: ''
  })
  emit('close')
}
</script>
