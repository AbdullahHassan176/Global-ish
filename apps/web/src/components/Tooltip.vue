<template>
  <div class="relative inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot />
    <div
      v-if="isVisible"
      :class="[
        'absolute z-50 px-3 py-2 text-sm text-white bg-brand-navy rounded-lg shadow-lg border border-brand-cyan/20 backdrop-blur-sm',
        positionClasses
      ]"
      :style="tooltipStyle"
    >
      <div class="relative">
        {{ text }}
        <!-- Arrow -->
        <div
          :class="[
            'absolute w-2 h-2 bg-brand-navy transform rotate-45',
            arrowClasses
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}>()

const isVisible = ref(false)
let timeoutId: NodeJS.Timeout | null = null

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    default:
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
  }
})

const arrowClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
    case 'bottom':
      return 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1'
    case 'left':
      return 'left-full top-1/2 transform -translate-y-1/2 -ml-1'
    case 'right':
      return 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
    default:
      return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
  }
})

const tooltipStyle = computed(() => {
  const maxWidth = 'max-w-xs'
  return { maxWidth }
})

const showTooltip = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    isVisible.value = true
  }, props.delay || 300)
}

const hideTooltip = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  isVisible.value = false
}
</script>
