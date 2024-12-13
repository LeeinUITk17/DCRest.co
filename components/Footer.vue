<template>
  <footer class="bg-gray-900 text-white py-16">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <h2 class="text-4xl font-extrabold tracking-wider text-white transition-transform transform hover:scale-105">
            DC
          </h2>
          <p class="text-white opacity-80 text-sm md:text-base">Drunken Clam - Where memories are made. Enjoy every moment with us!</p>
          <div class="flex space-x-4">
            <a href="https://facebook.com" target="_blank" class="hover:text-gray-200 transition-transform transform hover:scale-110">
              <i class="fab fa-facebook fa-2x"></i>
            </a>
            <a href="https://twitter.com" target="_blank" class="hover:text-gray-200 transition-transform transform hover:scale-110">
              <i class="fab fa-twitter fa-2x"></i>
            </a>
            <a href="https://instagram.com" target="_blank" class="hover:text-gray-200 transition-transform transform hover:scale-110">
              <i class="fab fa-instagram fa-2x"></i>
            </a>
            <a href="https://youtube.com" target="_blank" class="hover:text-gray-200 transition-transform transform hover:scale-110">
              <i class="fab fa-youtube fa-2x"></i>
            </a>
          </div>
        </div>

        <div>
          <h3 class="lg:text-xl font-semibold mb-4 text-sm md:text-base">Quick Links</h3>
          <ul class="space-y-3">
            <li><a href="/" class="hover:underline hover:text-gray-200">Home</a></li>
            <li><a href="/menu" class="hover:underline hover:text-gray-200">Menu</a></li>
            <li><a href="/about" class="hover:underline hover:text-gray-200">About Us</a></li>
            <li><a href="/contact" class="hover:underline hover:text-gray-200">Contact</a></li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div>
          <h3 class="lg:text-xl font-semibold mb-4 text-sm md:text-base">Contact Us</h3>
          <ul class="space-y-3">
            <li class="hover:text-gray-200"><strong>Email:</strong> contact@drunkenclam.com</li>
            <li class="hover:text-gray-200"><strong>Phone:</strong> +1 (555) 123-4567</li>
            <li class="hover:text-gray-200"><strong>Address:</strong> 123 Clam St, Ocean City</li>
          </ul>
        </div>

        <div>
          <h3 class="lg:text-xl font-semibold mb-4 text-sm md:text-base">Stay Updated</h3>
          <p class="text-white opacity-80 mb-4 text-sm md:text-base">Sign up for our newsletter to receive the latest updates and special offers!</p>
          <form class="flex">
            <input type="email" placeholder="Enter your email" class="px-4 py-2 text-black rounded-l-lg flex-1" />
            <button class="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white px-6 py-2 rounded-r-lg hover:bg-red-600 transition-colors duration-300">Subscribe</button>
          </form>
        </div>
      </div>
      <div class="mt-10 text-center text-white text-sm opacity-70">
        <p>&copy; 2024 Drunken Clam. Cheers to good times! Powered by TLee</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
footer {
  font-family: 'Roboto', sans-serif;
}

ul li a {
  transition: color 0.3s ease;
}

ul li a:hover {
  color: #f1f1f1;
}

h2, h3 {
  font-family: 'Roboto', sans-serif;
}

input[type="email"] {
  font-size: 1rem;
}

button {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .text-center {
    text-align: center;
  }
  .grid {
    grid-template-columns: 1fr; 
  }
  .space-x-4 {
    margin-bottom: 1rem;
  }
  .space-y-3 {
    margin-bottom: 1rem; 
  }
  h2 {
    font-size: 2.5rem;
  }
  .text-sm {
    font-size: 0.875rem; 
  }
  .text-base {
    font-size: 1rem;
  }
  form {
    flex-direction: column;
  }
  input[type="email"] {
    margin-bottom: 0.5rem; 
  }
  button {
    width: 100%; 
  }
}
</style>
