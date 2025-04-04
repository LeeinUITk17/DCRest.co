<template>
  <div class="container mx-auto p-4 md:p-6 space-y-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Point of Sale - Cashier</h1>

    <!-- Message Display -->
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{{ successMessage }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Menu Items -->
      <div class="lg:col-span-1 order-last lg:order-first">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-gray-700">Menu</h2>
          <!-- Menu Loading/Error/Display -->
          <div v-if="isLoadingMenu" class="text-center text-gray-500">Loading menu...</div>
          <div v-if="menuError" class="text-red-600">{{ menuError }}</div>
          <div v-if="!isLoadingMenu && !menuError" class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <!-- Category Iteration -->
            <div v-for="category in categories" :key="category.id" class="mb-4">
              <h3 class="text-lg font-medium text-gray-600 mb-2 sticky top-0 bg-white py-1">{{ category.name }}</h3>
              <div class="space-y-2">
                 <!-- Menu Item Iteration -->
                <div v-for="item in getItemsForCategory(category.id)" :key="item.id"
                     class="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50">
                  <div>
                    <span class="font-medium">{{ item.name }}</span>
                    <span class="text-sm text-gray-600 ml-2">({{ formatCurrency(item.price) }})</span>
                  </div>
                  <button @click="addToCartFromMenu(item)"
                          class="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex-shrink-0">
                    Add
                  </button>
                </div>
                 <div v-if="getItemsForCategory(category.id).length === 0" class="text-sm text-gray-400 italic pl-2">
                    No items in this category.
                 </div>
              </div>
            </div>
             <!-- Fallback for uncategorized items -->
             <div v-if="categories.length === 0 && menuItems.length > 0" class="mb-4">
                 <!-- ... (unchanged) ... -->
             </div>
             <div v-if="menuItems.length === 0 && !isLoadingMenu" class="text-gray-500 italic">
                No menu items found.
             </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Order Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Customer Section -->
        <div class="bg-white p-4 rounded-lg shadow">
             <!-- ... (Customer section unchanged) ... -->
          <h2 class="text-xl font-semibold mb-3 text-gray-700">Customer</h2>
          <div class="flex items-end space-x-2 mb-3">
            <div class="flex-grow">
              <label for="phone" class="block text-sm font-medium text-gray-600 mb-1">Customer Phone (Optional):</label>
              <input type="tel" id="phone" v-model="customerPhoneNumber" placeholder="Enter phone number" :disabled="isLoadingCustomer"
                     class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <button @click="findCustomer" :disabled="!customerPhoneNumber || isLoadingCustomer"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-[42px]">
              {{ isLoadingCustomer ? 'Finding...' : 'Find & Load Coupons' }}
            </button>
          </div>
          <div v-if="foundUserId" class="mt-3 text-sm">
            <p class="text-green-700 font-medium">Customer Found: User ID {{ foundUserId }}</p>
            <div v-if="availableCoupons.length > 0" class="mt-2">
              <label for="coupon" class="block text-sm font-medium text-gray-600 mb-1">Available Coupons:</label>
              <select id="coupon" v-model="selectedCouponId"
                      class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                <option value="">No Coupon</option>
                <option v-for="couponTarget in availableCoupons" :key="couponTarget.coupon.id" :value="couponTarget.coupon.id">
                  {{ couponTarget.coupon.code }} - {{ couponTarget.coupon.description || 'Discount' }}
                </option>
              </select>
            </div>
            <div v-else class="mt-2 text-gray-500">No coupons available for this customer.</div>
          </div>
          <div v-if="customerSearchError" class="mt-2 text-sm text-red-600">{{ customerSearchError }}</div>
        </div>

        <!-- Order Options Section -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-3 text-gray-700">Order Options</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
             <!-- Order Type -->
            <div>
                <label for="orderType" class="block text-sm font-medium text-gray-600 mb-1">Order Type:</label>
                <select id="orderType" v-model="orderType" class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white h-[42px]">
                    <option :value="OrderType.DINE_IN">Dine In</option>
                    <option :value="OrderType.TAKEAWAY">Takeaway</option>
                    <option :value="OrderType.DELIVERY">Delivery</option>
                </select>
            </div>

             <!-- Table Selection (DINE_IN) -->
            <div v-if="orderType === OrderType.DINE_IN">
                <label for="tableId" class="block text-sm font-medium text-gray-600 mb-1">Available Table:</label>
                 <div v-if="isLoadingTables" class="text-sm text-gray-500 py-2">Loading tables...</div>
                 <div v-if="tablesError" class="text-sm text-red-600 py-2">{{ tablesError }}</div>
                 <select v-if="!isLoadingTables && !tablesError"
                         id="tableId" v-model="tableId"
                         :disabled="availableTables.length === 0"
                         class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white h-[42px] disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="" disabled>Select a table</option>
                    <option v-for="table in availableTables" :key="table.id" :value="table.id">
                        Table {{ table.number }} ({{ table.capacity }} seats)
                    </option>
                     <option v-if="availableTables.length === 0" value="" disabled>No available tables</option>
                 </select>
            </div>

             <!-- Shipping Fee (DELIVERY) -->
            <div v-if="orderType === OrderType.DELIVERY">
                <label for="shippingFee" class="block text-sm font-medium text-gray-600 mb-1">Shipping Fee:</label>
                <input type="number" id="shippingFee" v-model.number="shippingFee" placeholder="0.00" step="0.01" class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 h-[42px]" />
            </div>
          </div>
        </div>

        <!-- Order Cart Section -->
        <div class="bg-white p-4 rounded-lg shadow">
            <!-- ... (Cart section unchanged) ... -->
          <h2 class="text-xl font-semibold mb-3 text-gray-700">Order Cart</h2>
          <div v-if="cart.length === 0" class="text-gray-500 italic">Cart is empty. Add items from the menu.</div>
          <ul v-else class="space-y-2 mb-4 max-h-[40vh] overflow-y-auto pr-2">
            <li v-for="(item, index) in cart" :key="item.menuItemId" class="flex justify-between items-center border-b border-gray-200 py-2 text-sm">
              <div class="flex-grow pr-2">
                 <span class="font-medium">{{ item.name }}</span>
                 <span class="text-gray-600"> ({{ formatCurrency(item.price) }} x {{ item.quantity }})</span>
                 <span class="font-semibold float-right"> = {{ formatCurrency(item.price * item.quantity) }}</span>
              </div>
              <div class="flex items-center space-x-1 flex-shrink-0">
                 <button @click="updateQuantity(index, -1)" :disabled="item.quantity <= 1"
                         class="px-2 py-0.5 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 text-xs">-</button>
                 <span class="px-1 w-6 text-center">{{ item.quantity }}</span>
                 <button @click="updateQuantity(index, 1)"
                         class="px-2 py-0.5 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">+</button>
                 <button @click="removeFromCart(index)"
                         class="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs">Remove</button>
              </div>
            </li>
          </ul>

          <div class="order-summary pt-4 border-t border-gray-200 text-right text-sm space-y-1" v-if="cart.length > 0">
            <p>Subtotal: <span class="font-medium">{{ formatCurrency(subtotal) }}</span></p>
            <p>Tax (Est. 10%): <span class="font-medium">{{ formatCurrency(taxAmount) }}</span></p>
            <p v-if="orderType === OrderType.DELIVERY">Shipping Fee: <span class="font-medium">{{ formatCurrency(shippingFee || 0) }}</span></p>
            <p class="text-base mt-1"><strong>Estimated Total: <span class="font-semibold">{{ formatCurrency(displayTotal) }}</span></strong></p>
            <p class="text-xs text-gray-500">Estimated Points Earned: {{ earnedPoints.toFixed(2) }}</p>
          </div>
        </div>

         <!-- Checkout Button -->
         <div class="text-center mt-6">
             <!-- ... (Checkout button unchanged) ... -->
            <button @click="handleCheckout" :disabled="cart.length === 0 || isCheckingOut || isPaying || (orderType === OrderType.DINE_IN && !tableId)"
                    class="w-full md:w-auto px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
             <span v-if="isCheckingOut">Processing Order...</span>
             <span v-else>Proceed to Checkout</span>
            </button>
         </div>

      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" @click.self="closePaymentModal">
        <!-- ... (Payment modal unchanged) ... -->
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-xl font-bold text-center mb-5 text-gray-800">Complete Payment</h2>
        <div v-if="createdOrder" class="space-y-4">
          <p class="text-center text-sm">Order ID: <span class="font-mono">{{ createdOrder.id }}</span></p>
          <p class="text-center text-2xl font-bold text-indigo-700">Amount Due: {{ formatCurrency(createdOrder.totalAmount) }}</p>
          <p class="text-center text-xs text-gray-500">(Includes tax, shipping, and applied discounts)</p>

          <div class="form-group">
            <label for="paymentMethod" class="block text-sm font-medium text-gray-600 mb-1">Payment Method:</label>
            <select id="paymentMethod" v-model="paymentMethod" class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
              <option :value="PaymentMethod.CASH">Cash</option>
              <option :value="PaymentMethod.CREDIT_CARD">Credit Card</option>
              <option :value="PaymentMethod.BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

           <div v-if="paymentError" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm" role="alert">
              {{ paymentError }}
           </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closePaymentModal" :disabled="isPaying"
                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50">
                    Cancel
            </button>
            <button @click="submitPayment" :disabled="isPaying"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              <span v-if="isPaying">Processing Payment...</span>
              <span v-else>Confirm Payment</span>
            </button>
          </div>
        </div>
         <div v-else class="text-center text-gray-500 py-5">Loading order details...</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

// --- Axios API Client Setup ---
// ... (unchanged)
const API_BASE_URL = 'http://localhost:8000';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
apiClient.interceptors.response.use(response => response, error => {
    console.error('API Error:', error.response || error.message);
    const message = error.response?.data?.message || error.message || 'An unknown API error occurred';
    return Promise.reject(new Error(message));
});

// --- Constants ---
// ... (unchanged)
const OrderType = { DINE_IN: 'DINE_IN', TAKEAWAY: 'TAKEAWAY', DELIVERY: 'DELIVERY' };
const PaymentMethod = { CREDIT_CARD: 'CREDIT_CARD', CASH: 'CASH', BANK_TRANSFER: 'BANK_TRANSFER' };
const PaymentStatus = { PENDING: 'PENDING', COMPLETED: 'COMPLETED', FAILED: 'FAILED', REFUNDED: 'REFUNDED' };
const TableStatus = { AVAILABLE: 'AVAILABLE', OCCUPIED: 'OCCUPIED', RESERVED: 'RESERVED' }; // Added TableStatus Enum


// --- State ---
// ... (Menu, Cart, Customer states unchanged)
const menuItems = ref([]);
const categories = ref([]);
const isLoadingMenu = ref(false);
const menuError = ref('');
const cart = ref([]);
const customerPhoneNumber = ref('');
const foundUserId = ref(null);
const availableCoupons = ref([]);
const selectedCouponId = ref('');
const isCheckingOut = ref(false);
const isPaying = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const paymentError = ref('');
const showPaymentModal = ref(false);
const createdOrder = ref(null);
const paymentMethod = ref(PaymentMethod.CASH);
const isLoadingCustomer = ref(false);
const customerSearchError = ref('');


// --- NEW State for Tables ---
const availableTables = ref([]); // To store tables with status AVAILABLE
const isLoadingTables = ref(false);
const tablesError = ref('');

// --- State for Order Options ---
const orderType = ref(OrderType.DINE_IN);
const tableId = ref(''); // This will now hold the selected table ID from dropdown
const shippingFee = ref(null);


// --- Lifecycle Hooks ---
onMounted(() => {
  fetchCategories();
  fetchMenuItems();
  fetchAvailableTables(); // Fetch tables on component mount
});

// --- API Interaction ---
const handleApiError = (err, defaultMessage = 'An error occurred.') => {
  // ... (unchanged)
  console.error("Operation failed:", err);
  return err.message || defaultMessage;
};

const fetchCategories = async () => {
  // ... (unchanged, check endpoint '/category' vs '/categories')
  isLoadingMenu.value = true; // Keep using menu loading for simplicity or add separate category loading
  menuError.value = '';
  try {
    const response = await apiClient.get('/category'); // Ensure correct endpoint
    categories.value = response.data?.data || response.data || [];
  } catch (err) {
    categories.value = [];
    menuError.value = handleApiError(err, 'Could not fetch categories.');
  } finally {
     // Manage loading state carefully if fetching multiple things
  }
};

const fetchMenuItems = async () => {
  // ... (unchanged)
  isLoadingMenu.value = true;
  menuError.value = '';
  try {
    const response = await apiClient.get('/menu-items');
    const items = response.data?.data || response.data || [];
    menuItems.value = items.map(item => ({
        ...item,
        price: parseFloat(item.price)
    }));
  } catch (err) {
    menuItems.value = [];
    menuError.value = handleApiError(err, 'Could not fetch menu items.');
  } finally {
    isLoadingMenu.value = false;
  }
};

// --- NEW Fetch Available Tables Function ---
const fetchAvailableTables = async () => {
    isLoadingTables.value = true;
    tablesError.value = '';
    availableTables.value = []; // Reset before fetching
    try {
        const response = await apiClient.get('/table');
        // Assuming response.data is an array of table objects like { id, number, status, ... }
        // Or it might be nested like response.data.data
        const allTables = response.data?.data || response.data || [];

        // Filter for available tables
        availableTables.value = allTables.filter(table => table.status === TableStatus.AVAILABLE && !table.isDeleted);

        if (availableTables.value.length === 0) {
            console.warn("No available tables found.");
            // Optional: Set an informational message instead of an error
            // tablesError.value = 'No tables are currently available.';
        }

    } catch (err) {
        tablesError.value = handleApiError(err, 'Could not fetch tables.');
        availableTables.value = []; // Ensure it's empty on error
    } finally {
        isLoadingTables.value = false;
    }
};


async function findCustomer() {
  // ... (unchanged, check coupon endpoint '/coupon-target/PinkCoupon/${userId}' vs '/coupon-targets/user/${userId}')
  if (!customerPhoneNumber.value) return;
  isLoadingCustomer.value = true;
  customerSearchError.value = '';
  foundUserId.value = null;
  availableCoupons.value = [];
  selectedCouponId.value = '';
  clearMessages();
  try {
    const userResponse = await apiClient.get(`/users/pinkId/${customerPhoneNumber.value}`);
    const userId = userResponse.data;
    if (userId) {
        foundUserId.value = userId;
        // Ensure this endpoint is correct
        const couponsResponse = await apiClient.get(`/coupon-target/PinkCoupon/${userId}`);
        availableCoupons.value = couponsResponse.data || [];
    } else {
         customerSearchError.value = 'Customer phone number not found.';
    }
  } catch (error) {
    customerSearchError.value = handleApiError(error, 'Failed to find customer or coupons.');
    foundUserId.value = null;
    availableCoupons.value = [];
  } finally {
    isLoadingCustomer.value = false;
  }
}

async function handleCheckout() {
  // ... (Validation updated slightly for clarity)
  clearMessages();
  if (cart.value.length === 0) {
    errorMessage.value = "Cannot checkout with an empty cart."; return;
  }
   if (orderType.value === OrderType.DINE_IN && !tableId.value) {
     // Now checking if a table is selected from the dropdown
     errorMessage.value = "Please select an available table for Dine In orders."; return;
   }
   if (orderType.value === OrderType.DELIVERY && (shippingFee.value === null || shippingFee.value < 0)) {
     errorMessage.value = "Please enter a valid Shipping Fee for Delivery orders."; return;
   }

  // ... (Rest of checkout logic unchanged)
  isCheckingOut.value = true;
  const orderPayload = {
    orderType: orderType.value,
    orderItems: cart.value.map(item => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: Number(item.price),
    })),
    ...(tableId.value && orderType.value === OrderType.DINE_IN && { tableId: tableId.value }),
    ...(shippingFee.value !== null && orderType.value === OrderType.DELIVERY && { shippingFee: Number(shippingFee.value) }),
    ...(selectedCouponId.value && { couponId: selectedCouponId.value }),
  };
  try {
    // Ensure endpoint '/order' vs '/orders' is correct
    const response = await apiClient.post(`/order/${customerPhoneNumber.value}`, orderPayload);
    if (response.data && response.data.order && response.data.order.id) {
        createdOrder.value = {
            id: response.data.order.id,
            totalAmount: parseFloat(response.data.order.totalAmount),
        };
        paymentError.value = '';
        openPaymentModal();
    } else {
        throw new Error("Invalid response structure received after creating order.");
    }
  } catch (error) {
    errorMessage.value = handleApiError(error, 'Failed to create order.');
    createdOrder.value = null;
  } finally {
    isCheckingOut.value = false;
  }
}

