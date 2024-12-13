<template>
  <div class="bg-white p-6 shadow rounded-lg">
    <h2 class="text-2xl font-bold mb-4 text-red-600">Order Information</h2>
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-700">Recipient Details</h3>
      <p class="text-gray-600">Name: {{ recipientName }}</p>
      <p class="text-gray-600">Phone: {{ recipientPhone }}</p>
    </div>
    <div v-if="availableAddresses.length" class="mb-4">
      <h3 class="text-lg font-semibold text-gray-700">Delivery Address</h3>
      <select
        v-model="selectedAddressIndex"
        class="border p-2 rounded mb-4 w-full"
      >
        <option
          v-for="(addr, index) in availableAddresses"
          :key="index"
          :value="index"
        >
          {{ addr.street }}, {{ addr.city }}, {{ addr.state }} {{ addr.zip }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAddressStore } from '~/store/addressStore';
import Swal from 'sweetalert2';
const addressStore = useAddressStore();
onMounted(() => {
  addressStore.loadAddressesFromLocalStorage();
});
const recipientName = ref('Lê Thanh Tài');
const recipientPhone = ref('0356356497');
const availableAddresses = addressStore.addresses;
const selectedAddressIndex = ref(0);
const address = computed(() => {
  return availableAddresses[selectedAddressIndex.value] || {
    street: '',
    city: '',
    state: '',
    zip: '',
  };
});
onMounted(() => {
  if (!availableAddresses.length) {
    Swal.fire({
      title: 'No Address Found',
      text: 'Please update your address in your profile.',
      icon: 'warning',
      confirmButtonText: 'Go to Profile',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/profile/address';
      }
    });
  }
});
</script>
