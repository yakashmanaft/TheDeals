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
                    @ionChange="chooseDate"
                    v-model="choosenDate"
                    :first-day-of-week="1"
                    locale="ru"
                ></ion-datetime> -->
                <ion-datetime
                    minute-values="0,15,30,45"
                    presentation="date"
                    size="cover"
                    @ionChange="chooseDate"
                    v-model="choosenDate"
                    :first-day-of-week="1"
                    locale="ru"
                ></ion-datetime>
                <ion-item-group>
                    <div v-if="choosenDate">
                        <ion-text v-if="dealsByChoosenDate.length > 0">
                            Запланированных дел: {{dealsByChoosenDate.length}}
                        </ion-text>
                        <ion-text v-if="dealsByChoosenDate.length === 0">
                            Нет запланированных дел
                        </ion-text>
                    </div>
                    <ion-text v-else>
                        Выберите дату
                    </ion-text>
                </ion-item-group>
                <!-- {{choosenDate}} -->
            </div>
            

            <br>
            <br>
            <div>
                <!-- {{myDeals}} -->
            </div>
            <!--  -->
            <br>
            <div>
                {{dealsByChoosenDate}}
            </div>
            <!-- Модалка дел по выбранной дате -->
            <ViewChoosenDate
                :is-open="isViewChoosenDateOpened"
                @closeModal="closeViewChoosenDate"
                :deals="dealsByChoosenDate"
                :date="choosenDate"
            />
        </ion-content>
</template>

<script>
    import { defineComponent, ref, onMounted, watch } from 'vue';
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import Header from '../components/headers/Header.vue';
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '../components/NavigationMenu.vue';
    import ViewChoosenDate from '../components/modal/ViewChoosenDate.vue'
    //
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
        IonItemGroup,
        IonDatetime
    } from '@ionic/vue';
    //
    import { menu } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';



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
            Spinner,
            ViewChoosenDate
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
            // массив дел под конкретную дату
            const dealsByChoosenDate = ref([])
            // функция запускается при клике на дату в календаре
            const chooseDate = () => {
                // Смотри ion-datetime Events
                console.log(formattedDate(choosenDate.value))
                // return choosenDate.value
                // console.log(choosenDate.value)
                isViewChoosenDateOpened.value = true
            }
            // 
            onMounted(async () => {
                await store.methods.getMyDealsFromBD()
                myDeals.value = store.state.myDealsArray
                spinner.value = false
                dataLoaded.value = true 
                // refreshData()
                if(choosenDate.value) {
                    dealsByChoosenDate.value = myDeals.value.filter(deal => formattedDate(deal.executionDate) === formattedDate(choosenDate.value))
                }
            })
            // фильтруем дела по выбранную дату
            // функция форматирования даты для сравнения даты дела и выбранной даты
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }
            //
            // const showdate = () => {

            // }
            // Массив дел по выбранной дате
            const dealsArray = ref([])
            // Когда выбираем дату (choosenDate.value уже имеет значение)
            watch(choosenDate, () => {
                dealsByChoosenDate.value = myDeals.value.filter(deal => {
                    if(formattedDate(deal.executionDate) === formattedDate(choosenDate.value)) {
                        dealsArray.value.push(deal)
                        return deal
                    }
                })
                console.log(dealsByChoosenDate.value.length)
                // расчет количества дел по выбранной дате
            })
            // Управление модалкой просмотра даты
            const isViewChoosenDateOpened = ref(false)
            //
            const closeViewChoosenDate = () => {
                isViewChoosenDateOpened.value = false
                // dealsByChoosenDate.value = []
                // choosenDate.value = null
            }

            return {
                menu, user, router, pageTitle, choosenDate, chooseDate, spinner, dataLoaded, myDeals, dealsByChoosenDate, dealsArray, isViewChoosenDateOpened, closeViewChoosenDate
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