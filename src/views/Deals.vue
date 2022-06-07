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

    <!-- Когда Data загружена -->
    <div v-if="dataLoaded" class="container pt-20 px-4">

      <!-- App Msg -->
      <!-- разобраться со стилями ерроров и меседжей системных -->
      <!-- Status Message -->
      <div v-if="statusMsg || errorMsg" class="fixed z-20 flex left-0 top-0 w-full h-16 mb-10 px-8 py-4 rounded-b-md shadow-md bg-white items-center place-content-between">
        <div>
          <p class="text-green">
            {{ statusMsg }}
          </p>
          <p class="text-red-500">
            {{ errorMsg }}
          </p>
        </div>
        <div class="text-dark-gray" @click="statusMsg = !statusMsg">
          Ok
        </div>
      </div>

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
      <div 
        v-else 
        class="grid grid-cols-1 gap-4"
        :class="{ fixed: dealStatusMenu }"
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
        <div v-else class="mb-12">

          <div v-for="(day, idx) in daysArray" :key="idx">

            <!-- Deadline Date (Execution date of deal)-->
            <div class="flex items-center w-full place-content-between">
              <div class="date-line_date ml-2 text-md">{{day}}</div>
              <div class="date-line_line"></div>
            </div>

            <!-- Cards of deals -->
            <div v-for="(deal, index) in list" :key="index" class="my-4">
              <router-link v-if="showEventDate(deal.executionDate) === day && deal.dealStatus === setDealStatus" :to="{ name: 'View-Deal', params: { dealId: deal.id } }">
                <div class="relative flex flex-col rounded-md bg-light-grey p-2 pb-4 shadow-md">

                  <!-- header -->
                  <div class="flex place-content-between items-center border-b pb-2">

                    <!-- Тип дела -->
                    <span class="leading-5 px-2 py-1 mr-4 border border-green text-green rounded-md text-sm">{{translateDealType(deal.dealType)}}</span>
                    
                    <!-- Контакт по делу -->
                    <div class="flex flex-col item-center">
                      <p v-if="deal.contactID === '000'" class="text-sm text-center text-dark-gray mr-2">Неизвестный</p>
                      <router-link else :to="{ name: 'View-Contact', params: { contactId: deal.contactID } }" class="text-sm text-center text-blue mr-2">{{ getNameId(deal.contactID)}}</router-link> 
                    </div>

                    <!-- Статус дела -->
                    <span @click.prevent.stop="dealStatusMenuToggle(deal.id, deal.dealStatus)" class=" px-2 py-1 text-sm rounded-md text-blue whitespace-nowrap">{{ translateDealStatus(deal.dealStatus) }}</span>

                  </div>

                  <!-- Предмет заказа -->
                  <div class="relative deal-subject_item my-2">
                    <div v-for="(item, index) in deal.dealsList" :key="index" :class="`left-${index}0`" class="absolute top-0 left-0 flex flex-col justify-items-center">
                      
                      <!-- item -->
                      <div class="deal-subject_item-img">
                        <img :src="require(`../assets/images/deals/orders/${item.selectedProduct}.png`)" alt=""> 
                      </div>
                      <div class="text-dark-gray text-xs text-center">х {{ item.productQuantity }}</div>
                    </div>
                  </div>

                  <!-- Оплата -->
                  <!-- Если имеется долг по делу -->
                  <ul class="text-sm text-dark-gray mt-2 px-2" v-if="deal.totalDealValue - deal.dealPaid > 0">
                    <li class="flex place-content-between items-center">
                      <span>Оплачено (RUB)</span>
                      <span>{{ deal.dealPaid }}<span class="text-xs"> из</span> <span class="text-lg text-dark">{{ deal.totalDealValue }}</span></span>
                    </li>
                    <li class="flex place-content-between mt-2">
                      <div class="flex items-center">
                        <span>Долг (RUB)</span>
                        <span 
                          class="text-xs text-blue ml-2 border-b border-blue border-dashed"
                          @click.prevent.stop="makePaymMenuToggle(deal.id, deal.dealPaid, deal.totalDealValue)"
                          >
                            Внести оплату
                          </span>
                      </div>
                      <span>{{ (deal.totalDealValue - deal.dealPaid).toFixed(2)  }} </span>
                      
                    </li>
                  </ul>
                  <!-- Если долг отсутствует -->
                  <ul class="text-sm text-dark-gray mt-2 px-2" v-if="deal.totalDealValue - deal.dealPaid === 0">
                    <li class="flex place-content-between items-center">
                      <span>Оплачено (RUB)</span>
                      <span class="text-lg text-dark">{{ deal.totalDealValue }}</span>
                    </li>
                    <li class="flex items-center justify-end mt-2">
                      <div class="checkmark"></div>
                      <span class="text-green ml-1">Оплата 100%</span>
                    </li>  
                  </ul>

                </div>
              </router-link>
            </div>

          </div>

        </div>

        <!-- zero deal status messages -->
        <div v-if="!spinner && dealStatusArray.length !== 0" class="zero-status_wrapper">
          
          <!-- looping zero deal status -->
          <div v-for="(item, index) in dealStatusList" :key="index">
            <div v-if="setDealStatus === item.name && getStatusArrLength(item.name) === 0">
              <div class="flex flex-col items-center">
                <div>
                  <img :src="require(`../assets/images/deals/status/${item.name}.svg`)" alt="">
                </div>
                <h2 class="text-blue text-xl mt-8">{{ item.caption }}</h2> 
                <p class="text-dark-gray mt-2 text-center">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Change Deal status menu wrapper -->
      <div v-if="dealStatusMenu" class="w-full fixed bottom-0 left-0 flex items-center justify-center flex-col pb-0 z-20" :class="{ dealStatusMenu_wrapper: dealStatusMenu}" @click="closeDealStatusMenu">
        <!-- menu -->
        <div class="bg-light-grey bottom-0 border-t w-full fixed  rounded-t-3xl">
          <!-- menu header -->
          <div class="text-blue text-sm flex items-center place-content-between p-4 deal-status-menu">
            <span class="dealStatusMenu-btn_close">Отменить</span>
            <span @click="updateStatus">Готово</span>
          </div>
          <!-- menu content -->
          <div class="mb-4 border-t text-sm pt-2">
            <!-- status item -->
            <div v-for="(status, index) in dealStatusList" :key="index" class="flex flex-col">
              <!--  -->
              <input class="custom-radio" name="changeDealStatus" type="radio" :id="`${status.name}1`" :value="status.name"
              v-model="statusDeal.currentDealStatus" >
              <label class="px-6 py-2 text-dark-gray" :for="`${status.name}1`">{{ status.title }}</label>

            </div>
          </div>
        </div>
      </div>

      <!-- Make Payment menu wrapper -->
      <div v-if="dealPaidMenu" class="w-full fixed bottom-0 left-0 flex items-center justify-center flex-col pb-0 z-20" :class="{ dealStatusMenu_wrapper: dealPaidMenu}" @click="closeDealPaidMenu">
        <!-- menu -->
        <div class="bg-light-grey bottom-0 border-t w-full fixed  rounded-t-3xl">
          <!-- menu header -->
          <div class="text-blue text-sm flex items-center place-content-between p-4 deal-status-menu">
            <span class="dealStatusMenu-btn_close">Отменить</span>
            <span @click="updateDealPaid">Готово</span>
          </div>
          <!-- menu content -->
          <div class="mb-4 border-t text-sm pt-2">
            {{dealPaid}}
            <div class="flex place-content-between">
              <p>Долг по делу (RUB)</p>
              <p @click="copyDebtValue" class="text-blue border-b border-dashed border-blue">{{debt(dealPaid.totalDealValue, dealPaid.currentDealPaid)}}</p>
            </div>
            <input type="number" placeholder="0.00" inputmode="decimal" v-model="makePayment">
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
    const statusMsg = ref(null);
    const errorMsg = ref(null);
    // Spiner data
    const spinner = ref(false);

    // deal status menu
    const dealStatusMenu = ref(false);

    // Помещаем сюда current статус выбранного дела
    const statusDeal = ref('')

    // deal status menu toggle
    // Забираем у текущего дела id и значение статуса 
    const dealStatusMenuToggle = (currentDealID, currentDealStatus) => {
      dealStatusMenu.value = !dealStatusMenu.value;
      
      const currentDeal = {
        currentDealID: currentDealID,
        currentDealStatus: currentDealStatus
      }
      // console.log(currentDeal)
      return statusDeal.value = currentDeal
    }

    // Открытие Закрытие меню внесения оплаты
    const dealPaidMenu = ref(false);
    // Помещаем сюда current статус выбранного дела
    const dealPaid = ref('')

    // make payment menu toggle
    // Забираем у текущего дела id и сколько уже оплачено 
    const makePaymMenuToggle = (currentDealID, currentDealPaid, totalDealValue) => {
      dealPaidMenu.value = !dealPaidMenu.value;
      
      const currentDeal = {
        currentDealID: currentDealID,
        currentDealPaid: currentDealPaid,
        totalDealValue: totalDealValue
      }
      // console.log(currentDeal)
      return dealPaid.value = currentDeal;
    }

    const debtValue = ref();
    const makePayment = ref();

    const copyDebtValue = () => {
      makePayment.value = debtValue.value;
    }


    const debt = (totalDealValue, currentDealPaid) => {
      const isDebt = (totalDealValue -  currentDealPaid).toFixed(2);
      debtValue.value = isDebt;
      return isDebt;
    }


    // Закрываем DealStatusMenu
    const closeDealStatusMenu = (e) => {
      if (e.target.classList.contains('dealStatusMenu_wrapper') || e.target.classList.contains('dealStatusMenu-btn_close')) {
          dealStatusMenu.value = !dealStatusMenu.value;
      }
    }

    // Закрываем DealStatusMenu
    const closeDealPaidMenu = (e) => {
      if (e.target.classList.contains('dealStatusMenu_wrapper') || e.target.classList.contains('dealStatusMenu-btn_close')) {
          dealPaidMenu.value = !dealPaidMenu.value;
      }
    }

    //
    const wait = () => {
      if (!dataLoaded.value && list.value.length === 0) {
        spinner.value = !spinner.value
      }
    }
    wait()

    // deal status list
    const dealStatusList = [
      {
        name: 'deal-in-booking',
        title: 'Бронь даты',
        caption: 'Нет забронированных дат',
        text: 'Создайте дело и укажите дату.'
      },
      {
        name: 'deal-in-process',
        title: 'В процессе',
        caption: 'Где дела в процессе?',
        text: 'Создайте дело и приступайте.'
      },
      {
        name: 'deal-in-delivery',
        title: 'В доставке',
        caption: 'А как же доставка?',
        text: 'Сделали дело, доставьте товар.'
      },
      {
        name: 'deal-in-debt',
        title: 'Долг',
        caption: 'У вас нет дел с долгами',
        text: 'Никто никому ничего не должен.'
      },
      {
        name: 'deal-complete',
        title: 'Завершен',
        caption: 'Где завершенные дела?',
        text: 'Кажется, вы беретесь и не доделываете...'
      },
      {
        name: 'deal-cancelled',
        title: 'Отменен',
        caption: 'Ни одного отмененного дела!',
        text: 'Вы супер! Так держать!'
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
        errorMsg.value = `Error: ${error.message}`;
        // setTimeout(() => {
        //   errorMsg.value = false;
        //   console.warn(error.message);
        // }, 5000);
      }
      spinner.value = false;
    }

    // Run execution date function
    getExecutionDate(setDealStatus.value);

    const dealStatusArray = ref([])

    // Запускаем функцию получения из БД статусы всех дел
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

    // Обновляем в БД Статус дела
    const updateStatus = async () => {
      // Закрываем меню изменения статуса
      dealStatusMenu.value = !dealStatusMenu.value;

      // Преобразования и вычисления
      const deal = statusDeal.value

      // Обновляем данные в БД
      // Требуется функция проверки дела на долги!!!
      try {
        const { error } = await supabase.from('deals').update({
          dealStatus: deal.currentDealStatus
        }).eq('id', deal.currentDealID);
        if(error) throw error;
        statusMsg.value = `Статус дела #${deal.currentDealID} успешно обновлен`;
        setTimeout(() => {
          statusMsg.value = false;
        }, 5000);
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
          console.warn(error.message);
        }, 5000);
      }

      // Run getDeals function
      getDeals(list, dataLoaded, errorMsg);
      // Запускаем функцию получения из БД статусы всех дел
      getDealStatus(dealStatusArray, dataLoaded, errorMsg)
      //
      checkChangeStatus()
 
      // console.log(deal.currentDealID)
      // console.log(deal.currentDealStatus)
    }

    // Обновляем в БД внесенную сумму по делу 
    const updateDealPaid = async () => {
      dealPaidMenu.value = !dealPaidMenu.value
      // console.log('Deal paid value is updated')

      const totalPaid = +dealPaid.value.currentDealPaid + +makePayment.value;
      // console.log(totalPaid)

      try {
        const { error } = await supabase.from('deals').update({
          dealPaid: totalPaid
        }).eq('id', dealPaid.value.currentDealID)
        if(error) throw error;
        statusMsg.value = `Оплата по делу #${dealPaid.value.currentDealID} внесена`;
        setTimeout(() => {
          statusMsg.value = false;
        }, 5000);
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
          console.warn(error.message);
        }, 5000);
      }
      setTimeout(() => {
        getDeals(list, dataLoaded, errorMsg);
        spinner.value = !spinner.value;
      }, 1000)
      // Run getDeals function
      spinner.value = !spinner.value;
      makePayment.value = ''
    }

    return {
      list, setDealStatus, dataLoaded, title, executionDatesArray, translateDealType, translateDealStatus, showEventDate, daysArray, contactInfo, getNameId, checkChangeStatus, dealStatusArray, getDealStatus, getStatusArrLength, dealStatusList, spinner, dealStatusMenu, dealStatusMenuToggle, closeDealStatusMenu, statusDeal, updateStatus, statusMsg, errorMsg, dealPaid, makePaymMenuToggle, updateDealPaid, dealPaidMenu, closeDealPaidMenu, debt, debtValue, makePayment, copyDebtValue
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

  .dealStatusMenu_wrapper {
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
  }

  /* для элемента input c type="radio" */
  .custom-radio {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  .custom-radio:checked+label {
    background-color: white !important;
    color: #4785E7 !important;
  }

  /* для элемента label связанного с .custom-radio */
  .custom-radio+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  /* создание в label псевдоэлемента  before со следующими стилями */
  .custom-radio+label::after {
    content: '';
    display: inline-block;
    width: 1.3em;
    height: 1.3em;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #4785E7;
    border-radius: 50%;
    margin-left: auto;
    margin-right: 1%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }

  /* стили при наведении курсора на радио */
  /* .custom-radio:not(:disabled):not(:checked)+label:hover::after {
    border-color: #b3d7ff;
  } */

  /* стили для активной радиокнопки (при нажатии на неё) */
  .custom-radio:not(:disabled):active+label::after {
    background-color: #D8E7FF;
    border-color: #D8E7FF;
  }

  /* стили для радиокнопки, находящейся в фокусе */
  .custom-radio:focus+label::after {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  /* стили для радиокнопки, находящейся в фокусе и не находящейся в состоянии checked */
  /* .custom-radio:focus:not(:checked)+label::before {
    border-color: #80bdff;
  } */
  /* стили для радиокнопки, находящейся в состоянии checked */
  .custom-radio:checked+label::after {
    border-color: #4785E7;
    background-color: #4785E7;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%234785E7'/%3e%3c/svg%3e");
  }
  /* стили для радиокнопки, находящейся в состоянии disabled */
  /* .custom-radio:disabled+label::before {
    background-color: #e9ecef;
  } */

  .checkmark {
    width: 15px;
    height: 15px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2378D86F' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
  }

</style>
