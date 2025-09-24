<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Workflows Management Demo</h1>
        <p class="text-gray-600 mt-2">
          JSON-defined workflows with roles, conditions, SLAs, approvals, and signature integration
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Play class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Workflows</p>
              <p class="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <Pause class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Paused</p>
              <p class="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Users class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Templates</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'instances'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'instances'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Workflow Instances
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
              Workflow Templates
            </button>
          </nav>
        </div>
      </div>

      <!-- Workflow Instances -->
      <div v-if="activeTab === 'instances'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Workflow List -->
        <div class="lg:col-span-1">
          <div class="card">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Active Workflows</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="workflow in mockWorkflows"
                :key="workflow.id"
                @click="selectedWorkflow = workflow"
                :class="[
                  'p-4 cursor-pointer hover:bg-gray-50',
                  selectedWorkflow?.id === workflow.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                ]"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-900">{{ workflow.name }}</h4>
                  <span :class="getStatusColor(workflow.status)">
                    {{ workflow.status }}
                  </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  Started by {{ workflow.startedBy }} on {{ workflow.startedAt }}
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500">
                    Step {{ workflow.currentStep }} of {{ workflow.steps.length }}
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ workflow.progress }}%
                  </div>
                </div>
                <div class="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${workflow.progress}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Workflow Details -->
        <div class="lg:col-span-2">
          <div v-if="selectedWorkflow" class="card">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-900">{{ selectedWorkflow.name }}</h3>
                <div class="flex items-center space-x-2">
                  <span :class="getStatusColor(selectedWorkflow.status)">
                    {{ selectedWorkflow.status }}
                  </span>
                  <Tooltip text="Pause the current workflow execution temporarily" position="top">
                    <button @click="handlePauseWorkflow" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                      <Pause class="h-4 w-4 mr-1" />
                      Pause
                    </button>
                  </Tooltip>
                  <Tooltip text="Resume a paused workflow to continue execution" position="top">
                    <button @click="handleResumeWorkflow" class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm">
                      <Play class="h-4 w-4 mr-1" />
                      Resume
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Started by:</span>
                  <span class="ml-2 font-medium">{{ selectedWorkflow.startedBy }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Started at:</span>
                  <span class="ml-2 font-medium">{{ selectedWorkflow.startedAt }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Progress:</span>
                  <span class="ml-2 font-medium">{{ selectedWorkflow.progress }}%</span>
                </div>
                <div>
                  <span class="text-gray-600">Current Step:</span>
                  <span class="ml-2 font-medium">{{ selectedWorkflow.currentStep }} of {{ selectedWorkflow.steps.length }}</span>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Workflow Steps</h4>
              
              <div class="space-y-4">
                <div
                  v-for="(step, index) in selectedWorkflow.steps"
                  :key="step.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <component :is="getStepIcon(step.status)" />
                      <h5 class="font-medium text-gray-900">{{ step.name }}</h5>
                      <span :class="getStepStatusColor(step.status)">
                        {{ step.status }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500">
                      SLA: {{ step.sla }}
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ step.description }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <div class="flex items-center space-x-1">
                        <Users class="h-4 w-4" />
                        <span>Assigned to {{ step.assignedTo }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <Clock class="h-4 w-4" />
                        <span>Due {{ step.dueDate }}</span>
                      </div>
                    </div>
                    <button
                      v-if="step.status === 'in_progress'"
                      @click="handleApproveStep(step)"
                      class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm"
                    >
                      <CheckCircle class="h-4 w-4 mr-1" />
                      Approve
                    </button>
                  </div>
                  <div v-if="step.data.comments" class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                    <strong>Comments:</strong> {{ step.data.comments }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="card p-12 text-center">
            <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Select a Workflow</h3>
            <p class="text-gray-600">Choose a workflow from the list to view its details and progress</p>
          </div>
        </div>
      </div>

      <!-- Workflow Templates -->
      <div v-if="activeTab === 'templates'" class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Workflow Templates</h3>
          <button @click="handleCreateTemplate" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <FileText class="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="template in workflowTemplates"
            :key="template.name"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">{{ template.name }}</h4>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ template.category }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-3">{{ template.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">{{ template.steps }} steps</span>
              <button @click="handleStartWorkflow(template)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                <Play class="h-4 w-4 mr-1" />
                Start
              </button>
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
              <span>JSON-defined workflow steps with conditions and SLAs</span>
            </li>
            <li class="flex items-center space-x-2">
              <Users class="h-4 w-4 text-green-600" />
              <span>Role-based step assignments and approvals</span>
            </li>
            <li class="flex items-center space-x-2">
              <Shield class="h-4 w-4 text-purple-600" />
              <span>Digital signature integration (DocuSign, Adobe Sign)</span>
            </li>
            <li class="flex items-center space-x-2">
              <Clock class="h-4 w-4 text-orange-600" />
              <span>SLA monitoring and escalation alerts</span>
            </li>
            <li class="flex items-center space-x-2">
              <Play class="h-4 w-4 text-red-600" />
              <span>Workflow pause, resume, and cancellation</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Integration Points</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" @click="handleDocuSignIntegration">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText class="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <span class="font-medium">DocuSign</span>
                  <span class="text-sm text-gray-600 block">E-signature</span>
                </div>
              </div>
              <button class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                Configure
              </button>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" @click="handleAdobeSignIntegration">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText class="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <span class="font-medium">Adobe Sign</span>
                  <span class="text-sm text-gray-600 block">E-signature</span>
                </div>
              </div>
              <button class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
                Configure
              </button>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" @click="handleEmailServiceIntegration">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail class="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span class="font-medium">Email Service</span>
                  <span class="text-sm text-gray-600 block">Notifications</span>
                </div>
              </div>
              <button class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                Configure
              </button>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" @click="handleSMSServiceIntegration">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare class="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <span class="font-medium">SMS Service</span>
                  <span class="text-sm text-gray-600 block">Alerts</span>
                </div>
              </div>
              <button class="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Workflow Template Workflow Modal -->
  <CreateWorkflowTemplateWorkflow
    :is-open="isCreateTemplateOpen"
    @close="closeCreateTemplate"
    @submit="handleTemplateSubmit"
  />

  <!-- Start Workflow Modal -->
  <StartWorkflow
    v-if="selectedTemplate"
    :is-open="isStartWorkflowOpen"
    :template="selectedTemplate"
    @close="closeStartWorkflow"
    @submit="handleWorkflowSubmit"
  />

  <!-- Pause Workflow Modal -->
  <PauseWorkflow
    :is-open="isPauseWorkflowOpen"
    :workflow-name="selectedWorkflow?.name || ''"
    @close="closePauseWorkflow"
    @submit="handlePauseSubmit"
  />

  <!-- Approve Step Modal -->
  <ApproveStepWorkflow
    v-if="selectedStep"
    :is-open="isApproveStepOpen"
    :step="selectedStep"
    @close="closeApproveStep"
    @submit="handleApproveSubmit"
  />

  <!-- DocuSign Integration Modal -->
  <DocuSignIntegrationWorkflow
    :is-open="isDocuSignIntegrationOpen"
    @close="closeDocuSignIntegration"
    @submit="handleDocuSignSubmit"
  />

  <!-- Email Service Integration Modal -->
  <EmailServiceIntegrationWorkflow
    :is-open="isEmailServiceIntegrationOpen"
    @close="closeEmailServiceIntegration"
    @submit="handleEmailServiceSubmit"
  />

  <!-- SMS Service Integration Modal -->
  <SMSServiceIntegrationWorkflow
    :is-open="isSMSServiceIntegrationOpen"
    @close="closeSMSServiceIntegration"
    @submit="handleSMSServiceSubmit"
  />
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Play, Pause, CheckCircle, XCircle, Clock, Users, FileText, Shield, Mail, MessageSquare } from 'lucide-vue-next'
import SidebarLayout from '@/components/SidebarLayout.vue'
import Tooltip from '@/components/Tooltip.vue'
import CreateWorkflowTemplateWorkflow from '@/components/CreateWorkflowTemplateWorkflow.vue'
import StartWorkflow from '@/components/StartWorkflow.vue'
import PauseWorkflow from '@/components/PauseWorkflow.vue'
import ApproveStepWorkflow from '@/components/ApproveStepWorkflow.vue'
import DocuSignIntegrationWorkflow from '@/components/DocuSignIntegrationWorkflow.vue'
import EmailServiceIntegrationWorkflow from '@/components/EmailServiceIntegrationWorkflow.vue'
import SMSServiceIntegrationWorkflow from '@/components/SMSServiceIntegrationWorkflow.vue'
import { notify } from '@/composables/useNotifications'

interface WorkflowStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
  assignedTo: string
  dueDate: string
  sla: string
  data: any
}

interface WorkflowInstance {
  id: string
  name: string
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled'
  currentStep: number
  startedBy: string
  startedAt: string
  progress: number
  steps: WorkflowStep[]
}

const activeTab = ref<'instances' | 'templates'>('instances')
const selectedWorkflow = ref<WorkflowInstance | null>(null)
const isCreateTemplateOpen = ref(false)
const isStartWorkflowOpen = ref(false)
const selectedTemplate = ref<any>(null)
const isPauseWorkflowOpen = ref(false)
const isApproveStepOpen = ref(false)
const selectedStep = ref<any>(null)
const isDocuSignIntegrationOpen = ref(false)
const isEmailServiceIntegrationOpen = ref(false)
const isSMSServiceIntegrationOpen = ref(false)

const mockWorkflows: WorkflowInstance[] = [
  {
    id: '1',
    name: 'Contract Approval Process',
    status: 'running',
    currentStep: 2,
    startedBy: 'John Doe',
    startedAt: '2024-01-15',
    progress: 40,
    steps: [
      {
        id: '1-1',
        name: 'Legal Review',
        description: 'Review contract terms and conditions',
        status: 'completed',
        assignedTo: 'Legal Team',
        dueDate: '2024-01-16',
        sla: '2 days',
        data: { comments: 'Approved with minor revisions' }
      },
      {
        id: '1-2',
        name: 'Finance Approval',
        description: 'Review financial terms and budget impact',
        status: 'in_progress',
        assignedTo: 'Finance Team',
        dueDate: '2024-01-18',
        sla: '3 days',
        data: { comments: 'Under review' }
      },
      {
        id: '1-3',
        name: 'Executive Sign-off',
        description: 'Final executive approval',
        status: 'pending',
        assignedTo: 'CEO',
        dueDate: '2024-01-20',
        sla: '1 day',
        data: {}
      }
    ]
  },
  {
    id: '2',
    name: 'Employee Onboarding',
    status: 'paused',
    currentStep: 1,
    startedBy: 'HR Team',
    startedAt: '2024-01-14',
    progress: 20,
    steps: [
      {
        id: '2-1',
        name: 'Background Check',
        description: 'Complete background verification',
        status: 'in_progress',
        assignedTo: 'HR Team',
        dueDate: '2024-01-17',
        sla: '3 days',
        data: { comments: 'Waiting for third-party response' }
      }
    ]
  }
]

const workflowTemplates = [
  { name: 'Contract Approval', description: 'Multi-step contract review and approval process', steps: 4, category: 'Legal' },
  { name: 'Employee Onboarding', description: 'Complete onboarding workflow for new employees', steps: 6, category: 'HR' },
  { name: 'Invoice Processing', description: 'Automated invoice validation and payment workflow', steps: 4, category: 'Finance' },
  { name: 'Purchase Request', description: 'Purchase request approval and procurement workflow', steps: 5, category: 'Procurement' },
  { name: 'Document Review', description: 'Document review and approval process', steps: 3, category: 'General' },
  { name: 'Incident Response', description: 'Security incident response and escalation workflow', steps: 7, category: 'Security' }
]

const getStatusColor = (status: string) => {
  const colors = {
    running: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getStepStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    skipped: 'bg-yellow-100 text-yellow-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getStepIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'failed':
      return XCircle
    case 'in_progress':
      return Clock
    default:
      return Clock
  }
}

// Button click handlers
const handlePauseWorkflow = () => {
  console.log('Pause Workflow clicked')
  isPauseWorkflowOpen.value = true
}

const handleResumeWorkflow = () => {
  console.log('Resume Workflow clicked')
  notify.success('Workflow Resumed', 'Workflow has been resumed successfully!')
}

const handleApproveStep = (step: any) => {
  console.log('Approve Step clicked:', step)
  selectedStep.value = step
  isApproveStepOpen.value = true
}

const handleCreateTemplate = () => {
  console.log('Opening workflow template creation workflow')
  isCreateTemplateOpen.value = true
}

const closeCreateTemplate = () => {
  isCreateTemplateOpen.value = false
}

const handleTemplateSubmit = (templateData: any) => {
  console.log('Workflow template created:', templateData)
  notify.success('Template Created', `Workflow template "${templateData.name}" has been created successfully!`)
  isCreateTemplateOpen.value = false
}

const handleStartWorkflow = (template: any) => {
  console.log('Start Workflow clicked:', template)
  selectedTemplate.value = template
  isStartWorkflowOpen.value = true
}

const closeStartWorkflow = () => {
  isStartWorkflowOpen.value = false
  selectedTemplate.value = null
}

const handleWorkflowSubmit = (workflowData: any) => {
  console.log('Workflow started:', workflowData)
  notify.success('Workflow Started', `Workflow "${workflowData.name}" has been started successfully!`)
  isStartWorkflowOpen.value = false
  selectedTemplate.value = null
}

const closePauseWorkflow = () => {
  isPauseWorkflowOpen.value = false
}

const handlePauseSubmit = (pauseData: any) => {
  console.log('Workflow paused:', pauseData)
  notify.success('Workflow Paused', `Workflow has been paused successfully!`)
  isPauseWorkflowOpen.value = false
}

const closeApproveStep = () => {
  isApproveStepOpen.value = false
  selectedStep.value = null
}

const handleApproveSubmit = (approvalData: any) => {
  console.log('Step approved:', approvalData)
  notify.success('Decision Submitted', `Decision for step "${approvalData.stepName}" has been submitted!`)
  isApproveStepOpen.value = false
  selectedStep.value = null
}

// Integration point handlers
const handleDocuSignIntegration = () => {
  console.log('DocuSign integration clicked')
  isDocuSignIntegrationOpen.value = true
}

const handleAdobeSignIntegration = () => {
  console.log('Adobe Sign integration clicked')
  notify.info('Adobe Sign Integration', 'Adobe Sign integration workflow coming soon!')
  // TODO: Create Adobe Sign integration workflow
}

const handleEmailServiceIntegration = () => {
  console.log('Email Service integration clicked')
  isEmailServiceIntegrationOpen.value = true
}

const handleSMSServiceIntegration = () => {
  console.log('SMS Service integration clicked')
  isSMSServiceIntegrationOpen.value = true
}

// Integration workflow handlers
const closeDocuSignIntegration = () => {
  isDocuSignIntegrationOpen.value = false
}

const handleDocuSignSubmit = (configData: any) => {
  console.log('DocuSign configuration saved:', configData)
  notify.success('DocuSign Configured', 'DocuSign integration has been configured successfully!')
  isDocuSignIntegrationOpen.value = false
}

const closeEmailServiceIntegration = () => {
  isEmailServiceIntegrationOpen.value = false
}

const handleEmailServiceSubmit = (configData: any) => {
  console.log('Email Service configuration saved:', configData)
  notify.success('Email Service Configured', 'Email service integration has been configured successfully!')
  isEmailServiceIntegrationOpen.value = false
}

const closeSMSServiceIntegration = () => {
  isSMSServiceIntegrationOpen.value = false
}

const handleSMSServiceSubmit = (configData: any) => {
  console.log('SMS Service configuration saved:', configData)
  notify.success('SMS Service Configured', 'SMS service integration has been configured successfully!')
  isSMSServiceIntegrationOpen.value = false
}
</script>
