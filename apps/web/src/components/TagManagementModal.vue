<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-brand-cyan/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-brand-navy to-brand-teal p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Tag class="h-6 w-6 text-brand-cream" />
            <h2 class="text-xl font-bold text-brand-cream">Tag Management</h2>
          </div>
          <button @click="closeModal" class="text-brand-cream hover:text-brand-orange transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Add New Tag -->
        <div class="mb-6 p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Add New Tag</h3>
          <div class="flex space-x-3">
            <input
              v-model="newTag.name"
              type="text"
              placeholder="Tag name"
              class="flex-1 px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            />
            <input
              v-model="newTag.color"
              type="color"
              class="w-12 h-10 border border-brand-teal/30 rounded-lg cursor-pointer"
            />
            <button
              @click="addTag"
              :disabled="!newTag.name.trim()"
              class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Existing Tags -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Existing Tags</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="tag in tags"
              :key="tag.id"
              class="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border border-brand-cyan/20 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  :style="{ backgroundColor: tag.color }"
                ></div>
                <span class="font-medium text-brand-navy">{{ tag.name }}</span>
                <span class="text-sm text-brand-teal">({{ tag.count }} files)</span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editTag(tag)"
                  class="p-1 text-brand-teal hover:text-brand-cyan transition-colors"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  @click="deleteTag(tag.id)"
                  class="p-1 text-brand-magenta hover:text-brand-orange transition-colors"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tag Usage Statistics -->
        <div class="p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-purple/20">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Tag Statistics</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-brand-orange">{{ tags.length }}</div>
              <div class="text-sm text-brand-teal">Total Tags</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-brand-purple">{{ totalTaggedFiles }}</div>
              <div class="text-sm text-brand-teal">Tagged Files</div>
            </div>
          </div>
        </div>

        <!-- Recent Tag Activity -->
        <div class="p-4 bg-gradient-to-r from-brand-cream to-brand-pink/20 rounded-lg border border-brand-cyan/20">
          <h3 class="text-lg font-semibold text-brand-navy mb-3">Recent Tag Activity</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 bg-white/80 rounded border border-brand-cyan/20">
              <span class="text-sm text-brand-navy">contract.pdf tagged with "legal"</span>
              <span class="text-xs text-brand-teal">2 min ago</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-white/80 rounded border border-brand-cyan/20">
              <span class="text-sm text-brand-navy">invoice_001.pdf tagged with "finance"</span>
              <span class="text-xs text-brand-teal">5 min ago</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-white/80 rounded border border-brand-cyan/20">
              <span class="text-sm text-brand-navy">New tag "confidential" created</span>
              <span class="text-xs text-brand-teal">10 min ago</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 p-4 border-t border-brand-cyan/20">
        <div class="flex justify-end space-x-3">
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
import { Tag, X, Plus, Edit, Trash2 } from 'lucide-vue-next'

interface TagItem {
  id: string
  name: string
  color: string
  count: number
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const newTag = ref({
  name: '',
  color: '#FB8465'
})

const tags = ref<TagItem[]>([
  { id: '1', name: 'contract', color: '#FB8465', count: 15 },
  { id: '2', name: 'legal', color: '#84FCFC', count: 8 },
  { id: '3', name: 'agreement', color: '#046C75', count: 12 },
  { id: '4', name: 'invoice', color: '#A85986', count: 25 },
  { id: '5', name: 'finance', color: '#D4A4BC', count: 18 },
  { id: '6', name: 'confidential', color: '#9C4474', count: 5 },
  { id: '7', name: 'draft', color: '#112552', count: 22 },
  { id: '8', name: 'approved', color: '#059669', count: 35 }
])

const totalTaggedFiles = computed(() => {
  return tags.value.reduce((sum, tag) => sum + tag.count, 0)
})

const addTag = () => {
  if (!newTag.value.name.trim()) return
  
  const tag: TagItem = {
    id: Date.now().toString(),
    name: newTag.value.name.trim(),
    color: newTag.value.color,
    count: 0
  }
  
  tags.value.push(tag)
  newTag.value = { name: '', color: '#FB8465' }
  
  console.log('Tag added:', tag)
}

const editTag = (tag: TagItem) => {
  const newName = prompt('Enter new tag name:', tag.name)
  if (newName && newName.trim() !== tag.name) {
    tag.name = newName.trim()
    console.log('Tag updated:', tag)
  }
}

const deleteTag = (tagId: string) => {
  if (confirm('Are you sure you want to delete this tag?')) {
    const index = tags.value.findIndex(tag => tag.id === tagId)
    if (index > -1) {
      tags.value.splice(index, 1)
      console.log('Tag deleted:', tagId)
    }
  }
}

const closeModal = () => {
  emit('close')
}
</script>
