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

      <!-- Create -->
      <form id="create-deal" v-if="user" @submit.prevent="createDeal" class="flex flex-col items-center pt-0">
      <!-- Информационное табло по заказу -->
      <!-- Пока общее под order|supply|personal -->
      <!-- Может имеет смысл сделать компонентом? -->
      <div
        v-if="dealsList.length !== 0"
        class="w-full fixed bottom-0 left-0 bg-blue flex items-center justify-center flex-col rounded-t-3xl px-4 pb-0"
      >
        <div @click="showSumMenuFunc">X</div>

        <div v-if="showSumMenu">
          <p>Оплачено: 1000,00 руб.</p>
          <p>Задолженность: 1579,00 руб.</p>  
        </div>

        <p>Общая сумма: {{sum()}} руб.</p>

        <button 
          type="submit" 
          class="w-full my-4 cursor-pointer p-2 bg-dark text-white rounded-md font-normal"
        >
          Создать дело
        </button>

      </div>
        <!-- С кем заключается дело -->
        <div class="w-full">
          <!-- В качестве примера взято https://github.com/moreta/vue-search-select/blob/master/src/lib/BasicSelect.vue -->
          <label for="searchedContacts" class="ml-2 text-sm text-dark-gray">Укажите контакт</label>
          <div class="search-input mt-1 px-2 h-10 flex items-center" @click="openOptions" @focus="openOptions">
            <input 
              @focus.prevent="openOptions"
              required
              autocomplete="off"
              id="searchedContacts"
              class="search-input_input text-gray-500 outline-none w-full focus:outline-none bg-light-grey" 
              type="search"
              placeholder="Поиск..."
              v-model="search"
              @blur="blurInput"
            >
          </div>
          <div class="relative">
            <div v-if="showSearchMenu" class="dropdown-menu absolute top-0 left-0 bg-light-grey w-full py-2 rounded-b-md text-lg">
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
                <div class="px-2 py-1">Неизвестный</div>
                <div class="px-2 mt-2 text-xs text-dark-gray">Или добавьте новый контакт в справочник</div>
                <router-link 
                  class="bg-green text-white text-center webkit block mx-2 rounded-md mt-2 p-2"
                  :to="{ name: 'CreateContact' }"
                >
                  Добавить
                </router-link>
              </div>
            </div>

          </div>
        </div>
        
        <!-- Тип дела -->
        <div class="w-full flex flex-col mt-4">
          <label for="deal-type" class="mb-1 ml-2 text-sm text-dark-gray">Тип дела</label>
          <select 
            id="deal-type" 
            class="webkit p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none" 
            required
            v-model="typeOfDeal"
            @change="dealTypeChanged"
          >
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
            
            <div v-if="user && !dealsList.length" class="w-full flex place-content-between p-2">
              <p>Добавьте предмет заказа</p>
              <p class="text-blue" @click="addOrderSubject">Добавить</p>
            </div>
            <div >

              <div v-for="(subject, idx) in dealsList" :key="idx" class="flex subject-wrapper">
                <!-- Add subject to dealList -->
                <div class="flex flex-col w-full">
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
                    <div class="radio-toolbar_item" v-for="(item, index) in assortment" :key="index">
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
                    <span class="text-sm leading-none align-text-middle text-dark-gray">
                      Цена за 1 шт.
                    </span>
                    <div>
                      <input 
                        type="number" 
                        class="focus:outline-none text-dark text-right mx-1 pt-1 subject-price_value w-14" 
                        placeholder="0,00"
                        v-model="subject.pricePerUnit" 
                      >
                      <span class="py-2">руб.</span>
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
                      <!-- <span class="subject-quantity leading-none w-8 text-center">
                        {{subject.productQuantity}}
                      </span> -->
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
                  <div class="flex place-content-between mx-2 mb-4 mt-2 items-center">
                    <span class="text-sm leading-none align-text-middle text-dark-gray">
                      Скидка, %
                    </span>
                    <div>
                      <input 
                        type="number" 
                        class="focus:outline-none text-dark w-10 text-right mx-1 pt-1 subject-price_value" 
                        placeholder="0"
                        v-model="subject.discountSubjectPriceValue"
                      >
                    </div>
                  </div>  

                  <!-- Total subject price -->
                  <div class="flex place-content-between mx-2 mb-4 mt-2 items-center">
                    <span class="text-sm leading-none align-text-middle text-dark-gray">
                      Цена за {{subject.productQuantity}} шт.
                      <span v-if="subject.discountSubjectPriceValue > 0">с учетом скидки</span>
                    </span>
                    <div>
                      <span 
                        class="py-2"
                      >
                        {{(subject.totalSubjectPrice = (subject.pricePerUnit * subject.productQuantity * (1 - subject.discountSubjectPriceValue/100))).toFixed(2)}} руб.
                      </span>
                      
                    </div>
                  </div>

                  <!-- Subjet notes -->
                  <div class="w-full mt-2">
                    <textarea placeholder="Заметки к предмету заказа" v-model="subject.productNote" class="text-sm h-20 p-2 bg-light-grey text-gray-500 rounded-md w-full focus:outline-none"></textarea>
                  </div>
                </div>


              </div>

            </div>

            <!-- Button to add new social to current contact -->
            <button 
              v-if="dealsList.length"
              @click="addOrderSubject"
              type="button"
              class="border border-blue w-full p-2 rounded-md text-blue mb-4 cursor-pointer"
            >
              Добавить предмет в заказ
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

        <p>Оплачено: 1000,00 руб.</p>
        <p>Задолженность: 1579,00 руб.</p>  
        
        <button 
          type="submit" 
          class="w-full my-4 cursor-pointer p-2 bg-dark text-white rounded-md font-normal"
        >
          Создать дело
        </button>
      </form>
      




      <!-- Create -->
      <div class="mt-10 p-8 flex items-start bg-light-grey rounded-md shadow-lg">
        
        <!-- Form -->
        <form @submit.prevent="createWorkout" class="flex flex-col gap-y-5 w-full">

          <h1 class="text-2xl text-at-light-green">Record Workout</h1>

          <!-- Workout Name -->
          <div class="flex flex-col">
            <label for="workout-name" class="mb-1 text-sm text-at-light-green">Workout Name</label>
            <input 
              type="text" 
              required 
              class="p-2 text-gray-500 focus:outline-none" 
              id="workout-name"
              v-model="workoutName"
            >
          </div>

          <!-- Workout Type -->
          <div class="flex flex-col">
            <label for="workout-type" class="mb-1 text-sm text-at-light-green">Workout Type</label>
            <select 
              id="workout-type" 
              class="p-2 text-gray-500 focus:outline-none" 
              required
              @change="workoutChange"
              v-model="workoutType"
            >
              <option value="select-workout">Select Workout</option>
              <option value="strength">Strength Training</option>
              <option value="cardio">Cardio Training</option>
            </select>
          </div>

          <!-- Srength Training Inputs -->
          <div v-if="workoutType === 'strength'" class="flex flex-col gap-x-y-4"> 
            <div 
              class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" 
              v-for="(item, index) in exercises"
              :key="index"
            >
              <div class="flex flex-col md:w-1/3">
                <label for="exercise-name" class="mb-1 text-sm text-at-light-green">Exercise</label>
                <input 
                  type="text" 
                  required 
                  class="p-2 w-full text-gray-500 focus:outeline-none"
                  v-model="item.exercise"
                >
              </div>
              <div class="flex flex-col flex-1">
                <label for="sets" class="mb-1 text-sm text-at-light-green">Sets</label>
                <input 
                  type="text" 
                  required 
                  class="p-2 w-full text-gray-500 focus:outeline-none"
                  v-model="item.sets"
                >
              </div>
              <div class="flex flex-col flex-1">
                <label for="reps" class="mb-1 text-sm text-at-light-green">Reps</label>
                <input 
                  type="text" 
                  required 
                  class="p-2 w-full text-gray-500 focus:outeline-none"
                  v-model="item.reps"
                >
              </div>
              <div class="flex flex-col flex-1">
                <label for="weight" class="mb-1 text-sm text-at-light-green">Weight (LB's)</label>
                <input 
                  type="text" 
                  required 
                  class="p-2 w-full text-gray-500 focus:outeline-none"
                  v-model="item.weight"
                >
              </div>
              <img 
                src="@/assets/images/trash-light-green.png" 
                class="h-4 w-auto absolute -left-5 cursor-pointer" 
                alt=""
                @click="deleteExercise(item.id)"
              >
            </div>
              <button 
                @click="addExercise"
                type="button" 
                class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
              >
                Add Exercise
              </button>
          </div>

          <!-- Cardio Inputs -->
          <div v-if="workoutType === 'cardio'" class="flex flex-col gap-x-y-4"> 
            <div 
              class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" 
              v-for="(item, index) in exercises"
              :key="index"
            >
              <div class="flex flex-col md:w-1/3">
                <label for="cardio-type" class="mb-1 text-sm text-at-light-green">Type</label>
                <select 
                  id="cardio-type" 
                  class="p-2 w-full text-gray-500 focus:outline-none"
                  v-model="item.cardioType"
                >
                  <option value="#">Select Type</option>
                  <option value="run">Runs</option>
                  <option value="walk">Walk</option>
                </select>
              </div>
              <div class="flex flex-col flex-1">
                <label for="distance" class="mb-1 text-sm text-at-light-green">Distance</label>
                <input 
                  type="text" 
                  required 
                  class="p-2 w-full text-gray-500 focus:outeline-none"
                  v-model="item.distance"
                >
              </div>
              <div class="flex flex-col flex-1">
                <label for="duration" class="mb-1 text-sm text-at-light-green">Duration</label>
                <input 
                  type="text" 
                  required 
                  class="p-2 w-full text-gray-500 focus:outeline-none"
                  v-model="item.duration"
                >
              </div>
              <div class="flex flex-col flex-1">
                <label for="pace" class="mb-1 text-sm text-at-light-green">Pace</label>
                <input 
                  type="text" 
                  required 
                  class="p-2 w-full text-gray-500 focus:outeline-none"
                  v-model="item.pace"
                >
              </div>
              <img 
                @click="deleteExercise(item.id)"
                src="@/assets/images/trash-light-green.png" 
                class="h-4 w-auto absolute -left-5 cursor-pointer" 
                alt=""
              >
            </div>
              <button
                @click="addExercise" 
                type="button" 
                class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
              >
                Add Exercise
              </button>
          </div>

            <button 
              type="submit" 
              class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
            >
              Record Workout
            </button>
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

    const data = ref([]);
    const dataLoaded = ref(null);

    const search = ref('');

    const contactId = ref('');
    // Предметы заказа
    const dealsList= ref([]);

    // show search menu
    const showSearchMenu = ref(null);

    // show sum menu
    const showSumMenu = ref(null);

    // // list of offers
    // const onChange = (event) => {
    //   let data = event.target.value;
    //   console.log(data)
    // }

    const showSumMenuFunc = () => {
      showSumMenu.value = !showSumMenu.value;
    }

    const editModeSearchMenu = () => {
      showSearchMenu.value = !showSearchMenu.value;
    }

    // Select Anon
    const selectAnon = () => {
      search.value = '';
      closeOptions();
      search.value = 'Неизвестный'
      // В BD надо, чтобы id проставлялся, по сути это создает новый заказ, просто с неизвестным контактом... потом если надо корректируем
    }

    // Select option
    const selectItem = (option) => {
      search.value = '';
      closeOptions();
      if (option.value === option.text) {
        search.value = option.contactInfo.surname + ' ' + option.contactInfo.name;
        // console.log(option.id)
        contactId.value = option.id
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

    // Get contacts (name, surname, id) from db
    const getContactFromDB = async () => {
      try {
        const { data: myContacts, error } = await supabase.from('myContacts').select('*');
        if (error) throw error;
        data.value = myContacts;
        dataLoaded.value = true;
        // console.log(data.value)
      } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    }

    getContactFromDB();

    // Оптимизировать диублирвоание функций поиска и сортировки в КОнтактках и Создание сделки
    //сортируем контакты по алфавиту
    const sortedContacts = computed(() => {       
      const sortedArray = data.value; 
      return sortedArray.sort((a, b) => {
        let fa = a.contactInfo.surname.toLowerCase(), fb = b.contactInfo.surname.toLowerCase();
        if (fa < fb) {
          return -1;
        } 
        if (fa > fb) {
          return 1;
        }
        return 0;
      })
    });

    // функция поиска контакта
    const filteredOptions = computed(() => {
      return sortedContacts.value.filter((contact) => {
        return (
          contact.contactInfo.name.toLowerCase().indexOf(search.value.toLowerCase()) != -1 || 
          contact.contactInfo.surname.toLowerCase().indexOf(search.value.toLowerCase()) != -1 ||
          contact.contactInfo.company.toLowerCase().indexOf(search.value.toLowerCase()) != -1
          // Из каких col еще стреубется поиск? по номеру телефона? по наличию вайбера? думайте...
        )
      })
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
    const assortment = [
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

    const additionalAttributes = [
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
      {
        name: 'rent-tableware',
        title: 'Аренда столовых приборов',
        price: ''
      }
    ]

    const addOrderSubject = () => {
      dealsList.value.push({
        id: uid(),
        selectedProduct: '',
        pricePerUnit: '',
        productQuantity: 1,
        discountSubjectPriceValue: '',
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
      let sum = numbers.reduce( (accumulator, currentValue) => accumulator + currentValue)
      return sum.toFixed(2)
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
            contactID: contactId.value,
            dealsList: dealsList.value,
            // totalOrderPrice: totalOrderPrice.value
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
      typeOfDeal, contactOfDeal, data, dataLoaded, getContactFromDB, sortedContacts,filteredOptions, search, workoutName, workoutType, exercises, statusMsg, errorMsg, user, addExercise, workoutChange, deleteExercise, createDeal, createWorkout, editModeSearchMenu, selectItem, openOptions, showSearchMenu, blurInput, selectAnon, dealsList, addOrderSubject, assortment, deleteOrderSubject, dealTypeChanged, showSumMenuFunc, showSumMenu, additionalAttributes, sum 
    };
  },
};
</script>

<style lang="scss" scoped>
  .nav {
    height: 76px;
    padding: 0.5rem 1rem;
  }
  .search-input {
    // border: 1px solid #838383;
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
    margin-bottom: 20px;
  }

  .subject-price_value {
    border-bottom: 1px solid #f1f1f1;
  }

  .subject-wrapper:last-child {
    border-bottom: none;
  }

</style>
