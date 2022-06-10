<template>
  <div class="container text-dark">
    <!-- Navigation -->
    <nav class="fixed z-10 bg-white nav container py-2 px-4 flex gap-4 items-center sm:flex-row place-content-between">
      <h1 class="text-dark text-2xl font-bold">Новый контакт</h1>
      <!-- По клику на Отменить надо бы сделать некий cancelCreate -->
      <div @click="$router.go(-1)" class="text-blue">Отменить</div>
    </nav>

    <!-- Create new contact -->
    <main class="max-w-screen-sm mx-auto pt-20">


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

      <!-- Loading spinner -->
      <Spinner v-if="spinner"></Spinner>

      <!-- Create -->
      <form v-if="user" @submit.prevent="createContact" class="flex flex-col items-center p-4 py-10" :class="{ item_fixed: spinner}">

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
            <label for="contact-name" class="text-xs mb-1 ml-2 text-dark-gray">Имя</label>
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
        <div v-if="user && !phoneNumbers.length" class="w-full flex place-content-between py-4 ">
          <p>Нет телефонов для связи</p>
          <p class="text-blue" @click="addPhoneNumber">Добавить</p>
        </div>
        <!--  -->
        <div class="w-full">
          <p v-if="phoneNumbers.length" class="text-blue py-2">Добавляем номер телефона</p>
          
          <div class="phone-item" v-for="(number, index) in phoneNumbers" :key="index">
            <!-- Phone number -->
            <div class="flex flex-col pb-2">
              <label for="phone-number" class="mb-1 ml-2 text-xs text-dark-gray">
                Номер телефона
              </label>
              <input 
                id="phone-number"
                required
                type="tel" 
                class="p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none"
                v-model="number.phone"
              >
            </div>
            <!-- Type of Phone number -->
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
                  <!-- Динамически может? Из настроек аккаунта? -->
                  <option disabled value="Укажите тип">Укажите тип</option>
                  <option value="Личный">Личный</option>
                  <option value="Рабочий">Рабочий</option>
                </select>
              </div>
            </div>
          
            <div class="flex items-center place-content-between pb-2 mt-2">
              <div class="flex items-center justify-center">
                <div class="ml-2">
                  <p class="text-xs text-dark-gray mb-2">Привязка к мессенджерам</p>
                  <div class="flex">
                    <div v-for="(messenger, index) in number.messengers" :key="index" class="flex">
                      <input type="checkbox" class="custom-checkbox" v-model="messenger.status" :id="messenger.id">
                      <label :for="messenger.id" class="w-full text-xs text-dark-gray mr-2">{{messenger.name}}</label>
                    </div>
                  </div>
                </div> 
              </div>
              <!-- Delete current phone -->
              <div class="icon-wrapper">
                <img 
                  @click="deletePhoneNumber(number.id)"
                  class="cursor-pointer" 
                  src="@/assets/images/common/icon-trash.svg" 
                  alt="">
              </div>
            </div>
          </div>
          <!-- Button to add new phone to current contact -->
          <button 
            v-if="phoneNumbers.length"
            @click="addPhoneNumber"
            type="button"
            class="border border-blue w-full p-2 rounded-md text-blue mb-4 cursor-pointer"
          >
            Добавить еще телефон
          </button>

        </div>

        <!-- add emails -->
        <div v-if="user && !Emails.length" class="w-full flex place-content-between py-4">
          <p>Эл.почта не указана</p>
          <p class="text-blue" @click="addEmail">Добавить</p>
        </div>
        <!--  -->
        <div class="w-full">
          <p v-if="Emails.length" class="text-blue py-2">Добавляем эл.адрес</p>

          <div class="phone-item" v-for="(email, index) in Emails" :key="index">
            <!-- email-->
            <div class="flex flex-2 flex-col pb-2">
              <label for="email" class="mb-1 ml-2 text-xs text-dark-gray">
                Адрес почты
              </label>
              <input 
                id="email"
                type="email" 
                class="p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none"
                v-model="email.email"
              >
            </div>

            <!-- type of email -->
            <div  class="flex flex-2 flex-col pb-2">
              <div>
                <label for="email-type" class="mb-1 ml-2 text-xs text-dark-gray">
                  Тип почты
                </label>

                <select 
                  required
                  id="email-type"
                  class="webkit p-2 w-full text-gray-500 bg-light-grey focus:outline-none rounded-md"
                  v-model="email.type"
                >
                  <option disabled value="Укажите тип">Укажите тип</option>
                  <option value="Личный">Личный</option>
                  <option value="Рабочий">Рабочий</option>
                </select>
              </div>
            </div>

            <!-- Delete current email -->
            <div class="flex items-center place-content-between justify-end pb-2 mt-2">
              <div class="icon-wrapper">
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
            v-if="Emails.length"
            @click="addEmail"
            type="button"
            class="border border-blue w-full p-2 rounded-md text-blue mb-4 cursor-pointer"
          >
            Добавить еще email
          </button>
        </div>

        <!-- add social -->
        <div v-if="user && !socialNetworks.length" class="w-full flex place-content-between py-4">
          <p>Социальные сети не указаны</p>
          <p class="text-blue" @click="addSocial">Добавить</p>
        </div>
        <!--  -->
        <div class="w-full">
          <p v-if="socialNetworks.length" class="text-blue py-2">Добавляем социальные сети</p>

          <div class="phone-item" v-for="(social, index) in socialNetworks" :key="index">
            <!-- social link -->
            <div class="flex flex-2 flex-col pb-2">
              <label for="social-link" class="mb-1 ml-2 text-xs text-dark-gray">
                Укажите ссылку на аккаунт
              </label>
              <input 
                id="social-link"
                type="url" 
                class="p-2 w-full text-gray-500 bg-light-grey focus:outline-none rounded-md"
                v-model="social.link"
              >
            </div>

            <!-- name of social network -->
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
                  <option disabled value="Укажите название">Укажите название</option>
                  <option value="instagram">Инстаграм</option>
                  <option value="vkontakte">Вконтакте</option>
                  <option value="telegram">Телеграм</option>
                </select>
              </div>
            </div>

            <!-- Delete current social -->
            <div class="flex items-center place-content-between justify-end pb-2 mt-2">
              <div class="icon-wrapper">
                <img 
                  @click="deleteSocial(social.id)"
                  class="cursor-pointer" 
                  src="@/assets/images/common/icon-trash.svg" 
                  alt="">
              </div>
            </div>
          </div>

          <!-- Button to add new social to current contact -->
          <button 
            v-if="socialNetworks.length"
            @click="addSocial"
            type="button"
            class="border border-blue w-full p-2 rounded-md text-blue mb-4 cursor-pointer"
          >
            Добавить еще ссылку
          </button>
        </div>

        <!-- add event -->
        <div v-if="user && !contactEvents.length" class="w-full flex place-content-between py-4">
          <p>Нет событий</p>
          <p class="text-blue" @click="addContactEvent">Добавить</p>
        </div>
        <!--  -->
        <div class="w-full">
          <p v-if="contactEvents.length" class="text-blue py-2">Добавляем события контакта</p>

          <div class="phone-item" v-for="(event, index) in contactEvents" :key="index">
              <!-- title of event -->
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
              <!-- date of event -->
              <div class="flex flex-2 flex-col pb-2">
                <label for="event-date" class="my-1 ml-2 text-xs text-dark-gray">
                  Дата события
                </label>
                <input 
                  id="event-date"
                  type="date"
                  class="webkit bg-light-grey rounded-md h-10 p-2 w-full text-gray-500 focus:outline-none"
                  v-model="event.date"
                  placeholder="value"
                >
              </div>
              <!-- Delete current social -->
              <div class="flex items-center place-content-between justify-end pb-2 mt-2">
                <div class="icon-wrapper">
                  <img 
                    @click="deleteContactEvent(event.id)"
                    class="cursor-pointer" 
                    src="@/assets/images/common/icon-trash.svg" 
                    alt="">
                </div>
              </div>
          </div>  

          <!-- Button add new event to current contact -->
          <button 
            v-if="contactEvents.length"
            @click="addContactEvent"
            type="button"
            class="border border-blue w-full p-2 rounded-md text-blue mb-4 cursor-pointer"
          >
            Добавить еще событие
          </button>
        </div>

        <!-- add note -->
        <div v-if="user && !note" class="w-full flex place-content-between py-4">
          <p>Нет заметок</p>
          <p class="text-blue" @click="addNote">Добавить</p>
        </div>
        <!--  -->
        <div class="w-full" v-if="note">
          <div class="flex items-center place-content-between  pb-2 mt-2">
            <p  class="text-blue py-2">Добавляем заметку к контакту</p>
            <!-- Delete note -->
            <div class="icon-wrapper">
              <img 
                @click="addNote"
                class="cursor-pointer" 
                src="@/assets/images/common/icon-trash.svg" 
                alt="">
            </div>
          </div>
          <!-- Note -->
          <div class="w-full mt-2">
            <textarea placeholder="Текст заметки" v-model="contactNotes" class="p-2 bg-light-grey text-gray-500 rounded-md w-full focus:outline-none"></textarea>
          </div>
        </div>

        <!-- Button submit form -->
        <button type="submit" class="w-full my-4 cursor-pointer p-2 bg-dark text-white rounded-md font-normal">
          Создать Контакт
        </button>
      </form>
    </main>
  </div>
