<template>
    <div>
      <Sidebar />
      <main>
        <slot />
      </main>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '../components/admin/Sidebar.vue';
  </script>
  