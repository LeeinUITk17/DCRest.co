<template>
  <aside class="w-16 md:w-56 h-full fixed left-0 top-0 z-40 flex flex-col bg-white transition-all duration-300 ease-in-out border-r border-neutral-200">
    <div class="h-16 flex items-center justify-center md:justify-start md:pl-6 shrink-0 border-b border-neutral-200">
      <span class="text-2xl font-bold text-neutral-800 hidden md:inline">🍔 DCRest.SMS</span>
      <span class="text-2xl font-bold text-neutral-800 md:hidden">🍔</span>
    </div>
    <nav class="mt-4 flex-grow overflow-y-auto overflow-x-hidden">
      <ItemSidebar icon="cash-register" label="Point Of Sale" to="/admin" />
      <ItemSidebar icon="briefcase" label="EMS" to="/admin/ems" />
      <ItemSidebar icon="users" label="CRM" to="/admin/crm" />
      <ItemSidebar icon="shopping-cart" label="Orders" to="/admin/orders" />
      <ItemSidebar icon="users" label="Customers" to="/admin/customers" />
      <ItemSidebar icon="utensils" label="Menu" to="/admin/menu" />
      <ItemSidebar icon="ticket-alt" label="Coupons" to="/admin/coupons" />
      <ItemSidebar icon="user-tie" label="Employees" to="/admin/employees" />
      <ItemSidebar icon="boxes" label="Inventory" to="/admin/inventory" />
      <ItemSidebar icon="calendar" label="Calendar" to="/admin/calendar" />
      <ItemSidebar icon="cog" label="Settings" to="/admin/settings" />
    </nav>
    <div class="mt-auto p-4 border-t border-neutral-200 shrink-0">
      <ItemSidebar
        icon="sign-out-alt"
        label="Logout"
        to="/logout"
        @click.prevent="handleLogout"
        class="cursor-pointer"
      />
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import ItemSidebar from './ItemSitebar.vue';

const router = useRouter();

const handleLogout = async () => {
  try {
    await axios.post(
      'http://localhost:8000/auth/logout',
      {},
      { withCredentials: true }
    );
    router.push('/admin/login');
  } catch (error) {
    console.error("Logout failed:", error);
    alert('Logout failed. Please try again.');
  }
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.router-link-exact-active {
  @apply bg-neutral-800 text-white font-semibold;
}
.router-link-exact-active i {
  @apply text-white;
}
.router-link-exact-active:hover i {
  @apply text-white;
}
nav a {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
[label="Logout"] {
  cursor: pointer;
}
</style>