</template>

<script>
import Spinner from '../components/Spinner.vue';

import { ref, computed } from 'vue';
import store from '../store/index';
import { uid } from 'uid';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

  export default {
      name: "createContact",
      components: {
        Spinner
      },
      setup() {
        // Create data
        const router = useRouter();

        const statusMsg = ref(null);
        const errorMsg = ref(null);
        const user = computed(() => store.state.user)

        // Spiner
        const spinner = ref(false);

        const contactSurname = ref('');
        const contactName = ref('');
        const contactCompany = ref('');
        const contactNotes = ref('');
        
        const phoneNumbers = ref([]);
        const Emails = ref([]);
        const socialNetworks = ref([]);
        const contactEvents = ref([]);

        // has note
        const note = ref(null);

        const addNote = () => {
          note.value = !note.value;
          contactNotes.value = ''
        }

        // Add phone number
        const addPhoneNumber = () => {
          phoneNumbers.value.push({
            id: uid(),
            type: 'Укажите тип',
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

        // Add emails
        const addEmail = () => {
          Emails.value.push({
            id: uid(),
            type: 'Укажите тип',
            email: ''
          })
        }

        // Add social
        const addSocial = () => {
          socialNetworks.value.push({
            id: uid(),
            name: 'Укажите название',
            link: ''
          })
        }

        // Add contact events
        const addContactEvent = () => {
          contactEvents.value.push({
            id: uid(),
            title: '',
            date: '',
          })
        }

        // Delete current phone number
        const deletePhoneNumber = (id) => {
          if(phoneNumbers.value.length > 0) {
            phoneNumbers.value = phoneNumbers.value.filter(number => number.id !== id);
            return;
          }
          errorMsg.value = 'Error. Cannot remove, need to at least have one event';
          setTimeout(() => {
            errorMsg.value = false;
          }, 5000);
        }

        // Delete current email
        const deleteEmail = (id) => {
          if(Emails.value.length > 0) {
            Emails.value = Emails.value.filter(email => email.id !== id);
            return;
          }
          errorMsg.value = 'Error. Cannot remove, need to at least have one event';
          setTimeout(() => {
            errorMsg.value = false;
          }, 5000);
        }

        // Delete current social
        const deleteSocial = (id) => {
          if(socialNetworks.value.length > 0) {
            socialNetworks.value = socialNetworks.value.filter(social => social.id !== id);
            return;
          }
          errorMsg.value = 'Error. Cannot remove, need to at least have one event';
          setTimeout(() => {
            errorMsg.value = false;
          }, 5000);
        }

        // Delete current event
        const deleteContactEvent = (id) => {
          if(contactEvents.value.length > 0) {
            contactEvents.value = contactEvents.value.filter(event => event.id !== id);
            return;
          }
          errorMsg.value = 'Error. Cannot remove, need to at least have one event';
          setTimeout(() => {
            errorMsg.value = false;
          }, 5000);
        }

        // Create contact
        const createContact = async () => {
          // console.log('clicked button create contact')

          try {
            spinner.value = !spinner.value;
            const { error } = await supabase.from('myContacts').insert([
              {
                contactInfo: {
                  name: contactName.value,
                  surname: contactSurname.value,
                  company: contactCompany.value,
                  notes: contactNotes.value
                },
                contactEvents: contactEvents.value,
                phoneNumbers: phoneNumbers.value,
                socialNetworks: socialNetworks.value,
                Emails: Emails.value
              }
            ])

            if (error) throw error;

            statusMsg.value = 'Контакт успешно создан!'
            contactName.value = null;
            contactSurname.value = null;
            contactCompany.value = null;
            contactNotes.value = null

            setTimeout(() => {
              statusMsg.value = false;
              // В идеале переходить к только что созданному контакту
              // router.push({ name: 'Contacts' });
              router.go(-1)
            }, 2000)
          } catch (error) {
            errorMsg.value = `Error: ${error.message}`;
            setTimeout(() => {
              errorMsg.value = false;
            }, 5000)
          }
        }

        return {
          statusMsg, errorMsg, user, contactSurname, contactName, contactCompany, contactNotes, createContact, phoneNumbers, addPhoneNumber, addSocial, addContactEvent, deleteEmail, contactEvents, socialNetworks, Emails, deletePhoneNumber, deleteSocial, addEmail, deleteContactEvent, note, addNote, spinner 
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

  .item_fixed {
    posiition: fixed;
    width: 100%;
  }
</style>