<template>
  <div class="flex h-screen">
    <div class="w-16 md:w-52 flex-shrink-0 z-50">
      <Sidebar />
    </div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center p-10">
      <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
      <span class="ml-3 text-gray-600">Loading orders...</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <!-- Data Table -->
    <div class="flex-1 overflow-auto p-4 md:p-8 transition-all duration-300 ">
    <TableComponent
      v-if="!isLoading && !error"
      :columns="tableColumns"
      :data="orders"
      :page-size="10"
      @add-new="goToCreateOrder"
    />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableComponent from '~/components/admin/subComponent/TableComponent.vue';
import Cookies from 'js-cookie'; // Import js-cookie
import axios from 'axios';
import Sidebar from '~/components/admin/Sidebar.vue';

const orders = ref([]);
const isLoading = ref(false);
const error = ref(null);

const tableColumns = ref([
  { key: 'id', label: 'Order ID' },
  { key: 'orderType', label: 'Type' },
  { key: 'userId', label: 'User ID' },
  { key: 'tableId', label: 'Table ID' },
  { key: 'status', label: 'Status' },
  { key: 'totalAmount', label: 'Total Amount' },
  { key: 'createdAt', label: 'Created At' },
]);

const fetchOrders = async () => {
  isLoading.value = true;
  error.value = null;
  orders.value = [];

  try {
    const token = Cookies.get('accessToken'); // Retrieve accessToken from cookies
    console.log('Token:', token); // Debugging line to check the token value
    // if (!token) {
    //   throw new Error('Authentication token not found.');
    // }

    const response = await axios.get('http://localhost:8000/order', {
        headers: {
            'Content-Type': 'application/json',
            include: 'credentials',
        },
        withCredentials: true, 
    });
    console.log('Response:', response); // Debugging line to check the response
    

    const data = await response.data;
    orders.value = data;
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    error.value = err.message || 'Could not fetch order data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>