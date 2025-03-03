<template>
    <div>
      <router-link
        v-if="!hasChildren"
        :to="to"
        class="flex items-center p-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition rounded-md"
      >
        <i :class="`fas fa-${icon} w-6`"></i>
        <span class="ml-2">{{ label }}</span>
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
  