async function submitPayment() {
  // ... (unchanged, ensure endpoint '/payment' vs '/payments' is correct)
  if (!createdOrder.value?.id) {
      paymentError.value = "Error: Order details are missing."; return;
  }
  isPaying.value = true;
  paymentError.value = '';
  clearMessages();
  const paymentPayload = {
    orderId: createdOrder.value.id,
    paymentDate: new Date().toISOString(),
    method: paymentMethod.value,
    status: PaymentStatus.COMPLETED,
  };
  try {
    // Ensure endpoint '/payment' vs '/payments' is correct
    const response = await apiClient.post('/payment', paymentPayload);
    successMessage.value = `Payment successful! Payment ID: ${response.data.id}. Order Completed.`;
    closePaymentModal();
    clearOrderState();
    fetchAvailableTables(); // Optionally refresh available tables after payment completes
  } catch (error) {
     paymentError.value = handleApiError(error, 'Payment failed.');
  } finally {
      isPaying.value = false;
  }
}

// --- Menu / Cart Management ---
// ... (unchanged)
function addToCartFromMenu(menuItem) {
    if (!menuItem || !menuItem.id || !menuItem.name || menuItem.price === undefined) {
        console.error("Invalid menu item data:", menuItem);
        errorMessage.value = "Error adding item to cart.";
        return;
    }
    addToCart({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: Number(menuItem.price)
    });
}
function addToCart(itemData) {
  const existingItemIndex = cart.value.findIndex(item => item.menuItemId === itemData.menuItemId);
  if (existingItemIndex > -1) {
    cart.value[existingItemIndex].quantity++;
  } else {
    cart.value.push({ ...itemData, quantity: 1 });
  }
  clearMessages();
}
function removeFromCart(index) {
  cart.value.splice(index, 1);
  clearMessages();
}
function updateQuantity(index, change) {
  const item = cart.value[index];
  if (item) {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1) {
      item.quantity = newQuantity;
    } else {
      removeFromCart(index);
    }
  }
  clearMessages();
}

