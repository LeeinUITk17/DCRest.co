<template>
  <div class="flex h-screen w-full">
    <div class="w-1/6">
      <Sidebar />
    </div>
      <TableComponent :columns="columns" :data="data" />
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
