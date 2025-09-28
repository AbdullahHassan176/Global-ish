<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Edit {{ itemType }}</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Shipment Edit Form -->
            <div v-if="itemType === 'shipment'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Shipment Number</label>
                  <input
                    v-model="formData.shipmentNumber"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    readonly
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bill of Lading</label>
                  <input
                    v-model="formData.billOfLading"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <input
                    v-model="formData.origin"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    v-model="formData.destination"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
                  <select
                    v-model="formData.carrier"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="Maersk">Maersk</option>
                    <option value="MSC">MSC</option>
                    <option value="CMA CGM">CMA CGM</option>
                    <option value="DHL">DHL</option>
                    <option value="FedEx">FedEx</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    v-model="formData.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="BOOKED">Booked</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="AT_ORIGIN">At Origin</option>
                    <option value="DEPARTED">Departed</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ETD</label>
                  <input
                    v-model="formData.etd"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ETA</label>
                  <input
                    v-model="formData.eta"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>
              </div>
            </div>

            <!-- Container Edit Form -->
            <div v-if="itemType === 'container'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Container Number</label>
                  <input
                    v-model="formData.containerNumber"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    v-model="formData.type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="DRY">Dry</option>
                    <option value="REEFER">Reefer</option>
                    <option value="TANK">Tank</option>
                    <option value="FLAT">Flat</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    v-model="formData.size"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="20">20ft</option>
                    <option value="40">40ft</option>
                    <option value="45">45ft</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    v-model="formData.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="EMPTY">Empty</option>
                    <option value="LOADED">Loaded</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="AT_TERMINAL">At Terminal</option>
                    <option value="AT_CUSTOMS">At Customs</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    v-model="formData.location"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    v-model="formData.weight"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>
              </div>
            </div>

            <!-- Cost Edit Form -->
            <div v-if="itemType === 'cost'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cost Item</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    v-model="formData.type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="FREIGHT">Freight</option>
                    <option value="CUSTOMS">Customs</option>
                    <option value="WAREHOUSE">Warehouse</option>
                    <option value="TRUCKING">Trucking</option>
                    <option value="HANDLING">Handling</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    v-model="formData.amount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    v-model="formData.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PAID">Paid</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                  <input
                    v-model="formData.vendor"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    v-model="formData.dueDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>
              </div>
            </div>

            <!-- Alert Edit Form -->
            <div v-if="itemType === 'alert'" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  v-model="formData.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  v-model="formData.message"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    v-model="formData.severity"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    v-model="formData.type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="DELAY">Delay</option>
                    <option value="ETA_CHANGE">ETA Change</option>
                    <option value="FREE_TIME_EXPIRY">Free Time Expiry</option>
                    <option value="DEMURRAGE_RISK">Demurrage Risk</option>
                    <option value="CUSTOMS_ISSUE">Customs Issue</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Container Number</label>
                  <input
                    v-model="formData.containerNumber"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    v-model="formData.location"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  />
                </div>
              </div>
            </div>

            <!-- Additional Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                v-model="formData.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                placeholder="Add any additional notes..."
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
              Update {{ itemType }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  item?: any
  itemType?: 'shipment' | 'container' | 'cost' | 'alert'
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
  saveDraft: [data: any]
}>()

const formData = reactive({
  // Shipment fields
  shipmentNumber: '',
  billOfLading: '',
  origin: '',
  destination: '',
  carrier: '',
  status: '',
  etd: '',
  eta: '',
  vesselName: '',
  
  // Container fields
  containerNumber: '',
  type: '',
  size: '',
  location: '',
  weight: 0,
  
  // Cost fields
  name: '',
  amount: 0,
  vendor: '',
  dueDate: '',
  
  // Alert fields
  title: '',
  message: '',
  severity: '',
  type: '',
  
  // Common fields
  notes: ''
})

// Watch for item changes and populate form
watch(() => props.item, (newItem) => {
  if (newItem) {
    Object.assign(formData, {
      ...newItem,
      // Ensure proper data types
      amount: newItem.amount || 0,
      weight: newItem.weight || 0
    })
  }
}, { immediate: true })

const handleSubmit = () => {
  const updateData = {
    ...formData,
    id: props.item?.id || Date.now().toString()
  }
  emit('submit', updateData)
}

const handleSaveDraft = () => {
  const draftData = {
    ...formData,
    id: props.item?.id || Date.now().toString()
  }
  emit('saveDraft', draftData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    shipmentNumber: '',
    billOfLading: '',
    origin: '',
    destination: '',
    carrier: '',
    status: '',
    etd: '',
    eta: '',
    vesselName: '',
    containerNumber: '',
    type: '',
    size: '',
    location: '',
    weight: 0,
    name: '',
    amount: 0,
    vendor: '',
    dueDate: '',
    title: '',
    message: '',
    severity: '',
    type: '',
    notes: ''
  })
  emit('close')
}
</script>
