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
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Calendar View
              </h3>
              <p class="text-sm text-gray-600">View and manage tasks organized by dates</p>
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
          <!-- Calendar Controls -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Calendar Controls</h4>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button
                  @click="previousMonth"
                  class="p-2 rounded-md bg-white border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <ChevronLeft class="h-4 w-4 text-blue-600" />
                </button>
                <h5 class="text-lg font-semibold text-blue-900">{{ currentMonthYear }}</h5>
                <button
                  @click="nextMonth"
                  class="p-2 rounded-md bg-white border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <ChevronRight class="h-4 w-4 text-blue-600" />
                </button>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="viewMode = 'month'"
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'
                  ]"
                >
                  Month
                </button>
                <button
                  @click="viewMode = 'week'"
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'
                  ]"
                >
                  Week
                </button>
                <button
                  @click="viewMode = 'day'"
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'
                  ]"
                >
                  Day
                </button>
              </div>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <!-- Calendar Header -->
            <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              <div
                v-for="day in weekDays"
                :key="day"
                class="p-3 text-center text-sm font-medium text-gray-700"
              >
                {{ day }}
              </div>
            </div>

            <!-- Calendar Body -->
            <div class="grid grid-cols-7">
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                :class="[
                  'min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  day.isToday ? 'bg-blue-50 border-blue-200' : ''
                ]"
              >
                <div class="flex items-center justify-between mb-1">
                  <span
                    :class="[
                      'text-sm font-medium',
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                      day.isToday ? 'text-blue-600' : ''
                    ]"
                  >
                    {{ day.date }}
                  </span>
                  <button
                    v-if="day.isCurrentMonth"
                    @click="addTaskToDate(day.fullDate)"
                    class="w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                  >
                    <Plus class="h-3 w-3 text-blue-600" />
                  </button>
                </div>

                <!-- Tasks for this day -->
                <div class="space-y-1">
                  <div
                    v-for="task in getTasksForDate(day.fullDate)"
                    :key="task.id"
                    @click="selectTask(task)"
                    :class="[
                      'text-xs p-1 rounded cursor-pointer transition-colors',
                      getTaskPriorityClass(task.priority)
                    ]"
                  >
                    <div class="truncate">{{ task.title }}</div>
                    <div class="text-xs opacity-75">{{ task.dueTime || 'All day' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Details Panel -->
          <div v-if="selectedTask" class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Task Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 class="font-medium text-gray-900">{{ selectedTask.title }}</h5>
                <p class="text-sm text-gray-600 mt-1">{{ selectedTask.description }}</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Priority:</span>
                  <span :class="getPriorityColor(selectedTask.priority)">
                    {{ selectedTask.priority }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Status:</span>
                  <span :class="getStatusColor(selectedTask.status)">
                    {{ selectedTask.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Due Date:</span>
                  <span class="text-sm font-medium">{{ selectedTask.dueDate }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Assigned To:</span>
                  <span class="text-sm font-medium">{{ selectedTask.assignedTo.join(', ') }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 flex items-center space-x-3">
              <button
                @click="editTask(selectedTask)"
                class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Edit Task
              </button>
              <button
                @click="markComplete(selectedTask)"
                class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Mark Complete
              </button>
              <button
                @click="selectedTask = null"
                class="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Quick Actions</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                @click="createQuickTask"
                class="p-4 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Plus class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Create Task</h5>
                    <p class="text-sm text-gray-600">Add a new task</p>
                  </div>
                </div>
              </button>
              <button
                @click="viewUpcomingTasks"
                class="p-4 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Clock class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Upcoming Tasks</h5>
                    <p class="text-sm text-gray-600">View upcoming deadlines</p>
                  </div>
                </div>
              </button>
              <button
                @click="exportCalendar"
                class="p-4 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              >
                <div class="flex items-center space-x-3">
                  <Download class="h-5 w-5 text-green-600" />
                  <div>
                    <h5 class="font-medium text-gray-900">Export Calendar</h5>
                    <p class="text-sm text-gray-600">Download calendar data</p>
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
            Close Calendar
          </button>
          <button
            @click="switchToCalendarView"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Switch to Calendar View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Calendar, ChevronLeft, ChevronRight, Plus, Clock, Download } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  tasks?: any[]
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const viewMode = ref<'month' | 'week' | 'day'>('month')
const currentDate = ref(new Date())
const selectedTask = ref<any>(null)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const currentDay = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = currentDay.getMonth() === month
    const isToday = currentDay.toDateString() === new Date().toDateString()
    
    days.push({
      date: currentDay.getDate(),
      fullDate: currentDay.toISOString().split('T')[0],
      isCurrentMonth,
      isToday
    })
    
    currentDay.setDate(currentDay.getDate() + 1)
  }
  
  return days
})

const getTasksForDate = (date: string) => {
  if (!props.tasks) return []
  return props.tasks.filter(task => task.dueDate === date)
}

const getTaskPriorityClass = (priority: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return classes[priority as keyof typeof classes] || classes.medium
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

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const addTaskToDate = (date: string) => {
  notify.info('Add Task', `Creating a new task for ${date}`)
  emit('submit', { action: 'createTask', date })
}

const selectTask = (task: any) => {
  selectedTask.value = task
}

const editTask = (task: any) => {
  notify.info('Edit Task', `Opening edit dialog for "${task.title}"`)
  emit('submit', { action: 'editTask', task })
}

const markComplete = (task: any) => {
  notify.success('Task Completed', `Task "${task.title}" has been marked as complete!`)
  emit('submit', { action: 'markComplete', task })
}

const createQuickTask = () => {
  notify.info('Create Task', 'Opening quick task creation dialog')
  emit('submit', { action: 'createQuickTask' })
}

const viewUpcomingTasks = () => {
  notify.info('Upcoming Tasks', 'Showing tasks due in the next 7 days')
  emit('submit', { action: 'viewUpcomingTasks' })
}

const exportCalendar = () => {
  notify.info('Export Calendar', 'Preparing calendar data for export')
  emit('submit', { action: 'exportCalendar' })
}

const switchToCalendarView = () => {
  notify.success('Calendar View', 'Switching to calendar view mode')
  emit('submit', { action: 'switchToCalendarView' })
  close()
}

const close = () => {
  selectedTask.value = null
  emit('close')
}
</script>
