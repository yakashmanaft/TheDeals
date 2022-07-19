<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle" />

        <!-- Кнопка перехода к созданию нового дела -->
        <create-button @click="setOpen"/>

        <!-- popup создания нового дела -->
        <CreateNewDeal
            :isOpen="isOpen"
            @closeModal="setOpen"
            @createDeal="createNew"
            :dealData="dealData"
        />

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
            <div v-if="(!dataLoaded || myDeals.length === 0) && !spinner" class="ion-padding-horizontal">
                <ion-img style="height: 30vh;" src="img/common/deals-sticker.webp" alt="нет дел"></ion-img>
                <ion-text color="primary"><h2>У вас еще нет дел...</h2></ion-text>
                <ion-text>Самое время начать заниматься деятельностью. <br>И создать первое дело!</ion-text>
            </div>
            <!-- Data -->
            <div v-if="dataLoaded && myDeals.length !== 0">

                <!-- Статусы дел -->
                <div class="horizontal-scroll">
                    <ion-chip v-for="(status, index) in dealStatusList" :key="index" @click="setDealStatus(status.name)">
                        <ion-label>{{ status.title }} 1</ion-label>
                    </ion-chip>
                    <ion-chip color="primary" outline="true">
                        <ion-label color="primary">Secondary Label</ion-label>
                    </ion-chip>
                </div>
                Выбран статус: {{ currentDealStatus }}
                {{foundDealsByStatus.length}}

                <!-- Карточки дел-->
                <div v-for="(day, idx) in getExecutionDate(days)" :key="idx">
                    {{day}}
                    <div 
                        v-for="deal in foundDealsByStatus" 
                        :key="deal.id"
                        >
                        <!-- {{ deal.executionDate }} -->
                        
                        <router-link 
                            v-if="formattedDate(deal.executionDate) === day"
                            :to="{ name: 'View-Deal', params: { 
                                    dealId: deal.id,
                                    dealUid: deal.uid,
                                    deal: JSON.stringify(deal)
                                }}"
                        >
                            <ion-card>
                                {{deal}}
                            </ion-card>
                        </router-link>
                    </div>
                </div>


            </div>
        </ion-content>
    </div>
</template>

<script>

    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue'
    import Spinner from '@/components/Spinner.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import CreateNewDeal from '@/components/modal/CreateNewDeal.vue';
    import { 
        IonContent, 
        IonHeader, 
        IonItem, 
        IonImg,
        IonList, 
        IonMenu, 
        IonMenuToggle,
        IonButton,
        IonTitle, 
        IonToolbar,
        IonIcon,
        IonText,
        IonChip,
        IonLabel,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonVirtualScroll,
        IonCard
    } from '@ionic/vue';
    import { defineComponent, ref, computed, onMounted, watch } from 'vue';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { uid } from 'uid';
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale'

    export default defineComponent({
        name: 'Deals',
        components: {
            Header,
            Spinner,
            CreateButton,
            CreateNewDeal,
            IonContent, 
            IonHeader, 
            IonItem, 
            IonImg,
            IonList, 
            IonMenu, 
            IonMenuToggle,
            IonButton,
            IonTitle, 
            IonToolbar,
            IonIcon,
            IonText,
            NavigationMenu,
            IonChip,
            IonLabel,
            IonItemOption,
            IonItemOptions,
            IonItemSliding,
            IonVirtualScroll,
            IonCard
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

            // 
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myDeals = ref([]);
            // счетчик количества дел по конкретному статусу
            // const countDealsByCurrentStatus = ref(null);

            // Статусы дел
            const dealStatusList = ref(store.state.dealStatusList)
            //Все даты по конкретному статусу
            const daysArray = ref([])
            // уникальные даты по конкретному статусу
            const days = ref([])
            // Подтягиваем список дел из store
            spinner.value = true;
            onMounted( async() => {
                // daysArray.value = []
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
                spinner.value = false
                dataLoaded.value = true;
                daysArray.value = []
                days.value = []
                foundDealsByStatus.value = myDeals.value.filter(deal => {
                    // Задаем формат отображения для даты полеченных дел
                    const executionDate = formattedDate(new Date(deal.executionDate).toISOString().split("T")[0])
                    if(deal.dealStatus === currentDealStatus.value) {
                        daysArray.value.push(executionDate)
                        return deal.dealStatus === currentDealStatus.value
                    } 
                })
            })

            // Получаем массив форматированных к показу дат
            const getExecutionDate = (days) => {
                // Сортируем от ближайшей даты и по удалению от сегодня
                daysArray.value.sort()
                // исключаем дубли дат
                days = new Set(daysArray.value)
                return days
            }

            // функция форматирования даты для сравнения даты дела и даты дня
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }

            // Выбранный к показу статус дел
            const currentDealStatus = ref('deal-in-booking');

            // Следим за изменением статуса дела и запускаем функцию показа
            watch(currentDealStatus, (currentValue) => {
                console.log(currentValue)
                daysArray.value = []
                days.value = []
                // 
                foundDealsByStatus.value = myDeals.value.filter(deal => {
                    // Задаем формат отображения для даты полеченных дел
                    const executionDate = formattedDate(new Date(deal.executionDate).toISOString().split("T")[0])
                    if(deal.dealStatus === currentDealStatus.value) {
                        daysArray.value.push(executionDate)
                        return deal.dealStatus === currentDealStatus.value
                    } 
                })            
            })
            
            // =======================================
            // Work with Modal Create New Deal
            const isOpen = ref(false)
            // Изменяемый шаблон нового дела
            const dealData = ref({
                uid: uid(),
                email: userEmail.value,
            })

            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
                isOpen.value = !isOpen.value;
                dealData.value = {
                    uid: uid(),
                    email: userEmail.value,
                }
            }

            // Создаем новую сделку
            const createNew = async (newDealData) => {
                console.log(newDealData)
            }

            //
            const foundDealsByStatus = ref([])
            //
            const setDealStatus = (name) => {
                currentDealStatus.value = name
            }

            //

            return {
                user, router, pageTitle, userEmail, createNew, myDeals, spinner, dataLoaded, isOpen, dealData, setOpen, setDealStatus, currentDealStatus, dealStatusList, foundDealsByStatus, daysArray, days, getExecutionDate, formattedDate
            }
        }
    })
</script>

<style scoped>
    ion-img {
        height: 50vh;
    }

    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }

    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
</style>