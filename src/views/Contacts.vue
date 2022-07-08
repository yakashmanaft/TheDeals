<template>
    <div>
        <!-- page header -->
        <Header :title="pageTitle" />

        <!-- page navigation menu -->
        <navigation-menu/>

        <!-- Кнопка перехода к созданию нового контакта -->
        <create-button @click="setOpen(true)"/>

        <!-- popup создания нового контакта -->
        <!-- <new-contact-modal :isOpen="isOpen"/> -->
        
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
                123
            </div>

            <!-- Data -->
            <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="search"></ion-searchbar>

            <router-link
                v-for="contact in searchedContacts"
                :key="contact.id"
                :to="{ name: 'View-Contact', params: { contactId: contact.id } }"
            >
                {{contact.contactInfo.surname}}

            </router-link>
            {{contactInfo}}

            <ion-modal :is-open="isOpen">
                <ion-header>
                    <ion-toolbar>
                        <ion-buttons slot="start">
                            <ion-button @click="setOpen(false)">Отменить</ion-button>
                        </ion-buttons>
                        <ion-title>Контакт</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="willDismiss()">Создать</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-item>
                        <ion-label position="stacked">Enter your name</ion-label>
                        <ion-input v-model="contactName" type="text" placeholder="Your name"></ion-input>
                    </ion-item>
                    <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
                    reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
                    dicta.
                    </p>
                </ion-content>
            </ion-modal>

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
        IonItem, 
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
    import NewContactModal from '@/components/Create/NewContactModal.vue';


    export default defineComponent({
        name: 'Contacts',
        components: {
            Header,
            IonContent, 
            IonButton,
            NavigationMenu,
            CreateButton,
            Spinner,
            IonSearchbar,
            IonInput,
            NewContactModal,
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


            const contactInfo = ref({})
            const contactName = ref()


            const setOpen = (boolean) => {
                isOpen.value = boolean;
                contactInfo.value = {};
                // Не может быть пустым или null
                contactName.value = null
            };

            const willDismiss = () => {
                isOpen.value = false
                contactInfo.value = {
                    name: contactName.value
                }
            }


            return {
                user, router, logout, pageTitle, myContacts, spinner, dataLoaded, search, searchedContacts, contactInfo, contactName, isOpen, setOpen, willDismiss
            }
        }
    })


</script>

<style scoped>

</style>