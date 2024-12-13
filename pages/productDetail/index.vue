<template>
  <loading v-if="isLoading" />
  <ProductDetail v-else :product="product" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductDetail from '@/components/ProductDetail.vue';
import loading from '~/components/loading.vue';
const isLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>
