<template>
  <div class="flex h-screen bg-gray-100">
    <div class="w-16 md:w-52 flex-shrink-0 z-50">
      <Sidebar />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
        <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Customer Management</h1>
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              @click="switchView('customer')"
              :class="[
                'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none',
                activeView === 'customer'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
              :aria-current="activeView === 'customer' ? 'page' : undefined"
            >
              Customers
            </button>
            <button
              @click="switchView('review')"
              :class="[
                'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none',
                activeView === 'review'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
              :aria-current="activeView === 'review' ? 'page' : undefined"
            >
              Reviews
            </button>
            <button
              @click="switchView('reservation')"
              :class="[
                'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none',
                activeView === 'reservation'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
              :aria-current="activeView === 'reservation' ? 'page' : undefined"
            >
              Reservations
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
const activeView = ref('customer');
const customers = ref([]);
const reviews = ref([]);
const reservations = ref([]);
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

const formatBoolean = (value) => {
    return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
};

const customerColumns = ref([
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone', optional: true },
  { key: 'userTier', label: 'Tier' },
  { key: 'point', label: 'Points' },
  { key: 'createdAt', label: 'Joined At', formatter: formatDateTime },
]);

const reviewColumns = ref([
  { key: 'id', label: 'Review ID'},
  { key: 'userId', label: 'User ID' },
  { key: 'orderId', label: 'Order ID', optional: true },
  { key: 'rating', label: 'Rating' },
  { key: 'comment', label: 'Comment' },
  { key: 'createdAt', label: 'Date', formatter: formatDateTime },
]);

const reservationColumns = ref([
  { key: 'id', label: 'Res. ID' },
  { key: 'userId', label: 'User ID' },
  { key: 'orderId', label: 'Order ID', optional: true },
  { key: 'reservationTime', label: 'Time', formatter: formatDateTime },
  { key: 'status', label: 'Status' },
]);

const currentColumns = computed(() => {
  switch (activeView.value) {
    case 'review': return reviewColumns.value;
    case 'reservation': return reservationColumns.value;
    case 'customer':
    default:
      return customerColumns.value;
  }
});

const currentData = computed(() => {
   switch (activeView.value) {
    case 'review': return reviews.value;
    case 'reservation': return reservations.value;
    case 'customer':
    default:
      return customers.value;
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
        case 'customer':
            url = `${API_BASE_URL}/users`;
            dataRef = customers;
            break;
        case 'review':
            url = `${API_BASE_URL}/review`;
            dataRef = reviews;
            break;
        case 'reservation':
            url = `${API_BASE_URL}/reservation`;
            dataRef = reservations;
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

const fetchCustomers = () => fetchData('customer');
const fetchReviews = () => fetchData('review');
const fetchReservations = () => fetchData('reservation');

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
      case 'customer':
          fetchCustomers();
          break;
      case 'review':
          fetchReviews();
          break;
      case 'reservation':
          fetchReservations();
          break;
  }
};

const goToAddPage = () => {
  let route = '';
  switch (activeView.value) {
    case 'customer':
      route = '/admin/customers/create';
      break;
    case 'review':
      route = '/admin/reviews/create';
      break;
    case 'reservation':
      route = '/admin/reservations/create';
      break;
  }
};

onMounted(() => {
  fetchCustomers();
});
</script>

<style scoped>
.flex-1 {
  min-width: 0;
}
.transition-opacity {
    transition: opacity 0.3s ease-in-out;
}
</style>
