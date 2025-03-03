<template>
  <div class="min-h-screen flex flex-col bg-red-50">
    <main class="flex-grow p-8">
      <h2 class="text-3xl font-bold text-red-600 mb-6">🍔 Our Menu</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-white p-6 shadow-lg rounded-lg border-4 border-yellow-400"
          v-for="item in menuItems"
          :key="item.id"
        >
          <h3 class="text-xl font-bold text-orange-600">{{ item.name }}</h3>
          <p class="mt-2 text-gray-700">{{ item.description }}</p>
          <p class="mt-3 font-bold text-red-500">{{ item.price }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "production",
});

const menuItems = [
  { id: 1, name: "🍗 Chicken Bucket", description: "A bucket of our famous fried chicken.", price: "$20" },
  { id: 2, name: "🥪 Chicken Sandwich", description: "A delicious chicken sandwich.", price: "$5" },
  { id: 3, name: "🍟 Fries", description: "Crispy golden fries.", price: "$3" },
];
</script>
