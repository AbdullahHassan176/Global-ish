<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="close"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                My Tasks
              </h3>
              <p class="text-sm text-gray-600">View and manage tasks assigned to you</p>
            </div>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-6">
          <!-- Filter Controls -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Filter & Sort</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="filters.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  v-model="filters.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <select
                  v-model="filters.dueDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Dates</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this_week">This Week</option>
                  <option value="next_week">Next Week</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  v-model="sortBy"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="createdAt">Created Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Task Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle class="h-5 w-5 text-blue-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-blue-600">Total Tasks</p>
                  <p class="text-2xl font-bold text-blue-900">{{ filteredTasks.length }}</p>
                </div>
              </div>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                  <CheckCircle class="h-5 w-5 text-green-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-600">Completed</p>
                  <p class="text-2xl font-bold text-green-900">{{ completedTasks.length }}</p>
                </div>
              </div>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <Clock class="h-5 w-5 text-yellow-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-yellow-600">In Progress</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ inProgressTasks.length }}</p>
                </div>
              </div>
            </div>
            <div class="bg-red-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-red-100 rounded-lg">
                  <AlertCircle class="h-5 w-5 text-red-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-600">Overdue</p>
                  <p class="text-2xl font-bold text-red-900">{{ overdueTasks.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Task List -->
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="p-4 border-b border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900">My Tasks</h4>
              <p class="text-sm text-gray-600">{{ filteredTasks.length }} tasks found</p>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div
                v-for="task in filteredTasks"
                :key="task.id"
                @click="selectTask(task)"
                class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <component :is="getStatusIcon(task.status)" />
                    <h5 class="font-medium text-gray-900">{{ task.title }}</h5>
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
                    Created {{ task.createdAt }}
                  </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="mt-2">
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
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Quick Actions</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                @click="createNewTask"
                class="p-4 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Plus class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Create New Task</h5>
                    <p class="text-sm text-gray-600">Add a new task to your list</p>
                  </div>
                </div>
              </button>
              <button
                @click="viewOverdueTasks"
                class="p-4 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <AlertCircle class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Overdue Tasks</h5>
                    <p class="text-sm text-gray-600">View tasks past due date</p>
                  </div>
                </div>
              </button>
              <button
                @click="exportMyTasks"
                class="p-4 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Download class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Export Tasks</h5>
                    <p class="text-sm text-gray-600">Download your task list</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex items-center justify-end space-x-3">
          <button
            @click="close"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, User, CheckCircle, Clock, AlertCircle, Calendar, MessageSquare, Paperclip, Plus, Download } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  tasks?: any[]
  currentUser?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const filters = ref({
  status: '',
  priority: '',
  dueDate: ''
})

const sortBy = ref('dueDate')
const selectedTask = ref<any>(null)

const myTasks = computed(() => {
  if (!props.tasks) return []
  return props.tasks.filter(task => 
    task.assignedTo.includes(props.currentUser || 'Current User')
  )
})

const filteredTasks = computed(() => {
  let tasks = [...myTasks.value]
  
  if (filters.value.status) {
    tasks = tasks.filter(task => task.status === filters.value.status)
  }
  
  if (filters.value.priority) {
    tasks = tasks.filter(task => task.priority === filters.value.priority)
  }
  
  if (filters.value.dueDate) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    tasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      switch (filters.value.dueDate) {
        case 'today':
          return taskDate.toDateString() === today.toDateString()
        case 'tomorrow':
          return taskDate.toDateString() === tomorrow.toDateString()
        case 'this_week':
          const weekEnd = new Date(today)
          weekEnd.setDate(weekEnd.getDate() + 7)
          return taskDate >= today && taskDate <= weekEnd
        case 'next_week':
          const nextWeekStart = new Date(today)
          nextWeekStart.setDate(nextWeekStart.getDate() + 7)
          const nextWeekEnd = new Date(nextWeekStart)
          nextWeekEnd.setDate(nextWeekEnd.getDate() + 7)
          return taskDate >= nextWeekStart && taskDate <= nextWeekEnd
        case 'overdue':
          return taskDate < today && task.status !== 'completed'
        default:
          return true
      }
    })
  }
  
  // Sort tasks
  tasks.sort((a, b) => {
    switch (sortBy.value) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  
  return tasks
})

const completedTasks = computed(() => 
  filteredTasks.value.filter(task => task.status === 'completed')
)

const inProgressTasks = computed(() => 
  filteredTasks.value.filter(task => task.status === 'in_progress')
)

const overdueTasks = computed(() => {
  const today = new Date()
  return filteredTasks.value.filter(task => 
    new Date(task.dueDate) < today && task.status !== 'completed'
  )
})

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'in_progress':
      return Clock
    case 'in_review':
      return AlertCircle
    default:
      return Clock
  }
}

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || colors.medium}`
}

const getStatusColor = (status: string) => {
  const colors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    in_review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.todo}`
}

const selectTask = (task: any) => {
  selectedTask.value = task
  notify.info('Task Selected', `Selected task: ${task.title}`)
}

const createNewTask = () => {
  notify.info('Create Task', 'Opening task creation dialog')
  emit('submit', { action: 'createNewTask' })
}

const viewOverdueTasks = () => {
  filters.value.dueDate = 'overdue'
  notify.info('Overdue Tasks', 'Filtering to show overdue tasks')
}

const exportMyTasks = () => {
  notify.info('Export Tasks', 'Preparing your task list for export')
  emit('submit', { action: 'exportMyTasks', tasks: filteredTasks.value })
}

const applyFilters = () => {
  notify.success('Filters Applied', 'Task filters have been applied successfully!')
  emit('submit', { action: 'applyFilters', filters: filters.value })
}

const close = () => {
  selectedTask.value = null
  emit('close')
}
</script>
