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
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target class="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Create Marketing Campaign
              </h3>
              <p class="text-sm text-gray-600">Set up a new marketing campaign with goals, audience, and content strategy</p>
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
          <!-- Campaign Basics -->
          <div class="bg-orange-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-orange-900 mb-4">Campaign Basics</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Name <span class="text-red-500">*</span></label>
                <input
                  v-model="campaignData.name"
                  type="text"
                  placeholder="Enter campaign name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                <select
                  v-model="campaignData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="brand_awareness">Brand Awareness</option>
                  <option value="lead_generation">Lead Generation</option>
                  <option value="sales_conversion">Sales Conversion</option>
                  <option value="engagement">Engagement</option>
                  <option value="retargeting">Retargeting</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date <span class="text-red-500">*</span></label>
                <input
                  v-model="campaignData.startDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date <span class="text-red-500">*</span></label>
                <input
                  v-model="campaignData.endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="campaignData.description"
                  rows="3"
                  placeholder="Describe the campaign objectives and strategy"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Target Audience -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-900 mb-4">Target Audience</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <select
                  v-model="campaignData.ageRange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  v-model="campaignData.gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non_binary">Non-binary</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                <input
                  v-model="campaignData.interests"
                  type="text"
                  placeholder="Technology, Business, Marketing"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  v-model="campaignData.location"
                  type="text"
                  placeholder="United States, Canada, Global"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Budget & Goals -->
          <div class="bg-green-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-900 mb-4">Budget & Goals</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Total Budget <span class="text-red-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    v-model="campaignData.budget"
                    type="number"
                    placeholder="10000"
                    class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Daily Budget</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    v-model="campaignData.dailyBudget"
                    type="number"
                    placeholder="500"
                    class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
                <select
                  v-model="campaignData.primaryGoal"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="impressions">Impressions</option>
                  <option value="clicks">Clicks</option>
                  <option value="conversions">Conversions</option>
                  <option value="engagement">Engagement</option>
                  <option value="reach">Reach</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                <input
                  v-model="campaignData.targetValue"
                  type="number"
                  placeholder="1000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <!-- Platforms -->
          <div class="bg-purple-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-purple-900 mb-4">Platforms</h4>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="campaignData.platforms"
                    type="checkbox"
                    value="linkedin"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Linkedin class="h-5 w-5 text-blue-600" />
                    <span class="text-gray-700">LinkedIn</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="campaignData.platforms"
                    type="checkbox"
                    value="facebook"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Facebook class="h-5 w-5 text-blue-600" />
                    <span class="text-gray-700">Facebook</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="campaignData.platforms"
                    type="checkbox"
                    value="instagram"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Instagram class="h-5 w-5 text-pink-600" />
                    <span class="text-gray-700">Instagram</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="campaignData.platforms"
                    type="checkbox"
                    value="twitter"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Twitter class="h-5 w-5 text-blue-400" />
                    <span class="text-gray-700">Twitter</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="campaignData.platforms"
                    type="checkbox"
                    value="google_ads"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Target class="h-5 w-5 text-red-600" />
                    <span class="text-gray-700">Google Ads</span>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="campaignData.platforms"
                    type="checkbox"
                    value="youtube"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <div class="flex items-center space-x-2">
                    <Youtube class="h-5 w-5 text-red-600" />
                    <span class="text-gray-700">YouTube</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Content Strategy -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Content Strategy</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Content Types</label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-2">
                    <input v-model="campaignData.contentTypes" type="checkbox" value="posts" class="form-checkbox h-4 w-4 text-gray-600 rounded" />
                    <span class="text-sm text-gray-700">Social Media Posts</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input v-model="campaignData.contentTypes" type="checkbox" value="videos" class="form-checkbox h-4 w-4 text-gray-600 rounded" />
                    <span class="text-sm text-gray-700">Videos</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input v-model="campaignData.contentTypes" type="checkbox" value="images" class="form-checkbox h-4 w-4 text-gray-600 rounded" />
                    <span class="text-sm text-gray-700">Images</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input v-model="campaignData.contentTypes" type="checkbox" value="ads" class="form-checkbox h-4 w-4 text-gray-600 rounded" />
                    <span class="text-sm text-gray-700">Paid Ads</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Posting Frequency</label>
                <select
                  v-model="campaignData.postingFrequency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi_weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
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
            @click="handleSaveDraft"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Save Draft
          </button>
          <button
            @click="handleCreateCampaign"
            class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Target, Linkedin, Facebook, Instagram, Twitter, Youtube } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [campaign: any]
  saveDraft: [campaign: any]
}>()

const campaignData = ref({
  name: '',
  type: 'brand_awareness',
  startDate: '',
  endDate: '',
  description: '',
  ageRange: '25-34',
  gender: 'all',
  interests: '',
  location: '',
  budget: '',
  dailyBudget: '',
  primaryGoal: 'impressions',
  targetValue: '',
  platforms: [] as string[],
  contentTypes: [] as string[],
  postingFrequency: 'weekly'
})

const handleSaveDraft = () => {
  if (!campaignData.value.name || !campaignData.value.startDate || !campaignData.value.endDate) {
    notify.warning('Validation Error', 'Please fill in all required fields before saving draft.')
    return
  }
  notify.success('Draft Saved', 'Campaign draft has been saved successfully!')
  emit('saveDraft', campaignData.value)
  close()
}

const handleCreateCampaign = () => {
  if (!campaignData.value.name || !campaignData.value.startDate || !campaignData.value.endDate || !campaignData.value.budget) {
    notify.warning('Validation Error', 'Please fill in all required fields to create the campaign.')
    return
  }
  if (campaignData.value.platforms.length === 0) {
    notify.warning('Validation Error', 'Please select at least one platform for the campaign.')
    return
  }
  notify.success('Campaign Created', 'Marketing campaign has been created successfully!')
  emit('create', campaignData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>