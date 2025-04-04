<template>
  <div class="bg-gray-100 p-4 md:p-6">
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="flex flex-wrap justify-between items-center p-4 border-b border-gray-200 space-y-2 md:space-y-0">
        <div class="relative flex-grow mr-4 w-full sm:w-auto">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model.trim="debouncedSearchQuery"
            type="text"
            placeholder="Search table..."
            aria-label="Search"
            class="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200"
          />
          <button
            @click="clearSearch"
            v-if="debouncedSearchQuery"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200 focus:outline-none p-1"
            aria-label="Clear Search"
          >
            <i class="fas fa-times-circle text-sm"></i>
          </button>
        </div>
        <!-- <div class="flex items-center space-x-2">
          <button
             @click="$emit('add-new')"
             class="px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition duration-200"
             title="Add New Item"
          >
            <i class="fas fa-plus mr-1"></i> Add New
          </button>
           <button
            @click="openSettings"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-200"
            title="Settings"
          >
            <i class="fas fa-cog"></i>
          </button>
        </div> -->
      </div>
      <div v-if="isLoading" class="flex justify-center items-center p-10">
        <i class="fas fa-spinner fa-spin text-3xl text-gray-500"></i>
        <span class="ml-3 text-gray-600">Loading data...</span>
      </div>
      <div v-show="!isLoading" class="overflow-x-auto">
        <table class="min-w-full text-sm text-gray-800 border-collapse">
          <thead class="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 align-middle w-12">
                <input
                  type="checkbox"
                  v-model="selectAllRows"
                  @change="toggleSelectAll"
                  class="form-checkbox h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 align-middle"
                  aria-label="Select all rows on current page"
                />
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="[ 'px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 align-middle', { 'hidden md:table-cell': column.optional } ]"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <template v-if="!isLoading && pagedData.length > 0">
              <tr
                v-for="(item, index) in pagedData"
                :key="item.id || index"
                class="hover:bg-gray-50 border-b border-gray-100 transition duration-150 ease-in-out"
                :class="{ 'bg-gray-100': isSelected(item) }"
                @click="toggleRowSelection(item)"
              >
                <td class="px-4 py-3 whitespace-nowrap align-middle">
                  <input
                    type="checkbox"
                    :checked="isSelected(item)"
                    @change="toggleRowSelection(item)"
                    @click.stop
                    class="form-checkbox h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 align-middle"
                    :aria-label="'Select row ' + (index + 1)"
                  />
                </td>
                <td
                  v-for="column in columns"
                  :key="column.key"
                  :class="['px-4 py-3 whitespace-nowrap align-middle', { 'hidden md:table-cell': column.optional }]"
                >
                  {{ column.formatter ? column.formatter(getValue(item, column.key), item) : getValue(item, column.key) }}
                </td>
              </tr>
            </template>
            <tr v-if="!isLoading && pagedData.length === 0 && filteredData.length > 0">
              <td :colspan="columns.length + 1" class="px-4 py-6 text-center text-gray-500 italic border-b border-gray-100">
                No results found on this page.
              </td>
            </tr>
            <tr v-if="!isLoading && filteredData.length === 0">
              <td :colspan="columns.length + 1" class="px-4 py-10 text-center text-gray-500 border-b border-gray-100">
                <div class="flex flex-col items-center space-y-3">
                  <i class="fas fa-inbox text-4xl text-gray-400"></i>
                  <span>No data found matching your criteria.</span>
                   <button
                     @click="$emit('add-new')"
                     class="text-sm font-medium text-gray-700 hover:text-black hover:underline focus:outline-none"
                   >
                      Add New Item?
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!isLoading && totalPages > 1" class="flex flex-wrap justify-between items-center p-4 border-t border-gray-200 space-y-3 md:space-y-0">
        <div class="flex items-center space-x-3 text-sm text-gray-600">
          <select
            v-model="itemsPerPage"
            @change="currentPage = 1"
            class="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
            aria-label="Items per page"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>per page</span>
          <span class="hidden sm:inline">|</span>
          <span class="hidden sm:inline">
            Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length) }}
            - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }}
            of {{ filteredData.length }} results
          </span>
        </div>
        <div class="flex items-center space-x-1">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            aria-label="Previous Page"
          >
            <i class="fas fa-chevron-left text-xs"></i>
          </button>
          <button
            v-for="page in paginationRange"
            :key="page"
            @click="goToPage(page)"
            :disabled="page === '...'"
            :class="[ 'px-3 py-1.5 rounded-md text-sm transition duration-150 focus:outline-none focus:ring-1 focus:ring-gray-400', page === '...' ? 'cursor-default text-gray-500' : 'hover:bg-gray-100', currentPage === page ? 'bg-black text-white hover:bg-gray-800 font-semibold' : 'text-gray-700' ]"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            aria-label="Next Page"
          >
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { get, debounce } from "lodash-es";

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
  isLoading: {
    type: Boolean,
    default: false,
  },
  rowKey: {
      type: String,
      default: 'id'
  }
});

