<template class="relative">

  <div class="container entrance-image bg-center flex justify-center items-end px-4">

    <!-- Изменить стили эррор месседжа!!! -->

    <!-- Error Handling -->
    <div v-if="errorMsg" class="z-10 w-full absolute top-2 left-0 p-4 rounded-md shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Login -->
    <form @submit.prevent='login()' class="form flex flex-col rounded-md w-full mb-6 z-10">
      
      <!-- Заголовок -->
      <div class="my-4">
        <!-- <p class="text-center text-dark-gray text-12">Для входа в сервис</p> -->
        <h1 class="font-bold text-center text-3xl text-light-grey">Моё настоящее</h1>
      </div>

      <!-- Email Input -->
      <div class="flex flex-col mb-2 mt-10">
        <!-- <label for="email" class="mb-1 text-sm text-dark-gray">Email</label> -->
        <input 
          type="text" 
          required 
          class="p-2 text-md bg-transparent border text-white rounded-md focus:text-dark focus:bg-white focus:outline-none" 
          id="email"
          v-model="email"
          placeholder="Введите имейл"
        />
      </div>

      <!-- Password Input -->
      <div class="flex flex-col my-4">
        <!-- <label for="password" class="mb-1 text-sm text-dark-gray">Password</label> -->
        <input 
          type="password" 
          required 
          class="p-2 text-md text-white bg-transparent border rounded-md focus:text-dark focus:bg-white focus:outline-none" 
          id="password"
          v-model="password"
          placeholder="Укажите пароль"
        />
      </div>

      <button 
        type="submit" 
        class="mt-6 py-2 px-6 rounded-md self-center w-full text-md text-white bg-green duration-200 border-solid border-2 border-transparent hover:border-green hover:bg-transparent hover:text-green"
      >
        ОК
      </button>

      <router-link class="text-sm mt-6 text-center" :to="{ name: 'Register' }">
        <span class="text-white">Еще нет аккаунта?</span>
      </router-link>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';


export default {
  name: "login",
  setup() {
    // Create data / vars
    const router = useRouter();
    const email = ref(null);
    const password = ref(null);
    const errorMsg = ref(null);

    // Login function
    const login = async () => {
      try {
        const { error } = await supabase.auth.signIn({
          email: email.value,
          password: password.value
        });
        if (error) throw error;
        router.push({ name: 'Dashboard' });
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = null;
        }, 5000)
      }
    }

    return {
      email, password, errorMsg, login
    };
  },
};
</script>

<style scoped>
  .form {
    
  }

  .entrance-image {
    /* оптимизировать в webp формат у изображения */
    background: url('../assets/images/entrance-image.png') 0px 0px no-repeat;
    height: 100vh;
    background-size: cover;
  }

  .entrance-image:before {
    content: '';
    display: block;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgba(61, 61, 61, .4);
}

  input::-moz-placeholder { 
    color: white; 
  }

  input::-webkit-input-placeholder { 
    color: white; 
  }

  button {
    font-weight: 400;
  }
</style>
