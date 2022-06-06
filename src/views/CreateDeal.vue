<template>
  <div class="container text-dark">

    <!-- Navigation -->
    <nav class="nav w-full bg-white fixed z-10 py-2 px-4 flex items-center justify-between">
      <h1 class="text-dark text-2xl font-bold">Новое дело</h1>
      <div @click="$router.go(-1)" class="text-blue">Отменить</div>
    </nav>

    <!-- Create New Deal -->
    <main v-if="dataLoaded" class="max-w-screen-md mx-auto px-4 pt-20">

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

      <div>
        <!-- Create -->
        <form id="create-deal" v-if="user" @submit.prevent="createDeal" class="flex flex-col items-center pt-0">
  


          <!-- set deal information inputs -->
          <div class="w-full mb-32" :class="{deal_information_inputs:totalDealMenu}">

            <!-- С кем заключается дело (Укажите контакт) -->
            <div class="w-full">
              <!-- В качестве примера взято https://github.com/moreta/vue-search-select/blob/master/src/lib/BasicSelect.vue -->
              <label for="searchedContacts" class="ml-2 text-sm text-blue">Укажите контакт</label>
              <div class="search-input mt-1 px-2 h-10 flex items-center border" @click="openOptions" @focus="openOptions">
                <input 
                  @focus.prevent="openOptions"
                  required
                  autocomplete="off"
                  id="searchedContacts"
                  class="text-dark-gray outline-none w-full focus:outline-none bg-light-grey" 
                  type="search"
                  placeholder="Поиск..."
                  v-model="search"
                  @blur="blurInput"
                >
              </div>
              <div class="relative">
                <div v-if="showSearchMenu" class="dropdown-menu absolute top-0 left-0 h-40 bg-light-grey w-full py-2 rounded-b-md text-lg">
                  <!-- Список из справочника контактов -->
                  <div 
                    v-for="(option, index) in filteredOptions" 
                    :key="index" 
                    @click.prevent="selectItem(option)" 
                    class="dropdown-menu_item px-2 py-1"
                  >
                    <div>
                      {{option.contactInfo.surname}} {{option.contactInfo.name}}
                    </div>
                    <div class="text-xs text-dark-gray">
                      {{option.contactInfo.company}}
                    </div>
                  </div>
                  <!-- Если из справочника ничего не найдено -->
                  <div v-if="filteredOptions.length <= 0" @click.prevent="selectAnon()">
                    <div class="px-2 text-xs text-dark-gray">Ничего не найдено. Выберите:</div>
                    <div class="px-2 py-1 text-blue">Неизвестный</div>
                    <div class="px-2 mt-2 text-xs text-dark-gray">Или добавьте новый контакт в справочник</div>
                    <router-link 
                      class="bg-green text-white text-center webkit block mx-2 rounded-md mt-2 p-2"
                      :to="{ name: 'CreateContact' }"
                    >
                      Добавить
                    </router-link>
                  </div>
                  <!-- Если в справочнике есть даже, всеравно будет удобная возможность-->
                  <div v-if="filteredOptions.length > 1" @click.prevent="selectAnon()">
                    <div class="px-2 py-1">Неизвестный</div>
                  </div>
                </div>
    
              </div>
            </div>
    
            <!-- Укажите дату и время исполнения дела -->
            <div class="w-full mt-4">
              <label for="executionDate" class="ml-2 text-sm text-blue">Бронь даты и времени</label>
              <div class="search-input mt-1 h-10 flex items-center border">
                <input 
                  type="datetime-local" 
                  name="execution-date" 
                  id="executionDate"
                  class="webkit w-full text-gray-500 p-2 outline-none focus:outline-none bg-light-grey" 
                  v-model="executionDate"
                >
              </div>
            </div>
            
            <!-- Тип дела -->
            <div class="w-full flex flex-col mt-4">
              <label for="deal-type" class="mb-1 ml-2 text-sm text-blue">Тип дела</label>
              <select 
                id="deal-type" 
                class="border webkit p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none" 
                required
                v-model="typeOfDeal"
                @change="dealTypeChanged"
              >
              <!-- Возможно , в дальнейшем динамическое, исходя из настроек аккаунта -->
                <option disabled value="select-deal-type">Выберите тип дела</option>
                <option value="order">Заказ</option>
                <option value="supply">Поставка</option>
                <option value="personal">Личное</option>
              </select>
            </div>
    
            <!-- Настройки нового дела -->
            <div class="w-full">
    
              <!-- Если новое дело - это заказ -->
              <div v-if="typeOfDeal === 'order'" class="radio-toolbar mt-4">
                <!-- Выбор предмета заказа -->
                
                <!-- Если ниодного предмета нет в заказе -->
                <div v-if="user && !dealsList.length" class="w-full flex place-content-between px-2">
                  <p class="text-dark-gray text-sm">0 предметов в заказе</p>
                  <p class="text-blue" @click="addOrderSubject">Добавить</p>
                </div>

                <!-- Предметы заказа -->
                <div>
                  <div v-for="(subject, idx) in dealsList" :key="idx" class="flex subject-wrapper">
                    <!-- Add subject to dealList -->
                    <div class="flex flex-col w-full mb-2">
                      <!-- header -->
                      <div class="flex place-content-between">
                        <!-- title -->
                        <p class="ml-2 align-text-middle text-sm text-dark-gray">Предмет заказа</p>
                        <!-- Delete current order subject -->
                        <div class="icon-wrapper">
                          <img 
                            @click="deleteOrderSubject(subject.id)"
                            class="cursor-pointer" 
                            src="@/assets/images/common/icon-trash.svg" 
                            alt="">
                        </div>
                      </div>
    
                      <!-- list of order subjects -->
                      <div class="flex radio-toolbar-wrapper mt-2">
                        <div class="radio-toolbar_item" v-for="(item, index) in assortmentList" :key="index">
                          <input 
                            type="radio"
                            :value="item.name"
                            :name="idx"
                            v-model="subject.selectedProduct"
                            :id="idx+' '+index"
                          >
                          <label :for="idx+' '+index">
                            <div class="radio-toolbar_item-img">
                              <img :src="require(`../assets/images/deals/orders/${item.img}`)" alt=""> 
                            </div>
                            <div class="radio-toolbar_item-title text-center text-xs text-dark-gray mt-2">{{ item.title }}</div>
                          </label>
    
                        </div>
                      </div>
    
                      <!-- Price per unit -->
                      <div class="flex place-content-between mx-2 mb-4 mt-2 items-center">
                        <label for="pricePerUnit" class="text-sm leading-none align-text-middle text-dark-gray">
                          Цена за 1 шт. (RUB)
                        </label>
                        <div class="subject-price_value">
                          <input 
                            id="pricePerUnit"
                            type="number" 
                            inputmode="decimal"
                            class="focus:outline-none text-dark text-right mx-1 pt-1 w-16" 
                            placeholder="0,00"
                            v-model="subject.pricePerUnit" 
                          >
                        </div>
                      </div>
    
                      <!-- Change subject (product) quantity  -->
                      <div class="flex place-content-between ml-2 mb-4 mt-2 items-center">
                        <span class="text-sm leading-none align-text-middle text-dark-gray">
                          Количество, шт.
                        </span>
                        <div class="subject-quantity flex justify-items-center">
                          <button 
                            @click.prevent="if(subject.productQuantity > 1) subject.productQuantity--;"
                            class="subject-quantity_btn"
                            :class="{ btn_disabled: subject.productQuantity < 2 }"
                          >
                            -
                          </button>

                          <input type="number" class="subject-quantity leading-none w-8 text-center focus:outline-none" v-model="subject.productQuantity">
                          <button 
                            class="subject-quantity_btn"
                            @click.prevent="subject.productQuantity++"
                          >
                            +
                          </button>
                        </div>
    
                      </div>
    
                      <!-- discount for subject price -->
                      <div class="flex place-content-between ml-2 mb-4 mt-4 items-center">
                        <span class="text-sm leading-none align-text-middle text-dark-gray">
                          Скидка, {{subject.discountSubjectPriceValue}}%
                        </span>
                          <input 
                            type="range" 
                            class="focus:outline-none w-36" 
                            placeholder="0"
                            v-model="subject.discountSubjectPriceValue"
                            :min="setDiscountRange('min')"
                            :max="setDiscountRange('max')"
                            step="1"
                          >
                      </div>  
    
                      <!-- Total subject price -->
                      <div class="flex place-content-between mx-2 mb-4 mt-4 items-center">
                        <span class="text-sm leading-2 align-text-middle text-dark-gray">
                          За {{subject.productQuantity}} шт. 
                          <span v-if="subject.discountSubjectPriceValue > 0">с учетом скидки</span>
                          (RUB)
                        </span>
                        <div>
                          <span 
                            class="py-2"
                          >
                            {{(subject.totalSubjectPrice = (subject.pricePerUnit * subject.productQuantity * (1 - subject.discountSubjectPriceValue/100))).toFixed(2)}}
                          </span>
                          
                        </div>
                      </div>
    
                      <!-- Subjet notes -->
                      <div class="w-full mt-2">
                        <textarea placeholder="Заметки к предмету заказа" v-model="subject.productNote" class="text-sm h-20 p-2 bg-light-grey text-gray-500 rounded-md w-full focus:outline-none"></textarea>
                      </div>

                      <!-- Set additional attributes -->
                      <div>
                        123
                      </div>
                    </div>
    
    
                  </div>
                </div>
    
                <!-- Button to add new social to current contact -->
                <button 
                  v-if="dealsList.length"
                  @click="addOrderSubject"
                  type="button"
                  class="border border-blue w-full p-2 rounded-md text-blue cursor-pointer"
                >
                  Добавить предмет
                </button>
              </div>
    
              <!-- Если новое дело - это поставка -->
              <div v-if="typeOfDeal === 'supply'">
                Новое дело - поставка. В разработке...
              </div>
    
              <!-- Если новое дело - это личное -->
              <div v-if="typeOfDeal === 'personal'">
                Новое дело - личная задача. В разработке..
              </div>
            </div>

            <!-- set deal Status -->
            <div class="w-full flex flex-col mt-4">
              <label for="deal-status" class="mb-1 ml-2 text-sm text-blue">Статус дела</label>
              <select 
                id="deal-status" 
                class="border webkit p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none" 
                required
                v-model="dealStatus"
              >
                <option v-for="(item, index) in dealStatusList" :key="index" :value="item.name">{{ item.title }}</option>

              </select>
            </div>

            <!-- Внести оплату (dealPaid) -->
            <div class="w-full flex flex-col mt-4">
              <p class="mb-1 ml-2 text-sm text-blue">Предоплата (RUB)</p>
              <div class="flex place-content-between border mb-4 items-center p-2 rounded-md">
                <label for="dealPaid" class="text-sm leading-none align-text-middle text-dark-gray">
                  Впишите сумму
                </label>
                <div class="subject-price_value">
                  <input 
                    type="number" 
                    id="dealPaid"
                    inputmode="decimal"
                    class="focus:outline-none text-dark text-right mx-1 pt-1 w-16" 
                    placeholder="0,00"
                    v-model="dealPaid" 
                  >
                </div>
              </div>
              
            </div>
            <!-- Для input -->
            <!-- pattern="[0-9]+([\.,][0-9]+)?" step="0.01" -->

          </div>
          

          <!-- total menu wrapper -->
          <!-- Может имеет смысл сделать компонентом? -->
          <div
            v-if="dealsList.length !== 0"
            class="w-full fixed bottom-0 left-0 flex items-center  justify-center flex-col pb-0 z-20"
            :class="{ totalMenu_wrapper:totalDealMenu }"
            @click="totalDealMenuClose"
          >
            <!-- Total Menu -->
            <div class="bg-light-grey bottom-0 border-t w-full fixed  rounded-t-3xl" :class="{ totalMenu:totalDealMenu }">

              <!-- Header -->
              <div class="flex items-center place-content-between px-4 mt-2">
                <!-- Sum Deal Value -->
                <div class="ml-2">
                  <div class="text-xs text-dark-gray">
                  Общая сумма дела: 
                  </div>
                  <div class="text-xl">
                    {{sum()}} руб.
                  </div>
                </div>
      
                <!-- btn to open total Deal Menu -->
                <div @click="showTotalDealMenu">
                  <div class="flex items-center mr-2">
                    <div v-if="totalDealMenu === false" class="text-sm text-blue mr-2">Подробнее</div>
                    <div v-if="totalDealMenu === true" class="text-sm text-blue mr-2">Скрыть</div>
                    <div class="totalMenu-more_arrow">
                      <img 
                        class="more-arrow_icon" 
                        src="../assets/images/common/arrow-right.svg"
                        :class="[{ more_arrow_icon_opened_menu: totalDealMenu === true }, {more_arrow_icon_closed_menu: totalDealMenu === false}]" 
                        alt="">
                    </div>
                  </div>
                </div>
              </div>
      
              <!-- Deal Sum Details -->
              <div v-if="totalDealMenu && typeOfDeal === 'order'" class="deal-details px-4 border-t mt-2">
                {{dealsList}}


                <p>Статус дела: {{dealStatus ? dealStatus : 'не выбран'}}</p>
                <p>Остаток к уплате: {{sum() - dealPaid}}</p>
                <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                                <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Конец строки: 1579,00 руб.</p>  
              </div>

              <!-- Btn submit -->
              <div class="mx-4">
                <button 
                  type="submit" 
                  class="w-full my-4 cursor-pointer p-2 bg-dark text-white rounded-md font-normal"
                >
                  Создать дело
                </button>
              </div>

            </div>

          </div>

        </form>

      </div>
      
    </main>
  </div>
  
