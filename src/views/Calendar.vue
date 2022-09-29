<template>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle" />

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

            <div>
                <!-- <ion-datetime
                    minute-values="0,15,30,45"
                    day-values="5,10,15, 18, 20,25,"
                    presentation="date"
                    size="cover"
                    @ionChange="doSomething"
                    v-model="choosenDate"
                    :first-day-of-week="1"
                    locale="ru"
                ></ion-datetime> -->
                <ion-datetime
                    minute-values="0,15,30,45"
                    presentation="date"
                    size="cover"
                    @ionChange="doSomething"
                    v-model="choosenDate"
                    :first-day-of-week="1"
                    locale="ru"
                ></ion-datetime>
                <ion-item-group>
                    <ion-text>
                        На эту дату запланировано 2 дела
                    </ion-text>
                    {{choosenDate}}
                </ion-item-group>
            </div>
            

            <br>
            <br>
            <div>
                {{myDeals}}
            </div>
            <!--  -->
            <br>
            <div>
                {{dealsByChoosenDate}}
            </div>
        </ion-content>
</template>

<script>
    import { defineComponent, ref, onMounted } from 'vue';
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import Header from '../components/headers/Header.vue';
    import Spinner from '../components/Spinner.vue';
    import { 
    IonContent, 
    IonHeader, 
    IonItem, 
    IonList, 
    IonMenu, 
    IonMenuToggle,
    IonButton,
    IonTitle, 
    IonToolbar,
    IonIcon,
    IonText,
    IonItemGroup
    } from '@ionic/vue';
    import { menu } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import NavigationMenu from '../components/NavigationMenu.vue';
    import { IonDatetime } from '@ionic/vue';


    export default defineComponent({
        name: 'calendar',
        components: {
            Header,
            IonContent, 
            IonHeader, 
            IonItem, 
            IonList, 
            IonMenu, 
            IonMenuToggle,
            IonButton,
            IonTitle, 
            IonToolbar,
            IonIcon,
            IonText,
            IonItemGroup,
            NavigationMenu,
            IonDatetime,
            Spinner
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;
            // Пеменная для выбранной в календаре даты
            const choosenDate = ref();
            //
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myDeals = ref([]);
            //
            const doSomething = () => {
                console.log('clicked')
                // Смотри ion-datetime Events
                console.log(formattedDate(choosenDate.value))
                return choosenDate.value
            }
            // 
            onMounted(async () => {
                await store.methods.getMyDealsFromBD()
                myDeals.value = store.state.myDealsArray
                spinner.value = false
                dataLoaded.value = true 
                // refreshData()
            })
            //
            const dealsByChoosenDate = ref()
            //
            dealsByChoosenDate.value = myDeals.value.filter(deal => deal.executionDate === choosenDate.value)
            // функция форматирования даты для сравнения даты дела и выбранной даты
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }

            return {
                menu, user, router, pageTitle, choosenDate, doSomething, spinner, dataLoaded, myDeals, dealsByChoosenDate
            }
        }
    })
</script>

<style scoped>
    ion-datetime {
        --background: #ffffff;
        --background-rgb: 255,255,255;
    }
</style>