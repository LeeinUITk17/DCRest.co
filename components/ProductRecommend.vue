<template>
  <div class="recommend-list">
    <h2 class="text-2xl text-center font-bold text-gray-500 mb-10">Recommended Products</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in recommendedProducts"
        :id="product.id"
        :name="product.name"
        :description="product.description"
        :price="product.price"
        :imageSrc="product.imageSrc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ProductCard from './ProductCard.vue';
import { combodata } from '../data/combodata';

const allProducts = combodata.flatMap(combo => combo.products);

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const recommendedProducts = ref(shuffleArray(allProducts).slice(0, 4));
</script>

<style scoped>
.recommend-list img {
  transition: transform 0.3s ease-in-out;
}
.recommend-list img:hover {
  transform: scale(1.05);
}
</style>