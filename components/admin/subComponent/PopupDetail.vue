<template>
    <div
      v-if="visible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl shadow-xl w-1/2 relative max-h-[80vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
          @click="close"
        >
          &times;
        </button>
  
        <h2 class="text-xl font-semibold mb-4">Chi tiết thông tin</h2>
  
        <!-- Data Display -->
        <div class="space-y-2">
          <div
            v-for="(value, key) in data"
            :key="key"
          >
            <div v-if="typeof value === 'object'">
              <p class="font-medium">{{ key }}:</p>
              <div class="pl-4">
                <div v-for="(subValue, subKey) in value" :key="subKey">
                  <p>{{ subKey }}: {{ subValue }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <p><strong>{{ key }}:</strong> {{ value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    visible: Boolean,
    data: Object,
    close: Function,
  });
  </script>
  