<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-6xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Shipment Tracking</h2>
          <p class="text-brand-teal mt-1">Real-time tracking for {{ shipmentData.shipmentNumber }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="refreshTracking" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
            <RefreshCw class="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
            <X class="h-5 w-5 text-brand-cyan" />
          </button>
        </div>
      </div>

      <!-- Shipment Overview -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-brand-navy mb-2">Shipment Details</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-brand-teal">Number:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.shipmentNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">Status:</span>
                <span :class="getStatusColor(shipmentData.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ shipmentData.status }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">Carrier:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.carrier }}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-brand-navy mb-2">Route</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-brand-teal">From:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.origin }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">To:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.destination }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">Distance:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.distance }} km</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-brand-navy mb-2">Timeline</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-brand-teal">ETD:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.etd }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">ETA:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.eta }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">Progress:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.progress }}%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-brand-navy mb-2">Cargo</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-brand-teal">Weight:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.weight }} kg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">Volume:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.volume }} m³</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-teal">Pieces:</span>
                <span class="font-medium text-brand-navy">{{ shipmentData.pieces }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-brand-navy">Shipment Progress</h3>
          <span class="text-sm text-brand-teal">{{ shipmentData.progress }}% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="bg-gradient-to-r from-brand-orange to-brand-magenta h-3 rounded-full transition-all duration-500"
            :style="{ width: `${shipmentData.progress}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-brand-teal">
          <span>Origin</span>
          <span>In Transit</span>
          <span>Destination</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'timeline'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'timeline'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <Clock class="h-4 w-4 mr-2 inline" />
              Timeline
            </button>
            <button
              @click="activeTab = 'map'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'map'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <MapPin class="h-4 w-4 mr-2 inline" />
              Map
            </button>
            <button
              @click="activeTab = 'documents'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'documents'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <FileText class="h-4 w-4 mr-2 inline" />
              Documents
            </button>
            <button
              @click="activeTab = 'alerts'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'alerts'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <Bell class="h-4 w-4 mr-2 inline" />
              Alerts
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="min-h-[400px]">
        <!-- Timeline Tab -->
        <div v-if="activeTab === 'timeline'" class="space-y-6">
          <div class="space-y-4">
            <div v-for="(event, index) in trackingEvents" :key="event.id" class="flex items-start">
              <div class="flex flex-col items-center mr-4">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  event.completed ? 'bg-brand-orange text-white' : 
                  event.current ? 'bg-brand-teal text-white' : 
                  'bg-gray-200 text-gray-600'
                ]">
                  <CheckCircle v-if="event.completed" class="h-4 w-4" />
                  <Clock v-else-if="event.current" class="h-4 w-4" />
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div v-if="index < trackingEvents.length - 1" 
                  :class="[
                    'w-1 h-8 mt-2 transition-all duration-300',
                    event.completed ? 'bg-brand-orange' : 'bg-gray-200'
                  ]"
                ></div>
              </div>
              <div class="flex-1 pb-6">
                <div class="bg-white/80 rounded-lg border border-brand-cyan/20 p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-brand-navy">{{ event.title }}</h4>
                    <span class="text-sm text-brand-teal">{{ event.timestamp }}</span>
                  </div>
                  <p class="text-sm text-brand-navy mb-2">{{ event.description }}</p>
                  <div v-if="event.location" class="flex items-center text-sm text-brand-teal">
                    <MapPin class="h-4 w-4 mr-1" />
                    {{ event.location }}
                  </div>
                  <div v-if="event.details" class="mt-2 text-xs text-gray-600">
                    {{ event.details }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Tab -->
        <div v-if="activeTab === 'map'" class="space-y-6">
          <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Shipment Route</h3>
            <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div class="text-center">
                <MapPin class="h-12 w-12 text-brand-orange mx-auto mb-2" />
                <p class="text-brand-navy font-medium">Interactive Map View</p>
                <p class="text-sm text-brand-teal">Real-time location tracking</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white/80 rounded-lg border border-brand-cyan/20 p-4">
              <h4 class="font-medium text-brand-navy mb-3">Current Location</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-brand-teal">Latitude:</span>
                  <span class="font-medium text-brand-navy">{{ currentLocation.lat }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-brand-teal">Longitude:</span>
                  <span class="font-medium text-brand-navy">{{ currentLocation.lng }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-brand-teal">Speed:</span>
                  <span class="font-medium text-brand-navy">{{ currentLocation.speed }} km/h</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-brand-teal">Heading:</span>
                  <span class="font-medium text-brand-navy">{{ currentLocation.heading }}°</span>
                </div>
              </div>
            </div>
            
            <div class="bg-white/80 rounded-lg border border-brand-cyan/20 p-4">
              <h4 class="font-medium text-brand-navy mb-3">Route Information</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-brand-teal">Distance Traveled:</span>
                  <span class="font-medium text-brand-navy">{{ routeInfo.distanceTraveled }} km</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-brand-teal">Remaining Distance:</span>
                  <span class="font-medium text-brand-navy">{{ routeInfo.remainingDistance }} km</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-brand-teal">Estimated Arrival:</span>
                  <span class="font-medium text-brand-navy">{{ routeInfo.estimatedArrival }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-brand-teal">Next Milestone:</span>
                  <span class="font-medium text-brand-navy">{{ routeInfo.nextMilestone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Tab -->
        <div v-if="activeTab === 'documents'" class="space-y-6">
          <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Shipment Documents</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="document in documents" :key="document.id" class="bg-white/80 rounded-lg border border-brand-cyan/20 p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <div :class="document.iconBg" class="p-2 rounded-lg">
                      <component :is="document.icon" class="h-5 w-5 text-white" />
                    </div>
                    <div class="ml-3">
                      <h4 class="font-medium text-brand-navy">{{ document.name }}</h4>
                      <p class="text-sm text-brand-teal">{{ document.type }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button @click="viewDocument(document.id)" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 text-sm">
                      View
                    </button>
                    <button @click="downloadDocument(document.id)" class="px-3 py-1 border-2 border-brand-orange text-brand-orange rounded-md hover:bg-brand-orange hover:text-white transition-all duration-300 text-sm">
                      Download
                    </button>
                  </div>
                </div>
                <div class="text-xs text-brand-navy">
                  <strong>Status:</strong> {{ document.status }} • 
                  <strong>Size:</strong> {{ document.size }} • 
                  <strong>Updated:</strong> {{ document.updatedAt }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alerts Tab -->
        <div v-if="activeTab === 'alerts'" class="space-y-6">
          <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Shipment Alerts & Notifications</h3>
            <div class="space-y-3">
              <div v-for="alert in alerts" :key="alert.id" class="flex items-start p-4 bg-white/80 rounded-lg border border-brand-cyan/20">
                <div class="flex-shrink-0 mr-3">
                  <div :class="getAlertIconBg(alert.type)" class="p-2 rounded-full">
                    <component :is="alert.icon" class="h-4 w-4 text-white" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-medium text-brand-navy">{{ alert.title }}</h4>
                    <span :class="getAlertStatusColor(alert.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ alert.status }}
                    </span>
                  </div>
                  <p class="text-sm text-brand-navy mb-2">{{ alert.message }}</p>
                  <div class="flex items-center justify-between text-xs text-brand-teal">
                    <span>{{ alert.timestamp }}</span>
                    <div class="flex space-x-2">
                      <button @click="viewAlert(alert.id)" class="text-brand-teal hover:text-brand-orange">
                        View Details
                      </button>
                      <button v-if="alert.status === 'active'" @click="dismissAlert(alert.id)" class="text-brand-orange hover:text-brand-magenta">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Last updated: {{ lastUpdated }}
        </div>
        <div class="flex space-x-3">
          <button @click="exportTracking" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Export Report
          </button>
          <button @click="shareTracking" class="px-4 py-2 border-2 border-brand-orange text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all duration-300">
            Share Tracking
          </button>
          <button @click="close" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  X, RefreshCw, Clock, MapPin, FileText, Bell, CheckCircle,
  Ship, Package, Truck, AlertTriangle, Info, Download, Eye
} from 'lucide-vue-next'
import { notify } from '@/composables/useNotifications'

const props = defineProps<{
  isOpen: boolean
  shipmentId: string
}>()

const emit = defineEmits(['close'])

const activeTab = ref<'timeline' | 'map' | 'documents' | 'alerts'>('timeline')
const lastUpdated = ref('')

// Mock shipment data
const shipmentData = ref({
  shipmentNumber: 'SH-2024-001',
  status: 'In Transit',
  carrier: 'Maersk',
  origin: 'Shanghai, China',
  destination: 'Los Angeles, USA',
  distance: 12000,
  etd: '2024-01-15',
  eta: '2024-01-25',
  progress: 65,
  weight: 2500,
  volume: 15.5,
  pieces: 12
})

// Mock tracking events
const trackingEvents = ref([
  {
    id: '1',
    title: 'Shipment Created',
    description: 'Shipment has been created and is ready for pickup',
    location: 'Shanghai Port, China',
    timestamp: '2024-01-15 08:00:00',
    completed: true,
    current: false,
    details: 'Documentation completed, customs clearance initiated'
  },
  {
    id: '2',
    title: 'Picked Up',
    description: 'Shipment has been picked up from origin',
    location: 'Shanghai Port, China',
    timestamp: '2024-01-15 14:30:00',
    completed: true,
    current: false,
    details: 'Container loaded onto vessel'
  },
  {
    id: '3',
    title: 'In Transit',
    description: 'Shipment is currently in transit',
    location: 'Pacific Ocean',
    timestamp: '2024-01-18 10:15:00',
    completed: true,
    current: true,
    details: 'Vessel en route to destination port'
  },
  {
    id: '4',
    title: 'Port Arrival',
    description: 'Shipment has arrived at destination port',
    location: 'Los Angeles Port, USA',
    timestamp: '2024-01-25 06:00:00',
    completed: false,
    current: false,
    details: 'Expected arrival at Los Angeles Port'
  },
  {
    id: '5',
    title: 'Delivered',
    description: 'Shipment has been delivered to final destination',
    location: 'Los Angeles, USA',
    timestamp: '2024-01-26 16:00:00',
    completed: false,
    current: false,
    details: 'Final delivery to consignee'
  }
])

// Mock current location
const currentLocation = ref({
  lat: '35.6762',
  lng: '139.6503',
  speed: 25,
  heading: 85
})

// Mock route information
const routeInfo = ref({
  distanceTraveled: 7800,
  remainingDistance: 4200,
  estimatedArrival: '2024-01-25 06:00:00',
  nextMilestone: 'Los Angeles Port'
})

// Mock documents
const documents = ref([
  {
    id: '1',
    name: 'Bill of Lading',
    type: 'Shipping Document',
    status: 'Available',
    size: '2.3 MB',
    updatedAt: '2024-01-15 08:00:00',
    icon: FileText,
    iconBg: 'bg-gradient-to-br from-brand-orange to-brand-magenta'
  },
  {
    id: '2',
    name: 'Commercial Invoice',
    type: 'Financial Document',
    status: 'Available',
    size: '1.8 MB',
    updatedAt: '2024-01-15 08:15:00',
    icon: FileText,
    iconBg: 'bg-gradient-to-br from-brand-teal to-brand-cyan'
  },
  {
    id: '3',
    name: 'Packing List',
    type: 'Cargo Document',
    status: 'Available',
    size: '1.2 MB',
    updatedAt: '2024-01-15 08:30:00',
    icon: Package,
    iconBg: 'bg-gradient-to-br from-brand-purple to-brand-magenta'
  },
  {
    id: '4',
    name: 'Certificate of Origin',
    type: 'Customs Document',
    status: 'Pending',
    size: '0.9 MB',
    updatedAt: '2024-01-15 09:00:00',
    icon: FileText,
    iconBg: 'bg-gradient-to-br from-brand-pink to-brand-purple'
  }
])

// Mock alerts
const alerts = ref([
  {
    id: '1',
    title: 'Weather Alert',
    message: 'Heavy weather conditions may cause delays in Pacific route',
    type: 'warning',
    status: 'active',
    timestamp: '2024-01-18 14:30:00',
    icon: AlertTriangle,
    iconBg: 'bg-gradient-to-br from-brand-orange to-brand-magenta'
  },
  {
    id: '2',
    title: 'Port Congestion',
    message: 'Los Angeles Port experiencing high congestion, arrival may be delayed',
    type: 'info',
    status: 'active',
    timestamp: '2024-01-20 09:15:00',
    icon: Info,
    iconBg: 'bg-gradient-to-br from-brand-teal to-brand-cyan'
  },
  {
    id: '3',
    title: 'Customs Clearance',
    message: 'Customs clearance completed successfully',
    type: 'success',
    status: 'resolved',
    timestamp: '2024-01-15 10:45:00',
    icon: CheckCircle,
    iconBg: 'bg-gradient-to-br from-brand-purple to-brand-magenta'
  }
])

// Helper functions
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'in transit':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'delayed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getAlertIconBg = (type: string) => {
  switch (type.toLowerCase()) {
    case 'warning':
      return 'bg-gradient-to-br from-brand-orange to-brand-magenta'
    case 'info':
      return 'bg-gradient-to-br from-brand-teal to-brand-cyan'
    case 'success':
      return 'bg-gradient-to-br from-brand-purple to-brand-magenta'
    default:
      return 'bg-gradient-to-br from-brand-pink to-brand-purple'
  }
}

const getAlertStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'dismissed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Action functions
const refreshTracking = () => {
  console.log('Refreshing tracking data for shipment:', props.shipmentId)
  lastUpdated.value = new Date().toLocaleTimeString()
  notify.success('Data Refreshed', 'Tracking data refreshed successfully!')
}

const viewDocument = (documentId: string) => {
  console.log('Viewing document:', documentId)
  notify.info('Document Viewer', `Opening document ${documentId} in viewer`)
}

const downloadDocument = (documentId: string) => {
  console.log('Downloading document:', documentId)
  notify.success('Download Started', `Downloading document ${documentId}`)
}

const viewAlert = (alertId: string) => {
  console.log('Viewing alert details:', alertId)
  notify.info('Alert Details', `Opening details for alert ${alertId}`)
}

const dismissAlert = (alertId: string) => {
  console.log('Dismissing alert:', alertId)
  const alert = alerts.value.find(a => a.id === alertId)
  if (alert) {
    alert.status = 'dismissed'
  }
  notify.success('Alert Dismissed', 'Alert has been dismissed')
}

const exportTracking = () => {
  console.log('Exporting tracking report')
  notify.success('Export Started', 'Exporting comprehensive tracking report...')
}

const shareTracking = () => {
  console.log('Sharing tracking information')
  notify.success('Share Link Generated', 'Generating shareable tracking link...')
}

const close = () => {
  emit('close')
}

// Auto-refresh every 30 seconds
let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
  lastUpdated.value = new Date().toLocaleTimeString()
  refreshInterval = setInterval(() => {
    refreshTracking()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
