<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create Notification</h2>
          <p class="text-brand-teal mt-1">Send notifications to users via email, SMS, or in-app messaging</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Notification Details -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Notification Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Subject</label>
              <input 
                v-model="notificationData.subject"
                type="text" 
                placeholder="Enter notification subject"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Priority</label>
              <select 
                v-model="notificationData.priority"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Message</label>
            <textarea 
              v-model="notificationData.message"
              rows="4"
              placeholder="Enter notification message"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Recipients -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Recipients</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Send To</label>
              <select 
                v-model="notificationData.sendTo"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="specific">Specific Users</option>
                <option value="role">Role-based</option>
                <option value="department">Department</option>
                <option value="all">All Users</option>
              </select>
            </div>
            <div v-if="notificationData.sendTo === 'specific'">
              <label class="block text-sm font-medium text-brand-navy mb-2">Select Users</label>
              <select 
                v-model="notificationData.selectedUsers"
                multiple
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="mike-wilson">Mike Wilson</option>
                <option value="sarah-jones">Sarah Jones</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Delivery Channels -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Delivery Channels</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  v-model="notificationData.channels.email"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Email</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="notificationData.channels.sms"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">SMS</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="notificationData.channels.inApp"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">In-App</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="notificationData.channels.push"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Push Notification</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Scheduling -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Scheduling</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Send Time</label>
              <select 
                v-model="notificationData.sendTime"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="now">Send Now</option>
                <option value="scheduled">Schedule for Later</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
            <div v-if="notificationData.sendTime === 'scheduled'">
              <label class="block text-sm font-medium text-brand-navy mb-2">Scheduled Date & Time</label>
              <input 
                v-model="notificationData.scheduledDateTime"
                type="datetime-local" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Advanced Options -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Advanced Options</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  v-model="notificationData.requireRead"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Require read confirmation</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="notificationData.allowReply"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Allow replies</span>
              </label>
            </div>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  v-model="notificationData.trackOpens"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Track opens</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="notificationData.trackClicks"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Track clicks</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Notification will be sent according to selected channels and timing
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="sendNotification" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Send Notification
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const notificationData = ref({
  subject: '',
  message: '',
  priority: 'normal',
  sendTo: 'specific',
  selectedUsers: [],
  channels: {
    email: true,
    sms: false,
    inApp: true,
    push: false
  },
  sendTime: 'now',
  scheduledDateTime: '',
  requireRead: false,
  allowReply: true,
  trackOpens: true,
  trackClicks: true
})

const sendNotification = () => {
  if (!notificationData.value.subject || !notificationData.value.message) {
    alert('Please fill in all required fields')
    return
  }
  
  console.log('Sending notification:', notificationData.value)
  emit('submit', notificationData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving notification draft:', notificationData.value)
  alert('Notification draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  notificationData.value = {
    subject: '',
    message: '',
    priority: 'normal',
    sendTo: 'specific',
    selectedUsers: [],
    channels: {
      email: true,
      sms: false,
      inApp: true,
      push: false
    },
    sendTime: 'now',
    scheduledDateTime: '',
    requireRead: false,
    allowReply: true,
    trackOpens: true,
    trackClicks: true
  }
}
</script>
