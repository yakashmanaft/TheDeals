<template>
  <div class="container text-dark">

    <!-- Navigation -->
    <nav class="fixed z-10 bg-white nav container py-2 px-4 flex gap-4 items-center sm:flex-row place-content-between">
      <div class="flex items-center">
        <div class="text-blue" v-if="edit" @click="cancelEdit">
          Отмена
        </div>
        <div v-else v-show="user" @click="$router.go(-1)" class="arrow-back">
          <img src="@/assets/images/common/arrow-right.svg" class="arrow-back_icon" alt="">
          <p class="text-dark text-2xl font-bold ml-2 arrow-back_text">Назад</p>
        </div>
      </div>
      <!-- а как же if dataLoaded?? -->
      <div v-if="edit" class="justify-self-end text-blue font-bold" @click="update">
        Готово
      </div>
      <div v-else class="justify-self-end text-blue" @click="editMode">
        <p>Править</p>
      </div>
    </nav>

    <!-- View Current Contact -->
    <main class="max-w-screen-sm mx-auto px-4 pt-20">

      <!-- App Msg -->
      <!-- разобраться со стилями ерроров и меседжей системных -->
      <div 
        v-if="statusMsg || errorMsg" 
        class="fixed z-20 flex left-0 top-0 w-full h-16 mb-10 px-8 py-4 rounded-b-md shadow-md bg-white items-center place-content-between"
      >
        <div>
          <p v-if="statusMsg" class="text-green">
            <!-- {{ statusMsg }} -->
            Контакт успешно обновлен
          </p>
          <p class="text-red-500">
            {{ errorMsg }}
          </p>
        </div>
        <div class="text-dark-gray" @click="statusMsg = !statusMsg">
          Оk
        </div>
      </div>

      <!--  -->
      <div v-if="dataLoaded">
        <!-- General Contact Info -->
        
          <!-- Main info about contact -->
          <div v-if="user" class="flex flex-col items-center rounded-md bg-light-grey p-4">

            <!-- Avatar -->
            <div>
              <!-- На будущее: -->
              <!-- делает фото или подгружает из источника -->
              <!-- если аватар уже загружен - можно удалить, когда нет - камера -->
              <div v-if="edit" class="w-24 h-24 bg-white border rounded-full flex items-center justify-center">
                <img class="w-50" src="@/assets/images/common/icon-camera-photo.svg" alt="">
              </div>
              <div v-else class="w-24 h-24 bg-dark-gray rounded-full flex items-center justify-center">
                
              </div>
            </div>

            <!-- Surname -->
            <div class="w-full mt-6">
              <div v-if="edit" >
                <label for="contact-surname" class="text-xs mb-1 text-dark-gray">Фамилия</label>
                <input 
                  id="contact-surname"
                  type="text" 
                  class="p-2 w-full text-gray-500 focus:outline-none"
                  v-model="data.contactInfo.surname"
                >
              </div>
              <h1 v-else class="text-blue text-2xl text-center">
                {{ data.contactInfo.surname }}
              </h1>
            </div>

            <!-- Name -->
            <div class="w-full">
              <div v-if="edit" class="mt-2">
                <label for="contact-name" class="text-xs mb-1 text-dark-gray">Имя, Отчество</label>
                <input 
                  id="contact-name"
                  type="text" 
                  class="p-2 w-full text-gray-500 focus:outline-none"
                  v-model="data.contactInfo.name"
                >
              </div>
              <p v-else class="text-dark-gray text-md text-center">{{ data.contactInfo.name }}</p>
            </div>

            <!-- Company -->
            <div class="w-full">
              <div v-if="edit" class="mt-2">
                <label for="contact-company" class="text-xs mb-1 text-dark-gray">Компания</label>
                <input 
                  type="text"
                  class="p-2 w-full text-gray-500 focus:outline-none"
                  v-model="data.contactInfo.company"
                >
              </div>
              <p v-else class="text-dark-gray text-md text-center font-bold">{{ data.contactInfo.company }}</p>
            </div>
          </div>

          <!-- Phone -->
          <!-- Если ни одного контакта не добавлено -->
          <div v-if="data.phoneNumbers.length === 0 || data.phoneNumbers === null">
            <div v-if="user" class="flex place-content-between rounded-md bg-light-grey px-4 py-2 my-2">
              <p>Нет телефонов для связи</p>
              <p v-if="edit" class="text-blue" @click="addPhoneNumber">Добавить</p>
            </div>
          </div>

          <!-- Если есть контакты уже -->
          <div v-if="user" class="rounded-md bg-light-grey px-4 my-2">
            <p v-if="edit && data.phoneNumbers.length !== 0 && data.phoneNumbers !== null" class="text-blue py-2 border-0" >Редактировать телефон для связи</p>

            <!-- loop data about phone numbers from db -->
            <div v-for="(number, index) in data.phoneNumbers" :key="index" class="flex place-content-between items-center phone-item">
              
              <div v-if="edit">
                <!-- Edit type of phone -->
                <div  class="flex flex-2 flex-col md:w-1/3 pb-2">
                  <div>
                    <label for="phone-type" class="mb-1 text-xs text-dark-gray">
                      Тип телефонного номера
                    </label>

                    <select 
                      id="phone-type"
                      type="text" 
                      class="py-2 w-full text-gray-500 focus:outline-none"
                      v-model="number.type"
                    >
                      <option value="Личный">Личный</option>
                      <option value="Рабочий">Рабочий</option>
                    </select>
                  </div>
                </div>

                <!-- Edit phone number-->
                <div class="flex flex-2 flex-col md:w-1/3 pb-2">
                  <label for="phone-number" class="mb-1 text-xs text-dark-gray">
                    Номер телефона
                  </label>
                  <input 
                    id="phone-number"
                    type="text" 
                    class="p-2 w-full text-gray-500 focus:outline-none"
                    v-model="number.phone"
                  >
                </div>
              </div>

              <!-- Show phones when edit disabled -->
              <a 
                class="flex flex-1 items-center" 
                :href="`tel:${number.phone}`"
                v-else
              >
                <div class="icon-wrapper mr-2">
                  <img src="@/assets/images/common/icon-phone.svg" alt="">
                </div>
                <div>
                  <p class="text-sm text-dark-gray">{{ number.type }}</p>
                  <p class="text-blue">{{ number.phone }}</p>
                </div>
                <div>

                </div>
              </a>

              <!-- Button to delete current phone -->
              <div v-if="edit" class="icon-wrapper mx-4">
                <img 
                  @click="deletePhoneNumber(number.id)"
                  class="w-full w-full h-full cursor-pointer" 
                  src="@/assets/images/common/icon-trash.svg" 
                  alt="">
              </div>
            </div>

            <!-- Button to add new phone to contact -->
            <button 
              @click="addPhoneNumber"
              v-if="edit && data.phoneNumbers.length !== 0 && data.phoneNumbers !== null"
              type="button"
              class="w-full my-4 text-blue cursor-pointer"
            >
              Добавить телефон
            </button>
          </div>

          <!-- Social -->
          <!-- Реализовать вохможность добавления ссылок на соц сети и перехода по ним! -->
          <!--  -->
          <!--  -->
          <a href="viber://chat?number=%2B79223000505">Viber</a>
          <a href="https://api.whatsapp.com/send/?phone=+79617582573">ватсап</a>
          <a href="viber://add?number=79223000705">Добавить контакт в Viber</a>
          <!-- https://wa.me/79200000000 короткий вариант ссылки на ватсап %2B-->
          <!-- https://t.me/Kashmanaft --> 
          <!-- <a href="vk.me/agvento">Написать в VK</a> -->
          <!-- Если нет имени, но есть логин в инсте или другой сети... ставить вместо фамилии ) -->
          <!-- <a href="https://www.messenger.com/t/jack.malbon.3">Facebook Messenger</a> -->
          <!-- <a href="skype:LOGIN?chat">Отправить сообщение в Skype</a> -->
          <!-- <a href="skype:LOGIN?voicemail">Отправить голосовое сообщение в Skype</a> -->
          <!-- <a href="skype:LOGIN?call">Позвонить пользователю Skype</a> -->
          <!-- <a href="skype:LOGIN?add">Добавить в список контактов Skype</a> -->
          <!-- <a href="mailto:mail@example.com">Пример ссылки на емайл</a> -->

          <!-- Events -->
          <!-- Если ни одного события не добавлено -->
          <div v-if="data.contactEvents.length === 0 || data.contactEvents === null">
            <div v-if="user" class="flex place-content-between rounded-md bg-light-grey px-4 py-2 my-2">
              <p>Нет событий</p>
              <p v-if="edit" class="text-blue" @click="addContactEvent">Добавить</p>
            </div>
          </div>

          <!-- Events are exists -->
          <div v-if="user" class="rounded-md bg-light-grey px-4 my-2">
            <p v-if="edit && data.contactEvents.length !== 0 && data.contactEvents !== null" class="text-blue py-2" >Редактировать события</p>

            <!-- loop data about events from bd -->
            <div v-for="(event, index) in data.contactEvents" :key="index" class="flex place-content-between items-center event-item">

              <div>
                <!-- Edit title of event -->
                <div v-if="edit" class="flex flex-2 flex-col md:w-1/3">
                  <label for="event-title" class="mb-1 text-xs text-dark-gray">
                    Название события
                  </label>
                  <input 
                    required
                    id="event-title"
                    type="text" 
                    class="p-2 w-full text-gray-500 focus:outline-none"
                    v-model="event.title"
                  >
                </div>

                <!-- Edit date of event -->
                <div v-if="edit" class="flex flex-2 flex-col md:w-1/3">
                  <label for="event-date" class="my-1 text-xs text-dark-gray">
                    Дата события
                  </label>
                  <input 
                    id="event-date"
                    type="date" 
                    class="p-2 w-full text-gray-500 focus:outline-none"
                    v-model="event.date"
                  >
                </div>

                <!-- data when editMode is desabled -->
                <div v-else >
                  <h3 class="text-sm">{{ event.title }}</h3>
                  <p class="text-blue">{{ event.date }}</p>
                </div>
              </div>
              
              <!-- Delete event button-->
              <div v-if="edit" class="icon-wrapper mx-4">
                <img 
                  @click="deleteContactEvent(event.id)"
                  class="w-full w-full h-full cursor-pointer" 
                  src="@/assets/images/common/icon-trash.svg" 
                  alt="">
              </div>

            </div>

            <!-- Button to add event of contact -->
            <button 
              @click="addContactEvent"
              v-if="edit && data.contactEvents.length !== 0 && data.contactEvents !== null"
              type="button"
              class="w-full my-4 text-blue cursor-pointer"
            >
              Добавить событие
            </button>

          </div>

          <!-- Settings -->
          <!-- Button to delete current contact -->
          <div v-if="!edit">
            <p class="my-4 text-danger text-center cursor-pointer" @click="deleteContact">Удалить контакт</p>
          </div>

      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { supabase } from '../supabase/init';
