<template>
    <div class="flex h-screen bg-gray-100">
      <div class="w-16 md:w-52 flex-shrink-0 z-50">
        <Sidebar />
      </div>
  
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Promotions Management</h1>
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              <button
                @click="switchView('coupon')"
                :class="tabClass('coupon')"
                :aria-current="activeView === 'coupon' ? 'page' : undefined"
              >
                Coupons
              </button>
              <button
                @click="switchView('pool')"
                :class="tabClass('pool')"
                :aria-current="activeView === 'pool' ? 'page' : undefined"
              >
                Coupon Pools
              </button>
               <button
                @click="switchView('campaign')"
                :class="tabClass('campaign')"
                :aria-current="activeView === 'campaign' ? 'page' : undefined"
              >
                Campaigns
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
  const activeView = ref('coupon');
  const coupons = ref([]);
  const couponPools = ref([]);
  const campaigns = ref([]);
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
  
  const formatBoolean = (value) => {
      return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  };
  
  const formatTypeOrStatus = (value) => {
      if (!value) return '';
      return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  const couponColumns = ref([
    { key: 'code', label: 'Code' },
    { key: 'discountType', label: 'Type', formatter: formatTypeOrStatus },
    { key: 'discountValue', label: 'Value', formatter: (val, item) => item.discountType?.toLowerCase() === 'percentage' ? `${val}%` : formatCurrency(val) },
    { key: 'minOrderValue', label: 'Min Order', formatter: formatCurrency, optional: true },
    { key: 'maxDiscountValue', label: 'Max Discount', formatter: formatCurrency, optional: true },
    { key: 'usageLimit', label: 'Usage Limit' },
    { key: 'status', label: 'Status', formatter: formatTypeOrStatus },
    { key: 'isActive', label: 'Active', formatter: formatBoolean },
    { key: 'expiresAt', label: 'Expires At', formatter: formatDateTime },
  ]);
  
  const couponPoolColumns = ref([
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', optional: true },
    { key: 'totalCoupons', label: 'Total Coupons' },
    { key: 'allocatedCount', label: 'Allocated' },
    { key: 'campaignId', label: 'Campaign ID' },
    { key: 'createdAt', label: 'Created At', formatter: formatDateTime },
  ]);
  
  const campaignColumns = ref([
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', optional: true },
    { key: 'startDate', label: 'Start Date', formatter: formatDateTime },
    { key: 'endDate', label: 'End Date', formatter: formatDateTime },
    { key: 'userTier', label: 'Target Tier', formatter: formatTypeOrStatus },
  ]);
  
  const currentColumns = computed(() => {
    switch (activeView.value) {
      case 'pool': return couponPoolColumns.value;
      case 'campaign': return campaignColumns.value;
      case 'coupon':
      default:
        return couponColumns.value;
    }
  });
  
  const currentData = computed(() => {
     switch (activeView.value) {
      case 'pool': return couponPools.value;
      case 'campaign': return campaigns.value;
      case 'coupon':
      default:
        return coupons.value;
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
          case 'coupon':
              url = `${API_BASE_URL}/coupon`;
              dataRef = coupons;
              break;
          case 'pool':
              url = `${API_BASE_URL}/coupon-pool`;
              dataRef = couponPools;
              break;
          case 'campaign':
              url = `${API_BASE_URL}/campaign`;
              dataRef = campaigns;
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
  
  const fetchCoupons = () => fetchData('coupon');
  const fetchCouponPools = () => fetchData('pool');
  const fetchCampaigns = () => fetchData('campaign');
  
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
        case 'coupon': fetchCoupons(); break;
        case 'pool': fetchCouponPools(); break;
        case 'campaign': fetchCampaigns(); break;
    }
  };
  
  const goToAddPage = () => {
    let route = '';
    switch (activeView.value) {
      case 'coupon':
        route = '/admin/promotions/coupons/create';
        break;
      case 'pool':
        route = '/admin/promotions/pools/create';
        break;
      case 'campaign':
        route = '/admin/promotions/campaigns/create';
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
    fetchCoupons();
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
