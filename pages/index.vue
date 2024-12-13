<template>
  <div>
    <loading v-if="isLoading" />
    <div v-else  class="min-h-screen flex flex-col bg-white p-8">
    <Banner />
    <div ref="scrollableMenuWrapper" class="sticky top-4 z-20">
      <ScrollableMenu :menuItems="combodata" @scrollToSection="scrollToSection" />
    </div>
    <main class="flex-grow container mx-auto mt-4 mb-2 flex flex-col space-y-6">
      <section
        v-for="combo in combodata"
        :key="combo.id"
        :id="combo.data"
        class="p-8"
      >
        <h3 class="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-emerald-600">
          {{ combo.name }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="item in combo.products"
            :id="item.id"
            :name="item.name"
            :description="item.description"
            :price="item.price"
            :imageSrc="item.imageSrc"
          />
        </div>
      </section>
      <Gallery/>
    </main>
    <testimonial/>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProductCard from '~/components/ProductCard.vue';
import Banner from '../components/banner.vue';
import ScrollableMenu from '../components/scrollableMenu.vue';
import { combodata as comboDataSource } from '../data/combodata';
import testimonial from '~/components/testimonial.vue';
import Gallery from '~/components/Gallery.vue';
import loading from '~/components/loading.vue';

const combodata = ref(comboDataSource);
const isLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000); 
});
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

h3 {
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.section-title {
  color: #0a6e45;
  transition: color 0.3s ease;
}

.section-title:hover {
  color: #3b6f7f;
}

main {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
}

.grid {
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>