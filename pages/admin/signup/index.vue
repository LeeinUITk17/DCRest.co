<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">Signup</h2>
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input
            v-model="phone"
            type="text"
            id="phone"
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          :disabled="loading"
        >
          {{ loading ? 'Signing up...' : 'Signup' }}
        </button>
      </form>
      <p v-if="errorMessage" class="mt-3 text-sm text-red-500">{{ errorMessage }}</p>
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
  loading.value = true;
  errorMessage.value = '';
  try {
    await axios.post(
      'http://localhost:8000/auth/signup',
      {
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
      },
      { withCredentials: true }
    );
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Signup failed';
  } finally {
    loading.value = false;
  }
};
</script>