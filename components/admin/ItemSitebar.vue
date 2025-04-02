<template>
  <div>
    <router-link
      :to="to"
      class="flex items-center justify-center md:justify-start py-3 px-3 mx-2 my-1 text-neutral-600 rounded-md group transition-colors duration-200 ease-in-out hover:bg-neutral-100 hover:text-neutral-900"
      active-class="bg-neutral-300 text-white font-semibold"  
      exact-active-class="bg-neutral-800 text-white font-semibold"
    >
      <div class="w-6 h-6 flex items-center justify-center">
         <i :class="`fas fa-${icon} text-base transition-transform group-hover:scale-110`"></i>
      </div>
      <span class="ml-3 hidden md:inline text-sm font-medium whitespace-nowrap">{{ label }}</span>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  to: { type: String, default: '/' }
});
</script>

<style scoped>
.router-link-exact-active i,
.router-link-active i {
}

.router-link-exact-active:hover,
.router-link-active:hover {
}

.router-link-exact-active:hover i,
.router-link-active:hover i {
}
</style>
