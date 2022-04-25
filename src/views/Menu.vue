<template>
  <div  class="container text-dark">
    <nav class="fixed z-10 nav container py-2 px-4 flex gap-4 bg-white items-center sm:flex-row place-content-between">
      <router-link 
        class="user-avatar cursor-pointer rounded-full" 
        :to="{ name: 'Dashboard' }"
      >
        <!-- порешать с позиционированием картинки -->
        <img src="../assets/images/user-avatar.png" alt="">
      </router-link>
      <div class="flex-1">
        <p>Аккаунт</p>
        <p>{{ userEmail }}</p>
      </div>
      <!-- Типа кнопки Назад... -->
      <div class="gamburger" @click="$router.go(-1)">
        <img src="../assets/images/common/icon-close.svg" class="w-4/5 h-4/5 pl-1 pt-1" alt="">
      </div>
      
    </nav>
    
    <!-- <h1>Menu</h1> -->
    <!-- List Item -->
    <MenuList class="pt-20"/>
  </div>
</template>


<script>
  import MenuList from '../components/MenuList'

  import { computed } from 'vue';
  import { supabase } from '../supabase/init';
  import { useRouter } from 'vue-router';
  import store from '../store/index';

  export default {
    components: {
      MenuList
    },
    setup () {
      // Get user from store
      const user = computed(() => store.state.user);
      const userEmail = user.value.email

      // Setup ref to router
      const router = useRouter();

      // Logout function
      const logout = async () => {
        await supabase.auth.signOut();
        router.push({ name: 'Login' });
      }

      return {
        user, router, logout, userEmail
      }
    }
  }
</script>

<style lang="scss" scoped>
  .gamburger {
    width: 30px;
    height: 30px;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
  }
</style>