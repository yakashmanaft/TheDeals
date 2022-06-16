<template>
  <div>

    <!-- Компонент Navigation -->
    <Navigation :title="pageTitle" :data="userEmail"/>  

    <!-- List Item -->
    <MenuList class="pt-20"/>

  </div>
</template>


<script>
  import MenuList from '../components/MenuList'
  import Navigation from '../components/Navigation.vue'

  import { computed } from 'vue';
  import { supabase } from '../supabase/init';
  import { useRouter } from 'vue-router';
  import store from '../store/index';

  export default {
    components: {
      MenuList, Navigation
    },
    setup () {
      // Get user from store
      const user = computed(() => store.state.user);
      const userEmail = user.value.email

      // Setup ref to router
      const router = useRouter();

      // Берем имя роута для заголовка
      const pageTitle = router.currentRoute._value.meta.translation;

      // Logout function
      const logout = async () => {
        await supabase.auth.signOut();
        router.push({ name: 'Login' });
      }

      return {
        user, router, logout, userEmail, pageTitle
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