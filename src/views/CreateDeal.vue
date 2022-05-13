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

        <!-- С кем заключается дело -->
        <div class="w-full">
          <!-- В качестве примера взято https://github.com/moreta/vue-search-select/blob/master/src/lib/BasicSelect.vue -->
          <label for="searchedContacts" class="ml-2 text-xs text-dark-gray">Укажите контакт</label>
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
          <label for="deal-type" class="mb-1 ml-2 text-xs text-dark-gray">Тип дела</label>
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
        <div class="m-2 w-full">

          <!-- Если новое дело - это заказ -->
          <div v-if="typeOfDeal === 'order'" class="radio-toolbar mt-4">
            <!-- Выбор предмета заказа -->
            
            <div v-if="user && !ordersList.length" class="w-full flex place-content-between p-2">
              <p>Добавьте предмет заказа</p>
              <p class="text-blue" @click="addOrderSubject">Добавить</p>
            </div>
            <div >

              <div v-for="(subject, idx) in ordersList" :key="idx" class="flex">
                <!-- Add subject to orderList -->
                <div class="flex flex-col w-full">
                  <!-- header -->
                  <div class="flex place-content-between">
                    <!-- title -->
                    <p class="ml-2 align-text-middle text-xs text-dark-gray">Предмет заказа</p>
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
                  <div class="flex radio-toolbar-wrapper my-2">
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
                  Укажите количество
                  <input type="number" v-model="subject.quantity">
                  
                </div>


              </div>

            </div>

            <!-- Button to add new social to current contact -->
            <button 
              v-if="ordersList.length"
              @click="addOrderSubject"
              type="button"
              class="border border-blue w-full p-2 rounded-md text-blue mb-4 cursor-pointer"
            >
              Добавить предмет заказа
            </button>
          </div>

          <!-- Если новое дело - это поставка -->
          <div v-if="typeOfDeal === 'supply'">
            Новое дело - поставка
          </div>

          <!-- Если новое дело - это личное -->
          <div v-if="typeOfDeal === 'personal'">
            Новое дело - личная задача
          </div>
        </div>

        <p class="mt-4">Общая сумма заказа: 2579,00 руб.</p>
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
    const ordersList= ref([]);

    // show search menu
    const showSearchMenu = ref(null);
    // const selectedProduct = ref('');

    // // list of offers
    // const onChange = (event) => {
    //   let data = event.target.value;
    //   console.log(data)
    // }

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
        console.log(data.value)
      } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    }

    getContactFromDB();
    

    const filteredOptions = computed(() => {
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
      }
    ]  

    const addOrderSubject = () => {
      ordersList.value.push({
        id: uid(),
        selectedProduct: '',
        quantity: 1,
      })
    }

    // Listens for chaging of workout type input
    const workoutChange = () => {
      exercises.value = [];
      addExercise();
    }

    // Listens for changing of deal type input
    const dealTypeChanged = () => {
      ordersList.value = [];
      addOrderSubject();
    }

    // Delete current order subject'
    const deleteOrderSubject = (id) => {
      if(ordersList.value.length > 0) {
        ordersList.value = ordersList.value.filter(subject => subject.id != id);
        return;
      }
    }

    // Create deal
    const createDeal = async () => {
      try {
        const { error } = await supabase.from('deals').insert([
          {
            dealType: typeOfDeal.value,
            // contact: search.value,
            contactID: contactId.value,
            ordersList: ordersList.value
          }
        ]);
        if (error) throw error;
        statusMsg.value = 'Дело успешно создано';
        typeOfDeal.value = 'select-deal-type';
        contactOfDeal.value = 'select-deal-contact';
        ordersList.value = [];
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
      typeOfDeal, contactOfDeal, data, dataLoaded, getContactFromDB, filteredOptions, search, workoutName, workoutType, exercises, statusMsg, errorMsg, user, addExercise, workoutChange, deleteExercise, createDeal, createWorkout, editModeSearchMenu, selectItem, openOptions, showSearchMenu, blurInput, selectAnon, ordersList, addOrderSubject, assortment, deleteOrderSubject, dealTypeChanged
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

</style>
