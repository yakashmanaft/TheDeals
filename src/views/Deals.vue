<template>
<!-- Пока View называется Orders... по логике больше подходит Deals (дела... сделки...), а внутри разделяется на 1. order, 2. supply, 3. personal -->

  <div class="orders">
    <Navigation :title="title" class="fixed z-10 bg-white"/>  

    <!-- Добавление нового заказа -->
    <router-link 
      class="fixed z-10 bottom-5 right-5 w-14 h-14 bg-blue rounded-full flex items-center justify-center shadow-md"
      :to="{ name: 'CreateDeal' }"
    >
      <img src="@/assets/images/common/icon-plus.svg" alt="">
    </router-link>



    <!-- Временно создание поместим сюда -->
    <!-- <router-link class="cursor-pointer" :to="{ name: 'Create' }">Создать заказ</router-link> -->

    <!-- Когда Data загружена -->
    <div v-if="dataLoaded" class="container pt-20 px-4">

      <!-- No Data -->
      <div v-if="data.length === 0" class="w-full flex flex-col items-center">
        <h1 class="text-2xl">Looks empty here...</h1>
        <router-link 
          class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green" 
          :to="{ name: 'Create' }"
        >
          Create Workout
        </router-link>
      </div>

      <!-- Data -->

      <!-- Проба -->
      <div 
        v-else 
        class="grid grid-cols-1 gap-4"
      >
        <!-- Deal filter -->
        <div class="flex deal-filter-wrapper">
            <!-- В планах -->
            <div class="deal-filter-item">
              <input checked type="radio" name="deal-filter" id="date-booking" value="deal-in-progress"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="date-booking">
                <div class="deal-filter-item_text">Бронь даты</div> 
                <div class="deal-filter-item_count ml-1">22</div>
              </label>
            </div>
            <!-- В процессе -->
            <div class="deal-filter-item">
              <input checked type="radio" name="deal-filter" id="in-process" value="deal-in-progress"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="in-process">
                <div class="deal-filter-item_text">В процессе</div> 
                <div class="deal-filter-item_count ml-1">2</div>
              </label>
            </div>
            <!-- В доставке -->
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="in-delivery" value="deal-in-delivery"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="in-delivery">
                <div class="deal-filter-item_text">В доставке</div> 
                <div class="deal-filter-item_count ml-1">0</div>
              </label>
            </div>
            <!-- Долг -->
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="debt" value="deal-debt"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="debt">
                <div class="deal-filter-item_text">Долг</div> 
                <div class="deal-filter-item_count ml-1">1</div>
              </label>
            </div>
            <!-- Завершен -->
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="complete" value="deal-complete"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="complete">
                <div class="deal-filter-item_text">Завершен</div>
                <div class="deal-filter-item_count ml-1">1</div>
              </label>
            </div>
            <!-- Отменен -->
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="cancelled" value="deal-cancelled"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="cancelled">
                <div class="deal-filter-item_text">Отменен</div>
                <div class="deal-filter-item_count ml-1">1</div>
              </label>
            </div>

          
        </div>

        <div>
          <div v-for="(day, idx) in daysArray" :key="idx">
            <!-- Deadline Date -->
            <div class="flex items-center w-full place-content-between">
              <div class="date-line_date ml-2 text-md">{{day}}</div>
              <div class="date-line_line"></div>
            </div>

            <div v-for="(deal, index) in list" :key="index" class="my-4">
              <router-link v-if="showEventDate(deal.executionDate) === day" :to="{ name: 'View-Deal', params: { dealId: deal.id } }">
                <div class="relative flex flex-col rounded-md bg-light-grey p-2 py-4 shadow-md">
                  <!-- header -->
                  <div class="flex place-content-between">
                    <span class="bg-white text-green px-2 rounded-md text-sm text-center my-auto">{{translateDealType(deal.dealType)}}</span>
                    <router-link :to="{ name: 'View-Contact', params: { contactId: deal.contactID } }" class="text-sm text-blue mr-2">{{ getNameId(deal.contactID) }}</router-link> 
                  </div>
                  <!-- Предмет заказа -->
                  <div class="relative deal-subject_item my-2 mt-4">
                    <!-- item -->
                    <div class="absolute top-0 left-0 flex flex-col justify-items-center">
                      <div class="deal-subject_item-img">
                        <img src="../assets/images/deals/orders/wedding-cake.png" alt=""> 
                      </div>
                      <div class="text-dark-gray text-xs text-center">х 1</div>
                    </div>
                    <!-- item -->
                    <div class="absolute top-0 left-10 flex flex-col justify-items-center">
                      <div class="deal-subject_item-img">
                        <img src="../assets/images/deals/orders/cake.png" alt=""> 
                      </div>
                      <div class="text-dark-gray text-xs text-center">х 121</div>
                    </div>
                    <!-- item -->
                    <div class="absolute top-0 left-20 flex flex-col justify-items-center">
                      <div class="deal-subject_item-img">
                        <img src="../assets/images/deals/orders/cupcake.png" alt=""> 
                      </div>
                      <div class="text-dark-gray text-xs text-center">х 66</div>
                    </div>
                  </div>

                  <!-- Статус оплаты -->
                  <ul class="text-sm text-dark-gray mt-2 px-2">
                    <li class="flex place-content-between">
                      <span>Оплачено</span>
                      <span>1 000,00 <span class="text-xs">из</span> 2 570,00</span>
                    </li>
                    <li class="flex place-content-between mt-2">
                      <span>Долг</span>
                      <span>1 570,00</span>
                    </li>
                  </ul>
                </div>
              </router-link>
            </div>

          </div>

        </div>

        <router-link 
          class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer"
          :to="{ name: 'View-Deal', params: { dealId: deal.id } }"
          v-for="(deal, index) in data"
          :key="index"
        >
          <!-- Cardio Img -->
          <img 
            v-if="deal.workoutType === 'cardio'"
            src="@/assets/images/running-light-green.png" 
            class="h-24 w-auto" 
            alt=""
          />

          <!-- Strength Training -->
          <img 
            v-else
            src="@/assets/images/dumbbell-light-green.png" 
            class="h-24 w-auto" 
            alt=""
          />

          <p 
            class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg"
          >
            {{ deal.workoutType }}
          </p>

          <h1 class="mt-8 mb-2 text-center text-xl text-at-light-green">
            {{ deal.workoutName }}
          </h1>
        </router-link>
      </div>


      <!-- Проверка парсит ли данные из deals -->
      <div class="flex flex-col">
        <router-link
          :to="{ name: 'View-Deal', params: { dealId: deal.id } }"
          v-for="(deal, index) in list"
          :key="index"
        >
          <div>
            <p>{{ deal.contactID }}</p>
            <p>{{ deal.dealType }}</p>
            <p>{{ deal.ordersList }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'

import { ref } from 'vue';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

import { getContactInfo  } from '../supabase/getContactInfoFromDB';
import { showNameByID } from '../helpers/compareNameByID';
import { translateDealType } from '../helpers/translateDealType';

export default {
  name: "Deals",
  components: {
    Navigation
  },
  setup() {
    // Create data / vars
    const data = ref([]);
    const list = ref([]);
    const dataLoaded = ref(null);

    // Get data
    const getData = async () => {
      try {
        const { data: workouts, error } = await supabase.from('workouts').select('*');
        if(error) throw error;
        data.value = workouts;
        dataLoaded.value = true;
      } catch (error) {
        console.warn(error.message);
      }
    }

    // Run data function
    getData();

    // Get deals
    const getDeals = async () => {
      try {
        const { data: deals, error } = await supabase.from('deals').select('*');
        if(error) throw error;
        list.value = deals;
        dataLoaded.value = true;
      } catch (error) {
        console.warn(error.message);
      }
    }

    // Run getDeals function
    getDeals();

    const router = useRouter();
    const title = router.currentRoute._value.meta.translation;
    // console.log(router)
  

    // Преобразуем дату события для вывода в карточкн контакта
    const showEventDate = (eventdate) => {
      // get data from DB or input type date
      const date = new Date(eventdate)
      // format time
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthTitle = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

      return `${day} ${monthTitle[month]} ${year}`
    }

    // Список дат, для которых есть дела (заказы, поставки, личное)
    const daysArray = ref([])

    // Все даты по заказам
    const executionDatesArray = ref([])

    // Get execution date
    const getExecutionDate = async () => {
      // Выдергиваем из БД строки с датой исполнения дела
      try {
        const { data: deals, error } = await supabase.from('deals').select('executionDate');
        if(error) throw error;
        executionDatesArray.value = deals;
        // dataLoaded.value = true;

        //создаем на их основании новый массив
        const arr = executionDatesArray.value.map(item => {
          return {...item}
        })

        // делаем из массива массивов... массив с датами и сортируем их
        const newArray = []

        arr.forEach(item => {
          newArray.push(item.executionDate)
          // Сортируем массив дат по порядку (от более свежей к более старой)
          newArray.sort((a,b) => {
            return new Date(b) - new Date(a);
          })
        })

        // Задаем нужный формат отображения
        const newsArray = newArray.map(item => {
          return showEventDate(item)
        })

        daysArray.value = new Set(newsArray)
        
      } catch (error) {
        console.warn(error.message);
      }
    }

    // Run execution date function
    getExecutionDate();


    // Get contactInfo from DB MyContacts
    const contactInfo = ref([]);
    getContactInfo(contactInfo)
    
    
    // Show name of contact comparing by ID
    const getNameId = (contactID) => {
      // compare contactID form deals with contactInfo from MyContacts
      return showNameByID(contactInfo, contactID)
    }
    

    return {
      data, list, dataLoaded, title, executionDatesArray, translateDealType, showEventDate, daysArray, contactInfo, getNameId
    };
  },
};
</script>

<style scoped>
  .orders {
    height: 100vh;
  }

  .deal-subject_item {
    height: 70px;
  }

  .deal-subject_item-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #f1f1f1;
    border-radius: 100%;
  }

  .deal-subject_item-img img {
    width: 80%;
    height: 80%;
  }

  .deal-filter-wrapper {
    overflow-x: scroll;
    padding: 10px 0;
    -ms-overflow-style: none;
  }

  .deal-filter-wrapper::-webkit-scrollbar {
      width: 0;
      height: 0;
  }

  .deal-filter-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    margin-left: 10px;
    color: #3d3d3d;
  }

  .deal-filter-item:first-child {
    margin-left: 0px;
  }

  input[type="radio"] {
    display: none;
  }

  input[type="radio"]:checked + label {
    background:#4785E7;
  }

  input[type="radio"] + label {
    border: 1px solid #f1f1f1;
  }

  .deal-filter-item_count {
    text-align: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  input[type="radio"] + label .deal-filter-item_count{
    background: #4785E7;
    color: #fff;
  }

  input[type="radio"]:checked + label .deal-filter-item_text {
    color: #fff
  }

  input[type="radio"]:checked + label .deal-filter-item_count {
    background: #fff;
    color: #4785E7;
  }
  .ellipsis-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ellipsis-btn_item {
    position: relative;
  }
  .ellipsis-btn_item,
  .ellipsis-btn_item:after,
  .ellipsis-btn_item:before {
    width: 5px;
    height: 5px;
    background: #4785E7;
    border-radius: 100%;
  }

  .ellipsis-btn_item:after {
    content: '';
    position: absolute;
    left: -8px;
  }

  .ellipsis-btn_item:before {
    content: '';
    position: absolute;
    right: -8px;
  }

  .deal-menu {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #fff;
  }

  .date-line_date {
    white-space: nowrap;
    color: #838383;
  }

  .date-line_line {
    width: 100%;
    height: 1px;
    background-color: #f1f1f1;
    margin: 0 10px;
  }

  .date-line_calendar {
    width: 32px;
    height: 32px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
