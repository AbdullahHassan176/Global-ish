<template>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="confirmationModal.isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <Transition
          enter-active-class="duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="confirmationModal.isOpen"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="handleCancel"
          ></div>
        </Transition>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Modal panel -->
        <Transition
          enter-active-class="duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="confirmationModal.isOpen"
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div class="sm:flex sm:items-start">
              <div :class="[
                'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10',
                iconContainerClasses
              ]">
                <component
                  :is="iconComponent"
                  :class="[
                    'h-6 w-6',
                    iconClasses
                  ]"
                />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ confirmationModal.title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ confirmationModal.message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                @click="handleConfirm"
                :class="[
                  'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                  confirmButtonClasses
                ]"
              >
                {{ confirmationModal.confirmText }}
              </button>
              <button
                type="button"
                @click="handleCancel"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                {{ confirmationModal.cancelText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotifications } from '../composables/useNotifications'
import { AlertTriangle, Info, XCircle } from 'lucide-vue-next'

const { confirmationModal } = useNotifications()

const iconComponent = computed(() => {
  switch (confirmationModal.variant) {
    case 'danger':
      return XCircle
    case 'warning':
      return AlertTriangle
    default:
      return Info
  }
})

const iconContainerClasses = computed(() => {
  switch (confirmationModal.variant) {
    case 'danger':
      return 'bg-red-100'
    case 'warning':
      return 'bg-yellow-100'
    default:
      return 'bg-blue-100'
  }
})

const iconClasses = computed(() => {
  switch (confirmationModal.variant) {
    case 'danger':
      return 'text-red-600'
    case 'warning':
      return 'text-yellow-600'
    default:
      return 'text-blue-600'
  }
})

const confirmButtonClasses = computed(() => {
  switch (confirmationModal.variant) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    default:
      return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
})

const handleConfirm = () => {
  if (confirmationModal.onConfirm) {
    confirmationModal.onConfirm()
  }
}

const handleCancel = () => {
  if (confirmationModal.onCancel) {
    confirmationModal.onCancel()
  }
}
</script>
