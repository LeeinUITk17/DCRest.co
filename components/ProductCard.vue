<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105 duration-300 ease-in-out max-w-xs">
    <img :src="imageSrc" alt="Product image" class="w-full h-64 object-cover" />
    <div class="p-4">
      <h3 class="text-xl font-semibold text-gray-800">{{ name }}</h3>
      <p class="text-gray-600 mt-2">{{ description }}</p>
      <p class="text-2xl font-bold text-gray-800 mt-4">{{ price }}</p>
    </div>
    <nuxt-link
      :to="{
        path: '/productDetail',
        query: {
          id: id,
          name: name,
          description: description,
          price: price,
          imageSrc: imageSrc,
        },
      }"
      class="block text-center bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white py-2 mt-4 font-medium hover:bg-red-600 transition duration-200 ease-in-out"
    >
      Buy
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  id: number; 
  name: string;
  description: string;
  price: string;
  imageSrc: string;
}>();
</script>
