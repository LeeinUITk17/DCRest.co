<template>
    <div class="flex h-screen bg-gray-100 font-sans">
      <div class="w-16 md:w-52 flex-shrink-0 z-50 shadow-md">
        <Sidebar />
      </div>
  
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- <div class="bg-white border-b border-gray-200 px-4 py-3 md:px-6 shadow-sm">
          <div class="flex justify-between items-center">
            <h1 class="text-xl md:text-2xl font-semibold text-gray-800">Work Schedule Calendar</h1>
            <button
              @click="goToAddSchedule"
              class="inline-flex items-center px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-150 ease-in-out"
              title="Add New Schedule"
            >
              <i class="fas fa-plus mr-2"></i> Add Schedule
            </button>
          </div>
        </div> -->
  
        <div class="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 space-y-4">
          <div v-if="isLoading" class="flex-grow flex items-center justify-center text-gray-500">
            <loading />
            <span class="ml-2">Loading schedules...</span>
          </div>
  
          <div v-if="error && !isLoading" class="p-4">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
              <strong class="font-bold mr-2">Error!</strong>
              <span class="block sm:inline"> {{ error }}</span>
            </div>
          </div>
  
          <div v-if="!isLoading && !error" class="flex-grow bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200">
            <FullCalendar :options="calendarOptions" />
          </div>
        </div>
      </div>
  
      <ScheduleDetailModal
        v-if="selectedEvent"
        :event-info="selectedEvent"
        @close="closeModalAndReset"
      />
    </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Sidebar from '~/components/admin/Sidebar.vue';
import loading from '~/components/loading.vue';
import ScheduleDetailModal from '~/components/admin/modals/ScheduleDetailModal.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const error = ref(null);
const workSchedules = ref([]);
const shiftTemplates = ref([]);
const selectedEvent = ref(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [scheduleResponse, templateResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/work-schedule`, { withCredentials: true }),
      axios.get(`${API_BASE_URL}/shift`, { withCredentials: true })
    ]);

    workSchedules.value = scheduleResponse.data?.data || scheduleResponse.data || [];
    shiftTemplates.value = templateResponse.data?.data || templateResponse.data || [];
  } catch (err) {
    console.error("Error fetching data:", err);
    workSchedules.value = [];
    shiftTemplates.value = [];
    handleApiError(err, 'Could not fetch schedule or template data.');
  } finally {
    isLoading.value = false;
  }
};

const handleApiError = (err, defaultMessage) => {
  if (axios.isCancel(err)) {
    console.log('Request canceled:', err.message);
    return;
  }
  if (err.response) {
    error.value = `Error ${err.response.status}: ${err.response.data?.message || defaultMessage}`;
    if (err.response.status === 401) {
      error.value += ' Session may have expired. Please log in again.';
    } else if (err.response.status === 403) {
      error.value += ' You do not have permission to access this resource.';
    }
  } else if (err.request) {
    error.value = 'Network Error: Could not connect to the server. Please check your connection.';
  } else {
    error.value = `Error: ${err.message || defaultMessage}`;
  }
};

const shiftTemplateMap = computed(() => {
  const map = new Map();
  shiftTemplates.value.forEach(template => {
    if (template && template.id) {
        map.set(template.id, template);
    }
  });
  return map;
});

const calendarEvents = computed(() => {
  return workSchedules.value
    .filter(schedule => schedule && !schedule.isDeleted)
    .map(schedule => {
      const template = shiftTemplateMap.value.get(schedule.shiftTemplateId);
      const shiftName = template?.name || 'Unknown Shift';
      const employeeDisplay = `Emp ${schedule.employeeId}`;
      const title = `${employeeDisplay} - ${shiftName}`;

      let eventColor = '#3788d8';
      const shiftTypeUpper = template?.shiftType?.toUpperCase();
      switch(shiftTypeUpper) {
          case 'MORNING': eventColor = '#f59e0b'; break;
          case 'AFTERNOON': eventColor = '#10b981'; break;
          case 'EVENING': eventColor = '#6366f1'; break;
          case 'NIGHT': eventColor = '#3f3f46'; break;
      }

      return {
        id: String(schedule.id),
        title: title,
        start: schedule.shiftStart,
        end: schedule.shiftEnd,
        allDay: false,
        backgroundColor: eventColor,
        borderColor: eventColor,
        extendedProps: {
          employeeId: schedule.employeeId,
          shiftTemplateId: schedule.shiftTemplateId,
          shiftName: shiftName,
          shiftType: template?.shiftType || 'N/A',
          notes: schedule.notes || '',
        }
      };
    });
});

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: [],
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventClick: handleEventClick,
  dateClick: handleDateClick,
  height: 'auto',
});

watch(calendarEvents, (newEvents) => {
  calendarOptions.events = newEvents;
}, { immediate: true });

function handleEventClick(clickInfo) {
  selectedEvent.value = clickInfo.event;
}

function handleDateClick(arg) {
  console.log('Date clicked:', arg.dateStr, 'in view:', arg.view.type);
  alert('Clicked on date: ' + arg.dateStr);
}

const goToAddSchedule = () => {
    console.log("Navigating to Add Schedule page...");
    alert("Navigation to Add Schedule page triggered (implement routing).");
}

const closeModalAndReset = () => {
    selectedEvent.value = null;
};

onMounted(() => {
  fetchData();
});
</script>
  
<style>
@import '@fortawesome/fontawesome-free/css/all.min.css';

.fc {
  font-family: inherit;
}

.fc .fc-button {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  color: #374151;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: background-color 0.15s ease-in-out;
  box-shadow: none;
  text-transform: capitalize;
}

.fc .fc-button:hover {
  background-color: #d1d5db;
}

.fc .fc-button:focus {
   outline: none;
   box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.5);
}

.fc .fc-button-primary {
  background-color: #1f2937;
  border-color: #1f2937;
  color: #ffffff;
}

.fc .fc-button-primary:hover {
  background-color: #111827;
}

.fc .fc-button-primary:focus {
   outline: none;
   box-shadow: 0 0 0 2px rgba(55, 65, 81, 0.5);
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  background-color: #111827;
  border-color: #111827;
}

.fc .fc-toolbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.fc-daygrid-day.fc-day-today {
  background-color: rgba(253, 242, 233, 0.5);
}

.fc-event {
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 0.8rem;
    cursor: pointer;
}

.fc-event:hover {
    opacity: 0.85;
}

.fc-view-harness {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.fc-view {
  flex-grow: 1;
}
</style>
