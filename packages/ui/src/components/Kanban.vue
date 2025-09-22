<template>
  <div class="kanban-board">
    <div class="flex space-x-6 overflow-x-auto pb-4">
      <div
        v-for="column in columns"
        :key="column.id"
        class="flex-shrink-0 w-80"
      >
        <!-- Column Header -->
        <div class="bg-gray-100 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ column.title }}
            </h3>
            <span class="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
              {{ column.tasks.length }}
            </span>
          </div>
        </div>

        <!-- Tasks -->
        <div
          class="space-y-3 min-h-96"
          @drop="handleDrop($event, column.id)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="task in column.tasks"
            :key="task.id"
            class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
            draggable="true"
            @dragstart="handleDragStart($event, task)"
            @click="handleTaskClick(task)"
          >
            <component
              :is="renderTask"
              :task="task"
            />
          </div>

          <!-- Empty State -->
          <div
            v-if="column.tasks.length === 0"
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          >
            <p class="text-gray-500 text-sm">No tasks in this column</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: string
  [key: string]: any
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface Props {
  columns: Column[]
  renderTask?: any
}

interface Emits {
  (e: 'task-move', taskId: string, fromColumn: string, toColumn: string): void
  (e: 'task-click', task: Task): void
}

const props = withDefaults(defineProps<Props>(), {
  renderTask: null
})

const emit = defineEmits<Emits>()

const draggedTask = ref<Task | null>(null)
const draggedFromColumn = ref<string | null>(null)

const handleDragStart = (event: DragEvent, task: Task) => {
  draggedTask.value = task
  draggedFromColumn.value = props.columns.find(col => 
    col.tasks.some(t => t.id === task.id)
  )?.id || null
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task.id)
  }
}

const handleDrop = (event: DragEvent, toColumnId: string) => {
  event.preventDefault()
  
  if (!draggedTask.value || !draggedFromColumn.value) return
  
  if (draggedFromColumn.value !== toColumnId) {
    emit('task-move', draggedTask.value.id, draggedFromColumn.value, toColumnId)
  }
  
  draggedTask.value = null
  draggedFromColumn.value = null
}

const handleTaskClick = (task: Task) => {
  emit('task-click', task)
}
</script>

<style scoped>
.kanban-board {
  @apply w-full;
}

/* Custom scrollbar for horizontal overflow */
.kanban-board::-webkit-scrollbar {
  height: 8px;
}

.kanban-board::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.kanban-board::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.kanban-board::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
