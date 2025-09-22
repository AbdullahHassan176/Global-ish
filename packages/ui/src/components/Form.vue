<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div
      v-for="field in fields"
      :key="field.name"
      class="form-field"
    >
      <!-- Label -->
      <label
        v-if="field.label"
        :for="field.name"
        class="label"
        :class="{ 'text-red-600': errors[field.name] }"
      >
        {{ field.label }}
        <span v-if="field.required" class="text-red-500 ml-1">*</span>
      </label>

      <!-- Input Field -->
      <div class="relative">
        <!-- Text Input -->
        <input
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
          :id="field.name"
          :type="field.type"
          :name="field.name"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :value="modelValue[field.name]"
          @input="updateValue(field.name, ($event.target as HTMLInputElement).value)"
          class="input"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors[field.name] }"
        />

        <!-- Textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          :name="field.name"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :rows="field.rows || 3"
          :value="modelValue[field.name]"
          @input="updateValue(field.name, ($event.target as HTMLTextAreaElement).value)"
          class="input resize-none"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors[field.name] }"
        />

        <!-- Select -->
        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          :name="field.name"
          :required="field.required"
          :disabled="field.disabled"
          :value="modelValue[field.name]"
          @change="updateValue(field.name, ($event.target as HTMLSelectElement).value)"
          class="input"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors[field.name] }"
        >
          <option value="" disabled>{{ field.placeholder || 'Select an option' }}</option>
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Checkbox -->
        <div
          v-else-if="field.type === 'checkbox'"
          class="flex items-center space-x-2"
        >
          <input
            :id="field.name"
            :name="field.name"
            type="checkbox"
            :checked="modelValue[field.name]"
            @change="updateValue(field.name, ($event.target as HTMLInputElement).checked)"
            class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label :for="field.name" class="text-sm text-gray-700">
            {{ field.label }}
          </label>
        </div>

        <!-- Radio Group -->
        <div
          v-else-if="field.type === 'radio'"
          class="space-y-2"
        >
          <div
            v-for="option in field.options"
            :key="option.value"
            class="flex items-center space-x-2"
          >
            <input
              :id="`${field.name}-${option.value}`"
              :name="field.name"
              type="radio"
              :value="option.value"
              :checked="modelValue[field.name] === option.value"
              @change="updateValue(field.name, option.value)"
              class="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <label :for="`${field.name}-${option.value}`" class="text-sm text-gray-700">
              {{ option.label }}
            </label>
          </div>
        </div>

        <!-- File Input -->
        <input
          v-else-if="field.type === 'file'"
          :id="field.name"
          :name="field.name"
          type="file"
          :required="field.required"
          :disabled="field.disabled"
          :accept="field.accept"
          @change="handleFileChange(field.name, $event)"
          class="input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>

      <!-- Error Message -->
      <p v-if="errors[field.name]" class="error">
        {{ errors[field.name] }}
      </p>

      <!-- Help Text -->
      <p v-if="field.help && !errors[field.name]" class="text-sm text-gray-500 mt-1">
        {{ field.help }}
      </p>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
      <button
        v-if="showCancel"
        type="button"
        @click="handleCancel"
        class="btn btn-outline"
      >
        {{ cancelText }}
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="btn btn-primary"
        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
      >
        <span v-if="isSubmitting" class="animate-spin mr-2">⟳</span>
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormField {
  name: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  help?: string
  rows?: number
  accept?: string
  options?: Array<{ value: string; label: string }>
}

interface Props {
  fields: FormField[]
  modelValue: Record<string, any>
  errors?: Record<string, string>
  isSubmitting?: boolean
  showCancel?: boolean
  submitText?: string
  cancelText?: string
}

interface Emits {
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', value: Record<string, any>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
  isSubmitting: false,
  showCancel: false,
  submitText: 'Submit',
  cancelText: 'Cancel'
})

const emit = defineEmits<Emits>()

const updateValue = (fieldName: string, value: any) => {
  const newValue = { ...props.modelValue, [fieldName]: value }
  emit('update:modelValue', newValue)
}

const handleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  updateValue(fieldName, file)
}

const handleSubmit = () => {
  emit('submit', props.modelValue)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.form-field {
  @apply space-y-1;
}
</style>