// --- Computed Properties ---
// ... (unchanged)
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});
const taxAmount = computed(() => subtotal.value * 0.10);
const earnedPoints = computed(() => subtotal.value * 0.01);
const displayTotal = computed(() => {
    let total = subtotal.value + taxAmount.value;
    if (orderType.value === OrderType.DELIVERY && shippingFee.value) {
        total += Number(shippingFee.value);
    }
    return total;
});
const getItemsForCategory = (categoryId) => {
    return menuItems.value.filter(item => item.categoryId === categoryId);
}


// --- Modal ---
// ... (unchanged)
function openPaymentModal() { showPaymentModal.value = true; }
function closePaymentModal() { showPaymentModal.value = false; }

// --- Utility Functions ---
// ... (unchanged)
function clearMessages() {
    errorMessage.value = '';
    successMessage.value = '';
}
function clearOrderState() {
    cart.value = [];
    customerPhoneNumber.value = '';
    foundUserId.value = null;
    availableCoupons.value = [];
    selectedCouponId.value = '';
    orderType.value = OrderType.DINE_IN;
    tableId.value = ''; // Reset selected table
    shippingFee.value = null;
    createdOrder.value = null;
    paymentMethod.value = PaymentMethod.CASH;
    clearMessages();
    customerSearchError.value = '';
    paymentError.value = '';
}
const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        value = Number(value) || 0;
    }
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Adjust as needed
};


// --- Watchers ---
watch(orderType, (newType, oldType) => {
    if (newType !== OrderType.DINE_IN) {
        tableId.value = ''; // Clear selected table if not Dine In
    } else if (newType === OrderType.DINE_IN && oldType !== OrderType.DINE_IN) {
        // If switching TO Dine In, maybe refresh tables? Or rely on initial load.
        // fetchAvailableTables(); // Uncomment if you want to refresh tables on switching to Dine In
    }

    if (newType !== OrderType.DELIVERY) {
        shippingFee.value = null;
    }
});

watch(foundUserId, (newId, oldId) => {
    // ... (unchanged)
    if (newId !== oldId) {
        selectedCouponId.value = '';
    }
});

</script>