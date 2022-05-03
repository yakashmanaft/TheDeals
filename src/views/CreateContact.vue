<template>
  <div class="container text-dark">
    <!-- Navigation -->
    <nav class="fixed z-10 bg-white nav container py-2 px-4 flex gap-4 items-center sm:flex-row place-content-between">
      <h1 class="text-dark text-2xl font-bold">Новый контакт</h1>
      <!-- По клику на Отменить надо бы сделать некий cancelCreate -->
      <div @click="$router.go(-1)" class="text-blue">Отменить</div>
    </nav>

    <!-- Create new contact -->
    <main class="max-w-screen-sm mx-auto px-4 pt-20">

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
      <form v-if="user" @submit.prevent="createContact" class="flex flex-col items-center p-4 py-10">

        <!-- add main contact info -->
        <div class="w-4/5 flex flex-col items-center pb-10">
          <!-- Avatar -->
          <div>
              <div class="w-24 h-24 bg-white border rounded-full flex items-center justify-center">
                <img class="w-50" src="@/assets/images/common/icon-camera-photo.svg" alt="">
              </div>
          </div>

          <!-- Surname -->
          <div class="w-full mt-6">
            <label for="contact-surname" class="text-xs mb-1 ml-2 text-dark-gray">Фамилия</label>
            <input 
              required
              id="contact-surname"
              type="text" 
              class="p-2 w-full text-gray-500 rounded-md focus:outline-none bg-light-grey"
              v-model="contactSurname"
            >
          </div>

          <!-- Name -->
          <div class="w-full mt-2">
            <label for="contact-name" class="text-xs mb-1 ml-2 text-dark-gray">Имя, Отчество</label>
            <input 
              required
              id="contact-name"
              type="text" 
              class="p-2 w-full text-gray-500 rounded-md focus:outline-none bg-light-grey"
              v-model="contactName"
            >
          </div>

          <!-- Company -->
          <div class="w-full mt-2">
            <label for="contact-company" class="text-xs mb-1 ml-2 text-dark-gray">Компания</label>
            <input 
              type="text"
              class="p-2 w-full text-gray-500 rounded-md focus:outline-none bg-light-grey"
              v-model="contactCompany"
            >
          </div>
        </div>

        <!-- add phone numbers -->
        <div class="w-full">
          <p class="text-blue py-2">Добавить номер телефона</p>
            <div class="flex flex-col pb-2">
              <label for="phone-number" class="mb-1 ml-2 text-xs text-dark-gray">
                Номер телефона
              </label>
              <input 
                id="phone-number"
                type="text" 
                class="p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none"
                v-model="phoneNumbers.value"
              >
            </div>

          <div  class="flex flex-2 flex-col pb-2">
            <div>
              <label for="phone-type" class="mb-1 ml-2 text-xs text-dark-gray">
                Тип номера телефона
              </label>

              <select 
                required
                id="phone-type"
                class="webkit p-2 w-full rounded-md text-gray-500 bg-light-grey focus:outline-none"
              >
                <!-- Необходимо стилизовать по мере -->
                <option value="Личный">Личный</option>
                <option value="Рабочий">Рабочий</option>
              </select>
            </div>
          </div>

          <div class="flex items-center place-content-between pb-2 mt-2">
            <div class="flex items-center justify-center">
              <div class="flex">
                <input type="checkbox" class="custom-checkbox" id="viber">
                <label for="viber" class="w-full text-xs text-dark-gray mr-2">viber</label>
              </div>
              <div class="flex">
                <input type="checkbox" class="custom-checkbox" id="whatsup">
                <label for="whatsup" class="w-full text-xs text-dark-gray mr-2">whatsup</label>
              </div>
            </div>

            <div class="icon-wrapper">
              <img 
                class="cursor-pointer" 
                src="@/assets/images/common/icon-trash.svg" 
                alt="">
            </div>
          </div>

            <!-- Button to add new phone to current contact -->
            <button 
              @click="phoneNumbersChange"
              type="button"
              class="bg-green w-full p-2 rounded-md text-white my-4 cursor-pointer"
            >
              Добавить еще телефон
            </button>
        </div>

        <!-- Button submit form -->
        <button type="submit" class="w-full my-4 cursor-pointer p-2 bg-dark text-white rounded-md">
          Создать Контакт
        </button>
      </form>
    </main>
  </div>
  
  <div class="max-w-screen-md mx-auto px-4">


    <!-- Create -->
    <div class="mt-10 p-8 flex flex-col items-start">



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
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import store from '../store/index';
import { uid } from 'uid';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

  export default {
      name: "createContact",
      setup() {
        // Create data
        const router = useRouter();

        const statusMsg = ref(null);
        const errorMsg = ref(null);
        const user = computed(() => store.state.user)

        const contactSurname = ref('');
        const contactName = ref('');
        const contactCompany = ref('');

        const contactEvents = ref([]);
        const phoneNumbers = ref([]);
        const socialNetworks = ref([]);
        const Emails = ref([]);

        // Add phone number
        const addPhoneNumber = () => {
          phoneNumbers.value.push({
            id: uid(),
            type: '',
            phone: '',
            messengers: [
              {
                id: uid(),
                name: 'viber',
                status: false
              },
              {
                id: uid(),
                name: 'whatsup',
                status: false
              }
            ]
          })
        }

        const phoneNumbersChange = () => {
          phoneNumbers.value = [];
          addPhoneNumber();
        }

        // Create contact
        const createContact = async () => {
          console.log('clicked button create contact')
          // console.log(surname.value)
          // console.log(name.value);
          // console.log(company.value);
          // const contactInfo = {
          //   name: contactName.value,
          //   surname: contactSurname.value,
          //   company: contactCompany.value
          // }
          // console.log(contactInfo)
          try {
            const { error } = await supabase.from('myContacts').insert([
              {
                contactInfo: {
                  name: contactName.value,
                  surname: contactSurname.value,
                  company: contactCompany.value
                },
                contactEvents: contactEvents.value,
                phoneNumbers: phoneNumbers.value,
                socialNetworks: contactEvents.value,
                Emails: Emails.value
              }
            ])

            if (error) throw error;

            statusMsg.value = 'Контакт успешно создан!'
            contactName.value = null;
            contactSurname.value = null;
            contactCompany.value = null;

            setTimeout(() => {
              statusMsg.value = false;
              // В идеале переходить к только что созданному контакту
              router.push({ name: 'Contacts' });
            }, 3000)
          } catch (error) {
            errorMsg.value = `Error: ${error.message}`;
            setTimeout(() => {
              errorMsg.value = false;
            }, 5000)
          }
        }

        return {
          statusMsg, errorMsg, user, contactSurname, contactName, contactCompany, createContact, phoneNumbers, addPhoneNumber, phoneNumbersChange, contactEvents, socialNetworks, Emails
        }
      }
    
  }
</script>

<style lang="scss" scoped>
  .nav {
    height: 76px;
    padding: 0.5rem 1rem;
  }

  .event-item,
  .phone-item {
    padding: 10px 0;
  }

  .event-item:nth-child(n+2),
  .phone-item:nth-child(n+2) {
    border-top: 1px solid #f1f1f1;
  }

  .border-bottom {
    border-bottom: 1px solid #f1f1f1;
  }


  .icon-wrapper {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-wrapper img{
    width: 100%;
    height: 100%;
  }

  .webkit {
    -webkit-appearance:none;
  }

  .custom-checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  .custom-checkbox+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
  }
  .custom-checkbox+label::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #838383;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }

  .custom-checkbox:checked+label::before {
    border-color: #4785E7;
    background-color: #4785E7;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
  }
</style>