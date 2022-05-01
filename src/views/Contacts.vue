<template>
  <div class="contacts container">
    <Navigation :title="title" class="fixed z-10 bg-white"/>

    <!-- Кнопка добавления нового контакта -->
    <!-- Может имеет смысл сделать компонентом? -->
    <router-link 
      class="fixed bottom-5 right-5 w-14 h-14 bg-blue rounded-full flex items-center justify-center"
      :to="{ name: 'CreateContact' }"
    >
      <img src="@/assets/images/common/icon-plus.svg" alt="">
    </router-link>

    <div v-if="dataLoaded" class="pt-20">

      <!-- No Data -->
      <div v-if="data.length === 0">
        <h1 class="text-2xl">Looks empty here...</h1>
        <!-- Добавить ссылку на экран создания нового контакта -->
      </div>

      <!-- Data -->
      <div v-else>

        <!-- Поиск по контактам -->
        <!-- Может отдельным компонентом сделать -->
        <div class="search-input mx-4 h-10 flex items-center">
          <span class="search-input_icon">
            <img src="@/assets/images/common/icon-search.svg" alt="">
          </span>
          <input 
            id="searchedContacts"
            class="search-input_input outline-none w-full pr-2 focus:text-dark" 
            type="search"
            placeholder="Поиск..."
            v-model="search"
          >
        </div>

        <!-- Количество контактов (вдруг понадобится) -->
        <!-- <div>
          {{data.length}}
        </div> -->

        <!-- Contact Template -->
        <ul class="px-4 pt-4">
          <router-link
            v-for="contact in searchedContacts"
            :key="contact.id"
            :to="{ name: 'View-Contact', params: { contactId: contact.id } }"
            class="flex justify-between items-center bg-light-grey rounded-md px-4 py-2 mt-2"
          >
            <div>
              <p class="text-blue text-2xl">{{ contact.contactInfo.surname }}</p>
              <p class="text-dark-gray">{{ contact.contactInfo.name }}</p>
            </div>
            <div>
              <p class="text-dark-gray">{{ contact.contactInfo.company }}</p>
            </div>
          </router-link>
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

  export default {
    components: {
      Navigation
    },
    setup () {
      const user = computed(() => store.state.user);

      const data = ref([]);
      const dataLoaded = ref(null);

      const search = ref('');

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
          console.warn(error.message);
        }
      })

      const searchedContacts = computed(() => {
        // Требуется фильтр по алфавиту добавить
        return data.value.filter((contact) => {
          return (
            contact.contactInfo.name.toLowerCase().indexOf(search.value.toLowerCase()) != -1 || 
            contact.contactInfo.surname.toLowerCase().indexOf(search.value.toLowerCase()) != -1 ||
            contact.contactInfo.company.toLowerCase().indexOf(search.value.toLowerCase()) != -1
            // Из каких col еще стреубется поиск? по номеру телефона? по наличию вайбера? думайте...
          )
        })
      });
      
      return {
        user, title, data, dataLoaded, search, searchedContacts
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
    width: 40px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }


  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 30px;
    width: 30px;
    margin-left: .4em;
    background: url('../assets/images/common/icon-close.svg') center no-repeat;
    cursor: pointer;
  }

</style>