<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Notification System Demo</h1>
        <p class="text-gray-600">
          Test the new in-app notification system that replaces browser popups
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Notification Types -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Notification Types</h2>
          <div class="space-y-3">
            <button
              @click="showSuccessNotification"
              class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Show Success Notification
            </button>
            <button
              @click="showErrorNotification"
              class="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Show Error Notification
            </button>
            <button
              @click="showWarningNotification"
              class="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Show Warning Notification
            </button>
            <button
              @click="showInfoNotification"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Show Info Notification
            </button>
          </div>
        </div>

        <!-- Confirmation Examples -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Confirmation Dialogs</h2>
          <div class="space-y-3">
            <button
              @click="showSimpleConfirmation"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Simple Confirmation
            </button>
            <button
              @click="showDangerConfirmation"
              class="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Danger Confirmation
            </button>
            <button
              @click="showWarningConfirmation"
              class="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Warning Confirmation
            </button>
          </div>
        </div>

        <!-- Notification with Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Notifications with Actions</h2>
          <div class="space-y-3">
            <button
              @click="showNotificationWithActions"
              class="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Notification with Action Buttons
            </button>
            <button
              @click="showPersistentNotification"
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Persistent Notification
            </button>
          </div>
        </div>

        <!-- Multiple Notifications -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Multiple Notifications</h2>
          <div class="space-y-3">
            <button
              @click="showMultipleNotifications"
              class="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Show Multiple Notifications
            </button>
            <button
              @click="clearAllNotifications"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Results</h2>
        <div class="space-y-2">
          <p class="text-sm text-gray-600">
            <strong>Last Action:</strong> {{ lastAction }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Confirmation Result:</strong> {{ confirmationResult }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { notify } from '@/composables/useNotifications'

const lastAction = ref('None')
const confirmationResult = ref('None')

const showSuccessNotification = () => {
  notify.success('Success!', 'This is a success notification that will auto-dismiss in 5 seconds')
  lastAction.value = 'Success notification shown'
}

const showErrorNotification = () => {
  notify.error('Error!', 'This is an error notification that will persist until manually dismissed')
  lastAction.value = 'Error notification shown'
}

const showWarningNotification = () => {
  notify.warning('Warning!', 'This is a warning notification')
  lastAction.value = 'Warning notification shown'
}

const showInfoNotification = () => {
  notify.info('Information', 'This is an informational notification')
  lastAction.value = 'Info notification shown'
}

const showSimpleConfirmation = async () => {
  const result = await notify.confirm({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed with this action?',
    confirmText: 'Yes, proceed',
    cancelText: 'Cancel'
  })
  
  confirmationResult.value = result ? 'Confirmed' : 'Cancelled'
  lastAction.value = 'Simple confirmation shown'
}

const showDangerConfirmation = async () => {
  const result = await notify.confirm({
    title: 'Delete Item',
    message: 'This action cannot be undone. Are you sure you want to delete this item?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger'
  })
  
  confirmationResult.value = result ? 'Deleted' : 'Cancelled'
  lastAction.value = 'Danger confirmation shown'
}

const showWarningConfirmation = async () => {
  const result = await notify.confirm({
    title: 'Warning',
    message: 'This action may have unintended consequences. Do you want to continue?',
    confirmText: 'Continue',
    cancelText: 'Cancel',
    variant: 'warning'
  })
  
  confirmationResult.value = result ? 'Continued' : 'Cancelled'
  lastAction.value = 'Warning confirmation shown'
}

const showNotificationWithActions = () => {
  notify.info('Action Required', 'This notification has action buttons', {
    actions: [
      {
        label: 'View Details',
        action: () => {
          notify.info('Details', 'Opening details page...')
        },
        variant: 'primary'
      },
      {
        label: 'Dismiss',
        action: () => {
          notify.success('Dismissed', 'Notification dismissed')
        },
        variant: 'secondary'
      }
    ]
  })
  lastAction.value = 'Notification with actions shown'
}

const showPersistentNotification = () => {
  notify.warning('Important Notice', 'This notification will not auto-dismiss', {
    persistent: true
  })
  lastAction.value = 'Persistent notification shown'
}

const showMultipleNotifications = () => {
  notify.info('First', 'This is the first notification')
  setTimeout(() => notify.success('Second', 'This is the second notification'), 500)
  setTimeout(() => notify.warning('Third', 'This is the third notification'), 1000)
  lastAction.value = 'Multiple notifications shown'
}

const clearAllNotifications = () => {
  const { clearAllNotifications } = notify
  clearAllNotifications()
  lastAction.value = 'All notifications cleared'
}
</script>
