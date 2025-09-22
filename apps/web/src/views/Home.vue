<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Global Next</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/demo/files"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Files
            </router-link>
            <router-link
              to="/demo/workflows"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Workflows
            </router-link>
            <router-link
              to="/demo/tasks"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Tasks
            </router-link>
            <router-link
              to="/demo/notifications"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Notifications
            </router-link>
            <router-link
              to="/demo/marketing"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Marketing
            </router-link>
            <router-link
              to="/demo/compliance"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Compliance
            </router-link>
        <router-link
          to="/demo/hr-finance"
          class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          HR & Finance
        </router-link>
        <router-link
          to="/demo/logistics"
          class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Logistics
        </router-link>
        <router-link
          to="/demo/integrations"
          class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Integrations
        </router-link>
    <router-link
      to="/demo/security"
      class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
    >
      Security
    </router-link>
    <router-link
      to="/demo/reporting"
      class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
    >
      Reporting
    </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Global Next
            <span class="text-primary-600">Unified Portal</span>
          </h1>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A comprehensive enterprise platform built with Vue.js, NestJS, and modern technologies.
            Experience file management, workflow automation, task management, and notifications in one unified interface.
          </p>
          <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div class="rounded-md shadow">
              <router-link
                to="/demo/files"
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                Explore Demo
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Key Features</h2>
          <p class="mt-4 text-lg text-gray-600">
            Built with enterprise-grade technologies and modern best practices
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary-500 text-white">
              <FileText class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">File Management</h3>
            <p class="mt-2 text-sm text-gray-500">
              Secure file upload, virus scanning, OCR processing, and blockchain anchoring
            </p>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary-500 text-white">
              <Workflow class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Workflow Automation</h3>
            <p class="mt-2 text-sm text-gray-500">
              JSON-defined workflows with approvals, SLAs, and digital signatures
            </p>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary-500 text-white">
              <CheckSquare class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Task Management</h3>
            <p class="mt-2 text-sm text-gray-500">
              Comprehensive task tracking with assignments, progress, and collaboration
            </p>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary-500 text-white">
              <Bell class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Notifications</h3>
            <p class="mt-2 text-sm text-gray-500">
              Multi-channel notifications with templating and preference management
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Consulting Modules Section -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Consulting Modules</h2>
          <p class="mt-4 text-lg text-gray-600">
            Specialized modules for marketing, compliance, and HR/finance operations
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
              <Calendar class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Marketing Dashboard</h3>
            <p class="mt-2 text-sm text-gray-500">
              Content calendar, approval workflows, and social media integrations
            </p>
            <div class="mt-4">
              <router-link
                to="/demo/marketing"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Dashboard →
              </router-link>
            </div>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-green-500 text-white">
              <Shield class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Compliance Dashboard</h3>
            <p class="mt-2 text-sm text-gray-500">
              Contract templates, e-signature, and sensitive records management
            </p>
            <div class="mt-4">
              <router-link
                to="/demo/compliance"
                class="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                View Dashboard →
              </router-link>
            </div>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-purple-500 text-white">
              <Clock class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">HR & Finance Dashboard</h3>
            <p class="mt-2 text-sm text-gray-500">
              Timesheets, project tracking, billable rates, and financial reporting
            </p>
            <div class="mt-4">
              <router-link
                to="/demo/hr-finance"
                class="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View Dashboard →
              </router-link>
            </div>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-orange-500 text-white">
              <Ship class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Logistics Dashboard</h3>
            <p class="mt-2 text-sm text-gray-500">
              Shipment tracking, container monitoring, and cost management
            </p>
            <div class="mt-4">
              <router-link
                to="/demo/logistics"
                class="text-orange-600 hover:text-orange-800 text-sm font-medium"
              >
                View Dashboard →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Integrations Section -->
      <div class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Integrations Hub & Tokenization Bridge</h2>
            <p class="mt-4 text-lg text-gray-600">
              Secure credential management, webhook delivery, and investor-safe data sharing
            </p>
          </div>

          <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div class="card p-6 text-center">
              <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
                <Key class="h-6 w-6" />
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Credential Vault</h3>
              <p class="mt-2 text-sm text-gray-500">
                Secure storage for OAuth tokens, API keys, and authentication credentials
              </p>
              <div class="mt-4">
                <router-link
                  to="/demo/integrations"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Manage Credentials →
                </router-link>
              </div>
            </div>

            <div class="card p-6 text-center">
              <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-green-500 text-white">
                <Webhook class="h-6 w-6" />
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Webhook Registry</h3>
              <p class="mt-2 text-sm text-gray-500">
                HMAC-signed webhooks with retry logic and delivery tracking
              </p>
              <div class="mt-4">
                <router-link
                  to="/demo/integrations"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Configure Webhooks →
                </router-link>
              </div>
            </div>

            <div class="card p-6 text-center">
              <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-purple-500 text-white">
                <Shield class="h-6 w-6" />
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Tokenization Bridge</h3>
              <p class="mt-2 text-sm text-gray-500">
                PII-sanitized, investor-safe data publishing with event streaming
              </p>
              <div class="mt-4">
                <router-link
                  to="/demo/integrations"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Bridge →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security & Privacy Section -->
      <div class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Security Hardening & Privacy</h2>
            <p class="mt-4 text-lg text-gray-600">
              Enterprise-grade security with PII encryption, GDPR compliance, and data lifecycle management
            </p>
          </div>

          <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div class="card p-6 text-center">
              <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
                <Lock class="h-6 w-6" />
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">PII Encryption</h3>
              <p class="mt-2 text-sm text-gray-500">
                Field-level JWE encryption with KMS envelope keys for sensitive data protection
              </p>
              <div class="mt-4">
                <router-link
                  to="/demo/security"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Security →
                </router-link>
              </div>
            </div>

            <div class="card p-6 text-center">
              <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-green-500 text-white">
                <Shield class="h-6 w-6" />
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">GDPR Compliance</h3>
              <p class="mt-2 text-sm text-gray-500">
                Consent management, data export/erasure, and retention policies with audit trails
              </p>
              <div class="mt-4">
                <router-link
                  to="/demo/security"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Manage Privacy →
                </router-link>
              </div>
            </div>

            <div class="card p-6 text-center">
              <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-purple-500 text-white">
                <Monitor class="h-6 w-6" />
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Session Management</h3>
              <p class="mt-2 text-sm text-gray-500">
                Device fingerprinting, session tracking, and rate limiting with security monitoring
              </p>
              <div class="mt-4">
                <router-link
                  to="/demo/security"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Monitor Sessions →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reporting & Analytics Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Reporting & Analytics</h2>
          <p class="mt-4 text-lg text-gray-600">
            Comprehensive KPI tracking, predictive analytics, and role-specific dashboards
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
              <BarChart3 class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">KPI Tracking</h3>
            <p class="mt-2 text-sm text-gray-500">
              Real-time KPI calculation and trend analysis across all business modules
            </p>
            <div class="mt-4">
              <router-link
                to="/demo/reporting"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View KPIs →
              </router-link>
            </div>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-green-500 text-white">
              <Brain class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Predictive Analytics</h3>
            <p class="mt-2 text-sm text-gray-500">
              ETA predictions, HS code suggestions, and demurrage risk analysis
            </p>
            <div class="mt-4">
              <router-link
                to="/demo/reporting"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Explore Analytics →
              </router-link>
            </div>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-purple-500 text-white">
              <TrendingUp class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Role Dashboards</h3>
            <p class="mt-2 text-sm text-gray-500">
              Customized dashboards for executives, logistics, consulting, and compliance teams
            </p>
            <div class="mt-4">
              <router-link
                to="/demo/reporting"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Dashboards →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Technology Stack -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Technology Stack</h2>
          <p class="mt-4 text-lg text-gray-600">
            Built with modern, enterprise-grade technologies
          </p>
        </div>

        <div class="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div class="text-center">
            <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-lg bg-green-100">
              <span class="text-2xl font-bold text-green-600">Vue</span>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Vue.js 3</h3>
            <p class="mt-2 text-sm text-gray-500">Frontend Framework</p>
          </div>

          <div class="text-center">
            <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-lg bg-red-100">
              <span class="text-2xl font-bold text-red-600">Nest</span>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">NestJS</h3>
            <p class="mt-2 text-sm text-gray-500">Backend Framework</p>
          </div>

          <div class="text-center">
            <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-lg bg-blue-100">
              <span class="text-2xl font-bold text-blue-600">TS</span>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">TypeScript</h3>
            <p class="mt-2 text-sm text-gray-500">Type Safety</p>
          </div>

          <div class="text-center">
            <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-lg bg-purple-100">
              <span class="text-2xl font-bold text-purple-600">Tailwind</span>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Tailwind CSS</h3>
            <p class="mt-2 text-sm text-gray-500">Styling</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-400">
            © 2024 Global Next. Built with Vue.js, NestJS, and modern technologies.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { FileText, Workflow, CheckSquare, Bell, Calendar, Shield, Clock, Ship, Settings, Map, Key, Webhook, Lock, Monitor, BarChart3, Brain, TrendingUp } from 'lucide-vue-next'
</script>
