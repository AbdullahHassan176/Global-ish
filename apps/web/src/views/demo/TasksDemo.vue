<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tasks Management Demo</h1>
        <p class="text-gray-600 mt-2">
          Comprehensive task management with assignments, due dates, progress tracking, comments, and attachments
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <CheckCircle class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Tasks</p>
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
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <Clock class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">In Progress</p>
              <p class="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <AlertCircle class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Overdue</p>
              <p class="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions and View Toggle -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <Tooltip text="Create a new task with assignments, due dates, and priority settings" position="bottom">
            <button @click="handleCreateTask" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <Plus class="h-4 w-4 mr-2" />
              Create Task
            </button>
          </Tooltip>
          <Tooltip text="Switch to calendar view to see tasks organized by dates" position="bottom">
            <button @click="handleCalendarView" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
              <Calendar class="h-4 w-4 mr-2" />
              Calendar View
            </button>
          </Tooltip>
          <Tooltip text="Filter to show only tasks assigned to you" position="bottom">
            <button @click="handleMyTasks" class="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center">
              <User class="h-4 w-4 mr-2" />
              My Tasks
            </button>
          </Tooltip>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="viewMode = 'kanban'"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium',
              viewMode === 'kanban'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Kanban
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium',
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            List
          </button>
        </div>
      </div>

      <!-- Kanban View -->
      <div v-if="viewMode === 'kanban'" class="kanban-board">
        <div class="flex space-x-6 overflow-x-auto pb-4">
          <div
            v-for="column in kanbanColumns"
            :key="column.id"
            class="flex-shrink-0 w-80"
          >
            <!-- Column Header -->
            <div 
              :class="getColumnHeaderClass(column.id)"
              class="rounded-lg p-4 mb-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-white">
                  {{ column.title }}
                </h3>
                <span class="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                  {{ column.tasks.length }}
                </span>
              </div>
            </div>

            <!-- Drop Zone -->
            <div
              :class="getDropZoneClass(column.id)"
              class="space-y-3 min-h-96 rounded-lg p-2 transition-all duration-200"
              @dragover.prevent="handleDragOver"
              @dragenter.prevent="handleDragEnter(column.id)"
              @dragleave.prevent="handleDragLeave(column.id)"
              @drop.prevent="handleDrop($event, column.id)"
            >
              <div
                v-for="task in column.tasks"
                :key="task.id"
                :class="[getTaskClass(task, column.id), { 'dragging': draggedTask?.id === task.id }]"
                class="rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-move p-4"
                draggable="true"
                @dragstart="handleDragStart($event, task)"
                @dragend="handleDragEnd"
                @click="selectedTask = task"
                @dragover.stop
                @dragenter.stop
                @dragleave.stop
                @drop.stop
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-900 text-sm">{{ task.title }}</h4>
                  <span :class="getPriorityColor(task.priority)">
                    {{ task.priority }}
                  </span>
                </div>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">{{ task.description }}</p>
                
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-1">
                    <User class="h-3 w-3 text-gray-400" />
                    <span class="text-xs text-gray-500">{{ task.assignedTo.length }} assigned</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <Calendar class="h-3 w-3 text-gray-400" />
                    <span class="text-xs text-gray-500">{{ task.dueDate }}</span>
                  </div>
                </div>
                
                <div class="mb-3">
                  <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{{ task.progress }}%</span>
                  </div>
                  <div class="bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${task.progress}%` }"
                    />
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div v-if="task.comments > 0" class="flex items-center space-x-1">
                      <MessageSquare class="h-3 w-3 text-gray-400" />
                      <span class="text-xs text-gray-500">{{ task.comments }}</span>
                    </div>
                    <div v-if="task.attachments > 0" class="flex items-center space-x-1">
                      <Paperclip class="h-3 w-3 text-gray-400" />
                      <span class="text-xs text-gray-500">{{ task.attachments }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <div
                      v-for="(user, index) in task.assignedTo.slice(0, 2)"
                      :key="index"
                      class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700"
                    >
                      {{ user.charAt(0) }}
                    </div>
                    <div
                      v-if="task.assignedTo.length > 2"
                      class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600"
                    >
                      +{{ task.assignedTo.length - 2 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="card">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Task List</h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="task in mockTasks"
            :key="task.id"
            @click="selectedTask = task"
            class="p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-3">
                <component :is="getStatusIcon(task.status)" />
                <h4 class="font-medium text-gray-900">{{ task.title }}</h4>
                <span :class="getPriorityColor(task.priority)">
                  {{ task.priority }}
                </span>
                <span :class="getStatusColor(task.status)">
                  {{ task.status }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                {{ task.progress }}% complete
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{ task.description }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <User class="h-4 w-4" />
                  <span>Assigned to {{ task.assignedTo.join(', ') }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Calendar class="h-4 w-4" />
                  <span>Due {{ task.dueDate }}</span>
                </div>
                <div v-if="task.comments > 0" class="flex items-center space-x-1">
                  <MessageSquare class="h-4 w-4" />
                  <span>{{ task.comments }} comments</span>
                </div>
                <div v-if="task.attachments > 0" class="flex items-center space-x-1">
                  <Paperclip class="h-4 w-4" />
                  <span>{{ task.attachments }} attachments</span>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                Created by {{ task.createdBy }} on {{ task.createdAt }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Details Modal -->
      <div v-if="selectedTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-gray-900">{{ selectedTask.title }}</h3>
              <button
                @click="selectedTask = null"
                class="text-gray-400 hover:text-gray-600"
              >
                <XCircle class="h-6 w-6" />
              </button>
            </div>
            <div class="flex items-center space-x-4 mb-4">
              <span :class="getPriorityColor(selectedTask.priority)">
                {{ selectedTask.priority }}
              </span>
              <span :class="getStatusColor(selectedTask.status)">
                {{ selectedTask.status }}
              </span>
              <span class="text-sm text-gray-500">
                {{ selectedTask.progress }}% complete
              </span>
            </div>
            <p class="text-gray-600 mb-4">{{ selectedTask.description }}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Created by:</span>
                <span class="ml-2 font-medium">{{ selectedTask.createdBy }}</span>
              </div>
              <div>
                <span class="text-gray-600">Due date:</span>
                <span class="ml-2 font-medium">{{ selectedTask.dueDate }}</span>
              </div>
              <div>
                <span class="text-gray-600">Assigned to:</span>
                <span class="ml-2 font-medium">{{ selectedTask.assignedTo.join(', ') }}</span>
              </div>
              <div>
                <span class="text-gray-600">Created:</span>
                <span class="ml-2 font-medium">{{ selectedTask.createdAt }}</span>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Progress</h4>
              <div class="bg-gray-200 rounded-full h-3">
                <div
                  class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  :style="{ width: `${selectedTask.progress}%` }"
                />
              </div>
            </div>
            
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Comments ({{ selectedTask.comments }})</h4>
              <div class="space-y-3">
                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium text-sm">John Doe</span>
                    <span class="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p class="text-sm text-gray-700">Great progress on this task! Keep it up.</p>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium text-sm">Jane Smith</span>
                    <span class="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <p class="text-sm text-gray-700">I've reviewed the code and it looks good. Ready for testing.</p>
                </div>
              </div>
            </div>
            
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Attachments ({{ selectedTask.attachments }})</h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <Paperclip class="h-4 w-4 text-gray-400" />
                    <span class="text-sm">design-mockup.fig</span>
                  </div>
                  <button class="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <Paperclip class="h-4 w-4 text-gray-400" />
                    <span class="text-sm">requirements.pdf</span>
                  </div>
                  <button class="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button @click="handleMarkComplete" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
                <CheckCircle class="h-4 w-4 mr-2" />
                Mark Complete
              </button>
              <button @click="handleAddComment" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
                <MessageSquare class="h-4 w-4 mr-2" />
                Add Comment
              </button>
              <button @click="handleAddAttachment" class="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center">
                <Paperclip class="h-4 w-4 mr-2" />
                Add Attachment
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
              <CheckCircle class="h-4 w-4 text-green-600" />
              <span>Full CRUD operations for task management</span>
            </li>
            <li class="flex items-center space-x-2">
              <User class="h-4 w-4 text-blue-600" />
              <span>Multi-user task assignments and notifications</span>
            </li>
            <li class="flex items-center space-x-2">
              <Calendar class="h-4 w-4 text-orange-600" />
              <span>Due date tracking with overdue alerts</span>
            </li>
            <li class="flex items-center space-x-2">
              <CheckCircle class="h-4 w-4 text-purple-600" />
              <span>Percentage complete tracking and progress bars</span>
            </li>
            <li class="flex items-center space-x-2">
              <MessageSquare class="h-4 w-4 text-red-600" />
              <span>Comments and attachments for collaboration</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Task Views</h3>
          <div class="space-y-4">
            <div 
              @click="handleKanbanView"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle class="h-4 w-4 text-blue-600" />
                </div>
                <div>
              <span class="font-medium">Kanban Board</span>
                  <span class="text-sm text-gray-600 block">Drag & drop</span>
            </div>
              </div>
              <button class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                Open
              </button>
            </div>
            <div 
              @click="handleListView"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle class="h-4 w-4 text-green-600" />
                </div>
                <div>
              <span class="font-medium">List View</span>
                  <span class="text-sm text-gray-600 block">Detailed table</span>
            </div>
              </div>
              <button class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                Open
              </button>
            </div>
            <div 
              @click="handleCalendarView"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar class="h-4 w-4 text-orange-600" />
                </div>
                <div>
              <span class="font-medium">Calendar View</span>
                  <span class="text-sm text-gray-600 block">Timeline</span>
            </div>
              </div>
              <button class="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm">
                Open
              </button>
            </div>
            <div 
              @click="handleMyTasks"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User class="h-4 w-4 text-purple-600" />
                </div>
                <div>
              <span class="font-medium">My Tasks</span>
                  <span class="text-sm text-gray-600 block">Personal view</span>
                </div>
              </div>
              <button class="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Task Workflow Modal -->
  <CreateTaskWorkflow
    :is-open="isCreateTaskOpen"
    @close="closeCreateTask"
    @submit="handleTaskSubmit"
  />

  <!-- Calendar View Workflow Modal -->
  <CalendarViewWorkflow
    :is-open="isCalendarViewOpen"
    :tasks="mockTasks"
    @close="closeCalendarView"
    @submit="handleCalendarSubmit"
  />

  <!-- My Tasks Workflow Modal -->
  <MyTasksWorkflow
    :is-open="isMyTasksOpen"
    :tasks="mockTasks"
    :current-user="'Current User'"
    @close="closeMyTasks"
    @submit="handleMyTasksSubmit"
  />

  <!-- Kanban Board Workflow Modal -->
  <KanbanBoardWorkflow
    :is-open="isKanbanBoardOpen"
    :tasks="mockTasks"
    @close="closeKanbanBoard"
    @submit="handleKanbanBoardSubmit"
  />

  <!-- List View Workflow Modal -->
  <ListViewWorkflow
    :is-open="isListViewOpen"
    :tasks="mockTasks"
    @close="closeListView"
    @submit="handleListViewSubmit"
  />
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Calendar, User, MessageSquare, Paperclip, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-vue-next'
import SidebarLayout from '@/components/SidebarLayout.vue'
import Tooltip from '@/components/Tooltip.vue'
import CreateTaskWorkflow from '@/components/CreateTaskWorkflow.vue'
import CalendarViewWorkflow from '@/components/CalendarViewWorkflow.vue'
import MyTasksWorkflow from '@/components/MyTasksWorkflow.vue'
import KanbanBoardWorkflow from '@/components/KanbanBoardWorkflow.vue'
import ListViewWorkflow from '@/components/ListViewWorkflow.vue'
import { notify } from '@/composables/useNotifications'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'in_review' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  dueDate: string
  createdBy: string
  assignedTo: string[]
  comments: number
  attachments: number
  createdAt: string
  updatedAt: string
}

const viewMode = ref<'kanban' | 'list'>('kanban')
const selectedTask = ref<Task | null>(null)
const isCreateTaskOpen = ref(false)
const isCalendarViewOpen = ref(false)
const isMyTasksOpen = ref(false)
const isKanbanBoardOpen = ref(false)
const isListViewOpen = ref(false)

// Drag and drop state
const draggedTask = ref<any>(null)
const draggedOverColumn = ref<string | null>(null)
const isDragging = ref(false)

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Set up NextAuth with OIDC providers and MFA support',
    status: 'in_progress',
    priority: 'high',
    progress: 75,
    dueDate: '2024-01-20',
    createdBy: 'John Doe',
    assignedTo: ['Jane Smith', 'Mike Johnson'],
    comments: 3,
    attachments: 2,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16'
  },
  {
    id: '2',
    title: 'Design database schema',
    description: 'Create Prisma schema for all modules with proper relationships',
    status: 'completed',
    priority: 'high',
    progress: 100,
    dueDate: '2024-01-18',
    createdBy: 'Jane Smith',
    assignedTo: ['John Doe'],
    comments: 5,
    attachments: 1,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-17'
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'in_review',
    priority: 'medium',
    progress: 90,
    dueDate: '2024-01-22',
    createdBy: 'Mike Johnson',
    assignedTo: ['Sarah Wilson'],
    comments: 2,
    attachments: 0,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-17'
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation with examples',
    status: 'todo',
    priority: 'medium',
    progress: 0,
    dueDate: '2024-01-25',
    createdBy: 'Sarah Wilson',
    assignedTo: ['John Doe'],
    comments: 0,
    attachments: 0,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  }
]

const kanbanColumns = computed(() => {
  console.log('kanbanColumns computed - mockTasks:', mockTasks)
  return [
    {
      id: 'todo',
      title: 'To Do',
      tasks: mockTasks.filter(task => task.status === 'todo')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      tasks: mockTasks.filter(task => task.status === 'in_progress')
    },
    {
      id: 'in_review',
      title: 'In Review',
      tasks: mockTasks.filter(task => task.status === 'in_review')
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: mockTasks.filter(task => task.status === 'completed')
    }
  ]
})

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getStatusColor = (status: string) => {
  const colors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    in_review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'in_progress':
      return Clock
    case 'in_review':
      return AlertCircle
    case 'cancelled':
      return XCircle
    default:
      return Clock
  }
}

// Button click handlers
const handleCreateTask = () => {
  console.log('Opening task creation workflow')
  isCreateTaskOpen.value = true
}

const closeCreateTask = () => {
  isCreateTaskOpen.value = false
}

const handleTaskSubmit = (taskData: any) => {
  console.log('Task created:', taskData)
  // Add the new task to the mock data
  const newTask: Task = {
    id: String(Date.now()),
    title: taskData.title,
    description: taskData.description,
    status: 'todo',
    priority: taskData.priority,
    progress: 0,
    dueDate: taskData.dueDate,
    createdBy: 'Current User',
    assignedTo: [taskData.assignedTo],
    comments: 0,
    attachments: taskData.attachments?.length || 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }
  
  // Add to mock tasks (in a real app, this would be an API call)
  mockTasks.unshift(newTask)
  
  notify.success('Task Created', `Task "${newTask.title}" has been created successfully!`)
  isCreateTaskOpen.value = false
}

const handleCalendarView = () => {
  console.log('Calendar View clicked')
  isCalendarViewOpen.value = true
}

const handleMyTasks = () => {
  console.log('My Tasks clicked')
  isMyTasksOpen.value = true
}

// Task Views handlers
const handleKanbanView = () => {
  console.log('Kanban View clicked')
  viewMode.value = 'kanban'
  notify.success('View Changed', 'Switched to Kanban Board view with drag & drop functionality')
}

const handleListView = () => {
  console.log('List View clicked')
  isListViewOpen.value = true
}

const handleMarkComplete = () => {
  console.log('Mark Complete clicked')
  if (selectedTask.value) {
    selectedTask.value.status = 'completed'
    selectedTask.value.progress = 100
    notify.success('Task Completed', `Task "${selectedTask.value.title}" has been marked as complete!`)
  }
}

const handleAddComment = () => {
  console.log('Add Comment clicked')
  notify.info('Add Comment', 'Opening comment dialog to add a new comment')
}

const handleAddAttachment = () => {
  console.log('Add Attachment clicked')
  notify.info('Add Attachment', 'Opening file picker to attach files to this task')
}

// Calendar View handlers
const closeCalendarView = () => {
  isCalendarViewOpen.value = false
}

const handleCalendarSubmit = (data: any) => {
  console.log('Calendar action:', data)
  switch (data.action) {
    case 'createTask':
      notify.info('Create Task', `Creating new task for ${data.date}`)
      break
    case 'editTask':
      notify.info('Edit Task', `Opening edit dialog for "${data.task.title}"`)
      break
    case 'markComplete':
      notify.success('Task Completed', `Task "${data.task.title}" has been marked as complete!`)
      break
    case 'createQuickTask':
      notify.info('Create Task', 'Opening quick task creation dialog')
      break
    case 'viewUpcomingTasks':
      notify.info('Upcoming Tasks', 'Showing tasks due in the next 7 days')
      break
    case 'exportCalendar':
      notify.info('Export Calendar', 'Preparing calendar data for export')
      break
    case 'switchToCalendarView':
      notify.success('Calendar View', 'Switching to calendar view mode')
      break
  }
}

// My Tasks handlers
const closeMyTasks = () => {
  isMyTasksOpen.value = false
}

const handleMyTasksSubmit = (data: any) => {
  console.log('My Tasks action:', data)
  switch (data.action) {
    case 'createNewTask':
      notify.info('Create Task', 'Opening task creation dialog')
      break
    case 'exportMyTasks':
      notify.info('Export Tasks', 'Preparing your task list for export')
      break
    case 'applyFilters':
      notify.success('Filters Applied', 'Task filters have been applied successfully!')
      break
  }
}

// Kanban Board handlers
const closeKanbanBoard = () => {
  isKanbanBoardOpen.value = false
}

const handleKanbanBoardSubmit = (data: any) => {
  console.log('Kanban Board action:', data)
  switch (data.action) {
    case 'createNewTask':
      notify.info('Create Task', 'Opening task creation dialog')
      break
    case 'exportBoard':
      notify.info('Export Board', 'Preparing board data for export')
      break
    case 'resetBoard':
      notify.info('Reset Board', 'Resetting board to default settings')
      break
    case 'saveConfiguration':
      notify.success('Configuration Saved', 'Board configuration has been saved successfully!')
      break
  }
}

// List View handlers
const closeListView = () => {
  isListViewOpen.value = false
}

const handleListViewSubmit = (data: any) => {
  console.log('List View action:', data)
  switch (data.action) {
    case 'exportList':
      notify.info('Export List', 'Preparing task list for export')
      break
    case 'printList':
      notify.info('Print List', 'Opening print dialog')
      break
    case 'saveConfiguration':
      notify.success('Configuration Saved', 'List view configuration has been saved successfully!')
      break
  }
}

// Drag and drop handlers
const handleDragStart = (event: DragEvent, task: any) => {
  console.log('Drag start', { task })
  draggedTask.value = task
  isDragging.value = true
  
  // Add visual feedback
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '0.5'
  }
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task.id)
  }
}

