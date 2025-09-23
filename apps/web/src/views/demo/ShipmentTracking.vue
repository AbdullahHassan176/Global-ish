<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Shipment Tracking</h1>
            <p class="text-gray-600 mt-2">
              Real-time tracking and detailed shipment information
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/demo/logistics" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Back to Logistics
            </router-link>
            <button @click="handleNewShipment" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <Plus class="h-4 w-4 mr-2" />
              New Shipment
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="card p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Shipment number, BL, container..."
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
            <select v-model="selectedCarrier" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300">
              <option value="">All Carriers</option>
              <option value="MAERSK">Maersk</option>
              <option value="MSC">MSC</option>
              <option value="CMA_CGM">CMA CGM</option>
              <option value="DHL">DHL</option>
              <option value="FEDEX">FedEx</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="selectedStatus" class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300">
              <option value="">All Status</option>
              <option value="PLANNED">Planned</option>
              <option value="AT_ORIGIN">At Origin</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="AT_DESTINATION">At Destination</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="searchShipments" class="w-full px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center justify-center shadow-lg">
              <Search class="h-4 w-4 mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>

      <!-- Shipment Details -->
      <div v-if="selectedShipment" class="space-y-6">
        <!-- Shipment Header -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ selectedShipment.shipmentNumber }}</h2>
              <p class="text-gray-600">{{ selectedShipment.billOfLading }}</p>
            </div>
            <div class="text-right">
              <span :class="getShipmentStatusColor(selectedShipment.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ selectedShipment.status }}
              </span>
              <p class="text-sm text-gray-500 mt-1">{{ selectedShipment.carrier }}</p>
            </div>
          </div>

          <!-- Route Information -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin class="h-8 w-8 text-blue-600" />
              </div>
              <h3 class="font-semibold text-gray-900">Origin</h3>
              <p class="text-gray-600">{{ selectedShipment.origin }}</p>
              <p class="text-sm text-gray-500">{{ selectedShipment.originPort }}</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin class="h-8 w-8 text-green-600" />
              </div>
              <h3 class="font-semibold text-gray-900">Destination</h3>
              <p class="text-gray-600">{{ selectedShipment.destination }}</p>
              <p class="text-sm text-gray-500">{{ selectedShipment.destinationPort }}</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Ship class="h-8 w-8 text-purple-600" />
              </div>
              <h3 class="font-semibold text-gray-900">Vessel</h3>
              <p class="text-gray-600">{{ selectedShipment.vesselName }}</p>
              <p class="text-sm text-gray-500">{{ selectedShipment.voyageNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Shipment Timeline</h3>
          <div class="space-y-4">
            <div
              v-for="(event, index) in shipmentEvents"
              :key="event.id"
              class="flex items-start space-x-4"
            >
              <div class="flex-shrink-0">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                ]">
                  <CheckCircle v-if="index === 0" class="h-5 w-5 text-white" />
                  <Clock v-else class="h-5 w-5 text-white" />
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900">{{ event.description }}</h4>
                  <span class="text-sm text-gray-500">{{ formatDate(event.eventDate) }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ event.location }}</p>
                <p v-if="event.vesselName" class="text-sm text-gray-500">
                  {{ event.vesselName }} - {{ event.voyageNumber }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Container Information -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Container Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="container in selectedShipment.containers"
              :key="container.id"
              class="border rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-gray-900">{{ container.containerNumber }}</h4>
                <span :class="getContainerStatusColor(container.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ container.status }}
                </span>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Type</span>
                  <span class="text-gray-900">{{ container.type }} {{ container.size }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Location</span>
                  <span class="text-gray-900">{{ container.lastKnownLocation }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Weight</span>
                  <span class="text-gray-900">{{ container.weightKg }} kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Last Update</span>
                  <span class="text-gray-900">{{ formatDate(container.lastReportedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cost Breakdown -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Cost Breakdown</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost Item
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="cost in shipmentCosts" :key="cost.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ cost.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ cost.type }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ cost.currency }} {{ cost.amount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getCostStatusColor(cost.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ cost.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ cost.dueDate ? formatDate(cost.dueDate) : '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Shipments List -->
      <div v-else class="space-y-6">
        <div class="card">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETD/ETA
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="shipment in filteredShipments" :key="shipment.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ shipment.shipmentNumber }}</div>
                      <div class="text-sm text-gray-500">{{ shipment.billOfLading }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div :class="`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${getCarrierColor(shipment.carrier)}`">
                        {{ shipment.carrier.charAt(0) }}
                      </div>
                      <div class="ml-2 text-sm text-gray-900">{{ shipment.carrier }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ shipment.origin }} → {{ shipment.destination }}</div>
                    <div class="text-sm text-gray-500">{{ shipment.vesselName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getShipmentStatusColor(shipment.status)">
                      {{ shipment.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>ETD: {{ formatDate(shipment.etd) }}</div>
                    <div>ETA: {{ formatDate(shipment.eta) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button @click="selectShipment(shipment)" class="text-blue-600 hover:text-blue-900">
                        Track
                      </button>
                      <button class="text-green-600 hover:text-green-900">View</button>
                      <button class="text-gray-600 hover:text-gray-900">Edit</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SidebarLayout from '@/components/SidebarLayout.vue'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MapPin, 
  Ship, 
  CheckCircle, 
  Clock 
} from 'lucide-vue-next'

const searchQuery = ref('')
const selectedCarrier = ref('')
const selectedStatus = ref('')
const selectedShipment = ref(null)

// Mock data
const mockShipments = [
  {
    id: '1',
    shipmentNumber: 'MAEU1234567',
    billOfLading: 'BL-2024-001',
    carrier: 'MAERSK',
    status: 'IN_TRANSIT',
    origin: 'Shanghai',
    destination: 'Rotterdam',
    originPort: 'CNSHA',
    destinationPort: 'NLRTM',
    vesselName: 'MAERSK MC-KINNEY MOLLER',
    voyageNumber: '123N',
    etd: new Date('2024-01-10'),
    eta: new Date('2024-02-10'),
    containers: [
      {
        id: '1',
        containerNumber: 'MAEU1234567',
        type: 'DRY',
        size: '40HC',
        status: 'IN_TRANSIT',
        weightKg: 20000,
        lastKnownLocation: 'Indian Ocean',
        lastReportedAt: new Date('2024-01-20T15:30:00Z')
      }
    ]
  },
  {
    id: '2',
    shipmentNumber: 'MSCU2345678',
    billOfLading: 'BL-2024-002',
    carrier: 'MSC',
    status: 'AT_ORIGIN',
    origin: 'Hamburg',
    destination: 'New York',
    originPort: 'DEHAM',
    destinationPort: 'USNYC',
    vesselName: 'MSC OSCAR',
    voyageNumber: '456E',
    etd: new Date('2024-01-25'),
    eta: new Date('2024-02-20'),
    containers: [
      {
        id: '2',
        containerNumber: 'MSCU2345678',
        type: 'REEFER',
        size: '20GP',
        status: 'AT_TERMINAL',
        weightKg: 15000,
        lastKnownLocation: 'Hamburg Port',
        lastReportedAt: new Date('2024-01-23T08:00:00Z')
      }
    ]
  }
]

const shipmentEvents = [
  {
    id: '1',
    description: 'Departed from origin port',
    eventDate: new Date('2024-01-12T10:00:00Z'),
    location: 'Shanghai',
    vesselName: 'MAERSK MC-KINNEY MOLLER',
    voyageNumber: '123N'
  },
  {
    id: '2',
    description: 'In transit on high seas',
    eventDate: new Date('2024-01-20T15:30:00Z'),
    location: 'Indian Ocean',
    vesselName: 'MAERSK MC-KINNEY MOLLER',
    voyageNumber: '123N'
  }
]

const shipmentCosts = [
  {
    id: '1',
    name: 'Ocean Freight',
    type: 'FREIGHT',
    amount: 2500,
    currency: 'USD',
    status: 'PAID',
    dueDate: new Date('2024-01-05')
  },
  {
    id: '2',
    name: 'Customs Clearance',
    type: 'CUSTOMS',
    amount: 350,
    currency: 'USD',
    status: 'PENDING',
    dueDate: new Date('2024-02-15')
  },
  {
    id: '3',
    name: 'Port Handling',
    type: 'HANDLING',
    amount: 180,
    currency: 'USD',
    status: 'PENDING',
    dueDate: new Date('2024-02-10')
  }
]

const filteredShipments = computed(() => {
  let filtered = mockShipments

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(shipment => 
      shipment.shipmentNumber.toLowerCase().includes(query) ||
      shipment.billOfLading.toLowerCase().includes(query) ||
      shipment.containers.some(c => c.containerNumber.toLowerCase().includes(query))
    )
  }

  if (selectedCarrier.value) {
    filtered = filtered.filter(shipment => shipment.carrier === selectedCarrier.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(shipment => shipment.status === selectedStatus.value)
  }

  return filtered
})

const selectShipment = (shipment: any) => {
  selectedShipment.value = shipment
}

const searchShipments = () => {
  // Trigger search
  console.log('Searching shipments...')
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getShipmentStatusColor = (status: string) => {
  const colors = {
    PLANNED: 'bg-gray-100 text-gray-800',
    AT_ORIGIN: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
    AT_DESTINATION: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getContainerStatusColor = (status: string) => {
  const colors = {
    EMPTY: 'bg-gray-100 text-gray-800',
    LOADED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
    AT_TERMINAL: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getCostStatusColor = (status: string) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getCarrierColor = (carrier: string) => {
  const colors = {
    MAERSK: 'bg-blue-500',
    MSC: 'bg-green-500',
    CMA_CGM: 'bg-yellow-500',
    DHL: 'bg-red-500',
    FEDEX: 'bg-purple-500'
  }
  return colors[carrier] || 'bg-gray-500'
}

// Button click handlers
const handleNewShipment = () => {
  console.log('New Shipment clicked')
  alert('New Shipment functionality would open shipment creation dialog')
}

const searchShipments = () => {
  console.log('Search Shipments clicked')
  alert('Searching shipments...')
}
</script>