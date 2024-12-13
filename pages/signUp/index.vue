<template>
  <div class="min-h-screen flex flex-col">
  <div class="flex flex-col items-center justify-center flex-grow bg-bisque ">
    <main class="flex items-center justify-between w-full max-w-6xl gap-4 p-6 rounded-lg shadow-lg">
      <div class="w-1/2 flex justify-center items-center">
          <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047305/c9mf9cecui1s1vbzaajy.png" alt="poster" class="w-full h-96 object-cover rounded-lg">
        </div>
      <div class="bg-white p-10 rounded shadow-md w-1/2">
        <h2 class="text-2xl text-red-600 font-bold mb-6 text-center">Create Your Account</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="name" class="block text-gray-700">Name</label>
            <input type="text" id="name" v-model="name" class="w-full p-2 border border-gray-300 rounded mt-1" required>
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input type="email" id="email" v-model="email" class="w-full p-2 border border-gray-300 rounded mt-1" required>
          </div>
          <div class="mb-6">
            <label for="password" class="block text-gray-700">Password</label>
            <input type="password" id="password" v-model="password" class="w-full p-2 border border-gray-300 rounded mt-1" required>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-2xl font-bold text-white py-2 rounded hover:bg-red-700">Sign Up</button>
        </form>
        <p class="mt-4 text-center text-gray-600">Already have an account? <a href="/signIn" class="text-red-600 hover:underline">Sign In</a></p>
      </div>
    </main>
  </div>
  </div>
</template>

<script>
import Footer from '~/components/Footer.vue';
import Header from '~/components/header.vue';
export default {
  name: 'SignUp',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    handleSubmit() { 
        if (this.name === '' || this.email === '' || this.password === '') {
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

