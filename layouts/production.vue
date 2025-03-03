<template>
    <div>
      <Header />
      <main>
        <slot />
      </main>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Header from '../components/header.vue'
  import Footer from '../components/Footer.vue'
  </script>
  