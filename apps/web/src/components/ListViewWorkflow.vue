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
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                List View Configuration
              </h3>
              <p class="text-sm text-gray-600">Configure and customize your list view settings</p>
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
          <!-- Display Settings -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Display Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Items Per Page
                </label>
                <select
                  v-model="listConfig.itemsPerPage"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="10">10 items</option>
                  <option value="25">25 items</option>
                  <option value="50">50 items</option>
                  <option value="100">100 items</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Sort
                </label>
                <select
                  v-model="listConfig.defaultSort"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="createdAt">Created Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sort Direction
                </label>
                <select
                  v-model="listConfig.sortDirection"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Show Progress Bars
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="listConfig.showProgress"
                    type="checkbox"
                    class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="text-sm text-gray-700">Display progress bars</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Column Configuration -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Column Configuration</h4>
            <div class="space-y-3">
              <div
                v-for="column in availableColumns"
                :key="column.id"
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="column.visible"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h5 class="font-medium text-gray-900">{{ column.name }}</h5>
                    <p class="text-sm text-gray-600">{{ column.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="moveColumnUp(column.id)"
                    class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                  >
                    ↑
                  </button>
                  <button
                    @click="moveColumnDown(column.id)"
                    class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Settings -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Filter Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Status Filter
                </label>
                <select
                  v-model="listConfig.defaultStatusFilter"
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
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Priority Filter
                </label>
                <select
                  v-model="listConfig.defaultPriorityFilter"
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
                  Show Overdue Tasks
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="listConfig.showOverdue"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">Highlight overdue tasks</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Group by Status
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="listConfig.groupByStatus"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700">Group tasks by status</span>
                </div>
              </div>
            </div>
          </div>

          <!-- List Preview -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">List Preview</h4>
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div class="p-4 border-b border-gray-200">
                <h5 class="font-medium text-gray-900">Task List</h5>
                <p class="text-sm text-gray-600">{{ filteredTasks.length }} tasks found</p>
              </div>
              <div class="divide-y divide-gray-200">
                <div
                  v-for="task in filteredTasks.slice(0, 3)"
                  :key="task.id"
                  class="p-4 hover:bg-gray-50"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3">
                      <component :is="getStatusIcon(task.status)" />
                      <h6 class="font-medium text-gray-900">{{ task.title }}</h6>
                      <span :class="getPriorityColor(task.priority)">
                        {{ task.priority }}
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
                        <span>{{ task.assignedTo.join(', ') }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <Calendar class="h-4 w-4" />
                        <span>{{ task.dueDate }}</span>
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ task.createdAt }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-orange-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-orange-900 mb-4">Quick Actions</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                @click="exportList"
                class="p-4 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Download class="h-5 w-5 text-orange-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Export List</h5>
                    <p class="text-sm text-gray-600">Download task list as CSV</p>
                  </div>
                </div>
              </button>
              <button
                @click="printList"
                class="p-4 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Printer class="h-5 w-5 text-orange-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Print List</h5>
                    <p class="text-sm text-gray-600">Print task list</p>
                  </div>
                </div>
              </button>
              <button
                @click="resetFilters"
                class="p-4 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <RefreshCw class="h-5 w-5 text-orange-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Reset Filters</h5>
                    <p class="text-sm text-gray-600">Clear all filters</p>
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
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
import { X, CheckCircle, Download, Printer, RefreshCw, User, Calendar } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  tasks?: any[]
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const listConfig = ref({
  itemsPerPage: 25,
  defaultSort: 'dueDate',
  sortDirection: 'asc',
  showProgress: true,
  defaultStatusFilter: '',
  defaultPriorityFilter: '',
  showOverdue: true,
  groupByStatus: false
})

const availableColumns = ref([
  { id: 'title', name: 'Title', description: 'Task title', visible: true },
  { id: 'status', name: 'Status', description: 'Task status', visible: true },
  { id: 'priority', name: 'Priority', description: 'Task priority', visible: true },
  { id: 'assignee', name: 'Assignee', description: 'Assigned to', visible: true },
  { id: 'dueDate', name: 'Due Date', description: 'Due date', visible: true },
  { id: 'progress', name: 'Progress', description: 'Completion percentage', visible: true },
  { id: 'createdAt', name: 'Created', description: 'Creation date', visible: false },
  { id: 'comments', name: 'Comments', description: 'Comment count', visible: false },
  { id: 'attachments', name: 'Attachments', description: 'Attachment count', visible: false }
])

const filteredTasks = computed(() => {
  if (!props.tasks) return []
  
  let tasks = [...props.tasks]
  
  if (listConfig.value.defaultStatusFilter) {
    tasks = tasks.filter(task => task.status === listConfig.value.defaultStatusFilter)
  }
  
  if (listConfig.value.defaultPriorityFilter) {
    tasks = tasks.filter(task => task.priority === listConfig.value.defaultPriorityFilter)
  }
  
  return tasks
})

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'in_progress':
      return CheckCircle
    case 'in_review':
      return CheckCircle
    default:
      return CheckCircle
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

const moveColumnUp = (columnId: string) => {
  const index = availableColumns.value.findIndex(col => col.id === columnId)
  if (index > 0) {
    const column = availableColumns.value[index]
    availableColumns.value.splice(index, 1)
    availableColumns.value.splice(index - 1, 0, column)
    notify.success('Column Moved', 'Column moved up successfully')
  }
}

const moveColumnDown = (columnId: string) => {
  const index = availableColumns.value.findIndex(col => col.id === columnId)
  if (index < availableColumns.value.length - 1) {
    const column = availableColumns.value[index]
    availableColumns.value.splice(index, 1)
    availableColumns.value.splice(index + 1, 0, column)
    notify.success('Column Moved', 'Column moved down successfully')
  }
}

const exportList = () => {
  notify.info('Export List', 'Preparing task list for export')
  emit('submit', { action: 'exportList' })
}

const printList = () => {
  notify.info('Print List', 'Opening print dialog')
  emit('submit', { action: 'printList' })
}

const resetFilters = () => {
  listConfig.value.defaultStatusFilter = ''
  listConfig.value.defaultPriorityFilter = ''
  notify.success('Filters Reset', 'All filters have been cleared')
}

const saveConfiguration = () => {
  console.log('Saving list configuration:', listConfig.value)
  notify.success('Configuration Saved', 'List view configuration has been saved successfully!')
  emit('submit', { action: 'saveConfiguration', config: listConfig.value })
  close()
}

const close = () => {
  emit('close')
}
</script>
