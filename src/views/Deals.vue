<template>
  <div>
    <!-- Компонент Navigation -->
    <Navigation :title="pageTitle"/>  
    <!-- Компонент быстрого доступа (кнопка создания дела)-->
    <QuickAccessMenu :to="{ name: 'CreateDeal' }"></QuickAccessMenu>
    <!-- Компонент Spinner -->
    <Spinner v-if="spinner && !dataLoaded"></Spinner>
    
    <!-- Когда Data загружена -->
    <div v-if="dataLoaded" class="pt-20 container">

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
      <div v-if="list.length === 0">
        <!-- Сообщение, когда ни одного дела еще не было создано -->
        <div class="text-center px-4 mt-12" :class="{ item_fixed: spinner }">
          <!-- Предполагаемая картинка -->
          <div class="icon-wrapper flex items-center justify-center">
            <!-- Картинка предполагает ссылку на авторство, заменить на свою -->
            <img src="@/assets/images/stickers/deals-sticker.png" alt="">
          </div>
          <h1 class="text-blue text-xl mt-4">У вас еще нет дел...</h1>
          <p class="text-dark-gray mt-2">Самое время начать заниматься деятельностью и создать первое дело!</p>
          <router-link 
            :to="{ name: 'CreateDeal' }"
            type="button"
            class="bg-green text-white webkit block rounded-md m-4 mt-8 p-2"
          >
            Добавить
          </router-link>
        </div>
      </div>

      <!-- Data -->
      <div 
        v-else 
        class="grid grid-cols-1 gap-4"
        :class="{ item_fixed: spinner || dealStatusMenu || dealPaidMenu || dealCancelledReasonMenu}"
      >
        <!-- Deal filter -->
        <div class="flex deal-filter-wrapper mx-4">
            <!--  -->
            <div class="deal-filter-item" v-for="(dealStatus, index) in dealStatusList" :key="index">
              <input type="radio" name="deal-filter" :id="dealStatus.name" :value="dealStatus.name" v-model="setDealStatus" @change="checkChangeStatus"> 
              <label :class="dealStatusClassObject(dealStatus.name)" class="flex text-sm px-2 p-1 rounded-2xl" :for="dealStatus.name">
                <div 
                  class="deal-filter-item_text"
                >
                  {{ dealStatus.title }}
                </div> 
                <div 
                  v-if="dealStatus.name !== 'deal-cancelled' && dealStatus.name !== 'deal-complete'" class="deal-filter-item_count ml-1"
                >
                  {{getStatusArrLength(`${dealStatus.name}`)}}
                </div>
              </label>
            </div>
        </div>

        <!-- Loading spinner -->
        <Spinner v-if="spinner"></Spinner>

        <!-- Deals, dates -->
        <div v-else class="mb-12 mx-4" :class="{ item_fixed: spinner }">

          <div v-for="(day, idx) in daysArray" :key="idx">

            <!-- Deadline Date (Execution date of deal)-->
            <div class="flex items-center w-full place-content-between">
              <div class="date-line_date ml-2 text-md">{{day}}</div>
              <div class="date-line_line"></div>
            </div>

            <!-- Cards of deals -->
            <div v-for="(deal, index) in list" :key="index" class="my-4">
              <router-link v-if="showEventDate(deal.executionDate) === day && deal.dealStatus === setDealStatus" :to="{ name: 'View-Deal', params: { dealId: deal.id } }">
                <div class="relative flex flex-col rounded-md bg-light-grey p-2  shadow-md">

                  <!-- header -->
                  <div class="flex place-content-between items-center border-b pb-2">
                    <div class="flex items-center">
                      <!-- Тип дела -->
                        <span class="px-2 py-1 mr-2 border border-green text-green rounded-md text-sm">{{translateDealType(deal.dealType)}}</span>
                      
                      <!-- Контакт по делу -->
                      <div class="flex flex-col item-center">
                        <p v-if="deal.contactID === '000'" class="text-sm text-left text-dark-gray mr-2">Неизвестный</p>
                        <router-link else :to="{ name: 'View-Contact', params: { contactId: deal.contactID } }" class="text-sm text-left text-blue mr-2">{{ getNameId(deal.contactID)}}</router-link> 
                      </div>
                    </div>

                    <!-- Статус дела -->
                    <span @click.prevent.stop="dealStatusMenuToggle(deal.id, deal.dealStatus, deal.dealPaid, deal.totalDealValue, deal.cancelledReason, deal.dealsList)" class=" px-2 py-1 text-sm rounded-md text-blue whitespace-nowrap">{{ translateDealStatus(deal.dealStatus) }}</span>

                  </div>
                  

                  <div v-if="deal.isExpend" class="border-b pb-2">
                    <!-- Предмет заказа -->
                    <div class="relative deal-subject_item my-2">
                      <div v-for="(item, index) in deal.dealsList" :key="index" :class="`left-${index}0`" class="absolute top-0 left-0 flex flex-col justify-items-center">
                        
                        <!-- item -->
                        <div class="deal-subject_item-img relative">
                          <img :src="require(`../assets/images/deals/orders/${item.selectedProduct}.png`)" alt=""> 
                        </div>
                        <div class="text-dark-gray text-xs text-center">х{{ item.productQuantity }}</div>
                        <!-- mark where subject has attribute -->
                        <div v-if="checkRentAttr(item)" class="absolute top-0 left-0 w-4 h-4 bg-cancel rounded-full">
                        </div>
                      </div>
                    </div>

                    <!-- Оплата -->
                    <!-- Если имеется долг по делу -->
                    <ul class="text-sm text-dark-gray mt-2 px-2" v-if="deal.totalDealValue - deal.dealPaid > 0">
                      <li class="flex place-content-between items-center">
                        <span>Оплачено (RUB)</span>
                        <span>{{ dealPaidValuePattern(deal.dealPaid) }}<span class="text-xs"> из</span> <span class="text-lg text-dark">{{ deal.totalDealValue }}</span></span>
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
                        <span>{{ debt(deal.totalDealValue, deal.dealPaid) }} </span>
                        
                      </li>
                      <li class="flex items-center place-content-between justify-end">
                        <!-- Причина отмены -->
                        <div @click.prevent.stop="openCancelledReasonMenu(deal.id, deal.cancelledReason)" v-if="deal.dealStatus === 'deal-cancelled'" class="border-b border-dashed border-blue text-blue text-xs mt-2">
                          Причина отмены
                        </div>
                      </li>  
                    </ul>
                    <!-- Если долг отсутствует -->
                    <ul class="text-sm text-dark-gray mt-2 px-2" v-if="deal.totalDealValue - deal.dealPaid === 0">
                      <li class="flex place-content-between items-center">
                        <span>Оплачено (RUB)</span>
                        <span class="text-lg text-dark">{{ deal.totalDealValue }}</span>
                      </li>
                      <li class="flex items-center place-content-between">
                        <!-- Оплата -->
                        <div class="flex items-center mt-2">
                          <div class="checkmark"></div>
                          <span class="text-green ml-1">Оплата 100%</span>
                        </div>
                        <!-- Причина отмены -->
                        <div @click.prevent.stop="openCancelledReasonMenu(deal.id, deal.cancelledReason)" v-if="deal.dealStatus === 'deal-cancelled'" class="border-b border-dashed border-blue text-blue text-xs mt-2">
                          Причина отмены
                        </div>
                      </li>  
                    </ul>

                  </div>  

                  <!-- Свернуть / развернуть -->
                  <div class="flex place-content-between mt-2 items-center">
                    <div class="text-dark-gray text-xs px-2">
                      Кол-во позиций: {{deal.dealsList.length}} 
                    </div>
                    <!-- btn to open expend deal card -->
                    <div @click.prevent.stop="expendDeal(index)">
                      <div class="flex items-center mr-2">
                        <div v-if="!deal.isExpend" class="text-sm text-blue mr-2">Развернуть</div>
                        <div v-if="deal.isExpend" class="text-sm text-blue mr-2">Свернуть</div>
                        <div class="totalMenu-more_arrow">
                          <img 
                            class="more-arrow_icon" 
                            src="../assets/images/common/arrow-right.svg"
                            :class="[{ more_arrow_icon_opened_menu: !deal.isExpend }, {more_arrow_icon_closed_menu: deal.isExpend}]" 
                            alt="">
                        </div>
                      </div>
                    </div>
  
                  </div>

                </div>
              </router-link>
            </div>

          </div>

        </div>

        <!-- zero deal status messages -->
        <div v-if="!spinner && dealStatusArray.length !== 0 && !dealWithDebt && !dealCancelledReasonMenu" class="zero-status_wrapper">
          <!-- looping zero deal status -->
          <div else v-for="(item, index) in dealStatusList" :key="index">
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
      <div v-if="dealStatusMenu" class="w-full fixed bottom-0 left-0 flex items-center justify-center flex-col pb-0 z-20" :class="{ shading_background: dealStatusMenu}" @click="closeDealStatusMenu">
        <!-- menu -->
        <div class="bg-light-grey bottom-0 border-t w-full fixed  rounded-t-3xl">
          <!-- menu header -->
          <div class="text-blue text-sm flex items-center place-content-between p-4 deal-status-menu">
            <span class="dealStatusMenu-btn_close">Отменить</span>
            <span @click="updateStatus">Готово</span>
          </div>
          <!-- menu content -->
          <div class="mb-4 border-t text-md pt-2">
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
      <div v-if="dealPaidMenu" class="w-full fixed bottom-0 left-0 flex items-center justify-center flex-col pb-0 z-20" :class="{ shading_background: dealPaidMenu}" @click="closeDealPaidMenu">
        <!-- menu -->
        <div class="bg-light-grey bottom-0 border-t w-full fixed  rounded-t-3xl">
          <!-- menu header -->
          <div class="text-blue text-sm flex items-center place-content-between p-4 deal-status-menu">
            <span class="dealStatusMenu-btn_close">Отменить</span>
            <span @click="updateDealPaid">Готово</span>
          </div>
          <!-- menu content -->
          <div class="mb-6 border-t text-sm pt-2">
            <!-- debt value -->
            <div class="flex place-content-between mt-2 items-center px-6">
              <p class="text-dark-gray">Долг по делу (RUB)</p>
              <p @click="copyDebtValue" class="text-blue border-b border-dashed border-blue text-lg mr-1">{{debt(dealPaid.totalDealValue, dealPaid.currentDealPaid)}}</p>
            </div>
            <!-- make payment value input -->
            <div class="px-4 mt-4">
              <div class="flex place-content-between border mb-4 items-center p-2 rounded-md">
                <label for="makePayment" class="leading-none align-text-middle text-blue">Укажите сумму пополнения (RUB)</label>
                <div class="subject-price_value">
                  <input id="makePayment" type="number" placeholder="0.00" inputmode="decimal" v-model="makePayment" class="focus:outline-none bg-transparent text-lg text-dark text-right mx-1 pt-1 w-20">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deal With Debt notify wrapper -->
      <div v-if="dealWithDebt" class="w-full fixed bottom-0 left-0 flex items-center justify-center flex-col pb-0 z-20" :class="{ shading_background: dealWithDebt}" @click="closeDealWithDebtMenu">
        <!-- content -->
        <div class="mx-6 text-dark bg-light-grey inset-x-2/4 border-t rounded-2xl p-4">
          <div class="text-center border-b pb-4"> 
            <p>По данному делу имеется долг</p>
            <!-- Финансовый долг -->
            <div>
             <p class="text-2xl text-blue my-2">{{statusDeal.debtValue}} (RUB)</p>
            </div>
            <!-- Долг по возврату атрибутов -->
            <div>

            </div>
            <p class="text-sm text-dark-gray">Мы не можем завершить дело пока долг не будет погашен, поэтому помещаем в статус "Долг"</p>
          </div>
          <p class="w-full text-blue text-center mt-4 dealStatusMenu-btn_close">Ок</p>
        </div>
      </div>

      <!-- Deal Cancelled Reason Menu wrapper -->
      <div v-if="dealCancelledReasonMenu" class="w-full fixed bottom-0 left-0 flex items-center justify-center flex-col pb-0 z-20" :class="{ shading_background: dealCancelledReasonMenu}" @click="closeDealCancelledReasonMenu">
        <!-- content -->
        <div class="w-11/12 mx-6 text-dark bg-light-grey inset-x-2/4 border-t rounded-2xl p-4">
          <div class="text-center border-b pb-4"> 
            <div class="flex place-content-between mb-2 items-center">
              <p>Причина отмены дела</p>
              <p v-if="editCancelledReason" class="text-sm text-dark-gray">200 символов</p>
              <!-- Если режим редактирования выключен -->
              <p v-if="!editCancelledReason" @click="editCancelledReason = !editCancelledReason" class="text-sm text-blue border-b border-dashed border-blue">Редактировать</p>
            </div>

            <div class="text-dark-gray text-left" v-if="!editCancelledReason" >
              <p v-if="сancelledDeal.cancelledReason === ''">Причина не указана</p>
              {{сancelledDeal.cancelledReason}}
            </div>

            <textarea required v-if="editCancelledReason" placeholder="Укажите причину" v-model="dealCancelledReason" inputmode="text" maxlength="200" class="mt-2 h-fit bg-light-grey text-gray-500 rounded-md w-full focus:outline-none h-36"></textarea>
          </div>
           <p v-if="!editCancelledReason" class="w-full text-blue text-center mt-4 dealStatusMenu-btn_close">Ок</p>
           <p @click="updateCancelledReason" v-if="editCancelledReason" class="w-full text-blue text-center mt-4 dealStatusMenu-btn_close">Сохранить</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue';
