<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Probation Review Management</h2>
          <p class="text-brand-teal mt-1">Conduct and track employee probation period reviews</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Employee Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Employee Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
              <input
                v-model="probationData.employeeName"
                type="text"
                placeholder="Enter employee name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                v-model="probationData.employeeId"
                type="text"
                placeholder="Enter employee ID"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="probationData.department"
                type="text"
                placeholder="Enter department"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                v-model="probationData.position"
                type="text"
                placeholder="Enter position"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
              <input
                v-model="probationData.hireDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Probation Period (months)</label>
              <select
                v-model="probationData.probationPeriod"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Review Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Review Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Review Date</label>
              <input
                v-model="probationData.reviewDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Review Type</label>
              <select
                v-model="probationData.reviewType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="30-day">30-day review</option>
                <option value="60-day">60-day review</option>
                <option value="90-day">90-day review</option>
                <option value="6-month">6-month review</option>
                <option value="Final">Final review</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reviewer</label>
              <input
                v-model="probationData.reviewer"
                type="text"
                placeholder="Enter reviewer name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Review Status</label>
              <select
                v-model="probationData.reviewStatus"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Performance Evaluation -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Performance Evaluation</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Overall Performance Rating</label>
              <div class="grid grid-cols-5 gap-2">
                <label class="flex items-center justify-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-brand-teal bg-brand-teal/5': probationData.overallRating === '1' }">
                  <input v-model="probationData.overallRating" type="radio" value="1" class="sr-only" />
                  <span class="text-sm font-medium">1 - Poor</span>
                </label>
                <label class="flex items-center justify-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-brand-teal bg-brand-teal/5': probationData.overallRating === '2' }">
                  <input v-model="probationData.overallRating" type="radio" value="2" class="sr-only" />
                  <span class="text-sm font-medium">2 - Below Average</span>
                </label>
                <label class="flex items-center justify-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-brand-teal bg-brand-teal/5': probationData.overallRating === '3' }">
                  <input v-model="probationData.overallRating" type="radio" value="3" class="sr-only" />
                  <span class="text-sm font-medium">3 - Meets Expectations</span>
                </label>
                <label class="flex items-center justify-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-brand-teal bg-brand-teal/5': probationData.overallRating === '4' }">
                  <input v-model="probationData.overallRating" type="radio" value="4" class="sr-only" />
                  <span class="text-sm font-medium">4 - Above Average</span>
                </label>
                <label class="flex items-center justify-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-brand-teal bg-brand-teal/5': probationData.overallRating === '5' }">
                  <input v-model="probationData.overallRating" type="radio" value="5" class="sr-only" />
                  <span class="text-sm font-medium">5 - Excellent</span>
                </label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Job Knowledge</label>
                <select
                  v-model="probationData.jobKnowledge"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Below Average</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="4">4 - Above Average</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Work Quality</label>
                <select
                  v-model="probationData.workQuality"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Below Average</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="4">4 - Above Average</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Attendance</label>
                <select
                  v-model="probationData.attendance"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Below Average</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="4">4 - Above Average</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Teamwork</label>
                <select
                  v-model="probationData.teamwork"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Below Average</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="4">4 - Above Average</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Outcome -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Review Outcome</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-green-500 bg-green-50': probationData.recommendation === 'Pass' }">
                  <input v-model="probationData.recommendation" type="radio" value="Pass" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                  <span class="ml-2 text-sm font-medium text-green-700">Pass Probation</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-yellow-500 bg-yellow-50': probationData.recommendation === 'Extend' }">
                  <input v-model="probationData.recommendation" type="radio" value="Extend" class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300" />
                  <span class="ml-2 text-sm font-medium text-yellow-700">Extend Probation</span>
                </label>
                <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50" :class="{ 'border-red-500 bg-red-50': probationData.recommendation === 'Fail' }">
                  <input v-model="probationData.recommendation" type="radio" value="Fail" class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" />
                  <span class="ml-2 text-sm font-medium text-red-700">Fail Probation</span>
                </label>
              </div>
            </div>
            
            <div v-if="probationData.recommendation === 'Extend'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Extension Period (months)</label>
              <select
                v-model="probationData.extensionPeriod"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="1">1 month</option>
                <option value="2">2 months</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
              <textarea
                v-model="probationData.strengths"
                rows="3"
                placeholder="List employee strengths and positive contributions"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement</label>
              <textarea
                v-model="probationData.improvementAreas"
                rows="3"
                placeholder="List areas where the employee needs to improve"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
              <textarea
                v-model="probationData.comments"
                rows="3"
                placeholder="Enter any additional comments or notes"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
        <button
          @click="close"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveDraft"
          class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300"
        >
          Save Draft
        </button>
        <button
          @click="submitReview"
          class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
        >
          Submit Review
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

interface Props {
  isOpen: boolean
}

interface ProbationData {
  employeeName: string
  employeeId: string
  department: string
  position: string
  hireDate: string
  probationPeriod: string
  reviewDate: string
  reviewType: string
  reviewer: string
  reviewStatus: string
  overallRating: string
  jobKnowledge: string
  workQuality: string
  attendance: string
  teamwork: string
  recommendation: string
  extensionPeriod: string
  strengths: string
  improvementAreas: string
  comments: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [data: ProbationData]
  saveDraft: [data: ProbationData]
}>()

const probationData = ref<ProbationData>({
  employeeName: '',
  employeeId: '',
  department: '',
  position: '',
  hireDate: '',
  probationPeriod: '6',
  reviewDate: '',
  reviewType: '',
  reviewer: '',
  reviewStatus: 'Scheduled',
  overallRating: '',
  jobKnowledge: '',
  workQuality: '',
  attendance: '',
  teamwork: '',
  recommendation: '',
  extensionPeriod: '',
  strengths: '',
  improvementAreas: '',
  comments: ''
})

const submitReview = () => {
  if (!probationData.value.employeeName || !probationData.value.reviewDate || !probationData.value.recommendation) {
    notify.warning('Validation Error', 'Please fill in all required fields')
    return
  }
  
  console.log('Submitting probation review:', probationData.value)
  notify.success('Review Submitted', 'Probation review has been submitted successfully!')
  emit('submit', probationData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving probation review draft:', probationData.value)
  notify.success('Draft Saved', 'Probation review draft has been saved!')
  emit('saveDraft', probationData.value)
  close()
}

const close = () => {
  emit('close')
}
</script>
