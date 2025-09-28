<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Track Shipment</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-6">
          <!-- Search Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">Track by Shipment Number or Container Number</label>
                <input
                  v-model="trackingNumber"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="Enter shipment or container number"
                />
              </div>
              <button @click="searchTracking" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center">
                <Search class="h-4 w-4 mr-2" />
                Track
              </button>
            </div>
          </div>

          <!-- Shipment Information -->
          <div v-if="shipmentData" class="space-y-6">
            <!-- Shipment Header -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ shipmentData.shipmentNumber }}</h3>
                  <p class="text-sm text-gray-600">{{ shipmentData.billOfLading }}</p>
                </div>
                <span :class="getStatusColor(shipmentData.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ shipmentData.status }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Origin</p>
                  <p class="font-medium">{{ shipmentData.origin }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Destination</p>
                  <p class="font-medium">{{ shipmentData.destination }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Carrier</p>
                  <p class="font-medium">{{ shipmentData.carrier }}</p>
                </div>
              </div>
            </div>

            <!-- Progress Timeline -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Shipment Progress</h3>
              <div class="space-y-4">
                <div
                  v-for="(milestone, index) in shipmentData.milestones"
                  :key="index"
                  class="flex items-start space-x-4"
                >
                  <div class="flex-shrink-0">
                    <div
                      :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      ]"
                    >
                      <CheckCircle v-if="milestone.completed" class="h-4 w-4" />
                      <Clock v-else class="h-4 w-4" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h4 class="font-medium text-gray-900">{{ milestone.title }}</h4>
                      <span class="text-sm text-gray-500">{{ milestone.date }}</span>
                    </div>
                    <p class="text-sm text-gray-600">{{ milestone.description }}</p>
                    <p v-if="milestone.location" class="text-sm text-gray-500 mt-1">
                      <MapPin class="h-3 w-3 inline mr-1" />
                      {{ milestone.location }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Container Details -->
            <div v-if="shipmentData.containers" class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Container Details</h3>
              <div class="space-y-4">
                <div
                  v-for="container in shipmentData.containers"
                  :key="container.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-900">{{ container.number }}</h4>
                    <span :class="getContainerStatusColor(container.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ container.status }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p class="text-gray-600">Type</p>
                      <p class="font-medium">{{ container.type }} {{ container.size }}ft</p>
                    </div>
                    <div>
                      <p class="text-gray-600">Location</p>
                      <p class="font-medium">{{ container.location }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600">Last Update</p>
                      <p class="font-medium">{{ container.lastUpdate }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600">Temperature</p>
                      <p class="font-medium">{{ container.temperature || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map View -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Location</h3>
              <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div class="text-center">
                  <Map class="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-500">Interactive Map</p>
                  <p class="text-sm text-gray-400">Real-time position tracking</p>
                </div>
              </div>
            </div>

            <!-- ETA Information -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Estimated Times</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-600">Estimated Departure</p>
                  <p class="text-lg font-semibold text-gray-900">{{ shipmentData.etd }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Estimated Arrival</p>
                  <p class="text-lg font-semibold text-gray-900">{{ shipmentData.eta }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button @click="refreshTracking" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
                  <RefreshCw class="h-4 w-4 mr-2" />
                  Refresh
                </button>
                <button @click="exportTracking" class="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center">
                  <Download class="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
              <div class="flex items-center space-x-3">
                <button @click="shareTracking" class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center">
                  <Share class="h-4 w-4 mr-2" />
                  Share
                </button>
                <button @click="printTracking" class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center">
                  <Printer class="h-4 w-4 mr-2" />
                  Print
                </button>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else-if="hasSearched && !shipmentData" class="text-center py-8">
            <Package class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p class="text-gray-600">Please check the tracking number and try again.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Search, CheckCircle, Clock, MapPin, Map, RefreshCw, Download, Share, Printer, Package } from 'lucide-vue-next'

interface Milestone {
  title: string
  description: string
  date: string
  location?: string
  completed: boolean
}

interface Container {
  id: string
  number: string
  type: string
  size: string
  status: string
  location: string
  lastUpdate: string
  temperature?: string
}

interface ShipmentData {
  shipmentNumber: string
  billOfLading: string
  status: string
  origin: string
  destination: string
  carrier: string
  etd: string
  eta: string
  milestones: Milestone[]
  containers: Container[]
}

const props = defineProps<{
  isOpen: boolean
  shipmentId?: string
}>()

const emit = defineEmits<{
  close: []
  refresh: [id: string]
  export: [data: any]
  share: [data: any]
  print: [data: any]
}>()

const trackingNumber = ref('')
const hasSearched = ref(false)
const shipmentData = ref<ShipmentData | null>(null)

// Mock data for demonstration
const mockShipmentData: ShipmentData = {
  shipmentNumber: 'SH-2024-001',
  billOfLading: 'MAEU123456789',
  status: 'IN_TRANSIT',
  origin: 'Shanghai, China',
  destination: 'Los Angeles, USA',
  carrier: 'Maersk',
  etd: '2024-01-20',
  eta: '2024-02-15',
  milestones: [
    {
      title: 'Shipment Booked',
      description: 'Shipment has been booked with carrier',
      date: '2024-01-15',
      location: 'Shanghai Port',
      completed: true
    },
    {
      title: 'Container Loaded',
      description: 'Container has been loaded onto vessel',
      date: '2024-01-20',
      location: 'Shanghai Port',
      completed: true
    },
    {
      title: 'Vessel Departed',
      description: 'Vessel has departed from origin port',
      date: '2024-01-21',
      location: 'Pacific Ocean',
      completed: true
    },
    {
      title: 'In Transit',
      description: 'Shipment is currently in transit',
      date: '2024-01-25',
      location: 'Pacific Ocean',
      completed: false
    },
    {
      title: 'Arrival at Destination',
      description: 'Vessel will arrive at destination port',
      date: '2024-02-15',
      location: 'Los Angeles Port',
      completed: false
    }
  ],
  containers: [
    {
      id: '1',
      number: 'MSKU1234567',
      type: 'DRY',
      size: '40',
      status: 'IN_TRANSIT',
      location: 'Pacific Ocean',
      lastUpdate: '2 hours ago'
    }
  ]
}

const searchTracking = () => {
  hasSearched.value = true
  // Simulate API call
  if (trackingNumber.value || props.shipmentId) {
    shipmentData.value = mockShipmentData
  }
}

const refreshTracking = () => {
  if (shipmentData.value) {
    emit('refresh', shipmentData.value.shipmentNumber)
  }
}

const exportTracking = () => {
  if (shipmentData.value) {
    emit('export', shipmentData.value)
  }
}

const shareTracking = () => {
  if (shipmentData.value) {
    emit('share', shipmentData.value)
  }
}

const printTracking = () => {
  if (shipmentData.value) {
    emit('print', shipmentData.value)
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    'PLANNED': 'bg-gray-100 text-gray-800',
    'BOOKED': 'bg-blue-100 text-blue-800',
    'IN_TRANSIT': 'bg-yellow-100 text-yellow-800',
    'AT_ORIGIN': 'bg-purple-100 text-purple-800',
    'DEPARTED': 'bg-green-100 text-green-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }
  return `px-3 py-1 rounded-full text-sm font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getContainerStatusColor = (status: string) => {
  const colors = {
    'EMPTY': 'bg-gray-100 text-gray-800',
    'LOADED': 'bg-blue-100 text-blue-800',
    'IN_TRANSIT': 'bg-yellow-100 text-yellow-800',
    'AT_TERMINAL': 'bg-purple-100 text-purple-800',
    'AT_CUSTOMS': 'bg-orange-100 text-orange-800',
    'DELIVERED': 'bg-green-100 text-green-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const close = () => {
  trackingNumber.value = ''
  hasSearched.value = false
  shipmentData.value = null
  emit('close')
}
</script>
