<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Logistics & Container Tracking</h1>
        <p class="text-gray-600 mt-2">
          Shipment management, container tracking, milestone monitoring, and cost management
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Ship class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Shipments</p>
              <p class="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <Package class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Containers in Transit</p>
              <p class="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Delayed Shipments</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <DollarSign class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Costs</p>
              <p class="text-2xl font-bold text-gray-900">$2.4M</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'shipments'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'shipments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Shipments
            </button>
            <button
              @click="activeTab = 'containers'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'containers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Containers
            </button>
            <button
              @click="activeTab = 'map'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'map'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Live Map
            </button>
            <button
              @click="activeTab = 'costs'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'costs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Costs & Invoicing
            </button>
            <button
              @click="activeTab = 'alerts'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Alerts
            </button>
            <button
              @click="activeTab = 'integrations'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'integrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Integrations
            </button>
          </nav>
        </div>
      </div>

      <!-- Shipments Tab -->
      <div v-if="activeTab === 'shipments'" class="space-y-6">
        <!-- Shipment Actions -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Shipment Management</h2>
          <div class="flex items-center space-x-4">
            <select class="input">
              <option>All Carriers</option>
              <option>Maersk</option>
              <option>MSC</option>
              <option>CMA CGM</option>
              <option>DHL</option>
              <option>FedEx</option>
            </select>
            <button class="btn btn-primary">
              <Plus class="h-4 w-4 mr-2" />
              Create Shipment
            </button>
          </div>
        </div>

        <!-- Shipments Table -->
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
                <tr v-for="shipment in mockShipments" :key="shipment.id" class="hover:bg-gray-50">
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
                    <div>ETD: {{ shipment.etd }}</div>
                    <div>ETA: {{ shipment.eta }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button class="text-blue-600 hover:text-blue-900">Track</button>
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

      <!-- Containers Tab -->
      <div v-if="activeTab === 'containers'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Container Tracking</h2>
          <div class="flex items-center space-x-4">
            <input type="text" placeholder="Search containers..." class="input" />
            <button class="btn btn-primary">
              <Plus class="h-4 w-4 mr-2" />
              Add Container
            </button>
          </div>
        </div>

        <!-- Containers Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="container in mockContainers"
            :key="container.id"
            class="card p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ container.containerNumber }}</h3>
              <span :class="getContainerStatusColor(container.status)">
                {{ container.status }}
              </span>
            </div>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Type</span>
                <span class="font-medium">{{ container.type }} {{ container.size }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Location</span>
                <span class="font-medium">{{ container.location }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Last Update</span>
                <span class="font-medium">{{ container.lastUpdated }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Weight</span>
                <span class="font-medium">{{ container.weight }} kg</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button class="btn btn-primary btn-sm flex-1">
                <MapPin class="h-4 w-4 mr-1" />
                Track
              </button>
              <button class="btn btn-outline btn-sm">
                <Eye class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Tab -->
      <div v-if="activeTab === 'map'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Live Container Positions</h2>
          <div class="flex items-center space-x-4">
            <select class="input">
              <option>All Containers</option>
              <option>In Transit</option>
              <option>At Port</option>
              <option>At Customs</option>
            </select>
            <button class="btn btn-primary">
              <RefreshCw class="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <!-- Map Placeholder -->
        <div class="card p-6">
          <div class="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <Map class="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 text-lg">MapLibre Map Integration</p>
              <p class="text-gray-400 text-sm">Live container positions and route visualization</p>
            </div>
          </div>
        </div>

        <!-- Map Legend -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="card p-4">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">On Schedule</span>
            </div>
          </div>
          <div class="card p-4">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Delayed</span>
            </div>
          </div>
          <div class="card p-4">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-red-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Critical</span>
            </div>
          </div>
          <div class="card p-4">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-600">At Port</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Costs & Invoicing Tab -->
      <div v-if="activeTab === 'costs'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Costs & Invoicing</h2>
          <div class="flex items-center space-x-4">
            <select class="input">
              <option>All Shipments</option>
              <option>Pending Costs</option>
              <option>Approved Costs</option>
              <option>Paid Costs</option>
            </select>
            <button class="btn btn-primary">
              <Plus class="h-4 w-4 mr-2" />
              Add Cost
            </button>
            <button class="btn btn-outline">
              <FileText class="h-4 w-4 mr-2" />
              Generate Invoice
            </button>
          </div>
        </div>

        <!-- Cost Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Freight Costs</p>
                <p class="text-2xl font-bold text-gray-900">$1,250,000</p>
              </div>
              <div class="p-2 bg-blue-100 rounded-lg">
                <Ship class="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Customs</p>
                <p class="text-2xl font-bold text-gray-900">$85,000</p>
              </div>
              <div class="p-2 bg-green-100 rounded-lg">
                <Shield class="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Warehouse</p>
                <p class="text-2xl font-bold text-gray-900">$45,000</p>
              </div>
              <div class="p-2 bg-purple-100 rounded-lg">
                <Warehouse class="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Trucking</p>
                <p class="text-2xl font-bold text-gray-900">$125,000</p>
              </div>
              <div class="p-2 bg-orange-100 rounded-lg">
                <Truck class="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Cost Items Table -->
        <div class="card">
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="cost in mockCosts" :key="cost.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ cost.name }}</div>
                      <div class="text-sm text-gray-500">{{ cost.vendor }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getCostTypeColor(cost.type)">
                      {{ cost.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ cost.amount.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getCostStatusColor(cost.status)">
                      {{ cost.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ cost.dueDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button class="text-blue-600 hover:text-blue-900">View</button>
                      <button class="text-green-600 hover:text-green-900">Approve</button>
                      <button class="text-gray-600 hover:text-gray-900">Edit</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Alerts Tab -->
      <div v-if="activeTab === 'alerts'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Logistics Alerts</h2>
          <div class="flex items-center space-x-2">
            <button
              @click="alertFilter = 'all'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                alertFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              All
            </button>
            <button
              @click="alertFilter = 'unread'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                alertFilter === 'unread'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Unread
            </button>
            <button
              @click="alertFilter = 'critical'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                alertFilter === 'critical'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Critical
            </button>
          </div>
        </div>

        <!-- Alerts List -->
        <div class="card">
          <div class="divide-y divide-gray-200">
            <div
              v-for="alert in filteredAlerts"
              :key="alert.id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <div :class="`p-2 rounded-lg ${getAlertSeverityColor(alert.severity)}`">
                      <component :is="getAlertIcon(alert.type)" class="h-4 w-4" />
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">{{ alert.title }}</h3>
                    <span :class="getAlertSeverityBadge(alert.severity)">
                      {{ alert.severity }}
                    </span>
                    <span :class="getAlertTypeColor(alert.type)">
                      {{ alert.type }}
                    </span>
                  </div>
                  
                  <p class="text-gray-600 mb-3">{{ alert.message }}</p>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <Calendar class="h-4 w-4" />
                      <span>{{ alert.createdAt }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Package class="h-4 w-4" />
                      <span>{{ alert.containerNumber }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <MapPin class="h-4 w-4" />
                      <span>{{ alert.location }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button
                    v-if="!alert.isRead"
                    @click="markAsRead(alert.id)"
                    class="btn btn-primary btn-sm"
                  >
                    Mark Read
                  </button>
                  <button
                    v-if="!alert.isResolved"
                    @click="resolveAlert(alert.id)"
                    class="btn btn-outline btn-sm"
                  >
                    Resolve
                  </button>
                  <button class="btn btn-outline btn-sm">
                    <Eye class="h-4 w-4 mr-1" />
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Integrations Tab -->
      <div v-if="activeTab === 'integrations'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Carrier Integrations</h2>
          <div class="flex items-center space-x-4">
            <router-link to="/demo/logistics/integrations" class="btn btn-primary">
              <Settings class="h-4 w-4 mr-2" />
              Manage Integrations
            </router-link>
          </div>
        </div>

        <!-- Integration Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Ship class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Maersk</h3>
                  <p class="text-sm text-gray-500">Ocean Carrier</p>
                </div>
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Last Sync</span>
                <span class="text-gray-900">2 min ago</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Status</span>
                <span class="text-green-600">Connected</span>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Ship class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">MSC</h3>
                  <p class="text-sm text-gray-500">Ocean Carrier</p>
                </div>
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Paused
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Last Sync</span>
                <span class="text-gray-900">1 hour ago</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Status</span>
                <span class="text-yellow-600">Paused</span>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Truck class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">DHL</h3>
                  <p class="text-sm text-gray-500">Express Carrier</p>
                </div>
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Last Sync</span>
                <span class="text-gray-900">30 sec ago</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Status</span>
                <span class="text-green-600">Connected</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Integration Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button class="w-full btn btn-outline text-left">
                <RefreshCw class="h-4 w-4 mr-2" />
                Sync All Integrations
              </button>
              <button class="w-full btn btn-outline text-left">
                <TestTube class="h-4 w-4 mr-2" />
                Test All Connections
              </button>
              <button class="w-full btn btn-outline text-left">
                <Settings class="h-4 w-4 mr-2" />
                Configure Webhooks
              </button>
            </div>
          </div>

          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Integration Health</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">API Response Time</span>
                <span class="text-sm font-medium text-gray-900">245ms avg</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Success Rate</span>
                <span class="text-sm font-medium text-green-600">99.2%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Error</span>
                <span class="text-sm font-medium text-gray-900">None</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Webhook Events</span>
                <span class="text-sm font-medium text-gray-900">1,247 today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Demo -->
      <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
          <ul class="space-y-3">
            <li class="flex items-center space-x-2">
              <Ship class="h-4 w-4 text-blue-600" />
              <span>Complete shipment lifecycle management</span>
            </li>
            <li class="flex items-center space-x-2">
              <Package class="h-4 w-4 text-green-600" />
              <span>Real-time container tracking and positioning</span>
            </li>
            <li class="flex items-center space-x-2">
              <Map class="h-4 w-4 text-purple-600" />
              <span>MapLibre integration with live positions</span>
            </li>
            <li class="flex items-center space-x-2">
              <DollarSign class="h-4 w-4 text-orange-600" />
              <span>Comprehensive cost management and invoicing</span>
            </li>
            <li class="flex items-center space-x-2">
              <AlertTriangle class="h-4 w-4 text-red-600" />
              <span>Automated alerts for delays and issues</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Carrier Integrations</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ship class="h-4 w-4 text-blue-600" />
                </div>
                <span class="font-medium">Maersk</span>
              </div>
              <span class="text-sm text-gray-600">Ocean freight</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Ship class="h-4 w-4 text-green-600" />
                </div>
                <span class="font-medium">MSC</span>
              </div>
              <span class="text-sm text-gray-600">Ocean freight</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Truck class="h-4 w-4 text-purple-600" />
                </div>
                <span class="font-medium">DHL</span>
              </div>
              <span class="text-sm text-gray-600">Express delivery</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck class="h-4 w-4 text-orange-600" />
                </div>
                <span class="font-medium">FedEx</span>
              </div>
              <span class="text-sm text-gray-600">Express delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Ship, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Plus, 
  MapPin, 
  Eye, 
  RefreshCw, 
  Map, 
  FileText, 
  Shield, 
  Warehouse, 
  Truck, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  TestTube
} from 'lucide-vue-next'

const activeTab = ref<'shipments' | 'containers' | 'map' | 'costs' | 'alerts' | 'integrations'>('shipments')
const alertFilter = ref<'all' | 'unread' | 'critical'>('all')

const mockShipments = [
  {
    id: '1',
    shipmentNumber: 'SH-2024-001',
    billOfLading: 'MAEU123456789',
    carrier: 'Maersk',
    status: 'IN_TRANSIT',
    origin: 'Shanghai',
    destination: 'Los Angeles',
    vesselName: 'MSC LORETO',
    etd: '2024-01-20',
    eta: '2024-02-15'
  },
  {
    id: '2',
    shipmentNumber: 'SH-2024-002',
    billOfLading: 'MSCU987654321',
    carrier: 'MSC',
    status: 'AT_ORIGIN',
    origin: 'Hamburg',
    destination: 'New York',
    vesselName: 'MSC OSCAR',
    etd: '2024-01-25',
    eta: '2024-02-20'
  },
  {
    id: '3',
    shipmentNumber: 'SH-2024-003',
    billOfLading: 'DHL123456789',
    carrier: 'DHL',
    status: 'DELIVERED',
    origin: 'Frankfurt',
    destination: 'Chicago',
    vesselName: null,
    etd: '2024-01-15',
    eta: '2024-01-18'
  }
]

const mockContainers = [
  {
    id: '1',
    containerNumber: 'MSKU1234567',
    type: 'DRY',
    size: '40',
    status: 'IN_TRANSIT',
    location: 'Pacific Ocean',
    lastUpdated: '2 hours ago',
    weight: 25000
  },
  {
    id: '2',
    containerNumber: 'MSCU9876543',
    type: 'REEFER',
    size: '20',
    status: 'AT_TERMINAL',
    location: 'Hamburg Port',
    lastUpdated: '1 hour ago',
    weight: 15000
  },
  {
    id: '3',
    containerNumber: 'DHL1234567',
    type: 'DRY',
    size: '20',
    status: 'DELIVERED',
    location: 'Chicago Warehouse',
    lastUpdated: '1 day ago',
    weight: 12000
  }
]

const mockCosts = [
  {
    id: '1',
    name: 'Ocean Freight',
    type: 'FREIGHT',
    amount: 2500,
    status: 'PAID',
    vendor: 'Maersk Line',
    dueDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Customs Clearance',
    type: 'CUSTOMS',
    amount: 450,
    status: 'PENDING',
    vendor: 'Customs Broker',
    dueDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'Warehouse Storage',
    type: 'WAREHOUSE',
    amount: 120,
    status: 'APPROVED',
    vendor: 'Port Warehouse',
    dueDate: '2024-02-25'
  }
]

const mockAlerts = [
  {
    id: '1',
    type: 'DELAY',
    severity: 'HIGH',
    title: 'Shipment Delay Alert',
    message: 'Container MSKU1234567 is experiencing a 2-day delay due to weather conditions',
    isRead: false,
    isResolved: false,
    createdAt: '2 hours ago',
    containerNumber: 'MSKU1234567',
    location: 'Pacific Ocean'
  },
  {
    id: '2',
    type: 'FREE_TIME_EXPIRY',
    severity: 'CRITICAL',
    title: 'Free Time Expiry Warning',
    message: 'Container MSCU9876543 free time expires in 1 day. Demurrage charges will apply.',
    isRead: false,
    isResolved: false,
    createdAt: '4 hours ago',
    containerNumber: 'MSCU9876543',
    location: 'Hamburg Port'
  },
  {
    id: '3',
    type: 'ETA_CHANGE',
    severity: 'MEDIUM',
    title: 'ETA Update',
    message: 'Shipment SH-2024-001 ETA updated to February 17, 2024',
    isRead: true,
    isResolved: false,
    createdAt: '1 day ago',
    containerNumber: 'MSKU1234567',
    location: 'Los Angeles Port'
  }
]

const filteredAlerts = computed(() => {
  if (alertFilter.value === 'all') return mockAlerts
  if (alertFilter.value === 'unread') return mockAlerts.filter(alert => !alert.isRead)
  if (alertFilter.value === 'critical') return mockAlerts.filter(alert => alert.severity === 'CRITICAL')
  return mockAlerts
})

const getCarrierColor = (carrier: string) => {
  const colors = {
    'Maersk': 'bg-blue-500',
    'MSC': 'bg-green-500',
    'CMA CGM': 'bg-purple-500',
    'DHL': 'bg-yellow-500',
    'FedEx': 'bg-orange-500'
  }
  return colors[carrier as keyof typeof colors] || 'bg-gray-500'
}

const getShipmentStatusColor = (status: string) => {
  const colors = {
    'PLANNED': 'bg-gray-100 text-gray-800',
    'BOOKED': 'bg-blue-100 text-blue-800',
    'IN_TRANSIT': 'bg-yellow-100 text-yellow-800',
    'AT_ORIGIN': 'bg-purple-100 text-purple-800',
    'DEPARTED': 'bg-green-100 text-green-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
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

const getCostTypeColor = (type: string) => {
  const colors = {
    'FREIGHT': 'bg-blue-100 text-blue-800',
    'CUSTOMS': 'bg-green-100 text-green-800',
    'WAREHOUSE': 'bg-purple-100 text-purple-800',
    'TRUCKING': 'bg-orange-100 text-orange-800',
    'HANDLING': 'bg-yellow-100 text-yellow-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getCostStatusColor = (status: string) => {
  const colors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-blue-100 text-blue-800',
    'PAID': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getAlertSeverityColor = (severity: string) => {
  const colors = {
    'LOW': 'bg-green-100',
    'MEDIUM': 'bg-yellow-100',
    'HIGH': 'bg-orange-100',
    'CRITICAL': 'bg-red-100'
  }
  return colors[severity as keyof typeof colors] || 'bg-gray-100'
}

const getAlertSeverityBadge = (severity: string) => {
  const colors = {
    'LOW': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'CRITICAL': 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getAlertTypeColor = (type: string) => {
  const colors = {
    'DELAY': 'bg-red-100 text-red-800',
    'ETA_CHANGE': 'bg-blue-100 text-blue-800',
    'FREE_TIME_EXPIRY': 'bg-orange-100 text-orange-800',
    'DEMURRAGE_RISK': 'bg-yellow-100 text-yellow-800',
    'CUSTOMS_ISSUE': 'bg-purple-100 text-purple-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'DELAY':
      return Clock
    case 'ETA_CHANGE':
      return Calendar
    case 'FREE_TIME_EXPIRY':
      return AlertTriangle
    case 'DEMURRAGE_RISK':
      return DollarSign
    case 'CUSTOMS_ISSUE':
      return Shield
    default:
      return AlertTriangle
  }
}

const markAsRead = (id: string) => {
  console.log('Marking alert as read:', id)
}

const resolveAlert = (id: string) => {
  console.log('Resolving alert:', id)
}
</script>
