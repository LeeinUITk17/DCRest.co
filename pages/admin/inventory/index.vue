<template>
    <div class="flex h-screen bg-gray-100">
      <div class="w-16 md:w-52 flex-shrink-0 z-50">
        <Sidebar />
      </div>
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Inventory Management</h1>
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              <button
                v-for="view in views"
                :key="view.id"
                @click="switchView(view.id)"
                :class="[
                  'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none',
                  activeView === view.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
                :aria-current="activeView === view.id ? 'page' : undefined"
              >
                {{ view.label }}
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
const API_BASE_URL = 'http://localhost:8000';

const activeView = ref('inventory');
const inventoryItems = ref([]);
const transactions = ref([]);
const suppliers = ref([]);
const recipeIngredients = ref([]);
const isLoading = ref(true);
const error = ref(null);

const views = ref([
    { id: 'inventory', label: 'Inventory Items', endpoint: '/inventory-item', dataRef: inventoryItems, columnsRef: 'inventoryColumns', fetchFunc: fetchInventoryItems },
    { id: 'transaction', label: 'Transactions', endpoint: '/transaction', dataRef: transactions, columnsRef: 'transactionColumns', fetchFunc: fetchTransactions },
    { id: 'supplier', label: 'Suppliers', endpoint: '/supplier', dataRef: suppliers, columnsRef: 'supplierColumns', fetchFunc: fetchSuppliers },
    { id: 'recipe', label: 'Recipe Ingredients', endpoint: '/recipe', dataRef: recipeIngredients, columnsRef: 'recipeIngredientColumns', fetchFunc: fetchRecipeIngredients },
]);

const formatCurrency = (value) => {
  const price = Number(value);
  return !isNaN(price) ? price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
}

const formatBoolean = (value) => {
    return value ? 'Yes' : 'No';
}

const formatDate = (value) => {
    if (!value) return '';
    try {
        return new Date(value).toLocaleString();
    } catch (e) {
        return value;
    }
}

const inventoryColumns = ref([
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'unit', label: 'Unit' },
  { key: 'supplierId', label: 'Supplier ID', optional: true },
  { key: 'updatedAt', label: 'Last Updated', formatter: formatDate, optional: true },
]);

const transactionColumns = ref([
  { key: 'inventoryItemId', label: 'Item ID' },
  { key: 'transactionType', label: 'Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price', formatter: formatCurrency },
  { key: 'timestamp', label: 'Timestamp', formatter: formatDate },
]);

const supplierColumns = ref([
    { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact', optional: true },
  { key: 'address', label: 'Address', optional: true },
]);

const recipeIngredientColumns = ref([
  { key: 'menuItemId', label: 'Menu Item ID' },
  { key: 'inventoryItemId', label: 'Inventory Item ID' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'unit', label: 'Unit' },
]);

const allColumns = {
    inventory: inventoryColumns,
    transaction: transactionColumns,
    supplier: supplierColumns,
    recipe: recipeIngredientColumns,
};

const currentViewConfig = computed(() => views.value.find(v => v.id === activeView.value));

const currentColumns = computed(() => {
    const columnsRefName = currentViewConfig.value?.columnsRef;
    return columnsRefName ? allColumns[activeView.value].value : [];
});

const currentData = computed(() => {
    return currentViewConfig.value?.dataRef.value || [];
});

const fetchDataForView = async (viewId) => {
    const viewConfig = views.value.find(v => v.id === viewId);
    if (!viewConfig) return;

    if (activeView.value === viewId) {
        isLoading.value = true;
        error.value = null;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}${viewConfig.endpoint}`, { withCredentials: true });
        viewConfig.dataRef.value = response.data?.data || response.data || [];
    } catch (err) {
        viewConfig.dataRef.value = [];
        handleApiError(err, `Could not fetch ${viewConfig.label.toLowerCase()}.`);
    } finally {
        if (activeView.value === viewId) {
            isLoading.value = false;
        }
    }
};

async function fetchInventoryItems() { await fetchDataForView('inventory'); }
async function fetchTransactions() { await fetchDataForView('transaction'); }
async function fetchSuppliers() { await fetchDataForView('supplier'); }
async function fetchRecipeIngredients() { await fetchDataForView('recipe'); }

const handleApiError = (err, defaultMessage) => {
    isLoading.value = false;
    if (err.response) {
      error.value = `Error ${err.response.status}: ${err.response.data?.message || defaultMessage}`;
      if (err.response.status === 401 || err.response.status === 403) {
        error.value += ' Please check your login session or permissions.';
      }
    } else if (err.request) {
      error.value = 'Network Error: Unable to connect to the server. Please check your connection or the server status.';
    } else {
      error.value = `An unexpected error occurred: ${err.message}`;
    }
};

const switchView = (viewId) => {
    if (activeView.value === viewId || isLoading.value) return;

    activeView.value = viewId;
    error.value = null;

    const viewConfig = views.value.find(v => v.id === viewId);
    if (viewConfig && viewConfig.fetchFunc) {
        viewConfig.fetchFunc();
    } else {
        isLoading.value = false;
    }
};

const goToAddPage = () => {
  const currentViewLabel = currentViewConfig.value?.label || 'Item';
  let path = '/admin/inventory/add';
  switch (activeView.value) {
      case 'inventory':
          path = '/admin/inventory/add';
          break;
      case 'transaction':
          return;
      case 'supplier':
          path = '/admin/suppliers/add';
          break;
      case 'recipe':
          return;
  }
};

onMounted(() => {
  const initialViewConfig = views.value.find(v => v.id === activeView.value);
  if (initialViewConfig && initialViewConfig.fetchFunc) {
      initialViewConfig.fetchFunc();
  } else {
      isLoading.value = false;
      error.value = "Failed to load initial data.";
  }
});
</script>

<style scoped>
.flex-1 {
  min-width: 0;
}
.transition-opacity {
    transition: opacity 0.3s ease-in-out;
}
nav[aria-label="Tabs"] {
    overflow-x: auto;
    padding-bottom: 1px;
}
nav[aria-label="Tabs"]::-webkit-scrollbar {
    display: none;
}
nav[aria-label="Tabs"] {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
