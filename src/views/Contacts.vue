<template>
  <div class="contacts container">
    <Navigation :title="title" class="fixed z-10 bg-white"/>

    <!-- Кнопка добавления нового контакта -->
    <!-- Может имеет смысл сделать компонентом? -->
    <router-link 
      class="fixed bottom-5 right-5 w-14 h-14 bg-blue rounded-full flex items-center justify-center"
      :to="{ name: 'Create' }"
    >
      <img src="../assets/images/common/icon-plus.svg" alt="">
    </router-link>

    <div v-if="dataLoaded" class="pt-20">

      <!-- No Data -->
      <div v-if="data.length === 0">
        <h1 class="text-2xl">Looks empty here...</h1>
      </div>

      <!-- Data -->
      <div v-else>

        <!-- Поиск по контактам -->
        <!-- Пока чисто стили сделаны, функционала нет... -->
        <div class="search-input mx-4 h-10 flex items-center">
          <span class="search-input_icon">
            <img src="../assets/images/common/icon-search.svg" alt="">
          </span>
          <input 
            id="searchContact"
            class="search-input_input outline-none w-full pr-2 focus:text-dark" 
            type="search"
            placeholder="Поиск..."
          >
        </div>

        <div>
          {{data.length}}
        </div>
        <div
          v-for="(contact, index) in data"
          :key="index"
        >
          <!-- Определяем к какому типу принадлежит контакт -->
          <div v-if="contact.contactType" class="flex">
            <div v-if="contact.contactType.customer === true">
              Заказчик
            </div>
            <div v-if="contact.contactType.supplier === true">
              Поставщик
            </div>
            <div v-if="contact.contactType.personal === true">
              Личное
            </div>
          </div>

          <p>{{ contact.contactInfo.name }}</p>
          <p>{{ contact.contactInfo.surname }}</p>
          <p>{{ contact.contactInfo.company }}</p>
          <a :href="`tel:${contact.contactInfo.phoneNumber}`">{{contact.contactInfo.phoneNumber}}</a>

          <!-- Атрибут :to="" пока врменный, он должен быть динамический, для перехода к инфе конкретного контакта-->
          <router-link :to="{ name: 'Create' }">
            Подробнее
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Здесь планирую показывать диаграмы может какие -->
</template>

<script>
  import Navigation from '../components/Navigation.vue';

  import store from '../store/index';
  import { ref, computed } from 'vue';
  import { supabase } from '../supabase/init';
  import { useRouter } from 'vue-router';

  export default {
    components: {
      Navigation
    },
    setup () {
      const user = computed(() => store.state.user);

      const data = ref([]);
      const dataLoaded = ref(null);

      // Берем имя роута для заголовка
      const router = useRouter();
      const title = router.currentRoute._value.meta.translation;
      
      // парсим данные с БД
      const getContacts = async () => {
        try {
          const { data: myContacts, error } = await supabase.from('myContacts').select('*');
          if (error) throw error;
          data.value = myContacts;
          dataLoaded.value = true;
        } catch (error) {
          console.warn(error.message);
        }
      }
      // запускаем функцию получения данных
      getContacts();

      // 

      return {
        user, title, data, dataLoaded
      }
    }
  }
</script>

<style lang="scss" scoped>
  .contacts {
    height: 100vh;
  }

  .search-input {
    border: 1px solid #838383;
    border-radius: 10px;
  }

  .search-input_icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // Пока просто удалил крестик
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration { 
    display: none; 
  }

</style>