<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Add New Container</h2>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Container Number</label>
                <input
                  v-model="formData.containerNumber"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="MSKU1234567"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Container Type</label>
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="DRY">Dry Container</option>
                  <option value="REEFER">Reefer Container</option>
                  <option value="TANK">Tank Container</option>
                  <option value="FLAT">Flat Rack</option>
                  <option value="OPEN_TOP">Open Top</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  v-model="formData.size"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Size</option>
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
                  required
                >
                  <option value="">Select Status</option>
                  <option value="EMPTY">Empty</option>
                  <option value="LOADED">Loaded</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="AT_TERMINAL">At Terminal</option>
                  <option value="AT_CUSTOMS">At Customs</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>

            <!-- Location Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                  <input
                    v-model="formData.location"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="e.g., Shanghai Port, Pacific Ocean"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Terminal</label>
                  <input
                    v-model="formData.terminal"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Terminal name"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Coordinates (Latitude)</label>
                  <input
                    v-model="formData.latitude"
                    type="number"
                    step="0.000001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="31.2304"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Coordinates (Longitude)</label>
                  <input
                    v-model="formData.longitude"
                    type="number"
                    step="0.000001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="121.4737"
                  />
                </div>
              </div>
            </div>

            <!-- Cargo Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Cargo Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    v-model="formData.weight"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Volume (m³)</label>
                  <input
                    v-model="formData.volume"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Cargo Description</label>
                <textarea
                  v-model="formData.cargoDescription"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Describe the cargo being transported..."
                ></textarea>
              </div>
            </div>

            <!-- Reefer Settings (if applicable) -->
            <div v-if="formData.type === 'REEFER'" class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Reefer Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Set Temperature (°C)</label>
                  <input
                    v-model="formData.temperature"
                    type="number"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="-18"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                  <input
                    v-model="formData.humidity"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="85"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Reefer Status</label>
                <select
                  v-model="formData.reeferStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="RUNNING">Running</option>
                  <option value="STOPPED">Stopped</option>
                  <option value="ALARM">Alarm</option>
                  <option value="OFF">Off</option>
                </select>
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bill of Lading</label>
                  <input
                    v-model="formData.billOfLading"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="MAEU123456789"
                  />
                </div>
              </div>
            </div>

            <!-- Additional Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.isHazardous"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Hazardous materials</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresCustoms"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Requires customs clearance</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.requiresInspection"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Requires inspection</label>
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  v-model="formData.specialInstructions"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Any special handling instructions or requirements..."
                ></textarea>
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
              Add Container
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

interface Container {
  containerNumber: string
  type: string
  size: string
  status: string
  location: string
  terminal: string
  latitude: number
  longitude: number
  weight: number
  volume: number
  cargoDescription: string
  temperature: number
  humidity: number
  reeferStatus: string
  shipmentNumber: string
  billOfLading: string
  isHazardous: boolean
  requiresCustoms: boolean
  requiresInspection: boolean
  specialInstructions: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Container]
  saveDraft: [data: Container]
}>()

const formData = reactive<Container>({
  containerNumber: '',
  type: '',
  size: '',
  status: '',
  location: '',
  terminal: '',
  latitude: 0,
  longitude: 0,
  weight: 0,
  volume: 0,
  cargoDescription: '',
  temperature: 0,
  humidity: 0,
  reeferStatus: 'RUNNING',
  shipmentNumber: '',
  billOfLading: '',
  isHazardous: false,
  requiresCustoms: false,
  requiresInspection: false,
  specialInstructions: ''
})

const handleSubmit = () => {
  const containerData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', containerData)
}

const handleSaveDraft = () => {
  const containerData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', containerData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    containerNumber: '',
    type: '',
    size: '',
    status: '',
    location: '',
    terminal: '',
    latitude: 0,
    longitude: 0,
    weight: 0,
    volume: 0,
    cargoDescription: '',
    temperature: 0,
    humidity: 0,
    reeferStatus: 'RUNNING',
    shipmentNumber: '',
    billOfLading: '',
    isHazardous: false,
    requiresCustoms: false,
    requiresInspection: false,
    specialInstructions: ''
  })
  emit('close')
}
</script>
