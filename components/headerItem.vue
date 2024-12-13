<template>
   
      <NuxtLink
        :to="link"
        class="hover:text-gray-700 font-medium transition-colors p-2 rounded-lg"
        :class="{ 'text-gray-100 font-bold bg-red-400 ': isActive }"
        @mouseover="handleHover"
        @mouseleave="handleLeave"
      >
        {{ title }}
      </NuxtLink>
     
    
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      activeLink: {
        type: String,
        required: false,
      }
    },
    data() {
      return {
        isHovered: false,
      };
    },
    computed: {
      isActive() {
        return this.link === this.activeLink;
      }
    },
    methods: {
      handleHover() {
        this.isHovered = true;
      },
      handleLeave() {
        this.isHovered = false;
      },
    }
  };
  </script>
  