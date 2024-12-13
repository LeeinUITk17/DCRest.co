<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-col items-center justify-center flex-grow bg-bisque">
      <main class="flex items-center justify-between w-full max-w-6xl gap-2 p-2 rounded-lg shadow-lg">
        <div class="w-1/2 flex justify-center items-center">
          <img
            src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1731044437/l7xuyrqazfnkj4j0kmkk.png"
            alt="poster"
            class="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div class="bg-white p-10 rounded shadow-md w-1/2">
          <h2 class="text-2xl text-red-600 font-bold mb-6 text-center">Sign In to Your Account</h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="email" class="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div class="mb-6">
              <label for="password" class="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white text-2xl font-bold py-2 rounded hover:bg-red-700"
            >
              Sign In
            </button>
          </form>
          <p class="mt-4 text-center text-gray-600">
            <a href="#" @click="showForgotPasswordPopup" class="text-red-600 hover:underline">Forgot Password?</a>
          </p>
          <ForgotPassword ref="forgotPasswordPopup" />

          <p class="mt-4 text-center text-gray-600">
            Don't have an account?
            <a href="/signUp" class="text-red-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import ForgotPassword from '../../components/forgotPassword.vue';
import { ref } from 'vue';
import Swal from 'sweetalert2';
export default {
  name: 'SignIn',
  components: {
    ForgotPassword,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  setup() {
    const forgotPasswordPopup = ref(null);
    const showForgotPasswordPopup = () => {
      console.log(forgotPasswordPopup.value);
      if (forgotPasswordPopup.value) {
        forgotPasswordPopup.value.showPopup();
      }
    };

    return {
      showForgotPasswordPopup,
      forgotPasswordPopup,
    };
  },
  methods: {
    handleSubmit() {
      if (this.email === '' || this.password === '') {
        alert('All fields are required.');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (this.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
