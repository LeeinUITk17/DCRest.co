<template>
  <li>
    <NuxtLink
      v-if="title !== 'Delete Account'"
      :to="link"
      class="hover:text-red-500 transition-colors"
      :class="{ 'text-red-500 p-4 bg-white rounded-2xl': isActive }"
      @mouseover="handleHover"
      @mouseleave="handleLeave"
    >
      {{ title }}
    </NuxtLink>
    <button
      v-else
      @click="confirmDeleteAccount"
      class="hover:text-red-500 transition-colors w-full text-left"
      :class="{ 'text-red-500': isActive }"
      @mouseover="handleHover"
      @mouseleave="handleLeave"
    >
      {{ title }}
    </button>
  </li>
</template>

<script>
import Swal from 'sweetalert2';

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
    confirmDeleteAccount() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete your account?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push('/signIn');
          Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
        }
      });
    }
  }
};
</script>