const handleDragEnd = () => {
  console.log('Drag end')
  draggedTask.value = null
  isDragging.value = false
  draggedOverColumn.value = null
  
  // Reset visual feedback
  document.querySelectorAll('.dragging').forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.opacity = '1'
    }
  })
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragEnter = (columnId: string) => {
  console.log('Drag enter', { columnId })
  draggedOverColumn.value = columnId
}

const handleDragLeave = (columnId: string) => {
  console.log('Drag leave', { columnId })
  if (draggedOverColumn.value === columnId) {
    draggedOverColumn.value = null
  }
}

const handleDrop = (event: DragEvent, columnId: string) => {
  event.preventDefault()
  
  console.log('Drop event triggered', { columnId, draggedTask: draggedTask.value })
  
  if (!draggedTask.value) {
    console.log('No dragged task found')
    return
  }
  
  const taskId = event.dataTransfer?.getData('text/plain')
  if (!taskId) {
    console.log('No task ID in dataTransfer')
    return
  }
  
  // Find the task in mockTasks
  const taskIndex = mockTasks.findIndex(task => task.id === taskId)
  if (taskIndex === -1) {
    console.log('Task not found in mockTasks', { taskId, mockTasks })
    return
  }
  
  const task = mockTasks[taskIndex]
  const newStatus = getStatusFromColumnId(columnId)
  
  console.log('Updating task', { taskId, oldStatus: task.status, newStatus, columnId })
  
  // Update task status
  task.status = newStatus as 'todo' | 'in_progress' | 'in_review' | 'completed' | 'cancelled'
  
  // If moved to completed, set progress to 100%
  if (newStatus === 'completed') {
    task.progress = 100
    notify.success('Task Completed', `Task "${task.title}" has been marked as complete!`)
  } else {
    // Reset progress if moved away from completed
    if (task.progress === 100 && newStatus !== 'completed') {
      task.progress = Math.min(90, task.progress) // Reset to 90% max
    }
  }
  
  // Force reactivity update
  mockTasks[taskIndex] = { ...task }
  
  console.log('Task updated', { task: mockTasks[taskIndex] })
  
  notify.success('Task Moved', `Task "${task.title}" moved to ${getColumnTitle(columnId)}`)
  
  draggedTask.value = null
  isDragging.value = false
  draggedOverColumn.value = null
}

