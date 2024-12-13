import { defineStore } from 'pinia';

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface State {
  addresses: Address[];
}

export const useAddressStore = defineStore('address', {
  state: (): State => ({
    addresses: [],
  }),
  getters: {
    getAddressById: (state) => {
      return (id: number) => state.addresses.find(address => address.id === id);
    },
  },
  actions: {
    addAddress(newAddress: Address) {
      this.addresses.push(newAddress);
      this.saveAddressesToLocalStorage();
    },
    updateAddress(updatedAddress: Address) {
      const index = this.addresses.findIndex(address => address.id === updatedAddress.id);
      if (index !== -1) {
        this.addresses[index] = updatedAddress;
        this.saveAddressesToLocalStorage();
      }
    },
    deleteAddress(addressId: number) {
      this.addresses = this.addresses.filter(address => address.id !== addressId);
      this.saveAddressesToLocalStorage();
    },
    saveAddressesToLocalStorage() {
      if (process.client) {
        localStorage.setItem('addresses', JSON.stringify(this.addresses));
      }
    },
    loadAddressesFromLocalStorage() {
      if (process.client) {
        const storedAddresses = localStorage.getItem('addresses');
        if (storedAddresses) {
          this.addresses = JSON.parse(storedAddresses);
        }
      }
    },
    clearAddresses() {
      this.addresses = [];
      this.saveAddressesToLocalStorage();
    },
  },
});
