<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">HR & Finance Dashboard</h1>
        <p class="text-gray-600 mt-2">
          Timesheets, project tracking, billable rates, and financial reporting
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Clock class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Hours This Week</p>
              <p class="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <DollarSign class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Billable Revenue</p>
              <p class="text-2xl font-bold text-gray-900">$45,230</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Approval</p>
              <p class="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Users class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Projects</p>
              <p class="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'timesheets'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'timesheets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Timesheets
            </button>
            <button
              @click="activeTab = 'projects'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Projects
            </button>
            <button
              @click="activeTab = 'clients'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Clients
            </button>
            <button
              @click="activeTab = 'reports'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Reports
            </button>
          </nav>
        </div>
      </div>

      <!-- Timesheets Tab -->
      <div v-if="activeTab === 'timesheets'" class="space-y-6">
        <!-- Timesheet Actions -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Timesheet Management</h2>
          <div class="flex items-center space-x-4">
            <select class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300">
              <option>All Users</option>
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Mike Johnson</option>
            </select>
            <button class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <Plus class="h-4 w-4 mr-2" />
              Add Timesheet
            </button>
          </div>
        </div>

        <!-- Timesheets Table -->
        <div class="card">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="timesheet in mockTimesheets" :key="timesheet.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                        {{ timesheet.userName.charAt(0) }}
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ timesheet.userName }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ timesheet.projectName }}</div>
                    <div class="text-sm text-gray-500">{{ timesheet.clientName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ timesheet.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ timesheet.hours }}h
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ timesheet.rate }}/h
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ timesheet.amount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getTimesheetStatusColor(timesheet.status)">
                      {{ timesheet.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="timesheet.status === 'SUBMITTED'"
                        @click="approveTimesheet(timesheet.id)"
                        class="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        v-if="timesheet.status === 'SUBMITTED'"
                        @click="rejectTimesheet(timesheet.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                      <button class="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Projects Tab -->
      <div v-if="activeTab === 'projects'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Project Management</h2>
          <button class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Plus class="h-4 w-4 mr-2" />
            Create Project
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in mockProjects"
            :key="project.id"
            class="card p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ project.name }}</h3>
              <span :class="getProjectStatusColor(project.status)">
                {{ project.status }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Client</span>
                <span class="font-medium">{{ project.clientName }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Budget</span>
                <span class="font-medium">{{ project.budget }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Hours Logged</span>
                <span class="font-medium">{{ project.hoursLogged }}h</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Progress</span>
                <span class="font-medium">{{ project.progress }}%</span>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{{ project.progress }}%</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${project.progress}%` }"
                />
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button class="px-3 py-1 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-md hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center text-sm flex-1">
                <Eye class="h-4 w-4 mr-1" />
                View Details
              </button>
              <button class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                <Edit class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Clients Tab -->
      <div v-if="activeTab === 'clients'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Client Management</h2>
          <button class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Plus class="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>

        <!-- Clients List -->
        <div class="card">
          <div class="divide-y divide-gray-200">
            <div
              v-for="client in mockClients"
              :key="client.id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ client.name }}</h3>
                    <span :class="getClientStatusColor(client.isActive)">
                      {{ client.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p class="text-sm text-gray-500">Contact Person</p>
                      <p class="text-sm font-medium text-gray-900">{{ client.contactPerson }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Email</p>
                      <p class="text-sm font-medium text-gray-900">{{ client.email }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <Folder class="h-4 w-4" />
                      <span>{{ client.projectsCount }} projects</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <DollarSign class="h-4 w-4" />
                      <span>{{ client.totalRevenue }} revenue</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Calendar class="h-4 w-4" />
                      <span>Since {{ client.createdAt }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Eye class="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button class="px-3 py-1 border-2 border-brand-teal text-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center text-sm">
                    <Edit class="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Tab -->
      <div v-if="activeTab === 'reports'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Financial Reports</h2>
          <div class="flex items-center space-x-4">
            <select class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>Last Quarter</option>
              <option>This Year</option>
            </select>
            <button class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
              <Download class="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <!-- Report Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                <p class="text-2xl font-bold text-gray-900">$125,430</p>
              </div>
              <div class="p-2 bg-green-100 rounded-lg">
                <TrendingUp class="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p class="text-sm text-green-600 mt-2">+12.5% from last month</p>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Billable Hours</p>
                <p class="text-2xl font-bold text-gray-900">2,847</p>
              </div>
              <div class="p-2 bg-blue-100 rounded-lg">
                <Clock class="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p class="text-sm text-blue-600 mt-2">+8.2% from last month</p>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Average Rate</p>
                <p class="text-2xl font-bold text-gray-900">$44.05</p>
              </div>
              <div class="p-2 bg-purple-100 rounded-lg">
                <DollarSign class="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p class="text-sm text-purple-600 mt-2">+2.1% from last month</p>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Utilization</p>
                <p class="text-2xl font-bold text-gray-900">87.3%</p>
              </div>
              <div class="p-2 bg-orange-100 rounded-lg">
                <Target class="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p class="text-sm text-orange-600 mt-2">+3.7% from last month</p>
          </div>
        </div>

        <!-- Charts Placeholder -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue by Client</h3>
            <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p class="text-gray-500">Revenue Chart Placeholder</p>
            </div>
          </div>
          
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Hours by Project</h3>
            <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p class="text-gray-500">Hours Chart Placeholder</p>
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
              <Clock class="h-4 w-4 text-blue-600" />
              <span>Per user/project/client timesheet tracking</span>
            </li>
            <li class="flex items-center space-x-2">
              <DollarSign class="h-4 w-4 text-green-600" />
              <span>Configurable billable rates and revenue calculation</span>
            </li>
            <li class="flex items-center space-x-2">
              <CheckCircle class="h-4 w-4 text-purple-600" />
              <span>Approval workflow for timesheet submissions</span>
            </li>
            <li class="flex items-center space-x-2">
              <Download class="h-4 w-4 text-orange-600" />
              <span>Export capabilities for accounting systems</span>
            </li>
            <li class="flex items-center space-x-2">
              <BarChart3 class="h-4 w-4 text-red-600" />
              <span>Financial reporting and analytics</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Export Formats</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">CSV</span>
              <span class="text-sm text-gray-600">Spreadsheet format</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">Excel</span>
              <span class="text-sm text-gray-600">Microsoft Excel</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">PDF</span>
              <span class="text-sm text-gray-600">Printable reports</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium">QuickBooks</span>
              <span class="text-sm text-gray-600">Accounting integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarLayout from '@/components/SidebarLayout.vue'
import { 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  Plus, 
  Eye, 
  Edit, 
  Download,
  Folder,
  Calendar,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-vue-next'

const activeTab = ref<'timesheets' | 'projects' | 'clients' | 'reports'>('timesheets')

const mockTimesheets = [
  {
    id: '1',
    userName: 'John Doe',
    projectName: 'Website Redesign',
    clientName: 'Acme Corp',
    date: '2024-01-17',
    hours: 8,
    rate: 75,
    amount: 600,
    status: 'SUBMITTED'
  },
  {
    id: '2',
    userName: 'Jane Smith',
    projectName: 'Mobile App',
    clientName: 'TechStart Inc',
    date: '2024-01-17',
    hours: 6,
    rate: 85,
    amount: 510,
    status: 'APPROVED'
  },
  {
    id: '3',
    userName: 'Mike Johnson',
    projectName: 'Database Migration',
    clientName: 'DataCorp',
    date: '2024-01-16',
    hours: 7.5,
    rate: 90,
    amount: 675,
    status: 'DRAFT'
  }
]

const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    status: 'ACTIVE',
    clientName: 'Acme Corp',
    budget: '$25,000',
    hoursLogged: 120,
    progress: 65
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS and Android app for customer engagement',
    status: 'ACTIVE',
    clientName: 'TechStart Inc',
    budget: '$45,000',
    hoursLogged: 200,
    progress: 40
  },
  {
    id: '3',
    name: 'Database Migration',
    description: 'Migrate legacy database to cloud infrastructure',
    status: 'COMPLETED',
    clientName: 'DataCorp',
    budget: '$15,000',
    hoursLogged: 80,
    progress: 100
  }
]

const mockClients = [
  {
    id: '1',
    name: 'Acme Corporation',
    contactPerson: 'Sarah Wilson',
    email: 'sarah@acme.com',
    isActive: true,
    projectsCount: 3,
    totalRevenue: '$45,000',
    createdAt: '2023-06-15'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    contactPerson: 'David Chen',
    email: 'david@techstart.com',
    isActive: true,
    projectsCount: 2,
    totalRevenue: '$32,000',
    createdAt: '2023-08-20'
  },
  {
    id: '3',
    name: 'DataCorp Solutions',
    contactPerson: 'Lisa Rodriguez',
    email: 'lisa@datacorp.com',
    isActive: false,
    projectsCount: 1,
    totalRevenue: '$15,000',
    createdAt: '2023-04-10'
  }
]

const getTimesheetStatusColor = (status: string) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getProjectStatusColor = (status: string) => {
  const colors = {
    PLANNING: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    ON_HOLD: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getClientStatusColor = (isActive: boolean) => {
  return `px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`
}

const approveTimesheet = (id: string) => {
  console.log('Approving timesheet:', id)
}

const rejectTimesheet = (id: string) => {
  console.log('Rejecting timesheet:', id)
}
</script>
