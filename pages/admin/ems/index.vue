<template>
    <div class="bg-gray-100 min-h-screen">
        <div class="w-16 md:w-52 flex-shrink-0 z-50">
        <sidebar />
      </div>
      <div class="container mx-auto p-16 md:p-16 lg:p-16">
  
        <!-- Tab Navigation -->
        <div class="mb-6 border-b border-gray-300">
          <nav class="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-black text-black font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 focus:outline-none'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
  
        <!-- Tab Content -->
        <div class="bg-white p-6 rounded-lg shadow-md">
  
          <!-- Attendance Section -->
          <section v-if="activeTab === 'attendance'" key="attendance" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">Attendance Records</h2>
  
            <!-- Create Attendance Form -->
            <form @submit.prevent="handleCreateAttendance" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
               <h3 class="text-lg font-medium text-gray-700 mb-2">Add New Record</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="att-workDate" class="block text-sm font-medium text-gray-600 mb-1">Work Date:</label>
                    <input type="date" id="att-workDate" v-model="newAttendance.workDate" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                  </div>
                  <div>
                    <label for="att-checkIn" class="block text-sm font-medium text-gray-600 mb-1">Check In Time:</label>
                    <input type="datetime-local" id="att-checkIn" v-model="newAttendance.checkIn" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                  </div>
                  <div>
                    <label for="att-checkOut" class="block text-sm font-medium text-gray-600 mb-1">Check Out Time (Optional):</label>
                    <input type="datetime-local" id="att-checkOut" v-model="newAttendance.checkOut" class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                  </div>
                  <div class="md:col-span-2">
                      <label for="att-notes" class="block text-sm font-medium text-gray-600 mb-1">Notes (Optional):</label>
                      <textarea id="att-notes" v-model="newAttendance.notes" rows="2" class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"></textarea>
                  </div>
                </div>
              <button type="submit" :disabled="isCreatingAttendance" class="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150">
                {{ isCreatingAttendance ? 'Adding...' : 'Add Attendance' }}
              </button>
            </form>
  
            <!-- List and Delete Attendance -->
             <div class="pt-4">
               <h3 class="text-lg font-medium text-gray-700 mb-3">Existing Records</h3>
               <div v-if="isLoadingAttendances" class="text-center text-gray-500 py-4">Loading records...</div>
                <ul v-else-if="attendances.length > 0" class="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3">
                    <li v-for="att in attendances" :key="att.id" class="text-sm flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                        <span>
                          <span class="font-medium">Emp: </span> | {{ formatDate(att.workDate) }} | In: {{ formatTime(att.checkIn) }} {{ att.checkOut ? '| Out: '+formatTime(att.checkOut) : '' }}
                        </span>
                        <button @click="handleDeleteAttendance(att.id)" :disabled="isDeletingAttendance === att.id" class="ml-4 px-2.5 py-1 bg-gray-400 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150 flex-shrink-0">
                            {{ isDeletingAttendance === att.id ? 'Deleting...' : 'Delete' }}
                        </button>
                    </li>
                </ul>
                <div v-else class="text-center text-gray-500 italic py-4">No attendance records found.</div>
            </div>
          </section>
  
          <!-- Work Schedules Section -->
          <section v-if="activeTab === 'work-schedule'" key="work-schedule" class="space-y-6">
             <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">Work Schedules</h2>
  
            <!-- Create Work Schedule Form -->
            <form @submit.prevent="handleCreateWorkSchedule" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 class="text-lg font-medium text-gray-700 mb-2">Add New Schedule</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                 <label for="ws-shiftTemplateId" class="block text-sm font-medium text-gray-600 mb-1">Shift Template (Optional):</label>
                 <select id="ws-shiftTemplateId" v-model="newWorkSchedule.shiftTemplateId" class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white">
                    <option value="">-- Select Template (or set times manually) --</option>
                    <option v-for="shift in shiftTemplates" :key="shift.id" :value="shift.id">
                        {{ shift.name }} ({{ shift.startTime }} - {{ shift.endTime }})
                    </option>
                 </select>
               </div>
               <div>
                  <label for="ws-shiftStart" class="block text-sm font-medium text-gray-600 mb-1">Shift Start:</label>
                  <input type="datetime-local" id="ws-shiftStart" v-model="newWorkSchedule.shiftStart" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
               </div>
               <div>
                  <label for="ws-shiftEnd" class="block text-sm font-medium text-gray-600 mb-1">Shift End:</label>
                  <input type="datetime-local" id="ws-shiftEnd" v-model="newWorkSchedule.shiftEnd" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
               </div>
              </div>
              <button type="submit" :disabled="isCreatingWorkSchedule" class="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150">
                {{ isCreatingWorkSchedule ? 'Adding...' : 'Add Schedule' }}
              </button>
            </form>
  
            <!-- List and Delete Work Schedules -->
            <div class="pt-4">
               <h3 class="text-lg font-medium text-gray-700 mb-3">Existing Schedules</h3>
               <div v-if="isLoadingWorkSchedules" class="text-center text-gray-500 py-4">Loading schedules...</div>
                <ul v-else-if="workSchedules.length > 0" class="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3">
                    <li v-for="ws in workSchedules" :key="ws.id" class="text-sm flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                        <span><span class="font-medium">Emp: </span> | {{ formatDateTime(ws.shiftStart) }} - {{ formatDateTime(ws.shiftEnd) }}</span>
                        <button @click="handleDeleteWorkSchedule(ws.id)" :disabled="isDeletingWorkSchedule === ws.id" class="ml-8 px-2.5 py-1 bg-gray-400 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150 flex-shrink-0">
                             {{ isDeletingWorkSchedule === ws.id ? 'Deleting...' : 'Delete' }}
                        </button>
                    </li>
                </ul>
                <div v-else class="text-center text-gray-500 italic py-4">No work schedules found.</div>
            </div>
          </section>
  
          <!-- Overtime Requests Section -->
          <section v-if="activeTab === 'overtime-request'" key="overtime-request" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">Overtime Requests</h2>
  
            <!-- Create Overtime Request Form -->
            <form @submit.prevent="handleCreateOvertimeRequest" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 class="text-lg font-medium text-gray-700 mb-2">Add New Request</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="or-date" class="block text-sm font-medium text-gray-600 mb-1">Date:</label>
                    <input type="date" id="or-date" v-model="newOvertimeRequest.date" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                </div>
                <div>
                    <label for="or-minutes" class="block text-sm font-medium text-gray-600 mb-1">Requested Minutes:</label>
                    <input type="number" id="or-minutes" v-model.number="newOvertimeRequest.requestedMinutes" required min="1" class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                </div>
                <div class="md:col-span-2">
                    <label for="or-reason" class="block text-sm font-medium text-gray-600 mb-1">Reason (Optional):</label>
                    <textarea id="or-reason" v-model="newOvertimeRequest.reason" rows="2" class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"></textarea>
                </div>
              </div>
              <button type="submit" :disabled="isCreatingOvertimeRequest" class="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150">
                {{ isCreatingOvertimeRequest ? 'Submitting...' : 'Submit Overtime Request' }}
              </button>
            </form>
  
            <!-- List and Delete Overtime Requests -->
             <div class="pt-4">
               <h3 class="text-lg font-medium text-gray-700 mb-3">Existing Requests</h3>
               <div v-if="isLoadingOvertimeRequests" class="text-center text-gray-500 py-4">Loading requests...</div>
                <ul v-else-if="overtimeRequests.length > 0" class="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3">
                    <li v-for="or in overtimeRequests" :key="or.id" class="text-sm flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                         <span>
                           <span class="font-medium">Emp: </span> | {{ formatDate(or.date) }} | {{ or.requestedMinutes }} min | <span :class="getStatusClass(or.status)">{{ or.status }}</span>
                         </span>
                        <button @click="handleDeleteOvertimeRequest(or.id)" :disabled="isDeletingOvertimeRequest === or.id" class="ml-4 px-2.5 py-1 bg-gray-400 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150 flex-shrink-0">
                            {{ isDeletingOvertimeRequest === or.id ? 'Deleting...' : 'Delete' }}
                        </button>
                    </li>
                </ul>
                <div v-else class="text-center text-gray-500 italic py-4">No overtime requests found.</div>
            </div>
          </section>
  
          <!-- Leave Requests Section -->
          <section v-if="activeTab === 'leave-request'" key="leave-request" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">Leave Requests</h2>
  
            <!-- Create Leave Request Form -->
            <form @submit.prevent="handleCreateLeaveRequest" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 class="text-lg font-medium text-gray-700 mb-2">Add New Request</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="lr-startDate" class="block text-sm font-medium text-gray-600 mb-1">Start Date:</label>
                    <input type="date" id="lr-startDate" v-model="newLeaveRequest.startDate" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                </div>
                <div>
                    <label for="lr-endDate" class="block text-sm font-medium text-gray-600 mb-1">End Date:</label>
                    <input type="date" id="lr-endDate" v-model="newLeaveRequest.endDate" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                </div>
                 <div class="md:col-span-2">
                    <label for="lr-reason" class="block text-sm font-medium text-gray-600 mb-1">Reason (Optional):</label>
                    <textarea id="lr-reason" v-model="newLeaveRequest.reason" rows="2" class="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"></textarea>
                </div>
               </div>
              <button type="submit" :disabled="isCreatingLeaveRequest" class="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150">
                {{ isCreatingLeaveRequest ? 'Submitting...' : 'Submit Leave Request' }}
              </button>
            </form>
  
            <!-- List and Delete Leave Requests -->
             <div class="pt-4">
               <h3 class="text-lg font-medium text-gray-700 mb-3">Existing Requests</h3>
               <div v-if="isLoadingLeaveRequests" class="text-center text-gray-500 py-4">Loading requests...</div>
                <ul v-else-if="leaveRequests.length > 0" class="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3">
                    <li v-for="lr in leaveRequests" :key="lr.id" class="text-sm flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                        <span>
                          <span class="font-medium">Emp: </span> | {{ formatDate(lr.startDate) }} - {{ formatDate(lr.endDate) }} | <span :class="getStatusClass(lr.status)">{{ lr.status }}</span>
                        </span>
                        <button @click="handleDeleteLeaveRequest(lr.id)" :disabled="isDeletingLeaveRequest === lr.id" class="ml-4 px-2.5 py-1 bg-gray-400 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors duration-150 flex-shrink-0">
                            {{ isDeletingLeaveRequest === lr.id ? 'Deleting...' : 'Delete' }}
                        </button>
                    </li>
                </ul>
                <div v-else class="text-center text-gray-500 italic py-4">No leave requests found.</div>
            </div>
          </section>
  
          <!-- Shift Templates Info (Moved inside white card for context if needed) -->
          <section v-if="activeTab === 'shifts'" key="shifts" class="space-y-4">
              <h2 class="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">Available Shift Templates</h2>
              <div v-if="isLoadingShifts" class="text-center text-gray-500 py-4">Loading shifts...</div>
              <ul v-else-if="shiftTemplates.length > 0" class="text-sm list-disc list-inside pl-4 space-y-1">
                  <li v-for="shift in shiftTemplates" :key="shift.id">
                    <span class="font-medium">{{ shift.name }}:</span> {{ shift.startTime }} - {{ shift.endTime }}
                  </li>
              </ul>
              <div v-else class="text-center text-gray-500 italic py-4">No shift templates found or failed to load.</div>
          </section>
  
  
        </div> <!-- End Tab Content -->
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import Sidebar from '~/components/admin/Sidebar.vue';
  
  // --- Configuration ---
  const API_BASE_URL = 'http://localhost:8000'; // Your API base URL
  
  // --- API Client Setup ---
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Ensures cookies/session info are sent with requests
  });
  
  // --- SweetAlert Configuration ---
  const swalConfirmDelete = {
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333', // Darker confirm
      cancelButtonColor: '#d33', // Keep red for cancel maybe? Or use gray '#666'
      confirmButtonText: 'Yes, delete it!',
      customClass: { // Optional: Further styling
          confirmButton: 'bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded',
          cancelButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-3'
      },
      buttonsStyling: false // Use custom classes above
  };
  
  const swalSuccess = (title, text) => Swal.fire({ title, text, icon: 'success', confirmButtonColor: '#333' });
  const swalError = (title, text) => Swal.fire({ title, text, icon: 'error', confirmButtonColor: '#d33' });
  
  
  // --- SweetAlert Error Handler ---
  const handleApiError = (err, defaultMessage = 'An operation failed.') => {
    console.error("API Error:", err.response?.data || err.message || err);
    const message = err.response?.data?.message || err.message || defaultMessage;
    swalError('Error', message);
  };
  
  // --- Tab Management ---
  const activeTab = ref('attendance'); // Default tab
  const tabs = [
    { id: 'attendance', name: 'Attendance' },
    { id: 'work-schedule', name: 'Work Schedules' },
    { id: 'overtime-request', name: 'Overtime Requests' },
    { id: 'leave-request', name: 'Leave Requests' },
    { id: 'shifts', name: 'Shift Templates' }, // Added Shifts tab
  ];
  
  // --- State --- (Same as before)
  const shiftTemplates = ref([]);
  const isLoadingShifts = ref(false);
  const workSchedules = ref([]);
  const isLoadingWorkSchedules = ref(false);
  const isCreatingWorkSchedule = ref(false);
  const isDeletingWorkSchedule = ref(null);
  const newWorkSchedule = ref({  shiftTemplateId: '', shiftStart: '', shiftEnd: '' });
  const attendances = ref([]);
  const isLoadingAttendances = ref(false);
  const isCreatingAttendance = ref(false);
  const isDeletingAttendance = ref(null);
  const newAttendance = ref({  workDate: '', checkIn: '', checkOut: '', notes: '' });
  const leaveRequests = ref([]);
  const isLoadingLeaveRequests = ref(false);
  const isCreatingLeaveRequest = ref(false);
  const isDeletingLeaveRequest = ref(null);
  const newLeaveRequest = ref({  startDate: '', endDate: '', reason: '' });
  const overtimeRequests = ref([]);
  const isLoadingOvertimeRequests = ref(false);
  const isCreatingOvertimeRequest = ref(false);
  const isDeletingOvertimeRequest = ref(null);
  const newOvertimeRequest = ref({  date: '', requestedMinutes: null, reason: '' });
  
  // --- Helper Functions ---
  const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
          // Assuming dateString might be just YYYY-MM-DD or a full ISO string
          const datePart = dateString.split('T')[0];
          const date = new Date(datePart + 'T00:00:00'); // Avoid timezone issues by setting time
          return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format, adjust locale as needed
      } catch (e) { return dateString; }
  };
  const formatTime = (dateTimeString) => {
      if (!dateTimeString) return '';
       try {
          const date = new Date(dateTimeString);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // 24-hour format
      } catch (e) { return dateTimeString; }
  };
  const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return '';
      try {
          const date = new Date(dateTimeString);
          // Example: 'YYYY-MM-DD HH:MM'
          return `${date.toLocaleDateString('en-CA')} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
      } catch (e) { return dateTimeString; }
  };
  
  // Helper for styling status badges (adjust colors as needed)
  const getStatusClass = (status) => {
      switch (status?.toUpperCase()) {
          case 'PENDING': return 'bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium';
          case 'APPROVED': return 'bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium';
          case 'REJECTED': return 'bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium';
          default: return 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium';
      }
  };

  // Helper to safely convert input strings to ISO strings
const toISOStringOrUndefined = (inputString, isDateOnly = false) => {
    if (!inputString) {
        return undefined;
    }
    try {
        let date;
        if (isDateOnly) {
            // Handle YYYY-MM-DD input, treat as UTC midnight
             if (!/^\d{4}-\d{2}-\d{2}$/.test(inputString)) {
                throw new Error('Invalid date format for date-only input.');
            }
            date = new Date(inputString + 'T00:00:00Z');
        } else {
            // Handle YYYY-MM-DDTHH:MM (or potentially other valid datetime strings)
            date = new Date(inputString);
        }

        // Check if the date object is valid
        if (isNaN(date.getTime())) {
             throw new Error('Invalid Date object created from input.');
        }

        return date.toISOString(); // Always return full ISO string
    } catch (e) {
        console.error(`Invalid date string for conversion ('${inputString}', isDateOnly: ${isDateOnly}):`, e);
        return undefined; // Return undefined if conversion fails
    }
};

  
  
  // --- API Functions (Implementations are the same, just using updated Swal helpers) ---
  
  // Fetch Shift Templates
  const fetchShiftTemplates = async () => {
      isLoadingShifts.value = true;
      try {
        const response = await apiClient.get('/shift');
        shiftTemplates.value = response.data?.data || response.data || [];
      } catch (err) {
        console.error("Failed to fetch shift templates:", err); // Non-blocking error
        shiftTemplates.value = [];
      } finally {
        isLoadingShifts.value = false;
      }
  };
  
  // Work Schedule API Calls
  const fetchWorkSchedules = async () => { /* ... same logic ... */
      isLoadingWorkSchedules.value = true;
      try {
          const response = await apiClient.get('/work-schedule');
          workSchedules.value = response.data?.data || response.data || [];
      } catch (err) {
          handleApiError(err, 'Could not fetch work schedules.');
          workSchedules.value = [];
      } finally {
          isLoadingWorkSchedules.value = false;
      }
  };
  const handleCreateWorkSchedule = async () => { /* ... same logic ... */
      isCreatingWorkSchedule.value = true;
      const payload = {
        employeeId: newWorkSchedule.value.employeeId,
        shiftTemplateId: newWorkSchedule.value.shiftTemplateId || undefined, // Send undefined if empty
        // **FIX:** Convert datetime-local strings to ISO 8601
        shiftStart: toISOStringOrUndefined(newWorkSchedule.value.shiftStart),
        shiftEnd: toISOStringOrUndefined(newWorkSchedule.value.shiftEnd),
    };

    // Basic validation for converted dates
    if (!payload.shiftStart || !payload.shiftEnd) {
         swalError('Error', 'Invalid Shift Start or Shift End time provided.');
         isCreatingWorkSchedule.value = false;
         return;
    }
      try {
          await apiClient.post('/work-schedule', payload);
          swalSuccess('Success!', 'Work schedule added.');
          newWorkSchedule.value = {  shiftTemplateId: '', shiftStart: '', shiftEnd: '' };
          fetchWorkSchedules();
      } catch (err) {
          handleApiError(err, 'Failed to add work schedule.');
      } finally {
          isCreatingWorkSchedule.value = false;
      }
  };
  const handleDeleteWorkSchedule = async (id) => { /* ... same logic ... */
      const result = await Swal.fire(swalConfirmDelete);
      if (result.isConfirmed) {
        isDeletingWorkSchedule.value = id;
        try {
          await apiClient.delete(`/work-schedule/${id}`);
          swalSuccess('Deleted!', 'Work schedule has been deleted.');
          fetchWorkSchedules();
        } catch (err) {
          handleApiError(err, 'Failed to delete work schedule.');
        } finally {
          isDeletingWorkSchedule.value = null;
        }
      }
  };
  
  // Attendance API Calls
  const fetchAttendances = async () => { /* ... same logic ... */
      isLoadingAttendances.value = true;
      try {
          const response = await apiClient.get('/attendance');
          attendances.value = response.data?.data || response.data || [];
      } catch (err) {
          handleApiError(err, 'Could not fetch attendance records.');
          attendances.value = [];
      } finally {
          isLoadingAttendances.value = false;
      }
  };
  const handleCreateAttendance = async () => { /* ... same logic ... */
      isCreatingAttendance.value = true;
      const payload = {
        employeeId: newAttendance.value.employeeId,
        notes: newAttendance.value.notes || undefined,
        // **FIX:** Convert date/datetime-local strings to ISO 8601
        workDate: toISOStringOrUndefined(newAttendance.value.workDate), // Use date helper
        checkIn: toISOStringOrUndefined(newAttendance.value.checkIn),
        checkOut: toISOStringOrUndefined(newAttendance.value.checkOut), // Handles optional field correctly
        // Optional integer fields (send undefined if not set or invalid)
        overtimeMinutes: Number.isInteger(newAttendance.value.overtimeMinutes) ? newAttendance.value.overtimeMinutes : undefined,
        lateMinutes: Number.isInteger(newAttendance.value.lateMinutes) ? newAttendance.value.lateMinutes : undefined,
        earlyDepartureMinutes: Number.isInteger(newAttendance.value.earlyDepartureMinutes) ? newAttendance.value.earlyDepartureMinutes : undefined,

    };

     // Basic validation for converted dates
    if (!payload.workDate || !payload.checkIn) {
         swalError('Error', 'Invalid Work Date or Check In time provided.');
         isCreatingAttendance.value = false;
         return;
    }
  
      if (!payload.notes) delete payload.notes;
      if (!payload.checkOut) delete payload.checkOut;
      // Handle other optional fields
  
      try {
          await apiClient.post('/attendance', payload);
          swalSuccess('Success!', 'Attendance record added.');
          newAttendance.value = {  workDate: '', checkIn: '', checkOut: '', notes: '' };
          fetchAttendances();
      } catch (err) { handleApiError(err, 'Failed to add attendance record.'); }
      finally { isCreatingAttendance.value = false; }
  };
  const handleDeleteAttendance = async (id) => { /* ... same logic ... */
      const result = await Swal.fire(swalConfirmDelete);
       if (result.isConfirmed) {
         isDeletingAttendance.value = id;
          try {
              await apiClient.delete(`/attendance/${id}`);
              swalSuccess('Deleted!', 'Attendance record deleted.');
              fetchAttendances();
          } catch (err) { handleApiError(err, 'Failed to delete attendance record.'); }
          finally { isDeletingAttendance.value = null; }
       }
  };
  
  // Leave Request API Calls
  const fetchLeaveRequests = async () => { /* ... same logic ... */
      isLoadingLeaveRequests.value = true;
      try {
          const response = await apiClient.get('/leave-request');
          leaveRequests.value = response.data?.data || response.data || [];
      } catch (err) { handleApiError(err, 'Could not fetch leave requests.'); leaveRequests.value = []; }
      finally { isLoadingLeaveRequests.value = false; }
  };
  const handleCreateLeaveRequest = async () => { /* ... same logic ... */
      isCreatingLeaveRequest.value = true;
      const payload = {
        employeeId: newLeaveRequest.value.employeeId,
        reason: newLeaveRequest.value.reason || undefined,
         // **FIX:** Convert date strings to ISO 8601 Date part
        startDate: toISOStringOrUndefined(newLeaveRequest.value.startDate),
        endDate: toISOStringOrUndefined(newLeaveRequest.value.endDate),
    };

     // Basic validation for converted dates
    if (!payload.startDate || !payload.endDate) {
         swalError('Error', 'Invalid Start Date or End Date provided.');
         isCreatingLeaveRequest.value = false;
         return;
    }
      if (!payload.reason) delete payload.reason;
  
      try {
          await apiClient.post('/leave-request', payload);
          swalSuccess('Success!', 'Leave request submitted.');
          newLeaveRequest.value = {  startDate: '', endDate: '', reason: '' };
          fetchLeaveRequests();
      } catch (err) { handleApiError(err, 'Failed to submit leave request.'); }
      finally { isCreatingLeaveRequest.value = false; }
  };
  const handleDeleteLeaveRequest = async (id) => { /* ... same logic ... */
      const result = await Swal.fire(swalConfirmDelete);
      if (result.isConfirmed) {
          isDeletingLeaveRequest.value = id;
           try {
               await apiClient.delete(`/leave-request/${id}`);
               swalSuccess('Deleted!', 'Leave request deleted.');
               fetchLeaveRequests();
           } catch (err) { handleApiError(err, 'Failed to delete leave request.'); }
           finally { isDeletingLeaveRequest.value = null; }
      }
  };
  
  // Overtime Request API Calls
  const fetchOvertimeRequests = async () => { /* ... same logic ... */
      isLoadingOvertimeRequests.value = true;
      try {
          const response = await apiClient.get('/overtime-request');
          overtimeRequests.value = response.data?.data || response.data || [];
      } catch (err) { handleApiError(err, 'Could not fetch overtime requests.'); overtimeRequests.value = []; }
      finally { isLoadingOvertimeRequests.value = false; }
  };
  const handleCreateOvertimeRequest = async () => { /* ... same logic ... */
    isCreatingOvertimeRequest.value = true;

if (typeof newOvertimeRequest.value.requestedMinutes !== 'number' || newOvertimeRequest.value.requestedMinutes <= 0) {
    swalError('Error', 'Please enter a valid number of requested minutes.');
    isCreatingOvertimeRequest.value = false;
    return;
}

const payload = {
    employeeId: newOvertimeRequest.value.employeeId,
    requestedMinutes: newOvertimeRequest.value.requestedMinutes, // Already validated as number
    reason: newOvertimeRequest.value.reason || undefined,
    // **FIX:** Convert date string to ISO 8601 Date part
    date: toISOStringOrUndefined(newOvertimeRequest.value.date),
};

// Basic validation for converted date
if (!payload.date) {
     swalError('Error', 'Invalid Date provided.');
     isCreatingOvertimeRequest.value = false;
     return;
}
      if (!payload.reason) delete payload.reason;
      
      try {
          await apiClient.post('/overtime-request', payload);
          swalSuccess('Success!', 'Overtime request submitted.');
          newOvertimeRequest.value = {  date: '', requestedMinutes: null, reason: '' };
          fetchOvertimeRequests();
      } catch (err) { handleApiError(err, 'Failed to submit overtime request.'); }
      finally { isCreatingOvertimeRequest.value = false; }
  };
  const handleDeleteOvertimeRequest = async (id) => { /* ... same logic ... */
       const result = await Swal.fire(swalConfirmDelete);
       if (result.isConfirmed) {
           isDeletingOvertimeRequest.value = id;
            try {
                await apiClient.delete(`/overtime-request/${id}`);
                swalSuccess('Deleted!', 'Overtime request deleted.');
                fetchOvertimeRequests();
            } catch (err) { handleApiError(err, 'Failed to delete overtime request.'); }
            finally { isDeletingOvertimeRequest.value = null; }
       }
  };
  
  // --- Lifecycle Hooks ---
  onMounted(() => {
    fetchShiftTemplates();
    fetchWorkSchedules();
    fetchAttendances();
    fetchLeaveRequests();
    fetchOvertimeRequests();
  });
  
  </script>
  
  <style scoped>
  /* Add minimal scoped styles if needed, Tailwind should handle most */
  .max-h-96 {
    max-height: 24rem; /* Adjust as needed for list height */
  }
  </style>