<template>
  <div class="bg-white p-6 shadow-lg rounded-lg mt-6">
    <h3 class="text-4xl text-center font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">DC Locations in HCM</h3>
    <ul>
      <li
        v-for="(location, index) in storeAddress"
        :key="index"
        class="mb-4 p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100 rounded-lg"
        @click="selectAddress(location)"
      >
        <h4 class="font-semibold text-lg text-red-400">{{ location.name }}</h4>
        <p class="text-gray-600">{{ location.address }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeAddress } from '~/data/storeAddress';
import type { StoreAddress } from '~/data/storeAddress';
export default defineComponent({
  data() {
    return {
      storeAddress, 
    };
  },
  methods: {
    selectAddress(location: StoreAddress) {
      this.$emit('address-selected', location.address);
    },
  },
});
</script>


<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
</style>