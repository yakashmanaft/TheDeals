<template v-show="user">
    <nav class="nav w-full py-2 px-4 flex fixed z-10">

      <!-- Для экрана type Menu-->
      <div class="flex items-center place-content-between w-full" v-if="router.currentRoute._value.meta.type === 'Menu'">
        <div class="flex items-center">
          <!-- Аватар, он же ссылка на сам аккаунт? -->
          <router-link 
            class="user-avatar cursor-pointer rounded-full flex item-center justify-center" 
            :to="{ name: 'Dashboard' }"
          >
            <img src="@/assets/images/user-avatar.png" alt="">
          </router-link>

          <!-- Инфа по аккаунту -->
          <div class="ml-2">
            <p>Аккаунт</p>
            <p>{{ data }}</p>
          </div>
        </div>

        <!-- Кнопка закрыть меню -->
        <div class="gamburger flex items-center justify-center" @click="$router.go(-1)">
          <img src="@/assets/images/common/icon-close.svg" class="w-4/5 h-4/5" alt="">
        </div>
      </div>

      <!-- Для экранов type CurrentView -->
      <div class="flex items-center place-content-between w-full" v-if="router.currentRoute._value.meta.type === 'CurrentView'">
        <div class="flex items-center">
          <div class="text-blue" v-if="edit" @click="cancelEdit">
            Отмена
          </div>
          <div v-else @click="$router.go(-1)" class="arrow-back flex items-center">
            <div class="flex items-center place-content-between h-10">
              <img src="@/assets/images/common/arrow-right.svg" class="arrow-back_icon" alt="">
            </div>
            <p class="text-dark text-2xl font-bold ml-2 arrow-back_text">Назад</p>
          </div>
        </div>
        <!-- а как же if dataLoaded?? -->
        <div v-if="edit" class="justify-self-end text-blue font-bold" @click="update">
          Готово
        </div>
        <div v-else class="justify-self-end text-blue" @click="editMode">
          <p>Править</p>
        </div>
      </div>

      <!-- Только для экранов Create -->
      <div  
        class="flex items-center place-content-between w-full"
        v-if="router.currentRoute._value.meta.type === 'Create'" >
        <!-- Заголовок -->
        <h1 class="text-dark text-2xl font-bold">{{ title }}</h1>
        <!-- Кнопка отмены создания -->
        <div 
          @click="$router.go(-1)" 
          class="text-blue"
        >
          Отменить
        </div>
      </div>

      <!-- Для экрано с типом View (заголовок и гамбургер) -->
      <div 
        class="flex items-center place-content-between w-full"
        v-if="router.currentRoute._value.meta.type === 'View'"
      >
        <!-- Заголовок -->
        <h1 class="text-dark text-2xl font-bold">{{ title }}</h1>
        <!-- Кнопка -->
        <router-link 
          v-if="router.currentRoute._value.name !== 'Menu' || router.currentRoute._value.name !== 'Create Contact'" 
          class="gamburger justify-self-end" 
          :to="{ name: 'Menu' }"
        >
          <img src="@/assets/images/common/icon-burger.svg" class="w-full h-full" alt="">
        </router-link>
      </div>
    </nav>
</template>

<script>
  import store from '../store/index';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    props: ['title', 'data', 'edit', 'editMode', 'update', 'cancelEdit'],
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


  .arrow-back_icon {
    transform: rotate(180deg);
    width: 60%;
    height: 60%;
  }

  img {
    width: 100%;
    height: 100%;
  }
</style>