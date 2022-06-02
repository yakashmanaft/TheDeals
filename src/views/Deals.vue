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
      <div v-if="list.length === 0" class="w-full flex flex-col items-center">
        <h1 class="text-2xl">Looks empty here...</h1>
        <router-link 
          class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green" 
          :to="{ name: 'Create' }"
        >
          Create deal
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
            <!--  -->
            <div class="deal-filter-item" v-for="(dealStatus, index) in dealStatusList" :key="index">
              <input type="radio" name="deal-filter" :id="dealStatus.name" :value="dealStatus.name" v-model="setDealStatus" @change="checkChangeStatus"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" :for="dealStatus.name">
                <div class="deal-filter-item_text">{{ dealStatus.title }}</div> 
                <div class="deal-filter-item_count ml-1">{{getStatusArrLength(`${dealStatus.name}`)}}</div>
              </label>
            </div>
        </div>

        <!-- Loading spinner -->
        <div v-if="spinner" class="spinner"></div>

        <!-- Deals, dates -->
        <div v-else class="mb-4">

          <div v-for="(day, idx) in daysArray" :key="idx">

            <!-- Deadline Date (Execution date of deal)-->
            <div class="flex items-center w-full place-content-between">
              <div class="date-line_date ml-2 text-md">{{day}}</div>
              <div class="date-line_line"></div>
            </div>

            <!-- Cards of deals -->
            <div v-for="(deal, index) in list" :key="index" class="my-4">
              <router-link v-if="showEventDate(deal.executionDate) === day && deal.dealStatus === setDealStatus" :to="{ name: 'View-Deal', params: { dealId: deal.id } }">
                <div class="relative flex flex-col rounded-md bg-light-grey p-2 py-4 shadow-md">

                  <!-- header -->
                  <div class="flex place-content-between items-center">
                    <div class="flex items-center">
                      <span class="bg-white text-green px-2 py-1 rounded-md shadow-sm text-sm">{{translateDealType(deal.dealType)}}</span>
                      <span class="bg-white px-2 ml-2 py-1 text-sm rounded-md shadow-sm text-dark-gray whitespace-nowrap">{{ translateDealStatus(deal.dealStatus) }}</span>
                    </div>
                    <router-link :to="{ name: 'View-Contact', params: { contactId: deal.contactID } }" class="text-sm text-right text-blue mr-2">{{ getNameId(deal.contactID) }}</router-link> 
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

        <!-- ОПТИМИЗИРОВАТЬ! -->
        <!-- zero deal status messages -->
        <div v-if="!spinner" class="zero-status_wrapper">

          <!-- deal-in-booking -->
          <div v-if="setDealStatus === 'deal-in-booking' && getStatusArrLength('deal-in-booking') === 0">
            <div class="flex flex-col items-center">
              <div>
                <img src="../assets/images/deals/status/deal-in-booking.svg" alt="">
              </div>
              <h2 class="text-blue text-xl mt-8">Нет забронированных дат</h2> 
              <p class="text-dark-gray mt-2 text-center">Создайте дело и укажите дату</p>
            </div>
          </div>

          <!-- deal-in-process -->
          <div v-if="setDealStatus === 'deal-in-process' && getStatusArrLength('deal-in-process') === 0">
            <div class="flex flex-col items-center">
              <div>
                <img src="../assets/images/deals/status/deal-in-process.svg" alt="">
              </div>
              <h2 class="text-blue text-xl mt-8">Где дела в процессе?</h2> 
              <p class="text-dark-gray mt-2 text-center">Создайте дело и приступайте.</p>
            </div>
          </div>

          <!-- deal-in-delivery -->
          <div v-if="setDealStatus === 'deal-in-delivery' && getStatusArrLength('deal-in-delivery') === 0">
            <div class="flex flex-col items-center">
              <div>
                <img src="../assets/images/deals/status/deal-in-delivery.svg" alt="">
              </div>
              <h2 class="text-blue text-xl mt-8">А как же доставка?</h2> 
              <p class="text-dark-gray mt-2 text-center">Сделали дело, доставьте товар.</p>
            </div>
          </div>

          <!-- deal-in-debt -->
          <div v-if="setDealStatus === 'deal-in-debt' && getStatusArrLength('deal-in-debt') === 0">
            <div class="flex flex-col items-center">
              <div>
                <img src="../assets/images/deals/status/deal-in-debt.svg" alt="">
              </div>
              <h2 class="text-blue text-xl mt-8">У вас нет дел с долгами</h2> 
              <p class="text-dark-gray mt-2 text-center">Никто никому ничего не должен.</p>
            </div>
          </div>

          <!-- deal-cancelled -->
          <div v-if="setDealStatus === 'deal-complete' && getStatusArrLength('deal-complete') === 0">
            <div class="flex flex-col items-center">
              <div>
                <img src="../assets/images/deals/status/deal-complete.svg" alt="">
              </div>
              <h2 class="text-blue text-xl mt-8">Где завершенные дела?</h2> 
              <p class="text-dark-gray mt-2">Кажется, вы беретесь и не доделываете...</p>
            </div>
          </div>

          <!-- deal-cancelled -->
          <div v-if="setDealStatus === 'deal-cancelled' && getStatusArrLength('deal-cancelled') === 0">
            <div class="flex flex-col items-center">
              <div>
                <img src="../assets/images/deals/status/deal-cancelled.svg" alt="">
              </div>
              <h2 class="text-blue text-xl mt-8">Ни одного отмененного дела!</h2> 
              <p class="text-dark-gray mt-2">Вы супер! Так держать!</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'