// Helper functions for drag and drop
const getStatusFromColumnId = (columnId: string): string => {
  const statusMap: { [key: string]: string } = {
    'todo': 'todo',
    'in_progress': 'in_progress',
    'in_review': 'in_review',
    'completed': 'completed'
  }
  return statusMap[columnId] || 'todo'
}

const getColumnTitle = (columnId: string): string => {
  const titleMap: { [key: string]: string } = {
    'todo': 'To Do',
    'in_progress': 'In Progress',
    'in_review': 'In Review',
    'completed': 'Completed'
  }
  return titleMap[columnId] || 'Unknown'
}

// Color-coded classes for columns and tasks
const getColumnHeaderClass = (columnId: string): string => {
  const classes: { [key: string]: string } = {
    'todo': 'bg-gray-500',
    'in_progress': 'bg-blue-500',
    'in_review': 'bg-yellow-500',
    'completed': 'bg-green-500'
  }
  return classes[columnId] || 'bg-gray-500'
}

const getDropZoneClass = (columnId: string): string => {
  const baseClasses = 'border-2 border-dashed transition-all duration-200'
  const classes: { [key: string]: string } = {
    'todo': 'border-gray-300 bg-gray-50',
    'in_progress': 'border-blue-300 bg-blue-50',
    'in_review': 'border-yellow-300 bg-yellow-50',
    'completed': 'border-green-300 bg-green-50'
  }
  
  const baseClass = classes[columnId] || 'border-gray-300 bg-gray-50'
  
  // Add highlight when dragging over
  if (draggedOverColumn.value === columnId && isDragging.value) {
    return `${baseClasses} ${baseClass} ring-2 ring-opacity-50 ring-blue-400`
  }
  
  return `${baseClasses} ${baseClass}`
}

