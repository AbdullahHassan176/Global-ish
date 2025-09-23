<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-5xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create New Integration</h2>
          <p class="text-brand-teal mt-1">Connect external services and APIs to streamline your workflow</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Integration Details -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Integration Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Integration Name</label>
              <input 
                v-model="integrationData.name"
                type="text" 
                placeholder="Enter integration name"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Integration Type</label>
              <select 
                v-model="integrationData.type"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select integration type</option>
                <option value="api">API Integration</option>
                <option value="webhook">Webhook</option>
                <option value="database">Database</option>
                <option value="file">File Transfer</option>
                <option value="email">Email Service</option>
                <option value="sms">SMS Service</option>
                <option value="payment">Payment Gateway</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Description</label>
            <textarea 
              v-model="integrationData.description"
              rows="3"
              placeholder="Enter integration description"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Service Configuration -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Service Configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Service Provider</label>
              <select 
                v-model="integrationData.serviceProvider"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select service provider</option>
                <option value="salesforce">Salesforce</option>
                <option value="hubspot">HubSpot</option>
                <option value="zapier">Zapier</option>
                <option value="slack">Slack</option>
                <option value="microsoft">Microsoft</option>
                <option value="google">Google</option>
                <option value="aws">AWS</option>
                <option value="custom">Custom API</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Authentication Method</label>
              <select 
                v-model="integrationData.authenticationMethod"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select authentication method</option>
                <option value="oauth2">OAuth 2.0</option>
                <option value="api-key">API Key</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="jwt">JWT</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Endpoint URL</label>
            <input 
              v-model="integrationData.endpointUrl"
              type="url" 
              placeholder="Enter endpoint URL"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            />
          </div>
        </div>

        <!-- API Configuration -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">API Configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">API Key</label>
              <input 
                v-model="integrationData.apiKey"
                type="password" 
                placeholder="Enter API key"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Secret Key</label>
              <input 
                v-model="integrationData.secretKey"
                type="password" 
                placeholder="Enter secret key"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Client ID</label>
              <input 
                v-model="integrationData.clientId"
                type="text" 
                placeholder="Enter client ID"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Client Secret</label>
              <input 
                v-model="integrationData.clientSecret"
                type="password" 
                placeholder="Enter client secret"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Data Mapping -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Data Mapping</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Data Fields</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-brand-navy mb-1">Source Field</label>
                  <input 
                    v-model="integrationData.dataMapping.sourceField"
                    type="text" 
                    placeholder="Enter source field"
                    class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm text-brand-navy mb-1">Target Field</label>
                  <input 
                    v-model="integrationData.dataMapping.targetField"
                    type="text" 
                    placeholder="Enter target field"
                    class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Data Transformation</label>
              <select 
                v-model="integrationData.dataTransformation"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select transformation</option>
                <option value="none">No Transformation</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
                <option value="trim">Trim Whitespace</option>
                <option value="format">Format Date</option>
                <option value="custom">Custom Function</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sync Settings -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Sync Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Sync Frequency</label>
              <select 
                v-model="integrationData.syncFrequency"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select sync frequency</option>
                <option value="realtime">Real-time</option>
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="30min">Every 30 minutes</option>
                <option value="1hour">Every hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual only</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Sync Direction</label>
              <select 
                v-model="integrationData.syncDirection"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select sync direction</option>
                <option value="inbound">Inbound Only</option>
                <option value="outbound">Outbound Only</option>
                <option value="bidirectional">Bidirectional</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input 
                  v-model="integrationData.autoSync"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Enable auto-sync</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="integrationData.errorHandling"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Enable error handling</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="integrationData.logging"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Enable logging</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Integration will be created and tested for connectivity
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="testConnection" class="px-4 py-2 border-2 border-brand-orange text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all duration-300">
            Test Connection
          </button>
          <button @click="createIntegration" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Create Integration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const integrationData = ref({
  name: '',
  type: '',
  description: '',
  serviceProvider: '',
  authenticationMethod: '',
  endpointUrl: '',
  apiKey: '',
  secretKey: '',
  clientId: '',
  clientSecret: '',
  dataMapping: {
    sourceField: '',
    targetField: ''
  },
  dataTransformation: '',
  syncFrequency: '',
  syncDirection: '',
  autoSync: false,
  errorHandling: true,
  logging: true
})

const testConnection = () => {
  console.log('Testing connection for integration:', integrationData.value)
  alert('Testing connection... This may take a few moments.')
}

const createIntegration = () => {
  if (!integrationData.value.name || !integrationData.value.type) {
    alert('Please fill in all required fields')
    return
  }
  
  console.log('Creating integration:', integrationData.value)
  emit('submit', integrationData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving integration draft:', integrationData.value)
  alert('Integration draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  integrationData.value = {
    name: '',
    type: '',
    description: '',
    serviceProvider: '',
    authenticationMethod: '',
    endpointUrl: '',
    apiKey: '',
    secretKey: '',
    clientId: '',
    clientSecret: '',
    dataMapping: {
      sourceField: '',
      targetField: ''
    },
    dataTransformation: '',
    syncFrequency: '',
    syncDirection: '',
    autoSync: false,
    errorHandling: true,
    logging: true
  }
}
</script>
