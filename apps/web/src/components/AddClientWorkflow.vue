<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Add New Client</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  v-model="formData.industry"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="">Select Industry</option>
                  <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
                </select>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    v-model="formData.contactPerson"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    v-model="formData.jobTitle"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="e.g., CEO, Project Manager"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="contact@company.com"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    v-model="formData.streetAddress"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="123 Main Street"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      v-model="formData.city"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      v-model="formData.state"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                    <input
                      v-model="formData.zipCode"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    v-model="formData.country"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="">Select Country</option>
                    <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Business Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <select
                    v-model="formData.companySize"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    v-model="formData.website"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="https://www.company.com"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Brief description of the company and its business..."
                ></textarea>
              </div>
            </div>

            <!-- Project Preferences -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Project Preferences</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Project Types</label>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div v-for="type in projectTypes" :key="type" class="flex items-center">
                      <input
                        v-model="formData.preferredProjectTypes"
                        :value="type"
                        type="checkbox"
                        class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <label class="ml-2 text-sm text-gray-700">{{ type }}</label>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <select
                      v-model="formData.budgetRange"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="">Select Budget Range</option>
                      <option value="under-10k">Under $10,000</option>
                      <option value="10k-50k">$10,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-500k">$100,000 - $500,000</option>
                      <option value="500k+">$500,000+</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Timeline Preference</label>
                    <select
                      v-model="formData.timelinePreference"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="">Select Timeline</option>
                      <option value="urgent">Urgent (1-2 months)</option>
                      <option value="standard">Standard (3-6 months)</option>
                      <option value="flexible">Flexible (6+ months)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Active client (ready for projects)</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.sendNewsletters"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send newsletters and updates</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresNDA"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Requires NDA for projects</label>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                v-model="formData.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Any additional notes about this client..."
              ></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'

interface Client {
  id: string
  name: string
  industry: string
  contactPerson: string
  jobTitle: string
  email: string
  phone: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  companySize: string
  website: string
  description: string
  preferredProjectTypes: string[]
  budgetRange: string
  timelinePreference: string
  isActive: boolean
  sendNewsletters: boolean
  requiresNDA: boolean
  notes: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Client]
  saveDraft: [data: Client]
}>()

const formData = reactive<Client>({
  id: '',
  name: '',
  industry: '',
  contactPerson: '',
  jobTitle: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  companySize: '',
  website: '',
  description: '',
  preferredProjectTypes: [],
  budgetRange: '',
  timelinePreference: '',
  isActive: true,
  sendNewsletters: true,
  requiresNDA: false,
  notes: ''
})

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
  'Manufacturing', 'Real Estate', 'Consulting', 'Media', 'Government',
  'Non-profit', 'Other'
]

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Australia', 'Japan', 'China', 'India', 'Brazil', 'Other'
]

const projectTypes = [
  'Web Development', 'Mobile Development', 'Design', 'Consulting',
  'Maintenance', 'E-commerce', 'API Development', 'Data Analysis',
  'Cloud Migration', 'Security Audit'
]

const handleSubmit = () => {
  const clientData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', clientData)
}

const handleSaveDraft = () => {
  const clientData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', clientData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    id: '',
    name: '',
    industry: '',
    contactPerson: '',
    jobTitle: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    companySize: '',
    website: '',
    description: '',
    preferredProjectTypes: [],
    budgetRange: '',
    timelinePreference: '',
    isActive: true,
    sendNewsletters: true,
    requiresNDA: false,
    notes: ''
  })
  emit('close')
}
</script>
