<template>
    <nav class="nav container py-2 px-4 flex gap-4 items-center sm:flex-row place-content-between">
      <h1 class="text-dark text-2xl font-bold">{{ title }}</h1>
      <router-link v-show="user" class="gamburger justify-self-end" :to="{ name: 'Menu' }">
        <img src="@/assets/images/common/icon-burger.svg" class="w-full h-full" alt="">
      </router-link>
    </nav>
</template>

<script>
  import store from '../store/index';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    props: ['title'],
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
    // background-color: #ccc;
  }
</style>