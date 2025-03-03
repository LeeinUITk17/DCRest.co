<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-red-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl text-center border-4 border-yellow-500">
      <h1 class="text-3xl font-bold text-red-600 mb-4">🍟 Pending Approval 🍔</h1>
      <p class="text-lg text-gray-700 mb-6">Your request is under review. Choose an option below.</p>

      <div class="flex gap-4">
        <NuxtLink
          to="/home"
          class="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition-transform transform hover:scale-105"
        >
          🍕 Review My Store
        </NuxtLink>
        <NuxtLink
          to="/admin"
          class="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
        >
          🍔 Go to Admin Page
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NuxtLink } from '#components';
</script>

<style scoped>
/* K. */
</style>