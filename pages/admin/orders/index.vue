<template>
  <div class="flex h-screen bg-gray-100">
    <div class="w-16 md:w-52 flex-shrink-0 z-50">
      <Sidebar />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
        <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Order & Logistics</h1>
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            <button
              @click="switchView('order')"
              :class="tabClass('order')"
              :aria-current="activeView === 'order' ? 'page' : undefined"
            >
              Orders
            </button>
            <button
              @click="switchView('payment')"
              :class="tabClass('payment')"
              :aria-current="activeView === 'payment' ? 'page' : undefined"
            >
              Payments
            </button>
            <button
              @click="switchView('delivery')"
              :class="tabClass('delivery')"
              :aria-current="activeView === 'delivery' ? 'page' : undefined"
            >
              Deliveries
            </button>
            <button
              @click="switchView('table')"
              :class="tabClass('table')"
              :aria-current="activeView === 'table' ? 'page' : undefined"
            >
              Tables
            </button>
          </nav>
        </div>
      </div>
      <div class="flex-1 flex flex-col overflow-hidden">
        <div v-if="isLoading" class="flex-grow flex items-center justify-center p-4 md:p-8">
           <loading />
        </div>
        <div v-if="error && !isLoading" class="p-4 md:p-8">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline"> {{ error }}</span>
          </div>
        </div>
        <div v-if="!isLoading && !error" class="flex-1 overflow-auto p-4 md:p-8">
           <TableComponent
              :key="activeView"         
              :columns="currentColumns"
              :data="currentData"
              :page-size="10"          
              :is-loading="isLoading"  
              :row-key="'id'"          
              @add-new="goToAddPage"    
              class="transition-opacity duration-300"
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import TableComponent from '~/components/admin/subComponent/TableComponent.vue';
import loading from '~/components/loading.vue';
import axios from 'axios';
import Sidebar from '~/components/admin/Sidebar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeView = ref('order');
const orders = ref([]);
const payments = ref([]);
const deliveries = ref([]);
const tables = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatDateTime = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch (e) {
    return value;
  }
};

const formatCurrency = (value) => {
  const amount = Number(value);
  return !isNaN(amount) ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
}

const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ');
}

const orderColumns = ref([
  { key: 'orderType', label: 'Type', formatter: formatStatus },
  { key: 'orderDate', label: 'Date', formatter: formatDateTime },
  { key: 'totalAmount', label: 'Total', formatter: formatCurrency },
  { key: 'status', label: 'Status', formatter: formatStatus },
]);

const paymentColumns = ref([
  { key: 'paymentDate', label: 'Date', formatter: formatDateTime },
  { key: 'amount', label: 'Amount', formatter: formatCurrency },
  { key: 'method', label: 'Method', formatter: formatStatus },
  { key: 'status', label: 'Status', formatter: formatStatus },
]);

const deliveryColumns = ref([
  { key: 'deliveryDate', label: 'Date', formatter: formatDateTime },
  { key: 'status', label: 'Status', formatter: formatStatus },
  { key: 'carrier', label: 'Carrier', optional: true },
  { key: 'trackingCode', label: 'Tracking #', optional: true },
]);

const tableColumnsDefinition = ref([
  { key: 'number', label: 'Number' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'status', label: 'Status', formatter: formatStatus },
]);

const currentColumns = computed(() => {
  switch (activeView.value) {
    case 'payment': return paymentColumns.value;
    case 'delivery': return deliveryColumns.value;
    case 'table': return tableColumnsDefinition.value;
    case 'order':
    default:
      return orderColumns.value;
  }
});

const currentData = computed(() => {
   switch (activeView.value) {
    case 'payment': return payments.value;
    case 'delivery': return deliveries.value;
    case 'table': return tables.value;
    case 'order':
    default:
      return orders.value;
  }
});

const API_BASE_URL = 'http://localhost:8000';

const fetchData = async (view) => {
    if (activeView.value !== view) return;

    isLoading.value = true;
    error.value = null;

    let url = '';
    let dataRef = null;

    switch(view) {
        case 'order':
            url = `${API_BASE_URL}/order`;
            dataRef = orders;
            break;
        case 'payment':
            url = `${API_BASE_URL}/payment`;
            dataRef = payments;
            break;
        case 'delivery':
            url = `${API_BASE_URL}/delivery`;
            dataRef = deliveries;
            break;
        case 'table':
            url = `${API_BASE_URL}/table`;
            dataRef = tables;
            break;
        default:
            isLoading.value = false;
            return;
    }

    try {
        const response = await axios.get(url, { withCredentials: true });
        dataRef.value = response.data?.data || response.data || [];
    } catch (err) {
        dataRef.value = [];
        handleApiError(err, `Could not fetch ${view} data.`);
    } finally {
        if (activeView.value === view) {
            isLoading.value = false;
        }
    }
};

const fetchOrders = () => fetchData('order');
const fetchPayments = () => fetchData('payment');
const fetchDeliveries = () => fetchData('delivery');
const fetchTables = () => fetchData('table');

const handleApiError = (err, defaultMessage) => {
  if (err.response) {
    error.value = `Error ${err.response.status}: ${err.response.data?.message || defaultMessage}`;
    if (err.response.status === 401 || err.response.status === 403) {
      error.value += ' Please check your login session.';
    }
  } else if (err.request) {
    error.value = 'Network Error: Unable to connect to the server.';
  } else {
    error.value = `An unexpected error occurred: ${err.message}`;
  }
};

const switchView = (view) => {
  if (activeView.value === view || isLoading.value) return;

  activeView.value = view;
  error.value = null;

  switch(view) {
      case 'order': fetchOrders(); break;
      case 'payment': fetchPayments(); break;
      case 'delivery': fetchDeliveries(); break;
      case 'table': fetchTables(); break;
  }
};

const goToAddPage = () => {
  let route = '';
  switch (activeView.value) {
    case 'order':
      route = '/admin/orders/create';
      break;
    case 'table':
      route = '/admin/tables/create';
      break;
  }
};

const tabClass = (viewName) => [
  'whitespace-nowrap pb-3 pt-1 px-1 border-b-2 font-medium text-sm focus:outline-none',
  activeView.value === viewName
    ? 'border-black text-black'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
];

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.flex-1 {
  min-width: 0;
}
.transition-opacity {
    transition: opacity 0.3s ease-in-out;
}
.overflow-x-auto {
    -webkit-overflow-scrolling: touch;
}
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
</style>
