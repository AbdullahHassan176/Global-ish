<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Generate Invoice</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Invoice Header -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input
                  v-model="formData.invoiceNumber"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="INV-2024-001"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                <input
                  v-model="formData.invoiceDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>
            </div>

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

            <!-- Client Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    v-model="formData.clientName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Client Company Name"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Client Contact</label>
                  <input
                    v-model="formData.clientContact"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Contact Person"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Client Address</label>
                  <textarea
                    v-model="formData.clientAddress"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Client billing address"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
                  <input
                    v-model="formData.clientEmail"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="client@company.com"
                  />
                </div>
              </div>
            </div>

            <!-- Service Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Service Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    v-model="formData.serviceType"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  >
                    <option value="">Select Service</option>
                    <option value="FREIGHT">Freight Services</option>
                    <option value="CUSTOMS">Customs Clearance</option>
                    <option value="WAREHOUSE">Warehouse Services</option>
                    <option value="TRUCKING">Trucking Services</option>
                    <option value="HANDLING">Cargo Handling</option>
                    <option value="STORAGE">Storage Services</option>
                    <option value="INSURANCE">Insurance</option>
                    <option value="DOCUMENTATION">Documentation</option>
                    <option value="CONSULTING">Consulting</option>
                    <option value="OTHER">Other Services</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Service Period</label>
                  <input
                    v-model="formData.servicePeriod"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="e.g., January 2024, Q1 2024"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
                <textarea
                  v-model="formData.serviceDescription"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Detailed description of services provided"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Line Items -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Line Items</h3>
              <div class="space-y-4">
                <div v-for="(item, index) in formData.lineItems" :key="index" class="grid grid-cols-12 gap-4 items-end">
                  <div class="col-span-5">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      v-model="item.description"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Service description"
                      required
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      v-model="item.quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      required
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                    <input
                      v-model="item.unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      required
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Total</label>
                    <input
                      :value="(item.quantity * item.unitPrice).toFixed(2)"
                      type="text"
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div class="col-span-1">
                    <button
                      type="button"
                      @click="removeLineItem(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  @click="addLineItem"
                  class="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                >
                  + Add Line Item
                </button>
              </div>
            </div>

            <!-- Tax and Discounts -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Tax and Discounts</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    v-model="formData.taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Discount Amount</label>
                  <input
                    v-model="formData.discountAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    v-model="formData.discountType"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="FIXED">Fixed Amount</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Instructions</label>
                <textarea
                  v-model="formData.paymentInstructions"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Special payment instructions or bank details"
                ></textarea>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.sendEmail"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send invoice via email</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.includeAttachments"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Include supporting documents</label>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    v-model="formData.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Any additional notes or terms..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Invoice Summary -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-medium">{{ subtotal.toFixed(2) }} {{ formData.currency }}</span>
                  </div>
                  <div v-if="formData.discountAmount > 0" class="flex justify-between">
                    <span class="text-gray-600">Discount:</span>
                    <span class="font-medium">-{{ discountAmount.toFixed(2) }} {{ formData.currency }}</span>
                  </div>
                  <div v-if="formData.taxRate > 0" class="flex justify-between">
                    <span class="text-gray-600">Tax ({{ formData.taxRate }}%):</span>
                    <span class="font-medium">{{ taxAmount.toFixed(2) }} {{ formData.currency }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{{ totalAmount.toFixed(2) }} {{ formData.currency }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handlePreview"
              class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
            >
              Preview
            </button>
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X } from 'lucide-vue-next'

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
}

interface Invoice {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  currency: string
  clientName: string
  clientContact: string
  clientAddress: string
  clientEmail: string
  serviceType: string
  servicePeriod: string
  serviceDescription: string
  lineItems: LineItem[]
  taxRate: number
  discountAmount: number
  discountType: string
  paymentTerms: string
  paymentMethod: string
  paymentInstructions: string
  sendEmail: boolean
  includeAttachments: boolean
  notes: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Invoice]
  saveDraft: [data: Invoice]
  preview: [data: Invoice]
}>()

const formData = reactive<Invoice>({
  invoiceNumber: '',
  invoiceDate: '',
  dueDate: '',
  currency: 'USD',
  clientName: '',
  clientContact: '',
  clientAddress: '',
  clientEmail: '',
  serviceType: '',
  servicePeriod: '',
  serviceDescription: '',
  lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
  taxRate: 0,
  discountAmount: 0,
  discountType: 'FIXED',
  paymentTerms: 'NET_30',
  paymentMethod: 'WIRE_TRANSFER',
  paymentInstructions: '',
  sendEmail: true,
  includeAttachments: false,
  notes: ''
})

const subtotal = computed(() => {
  return formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
})

const discountAmount = computed(() => {
  if (formData.discountType === 'PERCENTAGE') {
    return (subtotal.value * formData.discountAmount) / 100
  }
  return formData.discountAmount
})

const taxAmount = computed(() => {
  const taxableAmount = subtotal.value - discountAmount.value
  return (taxableAmount * formData.taxRate) / 100
})

const totalAmount = computed(() => {
  return subtotal.value - discountAmount.value + taxAmount.value
})

const addLineItem = () => {
  formData.lineItems.push({ description: '', quantity: 1, unitPrice: 0 })
}

const removeLineItem = (index: number) => {
  if (formData.lineItems.length > 1) {
    formData.lineItems.splice(index, 1)
  }
}

const handleSubmit = () => {
  const invoiceData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', invoiceData)
}

const handleSaveDraft = () => {
  const invoiceData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', invoiceData)
}

const handlePreview = () => {
  const invoiceData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('preview', invoiceData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    currency: 'USD',
    clientName: '',
    clientContact: '',
    clientAddress: '',
    clientEmail: '',
    serviceType: '',
    servicePeriod: '',
    serviceDescription: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    discountAmount: 0,
    discountType: 'FIXED',
    paymentTerms: 'NET_30',
    paymentMethod: 'WIRE_TRANSFER',
    paymentInstructions: '',
    sendEmail: true,
    includeAttachments: false,
    notes: ''
  })
  emit('close')
}
</script>
