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
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                SMS Service Integration Configuration
              </h3>
              <p class="text-sm text-gray-600">Configure SMS alerts for your workflows</p>
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
          <!-- SMS Provider Selection -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">SMS Provider</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="provider in smsProviders"
                :key="provider.id"
                @click="configData.provider = provider.id"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition-all',
                  configData.provider === provider.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
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

          <!-- Twilio Configuration -->
          <div v-if="configData.provider === 'twilio'" class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Twilio Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Account SID
                </label>
                <input
                  v-model="configData.twilio.accountSid"
                  type="text"
                  placeholder="Enter your Twilio Account SID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Auth Token
                </label>
                <input
                  v-model="configData.twilio.authToken"
                  type="password"
                  placeholder="Enter your Twilio Auth Token"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  From Phone Number
                </label>
                <input
                  v-model="configData.twilio.fromNumber"
                  type="tel"
                  placeholder="+1234567890"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Messaging Service SID (Optional)
                </label>
                <input
                  v-model="configData.twilio.messagingServiceSid"
                  type="text"
                  placeholder="Enter Messaging Service SID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <!-- AWS SNS Configuration -->
          <div v-if="configData.provider === 'sns'" class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">AWS SNS Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Access Key ID
                </label>
                <input
                  v-model="configData.sns.accessKeyId"
                  type="text"
                  placeholder="Enter your AWS Access Key ID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Secret Access Key
                </label>
                <input
                  v-model="configData.sns.secretAccessKey"
                  type="password"
                  placeholder="Enter your AWS Secret Access Key"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  v-model="configData.sns.region"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">Europe (Ireland)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  SNS Topic ARN
                </label>
                <input
                  v-model="configData.sns.topicArn"
                  type="text"
                  placeholder="Enter SNS Topic ARN"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <!-- Message Settings -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Message Settings</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Default Sender Name
                </label>
                <input
                  v-model="configData.senderName"
                  type="text"
                  placeholder="Your Company Name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Message Template
                </label>
                <textarea
                  v-model="configData.messageTemplate"
                  rows="4"
                  placeholder="Enter your default SMS message template. Use {{variable}} for dynamic content."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-sm text-gray-600 mt-1">
                  Available variables: {{workflowName}}, {{stepName}}, {{assigneeName}}, {{dueDate}}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Max Message Length
                  </label>
                  <input
                    v-model="configData.maxLength"
                    type="number"
                    min="1"
                    max="1600"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Timeout (seconds)
                  </label>
                  <input
                    v-model="configData.deliveryTimeout"
                    type="number"
                    min="30"
                    max="300"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Alert Settings -->
          <div class="bg-orange-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-orange-900 mb-4">Alert Settings</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Alert Triggers
                </label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="configData.alerts.workflowStarted"
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="text-sm text-gray-700">Workflow started</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="configData.alerts.stepAssigned"
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="text-sm text-gray-700">Step assigned</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="configData.alerts.stepOverdue"
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="text-sm text-gray-700">Step overdue</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="configData.alerts.workflowCompleted"
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="text-sm text-gray-700">Workflow completed</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="configData.alerts.workflowFailed"
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="text-sm text-gray-700">Workflow failed</span>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Quiet Hours Start
                  </label>
                  <input
                    v-model="configData.quietHours.start"
                    type="time"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Quiet Hours End
                  </label>
                  <input
                    v-model="configData.quietHours.end"
                    type="time"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label class="flex items-center space-x-2">
                  <input
                    v-model="configData.respectQuietHours"
                    type="checkbox"
                    class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span class="text-sm text-gray-700">Respect quiet hours (no SMS during specified times)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Test SMS -->
          <div class="bg-yellow-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-yellow-900 mb-4">Test SMS Configuration</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Test Phone Number
                </label>
                <input
                  v-model="testPhoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Test Message
                </label>
                <textarea
                  v-model="testMessage"
                  rows="3"
                  placeholder="Enter test message content"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div class="flex justify-end">
                <button
                  @click="sendTestSMS"
                  :disabled="!testPhoneNumber || !testMessage"
                  class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Send Test SMS
                </button>
              </div>
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
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
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
import { X, MessageSquare, Save, Phone, Cloud, Zap } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const testPhoneNumber = ref('')
const testMessage = ref('')

const smsProviders = [
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Popular SMS service',
    icon: Phone,
    color: 'text-red-600'
  },
  {
    id: 'sns',
    name: 'AWS SNS',
    description: 'Amazon SMS service',
    icon: Cloud,
    color: 'text-orange-600'
  },
  {
    id: 'custom',
    name: 'Custom API',
    description: 'Custom SMS provider',
    icon: Zap,
    color: 'text-blue-600'
  }
]

const configData = ref({
  provider: 'twilio',
  twilio: {
    accountSid: '',
    authToken: '',
    fromNumber: '',
    messagingServiceSid: ''
  },
  sns: {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    topicArn: ''
  },
  senderName: '',
  messageTemplate: 'Workflow Alert: {{workflowName}} - {{stepName}} assigned to {{assigneeName}}. Due: {{dueDate}}',
  maxLength: 160,
  deliveryTimeout: 60,
  alerts: {
    workflowStarted: true,
    stepAssigned: true,
    stepOverdue: true,
    workflowCompleted: false,
    workflowFailed: true
  },
  quietHours: {
    start: '22:00',
    end: '08:00'
  },
  respectQuietHours: true
})

const sendTestSMS = () => {
  if (!testPhoneNumber.value || !testMessage.value) {
    notify.warning('Validation Error', 'Please enter both phone number and test message')
    return
  }

  notify.info('Sending Test SMS', `Sending test SMS to ${testPhoneNumber.value}...`)
  // Simulate sending test SMS
  setTimeout(() => {
    notify.success('Test SMS Sent', 'Test SMS has been sent successfully!')
  }, 2000)
}

const saveConfiguration = () => {
  if (!configData.value.senderName) {
    notify.warning('Validation Error', 'Please provide a sender name')
    return
  }

  if (configData.value.provider === 'twilio' && (!configData.value.twilio.accountSid || !configData.value.twilio.authToken || !configData.value.twilio.fromNumber)) {
    notify.warning('Validation Error', 'Please fill in all required Twilio configuration fields')
    return
  }

  if (configData.value.provider === 'sns' && (!configData.value.sns.accessKeyId || !configData.value.sns.secretAccessKey)) {
    notify.warning('Validation Error', 'Please fill in all required AWS SNS configuration fields')
    return
  }

  console.log('Saving SMS service configuration:', configData.value)
  notify.success('Configuration Saved', 'SMS service integration has been configured successfully!')
  
  emit('submit', configData.value)
  close()
}

const close = () => {
  // Reset form
  configData.value = {
    provider: 'twilio',
    twilio: {
      accountSid: '',
      authToken: '',
      fromNumber: '',
      messagingServiceSid: ''
    },
    sns: {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      topicArn: ''
    },
    senderName: '',
    messageTemplate: 'Workflow Alert: {{workflowName}} - {{stepName}} assigned to {{assigneeName}}. Due: {{dueDate}}',
    maxLength: 160,
    deliveryTimeout: 60,
    alerts: {
      workflowStarted: true,
      stepAssigned: true,
      stepOverdue: true,
      workflowCompleted: false,
      workflowFailed: true
    },
    quietHours: {
      start: '22:00',
      end: '08:00'
    },
    respectQuietHours: true
  }
  testPhoneNumber.value = ''
  testMessage.value = ''
  emit('close')
}
</script>