</template>

<script>
import { ref, computed } from 'vue';
import store from '../store/index';
import { uid } from 'uid';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

import { getContactInfo } from '../supabase/getContactInfoFromDB';

import { sortAlphabetically } from '../helpers/sort';
import { searchFilter } from '../helpers/filter';

export default {
  name: "createDeal",
  setup() {
    // Create data
    const router = useRouter();
    const statusMsg = ref(null);
    const errorMsg = ref(null);
    const user = computed(() => store.state.user);

    const typeOfDeal = ref('select-deal-type');
    const contactOfDeal = ref('select-deal-contact');
    const dealStatus = ref('deal-in-booking');

    const dealPaid = ref('');

    const contactInfo = ref([]);
    const dataLoaded = ref(null);

    const search = ref('');
    const executionDate = ref('');

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

    // bind contact ID from DB myContacts
    const contactId = ref('');

    // Предметы заказа
    const dealsList= ref([]);

    // show search menu
    const showSearchMenu = ref(null);

    // show sum menu
    const totalDealMenu = ref(false);

    const totalDealMenuClose = (e) => {
      if (e.target.classList.contains('totalMenu_wrapper')) {
        showTotalDealMenu()
      }
    }

    const totalDealValue = ref('');

    const showTotalDealMenu = () => {
      totalDealMenu.value = !totalDealMenu.value;
    }

    const editModeSearchMenu = () => {
      showSearchMenu.value = !showSearchMenu.value;
    }

    // Select Anon
    const selectAnon = () => {
      search.value = '';
      closeOptions();
      search.value = 'Неизвестный'
      // Если выбрали "Неизвестный" - ему проставляется id = 000
      contactId.value = '000'
    }

    // Select option
    const selectItem = (option) => {
      search.value = '';
      closeOptions();
      if (option.value === option.text) {
        search.value = option.contactInfo.surname + ' ' + option.contactInfo.name;
        // console.log(option.id)
        contactId.value = option.id;
      }
    }

    const closeOptions = () => {
      showSearchMenu.value = false;
    }

    const openOptions = () => {
      search.value = '';
      showSearchMenu.value = true;
    }

    const blurInput = () => {
      setTimeout(() => {
        closeOptions();
      }, 200)
    }

    // Получаем данные по контактам из БД
    getContactInfo(contactInfo, errorMsg, dataLoaded);

    //сортируем контакты по алфавиту
    const sortedContacts = computed(() => {       
      return sortAlphabetically(contactInfo.value)
    });

    // функция поиска контакта
    const filteredOptions = computed(() => {
      return searchFilter(sortedContacts.value, search.value)
    });

    const workoutName = ref('');
    const workoutType = ref('select-workout');
    const exercises = ref([]);

    // Add exercise
    const addExercise = () => {
      if(workoutType.value === 'strength') {
        exercises.value.push({
          id: uid(),
          exercise: '',
          sets: '',
          reps: '',
          weight: '',
        });
        return
      }
      exercises.value.push({
        id: uid(),
        cardioType: '',
        distance: '',
        duration: '',
        pace: '',
      })
    }

    // Delete exercise
    const deleteExercise = (id) => {
      if(exercises.value.length > 1) {
        exercises.value = exercises.value.filter(exercise => exercise.id !== id);
        return;
      }
      errorMsg.value = 'Error. Cannot remove, need to at least have one exercise';
      setTimeout(() => {
        errorMsg.value = false;
      }, 5000);
    }

    // Временное решение
    const assortmentList = [
      {
        name: 'cake',
        img: 'cake.png',
        title: 'Торт',
      },
      {
        name: 'wedding-cake',
        img: 'wedding-cake.png',
        title: 'Свадебный торт',
      },
      {
        name: 'cupcake',
        img: 'cupcake.png',
        title: 'Капкейк',
      },
      {
        name: 'meringue-roll',
        img: 'meringue-roll.png',
        title: 'Меренговый рулет',
      },
      {
        name: 'brownies',
        img: 'brownies.png',
        title: 'Брауни',
      },
      {
        name: 'meringue',
        img: 'meringue.png',
        title: 'Меренге (Безе)',
      },
      {
        name: 'pavlova',
        img: 'pavlova.png',
        title: 'Павлова',
      },
      {
        name: 'cake-pop',
        img: 'cake-pop.png',
        title: 'Кейк-попсы',
      },
      {
        name: 'cake-eskimos',
        img: 'cake-eskimos.png',
        title: 'Эскимошки'
      }
    ]  

    // Дополнительные услуги к основным товарам /услугам
    const additionalAttributesList = [
      {
        name: 'rent-rack',
        title: 'Аренда подставки',
        price: ''
      },
      {
        name: 'packing-box',
        title: 'Упаковочная коробка',
        price: ''
      }, 
      // Продумать вариант коробки с напитком (для капкейков, кейкпопсов, эскимошек?)
      {
        name: 'rent-tableware',
        title: 'Аренда столовых приборов',
        price: ''
      }
    ]

    // Максимально допустимую скидку (устанавливается в настройках аккаунта)
    const userDiscountRangeValue = [
      {
        name: 'min',
        value: 0
      },
      {
        name: 'max',
        value: 30
      }
    ]

    // Устанавливаем значение скидок
    const setDiscountRange = (name) => {

      if(name === 'min') {
        const value = userDiscountRangeValue[0].value
        return value
      }
      if(name === 'max') {
        const value = userDiscountRangeValue[1].value
        return value
      }
    }

    // Добавляем еще предмет заказа
    const addOrderSubject = () => {
      dealsList.value.push({
        id: uid(),
        selectedProduct: '',
        pricePerUnit: '',
        productQuantity: 1,
        discountSubjectPriceValue: setDiscountRange('min'),
        totalSubjectPrice: 0,
        productNote: ''
      })
    }

    // Total order price
    const sum = () => {
      // Берем массив данных
      let array = dealsList.value;
      // Выбираем из массива данных нужные значения
      let numbers = array.map(item => item.totalSubjectPrice)
      // Суммируем значения
      let sum = numbers.reduce( (accumulator, currentValue) => accumulator + currentValue).toFixed(2)
      // задаем значение общей стоиомсти дела
      totalDealValue.value = sum

      return sum, totalDealValue.value
    }

    // Listens for chaging of workout type input
    const workoutChange = () => {
      exercises.value = [];
      addExercise();
    }

    // Listens for changing of deal type input
    const dealTypeChanged = () => {
      dealsList.value = [];
      addOrderSubject();
    }

    // Delete current order subject'
    const deleteOrderSubject = (id) => {
      if(dealsList.value.length > 0) {
        dealsList.value = dealsList.value.filter(subject => subject.id != id);
        return;
      }
    }

    // Create deal
    const createDeal = async () => {
      try {
        const { error } = await supabase.from('deals').insert([
          {
            dealType: typeOfDeal.value,
            dealStatus: dealStatus.value,
            contactID: contactId.value,
            executionDate: executionDate.value,
            dealsList: dealsList.value,
            totalDealValue: totalDealValue.value,
            dealPaid: dealPaid.value
          }
        ]);
        if (error) throw error;
        statusMsg.value = 'Дело успешно создано';
        typeOfDeal.value = 'select-deal-type';
        contactOfDeal.value = 'select-deal-contact';
        dealsList.value = [];
        setTimeout(() => {
          statusMsg.value = false;
          // В идеале переходить к только что созданному делу
          router.push({ name: 'Deals' });
        }, 3000)
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000)
      }
    }

    // Create workout
    const createWorkout = async () => {
      try {
        const { error } = await supabase.from('workouts').insert([
          {
            workoutName: workoutName.value,
            workoutType: workoutType.value,
            exercises: exercises.value,
          }
        ]);
        if (error) throw error;
        statusMsg.value = 'Дело успешно создано'
        workoutName.value = null;
        workoutType.value = 'select-workout';
        exercises.value = [];
        setTimeout(() => {
          statusMsg.value = false;
          // В идеале переходить к только что созданному делу
          router.push({ name: 'Deals' });
        }, 3000)

      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000)
      }
    }

    return {
      typeOfDeal, dealStatus, contactOfDeal, contactInfo, dataLoaded, sortedContacts,filteredOptions, search, workoutName, workoutType, exercises, statusMsg, errorMsg, user, addExercise, workoutChange, deleteExercise, createDeal, createWorkout, editModeSearchMenu, selectItem, openOptions, showSearchMenu, blurInput, selectAnon, dealsList, addOrderSubject, assortmentList, deleteOrderSubject, dealTypeChanged, showTotalDealMenu, totalDealMenu, additionalAttributesList, userDiscountRangeValue, sum, totalDealValue, executionDate, totalDealMenuClose, setDiscountRange, dealStatusList, dealPaid
    };
  },
};
</script>

