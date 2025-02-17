import { defineStore } from 'pinia';
import { ref } from 'vue';
import { config } from 'dotenv';
config();

export const useSheetStore = defineStore('sheet', () => {
  const testData = ref<{ id: number; key: string; value: string }[]>([]);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const apiKey = process.env.SHEET_API_KEY;
  const spreadsheetId = process.env.SHEET_ID;
  const fetchSheetData = async () => {
    loading.value = true;
    try {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${apiKey}`); 
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      testData.value = data.test;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  return { testData, error, loading, fetchSheetData };
});
