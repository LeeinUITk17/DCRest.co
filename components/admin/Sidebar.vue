<template>
    <aside class="w-64 bg-white h-screen shadow-md fixed left-0 top-0 overflow-y-auto">
      <div class="p-4 flex items-center space-x-2">
        <span class="text-xl font-bold text-gray-700">🍔 DCRest.SMS</span>
      </div>
  
      <nav class="mt-4">
        <ItemSidebar icon="home" label="Dashboard" to="/admin/dashboard" />
        <ItemSidebar icon="shopping-cart" label="Order Management" to="/admin/orders" />
        <ItemSidebar icon="users" label="Customer Management" to="/admin/customers" />
        <ItemSidebar icon="utensils" label="Menu Management" to="/admin/menu" />
        <ItemSidebar icon="ticket-alt" label="Coupon Management" to="/admin/coupons" />
        <ItemSidebar icon="user-tie" label="Employee Management" to="/admin/employees" />
        <ItemSidebar icon="chart-line" label="Sales Report" to="/admin/sales" />
        <ItemSidebar icon="boxes" label="Inventory Management" to="/admin/inventory" />
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
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #bbb;
    border-radius: 10px;
  }
  </style>
  