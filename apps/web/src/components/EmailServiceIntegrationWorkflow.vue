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
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Email Service Integration Configuration
              </h3>
              <p class="text-sm text-gray-600">Configure email notifications for your workflows</p>
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
          <!-- Email Provider Selection -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Email Provider</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="provider in emailProviders"
                :key="provider.id"
                @click="configData.provider = provider.id"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition-all',
                  configData.provider === provider.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <component :is="provider.icon" class="h-6 w-6" :class="provider.color" />
                  <div>
                    <h5 class="font-medium text-gray-900">{{ provider.name }}</h5>
                    <p class="text-sm text-gray-600">{{ provider.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SMTP Configuration -->
          <div v-if="configData.provider === 'smtp'" class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">SMTP Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Server
                </label>
                <input
                  v-model="configData.smtp.host"
                  type="text"
                  placeholder="smtp.example.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  v-model="configData.smtp.port"
                  type="number"
                  placeholder="587"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  v-model="configData.smtp.username"
                  type="text"
                  placeholder="your-email@example.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  v-model="configData.smtp.password"
                  type="password"
                  placeholder="Your email password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div class="md:col-span-2">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.smtp.useTLS"
                    type="checkbox"
                    class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="text-sm text-gray-700">Use TLS encryption</span>
                </label>
              </div>
            </div>
          </div>

          <!-- SendGrid Configuration -->
          <div v-if="configData.provider === 'sendgrid'" class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">SendGrid Configuration</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  v-model="configData.sendgrid.apiKey"
                  type="password"
                  placeholder="Enter your SendGrid API key"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <input
                  v-model="configData.sendgrid.fromEmail"
                  type="email"
                  placeholder="noreply@yourcompany.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  From Name
                </label>
                <input
                  v-model="configData.sendgrid.fromName"
                  type="text"
                  placeholder="Your Company Name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Notification Settings</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default From Address
                </label>
                <input
                  v-model="configData.defaultFrom"
                  type="email"
                  placeholder="workflows@yourcompany.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Reply-To Address
                  </label>
                  <input
                    v-model="configData.replyTo"
                    type="email"
                    placeholder="support@yourcompany.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Bounce Handling Email
                  </label>
                  <input
                    v-model="configData.bounceEmail"
                    type="email"
                    placeholder="bounces@yourcompany.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div class="space-y-3">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.enableTracking"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Enable email tracking and analytics</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.enableUnsubscribe"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Include unsubscribe links</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.enableBounceHandling"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Enable bounce handling</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Template Settings -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Email Templates</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Template
                </label>
                <select
                  v-model="configData.defaultTemplate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="simple">Simple Text Template</option>
                  <option value="html">HTML Template</option>
                  <option value="branded">Branded Template</option>
                  <option value="custom">Custom Template</option>
                </select>
              </div>

              <div v-if="configData.defaultTemplate === 'custom'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Custom Template ID
                </label>
                <input
                  v-model="configData.customTemplateId"
                  type="text"
                  placeholder="Enter custom template ID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email Frequency Limits
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">Max emails per hour</label>
                    <input
                      v-model="configData.rateLimit.hourly"
                      type="number"
                      min="1"
                      max="10000"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">Max emails per day</label>
                    <input
                      v-model="configData.rateLimit.daily"
                      type="number"
                      min="1"
                      max="100000"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Test Email -->
          <div class="bg-yellow-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-yellow-900 mb-4">Test Email Configuration</h4>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <input
                  v-model="testEmail"
                  type="email"
                  placeholder="Enter test email address"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <button
                @click="sendTestEmail"
                :disabled="!testEmail"
                class="ml-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send Test Email
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
            Cancel
          </button>
          <button
            @click="saveConfiguration"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Save class="h-4 w-4 mr-2" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Mail, Save, Server, Send, Mail as MailIcon } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const testEmail = ref('')

const emailProviders = [
  {
    id: 'smtp',
    name: 'SMTP',
    description: 'Custom SMTP server',
    icon: Server,
    color: 'text-gray-600'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Professional email service',
    icon: Send,
    color: 'text-blue-600'
  },
  {
    id: 'ses',
    name: 'Amazon SES',
    description: 'AWS email service',
    icon: MailIcon,
    color: 'text-orange-600'
  }
]

const configData = ref({
  provider: 'smtp',
  smtp: {
    host: '',
    port: 587,
    username: '',
    password: '',
    useTLS: true
  },
  sendgrid: {
    apiKey: '',
    fromEmail: '',
    fromName: ''
  },
  defaultFrom: '',
  replyTo: '',
  bounceEmail: '',
  enableTracking: true,
  enableUnsubscribe: true,
  enableBounceHandling: true,
  defaultTemplate: 'simple',
  customTemplateId: '',
  rateLimit: {
    hourly: 1000,
    daily: 10000
  }
})

const sendTestEmail = () => {
  if (!testEmail.value) {
    notify.warning('Validation Error', 'Please enter a test email address')
    return
  }

  notify.info('Sending Test Email', `Sending test email to ${testEmail.value}...`)
  // Simulate sending test email
  setTimeout(() => {
    notify.success('Test Email Sent', 'Test email has been sent successfully!')
  }, 2000)
}

const saveConfiguration = () => {
  if (!configData.value.defaultFrom) {
    notify.warning('Validation Error', 'Please provide a default from address')
    return
  }

  if (configData.value.provider === 'smtp' && (!configData.value.smtp.host || !configData.value.smtp.username)) {
    notify.warning('Validation Error', 'Please fill in all required SMTP configuration fields')
    return
  }

  if (configData.value.provider === 'sendgrid' && !configData.value.sendgrid.apiKey) {
    notify.warning('Validation Error', 'Please provide a SendGrid API key')
    return
  }

  console.log('Saving email service configuration:', configData.value)
  notify.success('Configuration Saved', 'Email service integration has been configured successfully!')
  
  emit('submit', configData.value)
  close()
}

const close = () => {
  // Reset form
  configData.value = {
    provider: 'smtp',
    smtp: {
      host: '',
      port: 587,
      username: '',
      password: '',
      useTLS: true
    },
    sendgrid: {
      apiKey: '',
      fromEmail: '',
      fromName: ''
    },
    defaultFrom: '',
    replyTo: '',
    bounceEmail: '',
    enableTracking: true,
    enableUnsubscribe: true,
    enableBounceHandling: true,
    defaultTemplate: 'simple',
    customTemplateId: '',
    rateLimit: {
      hourly: 1000,
      daily: 10000
    }
  }
  testEmail.value = ''
  emit('close')
}
</script>
