<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-5xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create Security Policy</h2>
          <p class="text-brand-teal mt-1">Define comprehensive security policies and access controls for your organization</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- Policy Information -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Policy Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Policy Name</label>
              <input 
                v-model="policyData.name"
                type="text" 
                placeholder="Enter policy name"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Policy Type</label>
              <select 
                v-model="policyData.type"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select policy type</option>
                <option value="access">Access Control</option>
                <option value="data">Data Protection</option>
                <option value="network">Network Security</option>
                <option value="password">Password Policy</option>
                <option value="incident">Incident Response</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Policy Description</label>
            <textarea 
              v-model="policyData.description"
              rows="3"
              placeholder="Enter policy description"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Access Controls -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Access Controls</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Authentication Method</label>
              <select 
                v-model="policyData.authenticationMethod"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select authentication method</option>
                <option value="password">Password Only</option>
                <option value="2fa">Two-Factor Authentication</option>
                <option value="mfa">Multi-Factor Authentication</option>
                <option value="sso">Single Sign-On</option>
                <option value="biometric">Biometric</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Session Timeout (minutes)</label>
              <input 
                v-model="policyData.sessionTimeout"
                type="number" 
                placeholder="Enter timeout in minutes"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Password Requirements</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label class="flex items-center">
                <input 
                  v-model="policyData.passwordRequirements.minLength"
                  type="number" 
                  placeholder="Min length"
                  class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                />
                <span class="ml-2 text-sm text-brand-navy">Min Length</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="policyData.passwordRequirements.maxLength"
                  type="number" 
                  placeholder="Max length"
                  class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                />
                <span class="ml-2 text-sm text-brand-navy">Max Length</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="policyData.passwordRequirements.requireUppercase"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Uppercase</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="policyData.passwordRequirements.requireNumbers"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Numbers</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Data Protection -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-orange/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Data Protection</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Encryption Level</label>
              <select 
                v-model="policyData.encryptionLevel"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select encryption level</option>
                <option value="aes-128">AES-128</option>
                <option value="aes-256">AES-256</option>
                <option value="rsa-2048">RSA-2048</option>
                <option value="rsa-4096">RSA-4096</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Data Retention (days)</label>
              <input 
                v-model="policyData.dataRetention"
                type="number" 
                placeholder="Enter retention period"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Data Classification</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label class="flex items-center">
                <input 
                  v-model="policyData.dataClassification.public"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Public</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="policyData.dataClassification.internal"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Internal</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="policyData.dataClassification.confidential"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Confidential</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="policyData.dataClassification.restricted"
                  type="checkbox" 
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="ml-2 text-sm text-brand-navy">Restricted</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Network Security -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-teal/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Network Security</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Firewall Rules</label>
              <textarea 
                v-model="policyData.firewallRules"
                rows="3"
                placeholder="Enter firewall rules"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">VPN Requirements</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="policyData.vpnRequirements.required"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">VPN Required</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="policyData.vpnRequirements.splitTunnel"
                    type="checkbox" 
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Split Tunnel</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Incident Response -->
        <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20 p-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-4">Incident Response</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Response Team</label>
              <input 
                v-model="policyData.responseTeam"
                type="text" 
                placeholder="Enter response team contacts"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Escalation Time (hours)</label>
              <input 
                v-model="policyData.escalationTime"
                type="number" 
                placeholder="Enter escalation time"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-brand-navy mb-2">Response Procedures</label>
            <textarea 
              v-model="policyData.responseProcedures"
              rows="3"
              placeholder="Enter incident response procedures"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <div class="text-sm text-brand-teal">
          Policy will be created and applied to the organization
        </div>
        <div class="flex space-x-3">
          <button @click="close" class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300">
            Cancel
          </button>
          <button @click="saveDraft" class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300">
            Save Draft
          </button>
          <button @click="createPolicy" class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300">
            Create Policy
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

const policyData = ref({
  name: '',
  type: '',
  description: '',
  authenticationMethod: '',
  sessionTimeout: '',
  passwordRequirements: {
    minLength: '',
    maxLength: '',
    requireUppercase: false,
    requireNumbers: false
  },
  encryptionLevel: '',
  dataRetention: '',
  dataClassification: {
    public: false,
    internal: false,
    confidential: false,
    restricted: false
  },
  firewallRules: '',
  vpnRequirements: {
    required: false,
    splitTunnel: false
  },
  responseTeam: '',
  escalationTime: '',
  responseProcedures: ''
})

const createPolicy = () => {
  if (!policyData.value.name || !policyData.value.type) {
    alert('Please fill in all required fields')
    return
  }
  
  console.log('Creating security policy:', policyData.value)
  emit('submit', policyData.value)
  close()
}

const saveDraft = () => {
  console.log('Saving policy draft:', policyData.value)
  alert('Policy draft saved successfully!')
}

const close = () => {
  emit('close')
  // Reset form
  policyData.value = {
    name: '',
    type: '',
    description: '',
    authenticationMethod: '',
    sessionTimeout: '',
    passwordRequirements: {
      minLength: '',
      maxLength: '',
      requireUppercase: false,
      requireNumbers: false
    },
    encryptionLevel: '',
    dataRetention: '',
    dataClassification: {
      public: false,
      internal: false,
      confidential: false,
      restricted: false
    },
    firewallRules: '',
    vpnRequirements: {
      required: false,
      splitTunnel: false
    },
    responseTeam: '',
    escalationTime: '',
    responseProcedures: ''
  }
}
</script>
