<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
        <p class="text-gray-600 mt-2">
          Content calendar, repository, approval flow, and social media integrations
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Calendar class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Published Content</p>
              <p class="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <Clock class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Approval</p>
              <p class="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Share2 class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Social Reach</p>
              <p class="text-2xl font-bold text-gray-900">45.2K</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'campaigns'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Campaigns
            </button>
            <button
              @click="activeTab = 'calendar'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Content Calendar
            </button>
            <button
              @click="activeTab = 'approvals'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Approvals
            </button>
            <button
              @click="activeTab = 'integrations'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Integrations
            </button>
          </nav>
        </div>
      </div>

      <!-- Campaigns Tab -->
      <div v-if="activeTab === 'campaigns'" class="space-y-6">
        <!-- Campaign Actions -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Marketing Campaigns</h2>
          <button class="btn btn-primary">
            <Plus class="h-4 w-4 mr-2" />
            Create Campaign
          </button>
        </div>

        <!-- Campaigns Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="campaign in mockCampaigns"
            :key="campaign.id"
            class="card p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ campaign.name }}</h3>
              <span :class="getCampaignStatusColor(campaign.status)">
                {{ campaign.status }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ campaign.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Start Date</span>
                <span class="font-medium">{{ campaign.startDate }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">End Date</span>
                <span class="font-medium">{{ campaign.endDate }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Budget</span>
                <span class="font-medium">{{ campaign.budget }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <FileText class="h-4 w-4" />
                  <span>{{ campaign.contentCount }} content</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Share2 class="h-4 w-4" />
                  <span>{{ campaign.integrationsCount }} platforms</span>
                </div>
              </div>
              <button class="btn btn-outline btn-sm">View Details</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Calendar Tab -->
      <div v-if="activeTab === 'calendar'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Content Calendar</h2>
          <div class="flex items-center space-x-4">
            <select class="input">
              <option>All Campaigns</option>
              <option>Q1 2024 Campaign</option>
              <option>Product Launch</option>
            </select>
            <button class="btn btn-primary">
              <Plus class="h-4 w-4 mr-2" />
              Schedule Content
            </button>
          </div>
        </div>

        <!-- Calendar View -->
        <div class="card p-6">
          <div class="grid grid-cols-7 gap-4 mb-4">
            <div class="text-center font-medium text-gray-500">Mon</div>
            <div class="text-center font-medium text-gray-500">Tue</div>
            <div class="text-center font-medium text-gray-500">Wed</div>
            <div class="text-center font-medium text-gray-500">Thu</div>
            <div class="text-center font-medium text-gray-500">Fri</div>
            <div class="text-center font-medium text-gray-500">Sat</div>
            <div class="text-center font-medium text-gray-500">Sun</div>
          </div>
          
          <div class="grid grid-cols-7 gap-4">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              class="min-h-24 p-2 border border-gray-200 rounded-lg"
            >
              <div class="text-sm font-medium text-gray-900 mb-2">{{ day.day }}</div>
              <div class="space-y-1">
                <div
                  v-for="content in day.content"
                  :key="content.id"
                  :class="[
                    'text-xs p-1 rounded cursor-pointer',
                    getContentTypeColor(content.type)
                  ]"
                >
                  {{ content.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Approvals Tab -->
      <div v-if="activeTab === 'approvals'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Content Approvals</h2>
          <div class="flex items-center space-x-2">
            <button
              @click="approvalFilter = 'all'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                approvalFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              All
            </button>
            <button
              @click="approvalFilter = 'pending'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                approvalFilter === 'pending'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Pending
            </button>
            <button
              @click="approvalFilter = 'approved'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                approvalFilter === 'approved'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Approved
            </button>
          </div>
        </div>

        <!-- Approvals List -->
        <div class="card">
          <div class="divide-y divide-gray-200">
            <div
              v-for="approval in filteredApprovals"
              :key="approval.id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ approval.contentTitle }}</h3>
                    <span :class="getContentTypeColor(approval.contentType)">
                      {{ approval.contentType }}
                    </span>
                    <span :class="getApprovalStatusColor(approval.status)">
                      {{ approval.status }}
                    </span>
                  </div>
                  
                  <p class="text-gray-600 mb-3">{{ approval.contentDescription }}</p>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <User class="h-4 w-4" />
                      <span>Creator: {{ approval.creatorName }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Calendar class="h-4 w-4" />
                      <span>Scheduled: {{ approval.scheduledAt }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Share2 class="h-4 w-4" />
                      <span>Platform: {{ approval.platform }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button
                    v-if="approval.status === 'PENDING'"
                    @click="approveContent(approval.id)"
                    class="btn btn-primary btn-sm"
                  >
                    <CheckCircle class="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    v-if="approval.status === 'PENDING'"
                    @click="rejectContent(approval.id)"
                    class="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                  >
                    <XCircle class="h-4 w-4 mr-1" />
                    Reject
                  </button>
                  <button class="btn btn-outline btn-sm">
                    View Details
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
          <h2 class="text-xl font-semibold text-gray-900">Social Media Integrations</h2>
          <button class="btn btn-primary">
            <Plus class="h-4 w-4 mr-2" />
            Add Integration
          </button>
        </div>

        <!-- Integrations Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="integration in mockIntegrations"
            :key="integration.platform"
            class="card p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div :class="`p-2 rounded-lg ${getPlatformColor(integration.platform)}`">
                  <component :is="getPlatformIcon(integration.platform)" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900">{{ integration.platform }}</h3>
              </div>
              <span :class="getIntegrationStatusColor(integration.status)">
                {{ integration.status }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ integration.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Connected Account</span>
                <span class="font-medium">{{ integration.accountName }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Last Sync</span>
                <span class="font-medium">{{ integration.lastSync }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Posts Today</span>
                <span class="font-medium">{{ integration.postsToday }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                v-if="integration.status === 'INACTIVE'"
                class="btn btn-primary btn-sm flex-1"
              >
                Connect
              </button>
              <button
                v-else
                class="btn btn-outline btn-sm flex-1"
              >
                Manage
              </button>
              <button class="btn btn-outline btn-sm">
                <Settings class="h-4 w-4" />
              </button>
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
              <Calendar class="h-4 w-4 text-blue-600" />
              <span>Content calendar with scheduling and publishing</span>
            </li>
            <li class="flex items-center space-x-2">
              <CheckCircle class="h-4 w-4 text-green-600" />
              <span>Multi-level approval workflow (Creator → Manager → Client)</span>
            </li>
            <li class="flex items-center space-x-2">
              <Share2 class="h-4 w-4 text-purple-600" />
              <span>Social media integrations (LinkedIn, Instagram, Google Ads)</span>
            </li>
            <li class="flex items-center space-x-2">
              <FileText class="h-4 w-4 text-orange-600" />
              <span>Content repository with design.com template picker</span>
            </li>
            <li class="flex items-center space-x-2">
              <BarChart3 class="h-4 w-4 text-red-600" />
              <span>Analytics and performance tracking</span>
            </li>
          </ul>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Integration Platforms</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Linkedin class="h-4 w-4 text-blue-600" />
                </div>
                <span class="font-medium">LinkedIn</span>
              </div>
              <span class="text-sm text-gray-600">Professional networking</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Instagram class="h-4 w-4 text-pink-600" />
                </div>
                <span class="font-medium">Instagram</span>
              </div>
              <span class="text-sm text-gray-600">Visual content</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign class="h-4 w-4 text-green-600" />
                </div>
                <span class="font-medium">Google Ads</span>
              </div>
              <span class="text-sm text-gray-600">Paid advertising</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Facebook class="h-4 w-4 text-blue-600" />
                </div>
                <span class="font-medium">Facebook</span>
              </div>
              <span class="text-sm text-gray-600">Social media</span>
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
  Calendar, 
  CheckCircle, 
  Clock, 
  Share2, 
  Plus, 
  FileText, 
  User, 
  XCircle, 
  Settings,
  BarChart3,
  Linkedin,
  Instagram,
  DollarSign,
  Facebook
} from 'lucide-vue-next'

const activeTab = ref<'campaigns' | 'calendar' | 'approvals' | 'integrations'>('campaigns')
const approvalFilter = ref<'all' | 'pending' | 'approved'>('all')

const mockCampaigns = [
  {
    id: '1',
    name: 'Q1 2024 Product Launch',
    description: 'Comprehensive marketing campaign for new product launch',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    budget: '$50,000',
    contentCount: 24,
    integrationsCount: 3
  },
  {
    id: '2',
    name: 'Brand Awareness Campaign',
    description: 'Increase brand visibility across social platforms',
    status: 'ACTIVE',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: '$25,000',
    contentCount: 18,
    integrationsCount: 4
  },
  {
    id: '3',
    name: 'Holiday Special Promotion',
    description: 'End-of-year promotional campaign',
    status: 'COMPLETED',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    budget: '$30,000',
    contentCount: 32,
    integrationsCount: 2
  }
]

const mockApprovals = [
  {
    id: '1',
    contentTitle: 'Product Launch Announcement',
    contentDescription: 'Exciting news! Our new product is now available...',
    contentType: 'POST',
    status: 'PENDING',
    creatorName: 'John Doe',
    scheduledAt: '2024-01-20 10:00',
    platform: 'LinkedIn'
  },
  {
    id: '2',
    contentTitle: 'Behind the Scenes Video',
    contentDescription: 'Take a look at how we develop our products...',
    contentType: 'VIDEO',
    status: 'APPROVED',
    creatorName: 'Jane Smith',
    scheduledAt: '2024-01-22 14:00',
    platform: 'Instagram'
  },
  {
    id: '3',
    contentTitle: 'Industry Insights Article',
    contentDescription: 'Latest trends in our industry...',
    contentType: 'ARTICLE',
    status: 'PENDING',
    creatorName: 'Mike Johnson',
    scheduledAt: '2024-01-25 09:00',
    platform: 'LinkedIn'
  }
]

const mockIntegrations = [
  {
    platform: 'LinkedIn',
    status: 'ACTIVE',
    description: 'Professional networking and B2B content',
    accountName: '@companyname',
    lastSync: '2 hours ago',
    postsToday: 3
  },
  {
    platform: 'Instagram',
    status: 'ACTIVE',
    description: 'Visual content and brand storytelling',
    accountName: '@companyname',
    lastSync: '1 hour ago',
    postsToday: 2
  },
  {
    platform: 'Google Ads',
    status: 'INACTIVE',
    description: 'Paid advertising campaigns',
    accountName: 'Not connected',
    lastSync: 'Never',
    postsToday: 0
  },
  {
    platform: 'Facebook',
    status: 'ACTIVE',
    description: 'Social media engagement',
    accountName: '@companyname',
    lastSync: '30 minutes ago',
    postsToday: 1
  }
]

const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    days.push({
      day: date.getDate(),
      date: date.toISOString(),
      content: i % 3 === 0 ? [
        { id: `${i}-1`, title: 'Product Post', type: 'POST' },
        { id: `${i}-2`, title: 'Video', type: 'VIDEO' }
      ] : []
    })
  }
  
  return days
})

const filteredApprovals = computed(() => {
  if (approvalFilter.value === 'all') return mockApprovals
  return mockApprovals.filter(approval => 
    approval.status.toLowerCase() === approvalFilter.value.toUpperCase()
  )
})

const getCampaignStatusColor = (status: string) => {
  const colors = {
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
    DRAFT: 'bg-gray-100 text-gray-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getContentTypeColor = (type: string) => {
  const colors = {
    POST: 'bg-blue-100 text-blue-800',
    VIDEO: 'bg-purple-100 text-purple-800',
    ARTICLE: 'bg-green-100 text-green-800',
    IMAGE: 'bg-pink-100 text-pink-800'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getApprovalStatusColor = (status: string) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getIntegrationStatusColor = (status: string) => {
  const colors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    ERROR: 'bg-red-100 text-red-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
}

const getPlatformColor = (platform: string) => {
  const colors = {
    LinkedIn: 'bg-blue-100',
    Instagram: 'bg-pink-100',
    'Google Ads': 'bg-green-100',
    Facebook: 'bg-blue-100'
  }
  return colors[platform as keyof typeof colors] || 'bg-gray-100'
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'LinkedIn':
      return Linkedin
    case 'Instagram':
      return Instagram
    case 'Google Ads':
      return DollarSign
    case 'Facebook':
      return Facebook
    default:
      return Share2
  }
}

const approveContent = (id: string) => {
  console.log('Approving content:', id)
}

const rejectContent = (id: string) => {
  console.log('Rejecting content:', id)
}
</script>
