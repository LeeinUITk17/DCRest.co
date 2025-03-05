<template>
  <aside class="w-16 md:w-52 h-full fixed left-0 top-0 overflow-y-auto transition-all duration-300 border-r-[1.5px] border-black">
    <div class="p-4 flex items-center justify-center md:justify-start">
      <span class="text-xl font-bold text-gray-700 hidden md:inline ">🍔 DCRest.SMS</span>
      <span class="text-xl font-bold text-gray-700 md:hidden">🍔</span>
    </div>
    <nav class="mt-4 transition-all duration-300">
      <ItemSidebar icon="home" label="Dashboard" to="/admin/dashboard" />
      <ItemSidebar icon="shopping-cart" label="Orders" to="/admin/orders" />
      <ItemSidebar icon="users" label="Customers" to="/admin/customers" />
      <ItemSidebar icon="utensils" label="Menu" to="/admin/menu" />
      <ItemSidebar icon="ticket-alt" label="Coupons" to="/admin/coupons" />
      <ItemSidebar icon="user-tie" label="Employees" to="/admin/employees" />
      <ItemSidebar icon="chart-line" label="Sales" to="/admin/sales" />
      <ItemSidebar icon="boxes" label="Inventory" to="/admin/inventory" />
      <ItemSidebar icon="calendar" label="Calendar" to="/admin/calendar" />
      <ItemSidebar icon="cog" label="Settings" to="/admin/settings" />
    </nav>
  </aside>
</template>

<script setup>
 import ItemSidebar from './ItemSitebar.vue';
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

.router-link-active {
  @apply bg-blue-50 text-blue-600;
}
</style>