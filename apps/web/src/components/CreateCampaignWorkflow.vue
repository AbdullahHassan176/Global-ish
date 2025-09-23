<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-5xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create Marketing Campaign</h2>
          <p class="text-brand-teal mt-1">Design and launch a comprehensive marketing campaign across multiple channels</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Campaign Details -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Campaign Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Campaign Name</label>
              <input 
                v-model="campaignData.name"
                type="text" 
                placeholder="Enter campaign name"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Campaign Type</label>
              <select 
                v-model="campaignData.type"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select campaign type</option>
                <option value="email">Email Marketing</option>
                <option value="social">Social Media</option>
                <option value="content">Content Marketing</option>
                <option value="paid">Paid Advertising</option>
                <option value="event">Event Marketing</option>
                <option value="influencer">Influencer Marketing</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Campaign Description</label>
            <textarea 
              v-model="campaignData.description"
              rows="3"
              placeholder="Enter campaign description"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Target Audience -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Target Audience</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Audience Segment</label>
              <select 
                v-model="campaignData.audienceSegment"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select audience segment</option>
                <option value="new-customers">New Customers</option>
                <option value="existing-customers">Existing Customers</option>
                <option value="prospects">Prospects</option>
                <option value="vip">VIP Customers</option>
                <option value="churned">Churned Customers</option>
                <option value="custom">Custom Segment</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Geographic Location</label>
              <select 
                v-model="campaignData.geographicLocation"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select location</option>
                <option value="global">Global</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="specific">Specific Countries</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Demographics</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-brand-navy mb-1">Age Range</label>
                <select 
                  v-model="campaignData.ageRange"
                  class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                >
                  <option value="">Any Age</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-brand-navy mb-1">Gender</label>
                <select 
                  v-model="campaignData.gender"
                  class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                >
                  <option value="">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-brand-navy mb-1">Income Level</label>
                <select 
                  v-model="campaignData.incomeLevel"
                  class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                >
                  <option value="">Any Income</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Campaign Channels -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Marketing Channels</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label class="flex items-center p-3 bg-white/80 rounded-lg border border-brand-cyan/20 cursor-pointer hover:shadow-sm transition-shadow">
                <input 
                  v-model="campaignData.channels.email"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-3 text-sm text-brand-navy">Email</span>
              </label>
              <label class="flex items-center p-3 bg-white/80 rounded-lg border border-brand-cyan/20 cursor-pointer hover:shadow-sm transition-shadow">
                <input 
                  v-model="campaignData.channels.social"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-3 text-sm text-brand-navy">Social Media</span>
              </label>
              <label class="flex items-center p-3 bg-white/80 rounded-lg border border-brand-cyan/20 cursor-pointer hover:shadow-sm transition-shadow">
                <input 
                  v-model="campaignData.channels.content"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-3 text-sm text-brand-navy">Content</span>
              </label>
              <label class="flex items-center p-3 bg-white/80 rounded-lg border border-brand-cyan/20 cursor-pointer hover:shadow-sm transition-shadow">
                <input 
                  v-model="campaignData.channels.paid"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-3 text-sm text-brand-navy">Paid Ads</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Campaign Timeline -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Campaign Timeline</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Start Date</label>
              <input 
                v-model="campaignData.startDate"
                type="date" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">End Date</label>
              <input 
                v-model="campaignData.endDate"
                type="date" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Budget</label>
              <input 
                v-model="campaignData.budget"
                type="number" 
                placeholder="Enter budget amount"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Campaign Goals -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Campaign Goals</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Primary Goal</label>
              <select 
                v-model="campaignData.primaryGoal"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select primary goal</option>
                <option value="awareness">Brand Awareness</option>
                <option value="leads">Lead Generation</option>
                <option value="sales">Sales</option>
                <option value="engagement">Engagement</option>
                <option value="retention">Customer Retention</option>
                <option value="conversion">Conversion</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Target Metric</label>
              <input 
                v-model="campaignData.targetMetric"
                type="text" 
                placeholder="Enter target metric (e.g., 1000 clicks)"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Campaign will be created and ready for review
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="createCampaign" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Create Campaign
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

const campaignData = ref({
  name: '',
  type: '',
  description: '',
  audienceSegment: '',
  geographicLocation: '',
  ageRange: '',
  gender: '',
  incomeLevel: '',
  channels: {
    email: false,
    social: false,
    content: false,
    paid: false
  },
  startDate: '',
  endDate: '',
  budget: '',
  primaryGoal: '',
  targetMetric: ''
})

const createCampaign = () => {
  if (!campaignData.value.name || !campaignData.value.type) {
    alert('Please fill in all required fields')
    return
  }
  
  console.log('Creating marketing campaign:', campaignData.value)
  emit('submit', campaignData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving campaign draft:', campaignData.value)
  alert('Campaign draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  campaignData.value = {
    name: '',
    type: '',
    description: '',
    audienceSegment: '',
    geographicLocation: '',
    ageRange: '',
    gender: '',
    incomeLevel: '',
    channels: {
      email: false,
      social: false,
      content: false,
      paid: false
    },
    startDate: '',
    endDate: '',
    budget: '',
    primaryGoal: '',
    targetMetric: ''
  }
}
</script>
