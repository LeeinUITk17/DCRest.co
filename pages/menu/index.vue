<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow p-8">
      <h2 class="text-2xl font-bold mb-4">Our Menu</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 shadow rounded" v-for="item in menuItems" :key="item.id">
          <h3 class="text-xl font-bold">{{ item.name }}</h3>
          <p class="mt-2">{{ item.description }}</p>
          <p class="mt-2 font-bold">{{ item.price }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'MenuPage',
  data() {
    return {
      menuItems: [
        { id: 1, name: 'Chicken Bucket', description: 'A bucket of our famous fried chicken.', price: '$20' },
        { id: 2, name: 'Chicken Sandwich', description: 'A delicious chicken sandwich.', price: '$5' },
        { id: 3, name: 'Fries', description: 'Crispy golden fries.', price: '$3' },
      ],
    };
  },
};
</script>
