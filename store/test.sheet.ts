import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSheetStore = defineStore('sheet', () => {
  const testData = ref<{ id: number | null; key: string; value: string }[]>([]);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const fetchSheetData = async () => {
    loading.value = true;
    try {
      const response = await fetch('/api/google.sheet'); // ✅ Gọi API server Nuxt
      const data = await response.json();
      console.log('Fetched Data:', data); // ✅ Debug log dữ liệu từ API

      if (data.error) throw new Error(data.error);

      testData.value = data.test; // ✅ Cập nhật dữ liệu vào store
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  return { testData, error, loading, fetchSheetData };
});
