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
          <!-- Если нет имени, но есть логин в инсте или другой сети... может быть ставить вместо фамилии? -->
          <div v-if="user" class="flex flex-col items-center p-4 py-10">
            <div class="w-4/5 flex flex-col items-center">
              <!-- Avatar -->
              <div>
                <!-- На будущее: -->
                <!-- делает фото или подгружает из источника -->
                <!-- если аватар уже загружен - можно удалить, когда нет - камера -->
                <div v-if="edit" class="w-24 h-24 bg-white border rounded-full flex items-center justify-center">
                  <img class="w-50" src="@/assets/images/common/icon-camera-photo.svg" alt="">
                </div>
                <div v-else class="w-24 h-24 bg-dark-gray rounded-full flex items-center justify-center">
                  <!-- Avatar -->
                  <!--  -->
                </div>
              </div>

              <!-- Surname -->
              <div class="w-full mt-6">
                <div v-if="edit" >
                  <label for="contact-surname" class="text-xs mb-1 ml-2 text-dark-gray">Фамилия</label>
                  <input 
                    id="contact-surname"
                    type="text" 
                    class="p-2 w-full text-gray-500 rounded-md focus:outline-none bg-light-grey"
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
                  <label for="contact-name" class="text-xs mb-1 ml-2 text-dark-gray">Имя, Отчество</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    class="p-2 w-full text-gray-500 rounded-md focus:outline-none bg-light-grey"
                    v-model="data.contactInfo.name"
                  >
                </div>
                <p v-else class="text-dark-gray text-xl text-center">{{ data.contactInfo.name }}</p>
              </div>

              <!-- Company -->
              <div class="w-full">
                <div v-if="edit" class="mt-2">
                  <label for="contact-company" class="text-xs mb-1 ml-2 text-dark-gray">Компания</label>
                  <input 
                    type="text"
                    class="p-2 w-full text-gray-500 rounded-md focus:outline-none bg-light-grey"
                    v-model="data.contactInfo.company"
                  >
                </div>
                <p v-else class="text-dark-gray text-md mt-2 text-center">{{ data.contactInfo.company }}</p>
              </div>

            </div>
          </div>

          <!-- Phone -->
          <!-- Если ни одного контакта не добавлено -->
          <div v-if="data.phoneNumbers.length === 0 || data.phoneNumbers === null">
            <div v-if="user" class="flex place-content-between px-4 py-4 my-2 ">
              <p>Нет телефонов для связи</p>
              <p v-if="edit" class="text-blue" @click="addPhoneNumber">Добавить</p>
            </div>
          </div>
          <!-- Phone -->
          <!-- Если есть телефоны уже -->
          <div v-if="user" class="px-4">
            <p v-if="edit && data.phoneNumbers.length !== 0 && data.phoneNumbers !== null" class="text-blue py-2" >Редактировать номер телефона</p>

            <!-- loop data about phone numbers from db -->
            <div v-for="(number, index) in data.phoneNumbers" :key="index" class="phone-item">
              
              <div v-if="edit">
                <!-- Edit phone number-->
                <div class="flex flex-2 flex-col pb-2">
                  <label for="phone-number" class="mb-1 ml-2 text-xs text-dark-gray">
                    Номер телефона
                  </label>
                  <input 
                    id="phone-number"
                    type="text" 
                    class="p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none"
                    v-model="number.phone"
                  >
                </div>

                <!-- Edit type of phone -->
                <div  class="flex flex-2 flex-col pb-2">
                  <div>
                    <label for="phone-type" class="mb-1 ml-2 text-xs text-dark-gray">
                      Тип номера телефона
                    </label>

                    <select 
                      required
                      id="phone-type"
                      class="webkit p-2 w-full rounded-md text-gray-500 bg-light-grey focus:outline-none"
                      v-model="number.type"
                    >
                      <!-- Необходимо стилизовать по мере -->
                      <option value="Личный">Личный</option>
                      <option value="Рабочий">Рабочий</option>
                    </select>
                  </div>
                </div>

                <!-- Edit Socials & button delete current number -->
                <div class="flex items-center place-content-between pb-2 mt-2">
                  <div class="flex items-center justify-center">
                    <div v-for="(messenger, index) in number.messengers" :key="index" class="flex">
                      <input type="checkbox" class="custom-checkbox" v-model="messenger.status" :id="messenger.id">
                      <label :for="messenger.id" class="w-full text-xs text-dark-gray mr-2">{{messenger.name}}</label>
                    </div>
                  </div>
                  <!-- Button to delete current phone -->
                  <div v-if="edit" class="icon-wrapper">
                    <img 
                      @click="deletePhoneNumber(number.id)"
                      class="cursor-pointer" 
                      src="@/assets/images/common/icon-trash.svg" 
                      alt="">
                  </div>
                </div>
              </div>

              <!-- Show phones when edit is disabled -->
              <!-- Рассмотреть в дальнейшем возможность добавлять заготовленные тексты к "написать в мессенджер контакту" -->
              <div v-else class="flex w-full place-content-between">

                <!-- button to make a call -->
                <a 
                  class="flex items-center" 
                  :href="`tel:${number.phone}`"
                  
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

                <!-- For messengers... button group -->
                <div class="flex items-center">
                  <!-- Ссылка на чат в вайбер %2B-->
                  <!-- Подумать как можно оптимизировать -->
                  <a v-if="number.messengers[0].name === 'viber' && number.messengers[0].status === true" :href="`viber://${checkMobile()}${cutPhoneNumber(number.phone)}`" class="icon-wrapper icon-wrapper_social">
                    <img src="@/assets/images/social/icon-viber.svg" alt="">
                  </a>
                  <!-- Ссылка на чат в ватсап -->
                  <a v-if="number.messengers[1].name === 'whatsup' && number.messengers[1].status === true" :href="`https://wa.me/7${cutPhoneNumber(number.phone)}`" class="icon-wrapper icon-wrapper_social ml-4">
                    <img src="@/assets/images/social/icon-whatsup.svg" alt="">
                  </a>
                </div>
              </div>

            </div>

            <!-- Button to add new phone to current contact -->
            <button 
              @click="addPhoneNumber"
              v-if="edit && data.phoneNumbers.length !== 0 && data.phoneNumbers !== null"
              type="button"
              class="bg-green w-full p-2 rounded-md text-white my-4 cursor-pointer"
            >
              Добавить еще телефон
            </button>
          </div>


          <!-- Email -->
          <!-- Если ни одного имейла не добавлено -->
          <div v-if="data.Emails.length === 0 || data.Emails === null">
            <div v-if="user" class="flex place-content-between px-4 py-2 my-2">
              <p>Эл.почта не указана</p>
              <p v-if="edit" class="text-blue" @click="addEmail">Добавить</p>
            </div>
          </div>
          <!-- Email -->
          <!-- Если есть имейлы уже -->
          <div v-if="user" class="px-4 mt-4">
            <p v-if="edit && data.Emails.length !== 0 && data.Emails !== null" class="text-blue py-2" >Редактировать email</p>

            <!-- loop data about emails from db -->
            <div v-for="(email, index) in data.Emails" :key="index" class="phone-item">
              <div v-if="edit">

                <!-- Edit email-->
                <div class="flex flex-2 flex-col pb-2">
                  <label for="phone-number" class="mb-1 ml-2 text-xs text-dark-gray">
                    Адрес почты
                  </label>
                  <input 
                    id="phone-number"
                    type="text" 
                    class="p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none"
                    v-model="email.email"
                  >
                </div>

                <!-- Edit type of email -->
                <div  class="flex flex-2 flex-col pb-2">
                  <div>
                    <label for="phone-type" class="mb-1 ml-2 text-xs text-dark-gray">
                      Тип почты
                    </label>

                    <select 
                      required
                      id="phone-type"
                      class="webkit p-2 w-full text-gray-500 bg-light-grey focus:outline-none rounded-md"
                      v-model="email.type"
                    >
                      <option value="Личный">Личный</option>
                      <option value="Рабочий">Рабочий</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Show emails when edit is disabled -->
              <!-- Рассмотреть в дальнейшем возможность добавлять заготовленные тексты к "написать в чат контакту" -->
              <div v-else class="flex w-full place-content-between">
                <!-- button to go to write emails -->
                <a 
                  class="flex items-center" 
                  :href="`mailto:${email.email}`"
                  target="_blank"
                  
                >
                  <div class="icon-wrapper mr-2">
                    <img src="@/assets/images/common/icon-email.svg" alt="">
                  </div>
                  <div>
                    <p class="text-sm text-dark-gray">{{ email.type }}</p>
                    <p class="text-blue">{{ email.email }}</p>
                  </div>
                  <div>

                  </div>
                </a>
              </div>

              <!-- Button to delete current email -->
              <div v-if="edit" class="flex items-center place-content-between justify-end pb-2 mt-2">
                <div  class="icon-wrapper">
                  <img 
                    @click="deleteEmail(email.id)"
                    class="cursor-pointer" 
                    src="@/assets/images/common/icon-trash.svg" 
                    alt="">
                </div>
              </div>
            </div>

            <!-- Button to add new email to current contact -->
            <button 
              @click="addEmail"
              v-if="edit && data.Emails.length !== 0 && data.Emails !== null"
              type="button"
              class="w-full my-4 p-2 rounded-md text-white bg-green cursor-pointer"
            >
              Добавить еще эл.адрес
            </button>
          </div>
          

          <!-- Social -->
          <!-- Если ни одной соц сети не добавлено -->
          <div v-if="data.socialNetworks.length === 0 || data.socialNetworks === null">
            <div v-if="user" class="flex place-content-between px-4 py-2 my-2">
              <p>Социальные сети не указаны</p>
              <p v-if="edit" class="text-blue" @click="addSocial">Добавить</p>
            </div>
          </div>
          <!-- Social -->
          <!-- Если социальные сети уже указаны -->
          <div v-if="user" class="px-4 mt-4">
            <p v-if="edit && data.socialNetworks.length !== 0 && data.socialNetworks !== null" class="text-blue py-2 border-bottom" >Редактировать социальные сети</p>

            <!-- loop data about social networks from db -->
            <!-- Edit Mode -->
            <div v-if="edit">
              <div v-for="(social, index) in data.socialNetworks" :key="index" class="phone-item">

                <div v-if="edit">

                  <!-- Edit social link -->
                  <div class="flex flex-2 flex-col pb-2">
                    <label for="social-link" class="mb-1 ml-2 text-xs text-dark-gray">
                      Укажите ссылку на аккаунт
                    </label>
                    <input 
                      id="social-link"
                      type="text" 
                      class="p-2 w-full text-gray-500 bg-light-grey focus:outline-none rounded-md"
                      v-model="social.link"
                    >
                  </div>

                  <!-- Edit name of social network -->
                  <div  class="flex flex-2 flex-col pb-2">
                    <div>
                      <label for="social-link-type" class="mb-1 ml-2 text-xs text-dark-gray">
                        Укажите название соц.сети
                      </label>

                      <select 
                        required
                        id="social-link-type"
                        class="webkit p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none"
                        v-model="social.name"
                      >
                        <option value="instagram">Инстаграм</option>
                        <option value="vkontakte">Вконтакте</option>
                        <option value="telegram">Телеграм</option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Show social when edit is disabled -->
                <!-- Рассмотреть в дальнейшем возможность добавлять заготовленные тексты к "написать в чат контакту" -->
                <!-- А также кнопку поделиться данной ссылкой (в ios и так можно делиться, при длительном нажатии всплывает меню)-->

                <!-- Button to delete current link to social -->
                <div v-if="edit" class="flex items-center place-content-between justify-end pb-2 mt-2">
                  <div  class="icon-wrapper">
                    <img 
                      @click="deleteSocial(social.id)"
                      class="cursor-pointer" 
                      src="@/assets/images/common/icon-trash.svg" 
                      alt="">
                  </div>
                </div>
              </div>
            </div>
            <!-- No Edit Mode -->
            <div v-if="!edit && data.socialNetworks.length === 0 && data.socialNetworks === null" class="flex py-4">
              <div v-for="(social, index) in data.socialNetworks" :key="index" class="mr-2">
                <!-- button to go to social network -->
                <a 
                  :href="`${social.link}`"
                  target="_blank"
                >
                  <div class="icon-wrapper mr-2">
                    <img v-if="social.name === 'instagram'" src="@/assets/images/social/icon-instagram.svg" alt="">
                    <img v-if="social.name === 'vkontakte'" src="@/assets/images/social/icon-vkontakte.svg" alt="">
                    <img v-if="social.name === 'telegram'" src="@/assets/images/social/icon-telegram.svg" alt="">
                    <!-- <img :src="getSocialIcons" alt=""> -->
                  </div>
                  <div>
                    
                  </div>
                </a>
              </div>
            </div>

            <!-- Button to add new social link to current contact -->
            <button 
              @click="addSocial"
              v-if="edit && data.socialNetworks.length !== 0 && data.socialNetworks !== null"
              type="button"
              class="w-full my-4 p-2 bg-green rounded-md text-white cursor-pointer"
            >
              Добавить еще ссылку
            </button>
          </div>
          <!-- Реализовать вохможность добавления ссылок на соц сети и перехода по ним! -->
          <!--  -->
          <!--  -->
          <!-- На заметку -->
          <!-- Если нет имени, но есть логин в инсте или другой сети... ставить вместо фамилии ) -->
          <!-- <a href="https://www.messenger.com/t/jack.malbon.3">Facebook Messenger</a> -->
          <!-- <a href="skype:LOGIN?chat">Отправить сообщение в Skype</a> -->
          <!-- <a href="skype:LOGIN?voicemail">Отправить голосовое сообщение в Skype</a> -->
          <!-- <a href="skype:LOGIN?call">Позвонить пользователю Skype</a> -->
          <!-- <a href="skype:LOGIN?add">Добавить в список контактов Skype</a> -->

          <!-- Events -->
          <!-- Если ни одного события не добавлено в режиме !edit-->
          <!-- Отсчет до отмечания события должен быть... -->
          <div v-if="data.contactEvents.length === 0 || data.contactEvents === null">
            <div v-if="user" class="flex place-content-between px-4 py-2 my-2">
              <p>Нет событий</p>
              <p v-if="edit" class="text-blue" @click="addContactEvent">Добавить</p>
            </div>
          </div>
          <!-- Events -->
          <!-- Если события есть уже -->
          <div v-if="user" class="px-4 mt-4">
            <p v-if="edit && data.contactEvents.length !== 0 && data.contactEvents !== null" class="text-blue py-2" >Редактировать события</p>

            <!-- loop data about events from bd -->
            <div v-for="(event, index) in data.contactEvents" :key="index" class="event-item">
                <div v-if="edit">
                  <!-- Edit title of event -->
                  <div class="flex flex-2 flex-col pb-2">
                    <label for="event-title" class="mb-1 ml-2 text-xs text-dark-gray">
                      Название события
                    </label>
                    <input 
                      id="event-title"
                      type="text" 
                      class="p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none"
                      v-model="event.title"
                    >
                  </div>

                  <!-- Edit date of event -->
                  <div class="flex flex-2 flex-col pb-2">
                    <label for="event-date" class="my-1 ml-2 text-xs text-dark-gray">
                      Дата события
                    </label>
                    <input 
                      id="event-date"
                      type="date" 
                      class="webkit bg-light-grey rounded-md p-2 w-full text-gray-500 focus:outline-none"
                      v-model="event.date"
                      placeholder="value"
                    >
                  </div>
                </div>

              <!-- show data when editMode is disabled -->
              <!-- Отсчет до отмечания события должен быть... -->
              <div v-else >
                <h3 class="text-sm">{{ event.title }}</h3>
                <p class="text-blue">{{ event.date }}</p>
              </div>
              
              <!-- Delete current event-->
              <div v-if="edit" class="flex items-center place-content-between justify-end pb-2 mt-2">
                <div class="icon-wrapper">
                  <img 
                    @click="deleteContactEvent(event.id)"
                    class="cursor-pointer" 
                    src="@/assets/images/common/icon-trash.svg" 
                    alt="">
                </div>
              </div>

            </div>

            <!-- Button to add event of contact -->
            <button 
              @click="addContactEvent"
              v-if="edit && data.contactEvents.length !== 0 && data.contactEvents !== null"
              type="button"
              class="w-full my-4 p-2 rounded-md text-white bg-green cursor-pointer"
            >
              Добавить еще событие
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

    // Cut Phone Number for massengers
    const cutPhoneNumber = (phoneNumber) => {
      // const updatedPhoneNumber = phoneNumber.toString().substr(phoneNumber.length, 10)
      if(phoneNumber.startsWith("+")) {
        const updatedPhoneNumber = phoneNumber.slice(2)
        console.log('начинается с +7' + updatedPhoneNumber)
        return updatedPhoneNumber;
      } else if (phoneNumber.startsWith("8")) {
        const updatedPhoneNumber = phoneNumber.slice(1)
        console.log('начинается с 8' + updatedPhoneNumber)
        return updatedPhoneNumber;
      } else {
        console.log('неверный формат номера телефона')
      }
    }

    //Check mobile or not
    const checkMobile = () => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          const peace = 'add?number=7';
          return peace
        } else {
          const peace = 'chat?number=7';
          return peace
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

    // Оптимизировать функции добавления
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

    // Add Emails
    const addEmail = () => {
      data.value.Emails.push({
        id: uid(),
        type: '',
        email: ''
      })
    }

    // Add Social
    const addSocial = () => {
      data.value.socialNetworks.push({
        id: uid(),
        name: '',
        link: ''
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

    // Delete current Phone Number events
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

    // Delete current Email address
    const deleteEmail = (id) => {
      if(data.value.Emails.length > 0) {
        data.value.Emails = data.value.Emails.filter(email => email.id !== id);
        return;
      }
      errorMsg.value = 'Error. Cannot remove, need to at least have one event';
      setTimeout(() => {
        errorMsg.value = false;
      }, 5000);
    }

    // Delete current link to social
    const deleteSocial = (id) => {
      if(data.value.socialNetworks.length > 0) {
        data.value.socialNetworks = data.value.socialNetworks.filter(social => social.id !== id);
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
          phoneNumbers: data.value.phoneNumbers,
          socialNetworks: data.value.socialNetworks,
          Emails: data.value.Emails
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
      statusMsg, data, dataLoaded, errorMsg, edit, editMode, user, deleteContact, addContactEvent, deleteContactEvent, update, cancelEdit, deletePhoneNumber, addPhoneNumber, cutPhoneNumber, checkMobile, addEmail, addSocial, deleteEmail, deleteSocial
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
