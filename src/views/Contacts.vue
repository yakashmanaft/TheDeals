<template>
    <div>
        <!-- page header -->
        <Header :title="pageTitle" />

        <!-- page navigation menu -->
        <navigation-menu/>

        <!-- Кнопка перехода к созданию нового контакта -->
        <create-button @click="setOpen(true)"/>

        <!-- popup создания нового контакта -->
        <CreateNewContact 
            :is-open="isOpen"
            @closeModal="setOpen(false)"
            @createContact="willDismiss"
        />
        
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page content -->
        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
        >

            <br>
            <br>
            <br>
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myContacts.length === 0) && !spinner">
                    <!-- настроить responsive под разные экраны -->
                    <ion-img src="img/common/contact-sticker.webp"></ion-img>
                    <ion-text color="primary"><h2>У вас еще нет контактов...</h2></ion-text>
                    <ion-text>Самое время начать заполнение справочника заказчиками, коллегами. <br>И не забывайте про близких!</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded" >
                <!-- Search -->
                <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="search"></ion-searchbar>
    
                <!-- Список контактов -->
                <ion-list>
                    <router-link
                        v-for="contact in searchedContacts"
                        :key="contact.id"
                        :to="{ name: 'View-Contact', params: { 
                                contactId: contact.id,
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

            </div>
            {{contactInfo}}

        </ion-content>
    </div>
</template>

<script>

    import Header from '@/components/Header.vue'
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import Spinner from '@/components/Spinner.vue';
    import { 
        IonContent, 
        IonHeader,
        //
        IonGrid,
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
    import CreateNewContact from '@/components/modal/CreateNewContact.vue';


    export default defineComponent({
        name: 'Contacts',
        components: {
            Header,
            IonContent, 
            IonList,
            IonGrid,
            IonImg,
            IonText,
            IonButton,
            NavigationMenu,
            CreateButton,
            Spinner,
            IonSearchbar,
            IonInput,
            CreateNewContact,
            //
            IonModal,
            IonItem,
            IonButtons,
            IonTitle,
            IonToolbar,
            IonLabel,
            IonHeader
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;
            // Logout function
            const logout = async () => {
                await supabase.auth.signOut();
                router.push({ name: 'Login' })
            }

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

            //
            const isOpen = ref(false);

            const setOpen = (boolean) => {
                isOpen.value = boolean;
                contactInfo.value = {};
                // Не может быть пустым или null
                contactName.value = null
            };

            const contactInfo = ref({});
            const contactName = ref();

            const willDismiss = (namecontact) => {
                isOpen.value = false
                contactName.value = namecontact
                contactInfo.value = {
                    name: contactName.value
                }
                // Типа имитиция 
                router.go('Contacts')
            }



            return {
                user, router, logout, pageTitle, myContacts, spinner, dataLoaded, search, searchedContacts, contactInfo, contactName, isOpen, setOpen, willDismiss
            }
        }
    })


</script>

<style scoped>

</style>