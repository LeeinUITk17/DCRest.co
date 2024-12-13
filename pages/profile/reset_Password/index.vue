<template>
    <div>
      <div class="container mx-auto py-10 flex flex-col md:flex-row mt-16 mb-16">
        <ProfileSideBar class="md:w-1/4 w-full mb-10 md:mb-0" />
        <ProfileResetPw class="md:w-3/4 w-full" />
      </div>
    </div>
  </template>
  
  <script>
  import ProfileSideBar from '~/components/ProfileSideBar.vue';
  import ProfileResetPw from '~/components/ProfileResetPw.vue';
  
  export default {
    components: {
      ProfileSideBar,
      ProfileResetPw,
    }
  }
  </script>
  
  <style scoped>
  .container {
    padding: 0 2rem;
  }
  </style>
  