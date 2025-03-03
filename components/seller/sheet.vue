<script setup>
import { onMounted } from 'vue';
import { useSheetStore } from '~/store/test.sheet';

const sheetStore = useSheetStore();

onMounted(() => {
  sheetStore.fetchSheetData();
});
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-center mb-4">Google Sheets Data</h2>

    <div v-if="sheetStore.loading" class="text-center text-gray-600">
      Loading...
    </div>

    <div v-else-if="sheetStore.error" class="text-red-500 text-center">
      Error: {{ sheetStore.error }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
        <thead>
          <tr class="bg-gray-100 text-gray-700">
            <th class="py-2 px-4 border">ID</th>
            <th class="py-2 px-4 border">Key</th>
            <th class="py-2 px-4 border">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in sheetStore.testData" :key="index" class="border-b hover:bg-gray-50">
            <td class="py-2 px-4 text-center">{{ row.id }}</td>
            <td class="py-2 px-4 text-center">{{ row.key }}</td>
            <td class="py-2 px-4 text-center">{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
