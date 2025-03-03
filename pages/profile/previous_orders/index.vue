<template>
  <div class="container mx-auto py-10 flex flex-col md:flex-row mt-16 mb-16 px-8">
    <ProfileSideBar class="md:w-1/4 w-full mb-10 md:mb-0" />
    <ProfilePreviousOrder class="md:w-3/4 w-full" />
  </div>
</template>

<script setup>
import ProfileSideBar from '~/components/ProfileSideBar.vue';
import ProfilePreviousOrder from '~/components/ProfilePreviousOrder.vue';

definePageMeta({
  layout: "production",
});
</script>
