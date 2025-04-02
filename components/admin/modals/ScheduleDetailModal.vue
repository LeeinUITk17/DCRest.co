<template>
    <div
      class="fixed inset-0 z-[99] bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out flex items-center justify-center p-4 font-sans"
      @click="closeModal"
    >
      <div
        class="relative bg-white rounded-lg shadow-xl overflow-hidden max-w-lg w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0"
        ref="modalPanel"
        @click.stop
      >
        <div class="flex justify-between items-center p-4 px-5 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Schedule Details</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-1 transition-colors"
            title="Close Modal"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
  
        <div v-if="eventInfo" class="p-5 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p class="text-base font-medium text-gray-900">{{ eventInfo.title }}</p>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <strong class="font-medium text-gray-600 block mb-0.5">Employee ID:</strong>
              <span v-if="!showEmployeeId"
                    @click="revealEmployeeId"
                    class="text-blue-600 hover:text-blue-800 cursor-pointer underline decoration-dotted decoration-gray-400 transition-colors duration-150"
                    title="Click to show Employee ID">
                Click to reveal
              </span>
              <span v-else class="text-gray-800 break-words">
                {{ eventInfo.extendedProps?.employeeId || 'N/A' }}
              </span>
            </div>
            <div>
              <strong class="font-medium text-gray-600 block mb-0.5">Shift Name:</strong>
              <span class="text-gray-800 break-words">{{ eventInfo.extendedProps?.shiftName || 'N/A' }}</span>
            </div>
            <div>
              <strong class="font-medium text-gray-600 block mb-0.5">Shift Type:</strong>
              <span :class="['inline-block px-2 py-0.5 rounded text-xs font-semibold tracking-wide', shiftTypeClass(eventInfo.extendedProps?.shiftType)]">
                {{ eventInfo.extendedProps?.shiftType || 'N/A' }}
              </span>
            </div>
            <div></div>
            <div class="col-span-1 md:col-span-2">
              <strong class="font-medium text-gray-600 block mb-0.5">Start Time:</strong>
              <span class="text-gray-800">{{ formatDateTime(eventInfo.start) }}</span>
            </div>
            <div class="col-span-1 md:col-span-2">
              <strong class="font-medium text-gray-600 block mb-0.5">End Time:</strong>
              <span class="text-gray-800">{{ formatDateTime(eventInfo.end) }}</span>
            </div>
  
            <div class="col-span-1 md:col-span-2 pt-2">
              <strong class="font-medium text-gray-600 block mb-1">Notes:</strong>
              <p class="text-gray-800 text-sm whitespace-pre-wrap break-words bg-gray-50 p-3 rounded border border-gray-200 min-h-[4em]">
                 {{ eventInfo.extendedProps?.notes || 'No notes provided.' }}
              </p>
            </div>
          </div>
  
        </div>
        <div v-else class="p-6 text-center text-gray-500">
          Loading event details...
        </div>
  
        <div class="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200 space-x-2">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 transition duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, onMounted, nextTick } from 'vue';
  
  const props = defineProps({
    eventInfo: {
      type: Object,
      required: false,
      default: null
    },
  });
  
  const emit = defineEmits(['close']);
  
  const modalPanel = ref(null);
  
  const showEmployeeId = ref(false);
  
  onMounted(async () => {
    await nextTick();
    if (modalPanel.value) {
       modalPanel.value.classList.remove('scale-95', 'opacity-0');
       modalPanel.value.classList.add('scale-100', 'opacity-100');
    }
    showEmployeeId.value = false;
  });
  
  const revealEmployeeId = () => {
    showEmployeeId.value = true;
  };
  
  const closeModal = async () => {
     if (modalPanel.value) {
        modalPanel.value.classList.remove('scale-100', 'opacity-100');
        modalPanel.value.classList.add('scale-95', 'opacity-0');
     }
     setTimeout(() => {
         emit('close');
     }, 300);
  };
  
  const formatDateTime = (dateInput) => {
    if (!dateInput) return 'N/A';
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
          return 'Invalid Date';
      }
      return new Intl.DateTimeFormat(navigator.language || 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", dateInput, e);
      return String(dateInput);
    }
  };
  
  const shiftTypeClass = (shiftType) => {
    const type = shiftType?.toUpperCase() || '';
    switch (type) {
      case 'MORNING': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'AFTERNOON': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'EVENING': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'NIGHT': return 'bg-zinc-600 text-white border border-zinc-700';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  </script>
  
  <style scoped>
  .transform { transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; }
  .opacity-0 { opacity: 0; }
  .opacity-100 { opacity: 1; }
  .scale-95 { transform: scale(0.95); }
  .scale-100 { transform: scale(1); }
  
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  
  .max-h-\[70vh\]::-webkit-scrollbar {
    width: 6px;
  }
  .max-h-\[70vh\]::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  .max-h-\[70vh\]::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  .max-h-\[70vh\]::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  </style>
