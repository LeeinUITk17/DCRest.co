<template>
    <div class="flex h-screen bg-gray-100">
      <div class="w-16 md:w-52 flex-shrink-0 z-50">
        <Sidebar />
      </div>
  
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mb-3">HR & Payroll</h1>
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              <button
                @click="switchView('employee')"
                :class="tabClass('employee')"
                :aria-current="activeView === 'employee' ? 'page' : undefined"
              >
                Employees
              </button>
              <button
                @click="switchView('attendance')"
                :class="tabClass('attendance')"
                :aria-current="activeView === 'attendance' ? 'page' : undefined"
              >
                Attendance
              </button>
               <button
                @click="switchView('leave')"
                :class="tabClass('leave')"
                :aria-current="activeView === 'leave' ? 'page' : undefined"
              >
                Leave Requests
              </button>
              <button
                @click="switchView('overtime')"
                :class="tabClass('overtime')"
                :aria-current="activeView === 'overtime' ? 'page' : undefined"
              >
                Overtime Requests
              </button>
              <button
                @click="switchView('payroll')"
                :class="tabClass('payroll')"
                :aria-current="activeView === 'payroll' ? 'page' : undefined"
              >
                Payroll
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
  const activeView = ref('employee');
  const employees = ref([]);
  const attendances = ref([]);
  const leaveRequests = ref([]);
  const overtimeRequests = ref([]);
  const payrolls = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  
  const formatDateTime = (value) => {
    if (!value) return '';
    try { return new Date(value).toLocaleString(); } catch (e) { return value; }
  };
  const formatDate = (value) => {
    if (!value) return '';
    try { return new Date(value).toLocaleDateString(); } catch (e) { return value; }
  };
  const formatTime = (value) => {
      if (!value) return '';
      try { return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return value; }
  };
  const formatCurrency = (value) => {
    const amount = Number(value);
    return !isNaN(amount) ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
  }
  const formatTypeOrStatus = (value) => {
      if (!value) return '';
      return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  const formatMinutes = (value) => {
      const minutes = Number(value);
      return !isNaN(minutes) ? `${minutes} min` : value;
  }
  
  const employeeColumns = ref([
    { key: 'id', label: 'Emp. ID' },
    { key: 'role', label: 'Role', formatter: formatTypeOrStatus },
    { key: 'employmentType', label: 'Type', formatter: formatTypeOrStatus },
    { key: 'employmentStatus', label: 'Status', formatter: formatTypeOrStatus },
    { key: 'hireDate', label: 'Hired Date', formatter: formatDate },
    { key: 'salary', label: 'Salary', formatter: formatCurrency, optional: true },
    { key: 'hourlyRate', label: 'Hourly Rate', formatter: formatCurrency, optional: true },
  ]);
  
  const attendanceColumns = ref([
    { key: 'employeeId', label: 'Emp. ID' },
    { key: 'workDate', label: 'Date', formatter: formatDate },
    { key: 'checkIn', label: 'Check In', formatter: formatTime },
    { key: 'checkOut', label: 'Check Out', formatter: formatTime },
    { key: 'overtimeMinutes', label: 'Overtime', formatter: formatMinutes, optional: true },
    { key: 'lateMinutes', label: 'Late', formatter: formatMinutes, optional: true },
    { key: 'earlyDepartureMinutes', label: 'Early Out', formatter: formatMinutes, optional: true },
  ]);
  
  const leaveRequestColumns = ref([
    { key: 'employeeId', label: 'Emp. ID' },
    { key: 'requestDate', label: 'Request Date', formatter: formatDate },
    { key: 'startDate', label: 'Start Date', formatter: formatDate },
    { key: 'endDate', label: 'End Date', formatter: formatDate },
    { key: 'status', label: 'Status', formatter: formatTypeOrStatus },
    { key: 'reason', label: 'Reason', optional: true },
  ]);
  
  const overtimeRequestColumns = ref([
    { key: 'employeeId', label: 'Emp. ID' },
    { key: 'date', label: 'Date', formatter: formatDate },
    { key: 'requestedMinutes', label: 'Minutes Req.', formatter: formatMinutes },
    { key: 'status', label: 'Status', formatter: formatTypeOrStatus },
    { key: 'reason', label: 'Reason', optional: true },
  ]);
  
  const payrollColumns = ref([
    { key: 'employeeId', label: 'Emp. ID' },
    { key: 'createdAt', label: 'Pay Period End', formatter: formatDate },
    { key: 'baseSalary', label: 'Base Salary', formatter: formatCurrency, optional: true },
    { key: 'workedHours', label: 'Hours Worked' },
    { key: 'overtimePay', label: 'Overtime Pay', formatter: formatCurrency },
    { key: 'deductions', label: 'Deductions', formatter: formatCurrency },
    { key: 'netSalary', label: 'Net Salary', formatter: formatCurrency },
  ]);
  
  const currentColumns = computed(() => {
    switch (activeView.value) {
      case 'attendance': return attendanceColumns.value;
      case 'leave': return leaveRequestColumns.value;
      case 'overtime': return overtimeRequestColumns.value;
      case 'payroll': return payrollColumns.value;
      case 'employee':
      default:
        return employeeColumns.value;
    }
  });
  
  const currentData = computed(() => {
     switch (activeView.value) {
      case 'attendance': return attendances.value;
      case 'leave': return leaveRequests.value;
      case 'overtime': return overtimeRequests.value;
      case 'payroll': return payrolls.value;
      case 'employee':
      default:
        return employees.value;
    }
  });
  
  const API_BASE_URL = 'http://localhost:8000';
  
  const fetchData = async (view) => {
      if (activeView.value !== view) return;
  
      isLoading.value = true;
      error.value = null;
  
      let url = '';
      let dataRef = null;
  
      switch(view) {
          case 'employee': url = `${API_BASE_URL}/employee`; dataRef = employees; break;
          case 'attendance': url = `${API_BASE_URL}/attendance`; dataRef = attendances; break;
          case 'leave': url = `${API_BASE_URL}/leave-request`; dataRef = leaveRequests; break;
          case 'overtime': url = `${API_BASE_URL}/overtime-request`; dataRef = overtimeRequests; break;
          case 'payroll': url = `${API_BASE_URL}/payroll`; dataRef = payrolls; break;
          default:
              isLoading.value = false; return;
      }
  
      try {
          const response = await axios.get(url, { withCredentials: true });
          dataRef.value = response.data?.data || response.data || [];
      } catch (err) {
          dataRef.value = [];
          handleApiError(err, `Could not fetch ${view} data.`);
      } finally {
          if (activeView.value === view) { isLoading.value = false; }
      }
  };
  
  const fetchEmployees = () => fetchData('employee');
  const fetchAttendances = () => fetchData('attendance');
  const fetchLeaveRequests = () => fetchData('leave');
  const fetchOvertimeRequests = () => fetchData('overtime');
  const fetchPayrolls = () => fetchData('payroll');
  
  const handleApiError = (err, defaultMessage) => {
    if (err.response) {
      error.value = `Error ${err.response.status}: ${err.response.data?.message || defaultMessage}`;
      if (err.response.status === 401 || err.response.status === 403) {
        error.value += ' Please check your login session.';
      }
    } else if (err.request) {
      error.value = 'Network Error: Unable to connect.';
    } else {
      error.value = `Error: ${err.message}`;
    }
  };
  
  const switchView = (view) => {
    if (activeView.value === view || isLoading.value) return;
    activeView.value = view;
    error.value = null;
    switch(view) {
        case 'employee': fetchEmployees(); break;
        case 'attendance': fetchAttendances(); break;
        case 'leave': fetchLeaveRequests(); break;
        case 'overtime': fetchOvertimeRequests(); break;
        case 'payroll': fetchPayrolls(); break;
    }
  };
  
  const goToAddPage = () => {
    let route = '';
    switch (activeView.value) {
      case 'employee': route = '/admin/hr/employees/create'; break;
      case 'leave': route = '/admin/hr/leave/create'; break;
      case 'overtime': route = '/admin/hr/overtime/create'; break;
    }
  };
  
  const tabClass = (viewName) => [
    'whitespace-nowrap pb-3 pt-1 px-1 border-b-2 font-medium text-sm focus:outline-none',
    activeView.value === viewName
      ? 'border-black text-black'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
  ];
  
  onMounted(() => {
    fetchEmployees();
  });
  </script>
  
  <style scoped>
  .flex-1 {
    min-width: 0;
  }
  .transition-opacity {
      transition: opacity 0.3s ease-in-out;
  }
  .overflow-x-auto {
      -webkit-overflow-scrolling: touch;
  }
  .overflow-x-auto::-webkit-scrollbar {
    height: 4px;
  }
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
  </style>
