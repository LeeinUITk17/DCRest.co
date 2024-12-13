<template>
    <div class="min-h-screen flex flex-col p-8">
      <h2 class="text-3xl text-center font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Previous Bookings</h2>
      <div v-if="bookings.length" class="bg-white p-6 shadow rounded-lg">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 text-left">Booking Index</th>
              <th class="py-2 text-left">Name</th>
              <th class="py-2 text-left">Email</th>
              <th class="py-2 text-left">Date</th>
              <th class="py-2 text-left">Time</th>
              <th class="py-2 text-center">Guests</th>
              <th class="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(booking, index) in bookings" :key="booking.id" class="border-t">
              <td class="py-2 text-left">{{ booking.id }}</td>
              <td class="py-2 text-left">{{ booking.name }}</td>
              <td class="py-2 text-left">{{ booking.email }}</td>
              <td class="py-2 text-left">{{ booking.date }}</td>
              <td class="py-2 text-left">{{ booking.time }}</td>
              <td class="py-2 text-center">{{ booking.guests }}</td>
              <td class="py-2 text-right">
                <button @click="editBooking(booking)" class="bg-yellow-500 text-white px-2   rounded-lg hover:bg-yellow-600 transition-colors">Edit</button>
                <button @click="deleteBooking(booking.id)" class="bg-red-500 text-white px-2   ml-2 rounded-lg hover:bg-red-600 transition-colors">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="bg-white p-6 shadow rounded-lg">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 text-left">Booking #</th>
              <th class="py-2 text-left">Name</th>
              <th class="py-2 text-left">Email</th>
              <th class="py-2 text-left">Date</th>
              <th class="py-2 text-left">Time</th>
              <th class="py-2 text-center">Guests</th>
              <th class="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td colspan="7" class="py-2 text-center">No bookings found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useBookingStore, type Booking } from '@/store/bookingStore';
import Swal from 'sweetalert2';
const bookingStore = useBookingStore();
const bookings = computed(() => bookingStore.bookings);
onMounted(() => {
  bookingStore.loadBookingsFromLocalStorage();
  //console.log('Bookings loaded:', bookings.value);  
});

const editBooking = (booking: Booking) => {
  Swal.fire({
    title: 'Edit Booking',
    html: `
      <div class="space-y-2 overflow-x-hidden">
        <input id="name" type="text" class="swal2-input text-sm px-2 py-2 border border-gray-300 rounded-md shadow-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter new name" value="${booking.name}">
        <input id="email" type="text" class="swal2-input text-sm px-2 py-2 border border-gray-300 rounded-md shadow-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter new email" value="${booking.email}">
        <input id="date" type="date" class="swal2-input text-sm px-2 py-2 border border-gray-300 rounded-md shadow-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" value="${booking.date}">
        <input id="time" type="time" class="swal2-input text-sm px-2 py-2 border border-gray-300 rounded-md shadow-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" value="${booking.time}">
        <input id="guests" type="number" class="swal2-input text-sm px-2 py-2 border border-gray-300 rounded-md shadow-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter number of guests" value="${booking.guests}">
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Update Booking',
    confirmButtonColor: '#3498db', 
    cancelButtonColor: '#e74c3c', 
    focusConfirm: false,
    focusCancel: false,
    preConfirm: () => {
      const name = (document.getElementById('name') as HTMLInputElement).value;
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const date = (document.getElementById('date') as HTMLInputElement).value;
      const time = (document.getElementById('time') as HTMLInputElement).value;
      const guests = (document.getElementById('guests') as HTMLInputElement).value;
      if (!name || !email || !date || !time || !guests) {
        Swal.showValidationMessage('Please fill in all fields');
        return false;
      }
      return { name, email, date, time, guests };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, email, date, time, guests } = result.value;
      booking.name = name;
      booking.email = email;
      booking.date = date;
      booking.time = time;
      booking.guests = guests;
      bookingStore.updateBooking(booking);
      Swal.fire('Updated!', 'Your booking has been updated.', 'success');
    }
  });
};
const deleteBooking = (bookingId: number) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this booking?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      bookingStore.deleteBooking(bookingId);
      Swal.fire('Deleted!', 'Your booking has been deleted.', 'success');
    }
  });
};
</script>
