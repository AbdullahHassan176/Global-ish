<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-brand-cyan/20 shadow-lg">
    <!-- Search and Filters -->
    <div v-if="searchable || filterable" class="p-4 border-b border-brand-cyan/20">
      <div class="flex items-center space-x-4">
        <div v-if="searchable" class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
          />
        </div>
        <button v-if="exportable" @click="handleExport" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 text-sm">
          Export
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-brand-cream to-brand-pink/30">
          <tr>
            <th v-if="selectable" class="px-6 py-3 text-left">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
              ]"
              :style="{ width: column.width }"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.title }}</span>
                <span v-if="column.sortable" class="text-gray-400">
                  <ChevronUp v-if="sortKey === column.key && sortDirection === 'asc'" class="h-4 w-4" />
                  <ChevronDown v-else-if="sortKey === column.key && sortDirection === 'desc'" class="h-4 w-4" />
                  <ChevronsUpDown v-else class="h-4 w-4" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in paginatedData"
            :key="getRowKey(row, index)"
            :class="[
              'hover:bg-gray-50',
              selectable ? 'cursor-pointer' : ''
            ]"
            @click="handleRowClick(row)"
          >
            <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                :checked="isRowSelected(row)"
                @change="toggleRowSelection(row)"
                @click.stop
                class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <span v-if="!column.render">{{ row[column.key] }}</span>
              <div v-else-if="column.render" v-html="renderColumn(column, row)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination" class="px-6 py-3 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
          {{ pagination.total }} results
        </div>
        <div class="flex items-center space-x-2">
          <select
            :value="pagination.limit"
            @change="handleLimitChange"
            class="input text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <div class="flex items-center space-x-1">
            <button
              @click="handlePageChange(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="btn btn-outline btn-sm"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-gray-700">
              Page {{ pagination.page }} of {{ Math.ceil(pagination.total / pagination.limit) }}
            </span>
            <button
              @click="handlePageChange(pagination.page + 1)"
              :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
              class="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next'

interface Column {
  key: string
  title: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: any) => string
}

interface Pagination {
  page: number
  limit: number
  total: number
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
}

interface Props {
  data: any[]
  columns: Column[]
  selectable?: boolean
  selectedRows?: any[]
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  pagination?: Pagination
}

interface Emits {
  (e: 'selection-change', rows: any[]): void
  (e: 'row-click', row: any): void
  (e: 'export'): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selectedRows: () => [],
  searchable: false,
  filterable: false,
  exportable: false
})

const emit = defineEmits<Emits>()

const searchQuery = ref('')
const sortKey = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

const filteredData = computed(() => {
  let result = props.data

  if (searchQuery.value) {
    result = result.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
  }

  return result
})

const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedData = computed(() => {
  if (!props.pagination) return sortedData.value

  const start = (props.pagination.page - 1) * props.pagination.limit
  const end = start + props.pagination.limit
  return sortedData.value.slice(start, end)
})

const allSelected = computed(() => {
  return props.selectable && props.selectedRows.length === paginatedData.value.length
})

const isRowSelected = (row: any) => {
  return props.selectedRows.some(selected => getRowKey(selected) === getRowKey(row))
}

const getRowKey = (row: any, index?: number) => {
  return row.id || row.key || index
}

const renderColumn = (column: Column, row: any) => {
  if (column.render) {
    return column.render(row[column.key], row)
  }
  return row[column.key]
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    emit('selection-change', [])
  } else {
    emit('selection-change', paginatedData.value)
  }
}

const toggleRowSelection = (row: any) => {
  const newSelection = isRowSelected(row)
    ? props.selectedRows.filter(selected => getRowKey(selected) !== getRowKey(row))
    : [...props.selectedRows, row]
  
  emit('selection-change', newSelection)
}

const handleRowClick = (row: any) => {
  emit('row-click', row)
}

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const handlePageChange = (page: number) => {
  if (props.pagination?.onPageChange) {
    props.pagination.onPageChange(page)
  }
}

const handleLimitChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const limit = parseInt(target.value)
  if (props.pagination?.onLimitChange) {
    props.pagination.onLimitChange(limit)
  }
}

const handleExport = () => {
  emit('export')
}
</script>
