<template>
  <div class="contacts container">
    <Navigation :title="title" class="fixed z-10 bg-white"/>

    <!-- Кнопка добавления нового контакта -->
    <!-- Может имеет смысл сделать компонентом? -->
    <router-link 
      v-if="data.length !== 0"
      class="fixed bottom-5 right-5 w-14 h-14 bg-blue rounded-full flex items-center justify-center"
      :to="{ name: 'CreateContact' }"
    >
      <img src="@/assets/images/common/icon-plus.svg" alt="">
    </router-link>

    <div v-if="dataLoaded" class="pt-20">

      <!-- No Data -->
      <!-- Стилизовать нормально? -->
      <div v-if="data.length === 0">
        <div class="text-center px-4 mt-4">
          <!-- Предполагаемая картинка -->
          <div class="icon-wrapper">
            <!-- Картинка предполагает ссылку на авторство, заменить на свою -->
            <img src="@/assets/images/stickers/contact-sticker.png" alt="">
          </div>
          <h1 class="text-blue text-xl mt-4">У вас еще нет контактов...</h1>
          <p class="text-dark-gray mt-2">Самое время начать заполнение справочника заказчиками, коллегами. <br>И не забывайте про близких!</p>
          <router-link 
            :to="{ name: 'CreateContact' }"
            type="button"
            class="bg-green text-white webkit block rounded-md m-4 mt-8 p-2"
          >
            Добавить
          </router-link>
        </div>
        <!-- Добавить ссылку на экран создания нового контакта -->
      </div>

      <!-- Data -->
      <div v-else>

        <!-- Поиск по контактам -->
        <!-- Может отдельным компонентом сделать -->
        <div class="search-input px-2 mx-4 h-10 flex items-center">
          <span class="search-input_icon">
            <img src="@/assets/images/common/icon-search.svg" alt="">
          </span>
          <input 
            id="searchedContacts"
            class="search-input_input outline-none w-full focus:text-dark" 
            type="search"
            placeholder="Поиск..."
            v-model="search"
          >
        </div>

        <!-- Contact Template -->
        <ul class="px-4 pt-4">
          <router-link
            v-for="contact in searchedContacts"
            :key="contact.id"
            :to="{ name: 'View-Contact', params: { contactId: contact.id } }"
            class="contact-item flex justify-between border-b-2 items-center px-4 py-2 mt-2"
          >
            <div>
              <p class="text-blue text-xl">{{ contact.contactInfo.surname }}</p>
              <p class="text-dark-gray">{{ contact.contactInfo.name }}</p>
            </div>
            <div>
              <p class="text-dark-gray">{{ contact.contactInfo.company }}</p>
            </div>
          </router-link>
              <!-- Если из справочника ничего не найдено -->
              <div v-if="searchedContacts.length <= 0">
                <div class="px-4 text-sm text-dark-gray">Ничего не найдено.</div>
              </div>
        </ul>

      </div>
    </div>
  </div>

  <!-- Здесь планирую показывать диаграмы может какие -->
</template>

<script>
  import Navigation from '../components/Navigation.vue';

  import store from '../store/index';
  import { ref, computed, onMounted } from 'vue';
  import { supabase } from '../supabase/init';
  import { useRouter } from 'vue-router';

  import { sortedArray } from '../helpers/searchSort';
  import { filteredArray } from '../helpers/searchFilter';

  export default {
    components: {
      Navigation
    },
    setup () {
      const user = computed(() => store.state.user);

      const data = ref([]);
      const dataLoaded = ref(null);

      const search = ref('');

      const errorMsg = ref(null);

      // Берем имя роута для заголовка
      const router = useRouter();
      const title = router.currentRoute._value.meta.translation;

      onMounted(async () => {
        try {
          const { data: myContacts, error } = await supabase.from('myContacts').select('*');
          if (error) throw error;
          data.value = myContacts;
          dataLoaded.value = true;

        } catch (error) {
          errorMsg.value = error.message;
          setTimeout(() => {
            errorMsg.value = false;
          }, 5000);
        }
      })

      //сортируем контакты по алфавиту
      const sortedContacts = computed(() => {       
        return sortedArray(data.value)
      });
      
      //функция поиска контактов
      const searchedContacts = computed(() => {
        return filteredArray(sortedContacts.value, search.value)
      });
      
      return {
        user, title, data, dataLoaded, search, sortedContacts, searchedContacts, errorMsg
      }
    }
  }
</script>

<style lang="scss" scoped>
  .webkit {
    -webkit-appearance:none;
  }

  .contacts {
    height: 100vh;
  }

  .search-input {
    // border: 1px solid #838383;
    border-radius: 20px;
    background-color: #f1f1f1;
  }

  .search-input_icon {
    width: 40px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input[type="search"] {
    background-color: #f1f1f1;
    -webkit-appearance:none;
  }

  input[type="search"]::-webkit-search-decoration {
    background-color: red;
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance:none;
  }


  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 30px;
    width: 30px;
    margin-left: .4em;
    background: url('../assets/images/common/icon-close.svg') center no-repeat;
    cursor: pointer;
  }

  .icon-wrapper img{
    width: 70%;
    height: 70%;
    display: block;
    margin: 0 auto;
  }

  .contact-item:last-child {
    border-bottom: none;
  }

</style>