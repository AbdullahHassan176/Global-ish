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
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Kanban Board Management
              </h3>
              <p class="text-sm text-gray-600">Configure and manage your kanban board settings</p>
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
          <!-- Board Configuration -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Board Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Board Name
                </label>
                <input
                  v-model="boardConfig.name"
                  type="text"
                  placeholder="Enter board name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Board Description
                </label>
                <input
                  v-model="boardConfig.description"
                  type="text"
                  placeholder="Enter board description"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Column
                </label>
                <select
                  v-model="boardConfig.defaultColumn"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Auto-save Changes
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="boardConfig.autoSave"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Automatically save changes</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Column Settings -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Column Settings</h4>
            <div class="space-y-4">
              <div
                v-for="(column, index) in columns"
                :key="column.id"
                class="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
              >
                <div class="flex items-center space-x-4">
                  <div 
                    :class="getColumnColorClass(column.id)"
                    class="w-4 h-4 rounded-full"
                  ></div>
                  <div>
                    <h5 class="font-medium text-gray-900">{{ column.name }}</h5>
                    <p class="text-sm text-gray-600">{{ column.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editColumn(column)"
                    class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    v-if="index > 0"
                    @click="moveColumnUp(index)"
                    class="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    ↑
                  </button>
                  <button
                    v-if="index < columns.length - 1"
                    @click="moveColumnDown(index)"
                    class="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Filters -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Task Filters</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Priority
                </label>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Assignee
                </label>
                <select
                  v-model="filters.assignee"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Assignees</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                  <option value="mike-wilson">Mike Wilson</option>
                  <option value="sarah-jones">Sarah Jones</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Due Date
                </label>
                <select
                  v-model="filters.dueDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Dates</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this_week">This Week</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Board Statistics -->
          <div class="bg-orange-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-orange-900 mb-4">Board Statistics</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-gray-100 rounded-lg">
                    <CheckCircle class="h-5 w-5 text-gray-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p class="text-2xl font-bold text-gray-900">{{ totalTasks }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle class="h-5 w-5 text-blue-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-blue-600">In Progress</p>
                    <p class="text-2xl font-bold text-blue-900">{{ inProgressTasks }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-yellow-100 rounded-lg">
                    <CheckCircle class="h-5 w-5 text-yellow-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-yellow-600">In Review</p>
                    <p class="text-2xl font-bold text-yellow-900">{{ inReviewTasks }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <CheckCircle class="h-5 w-5 text-green-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-600">Completed</p>
                    <p class="text-2xl font-bold text-green-900">{{ completedTasks }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                @click="createNewTask"
                class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Plus class="h-5 w-5 text-blue-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Create New Task</h5>
                    <p class="text-sm text-gray-600">Add a new task to the board</p>
                  </div>
                </div>
              </button>
              <button
                @click="exportBoard"
                class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Download class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Export Board</h5>
                    <p class="text-sm text-gray-600">Download board data</p>
                  </div>
                </div>
              </button>
              <button
                @click="resetBoard"
                class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <RefreshCw class="h-5 w-5 text-orange-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Reset Board</h5>
                    <p class="text-sm text-gray-600">Reset to default settings</p>
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
            @click="saveConfiguration"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, CheckCircle, Plus, Download, RefreshCw } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  tasks?: any[]
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const boardConfig = ref({
  name: 'Main Board',
  description: 'Primary task management board',
  defaultColumn: 'todo',
  autoSave: true
})

const filters = ref({
  priority: '',
  assignee: '',
  dueDate: ''
})

const columns = ref([
  { id: 'todo', name: 'To Do', description: 'Tasks to be started' },
  { id: 'in_progress', name: 'In Progress', description: 'Tasks currently being worked on' },
  { id: 'in_review', name: 'In Review', description: 'Tasks awaiting review' },
  { id: 'completed', name: 'Completed', description: 'Finished tasks' }
])

const totalTasks = computed(() => props.tasks?.length || 0)
const inProgressTasks = computed(() => props.tasks?.filter(task => task.status === 'in_progress').length || 0)
const inReviewTasks = computed(() => props.tasks?.filter(task => task.status === 'in_review').length || 0)
const completedTasks = computed(() => props.tasks?.filter(task => task.status === 'completed').length || 0)

const getColumnColorClass = (columnId: string): string => {
  const classes: { [key: string]: string } = {
    'todo': 'bg-gray-500',
    'in_progress': 'bg-blue-500',
    'in_review': 'bg-yellow-500',
    'completed': 'bg-green-500'
  }
  return classes[columnId] || 'bg-gray-500'
}

const editColumn = (column: any) => {
  notify.info('Edit Column', `Opening edit dialog for "${column.name}" column`)
}

const moveColumnUp = (index: number) => {
  const column = columns.value[index]
  columns.value.splice(index, 1)
  columns.value.splice(index - 1, 0, column)
  notify.success('Column Moved', 'Column moved up successfully')
}

const moveColumnDown = (index: number) => {
  const column = columns.value[index]
  columns.value.splice(index, 1)
  columns.value.splice(index + 1, 0, column)
  notify.success('Column Moved', 'Column moved down successfully')
}

const createNewTask = () => {
  notify.info('Create Task', 'Opening task creation dialog')
  emit('submit', { action: 'createNewTask' })
}

const exportBoard = () => {
  notify.info('Export Board', 'Preparing board data for export')
  emit('submit', { action: 'exportBoard' })
}

const resetBoard = () => {
  notify.info('Reset Board', 'Resetting board to default settings')
  emit('submit', { action: 'resetBoard' })
}

const saveConfiguration = () => {
  console.log('Saving board configuration:', boardConfig.value)
  notify.success('Configuration Saved', 'Board configuration has been saved successfully!')
  emit('submit', { action: 'saveConfiguration', config: boardConfig.value })
  close()
}

const close = () => {
  emit('close')
}
</script>
