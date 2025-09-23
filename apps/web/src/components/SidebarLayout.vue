<template>
  <div class="min-h-screen bg-gradient-to-br from-background-cream to-brand-pink/30 flex">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-gradient-to-b from-brand-navy to-primary-800 shadow-xl border-r border-brand-teal transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
      class="fixed left-0 top-0 h-full z-50"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-brand-cyan">
        <div v-if="sidebarOpen" class="flex items-center">
          <h1 class="text-xl font-bold text-brand-cream">Global Next</h1>
        </div>
        <button
          @click="toggleSidebar"
          class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors"
        >
          <Menu v-if="sidebarOpen" class="h-5 w-5 text-brand-cyan" />
          <X v-else class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-6 px-2">
        <div class="space-y-1">
          <!-- Dashboard -->
          <Tooltip v-if="!sidebarOpen" text="Company dashboard with real-time metrics and department status" position="right">
            <router-link
              to="/"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="[
                $route.path === '/' 
                  ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                  : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
              ]"
            >
              <Home class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
              <span v-if="sidebarOpen">Dashboard</span>
            </router-link>
          </Tooltip>
          <router-link
            v-else
            to="/"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Home class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Dashboard</span>
          </router-link>

          <!-- Files -->
          <Tooltip v-if="!sidebarOpen" text="File management with virus scanning, OCR, and blockchain anchoring" position="right">
            <router-link
              to="/demo/files"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="[
                $route.path === '/demo/files' 
                  ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                  : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
              ]"
            >
              <FileText class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
              <span v-if="sidebarOpen">Files</span>
            </router-link>
          </Tooltip>
          <router-link
            v-else
            to="/demo/files"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/files' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <FileText class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Files</span>
          </router-link>

          <!-- Workflows -->
          <router-link
            to="/demo/workflows"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/workflows' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Workflow class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Workflows</span>
          </router-link>

          <!-- Tasks -->
          <router-link
            to="/demo/tasks"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/tasks' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <CheckSquare class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Tasks</span>
          </router-link>

          <!-- Notifications -->
          <router-link
            to="/demo/notifications"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/notifications' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Bell class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Notifications</span>
          </router-link>

          <!-- Marketing -->
          <router-link
            to="/demo/marketing"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/marketing' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Calendar class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Marketing</span>
          </router-link>

          <!-- Compliance -->
          <router-link
            to="/demo/compliance"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/compliance' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Shield class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Compliance</span>
          </router-link>

          <!-- HR & Finance -->
          <router-link
            to="/demo/hr-finance"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/hr-finance' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Clock class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">HR & Finance</span>
          </router-link>

          <!-- Logistics -->
          <router-link
            to="/demo/logistics"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/logistics' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Ship class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Logistics</span>
          </router-link>

          <!-- Integrations -->
          <router-link
            to="/demo/integrations"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/integrations' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Settings class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Integrations</span>
          </router-link>

          <!-- Security -->
          <router-link
            to="/demo/security"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/security' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <Lock class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Security</span>
          </router-link>

          <!-- Reporting -->
          <router-link
            to="/demo/reporting"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === '/demo/reporting' 
                ? 'bg-brand-orange/20 text-brand-orange border-l-4 border-brand-orange' 
                : 'text-brand-cream hover:bg-brand-teal/20 hover:text-brand-cyan'
            ]"
          >
            <BarChart3 class="h-5 w-5 flex-shrink-0" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" />
            <span v-if="sidebarOpen">Reporting</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div 
      :class="[
        'flex-1 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'ml-64' : 'ml-16'
      ]"
    >
      <!-- Mobile Overlay -->
      <div 
        v-if="sidebarOpen && isMobile"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>

      <!-- Page Content -->
      <div class="min-h-screen">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Tooltip from './Tooltip.vue'
import { 
  Home, 
  FileText, 
  Workflow, 
  CheckSquare, 
  Bell, 
  Calendar, 
  Shield, 
  Clock, 
  Ship, 
  Settings, 
  Lock, 
  BarChart3, 
  Menu, 
  X 
} from 'lucide-vue-next'

const sidebarOpen = ref(true)
const isMobile = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>
