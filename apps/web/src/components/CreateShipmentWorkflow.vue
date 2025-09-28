<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Create New Shipment</h2>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Shipment Number</label>
                <input
                  v-model="formData.shipmentNumber"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Auto-generated"
                  readonly
                />
      </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bill of Lading</label>
              <input 
                  v-model="formData.billOfLading"
                type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter B/L number"
                  required
              />
              </div>
            </div>

            <!-- Origin and Destination -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Route Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Origin Port</label>
              <select 
                    v-model="formData.origin"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  >
                    <option value="">Select Origin Port</option>
                    <option v-for="port in ports" :key="port.code" :value="port.code">{{ port.name }} ({{ port.code }})</option>
              </select>
          </div>

            <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Destination Port</label>
              <select 
                    v-model="formData.destination"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  >
                    <option value="">Select Destination Port</option>
                    <option v-for="port in ports" :key="port.code" :value="port.code">{{ port.name }} ({{ port.code }})</option>
              </select>
            </div>
              </div>
          </div>

            <!-- Shipping Details -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Shipping Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
                  <select
                    v-model="formData.carrier"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  >
                    <option value="">Select Carrier</option>
                    <option v-for="carrier in carriers" :key="carrier.id" :value="carrier.name">{{ carrier.name }}</option>
                  </select>
        </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Vessel Name</label>
                  <input 
                    v-model="formData.vesselName"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Enter vessel name"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ETD (Estimated Time of Departure)</label>
                    <input 
                    v-model="formData.etd"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>

                  <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ETA (Estimated Time of Arrival)</label>
                    <input 
                    v-model="formData.eta"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Cargo Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Cargo Information</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cargo Type</label>
                    <select
                      v-model="formData.cargoType"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    >
                      <option value="">Select Cargo Type</option>
                      <option value="DRY">Dry Cargo</option>
                      <option value="REEFER">Reefer</option>
                      <option value="BULK">Bulk</option>
                      <option value="HAZMAT">Hazardous</option>
                    </select>
                  </div>

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

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cargo Description</label>
                  <textarea
                    v-model="formData.cargoDescription"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Describe the cargo being shipped..."
                  ></textarea>
            </div>
          </div>
        </div>

            <!-- Container Information -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Container Information</h3>
              <div class="space-y-4">
                <div v-for="(container, index) in formData.containers" :key="index" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="font-medium text-gray-900">Container {{ index + 1 }}</h4>
                    <button
                      type="button"
                      @click="removeContainer(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <X class="h-4 w-4" />
                    </button>
          </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Container Number</label>
              <input 
                        v-model="container.number"
                type="text" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="MSKU1234567"
              />
          </div>

          <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                        v-model="container.type"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      >
                        <option value="DRY">Dry</option>
                        <option value="REEFER">Reefer</option>
                        <option value="TANK">Tank</option>
                        <option value="FLAT">Flat</option>
              </select>
            </div>

            <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select 
                        v-model="container.size"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      >
                        <option value="20">20ft</option>
                        <option value="40">40ft</option>
                        <option value="45">45ft</option>
              </select>
                    </div>
            </div>
          </div>

                <button
                  type="button"
                  @click="addContainer"
                  class="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                >
                  + Add Container
                </button>
            </div>
          </div>

            <!-- Additional Options -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div class="space-y-4">
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
                    v-model="formData.requiresInsurance"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Requires cargo insurance</label>
        </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.isHazardous"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Hazardous materials</label>
                </div>

              <div>
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
            Create Shipment
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
  number: string
  type: string
  size: string
}

interface Shipment {
  shipmentNumber: string
  billOfLading: string
  origin: string
  destination: string
  carrier: string
  vesselName: string
  etd: string
  eta: string
  cargoType: string
  weight: number
  volume: number
  cargoDescription: string
  containers: Container[]
  requiresCustoms: boolean
  requiresInsurance: boolean
  isHazardous: boolean
  specialInstructions: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Shipment]
  saveDraft: [data: Shipment]
}>()

const formData = reactive<Shipment>({
  shipmentNumber: `SH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  billOfLading: '',
  origin: '',
  destination: '',
  carrier: '',
  vesselName: '',
  etd: '',
  eta: '',
  cargoType: '',
  weight: 0,
  volume: 0,
  cargoDescription: '',
  containers: [{ number: '', type: 'DRY', size: '20' }],
  requiresCustoms: false,
  requiresInsurance: false,
  isHazardous: false,
  specialInstructions: ''
})

const ports = [
  { code: 'CNSHA', name: 'Shanghai' },
  { code: 'USLAX', name: 'Los Angeles' },
  { code: 'DEHAM', name: 'Hamburg' },
  { code: 'USNYC', name: 'New York' },
  { code: 'SGSIN', name: 'Singapore' },
  { code: 'NLRTM', name: 'Rotterdam' },
  { code: 'CNQIN', name: 'Qingdao' },
  { code: 'KRINC', name: 'Incheon' },
  { code: 'JPYOK', name: 'Yokohama' },
  { code: 'GBFXT', name: 'Felixstowe' }
]

const carriers = [
  { id: '1', name: 'Maersk' },
  { id: '2', name: 'MSC' },
  { id: '3', name: 'CMA CGM' },
  { id: '4', name: 'COSCO' },
  { id: '5', name: 'Hapag-Lloyd' },
  { id: '6', name: 'ONE' },
  { id: '7', name: 'Evergreen' },
  { id: '8', name: 'Yang Ming' }
]

const addContainer = () => {
  formData.containers.push({ number: '', type: 'DRY', size: '20' })
}

const removeContainer = (index: number) => {
  if (formData.containers.length > 1) {
    formData.containers.splice(index, 1)
  }
}

const handleSubmit = () => {
  const shipmentData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('submit', shipmentData)
}

const handleSaveDraft = () => {
  const shipmentData = {
    ...formData,
    id: Date.now().toString()
  }
  emit('saveDraft', shipmentData)
}

const close = () => {
  // Reset form
  Object.assign(formData, {
    shipmentNumber: `SH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    billOfLading: '',
    origin: '',
    destination: '',
      carrier: '',
    vesselName: '',
    etd: '',
    eta: '',
    cargoType: '',
    weight: 0,
    volume: 0,
    cargoDescription: '',
    containers: [{ number: '', type: 'DRY', size: '20' }],
    requiresCustoms: false,
    requiresInsurance: false,
    isHazardous: false,
    specialInstructions: ''
  })
  emit('close')
}
</script>