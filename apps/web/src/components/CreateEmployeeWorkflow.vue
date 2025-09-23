<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-5xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Add New Employee</h2>
          <p class="text-brand-teal mt-1">Complete employee onboarding with personal, professional, and financial information</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Personal Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">First Name</label>
              <input 
                v-model="employeeData.firstName"
                type="text" 
                placeholder="Enter first name"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Last Name</label>
              <input 
                v-model="employeeData.lastName"
                type="text" 
                placeholder="Enter last name"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Email</label>
              <input 
                v-model="employeeData.email"
                type="email" 
                placeholder="Enter email address"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Phone</label>
              <input 
                v-model="employeeData.phone"
                type="tel" 
                placeholder="Enter phone number"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Date of Birth</label>
              <input 
                v-model="employeeData.dateOfBirth"
                type="date" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Address</label>
              <input 
                v-model="employeeData.address"
                type="text" 
                placeholder="Enter address"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Professional Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Professional Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Employee ID</label>
              <input 
                v-model="employeeData.employeeId"
                type="text" 
                placeholder="Enter employee ID"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Department</label>
              <select 
                v-model="employeeData.department"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select department</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="engineering">Engineering</option>
                <option value="operations">Operations</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Position</label>
              <input 
                v-model="employeeData.position"
                type="text" 
                placeholder="Enter job position"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Manager</label>
              <select 
                v-model="employeeData.manager"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select manager</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="mike-wilson">Mike Wilson</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Start Date</label>
              <input 
                v-model="employeeData.startDate"
                type="date" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Employment Type</label>
              <select 
                v-model="employeeData.employmentType"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select employment type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Financial Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Financial Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Salary</label>
              <input 
                v-model="employeeData.salary"
                type="number" 
                placeholder="Enter annual salary"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Pay Frequency</label>
              <select 
                v-model="employeeData.payFrequency"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select pay frequency</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Bank Account</label>
              <input 
                v-model="employeeData.bankAccount"
                type="text" 
                placeholder="Enter bank account number"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Tax ID</label>
              <input 
                v-model="employeeData.taxId"
                type="text" 
                placeholder="Enter tax ID"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Benefits & Permissions -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Benefits & Permissions</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Benefits Package</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.benefits.health"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Health Insurance</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.benefits.dental"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Dental</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.benefits.vision"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Vision</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.benefits.retirement"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">401k</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">System Access</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.permissions.admin"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Admin Access</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.permissions.finance"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Finance</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.permissions.hr"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">HR</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="employeeData.permissions.reports"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Reports</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Employee will be added to the system and onboarding process will begin
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="addEmployee" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Add Employee
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

const employeeData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  employeeId: '',
  department: '',
  position: '',
  manager: '',
  startDate: '',
  employmentType: '',
  salary: '',
  payFrequency: '',
  bankAccount: '',
  taxId: '',
  benefits: {
    health: false,
    dental: false,
    vision: false,
    retirement: false
  },
  permissions: {
    admin: false,
    finance: false,
    hr: false,
    reports: false
  }
})

const addEmployee = () => {
  if (!employeeData.value.firstName || !employeeData.value.lastName || !employeeData.value.email) {
    alert('Please fill in all required fields')
    return
  }
  
  console.log('Adding employee:', employeeData.value)
  emit('submit', employeeData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving employee draft:', employeeData.value)
  alert('Employee draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  employeeData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    employeeId: '',
    department: '',
    position: '',
    manager: '',
    startDate: '',
    employmentType: '',
    salary: '',
    payFrequency: '',
    bankAccount: '',
    taxId: '',
    benefits: {
      health: false,
      dental: false,
      vision: false,
      retirement: false
    },
    permissions: {
      admin: false,
      finance: false,
      hr: false,
      reports: false
    }
  }
}
</script>
