import { google } from 'googleapis';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const spreadsheetId = process.env.SHEET_ID;
  const range = 'A2:C'; // ✅ Sửa lỗi: Đọc cả 3 cột A, B, C

  // Đọc file JSON Key
  const keyFilePath = join(process.cwd(), 'server', 'service-account.json');
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    console.log('Google Sheets Data:', rows); // ✅ Debug log dữ liệu từ Google Sheets

    if (!rows || rows.length === 0) return { test: [] };

    // Xử lý dữ liệu, đảm bảo lấy đủ cột
    const test = rows.map((row) => ({
      id: row[0] !== undefined ? Number(row[0]) : null, // ✅ Sửa lỗi: Kiểm tra giá trị id
      key: row[1] || '', // ✅ Sửa lỗi: Kiểm tra giá trị key
      value: row[2] || '', // ✅ Sửa lỗi: Kiểm tra giá trị value
    }));

    return { test };
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    return { error: (error as Error).message };
  }
});
