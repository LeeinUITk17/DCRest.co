<template>
  <div class="bg-gray-300">
    <div class="bg-blue-50 rounded-lg shadow overflow-hidden">
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <div class="relative flex-grow mr-4 w-full md:w-1/4">
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          <input
            v-model.trim="debouncedSearchQuery"
            type="text"
            placeholder="Search..."
            aria-label="Search"
            class="w-full md:w-1/4 pl-10 pr-4 py-2 rounded-md bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 transition duration-200"
          />
          <button
            @click="clearSearch"
            v-if="searchQuery"
            class="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition duration-200 focus:outline-none"
            aria-label="Clear Search"
          >
            <i class="fas fa-times-circle"></i>
          </button>
        </div>
        <button
          @click="openSettings"
          class="px-4 py-2 rounded-md transition duration-200 focus:outline-none"
          title="Settings"
          data-tooltip="Settings"
        >
          <i class="fas fa-cog"></i> 
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center p-6">
        <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
      </div>

      <div class="overflow-y-auto">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-gray-700 border-collapse">
            <thead class="sticky top-0 bg-blue-50 shadow-sm">
              <tr>
                <th class="px-4 py-3 text-left font-semibold uppercase whitespace-nowrap border-b-2 border-gray-300 align-middle">
                  <input
                    type="checkbox"
                    v-model="selectAllRows"
                    class="form-checkbox text-blue-500 rounded focus:ring-blue-500 align-middle"
                  />
                </th>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  :class="[
                    'px-4 py-3 text-left font-semibold uppercase whitespace-nowrap border-b-2 border-gray-300 align-middle',
                    { 'hidden md:table-cell': column.optional },
                  ]"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="isLoading" v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-4 py-3" v-for="column in columns" :key="column.key">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </td>
              </tr>
              <tr
                v-for="(item, index) in pagedData"
                :key="index"
                class="hover:bg-blue-100 border-t border-gray-200 cursor-pointer transition duration-200"
                :class="{ 'bg-blue-200': selectedRows.includes(item), 'bg-blue-50': index % 2 === 0 }"
                @click="selectRow(item)"
              >
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap align-middle">
                  <input
                    type="checkbox"
                    :value="item"
                    v-model="selectedRows"
                    class="form-checkbox text-blue-500 rounded focus:ring-blue-500 align-middle"
                  />
                </td>
                <td
                  v-for="column in columns"
                  :key="column.key"
                  :class="['px-4 py-3 text-gray-700 whitespace-nowrap align-middle', { 'hidden md:table-cell': column.optional }]"
                >
                  {{ getValue(item, column.key) }}
                </td>
              </tr>

              <tr v-if="pagedData.length === 0 && filteredData.length > 0">
                <td :colspan="columns.length + 1" class="px-4 py-6 text-center text-gray-500 italic">
                  No data found on this page.
                </td>
              </tr>

              <tr v-if="filteredData.length === 0 && !isLoading">
                <td :colspan="columns.length + 1" class="px-4 py-6 text-center text-gray-500">
                  <div class="flex flex-col items-center space-y-4">
                    <i class="fas fa-database text-4xl text-gray-400"></i>
                    <span class="italic text-gray-500">No data found. Would you like to add some?</span>
                    <button
                      @click="addNewData"
                      class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none"
                    >
                      Add New Data
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="filteredData.length > 0" class="flex justify-between items-center p-4 border-t border-gray-200">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-700">Items per page:</span>
          <select
            v-model="itemsPerPage"
            class="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of {{ filteredData.length }} items
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            aria-label="Previous Page"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <span v-for="page in totalPages" :key="page" class="mx-0.5">
            <button
              @click="goToPage(page)"
              :class="[
                'px-3 py-1.5 rounded-md transition duration-200 focus:outline-none',
                currentPage === page ? 'bg-blue-500 text-white hover:bg-blue-600 font-semibold shadow-sm' : 'text-gray-700 hover:bg-blue-100',
              ]"
            >
              {{ page }}
            </button>
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            aria-label="Next Page"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <PopupDetail
        v-if="isPopupVisible"
        :data="selectedRow"
        :close="closePopup"
      />
    </transition>
  </div>
</template>


<script setup>
import { ref, computed, watch } from "vue";
import { get } from "lodash-es";
import PopupDetail from "./PopupDetail.vue";
import { debounce } from 'lodash-es';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const getValue = (item, key) => get(item, key, "-");

const selectedRow = ref(null);
const selectedRows = ref([]);
const isPopupVisible = ref(false);
const searchQuery = ref("");
const selectAllRows = ref(false);
const itemsPerPage = ref(10);
const currentPage = ref(1);

const debouncedSearchQuery = ref("");
const updateSearchQuery = debounce((value) => {
  searchQuery.value = value;
}, 300); 

watch(() => debouncedSearchQuery.value, (newValue) => {
  updateSearchQuery(newValue);
});


const filteredData = computed(() => {
  if (!searchQuery.value) return props.data;
  return props.data.filter(item =>
    props.columns.some(column =>
      String(getValue(item, column.key)).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.pageSize);
});

const pagedData = computed(() => {
  const startIndex = (currentPage.value - 1) * props.pageSize;
  const endIndex = startIndex + props.pageSize;
  return filteredData.value.slice(startIndex, endIndex);
});

const goToPage = (page) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};


const openPopup = (item) => {
  selectedRow.value = item;
  isPopupVisible.value = true;
};

const closePopup = () => {
  isPopupVisible.value = false;
};

const selectRow = (item) => {
  selectedRow.value = item;
};

const openSettings = () => {
  console.log("Settings clicked");
};

const clearSearch = () => {
  debouncedSearchQuery.value = ""; 
  searchQuery.value = ""; 
};


watch(selectAllRows, (newValue) => {
  if (newValue) {
    selectedRows.value = [...pagedData.value];
  } else {
    selectedRows.value = [];
  }
});

watch(pagedData, (newValue) => {
  if (selectAllRows.value && newValue.length !== selectedRows.value.length) {
    selectAllRows.value = false;
  }
});

watch(filteredData, () => {
  currentPage.value = 1;
  selectAllRows.value = false;
});
</script>
<style scoped>
.bg-white {
  background-color: #ffffff;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media (max-width: 768px) {
  .overflow-x-auto {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 600px;
  }
}
</style>