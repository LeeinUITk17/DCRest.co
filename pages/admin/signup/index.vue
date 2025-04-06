<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-800">
          Create your Account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Enter your details below to register.
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleSignup">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            v-model="name"
            type="text"
            id="name"
            name="name"
            placeholder="Peter Griffin"
            class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            required
            autocomplete="name"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            v-model="email"
            type="email"
            id="email"
            name="email"
            placeholder="drunkenGuy@gmail.com"
            class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            required
            autocomplete="email"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            placeholder="•••••••• (min. 8 characters)"
            class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            required
            autocomplete="new-password" 
            minlength="8" 
          />
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span class="text-gray-500">(Optional)</span>
          </label>
          <input
            v-model="phone"
            type="tel" 
            id="phone"
            name="phone"
            placeholder="(123) 456-7890"
            class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            autocomplete="tel"
          />
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">
        {{ errorMessage }}
      </p>

      <p class="mt-8 text-sm text-center text-gray-600">
        Already have an account?
        <router-link to="/admin/login" class="font-medium text-blue-600 hover:text-blue-500 hover:underline">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();

const handleSignup = async () => {
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  const payload = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  if (phone.value) {
    payload.phone = phone.value;
  }

  try {
    const response = await axios.post(
      'http://localhost:8000/auth/signup',
      payload,
      { withCredentials: true }
    );

    router.push('/admin');
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data?.message || `Signup failed (Status: ${error.response.status})`;
      if (error.response.status === 409) {
        errorMessage.value = 'An account with this email address already exists.';
      }
    } else if (error.request) {
      errorMessage.value = 'Signup failed: No response from server. Please check your connection.';
    } else {
      errorMessage.value = `Signup failed: ${error.message}`;
    }
    console.error("Signup error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
</style>
