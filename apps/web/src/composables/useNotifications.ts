import { ref, reactive } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

export interface ConfirmationOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

const notifications = ref<Notification[]>([])
const confirmationModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'info' as 'danger' | 'warning' | 'info',
  onConfirm: null as (() => void) | null,
  onCancel: null as (() => void) | null
})

let notificationIdCounter = 0

export function useNotifications() {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${++notificationIdCounter}`
    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove non-persistent notifications
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const showSuccess = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const showError = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // Errors should persist until manually dismissed
      ...options
    })
  }

  const showWarning = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const showInfo = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmationModal.isOpen = true
      confirmationModal.title = options.title
      confirmationModal.message = options.message
      confirmationModal.confirmText = options.confirmText || 'Confirm'
      confirmationModal.cancelText = options.cancelText || 'Cancel'
      confirmationModal.variant = options.variant || 'info'
      
      confirmationModal.onConfirm = () => {
        confirmationModal.isOpen = false
        resolve(true)
      }
      
      confirmationModal.onCancel = () => {
        confirmationModal.isOpen = false
        resolve(false)
      }
    })
  }

  const showConfirmation = (options: ConfirmationOptions) => {
    return confirm(options)
  }

  return {
    // State
    notifications: notifications.value,
    confirmationModal,
    
    // Actions
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirm,
    showConfirmation
  }
}

// Global notification functions for easy access
export const notify = {
  success: (title: string, message: string, options?: Partial<Notification>) => {
    const { showSuccess } = useNotifications()
    return showSuccess(title, message, options)
  },
  error: (title: string, message: string, options?: Partial<Notification>) => {
    const { showError } = useNotifications()
    return showError(title, message, options)
  },
  warning: (title: string, message: string, options?: Partial<Notification>) => {
    const { showWarning } = useNotifications()
    return showWarning(title, message, options)
  },
  info: (title: string, message: string, options?: Partial<Notification>) => {
    const { showInfo } = useNotifications()
    return showInfo(title, message, options)
  },
  confirm: (options: ConfirmationOptions) => {
    const { confirm } = useNotifications()
    return confirm(options)
  }
}
