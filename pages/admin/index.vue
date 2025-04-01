<template>
  <div class="flex h-screen bg-gray-100">
    <div class="w-16 md:w-52 flex-shrink-0 z-50">
      <Sidebar />
    </div>
    <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <i class="fas fa-spinner fa-spin text-4xl text-gray-500"></i>
      </div>
      <div v-if="error && !isLoading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> Failed to load dashboard data: {{ error }}</span>
      </div>
      <div v-if="!isLoading && !error" class="space-y-6">
        <section>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full mr-4 bg-green-100">
                  <i class="fas fa-dollar-sign fa-lg text-green-600"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Today's Sales</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(dashboardData.todaySales) }}</p>
                  <p v-if="dashboardData.salesChange" class="text-xs mt-1" :class="getChangeColor(dashboardData.salesChange)">
                    {{ dashboardData.salesChange }} vs last period
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full mr-4 bg-blue-100">
                  <i class="fas fa-receipt fa-lg text-blue-600"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Today's Orders</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.todayOrders }}</p>
                  <p v-if="dashboardData.ordersChange" class="text-xs mt-1" :class="getChangeColor(dashboardData.ordersChange)">
                    {{ dashboardData.ordersChange }} vs last period
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full mr-4 bg-yellow-100">
                  <i class="fas fa-calculator fa-lg text-yellow-600"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. Order Value</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(dashboardData.avgOrderValue) }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full mr-4 bg-red-100">
                  <i class="fas fa-hourglass-half fa-lg text-red-600"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Orders</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.pendingOrders }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div class="lg:col-span-2">
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200 h-full">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Sales Trend (Last 7 Days)</h3>
              <div class="flex items-center justify-center text-gray-400 h-64">
                <i class="fas fa-chart-line fa-3x mr-2"></i>
                <span>Chart Placeholder - Implement library here</span>
              </div>
            </div>
          </div>
          <div>
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200 h-full">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Top Selling Items</h3>
              <ul class="space-y-3 overflow-y-auto max-h-72">
                <li v-if="dashboardData.topItems.length === 0" class="text-sm text-gray-500 italic">No items to display.</li>
                <li v-for="(item, index) in dashboardData.topItems" :key="index" class="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-b-0">
                  <span>{{ item.name }}</span>
                  <span class="font-medium text-gray-700">{{ item.value }} sold</span>
                </li>
              </ul>
              <div v-if="dashboardData.topItems.length > 0" class="mt-4 text-right">
                <a href="#" class="text-sm text-gray-600 hover:text-black hover:underline">View All Items</a>
              </div>
            </div>
          </div>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200 h-full">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
              <ul class="space-y-3 overflow-y-auto max-h-72">
                <li v-if="dashboardData.recentOrders.length === 0" class="text-sm text-gray-500 italic">No recent orders.</li>
                <li v-for="(order, index) in dashboardData.recentOrders" :key="index" class="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-b-0">
                  <span>{{ order.name }}</span>
                  <span class="font-medium text-gray-700">{{ order.value }}</span>
                </li>
              </ul>
              <div v-if="dashboardData.recentOrders.length > 0" class="mt-4 text-right">
                <a href="#" class="text-sm text-gray-600 hover:text-black hover:underline">View All Orders</a>
              </div>
            </div>
          </div>
          <div>
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200 h-full">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Status Overview</h3>
              <ul class="space-y-3 overflow-y-auto max-h-72">
                <li v-if="dashboardData.orderStatus.length === 0" class="text-sm text-gray-500 italic">No status data available.</li>
                <li v-for="(status, index) in dashboardData.orderStatus" :key="index" class="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-b-0">
                  <span>{{ status.name }}</span>
                  <span class="font-medium text-gray-700">{{ status.value }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '~/components/admin/Sidebar.vue';
import axios from 'axios';

const isLoading = ref(true);
const error = ref(null);
const dashboardData = ref({
  todaySales: 0,
  salesChange: '',
  todayOrders: 0,
  ordersChange: '',
  avgOrderValue: 0,
  pendingOrders: 0,
  topItems: [],
  recentOrders: [],
  orderStatus: [],
});

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '$0.00';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return '';
  const change = ((current - previous) / previous) * 100;
  return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
};

const getChangeColor = (changeValue) => {
  if (!changeValue) return 'text-gray-500';
  if (changeValue.startsWith('+')) return 'text-green-600';
  if (changeValue.startsWith('-')) return 'text-red-600';
  return 'text-gray-500';
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockData = {
      todaySales: 1250.75,
      yesterdaySales: 1180.50,
      todayOrders: 85,
      yesterdayOrders: 92,
      pendingOrders: 5,
      topItems: [
        { name: "Cheeseburger", value: 45 },
        { name: "Large Fries", value: 60 },
        { name: "Chicken Nuggets (10pc)", value: 30 },
        { name: "Milkshake", value: 25 },
        { name: "Soda", value: 70 },
      ].sort((a, b) => b.value - a.value).slice(0, 5),
      recentOrders: [
        { name: "Order #1024", value: formatCurrency(22.50) },
        { name: "Order #1023", value: formatCurrency(15.00) },
        { name: "Order #1022 (Takeaway)", value: formatCurrency(8.75) },
        { name: "Order #1021", value: formatCurrency(31.20) },
      ].slice(0, 4),
      orderStatus: [
        { name: "Pending", value: 5 },
        { name: "Preparing", value: 8 },
        { name: "Ready for Pickup", value: 3 },
        { name: "Completed (Today)", value: 77 },
      ]
    };

    dashboardData.value.todaySales = mockData.todaySales;
    dashboardData.value.salesChange = calculateChange(mockData.todaySales, mockData.yesterdaySales);
    dashboardData.value.todayOrders = mockData.todayOrders;
    dashboardData.value.ordersChange = calculateChange(mockData.todayOrders, mockData.yesterdayOrders);
    dashboardData.value.avgOrderValue = mockData.todayOrders > 0 ? mockData.todaySales / mockData.todayOrders : 0;
    dashboardData.value.pendingOrders = mockData.pendingOrders;
    dashboardData.value.topItems = mockData.topItems;
    dashboardData.value.recentOrders = mockData.recentOrders;
    dashboardData.value.orderStatus = mockData.orderStatus;

  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      error.value = "Authentication failed. Please log in again.";
    } else {
      error.value = err.message || "An unknown error occurred while fetching data.";
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-track {
  background: #f1f1f1;
}
main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
main::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
