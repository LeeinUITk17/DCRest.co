<template>
  <div>
    <loading v-if="isLoading" />
    <div v-else class="mx-auto">
      <div class="shadow-lg rounded-lg mt-6 p-2 w-full">
        <bookParty />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookParty from '~/components/bookParty.vue';
import loading from '~/components/loading.vue';
const isLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>