import QuickAccessMenu from '../components/QuickAccessMenu.vue'
import Spinner from '../components/Spinner.vue';

import { ref, onMounted} from 'vue';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

import { getContactInfo } from '../supabase/getContactInfoFromDB';
import { getDeals, getDealStatus } from '../supabase/getDealsFromDB';

import { showNameByID } from '../helpers/compareNameByID';
import { translateDealType, translateDealStatus } from '../helpers/translators';

export default {
  name: "Deals",
  components: {
    Navigation, QuickAccessMenu, Spinner
  },
  setup() {
    // Create data / vars
    const list = ref([]);
    const dataLoaded = ref(null);
    const statusMsg = ref(null);
    const errorMsg = ref(null);
    // Spiner data
    const spinner = ref(false);
    // Значение долга
    const debtValue = ref('');
    // Значение сколько мы хотим оплатить
    const makePayment = ref('');
    // deal status menu
    const dealStatusMenu = ref(false);
    // Помещаем сюда current статус выбранного дела
    const statusDeal = ref('')
    // Открытие Закрытие меню внесения оплаты
    const dealPaidMenu = ref(false);
    // Помещаем сюда current статус выбранного дела
    const dealPaid = ref('')
    // Забирает value из выбранно чекбокса (по умолчанию ставим "В процессе")
    const setDealStatus = ref('deal-in-process');
    // Дергаем названия из роута
    const router = useRouter();
    const pageTitle = router.currentRoute._value.meta.translation;
    // Дело с долгом
    const dealWithDebt = ref(false);
      
    onMounted(() => {
      spinner.value = true;
      getDeals(list, dataLoaded, errorMsg);
    })

    // deal status menu toggle
    // Забираем у текущего дела id и значение статуса 
    const dealStatusMenuToggle = (currentDealID, currentDealStatus, currentDealPaid, totalDealValue, cancelledReason, currentDealsList) => {
      dealStatusMenu.value = !dealStatusMenu.value;
      
      const currentDeal = {
        currentDealID: currentDealID,
        currentDealStatus: currentDealStatus,
        currentDealPaid: currentDealPaid,
        totalDealValue: totalDealValue,
        debtValue: (totalDealValue - currentDealPaid).toFixed(2),
        cancelledReason: cancelledReason,
        dealsList: currentDealsList
      }
      // console.log(currentDeal)
      // console.log(currentDeal.debtValue > 0)
      return statusDeal.value = currentDeal
    }

    // make payment menu toggle
    // Забираем у текущего дела id, сколько уже оплачено и total заказа
    const makePaymMenuToggle = (currentDealID, currentDealPaid, totalDealValue) => {
      dealPaidMenu.value = !dealPaidMenu.value;
      
      const currentDeal = {
        currentDealID: currentDealID,
        currentDealPaid: currentDealPaid,
        totalDealValue: totalDealValue,
        debtValue: (totalDealValue - currentDealPaid).toFixed(2)
      }

      // console.log(currentDeal)
      return dealPaid.value = currentDeal;
    }

    
    // По клику копируем величину долга по делу в значение сколько хотим оплатить
    const copyDebtValue = () => {
      makePayment.value = dealPaid.value.debtValue;
    }

    // Шаблон отображения цены оплаченной
    const dealPaidValuePattern = (dealPaid) => {
      const changedDealPaid = +dealPaid;
      return changedDealPaid.toFixed(2);
    }


    // Закрываем DealStatusMenu, нажимая по фону
    const closeDealStatusMenu = (e) => {
      if (e.target.classList.contains('shading_background') || e.target.classList.contains('dealStatusMenu-btn_close')) {
          dealStatusMenu.value = !dealStatusMenu.value;
          debtValue.value = '';
      }
    }

    // Закрываем DealPaidMenu, нажимая по фону
    const closeDealPaidMenu = (e) => {
      if (e.target.classList.contains('shading_background') || e.target.classList.contains('dealStatusMenu-btn_close')) {
          dealPaidMenu.value = !dealPaidMenu.value;
          makePayment.value = '';
          debtValue.value = '';
      }
    }

    // Закрываем DealPaidMenu, нажимая по фону
    const closeDealWithDebtMenu = (e) => {
      if (e.target.classList.contains('shading_background') || e.target.classList.contains('dealStatusMenu-btn_close')) {
          dealWithDebt.value = !dealWithDebt.value;
      }
    }

    // Ждем когда загрузится вся data
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
      // Когда хотим сменить статус на "Завершен" делу с долгом...
      if(deal.debtValue > 0 && deal.currentDealStatus === 'deal-complete') {
        deal.currentDealStatus = 'deal-in-debt';
        // Открываем notify
        dealWithDebt.value = !dealWithDebt.value;
        // Перемещаем во вкладку deal-in-debt
        // setDealStatus.value = "deal-in-debt"
        // console.log(dealWithDebt.value)
        dealStatusArray.value = []
        // list.value = []

        const currentSubjectDealsList = deal.dealsList 
        currentSubjectDealsList.forEach(item => {
          if(item.additionalAttributes.length > 0) {
            console.log(item.additionalAttributes)
          } else {
            console.log('Нет атрибутов')
          }
        })
      } 
      // Если финансовых долгов нет, но есть не возврат атрибутов
      // if () {
      //   deal.currentDealStatus = 'deal-in-debt';
      //   // Открываем notify
      //   dealWithDebt.value = !dealWithDebt.value;
      // "isRent": true,
      // "isReturned": false
      // }
      // Когда хотим сменить статус на "Отменен"
      if(deal.currentDealStatus === 'deal-cancelled') {
        //Открываем deal cancelled reason menu
        dealCancelledReasonMenu.value = !dealCancelledReasonMenu.value;
        // Перемещаем во вкладку deal-cancelled
        // setDealStatus.value = "deal-cancelled";
        //
        editCancelledReason.value = !editCancelledReason.value
      }
      // Если возвращаем из отмененных, надо убрать причины отказа
      if(deal.currentDealStatus !== 'deal-cancelled') {
        // console.log(deal.currentDealID)
        // console.log(deal.cancelledReason)
        dealCancelledReason.value = '';
        сancelledDeal.value = '';
        // const emptyCancelledReason = ''
        try {
          const { error } = await supabase.from('deals').update({
            cancelledReason: dealCancelledReason.value
          }).eq('id', deal.currentDealID);
          if(error) throw error;

        } catch (error) {
          errorMsg.value = `Error: ${error.message}`;
          setTimeout(() => {
            errorMsg.value = false;
            console.warn(error.message);
          }, 5000);
        }
        
      }

      // Обновляем данные в БД
      try {
        const { error } = await supabase.from('deals').update({
          dealStatus: deal.currentDealStatus
        }).eq('id', deal.currentDealID);
        if(error) throw error;
        if(dealWithDebt.value === true) {
          statusMsg.value = false
        } else {
          statusMsg.value = `Статус дела #${deal.currentDealID} успешно обновлен`;
        }
        setTimeout(() => {
          statusMsg.value = false;
        }, 3000);
        
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
          console.warn(error.message);
        }, 5000);
      }
      
      dealCancelledReason.value = '';
      // Запускаем функцию получения из БД статусы всех дел
      getDealStatus(dealStatusArray, dataLoaded, errorMsg)
      //
      checkChangeStatus()
      // Run getDeals function
      getDeals(list, dataLoaded, errorMsg);
 
      // console.log(deal.currentDealID)
      // console.log(deal.currentDealStatus)
    }

    // Обновляем в БД внесенную сумму по делу 
    const updateDealPaid = async () => {
      dealPaidMenu.value = !dealPaidMenu.value
      const totalPaid = +dealPaid.value.currentDealPaid + +makePayment.value;

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
        // Run getDeals function
        getDeals(list, dataLoaded, errorMsg);
        spinner.value = !spinner.value;
      }, 1000)
      spinner.value = !spinner.value;
      makePayment.value = ''
      debtValue.value = ''
    }


    // Шаблон отображения цены задолженности
    const debt = (totalDealValue, currentDealPaid) => {
      const debt = (totalDealValue -  currentDealPaid).toFixed(2);
      debtValue.value = debt;
      return debt;
    }

    // Меняем цвета кнопки завершенных и отмененных дел
    const dealStatusClassObject = (dealStatus) => {
      if(dealStatus === 'deal-cancelled') {
        return {
          'deal-cancelled': true,
          'text-cancel' : dealStatus === 'deal-cancelled',
        }
      }
      if(dealStatus === 'deal-complete') {
        return {
          'deal-completed': true,
          'text-green' : dealStatus === 'deal-complete'
        }
      }
      if(dealStatus === 'deal-in-debt') {
        return {
          'deal-in-debt': true,
          'text-danger' : dealStatus === 'deal-in-debt'
        }
      }
    }

    // причина отмены
    const dealCancelledReason = ref('');
    const сancelledDeal = ref('');

    // меню указания причины омтены дела
    const dealCancelledReasonMenu = ref(false);

    // Закрываем dealCancelledReasonMenu, нажимая по фону
    const closeDealCancelledReasonMenu = (e) => {
      if (editCancelledReason.value === false && (e.target.classList.contains('shading_background') || e.target.classList.contains('dealStatusMenu-btn_close'))) {
          dealCancelledReasonMenu.value = !dealCancelledReasonMenu.value;
      }
      // Если режим редактирования причины true, то по фону закрыть не получится
      if (editCancelledReason.value === true && e.target.classList.contains('dealStatusMenu-btn_close')) {
        dealCancelledReasonMenu.value = !dealCancelledReasonMenu.value;
      }
    }

    // deal Cancelled Reason Menu Toggle
    // Забираем у текущего дела id и причину отмены дела
    const openCancelledReasonMenu = (currentDealID, cancelledReason) => {
      dealCancelledReasonMenu.value = !dealCancelledReasonMenu.value;
      
      const currentDeal = {
        currentDealID: currentDealID,
        cancelledReason: cancelledReason,
      }

      dealCancelledReason.value = cancelledReason

      return сancelledDeal.value = currentDeal;
    }

    // Режим редактирования причины отмены дела
    const editCancelledReason = ref(false)

    // id дела приходящий из разных функций (из функции изменения статуса, из функции редактирования причины омтены дела)
    const id = ref(undefined);

    // Обновляем инфу по причине отмены дела
    const updateCancelledReason = async () => {
      editCancelledReason.value = !editCancelledReason.value;
      // из statusDeal
      if (statusDeal.value.currentDealID === undefined) {
        id.value = +сancelledDeal.value.currentDealID
      }
      // из сancelledDeal
      if (сancelledDeal.value.currentDealID === undefined) {
        id.value = +statusDeal.value.currentDealID
      }
      // Обновляем данные в БД
      try {
        const { error } = await supabase.from('deals').update({
          cancelledReason: dealCancelledReason.value
        }).eq('id', id.value);
        if(error) throw error;
        // Надо ли какой-то статус месдж
        // statusMsg.value = `Статус дела #${deal.currentDealID} успешно обновлен`;
        spinner.value = !spinner.value;
        setTimeout(() => {
          statusMsg.value = false;
          spinner.value = !spinner.value

        }, 1000);
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
          console.warn(error.message);
        }, 5000);
      }
      сancelledDeal.value = '',
      statusDeal.value = ''

      getDeals(list, dataLoaded, errorMsg);
      // console.log(id.value)
      // console.log(dealCancelledReason.value)
    }

    // Разворачиваем / сворачиваем конкретное дело
    const isExpend = ref(false);
    const expendDeal = (index) => {
      !list.value[index].isExpend ? list.value[index].isExpend = !isExpend.value : list.value[index].isExpend = isExpend.value;
    }

    // Проверяем выбрани ли атрибуты у предмета заказа
    const checkRentAttr = (item) => {
      if(item.additionalAttributes.length > 0) {
        // Если атрибут выбран
          return true
      } else  if (item.additionalAttributes.length === 0){
        // Если атрибутов в принципе не выбрано
        // console.log('без атрибутов')
        return false;
      }
      
    }

    return {
      list, setDealStatus, dataLoaded, pageTitle, executionDatesArray, translateDealType, translateDealStatus, showEventDate, daysArray, contactInfo, getNameId, checkChangeStatus, dealStatusArray, getDealStatus, getStatusArrLength, dealStatusList, spinner, dealStatusMenu, dealStatusMenuToggle, closeDealStatusMenu, statusDeal, updateStatus, statusMsg, errorMsg, dealPaid, makePaymMenuToggle, updateDealPaid, dealPaidMenu, closeDealPaidMenu, debt, debtValue, makePayment, copyDebtValue, dealPaidValuePattern, dealWithDebt, closeDealWithDebtMenu, dealStatusClassObject, dealCancelledReason, dealCancelledReasonMenu, closeDealCancelledReasonMenu, openCancelledReasonMenu, editCancelledReason, updateCancelledReason, сancelledDeal, id, expendDeal, isExpend, checkRentAttr
    };
  },
};
</script>

<style scoped>
  .container {
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

  input[type="radio"]:checked + label.deal-completed {
    background:#78D86F;
  }

  input[type="radio"]:checked + label.deal-cancelled {
    background:#E7B102;
  }

  input[type="radio"]:checked + label.deal-in-debt {
    background:#FF8B8B;
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

  input[type="radio"] + label.deal-in-debt .deal-filter-item_count{
    background: #FF8B8B;
    color: #fff;
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

  input[type="radio"]:checked + label.deal-in-debt  .deal-filter-item_count {
    background: #fff;
    color: #3D3D3D;
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
    white-space: nowrap;
    color: #838383;
  }

  .zero-status_wrapper {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  .shading_background {
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

  .item_fixed {
    position: fixed;
    width: 100%;
  }

  .totalMenu-more_arrow {
    width: 17px;
    height: 17px;
    padding: 2px;
    border-radius: 100%;
  }

  .more-arrow_icon {
    width: 100%;
    height: 100%;
  }

  .more_arrow_icon_closed_menu {
    transform: rotate(270deg);
  }

  .more_arrow_icon_opened_menu {
    transform: rotate(90deg);
  }

</style>
