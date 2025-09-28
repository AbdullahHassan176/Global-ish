<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">{{ item?.shipmentNumber || item?.containerNumber || 'View Details' }}</h2>
        <div class="flex items-center space-x-2">
          <button @click="handleEdit" class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
            <Edit class="h-4 w-4 mr-1" />
            Edit
          </button>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="item" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Shipment Number</label>
                <p class="text-lg font-semibold text-gray-900">{{ item.shipmentNumber || 'N/A' }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bill of Lading</label>
                <p class="text-gray-900">{{ item.billOfLading || 'N/A' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span :class="getStatusColor(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ item.status }}
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <p class="text-gray-900">{{ item.origin }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <p class="text-gray-900">{{ item.destination }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                <p class="text-gray-900">{{ item.carrier }}</p>
              </div>
            </div>
          </div>

          <!-- Container Information (if applicable) -->
          <div v-if="item.containerNumber" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Container Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Container Number</label>
                <p class="text-gray-900">{{ item.containerNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type & Size</label>
                <p class="text-gray-900">{{ item.type }} {{ item.size }}ft</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <p class="text-gray-900">{{ item.weight }} kg</p>
              </div>
            </div>
          </div>

          <!-- Timeline Information -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ETD (Estimated Time of Departure)</label>
                <p class="text-gray-900">{{ item.etd }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ETA (Estimated Time of Arrival)</label>
                <p class="text-gray-900">{{ item.eta }}</p>
              </div>
            </div>
          </div>

          <!-- Vessel Information -->
          <div v-if="item.vesselName" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Vessel Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vessel Name</label>
                <p class="text-gray-900">{{ item.vesselName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Voyage Number</label>
                <p class="text-gray-900">{{ item.voyageNumber || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Cost Information -->
          <div v-if="item.amount" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cost Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cost Item</label>
                <p class="text-gray-900">{{ item.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p class="text-gray-900">${{ item.amount.toLocaleString() }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <p class="text-gray-900">{{ item.vendor }}</p>
              </div>
            </div>
          </div>

          <!-- Alert Information -->
          <div v-if="item.title" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Alert Information</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p class="text-gray-900">{{ item.title }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <p class="text-gray-900">{{ item.message }}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <span :class="getSeverityColor(item.severity)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.severity }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span :class="getTypeColor(item.type)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.type }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div :class="activity.iconBg" class="p-2 rounded-full">
                  <component :is="activity.icon" class="h-4 w-4 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button @click="handleDownload" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
                  <Download class="h-4 w-4 mr-2" />
                  Download
                </button>
                <button @click="handleShare" class="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300 flex items-center">
                  <Share class="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
              <div class="flex items-center space-x-3">
                <button @click="handlePrint" class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center">
                  <Printer class="h-4 w-4 mr-2" />
                  Print
                </button>
                <button @click="handleEmail" class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center">
                  <Mail class="h-4 w-4 mr-2" />
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Edit, Download, Share, Printer, Mail, Calendar, Package, Ship, AlertTriangle } from 'lucide-vue-next'

interface Activity {
  id: string
  description: string
  timestamp: string
  icon: any
  iconBg: string
}

const props = defineProps<{
  isOpen: boolean
  item?: any
}>()

const emit = defineEmits<{
  close: []
  edit: [item: any]
  download: [item: any]
  share: [item: any]
  print: [item: any]
  email: [item: any]
}>()

const recentActivity = ref<Activity[]>([
  {
    id: '1',
    description: 'Status updated to In Transit',
    timestamp: '2 hours ago',
    icon: Ship,
    iconBg: 'bg-blue-500'
  },
  {
    id: '2',
    description: 'Container loaded onto vessel',
    timestamp: '1 day ago',
    icon: Package,
    iconBg: 'bg-green-500'
  },
  {
    id: '3',
    description: 'Alert generated for delay',
    timestamp: '3 days ago',
    icon: AlertTriangle,
    iconBg: 'bg-orange-500'
  }
])

const getStatusColor = (status: string) => {
  const colors = {
    'PLANNED': 'bg-gray-100 text-gray-800',
    'BOOKED': 'bg-blue-100 text-blue-800',
    'IN_TRANSIT': 'bg-yellow-100 text-yellow-800',
    'AT_ORIGIN': 'bg-purple-100 text-purple-800',
    'DEPARTED': 'bg-green-100 text-green-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'PAID': 'bg-green-100 text-green-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getSeverityColor = (severity: string) => {
  const colors = {
    'LOW': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'CRITICAL': 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getTypeColor = (type: string) => {
  const colors = {
    'DELAY': 'bg-red-100 text-red-800',
    'ETA_CHANGE': 'bg-blue-100 text-blue-800',
    'FREE_TIME_EXPIRY': 'bg-orange-100 text-orange-800',
    'DEMURRAGE_RISK': 'bg-yellow-100 text-yellow-800',
    'CUSTOMS_ISSUE': 'bg-purple-100 text-purple-800',
    'FREIGHT': 'bg-blue-100 text-blue-800',
    'CUSTOMS': 'bg-green-100 text-green-800',
    'WAREHOUSE': 'bg-purple-100 text-purple-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const handleEdit = () => {
  if (props.item) {
    emit('edit', props.item)
  }
}

const handleDownload = () => {
  if (props.item) {
    emit('download', props.item)
  }
}

const handleShare = () => {
  if (props.item) {
    emit('share', props.item)
  }
}

const handlePrint = () => {
  if (props.item) {
    emit('print', props.item)
  }
}

const handleEmail = () => {
  if (props.item) {
    emit('email', props.item)
  }
}

const close = () => {
  emit('close')
}
</script>
