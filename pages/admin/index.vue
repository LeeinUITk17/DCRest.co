<template>
  <div class="flex h-screen">
    <div class="w-16 md:w-52 flex-shrink-0 z-50">
      <Sidebar />
    </div>
    <div class="flex-1 overflow-auto p-4 md:p-8 transition-all duration-300 ">
        <TableComponent :columns="columns" :data="data" />
    </div>
  </div>
</template>
<script setup>
import Sidebar from '~/components/admin/Sidebar.vue';
import TableComponent from '~/components/admin/subComponent/TableComponent.vue';

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address.city", label: "City" },
  { key: "address.country", label: "Country" },
];

const data = [
  { id: 1, name: "Tài", email: "tai@example.com", address: { city: "HCM", country: "Vietnam" } },
  { id: 2, name: "Hùng", email: "hung@example.com", address: { city: "Hanoi", country: "Vietnam" } },
  { id: 3, name: "Minh", email: "minh@example.com", address: { city: "Da Nang", country: "Vietnam" } },
];
</script>

<style scoped>
@media (max-width: 768px) {
  .flex-1 {
    margin-left: 0;
    padding: 1rem;
  }
}
</style>