import { useRoute, useRouter } from 'vue-router';
import store from '../store/index';
import { uid } from 'uid';

export default {
  name: "view-contact",
  setup() {
    // Create data / vars
    const data = ref(null);
    const dataLoaded = ref(null);
    const errorMsg = ref(null);
    const statusMsg = ref(null);
    const route = useRoute();
    const router = useRouter();
    const user = computed(() => store.state.user)

    // Get current Id of route
    const currentId = route.params.contactId;

    // Get contact data
    const getData = async () => {
      try {
        const { data: myContacts, error } = await supabase.from('myContacts').select('*').eq('id', currentId);
        if(error) throw error;
        data.value = myContacts[0];
        dataLoaded.value = true;
        console.log(data.value)
      } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    };

    getData();

    // Delete contact
    const deleteContact = async () => {
      try {
        const { error } = await supabase.from('myContacts').delete().eq('id', currentId);
        if (error) throw error;
        router.push({ name: 'Contacts' })
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    }

    // Edit mode
    const edit = ref(null);

    const editMode = () => {
      edit.value = !edit.value;
    }

    // Cancel editMode & cancel all changes
    const cancelEdit = () => {
      getData();
      edit.value = !edit.value;
    }

    // Оптимизировать функцию добавления
    // Add contact event
    const addContactEvent = () => {
      // if(data.value.workoutType === 'strength') {
      //   data.value.exercises.push({
      //     id: uid(),
      //     exercise: '',
      //     sets: '',
      //     reps: '',
      //     weight: '',
      //   });
      //   return
      // }
      data.value.contactEvents.push({
        id: uid(),
        title: '',
        date: '',
      })
    }

    // Add phone number
    const addPhoneNumber = () => {
      data.value.phoneNumbers.push({
        id: uid(),
        type: '',
        phone: ''
      })
    }

    //Оптимизировать в одну функцию!
    // Delete contact events
    const deleteContactEvent = (id) => {
      if(data.value.contactEvents.length > 0) {
        data.value.contactEvents = data.value.contactEvents.filter(event => event.id !== id);
        return;
      }
      errorMsg.value = 'Error. Cannot remove, need to at least have one event';
      setTimeout(() => {
        errorMsg.value = false;
      }, 5000);
    }

    // Delete Phone Number events
    const deletePhoneNumber = (id) => {
      if(data.value.phoneNumbers.length > 0) {
        data.value.phoneNumbers = data.value.phoneNumbers.filter(number => number.id !== id);
        return;
      }
      errorMsg.value = 'Error. Cannot remove, need to at least have one event';
      setTimeout(() => {
        errorMsg.value = false;
      }, 5000);
    }

    // Update Workout
    const update = async () => {
      try {
        const { error } = await supabase.from('myContacts').update({
          contactInfo: data.value.contactInfo,
          contactEvents: data.value.contactEvents,
          phoneNumbers: data.value.phoneNumbers
        }).eq('id', currentId);
        if(error) throw error;
        edit.value = false;
        statusMsg.value = 'Success: Contact Updated!'
        setTimeout(() => {
          statusMsg.value = false;
        }, 5000);
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    }

    return {
      statusMsg, data, dataLoaded, errorMsg, edit, editMode, user, deleteContact, addContactEvent, deleteContactEvent, update, cancelEdit, deletePhoneNumber, addPhoneNumber
    };
  },
};
</script>
<style lang="scss" scoped>
  .arrow-back {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .nav {
    height: 76px;
    padding: 0.5rem 1rem;
    // background-color: #ccc;
  }

  .arrow-back_icon {
    width: 60%;
    height: 60%;
    transform: rotate(180deg);
  }

  .event-item,
  .phone-item {
    padding: 10px 0;
  }

  .event-item:nth-child(n+2),
  .phone-item:nth-child(n+2) {
    border-top: 1px solid #fff;
  }

  .icon-wrapper {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
