<template>
    <a :href="link" class="group block">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 ease-in-out h-full flex flex-col">
        <div v-if="iconSvg" class="w-10 h-10 p-2 bg-indigo-100 text-indigo-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300" v-html="iconSvg"></div>
        <div v-else class="w-10 h-10 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
             <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
           </svg>
         </div>
        <div class="flex-grow">
          <h3 class="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors">{{ title }}</h3>
          <p class="text-sm text-gray-600 leading-relaxed">{{ description }}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end">
          <span class="text-sm font-medium text-indigo-600 group-hover:text-indigo-800 flex items-center">
            Manage
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconSvg: { type: String, required: false, default: '' },
    link: { type: String, required: true },
  });
  </script>
  
  <style scoped>
  </style>
