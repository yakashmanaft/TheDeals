<template v-show="user">
    <nav class="nav w-full py-2 px-4 flex items-center place-content-between fixed z-10">

      <!-- Для экрана Меню -->
      <div class="flex items-center" v-if="router.currentRoute._value.name === 'Menu'">
        <router-link 
          class="user-avatar cursor-pointer rounded-full flex item-center justify-center" 
          :to="{ name: 'Dashboard' }"
        >
          <!-- порешать с позиционированием картинки -->
          <img src="@/assets/images/user-avatar.png" alt="">
        </router-link>

        <div class="ml-2">
          <p>Аккаунт</p>
          <p>{{ data }}</p>
        </div>
      </div>
      <div v-if="router.currentRoute._value.name === 'Menu'" class="gamburger flex items-center justify-center" @click="$router.go(-1)">
        <img src="@/assets/images/common/icon-close.svg" class="w-4/5 h-4/5" alt="">
      </div>

      <!-- Для всех где показывается title -->
      <h1 class="text-dark text-2xl font-bold">{{ title }}</h1>

      <!-- Только для экранов Create -->
      <div v-if="router.currentRoute._value.name === 'CreateContact' || router.currentRoute._value.name === 'CreateDeal'" @click="$router.go(-1)" class="text-blue">Отменить</div>

      <!-- (Гамбурег) -->
      <router-link 
        v-if="router.currentRoute._value.name !== 'Menu'" 
        class="gamburger justify-self-end" 
        :to="{ name: 'Menu' }"
      >
        <img src="@/assets/images/common/icon-burger.svg" class="w-full h-full" alt="">
      </router-link>
    </nav>
</template>

<script>
  import store from '../store/index';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    props: ['title', 'data'],
    setup () {
      const user = computed(() => store.state.user);

      const router = useRouter();


      // Получить ссылку на предыдущий роут

      
      return {
        user, router
      }
    }
    
  }
</script>

<style lang="scss" scoped>
  .gamburger {
    width: 30px;
    height: 30px;
  }

  .nav {
    height: 76px;
    padding: 0.5rem 1rem;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(2px);
  }
</style>