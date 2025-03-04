<template>
  <div class="">
    <div class="overflow-y-auto">
      <!-- Responsive Table Container -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <!-- Header -->
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="['px-4 py-2 text-left font-semibold text-gray-600 uppercase whitespace-nowrap', { 'hidden md:table-cell': column.optional }]"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody>
            <tr
              v-for="(item, index) in data"
              :key="index"
              class="hover:bg-gray-50 border-t border-gray-100 cursor-pointer"
              @click="openPopup(item)"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-4 py-2 text-gray-800 whitespace-nowrap"
              >
                {{ getValue(item, column.key) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Popup -->
    <PopupDetail
      :visible="isPopupVisible"
      :data="selectedRow"
      :close="closePopup"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { get } from "lodash-es";
import PopupDetail from "./PopupDetail.vue";

defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const getValue = (item, key) => get(item, key, "-");

// Popup control
const selectedRow = ref(null);
const isPopupVisible = ref(false);

const openPopup = (item) => {
  selectedRow.value = item;
  isPopupVisible.value = true;
};

const closePopup = () => {
  isPopupVisible.value = false;
};
</script>

<style scoped>
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