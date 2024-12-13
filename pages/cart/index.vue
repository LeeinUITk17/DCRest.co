<template>
  <div>
    <loading v-if="isLoading" />
    <div v-else class="min-h-screen flex flex-col">
      <CartList />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CartList from '~/components/cartList.vue';
import loading from '~/components/loading.vue';
const isLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

