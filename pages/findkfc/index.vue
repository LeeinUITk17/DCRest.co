<template>
  <div>
    <loading v-if="isLoading" />
    <div v-else class="min-h-screen flex flex-col items-center justify-center">
      <div class="bg-white mt-16 shadow-lg rounded-lg w-full h-full p-2">
        <findAddress />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import findAddress from '~/components/findAddress.vue';
import loading from '~/components/loading.vue';
const isLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