import { ref } from 'vue';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

import { getContactInfo } from '../supabase/getContactInfoFromDB';
import { getDeals, getDealStatus } from '../supabase/getDealsFromDB';

import { showNameByID } from '../helpers/compareNameByID';
import { translateDealType, translateDealStatus } from '../helpers/translators';

export default {
  name: "Deals",
  components: {
    Navigation
  },
  setup() {
    // Create data / vars
    const list = ref([]);
    const dataLoaded = ref(null);
    const errorMsg = ref(null);

    // deal status list
    const dealStatusList = [
      {
        name: 'deal-in-booking',
        title: 'Бронь даты',
      },
      {
        name: 'deal-in-process',
        title: 'В процессе',
      },
      {
        name: 'deal-in-delivery',
        title: 'В доставке',
      },
      {
        name: 'deal-in-debt',
        title: 'Долг'
      },
      {
        name: 'deal-complete',
        title: 'Завершен'
      },
      {
        name: 'deal-cancelled',
        title: 'Отменен'
      }
    ]

    // Забирает value из выбранно чекбокса (по умолчанию ставим "В процессе")
    const setDealStatus = ref('deal-in-process');

    // Run getDeals function
    getDeals(list, dataLoaded, errorMsg);

    const router = useRouter();
    const title = router.currentRoute._value.meta.translation;

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

    // Spiner data
    const spinner = ref(false);

    // const loadSpinner = () => {

    // }

    // Все даты по заказам
    const executionDatesArray = ref([])
    // Get execution date
    const getExecutionDate = async (dealStatus) => {
      // Выдергиваем из БД строки с датой исполнения дела
      try {
        const { data: deals, error } = await supabase.from('deals').select('*').eq('dealStatus', dealStatus);
        if(error) throw error;
        executionDatesArray.value = deals;

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
      spinner.value = false;
    }

    // Run execution date function
    getExecutionDate(setDealStatus.value);

    const dealStatusArray = ref([])

    // Запускаем функцию получаения из БД статусы всех дел
    getDealStatus(dealStatusArray, dataLoaded, errorMsg)

    // Меняем статус дела и запускаем функцию сопоставления дат дел
    const checkChangeStatus = () => {
      getExecutionDate(setDealStatus.value);
      spinner.value = !spinner.value;
    }

    // Получаем количество дел по конкретному статусу
    const getStatusArrLength = (dealStatus) => {
        //создаем на основании массива dealStatusArray новый массив
        const arr = dealStatusArray.value.map(item => {
          return {...item}
        })

        // Сопоставляем с checkbox с значением checked
        const dealStatusLength = arr.filter(item => item.dealStatus === dealStatus.toString())
        // Возвращаем из функции количество дел
        return dealStatusLength.length
    }

    // Get contactInfo from DB MyContacts
    const contactInfo = ref([]);
    getContactInfo(contactInfo, errorMsg)
    
    // Show name of contact comparing by ID
    const getNameId = (contactID) => {
      // compare contactID form deals with contactInfo from MyContacts
      return showNameByID(contactInfo, contactID)
    }

    return {
      list, setDealStatus, dataLoaded, title, executionDatesArray, translateDealType, translateDealStatus, showEventDate, daysArray, contactInfo, getNameId, checkChangeStatus, dealStatusArray, getDealStatus, getStatusArrLength, dealStatusList, spinner
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

  .zero-status_wrapper {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  .spinner {
    position: absolute;
    height: 60px;
    width: 60px;
    border: 3px solid transparent;
    border-top-color: #3D3D3D;
    top: 60%;
    left: 50%;
    margin: -30px;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }

  .spinner:before, .spinner:after{
    content:'';
    position: absolute;
    border: 3px solid transparent;
    border-radius: 50%;
  }

  .spinner:before{
    border-top-color: #78D86F;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    animation: spin 3s linear infinite;
  }

  .spinner:after{
    border-top-color: #4785E7;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;  
    animation: spin 4s linear infinite;
  }

  @keyframes spin{
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg);}
  }

</style>
