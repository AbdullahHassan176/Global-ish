<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Edit Credential</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Credential Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  placeholder="e.g., Salesforce Production"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                <select
                  v-model="formData.provider"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Provider</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="slack">Slack</option>
                  <option value="microsoft">Microsoft</option>
                  <option value="google">Google</option>
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  <option value="github">GitHub</option>
                  <option value="jira">Jira</option>
                  <option value="confluence">Confluence</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Credential Type</label>
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="OAUTH2">OAuth2</option>
                  <option value="API_KEY">API Key</option>
                  <option value="BASIC_AUTH">Basic Auth</option>
                  <option value="JWT">JWT Token</option>
                  <option value="BEARER">Bearer Token</option>
                  <option value="CERTIFICATE">Certificate</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                <select
                  v-model="formData.environment"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  <option value="PRODUCTION">Production</option>
                  <option value="STAGING">Staging</option>
                  <option value="DEVELOPMENT">Development</option>
                  <option value="TESTING">Testing</option>
                </select>
              </div>
            </div>

            <!-- Authentication Details -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Authentication Details</h3>
              <div class="space-y-4">
                <div v-if="formData.type === 'OAUTH2'">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                      <input
                        v-model="formData.clientId"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter client ID"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                      <input
                        v-model="formData.clientSecret"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter client secret"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Authorization URL</label>
                    <input
                      v-model="formData.authUrl"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="https://login.salesforce.com/services/oauth2/authorize"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Token URL</label>
                    <input
                      v-model="formData.tokenUrl"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="https://login.salesforce.com/services/oauth2/token"
                    />
                  </div>
                </div>

                <div v-else-if="formData.type === 'API_KEY'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      v-model="formData.apiKey"
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter API key"
                    />
                  </div>
                </div>

                <div v-else-if="formData.type === 'BASIC_AUTH'">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        v-model="formData.username"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        v-model="formData.password"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                </div>

                <div v-else-if="formData.type === 'JWT' || formData.type === 'BEARER'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Token</label>
                    <textarea
                      v-model="formData.token"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter token"
                    ></textarea>
                  </div>
                </div>

                <div v-else-if="formData.type === 'CERTIFICATE'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Certificate</label>
                    <textarea
                      v-model="formData.certificate"
                      rows="6"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Paste certificate content"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
                    <input
                      v-model="formData.baseUrl"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="https://api.provider.com"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                    <input
                      v-model="formData.timeout"
                      type="number"
                      min="1"
                      max="300"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                    <input
                      v-model="formData.expirationDate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Refresh Token (if applicable)</label>
                    <input
                      v-model="formData.refreshToken"
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                      placeholder="Enter refresh token"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Settings -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.encryptAtRest"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Encrypt credentials at rest</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.autoRotate"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Enable automatic credential rotation</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.auditLogging"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Enable audit logging</label>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <select
                    v-model="formData.accessLevel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                  >
                    <option value="READ_ONLY">Read Only</option>
                    <option value="READ_WRITE">Read/Write</option>
                    <option value="ADMIN">Admin</option>
                    <option value="FULL_ACCESS">Full Access</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Additional Settings -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Settings</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="Optional description for this credential"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    v-model="formData.tags"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                    placeholder="production, api, integration (comma-separated)"
                  />
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Activate credential</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleDelete"
              class="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Delete
            </button>
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
            >
              Update Credential
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface Credential {
  id: string
  name: string
  provider: string
  type: string
  environment: string
  clientId: string
  clientSecret: string
  authUrl: string
  tokenUrl: string
  apiKey: string
  username: string
  password: string
  token: string
  certificate: string
  baseUrl: string
  timeout: number
  expirationDate: string
  refreshToken: string
  encryptAtRest: boolean
  autoRotate: boolean
  auditLogging: boolean
  accessLevel: string
  description: string
  tags: string
  isActive: boolean
}

const props = defineProps<{
  isOpen: boolean
  credential?: Credential
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Credential]
  saveDraft: [data: Credential]
  delete: [id: string]
}>()

const formData = reactive<Credential>({
  id: '',
  name: '',
  provider: '',
  type: '',
  environment: 'PRODUCTION',
  clientId: '',
  clientSecret: '',
  authUrl: '',
  tokenUrl: '',
  apiKey: '',
  username: '',
  password: '',
  token: '',
  certificate: '',
  baseUrl: '',
  timeout: 30,
  expirationDate: '',
  refreshToken: '',
  encryptAtRest: true,
  autoRotate: false,
  auditLogging: true,
  accessLevel: 'READ_WRITE',
  description: '',
  tags: '',
  isActive: true
})

// Watch for credential prop changes
watch(() => props.credential, (newCredential) => {
  if (newCredential) {
    Object.assign(formData, newCredential)
  }
}, { immediate: true })

const handleSubmit = () => {
  const credentialData = {
    ...formData,
    updatedAt: new Date().toISOString()
  }
  emit('submit', credentialData)
}

const handleSaveDraft = () => {
  const credentialData = {
    ...formData,
    status: 'DRAFT',
    updatedAt: new Date().toISOString()
  }
  emit('saveDraft', credentialData)
}

const handleDelete = () => {
  emit('delete', formData.id)
}

const close = () => {
  emit('close')
}
</script>
