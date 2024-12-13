<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="relative flex items-center justify-center w-32 h-32 rounded-full bg-orange-400 animate-pulse-circle">
        <div class="space-y-1">
          <div
            class="w-10 h-2 bg-orange-700 rounded animate-bounce-hamburger"
          ></div>
          <div
            class="w-10 h-1 bg-gray-700 rounded animate-bounce-hamburger"
          ></div>
          <div
            class="w-10 h-2 bg-orange-700 rounded animate-bounce-hamburger"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoadingPage",
  };
  </script>
  
  <style scoped>
  </style>
  