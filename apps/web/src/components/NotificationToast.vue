<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="notification"
      :class="[
        'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
        typeClasses
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component
              :is="typeIcon"
              :class="[
                'h-6 w-6',
                typeIconClasses
              ]"
            />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              {{ notification.title }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              {{ notification.message }}
            </p>
            <div v-if="notification.actions" class="mt-3 flex space-x-2">
              <button
                v-for="action in notification.actions"
                :key="action.label"
                @click="action.action"
                :class="[
                  'text-sm font-medium rounded-md px-3 py-1.5',
                  actionVariantClasses[action.variant || 'secondary']
                ]"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="$emit('close')"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next'
import type { Notification } from '../composables/useNotifications'

const props = defineProps<{
  notification: Notification
}>()

const emit = defineEmits<{
  close: []
}>()

const typeClasses = computed(() => {
  switch (props.notification.type) {
    case 'success':
      return 'border-l-4 border-green-400'
    case 'error':
      return 'border-l-4 border-red-400'
    case 'warning':
      return 'border-l-4 border-yellow-400'
    case 'info':
      return 'border-l-4 border-blue-400'
    default:
      return 'border-l-4 border-gray-400'
  }
})

const typeIcon = computed(() => {
  switch (props.notification.type) {
    case 'success':
      return CheckCircle
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    default:
      return Info
  }
})

const typeIconClasses = computed(() => {
  switch (props.notification.type) {
    case 'success':
      return 'text-green-400'
    case 'error':
      return 'text-red-400'
    case 'warning':
      return 'text-yellow-400'
    case 'info':
      return 'text-blue-400'
    default:
      return 'text-gray-400'
  }
})

const actionVariantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700'
}
</script>
