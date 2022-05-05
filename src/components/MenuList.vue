<template>
  <div class="container menu-list">
    <ul class="menu-list bg-white p-4 pt-2 pb-0 flex flex-col justify-between">

      <!-- Team -->
      <li class="border-light-grey border p-2.5 rounded-xl">
        <router-link class="menu-item justify-between" :to="{ name: '' }">
          <div class="flex items-center">
            <div class="menu-item_icon">
              <img src="@/assets/images/menu/account-crew.svg" alt="">
            </div>
            <div class="menu-item_text">
              <p class="text-dark">Команда</p>
              <p class="">Mir Zefir</p>
            </div>
          </div>
          <div class="menu-item_action">
            <img src="@/assets/images/common/arrow-right.svg" alt="">
          </div>
        </router-link>
      </li>

      <!-- Orders, Wallet & Contacts -->
      <li class="border-light-grey border p-2.5 rounded-xl mt-4">

        <!-- Orders (all my business) -->
        <router-link class="menu-item py-1" :to="{ name: 'Deals' }">
          <div class="menu-item_icon">
            <img src="@/assets/images/menu/account-orders.svg" alt="">
          </div>
          <p class="menu-item_text">Все мои дела</p>
        </router-link>

        <!-- Wallet -->
        <router-link class="menu-item py-1 mt-2" :to="{ name: 'Wallet' }">
          <div class="menu-item_icon">
            <img src="@/assets/images/menu/account-wallet.svg" alt="">
          </div>
          <p class="menu-item_text">Кошелек</p>
        </router-link>

        <!-- Contacts -->
        <router-link class="menu-item py-1 mt-2" :to="{ name: 'Contacts' }">
          <div class="menu-item_icon">
            <img src="@/assets/images/menu/account-contacts.svg" alt="">
          </div>
          <p class="menu-item_text">Мои контакты</p>
        </router-link>
      </li>

      <!-- Calendar -->
      <li class="p-2.5 rounded-xl mt-2">
        <router-link class="menu-item" :to="{ name: 'Calendar' }">
          <div class="menu-item_icon">
            <img src="@/assets/images/menu/account-calendar.svg" alt="">
          </div>
          <p class="menu-item_text">Календарь событий</p>
        </router-link>
      </li>

      <!-- Warehouse -->
      <li class="p-2.5 rounded-xl mb-2">
        <router-link class="menu-item" :to="{ name: 'Warehouse' }">
          <div class="menu-item_icon">
            <img src="@/assets/images/menu/account-warehouse.svg" alt="">
          </div>
          <p class="menu-item_text">Склад</p>
        </router-link>
      </li>

      <!-- Settings -->
      <li class="bg-light-grey p-2.5 rounded-xl">
        <!-- Account Settings -->
        <router-link class="menu-item py-1" :to="{ name: '' }">
          <div class="menu-item_icon">
            <img src="@/assets/images/menu/account-settings.svg" alt="">
          </div>
          <p class="menu-item_text">Настройки аккаунта</p>
        </router-link>

        <!-- FAQ -->
        <router-link class="menu-item py-1 mt-2" :to="{ name: '' }">
          <div class="menu-item_icon">
            <img src="@/assets/images/common/questions.svg" alt="">
          </div>
          <p class="menu-item_text">Справка по сервису</p>
        </router-link>
      </li>

      <!-- Change Account -->
      <li class="bg-light-grey p-2.5 rounded-xl mt-4">
        <router-link class="menu-item justify-between" :to="{ name: '' }">
          <div class="flex items-center">
            <div class="menu-item_icon">
              <img src="@/assets/images/menu/account-account.svg" alt="">
            </div>
            <p class="menu-item_text">Сменить аккаунт</p>
          </div>
          <div class="menu-item_action">
            <img src="@/assets/images/common/arrow-right.svg" alt="">
          </div>
        </router-link>
      </li>

      <!-- Logout -->
      <li class="w-full mt-2">
        <div>
          <p class="my-4 text-danger text-center cursor-pointer" @click="logout()">Выйти из аккаунта</p>
        </div>
      </li>

    </ul>
  </div>
</template>

<script>
import store from '../store/index';
import { computed } from 'vue';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';


  export default {

    setup () {

      // Get user from store
      const user = computed(() => store.state.user);

      // Setup ref to router
      const router = useRouter();

      // Logout function
      const logout = async () => {
        await supabase.auth.signOut();
        router.push({ name: 'Login' });
      }

      return {
        user, router, logout
      }
    }
  }
</script>

<style scoped>
/* Пока не понятно, надо ли данный стиль использовать... */
  /* .menu-list {
    height: 90vh;
  } */

  .menu-item {
    display: flex;
    align-items: center;
  }

  .menu-item_icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-item_text {
    margin-left: 5px;
    color: #838383;
  }

  .menu-item_action {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;  
  }
</style>