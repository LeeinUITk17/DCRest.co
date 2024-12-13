import { defineStore } from 'pinia';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  quantity: number;
  deliveryOption: {
    id: number;
    name: string;
    cost: number;
  };
}

interface State {
  cartItems: Product[];
  previousOrders: Product[][];
}

export const useCartStore = defineStore('cart', {
  state: (): State => ({
    cartItems: [],
    previousOrders: [],
  }),
  getters: {
    cartTotal: (state) =>
      state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity + item.deliveryOption.cost,
        0
      ),
  },
  actions: {
    addToCart(product: Product) {
      const existingItem = this.cartItems.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        this.cartItems.push(product);
      }
      this.saveCartToLocalStorage();
    },
    updateCart(cartItems: Product[]) {
      this.cartItems = cartItems;
      this.saveCartToLocalStorage();
    },
    deleteItem(itemId: number) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.saveCartToLocalStorage();
    },
    clearCart() {
      this.cartItems = [];
      this.saveCartToLocalStorage();
    },
    addPreviousOrder(order: Product[]) {
      this.previousOrders.push(order);
      this.savePreviousOrdersToLocalStorage();
    },
    saveCartToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      }
    },
    loadCartFromLocalStorage() {
      if (process.client) {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
          this.cartItems = JSON.parse(storedCart);
        }
      }
    },
    savePreviousOrdersToLocalStorage() {
      if (process.client) {
        localStorage.setItem('previousOrders', JSON.stringify(this.previousOrders));
      }
    },
    loadPreviousOrdersFromLocalStorage() {
      if (process.client) {
        const storedOrders = localStorage.getItem('previousOrders');
        if (storedOrders) {
          this.previousOrders = JSON.parse(storedOrders);
        }
      }
    },
    clearPreviousOrders() {
      this.previousOrders = [];
      this.savePreviousOrdersToLocalStorage();
    },
  },
});