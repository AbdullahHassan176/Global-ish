<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Add Cost Item</h2>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Cost Item Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="e.g., Ocean Freight, Customs Clearance"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cost Type</label>
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="FREIGHT">Freight</option>
                  <option value="CUSTOMS">Customs</option>
                  <option value="WAREHOUSE">Warehouse</option>
                  <option value="TRUCKING">Trucking</option>
                  <option value="HANDLING">Handling</option>
                  <option value="STORAGE">Storage</option>
                  <option value="INSURANCE">Insurance</option>
                  <option value="DOCUMENTATION">Documentation</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    v-model="formData.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  v-model="formData.currency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CNY">CNY</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            <!-- Vendor Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Vendor Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                  <input
                    v-model="formData.vendor"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="e.g., Maersk Line, DHL Express"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Vendor Contact</label>
                  <input
                    v-model="formData.vendorContact"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Contact person or department"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Vendor Email</label>
                  <input
                    v-model="formData.vendorEmail"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="vendor@company.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Vendor Phone</label>
                  <input
                    v-model="formData.vendorPhone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <!-- Associated Shipment -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Associated Shipment</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Shipment Number</label>
                  <input
                    v-model="formData.shipmentNumber"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="SH-2024-001"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Container Number</label>
                  <input
                    v-model="formData.containerNumber"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="MSKU1234567"
                  />
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    v-model="formData.dueDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                  <select
                    v-model="formData.paymentTerms"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="NET_15">Net 15</option>
                    <option value="NET_30">Net 30</option>
                    <option value="NET_45">Net 45</option>
                    <option value="NET_60">Net 60</option>
                    <option value="IMMEDIATE">Immediate</option>
                    <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    v-model="formData.paymentMethod"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="WIRE_TRANSFER">Wire Transfer</option>
                    <option value="CHECK">Check</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="CASH">Cash</option>
                    <option value="LETTER_OF_CREDIT">Letter of Credit</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                  <input
                    v-model="formData.invoiceNumber"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="INV-2024-001"
                  />
                </div>
              </div>
            </div>

            <!-- Cost Breakdown -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
              <div class="space-y-4">
                <div v-for="(item, index) in formData.breakdown" :key="index" class="flex items-center space-x-4">
                  <div class="flex-1">
                    <input
                      v-model="item.description"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Description"
                    />
                  </div>
                  <div class="w-32">
                    <input
                      v-model="item.amount"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    type="button"
                    @click="removeBreakdownItem(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="addBreakdownItem"
                  class="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                >
                  + Add Breakdown Item
                </button>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.isRecurring"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Recurring cost</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresApproval"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Requires approval</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.isTaxable"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Taxable</label>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    v-model="formData.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Any additional notes or comments..."
                  ></textarea>
                </div>
              </div>
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
              Add Cost Item
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

interface BreakdownItem {
  description: string
  amount: number
}

interface Cost {
  name: string
  type: string
  amount: number
  currency: string
  vendor: string
  vendorContact: string
  vendorEmail: string
  vendorPhone: string
  shipmentNumber: string
  containerNumber: string
  dueDate: string
  paymentTerms: string
  paymentMethod: string
  invoiceNumber: string
  breakdown: BreakdownItem[]
  isRecurring: boolean
  requiresApproval: boolean
  isTaxable: boolean
  notes: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Cost]
  saveDraft: [data: Cost]
}>()

const formData = reactive<Cost>({
  name: '',
  type: '',
  amount: 0,
  currency: 'USD',
  vendor: '',
  vendorContact: '',
  vendorEmail: '',
  vendorPhone: '',
  shipmentNumber: '',
  containerNumber: '',
  dueDate: '',
  paymentTerms: 'NET_30',
  paymentMethod: 'WIRE_TRANSFER',
  invoiceNumber: '',
  breakdown: [{ description: '', amount: 0 }],
  isRecurring: false,
  requiresApproval: true,
  isTaxable: true,
  notes: ''
})

const addBreakdownItem = () => {
  formData.breakdown.push({ description: '', amount: 0 })
}

const removeBreakdownItem = (index: number) => {
  if (formData.breakdown.length > 1) {
    formData.breakdown.splice(index, 1)
  }
}

const handleSubmit = () => {
  const costData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', costData)
}

const handleSaveDraft = () => {
  const costData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', costData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    name: '',
    type: '',
    amount: 0,
    currency: 'USD',
    vendor: '',
    vendorContact: '',
    vendorEmail: '',
    vendorPhone: '',
    shipmentNumber: '',
    containerNumber: '',
    dueDate: '',
    paymentTerms: 'NET_30',
    paymentMethod: 'WIRE_TRANSFER',
    invoiceNumber: '',
    breakdown: [{ description: '', amount: 0 }],
    isRecurring: false,
    requiresApproval: true,
    isTaxable: true,
    notes: ''
  })
  emit('close')
}
</script>
