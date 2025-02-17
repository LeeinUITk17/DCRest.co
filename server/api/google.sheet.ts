import { google } from 'googleapis';
import { config } from 'dotenv';
config();

export default defineEventHandler(async (event) => {
  const apiKey = process.env.SHEET_API_KEY;
  const spreadsheetId = process.env.SHEET_ID;
  const range = 'A1:B4';

  const sheets = google.sheets({ version: 'v4' });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      key: apiKey, 
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) return { test: [] };

    const test = rows.map((row) => ({
      id: Number(row[0]),
      key: row[1],
      value: row[2],
    }));

    return { test };
  } catch (error) {
    return { error: (error as Error).message };
  }
});