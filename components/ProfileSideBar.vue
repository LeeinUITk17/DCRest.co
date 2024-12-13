<template>
    <div class="sidebar bg-gray-900 text-white p-6 w-1/4 min-h-screen rounded-lg">
      <div class="text-center mb-8">
        <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1727938015/bmvfqez2etar0obzrqgt.jpg" alt="Profile Picture" class="w-2/6 h-2/6 mx-auto rounded-full border-4 border-gray-700 shadow-lg" />
        <h2 class="text-2xl font-bold mt-4">Hello TLee</h2>
        <NuxtLink to="/SignIn" class="text-sm text-gray-400 underline hover:text-red-400 transition-colors duration-200">Logout</NuxtLink>
      </div>
      <ul class="space-y-6 text-lg font-bold">
        <SidebarItem title="Account Details" link="/profile/detail" :activeLink="currentPath" />
        <SidebarItem title="Previous Orders" link="/profile/previous_orders" :activeLink="currentPath" />
        <SidebarItem title="Booking Details" link="/profile/booking" :activeLink="currentPath" />
        <SidebarItem title="Your Address" link="/profile/address" :activeLink="currentPath" />
        <SidebarItem title="Reset Password" link="/profile/reset_password" :activeLink="currentPath" />
        <SidebarItem title="Delete Account" link="/profile/delete_account" :activeLink="currentPath" />
      </ul>
    </div>
  </template>
  
  <script>
  import SidebarItem from './ProfileSideBarItem.vue';
  
  export default {
    components: {
      SidebarItem
    },
    computed: {
      currentPath() {
        return this.$route.path;
      }
    }
  }
  </script>
  