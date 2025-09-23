<template>
  <SidebarLayout>
    <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/20 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Security & Privacy Center</h1>
        <p class="text-gray-600 mt-2">
          Manage security settings, privacy controls, and compliance monitoring
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Shield class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Sessions</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeSessions }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <Lock class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Trusted Devices</p>
              <p class="text-2xl font-bold text-gray-900">{{ trustedDevices }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Security Events</p>
              <p class="text-2xl font-bold text-gray-900">{{ securityEvents }}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <CheckCircle class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Compliance Score</p>
              <p class="text-2xl font-bold text-gray-900">{{ complianceScore }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'sessions'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'sessions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Sessions & Devices
            </button>
            <button
              @click="activeTab = 'privacy'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'privacy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Privacy Controls
            </button>
            <button
              @click="activeTab = 'data-lifecycle'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'data-lifecycle'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Data Lifecycle
            </button>
            <button
              @click="activeTab = 'security-events'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'security-events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Security Events
            </button>
            <button
              @click="activeTab = 'compliance'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'compliance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Compliance
            </button>
          </nav>
        </div>
      </div>

      <!-- Sessions & Devices Tab -->
      <div v-if="activeTab === 'sessions'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Active Sessions</h2>
          <button @click="revokeAllSessions" class="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300">
            <LogOut class="h-4 w-4 mr-2" />
            Revoke All Sessions
          </button>
        </div>

        <!-- Sessions List -->
        <div class="space-y-4">
          <div
            v-for="session in mockSessions"
            :key="session.id"
            class="card p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${getDeviceTypeColor(session.deviceType)}`">
                  <component :is="getDeviceTypeIcon(session.deviceType)" class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ session.deviceName || 'Unknown Device' }}</h3>
                  <p class="text-sm text-gray-500">{{ session.browserName }} on {{ session.osName }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="session.isCurrent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ session.isCurrent ? 'Current' : 'Active' }}
                </span>
                <button @click="revokeSession(session.id)" class="px-3 py-1 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 text-sm">
                  <LogOut class="h-4 w-4 mr-1" />
                  Revoke
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Session Info</h4>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">IP Address</span>
                    <span class="text-gray-900">{{ session.ipAddress }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Last Activity</span>
                    <span class="text-gray-900">{{ formatTimeAgo(session.lastActivityAt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Expires</span>
                    <span class="text-gray-900">{{ formatTimeAgo(session.expiresAt) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-2">Device Info</h4>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Type</span>
                    <span class="text-gray-900">{{ session.deviceType }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">OS</span>
                    <span class="text-gray-900">{{ session.osName }} {{ session.osVersion }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Browser</span>
                    <span class="text-gray-900">{{ session.browserName }} {{ session.browserVersion }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-2">Security</h4>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Trusted</span>
                    <span :class="session.isTrusted ? 'text-green-600' : 'text-yellow-600'">
                      {{ session.isTrusted ? 'Yes' : 'No' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Location</span>
                    <span class="text-gray-900">{{ session.location || 'Unknown' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Created</span>
                    <span class="text-gray-900">{{ formatDate(session.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Controls Tab -->
      <div v-if="activeTab === 'privacy'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Privacy Controls</h2>
          <button @click="exportData" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Download class="h-4 w-4 mr-2" />
            Export My Data
          </button>
        </div>

        <!-- Consent Management -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Consent Management</h3>
          <div class="space-y-4">
            <div
              v-for="consent in mockConsents"
              :key="consent.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ consent.purpose }}</h4>
                <p class="text-sm text-gray-500">{{ consent.description }}</p>
                <p class="text-xs text-gray-400 mt-1">Legal basis: {{ consent.legalBasis }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">{{ consent.lastUpdated }}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="consent.isGranted"
                    type="checkbox"
                    class="sr-only peer"
                    @change="updateConsent(consent.id, consent.isGranted)"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Export/Erase -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
            <p class="text-sm text-gray-600 mb-4">
              Download a copy of all your personal data in a machine-readable format.
            </p>
            <button @click="requestDataExport" class="w-full px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center justify-center">
              <Download class="h-4 w-4 mr-2" />
              Request Data Export
            </button>
          </div>

          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Erasure</h3>
            <p class="text-sm text-gray-600 mb-4">
              Request complete deletion of your personal data from our systems.
            </p>
            <button @click="requestDataErasure" class="w-full px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center">
              <Trash2 class="h-4 w-4 mr-2" />
              Request Data Erasure
            </button>
          </div>
        </div>
      </div>

      <!-- Data Lifecycle Tab -->
      <div v-if="activeTab === 'data-lifecycle'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Data Lifecycle Management</h2>
          <button @click="showRetentionPolicyModal = true" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <Plus class="h-4 w-4 mr-2" />
            Add Retention Policy
          </button>
        </div>

        <!-- Retention Policies -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Retention Policies</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retention Period
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auto Delete
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Legal Basis
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="policy in mockRetentionPolicies" :key="policy.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ policy.recordType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ policy.retentionPeriod }} days
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="policy.autoDelete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ policy.autoDelete ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ policy.legalBasis }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button class="text-blue-600 hover:text-blue-900">Edit</button>
                      <button class="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Data Lifecycle Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6">
            <h4 class="font-medium text-gray-900 mb-2">Total Records</h4>
            <p class="text-3xl font-bold text-gray-900">{{ totalRecords.toLocaleString() }}</p>
            <p class="text-sm text-gray-500 mt-1">Across all record types</p>
          </div>

          <div class="card p-6">
            <h4 class="font-medium text-gray-900 mb-2">Expired Records</h4>
            <p class="text-3xl font-bold text-yellow-600">{{ expiredRecords.toLocaleString() }}</p>
            <p class="text-sm text-gray-500 mt-1">Ready for deletion</p>
          </div>

          <div class="card p-6">
            <h4 class="font-medium text-gray-900 mb-2">Scheduled Deletions</h4>
            <p class="text-3xl font-bold text-red-600">{{ scheduledDeletions.toLocaleString() }}</p>
            <p class="text-sm text-gray-500 mt-1">Next cleanup cycle</p>
          </div>
        </div>
      </div>

      <!-- Security Events Tab -->
      <div v-if="activeTab === 'security-events'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Security Events</h2>
          <div class="flex items-center space-x-4">
            <select class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300">
              <option>All Severity</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button @click="handleRefresh" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center">
              <RefreshCw class="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <!-- Security Events Table -->
        <div class="card">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="event in mockSecurityEvents" :key="event.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ event.eventType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getSeverityColor(event.severity)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ event.severity }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ event.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ event.ipAddress }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(event.timestamp) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="event.isResolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ event.isResolved ? 'Resolved' : 'Open' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Compliance Tab -->
      <div v-if="activeTab === 'compliance'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Compliance Dashboard</h2>
          <button @click="generateComplianceReport" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg">
            <FileText class="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>

        <!-- Compliance Score -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Overall Compliance Score</h3>
          <div class="flex items-center space-x-6">
            <div class="relative w-32 h-32">
              <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (complianceScore / 100) * circumference"
                  class="text-green-500"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-bold text-gray-900">{{ complianceScore }}%</span>
              </div>
            </div>
            <div class="flex-1">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Data Protection</span>
                  <span class="text-sm font-medium text-green-600">95%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Consent Management</span>
                  <span class="text-sm font-medium text-green-600">88%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Data Lifecycle</span>
                  <span class="text-sm font-medium text-yellow-600">72%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Security Controls</span>
                  <span class="text-sm font-medium text-green-600">91%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compliance Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card p-6">
            <h4 class="font-medium text-gray-900 mb-2">GDPR Compliance</h4>
            <p class="text-3xl font-bold text-green-600">98%</p>
            <p class="text-sm text-gray-500 mt-1">Last audit: 2 days ago</p>
          </div>

          <div class="card p-6">
            <h4 class="font-medium text-gray-900 mb-2">CCPA Compliance</h4>
            <p class="text-3xl font-bold text-green-600">95%</p>
            <p class="text-sm text-gray-500 mt-1">Last audit: 1 week ago</p>
          </div>

          <div class="card p-6">
            <h4 class="font-medium text-gray-900 mb-2">SOC 2 Type II</h4>
            <p class="text-3xl font-bold text-yellow-600">87%</p>
            <p class="text-sm text-gray-500 mt-1">Last audit: 1 month ago</p>
          </div>

          <div class="card p-6">
            <h4 class="font-medium text-gray-900 mb-2">ISO 27001</h4>
            <p class="text-3xl font-bold text-green-600">92%</p>
            <p class="text-sm text-gray-500 mt-1">Last audit: 2 weeks ago</p>
          </div>
        </div>

        <!-- Recent Audit Logs -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Audit Logs</h3>
          <div class="space-y-3">
            <div
              v-for="log in mockAuditLogs"
              :key="log.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div :class="`w-2 h-2 rounded-full ${getLogLevelColor(log.level)}`"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ log.action }}</p>
                  <p class="text-xs text-gray-500">{{ log.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-900">{{ log.user }}</p>
                <p class="text-xs text-gray-500">{{ formatTimeAgo(log.timestamp) }}</p>
              </div>
            </div>
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
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  LogOut, 
  Download, 
  Trash2, 
  Plus, 
  RefreshCw, 
  FileText,
  Monitor,
  Smartphone,
  Tablet,
  Laptop
} from 'lucide-vue-next'

const activeTab = ref<'sessions' | 'privacy' | 'data-lifecycle' | 'security-events' | 'compliance'>('sessions')
const showRetentionPolicyModal = ref(false)

// Mock data
const mockSessions = ref([
  {
    id: '1',
    deviceName: 'MacBook Pro',
    deviceType: 'DESKTOP',
    browserName: 'Chrome',
    browserVersion: '120.0.0.0',
    osName: 'macOS',
    osVersion: '14.2',
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    isCurrent: true,
    isTrusted: true,
    lastActivityAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000), // 19 hours from now
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    deviceName: 'iPhone 15',
    deviceType: 'MOBILE',
    browserName: 'Safari',
    browserVersion: '17.2',
    osName: 'iOS',
    osVersion: '17.2',
    ipAddress: '192.168.1.101',
    location: 'San Francisco, CA',
    isCurrent: false,
    isTrusted: true,
    lastActivityAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours from now
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    deviceName: 'Unknown Device',
    deviceType: 'TABLET',
    browserName: 'Chrome',
    browserVersion: '120.0.0.0',
    osName: 'Android',
    osVersion: '14',
    ipAddress: '203.0.113.42',
    location: 'New York, NY',
    isCurrent: false,
    isTrusted: false,
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  }
])

const mockConsents = ref([
  {
    id: '1',
    purpose: 'Data Processing',
    description: 'Processing of personal data for service provision',
    legalBasis: 'Contract',
    isGranted: true,
    lastUpdated: '2 days ago'
  },
  {
    id: '2',
    purpose: 'Marketing Communications',
    description: 'Sending promotional emails and notifications',
    legalBasis: 'Consent',
    isGranted: false,
    lastUpdated: '1 week ago'
  },
  {
    id: '3',
    purpose: 'Analytics',
    description: 'Usage analytics and performance monitoring',
    legalBasis: 'Legitimate Interest',
    isGranted: true,
    lastUpdated: '3 days ago'
  },
  {
    id: '4',
    purpose: 'Third Party Sharing',
    description: 'Sharing data with trusted partners',
    legalBasis: 'Consent',
    isGranted: false,
    lastUpdated: '1 month ago'
  }
])

const mockRetentionPolicies = ref([
  {
    id: '1',
    recordType: 'User Profile',
    retentionPeriod: 2555, // 7 years
    autoDelete: false,
    legalBasis: 'Legal Obligation'
  },
  {
    id: '2',
    recordType: 'Session Data',
    retentionPeriod: 90,
    autoDelete: true,
    legalBasis: 'Legitimate Interest'
  },
  {
    id: '3',
    recordType: 'Audit Logs',
    retentionPeriod: 2555, // 7 years
    autoDelete: false,
    legalBasis: 'Legal Obligation'
  },
  {
    id: '4',
    recordType: 'Marketing Data',
    retentionPeriod: 365,
    autoDelete: true,
    legalBasis: 'Consent'
  }
])

const mockSecurityEvents = ref([
  {
    id: '1',
    eventType: 'LOGIN_SUCCESS',
    severity: 'LOW',
    description: 'Successful login from trusted device',
    ipAddress: '192.168.1.100',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isResolved: true
  },
  {
    id: '2',
    eventType: 'SUSPICIOUS_ACTIVITY',
    severity: 'MEDIUM',
    description: 'Login attempt from new location',
    ipAddress: '203.0.113.42',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isResolved: false
  },
  {
    id: '3',
    eventType: 'RATE_LIMIT_EXCEEDED',
    severity: 'HIGH',
    description: 'Multiple failed login attempts detected',
    ipAddress: '198.51.100.1',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isResolved: true
  },
  {
    id: '4',
    eventType: 'DATA_EXPORT',
    severity: 'LOW',
    description: 'User requested data export',
    ipAddress: '192.168.1.100',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isResolved: true
  }
])

const mockAuditLogs = ref([
  {
    id: '1',
    action: 'Data Export Request',
    description: 'User requested personal data export',
    user: 'john.doe@example.com',
    level: 'INFO',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    action: 'Consent Updated',
    description: 'Marketing consent withdrawn',
    user: 'jane.smith@example.com',
    level: 'INFO',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    action: 'Security Scan',
    description: 'Automated security scan completed',
    user: 'system',
    level: 'INFO',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    action: 'Data Retention Policy Updated',
    description: 'Retention period changed for user data',
    user: 'admin@example.com',
    level: 'WARN',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
])

// Computed properties
const activeSessions = computed(() => mockSessions.value.filter(s => s.isCurrent || new Date(s.expiresAt) > new Date()).length)
const trustedDevices = computed(() => mockSessions.value.filter(s => s.isTrusted).length)
const securityEvents = computed(() => mockSecurityEvents.value.filter(e => !e.isResolved).length)
const complianceScore = computed(() => 89)

const totalRecords = computed(() => 1250000)
const expiredRecords = computed(() => 45000)
const scheduledDeletions = computed(() => 12000)

const circumference = computed(() => 2 * Math.PI * 40) // radius = 40

// Methods
const revokeSession = (sessionId: string) => {
  const session = mockSessions.value.find(s => s.id === sessionId)
  if (session) {
    session.isCurrent = false
    // In real app, this would call the API
    console.log(`Revoking session: ${sessionId}`)
  }
}

const revokeAllSessions = () => {
  mockSessions.value.forEach(session => {
    session.isCurrent = false
  })
  // In real app, this would call the API
  console.log('Revoking all sessions')
}

const updateConsent = (consentId: string, isGranted: boolean) => {
  const consent = mockConsents.value.find(c => c.id === consentId)
  if (consent) {
    consent.isGranted = isGranted
    consent.lastUpdated = 'Just now'
    // In real app, this would call the API
    console.log(`Updating consent ${consentId}: ${isGranted}`)
  }
}

const exportData = () => {
  // In real app, this would trigger data export
  console.log('Exporting user data')
}

const requestDataExport = () => {
  // In real app, this would create a data export request
  console.log('Requesting data export')
}

const requestDataErasure = () => {
  // In real app, this would create a data erasure request
  console.log('Requesting data erasure')
}

const generateComplianceReport = () => {
  // In real app, this would generate a compliance report
  console.log('Generating compliance report')
}

const getDeviceTypeColor = (deviceType: string) => {
  const colors = {
    DESKTOP: 'bg-blue-500',
    MOBILE: 'bg-green-500',
    TABLET: 'bg-purple-500',
    UNKNOWN: 'bg-gray-500'
  }
  return colors[deviceType] || 'bg-gray-500'
}

const getDeviceTypeIcon = (deviceType: string) => {
  const icons = {
    DESKTOP: Monitor,
    MOBILE: Smartphone,
    TABLET: Tablet,
    UNKNOWN: Laptop
  }
  return icons[deviceType] || Laptop
}

const getSeverityColor = (severity: string) => {
  const colors = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800'
  }
  return colors[severity] || 'bg-gray-100 text-gray-800'
}

const getLogLevelColor = (level: string) => {
  const colors = {
    INFO: 'bg-blue-500',
    WARN: 'bg-yellow-500',
    ERROR: 'bg-red-500',
    DEBUG: 'bg-gray-500'
  }
  return colors[level] || 'bg-gray-500'
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

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Button click handlers
const handleRefresh = () => {
  console.log('Refresh clicked')
  alert('Security events refreshed!')
}
</script>