<style lang="scss" scoped>
  .container {
    height: 100vh;
  }
  .webkit {
    -webkit-appearance:none;
  }

  .nav {
    height: 76px;
    padding: 0.5rem 1rem;
  }
  .search-input {
    border-radius: 5px;
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
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  .dropdown-menu {
    overflow: scroll;
    top: -3px;
  }

  .radio-toolbar-wrapper {
    overflow-x: scroll;
    padding: 10px 0;
    -ms-overflow-style: none;
    // scrollbar-width: none;
  }

  .radio-toolbar-wrapper::-webkit-scrollbar {
      width: 0;
      height: 0;
  }

  .radio-toolbar_item {
    margin-left: 15px;
  }

  .radio-toolbar_item:first-child {
    margin-left: 0;
  }

  .radio-toolbar_item label {
    background-color: #f1f1f1;
    border-radius: 100%;
  }

  .radio-toolbar_item-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin: 0 auto;
    background-color: #f1f1f1;
    border-radius: 100%;
  }

  .radio-toolbar_item-img img {
    width: 80%;
    height: 80%;
  }

  input[type="radio"] {
    display: none;
  }

  input[type="radio"]:checked + label .radio-toolbar_item-img {
    background: #4785E7;
    border-radius: 100%;
  }

  input[type="radio"]:checked + label .radio-toolbar_item-title {
    color: #4785E7;
  }

  .subject-quantity_btn {
    width: 32px;
    height: 32px;
    background-color: #4785E7;
    color: white;
    border-radius: 100%;
  }

  .subject-quantity {
    align-items: center;
  }

  .btn_disabled {
    background-color: #f1f1f1;
  }

  .subject-wrapper {
    border-bottom: 1px solid #f1f1f1;
    margin-top: 10px;
  }

  .subject-price_value {
    border-bottom: 1px dashed #f1f1f1;
  }

  .subject-wrapper:last-child {
    border-bottom: none;
  }

  .totalMenu {
    height: 70vh;
    background: #f1f1f1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .totalMenu_wrapper {
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
  }

  .deal-details {
    height: 100%;
    overflow-y: scroll;
  }

  .deal_information_inputs {
    position: fixed;
    padding: 0 1rem;
  }

  .totalMenu-more_arrow {
    width: 17px;
    height: 17px;
    padding: 2px;
    // background-color: white;
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

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 50%;
  }

  // Chrome, Safari, Opera, and Edge Chromium
  input[type="range"]::-webkit-slider-runnable-track {
    background: #D8E7FF;
    height: 0.5rem;
    border-radius: 10px;
  }

  // Firefox
  input[type="range"]::-moz-range-track {
    background: #D8E7FF;
    height: 0.5rem;
    border-radius: 10px;
  }

  // Thumb Styles
  // Chrome, Safari, Opera, and Edge Chromium
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -12px; /* Centers thumb on the track */
    background: url('../assets/images/deals/orders/brownies.png');
    background-color: #4785E7;
    height: 32px;
    width: 32px;  
    border-radius: 50%;  
  }

  // Firefox
  input[type="range"]::-moz-range-thumb {
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0; /*Removes default border-radius that FF applies*/
    background-color: #4785E7;
    height: 32px;
    width: 32px;  
    border-radius: 50%; 
  }

  input[type="range"]:focus {
    outline: none;
  }


  /***** Chrome, Safari, Opera, and Edge Chromium *****/
  //input[type="range"]:focus::-webkit-slider-thumb {
  //  border: 1px solid #053a5f;
  //  outline: 3px solid #053a5f;
  //  outline-offset: 0.125rem;
  //}

  /******** Firefox ********/
  //input[type="range"]:focus::-moz-range-thumb {
  //  border: 1px solid #053a5f;
  //  outline: 3px solid #053a5f;
  //  outline-offset: 0.125rem;     
  //}


</style>
