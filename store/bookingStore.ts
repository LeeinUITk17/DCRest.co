import { defineStore } from 'pinia';

export interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  requests: string;
}

interface State {
  bookings: Booking[];
}

export const useBookingStore = defineStore('booking', {
  state: (): State => ({
    bookings: [],
  }),
  getters: {
    getBookingById: (state) => {
      return (id: number) => state.bookings.find(booking => booking.id === id);
    },
  },
  actions: {
    addBooking(newBooking: Booking) {
      this.bookings.push(newBooking);
      this.saveBookingsToLocalStorage();
    },
    updateBooking(updatedBooking: Booking) {
      const index = this.bookings.findIndex(booking => booking.id === updatedBooking.id);
      if (index !== -1) {
        this.bookings[index] = updatedBooking;
        this.saveBookingsToLocalStorage();
      }
    },
    deleteBooking(bookingId: number) {
      this.bookings = this.bookings.filter(booking => booking.id !== bookingId);
      this.saveBookingsToLocalStorage();
    },
    saveBookingsToLocalStorage() {
      if (process.client) {
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
      }
    },
    loadBookingsFromLocalStorage() {
      if (process.client) {
        const storedBookings = localStorage.getItem('bookings');
        if (storedBookings) {
          this.bookings = JSON.parse(storedBookings);
         // console.log( JSON.stringify(this.bookings) );
        }
      }
    },
    clearBookings() {
      this.bookings = [];
      this.saveBookingsToLocalStorage();
    },
  },
});