const getTaskClass = (task: any, columnId: string): string => {
  const baseClasses = 'transition-all duration-200'
  const columnClasses: { [key: string]: string } = {
    'todo': 'bg-white border-gray-200',
    'in_progress': 'bg-blue-50 border-blue-200',
    'in_review': 'bg-yellow-50 border-yellow-200',
    'completed': 'bg-green-50 border-green-200'
  }
  
  const columnClass = columnClasses[columnId] || 'bg-white border-gray-200'
  
  // Add dragging effect
  if (draggedTask.value?.id === task.id && isDragging.value) {
    return `${baseClasses} ${columnClass} opacity-50 scale-95 shadow-lg`
  }
  
  return `${baseClasses} ${columnClass}`
}
</script>

<style scoped>
.kanban-board {
  @apply w-full;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Drag and drop styles */
.dragging {
  transform: rotate(5deg);
  opacity: 0.8;
}

.drop-zone-active {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgb(59, 130, 246);
  border-style: solid;
}

/* Smooth transitions for drag and drop */
.kanban-task {
  transition: all 0.2s ease-in-out;
}

.kanban-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Column-specific hover effects */
.kanban-column-todo:hover {
  background-color: rgba(107, 114, 128, 0.05);
}

.kanban-column-in-progress:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.kanban-column-in-review:hover {
  background-color: rgba(245, 158, 11, 0.05);
}

.kanban-column-completed:hover {
  background-color: rgba(34, 197, 94, 0.05);
}

/* Task color transitions */
.task-todo {
  background-color: rgb(255, 255, 255);
  border-color: rgb(229, 231, 235);
}

.task-in-progress {
  background-color: rgb(239, 246, 255);
  border-color: rgb(191, 219, 254);
}

.task-in-review {
  background-color: rgb(254, 249, 195);
  border-color: rgb(254, 240, 138);
}

.task-completed {
  background-color: rgb(240, 253, 244);
  border-color: rgb(187, 247, 208);
}

/* Drag preview styles */
.drag-preview {
  opacity: 0.5;
  transform: scale(0.95);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
