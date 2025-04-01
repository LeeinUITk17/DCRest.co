<template>
    <div class="flex h-screen bg-gray-100">
      <div class="w-16 md:w-52 flex-shrink-0 z-50">
        <Sidebar />
      </div>
  
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Menu Management</h1>
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                @click="switchView('menu')"
                :class="[
                  'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none',
                  activeView === 'menu'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
                aria-current="page"
              >
                Menu Items
              </button>
              <button
                @click="switchView('category')"
                :class="[
                  'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none',
                  activeView === 'category'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
              >
                Categories
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
  const activeView = ref('menu');
  const menuItems = ref([]);
  const categories = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  
  const formatCurrency = (value) => {
    const price = Number(value);
    return !isNaN(price) ? price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
  }
  
  const formatBoolean = (value) => {
      return value ? 'Yes' : 'No';
  }
  
  const menuColumns = ref([
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', optional: true },
    { key: 'price', label: 'Price', formatter: formatCurrency },
    { key: 'categoryId', label: 'Category ID' },
    { key: 'isAvailable', label: 'Available', formatter: formatBoolean },
  ]);
  
  const categoryColumns = ref([
    { key: 'name', label: 'Name' },
  ]);
  
  const currentColumns = computed(() => {
    return activeView.value === 'menu' ? menuColumns.value : categoryColumns.value;
  });
  
  const currentData = computed(() => {
    return activeView.value === 'menu' ? menuItems.value : categories.value;
  });
  
  const API_BASE_URL = 'http://localhost:8000';
  
  const fetchMenuItems = async () => {
    if (activeView.value !== 'menu') return;
    isLoading.value = true;
    error.value = null;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/menu-items`, { withCredentials: true });
      menuItems.value = response.data?.data || response.data || [];
    } catch (err) {
      menuItems.value = [];
      handleApiError(err, 'Could not fetch menu items.');
    } finally {
       if (activeView.value === 'menu') {
          isLoading.value = false;
       }
    }
  };
  
  const fetchCategories = async () => {
    if (activeView.value !== 'category') return;
    isLoading.value = true;
    error.value = null;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/category`, { withCredentials: true });
      categories.value = response.data?.data || response.data || [];
    } catch (err) {
      categories.value = [];
      handleApiError(err, 'Could not fetch categories.');
    } finally {
      if (activeView.value === 'category') {
          isLoading.value = false;
      }
    }
  };
  
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
    if (activeView.value === view) return;
  
    activeView.value = view;
    error.value = null;
  
    if (view === 'menu') {
       fetchMenuItems();
    } else if (view === 'category') {
       fetchCategories();
    }
  };
  
  const goToAddPage = () => {
    if (activeView.value === 'menu') {
      console.log('Navigate to add new MENU ITEM page...');
    } else {
      console.log('Navigate to add new CATEGORY page...');
    }
  };
  
  onMounted(() => {
    fetchMenuItems();
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
