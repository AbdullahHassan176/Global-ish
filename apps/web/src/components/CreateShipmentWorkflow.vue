<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm" @click="close"></div>
    <div class="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-brand-cyan/20 w-full max-w-4xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-brand-navy">Create New Shipment</h2>
          <p class="text-brand-teal mt-1">Complete shipment details in {{ totalSteps }} steps</p>
        </div>
        <button @click="close" class="p-2 rounded-md hover:bg-brand-teal/20 transition-colors">
          <X class="h-5 w-5 text-brand-cyan" />
        </button>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center">
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                currentStep > index ? 'bg-brand-orange text-white' : 
                currentStep === index ? 'bg-brand-teal text-white' : 
                'bg-gray-200 text-gray-600'
              ]"
            >
              <CheckCircle v-if="currentStep > index" class="h-4 w-4" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div v-if="index < steps.length - 1" 
              :class="[
                'w-16 h-1 mx-2 transition-all duration-300',
                currentStep > index ? 'bg-brand-orange' : 'bg-gray-200'
              ]"
            ></div>
          </div>
        </div>
        <div class="flex justify-between mt-2">
          <span v-for="(step, index) in steps" :key="index" 
            :class="[
              'text-xs font-medium transition-colors',
              currentStep >= index ? 'text-brand-navy' : 'text-gray-500'
            ]"
          >
            {{ step.title }}
          </span>
        </div>
      </div>

      <!-- Step Content -->
      <div class="min-h-[400px]">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 0" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Shipment Reference</label>
              <input 
                v-model="shipmentData.reference"
                type="text" 
                placeholder="Enter shipment reference"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Shipment Type</label>
              <select 
                v-model="shipmentData.type"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select type</option>
                <option value="air">Air Freight</option>
                <option value="sea">Sea Freight</option>
                <option value="road">Road Transport</option>
                <option value="rail">Rail Transport</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Priority</label>
              <select 
                v-model="shipmentData.priority"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Estimated Value</label>
              <input 
                v-model="shipmentData.value"
                type="number" 
                placeholder="Enter estimated value"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-brand-navy mb-2">Description</label>
            <textarea 
              v-model="shipmentData.description"
              rows="3"
              placeholder="Enter shipment description"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Step 2: Origin & Destination -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Origin -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-brand-navy flex items-center">
                <MapPin class="h-5 w-5 mr-2 text-brand-orange" />
                Origin
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-2">Company/Contact</label>
                  <input 
                    v-model="shipmentData.origin.company"
                    type="text" 
                    placeholder="Enter company name"
                    class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-2">Address</label>
                  <textarea 
                    v-model="shipmentData.origin.address"
                    rows="2"
                    placeholder="Enter full address"
                    class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  ></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">City</label>
                    <input 
                      v-model="shipmentData.origin.city"
                      type="text" 
                      placeholder="City"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">Country</label>
                    <input 
                      v-model="shipmentData.origin.country"
                      type="text" 
                      placeholder="Country"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">Contact Person</label>
                    <input 
                      v-model="shipmentData.origin.contact"
                      type="text" 
                      placeholder="Contact person"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">Phone</label>
                    <input 
                      v-model="shipmentData.origin.phone"
                      type="tel" 
                      placeholder="Phone number"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Destination -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-brand-navy flex items-center">
                <MapPin class="h-5 w-5 mr-2 text-brand-teal" />
                Destination
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-2">Company/Contact</label>
                  <input 
                    v-model="shipmentData.destination.company"
                    type="text" 
                    placeholder="Enter company name"
                    class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-brand-navy mb-2">Address</label>
                  <textarea 
                    v-model="shipmentData.destination.address"
                    rows="2"
                    placeholder="Enter full address"
                    class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                  ></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">City</label>
                    <input 
                      v-model="shipmentData.destination.city"
                      type="text" 
                      placeholder="City"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">Country</label>
                    <input 
                      v-model="shipmentData.destination.country"
                      type="text" 
                      placeholder="Country"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">Contact Person</label>
                    <input 
                      v-model="shipmentData.destination.contact"
                      type="text" 
                      placeholder="Contact person"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-brand-navy mb-2">Phone</label>
                    <input 
                      v-model="shipmentData.destination.phone"
                      type="tel" 
                      placeholder="Phone number"
                      class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Cargo Details -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Cargo Type</label>
              <select 
                v-model="shipmentData.cargo.type"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select cargo type</option>
                <option value="general">General Cargo</option>
                <option value="dangerous">Dangerous Goods</option>
                <option value="perishable">Perishable</option>
                <option value="fragile">Fragile</option>
                <option value="hazardous">Hazardous</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Number of Pieces</label>
              <input 
                v-model="shipmentData.cargo.pieces"
                type="number" 
                placeholder="Enter number of pieces"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Weight (kg)</label>
              <input 
                v-model="shipmentData.cargo.weight"
                type="number" 
                placeholder="Enter weight"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Volume (m³)</label>
              <input 
                v-model="shipmentData.cargo.volume"
                type="number" 
                step="0.01"
                placeholder="Enter volume"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Dimensions (L×W×H)</label>
              <input 
                v-model="shipmentData.cargo.dimensions"
                type="text" 
                placeholder="e.g., 100×50×30 cm"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-brand-navy mb-2">Special Instructions</label>
            <textarea 
              v-model="shipmentData.cargo.instructions"
              rows="3"
              placeholder="Enter any special handling instructions"
              class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            ></textarea>
          </div>
        </div>

        <!-- Step 4: Shipping Details -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Carrier</label>
              <select 
                v-model="shipmentData.shipping.carrier"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select carrier</option>
                <option value="maersk">Maersk</option>
                <option value="msc">MSC</option>
                <option value="cma-cgm">CMA CGM</option>
                <option value="dhl">DHL</option>
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Service Level</label>
              <select 
                v-model="shipmentData.shipping.service"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              >
                <option value="">Select service</option>
                <option value="express">Express</option>
                <option value="standard">Standard</option>
                <option value="economy">Economy</option>
                <option value="overnight">Overnight</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Pickup Date</label>
              <input 
                v-model="shipmentData.shipping.pickupDate"
                type="date" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Delivery Date</label>
              <input 
                v-model="shipmentData.shipping.deliveryDate"
                type="date" 
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-brand-navy mb-2">Insurance Required</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input 
                    v-model="shipmentData.shipping.insurance"
                    type="radio" 
                    value="yes"
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">Yes</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="shipmentData.shipping.insurance"
                    type="radio" 
                    value="no"
                    class="h-4 w-4 text-brand-orange border-brand-teal/30 focus:ring-brand-orange"
                  />
                  <span class="ml-2 text-sm text-brand-navy">No</span>
                </label>
              </div>
            </div>
            <div v-if="shipmentData.shipping.insurance === 'yes'">
              <label class="block text-sm font-medium text-brand-navy mb-2">Insurance Value</label>
              <input 
                v-model="shipmentData.shipping.insuranceValue"
                type="number" 
                placeholder="Enter insurance value"
                class="w-full px-4 py-2 border border-brand-teal/30 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Step 5: Review & Submit -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 p-6 rounded-lg border border-brand-cyan/20">
            <h3 class="text-lg font-semibold text-brand-navy mb-4">Shipment Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-brand-navy mb-2">Basic Information</h4>
                <div class="space-y-1 text-sm text-brand-teal">
                  <p><strong>Reference:</strong> {{ shipmentData.reference || 'Not specified' }}</p>
                  <p><strong>Type:</strong> {{ shipmentData.type || 'Not specified' }}</p>
                  <p><strong>Priority:</strong> {{ shipmentData.priority || 'Not specified' }}</p>
                  <p><strong>Value:</strong> ${{ shipmentData.value || '0' }}</p>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-brand-navy mb-2">Route</h4>
                <div class="space-y-1 text-sm text-brand-teal">
                  <p><strong>From:</strong> {{ shipmentData.origin.city || 'Not specified' }}, {{ shipmentData.origin.country || 'Not specified' }}</p>
                  <p><strong>To:</strong> {{ shipmentData.destination.city || 'Not specified' }}, {{ shipmentData.destination.country || 'Not specified' }}</p>
                  <p><strong>Carrier:</strong> {{ shipmentData.shipping.carrier || 'Not specified' }}</p>
                  <p><strong>Service:</strong> {{ shipmentData.shipping.service || 'Not specified' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-brand-cream to-brand-pink/20 p-6 rounded-lg border border-brand-purple/20">
            <h4 class="font-medium text-brand-navy mb-2">Cargo Details</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-brand-teal">
              <div>
                <strong>Type:</strong> {{ shipmentData.cargo.type || 'Not specified' }}
              </div>
              <div>
                <strong>Pieces:</strong> {{ shipmentData.cargo.pieces || '0' }}
              </div>
              <div>
                <strong>Weight:</strong> {{ shipmentData.cargo.weight || '0' }} kg
              </div>
              <div>
                <strong>Volume:</strong> {{ shipmentData.cargo.volume || '0' }} m³
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-brand-cyan/20">
        <button 
          v-if="currentStep > 0"
          @click="previousStep"
          class="px-4 py-2 border-2 border-brand-teal text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center"
        >
          <ArrowLeft class="h-4 w-4 mr-2" />
          Previous
        </button>
        <div v-else></div>

        <div class="flex items-center space-x-3">
          <button 
            @click="close"
            class="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button 
            v-if="currentStep < totalSteps - 1"
            @click="nextStep"
            class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg"
          >
            Next
            <ArrowRight class="h-4 w-4 ml-2" />
          </button>
          <button 
            v-else
            @click="submitShipment"
            class="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-magenta text-white rounded-lg hover:from-brand-orange/90 hover:to-brand-magenta/90 transition-all duration-300 flex items-center shadow-lg"
          >
            <CheckCircle class="h-4 w-4 mr-2" />
            Create Shipment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, CheckCircle, MapPin, ArrowLeft, ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const currentStep = ref(0)
const totalSteps = 5

const steps = [
  { title: 'Basic Info' },
  { title: 'Origin & Destination' },
  { title: 'Cargo Details' },
  { title: 'Shipping Details' },
  { title: 'Review & Submit' }
]

const shipmentData = ref({
  reference: '',
  type: '',
  priority: 'normal',
  value: '',
  description: '',
  origin: {
    company: '',
    address: '',
    city: '',
    country: '',
    contact: '',
    phone: ''
  },
  destination: {
    company: '',
    address: '',
    city: '',
    country: '',
    contact: '',
    phone: ''
  },
  cargo: {
    type: '',
    pieces: '',
    weight: '',
    volume: '',
    dimensions: '',
    instructions: ''
  },
  shipping: {
    carrier: '',
    service: '',
    pickupDate: '',
    deliveryDate: '',
    insurance: 'no',
    insuranceValue: ''
  }
})

const nextStep = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const submitShipment = () => {
  console.log('Creating shipment:', shipmentData.value)
  emit('submit', shipmentData.value)
  close()
}

const close = () => {
  emit('close')
  // Reset form
  currentStep.value = 0
  shipmentData.value = {
    reference: '',
    type: '',
    priority: 'normal',
    value: '',
    description: '',
    origin: {
      company: '',
      address: '',
      city: '',
      country: '',
      contact: '',
      phone: ''
    },
    destination: {
      company: '',
      address: '',
      city: '',
      country: '',
      contact: '',
      phone: ''
    },
    cargo: {
      type: '',
      pieces: '',
      weight: '',
      volume: '',
      dimensions: '',
      instructions: ''
    },
    shipping: {
      carrier: '',
      service: '',
      pickupDate: '',
      deliveryDate: '',
      insurance: 'no',
      insuranceValue: ''
    }
  }
}
</script>
