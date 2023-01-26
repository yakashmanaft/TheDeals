<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>
        <!-- page header -->
        <Header 
            :title="pageTitle" 
            style="background-color: white"    
        />

        <!-- page navigation menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- Кнопка перехода к созданию нового контакта -->
        <create-button @click="setOpen"/>

        <!-- popup создания нового контакта -->
        <CreateNewContact 
            :is-open="isOpen"
            @closeModal="setOpen"
            @createContact="createNew"
            :contactData="contactData"
            @addPhoneNumber="addPhoneNumber"
            @addEmail="addEmail"
            @addAddress="addAddress"
            @deletePhoneNumber="deletePhoneNumber"
            @deleteEmail="deleteEmail"
            @addSocial="addSocial"
            @deleteSocial="deleteSocial"
            @addContactEvent="addContactEvent"
            @deleteContactEvent="deleteContactEvent"
        />
        
        <!-- page content -->
        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
            forceOverscroll="false"
        >
            <br>
            <br>
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myContacts.length === 0) && !spinner" class="no-data ion-padding-horizontal">
                <!-- настроить responsive под разные экраны -->
                <ion-img src="img/common/contact-sticker.webp" alt="нет контактов"></ion-img>
                <ion-text color="primary"><h2>У вас еще нет контактов...</h2></ion-text>
                <ion-text color="medium">Начните заполнять справочник уже сейчас</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && myContacts.length !== 0" class="ion-margin-bottom" style="padding-top: 2.2rem">
                <br>
                <!-- Search -->
                <ion-searchbar class="ion-text-left searchbar" placeholder="Поиск..." v-model="search"></ion-searchbar>
                <!-- Список контактов -->
                <ion-list>
                    <router-link
                        v-for="contact in searchedContacts"
                        :key="contact.id"
                        :to="{ name: 'View-Contact', params: { 
                                contactId: contact.id,
                                contactUid: contact.uid,
                                contact: JSON.stringify(contact)
                            }}"
                    >
                        <ion-item>
                            <ion-grid>
                                <ion-row>
                                    <ion-text>{{contact.contactInfo.surname}} {{contact.contactInfo.name}}</ion-text>
                                </ion-row>
                                <ion-row>
                                    <ion-text style="font-size: 1rem;" color="medium">{{ contact.contactInfo.company }}</ion-text>
                                </ion-row>
                            </ion-grid>

                        </ion-item>
                    </router-link>
                    <!-- Если поиском в списке контактов ничего не найдено -->
                    <ion-item lines="none" v-if="searchedContacts.length <= 0">
                        <ion-text color="medium">Ничего не найдено</ion-text>
                    </ion-item>
                </ion-list>

                <br>
                <br>
                <br>
            </div>


        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>

    import Header from '@/components/headers/Header.vue'
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import Spinner from '@/components/Spinner.vue';
    import CreateNewContact from '@/components/modal/NewContact-modalCreate.vue';
    import Footer from '../components/Footer.vue'
    //
    import { 
        IonContent, 
        IonHeader,
        //
        IonGrid,
        IonRow,
        //
        IonList,
        IonItem, 
        IonText,
        IonImg,
        IonButton,
        IonButtons,
        IonTitle, 
        IonToolbar,
        IonSearchbar,
        IonModal,
        IonLabel,
        IonInput 
    } from '@ionic/vue';
    // import {  } from 'ionicons/icons';
    import store from '../store/index';
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { searchFilter } from '../helpers/filterMyContacts.js'; 
    import { uid } from 'uid';


    export default defineComponent({
        name: 'Contacts',
        components: {
            Header,
            NavigationMenu,
            CreateButton,
            Spinner,
            CreateNewContact,
            Footer,
            //
            IonSearchbar,
            IonInput,
            IonModal,
            IonItem,
            IonButtons,
            IonTitle,
            IonToolbar,
            IonLabel,
            IonHeader,
            IonContent, 
            IonList,
            IonGrid,
            IonRow,
            IonImg,
            IonText,
            IonButton,
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            console.log(userEmail.value)
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;
            // Logout function
            // const logout = async () => {
            //     await supabase.auth.signOut();
            //     router.push({ name: 'Login' })
            // }

            // 
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myContacts = ref([])


            // Подтягиваем список контактов из store
            spinner.value = true
            onMounted( async () => {
                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
                spinner.value = false
                dataLoaded.value = true;
            })

            // функция поиска контакта с помощью search
            const search = ref('');
            const searchedContacts = computed(() => {
                return searchFilter(myContacts.value, search.value)
            })

            // =====================================
            // Work with Modal Create New Contact
            const isOpen = ref(false);

            // Изменяемый шаблон нового контакта
            const contactData = ref({
                uid: uid(),
                email: userEmail.value,
                contactInfo: {
                    name: '',
                    surname: '',
                    company: '',
                    note: ''
                },
                phoneNumbers: [],
                emails: [],
                socialNetworks: [],
                contactEvents: [],
                addresses: [],
            })

            // При закрытии или открытии modal очищаем шаблон контакта
            const setOpen = () => {
                spinner.value = false
                isOpen.value = !isOpen.value;
                contactData.value = {
                    uid: uid(),
                    email: userEmail.value,
                    contactInfo: {
                        name: '',
                        surname: '',
                        company: '',
                        note: ''
                    },
                    phoneNumbers: [],
                    emails: [],
                    socialNetworks: [],
                    contactEvents: [],
                    addresses: [],
                }
            };
            // Добавляем телефоны к объекту контакта
            // Оптимизировать в одну функцию добавления
            const addPhoneNumber = () => {
                contactData.value.phoneNumbers.push({
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
            // Добавляем emails к объекту контакта
            // Оптимизировать в одну функцию добавления
            const addEmail = () => {
                contactData.value.emails.push({
                    id: uid(),
                    type: '',
                    email: ''
                })
            }
            // Добавляем addresses к объекту контакта
            // Оптимизировать в одну функцию добавления
            const addAddress = () => {
                contactData.value.addAddress.push({
                    id: uid(),
                    type: '',
                    address: ''
                })
            }

            // Добавляем social networks к объекту контакта
            // Оптимизировать в одну функцию добавления
            const addSocial = () => {
                contactData.value.socialNetworks.push({
                    id: uid(),
                    name: '',
                    link: ''
                })
            }
            // Добавляем ContactEvents к объекту контакта
            // Оптимизировать в одну функцию добавления
            const addContactEvent = () => {
                contactData.value.contactEvents.push({
                    id: uid(),
                    title: '',
                    date: '',
                    show: false
                })
            }
            // Удаляем телефон у создаваемого контакта
            // Оптимизировать в одну функцию удаления
            const deletePhoneNumber = (id) => {
                contactData.value.phoneNumbers = contactData.value.phoneNumbers.filter(number => number.id !== id);
                return;
            }
            // Удаляем email у создаваемого контакта
            // Оптимизировать в одну функцию удаления
            const deleteEmail = (id) => {
                contactData.value.emails = contactData.value.emails.filter(email => email.id !== id);
                return;
            }
            // Удаляем social у создаваемого контакта
            // Оптимизировать в одну функцию удаления
            const deleteSocial = (id) => {
                contactData.value.socialNetworks = contactData.value.socialNetworks.filter(social => social.id !== id);
                return;
            }
            // Удаляем event у создаваемого контакта
            // Оптимизировать в одну функцию удаления
            const deleteContactEvent = (id) => {
                contactData.value.contactEvents = contactData.value.contactEvents.filter(event => event.id !== id);
                return;
            }
            // Создаем новый контакт
            const createNew = async (newContactData) => {
                // принимаем инфу по контакту из modal
                contactData.value = newContactData;
                spinner.value = true;
                // Если строки Имя Фамилия пустые или не пустые 
                if(contactData.value.contactInfo.name === '') {
                    alert('Имя не может быть пустой строкой')
                } else if (contactData.value.contactInfo.surname === '') {
                    alert('Фамилия не может быть пустой строкой')
                } else {
                    try { 
                        // Добавляем в БД инфу по новому контакту
                        // Скорей всего надо будет вынести в store или нет
                        const { error } = await supabase.from('myContacts').insert([contactData.value])
                        if (error) throw error;
                        // обновляем массив в store
                        await store.methods.getMyContactsFromDB()
                        myContacts.value = store.state.myContactsArray
                        // ищем созданный новый контакт в массиве всех контактов в store (по uid)
                        const newContact = myContacts.value.find(el => el.uid === contactData.value.uid)
                        // закрываем modal
                        isOpen.value = false
                        // переходим на страницу созданного нового контакта
                        router.push({name: 'View-Contact', params: { contactId: newContact.id, contact: JSON.stringify(newContact)}})
                    } catch ( error) {
                        alert(`Error: ${error.message}`)
                    }
                }
            }



            return {
                user, router, pageTitle, userEmail, myContacts, spinner, dataLoaded, search, searchedContacts, isOpen, setOpen, createNew, contactData, addPhoneNumber, addEmail, deletePhoneNumber, deleteEmail, addSocial, deleteSocial, addContactEvent, deleteContactEvent, addAddress
            }
        }
    })


</script>

<style scoped>
    ion-img {
        height: 50vh;
    }
    .no-data {
        /* height: 80vh;  */
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .no-data ion-img {
        width: 60%
    }
    .searchbar {
        position: fixed;
        z-index: 99999;
        top: 2.5rem;
    }
    ion-searchbar {
        background-color: white;
    }
</style>