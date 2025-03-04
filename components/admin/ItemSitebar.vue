<template>
  <div>
    <router-link
      :to="to"
      class="flex items-center justify-center md:justify-start p-3 mx-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors rounded-lg group"
    >
      <i :class="`fas fa-${icon} text-lg w-6 transition-transform group-hover:scale-110`"></i>
      <span class="ml-2 hidden md:inline text-sm font-medium">{{ label }}</span>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  to: { type: String, default: '' }
});
</script>