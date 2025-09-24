<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView />
    <!-- Global notification system -->
    <NotificationContainer />
    <ConfirmationModal />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationContainer from './components/NotificationContainer.vue'
import ConfirmationModal from './components/ConfirmationModal.vue'
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