const emit = defineEmits(['update:selected', 'row-click', 'add-new', 'settings-click']);

const searchQuery = ref("");
const debouncedSearchQuery = ref("");
const selectedRows = ref(new Set());
const selectAllOnPage = ref(false);
const itemsPerPage = ref(props.pageSize);
const currentPage = ref(1);

const updateSearchQuery = debounce((value) => {
  searchQuery.value = value;
  currentPage.value = 1;
  selectAllOnPage.value = false;
  selectedRows.value.clear();
  emit('update:selected', []);
}, 300);

const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.data;

  return props.data.filter(item =>
    props.columns.some(column => {
      if (column.searchable === false) return false;
      const value = String(getValue(item, column.key)).toLowerCase();
      return value.includes(query);
    })
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const paginationRange = computed(() => {
    const current = currentPage.value;
    const last = totalPages.value;
    const delta = 1;
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= left && i < right)) {
            range.push(i);
        }
    }

    let l;
    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l > 2) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }
    return rangeWithDots;
});

const getValue = (item, key) => get(item, key, "");

const clearSearch = () => {
  debouncedSearchQuery.value = "";
};

const goToPage = (page) => {
  if (page !== '...' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

const isSelected = (item) => {
    return selectedRows.value.has(getValue(item, props.rowKey));
};

const toggleRowSelection = (item) => {
    const key = getValue(item, props.rowKey);
    if (!key) {
        console.warn("Row item missing unique key specified by 'rowKey' prop:", item);
        return;
    }

    if (selectedRows.value.has(key)) {
        selectedRows.value.delete(key);
    } else {
        selectedRows.value.add(key);
    }
    checkSelectAllState();
    emitSelected();
    emit('row-click', item);
};

const toggleSelectAll = () => {
    const pageKeys = pagedData.value.map(item => getValue(item, props.rowKey)).filter(key => key);

    if (selectAllOnPage.value) {
        pageKeys.forEach(key => selectedRows.value.add(key));
    } else {
        pageKeys.forEach(key => selectedRows.value.delete(key));
    }
    emitSelected();
};

const checkSelectAllState = () => {
    const pageKeys = new Set(pagedData.value.map(item => getValue(item, props.rowKey)).filter(key => key));
    if (pageKeys.size === 0) {
        selectAllOnPage.value = false;
        return;
    }
    const allSelected = [...pageKeys].every(key => selectedRows.value.has(key));
    selectAllOnPage.value = allSelected;
};

const emitSelected = () => {
    const selectedItems = props.data.filter(item => selectedRows.value.has(getValue(item, props.rowKey)));
    emit('update:selected', selectedItems);
};

const openSettings = () => {
  console.log("Settings clicked");
  emit('settings-click');
};

watch(debouncedSearchQuery, (newValue) => {
  updateSearchQuery(newValue);
});

watch(pagedData, () => {
  checkSelectAllState();
}, { deep: true });

watch(selectedRows, () => {
    checkSelectAllState();
}, { deep: true });

watch(itemsPerPage, () => {
    currentPage.value = 1;
});

watch(() => props.data, () => {
    selectedRows.value.clear();
    selectAllOnPage.value = false;
    emitSelected();
}, { deep: true });

onMounted(() => {
    itemsPerPage.value = props.pageSize;
});
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
.form-checkbox {
  appearance: none;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  height: 1em;
  width: 1em;
  color: #4a90e2;
  background-color: #fff;
  border-color: #cbd5e0;
  border-width: 1px;
  border-radius: 0.25rem;
}
.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.form-checkbox:focus {
  outline: none;
 box-shadow: 0 0 0 2px rgba(160, 160, 160, 0.5);
 border-color: #a0aec0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
