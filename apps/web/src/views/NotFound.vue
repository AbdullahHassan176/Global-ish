<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-primary-600">404</h1>
        <h2 class="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p class="mt-2 text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <div class="mt-6">
          <router-link
            to="/"
            class="btn btn-primary"
          >
            Go Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script>
