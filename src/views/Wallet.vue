<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- page header -->
        <Header :title="pageTitle" />

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
            <!-- NO data -->
            <div v-if="(!dataLoaded || myDeals.length === 0) && !spinner" class="ion-margin-top">
                <br>
                <!-- Данных не обнаружено. База пуста... -->
                Данных о делах не обнаружено...
            </div>

            <!-- Data available -->
            <div v-if="dataLoaded">
                <br>
                <br>
                <div class="ion-margin-vertical" style="font-size: 2.5rem; font-weight: bold">{{availableBalance.toFixed(2)}} {{currency}}</div>
                <br>
                <br>
                <ion-grid>
                    <ion-row class="ion-justify-content-center">
                        <ion-button color="dark" @click="putInWallet()">Пополнить</ion-button>
                        <ion-button color="dark" @click="makeAPay()">Оплатить</ion-button>
                    </ion-row>
                </ion-grid>
                <!-- Переместить в раздел уже конкретно об аналитике -->
                <!-- <ion-grid class="ion-no-padding">
                    <ion-row>
                        Количество дел (всего): {{ myDeals.length }} <br>
                        Бронь даты: {{ bookingDeals.length }}<br>
                        В процессе: {{ dealsInProcess.length }} <br>
                        В доставке: {{ deliveryDeals.length }} <br>
                        Дела с долгом: {{ debtDeals.length }} <br>
                        Завершенные: {{ completeDeals.length }} <br>
                        Отмененные: {{ cancelledDeals.length }} <br>
                    </ion-row>
                </ion-grid> -->
                <br>
                <br>

                <!--  -->
                <ion-grid class="ion-text-left ion-padding-horizontal ion-margin-horizontal">
                    <ion-row class="ion-justify-content-between">
                        <ion-text>Моя задолженность</ion-text>
                        <ion-text color="primary" @click="goToChoosenDeals">{{myDebt.toFixed(2)}} {{ currency }}</ion-text>
                    </ion-row>
                </ion-grid>

                <!--  -->
                <ion-grid class="ion-text-left ion-padding-horizontal ion-margin-horizontal ion-margin-top">
                    <ion-row class="ion-justify-content-between">
                        <ion-text>Мне должны</ion-text>
                        <ion-text color="primary" @click="goToChoosenDeals">{{debtToMe.toFixed(2)}} {{ currency }}</ion-text>
                    </ion-row>
                </ion-grid>

                <!--  -->
                <br>
                <ion-card class="ion-padding">
                    <router-link :to="{ name: 'userFinance' }">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <div class="ion-text-left">
                                <ion-text style="font-size: 1.2rem; font-weight: bold; color: black">Аналитика финансов</ion-text><br>
                                <ion-text>История транзакций, бюджеты</ion-text>
                            </div>
                            <div style="width: 3rem; height: 3rem; background-color: black; border-radius: 100%; display: flex; align-items: center; justify-content: center;">
                                <ion-icon :icon="statsChartOutline" color="light" style="font-size: 1.5rem"></ion-icon>
                            </div>

                        </ion-row>
                    </router-link>
                </ion-card>

            </div>
        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import Header from '../components/headers/Header.vue'
    import { 
        IonContent, IonGrid, IonRow, IonCard, IonText, IonIcon, IonCol, IonButton
    } from '@ionic/vue';
    import { menu, statsChartOutline } from 'ionicons/icons';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Spinner from '@/components/Spinner.vue'


    export default defineComponent({
        name: 'wallet',
        components: {
            Header,
            IonContent, 
            NavigationMenu,
            Spinner,
            IonGrid,
            IonRow,
            IonCard,
            IonText,
            IonIcon,
            IonCol,
            IonButton
        },
        setup() {
            // Currency
            const currency = ref(store.state.systemCurrency.name)
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            console.log(userEmail.value)
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const spinner = ref(null)
            const dataLoaded = ref(null);
            // Все дела
            const myDeals = ref([]);
            const bookingDeals = ref([]);
            const dealsInProcess = ref([]);
            const debtDeals = ref([]);
            const deliveryDeals = ref([]);
            const completeDeals = ref([]);
            const cancelledDeals = ref([]);
            // Подтягиваем список дел из store
            spinner.value = true;
            //
            const availableBalance = ref(0);
            const myDebt = ref(0);
            const debtToMe = ref(0);
            //
            onMounted( async () => {
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
                spinner.value = false;
                dataLoaded.value = true;
                //
                // calculateBalance()
                store.methods.calculateBalance(myDeals.value)
                availableBalance.value = store.state.availableBalance
                myDebt.value = store.state.myDebt
                debtToMe.value = store.state.debtToMe
                //

            })
            // 
            const putInWallet = () => {
                alert('Хотите пополнить кошелек? В разработке...')
            }
            //
            const makeAPay = () => {
                alert('Хотите оплатить? В разработке...')
            }
            console.log(store.state.availableBalance)
            //
            const goTo = () => {
                alert('Wallet: в разработке...')
            }
            //
            const goToChoosenDeals = () => {
                alert('Wallet: хотите перейти к просмотру? В разработке...')
            }

            return {
                menu, user, router, pageTitle, myDeals, spinner, dataLoaded, currency, availableBalance, myDebt, debtToMe, statsChartOutline, putInWallet, makeAPay, goTo, dealsInProcess, completeDeals, cancelledDeals, bookingDeals, deliveryDeals, debtDeals, goToChoosenDeals
            }
        }
    })
</script>

<style scoped>

</style>