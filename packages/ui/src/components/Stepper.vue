<template>
  <div class="stepper">
    <div class="flex items-center justify-between">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex items-center"
        :class="{ 'flex-1': index < steps.length - 1 }"
      >
        <!-- Step Circle -->
        <div class="flex items-center">
          <div
            :class="[
              'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
              getStepClasses(step, index)
            ]"
          >
            <component
              v-if="step.icon"
              :is="step.icon"
              :class="getIconClasses(step, index)"
            />
            <span
              v-else
              :class="[
                'text-sm font-medium',
                getTextClasses(step, index)
              ]"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>

        <!-- Step Content -->
        <div class="ml-4 flex-1">
          <h3
            :class="[
              'text-sm font-medium',
              getTitleClasses(step, index)
            ]"
          >
            {{ step.title }}
          </h3>
          <p
            v-if="step.description"
            :class="[
              'text-sm mt-1',
              getDescriptionClasses(step, index)
            ]"
          >
            {{ step.description }}
          </p>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            'flex-1 h-0.5 mx-4 transition-colors duration-200',
            getConnectorClasses(index)
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Step {
  id: string
  title: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
  icon?: any
}

interface Props {
  steps: Step[]
  currentStep?: number
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 0,
  orientation: 'horizontal',
  size: 'md'
})

const getStepClasses = (step: Step, index: number) => {
  const isCurrent = index === props.currentStep
  const isCompleted = index < props.currentStep || step.status === 'completed'
  const isFailed = step.status === 'failed'
  const isSkipped = step.status === 'skipped'

  if (isFailed) {
    return 'border-red-500 bg-red-50'
  }
  if (isSkipped) {
    return 'border-gray-300 bg-gray-50'
  }
  if (isCompleted) {
    return 'border-green-500 bg-green-50'
  }
  if (isCurrent) {
    return 'border-primary-500 bg-primary-50'
  }
  return 'border-gray-300 bg-white'
}

const getIconClasses = (step: Step, index: number) => {
  const isCurrent = index === props.currentStep
  const isCompleted = index < props.currentStep || step.status === 'completed'
  const isFailed = step.status === 'failed'
  const isSkipped = step.status === 'skipped'

  if (isFailed) {
    return 'h-5 w-5 text-red-600'
  }
  if (isSkipped) {
    return 'h-5 w-5 text-gray-400'
  }
  if (isCompleted) {
    return 'h-5 w-5 text-green-600'
  }
  if (isCurrent) {
    return 'h-5 w-5 text-primary-600'
  }
  return 'h-5 w-5 text-gray-400'
}

const getTextClasses = (step: Step, index: number) => {
  const isCurrent = index === props.currentStep
  const isCompleted = index < props.currentStep || step.status === 'completed'
  const isFailed = step.status === 'failed'
  const isSkipped = step.status === 'skipped'

  if (isFailed) {
    return 'text-red-600'
  }
  if (isSkipped) {
    return 'text-gray-400'
  }
  if (isCompleted) {
    return 'text-green-600'
  }
  if (isCurrent) {
    return 'text-primary-600'
  }
  return 'text-gray-400'
}

const getTitleClasses = (step: Step, index: number) => {
  const isCurrent = index === props.currentStep
  const isCompleted = index < props.currentStep || step.status === 'completed'
  const isFailed = step.status === 'failed'
  const isSkipped = step.status === 'skipped'

  if (isFailed) {
    return 'text-red-600'
  }
  if (isSkipped) {
    return 'text-gray-400'
  }
  if (isCompleted) {
    return 'text-green-600'
  }
  if (isCurrent) {
    return 'text-primary-600'
  }
  return 'text-gray-500'
}

const getDescriptionClasses = (step: Step, index: number) => {
  const isCurrent = index === props.currentStep
  const isCompleted = index < props.currentStep || step.status === 'completed'
  const isFailed = step.status === 'failed'
  const isSkipped = step.status === 'skipped'

  if (isFailed) {
    return 'text-red-500'
  }
  if (isSkipped) {
    return 'text-gray-400'
  }
  if (isCompleted) {
    return 'text-green-500'
  }
  if (isCurrent) {
    return 'text-primary-500'
  }
  return 'text-gray-400'
}

const getConnectorClasses = (index: number) => {
  const isCompleted = index < props.currentStep
  return isCompleted ? 'bg-green-500' : 'bg-gray-300'
}
</script>

<style scoped>
.stepper {
  @apply w-full;
}
</style>
