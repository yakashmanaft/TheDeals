<template class="relative">

  <div class="container entrance-image bg-center flex justify-center items-end px-4">

    <!-- Изменить стили эррор месседжа!!! -->

    <!-- Error Handling -->
    <div v-if="errorMsg" class="z-10 w-full absolute top-2 left-0 p-4 rounded-md shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Content -->
    <div class="content w-full flex flex-col place-content-between">
      <!-- Заголовок -->
      <div class="header px-2">
        <div>
          <h1 class="font-bold text-7xl text-blue">Deals<span class="text-green">.</span></h1>
          <h2 class="text-dark-gray ml-1 mt-1 leading-snug">Карманный навигатор дел</h2>
        </div>
      </div>

      <!-- Registration -->
      <form @submit.prevent="register" class="form flex flex-col px-2 mb-6 z-10">

        <!-- Email Input -->
        <div class="flex flex-col mb-2 mt-10">
          <!-- <label for="email" class="mb-1 text-sm text-at-light-green">Email</label> -->
          <input 
            type="text" 
            required 
            class="p-2 text-md bg-sand border rounded-md focus:text-dark focus:bg-light-blue focus:outline-none"
            id="email"
            v-model="email"
            placeholder="Введите имейл"
          />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col my-4">
          <!-- <label for="password" class="mb-1 text-sm text-at-light-green">Password</label> -->
          <input 
            type="password" 
            required 
            class="p-2 text-md bg-sand border rounded-md focus:text-dark focus:bg-light-blue focus:outline-none"  
            id="password"
            v-model="password"
            placeholder="Придумайте пароль"
          />

        <!-- Confirm Password Input -->
          <!-- <label for="confirmPassword" class="mb-1 text-sm text-at-light-green">Confirm Password</label> -->
          <input 
            type="password" 
            required 
            class="mt-6 p-2 text-md bg-sand border rounded-md focus:text-dark focus:bg-light-blue focus:outline-none"  
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Повторите пароль"
          />
        </div>

        <button 
          type="submit" 
          class="mt-6 py-2 rounded-md self-center w-full text-sm text-white bg-green duration-200 border-solid border-2 border-transparent hover:border-green hover:bg-transparent hover:text-green shadow-md hover:shadow-none"
        >
          Зарегистрироваться
        </button>

        <router-link class="text-sm mt-6 text-center" :to="{ name: 'Login' }">
          <span class="text-blue">Уже есть аккаунт?</span>
        </router-link>
      </form>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';


export default {
  name: "register",
  setup() {
    // Create data / vars
    const router = useRouter();
    const email = ref(null);
    const password = ref(null);
    const confirmPassword = ref(null);
    const errorMsg = ref(null);

    // Register function
    const register = async () => {
      if (password.value === confirmPassword.value) {
        try {
          const { error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
          });
          if (error) throw error;
          router.push({ name: 'Login' })
        } catch (error) {
          errorMsg.value = error.message;
          setTimeout(() => {
            errorMsg.value = null;
          }, 5000)
        }
        return;
      }
      errorMsg.value = 'Error: Passwords do not match'
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000)
    };

    return {
      email, password, confirmPassword, errorMsg, register
    };
  },
};
</script>

<style scoped>
  .entrance-image {
    background-color: #f1f1f1
  }
  
  .content {
    height: 100vh;
  }

  .header {
    height: 50%;
    display: flex;
    align-items: flex-end;
  }

  input::-moz-placeholder { 
    color: #3d3d3d; 
  }

  input::-webkit-input-placeholder { 
    color: #3d3d3d; 
  }

  button {
    font-weight: 400;
  }
</style>
