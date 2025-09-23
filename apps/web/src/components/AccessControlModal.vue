<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-brand-cyan/20 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-brand-navy to-brand-purple p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Shield class="h-6 w-6 text-brand-cream" />
            <h2 class="text-xl font-bold text-brand-cream">Access Control Management</h2>
          </div>
          <button @click="closeModal" class="text-brand-cream hover:text-brand-orange transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- File Selection -->
        <div class="mb-6 p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Select Files</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="file in selectedFiles"
              :key="file.id"
              class="flex items-center space-x-3 p-3 bg-white/80 backdrop-blur-sm border border-brand-cyan/20 rounded-lg"
            >
              <FileText class="h-5 w-5 text-brand-teal" />
              <div class="flex-1">
                <div class="font-medium text-brand-navy">{{ file.name }}</div>
                <div class="text-sm text-brand-teal">{{ file.accessLevel }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Role-Based Permissions -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Role-Based Permissions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="role in roles"
              :key="role.id"
              class="p-4 bg-white/80 backdrop-blur-sm border border-brand-cyan/20 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: role.color }"
                ></div>
                <h4 class="font-semibold text-brand-navy">{{ role.name }}</h4>
              </div>
              <div class="space-y-2">
                <label
                  v-for="permission in role.permissions"
                  :key="permission.id"
                  class="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    v-model="permission.enabled"
                    type="checkbox"
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                  />
                  <span class="text-sm text-brand-navy">{{ permission.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Access Level Configuration -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Access Level Configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20">
              <h4 class="font-semibold text-brand-navy mb-3">Current Access Levels</h4>
              <div class="space-y-2">
                <div
                  v-for="level in accessLevels"
                  :key="level.id"
                  class="flex items-center justify-between p-2 bg-white/80 rounded border border-brand-cyan/20"
                >
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: level.color }"
                    ></div>
                    <span class="text-sm font-medium text-brand-navy">{{ level.name }}</span>
                  </div>
                  <span class="text-xs text-brand-teal">{{ level.count }} files</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20">
              <h4 class="font-semibold text-brand-navy mb-3">Bulk Access Changes</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-1">Change Access Level To:</label>
                  <select
                    v-model="bulkAccessLevel"
                    class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="private">Private</option>
                    <option value="confidential">Confidential</option>
                  </select>
                </div>
                <button
                  @click="applyBulkAccess"
                  class="w-full px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
                >
                  Apply to Selected Files
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="mb-6 p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Security Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  v-model="securitySettings.requireAuth"
                  type="checkbox"
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="text-sm text-brand-navy">Require Authentication</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  v-model="securitySettings.auditLog"
                  type="checkbox"
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="text-sm text-brand-navy">Enable Audit Logging</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  v-model="securitySettings.encryption"
                  type="checkbox"
                  class="h-4 w-4 text-brand-orange border-brand-teal/30 rounded focus:ring-brand-orange"
                />
                <span class="text-sm text-brand-navy">Enable Encryption</span>
              </label>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-brand-navy mb-1">Session Timeout (minutes):</label>
                <input
                  v-model="securitySettings.sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-brand-navy mb-1">Max Download Attempts:</label>
                <input
                  v-model="securitySettings.maxDownloads"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full px-3 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Access Statistics -->
        <div class="p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Access Statistics</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-brand-orange">{{ totalFiles }}</div>
              <div class="text-sm text-brand-teal">Total Files</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-brand-purple">{{ publicFiles }}</div>
              <div class="text-sm text-brand-teal">Public Files</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-brand-cyan">{{ privateFiles }}</div>
              <div class="text-sm text-brand-teal">Private Files</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-brand-magenta">{{ confidentialFiles }}</div>
              <div class="text-sm text-brand-teal">Confidential</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 p-4 border-t border-brand-cyan/20">
        <div class="flex justify-end space-x-3">
          <button
            @click="saveSettings"
            class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300"
          >
            Save Settings
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Shield, X, FileText } from 'lucide-vue-next'

interface FileItem {
  id: string
  name: string
  accessLevel: string
}

interface Role {
  id: string
  name: string
  color: string
  permissions: Permission[]
}

interface Permission {
  id: string
  name: string
  enabled: boolean
}

interface AccessLevel {
  id: string
  name: string
  color: string
  count: number
}

const props = defineProps<{
  isOpen: boolean
  selectedFiles: FileItem[]
}>()

const emit = defineEmits<{
  close: []
  save: [settings: any]
}>()

const bulkAccessLevel = ref('internal')

const roles = ref<Role[]>([
  {
    id: '1',
    name: 'Admin',
    color: '#FB8465',
    permissions: [
      { id: '1', name: 'View Files', enabled: true },
      { id: '2', name: 'Upload Files', enabled: true },
      { id: '3', name: 'Delete Files', enabled: true },
      { id: '4', name: 'Manage Access', enabled: true },
      { id: '5', name: 'View Audit Logs', enabled: true }
    ]
  },
  {
    id: '2',
    name: 'Manager',
    color: '#84FCFC',
    permissions: [
      { id: '1', name: 'View Files', enabled: true },
      { id: '2', name: 'Upload Files', enabled: true },
      { id: '3', name: 'Delete Files', enabled: false },
      { id: '4', name: 'Manage Access', enabled: false },
      { id: '5', name: 'View Audit Logs', enabled: true }
    ]
  },
  {
    id: '3',
    name: 'User',
    color: '#046C75',
    permissions: [
      { id: '1', name: 'View Files', enabled: true },
      { id: '2', name: 'Upload Files', enabled: true },
      { id: '3', name: 'Delete Files', enabled: false },
      { id: '4', name: 'Manage Access', enabled: false },
      { id: '5', name: 'View Audit Logs', enabled: false }
    ]
  }
])

const accessLevels = ref<AccessLevel[]>([
  { id: '1', name: 'Public', color: '#059669', count: 45 },
  { id: '2', name: 'Internal', color: '#84FCFC', count: 120 },
  { id: '3', name: 'Private', color: '#A85986', count: 85 },
  { id: '4', name: 'Confidential', color: '#9C4474', count: 12 }
])

const securitySettings = ref({
  requireAuth: true,
  auditLog: true,
  encryption: true,
  sessionTimeout: 30,
  maxDownloads: 3
})

const totalFiles = computed(() => {
  return accessLevels.value.reduce((sum, level) => sum + level.count, 0)
})

const publicFiles = computed(() => {
  return accessLevels.value.find(level => level.name === 'Public')?.count || 0
})

const privateFiles = computed(() => {
  return accessLevels.value.find(level => level.name === 'Private')?.count || 0
})

const confidentialFiles = computed(() => {
  return accessLevels.value.find(level => level.name === 'Confidential')?.count || 0
})

const applyBulkAccess = () => {
  console.log(`Applying ${bulkAccessLevel.value} access level to ${props.selectedFiles.length} files`)
  alert(`Access level changed to ${bulkAccessLevel.value} for selected files`)
}

const saveSettings = () => {
  const settings = {
    roles: roles.value,
    accessLevels: accessLevels.value,
    securitySettings: securitySettings.value,
    bulkAccessLevel: bulkAccessLevel.value
  }
  
  emit('save', settings)
  console.log('Access control settings saved:', settings)
  alert('Access control settings saved successfully!')
}

const closeModal = () => {
  emit('close')
}
</script>
