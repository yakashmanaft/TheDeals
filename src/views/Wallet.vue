<template>
    <div>
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
            forceOverscroll="false"
        >
            <br>
            <br>
            <!-- page content -->
            <!-- NO data -->
            <div v-if="(!dataLoaded || myDeals.length === 0) && !spinner" class="ion-margin-top">
                <br>
                Данных не обнаружено. База пуста...
            </div>

            <!-- Data available -->
            <div v-if="dataLoaded && myDeals.length !== 0">
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
                <br>
                <br>
                <ion-grid class="ion-no-padding">
                    <ion-row>
                        Количество дел: {{ myDeals.length }}
                        
                    </ion-row>
                </ion-grid>
                <br>
                Моя задолженность в {{ currency }} <br>
                {{myDebt.toFixed(2)}}
                <br>
                <br>
                Мне должны в {{ currency }} <br>
                {{debtToMe.toFixed(2)}} 
                <ion-card class="ion-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <div class="ion-text-left">
                            <ion-text style="font-size: 1.2rem; font-weight: bold">Аналитика бизнеса</ion-text><br>
                            <ion-text>Портфель, баланс</ion-text>
                        </div>
                        <div style="width: 3rem; height: 3rem; background-color: black; border-radius: 100%; display: flex; align-items: center; justify-content: center;">
                            <ion-icon :icon="statsChartOutline" color="light" style="font-size: 1.5rem"></ion-icon>
                        </div>
                    </ion-row>
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
            // Временно обзавем данные
            const myDeals = ref([]);
            // Подтягиваем список дел из store
            spinner.value = true;
            //
            onMounted( async () => {
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
                spinner.value = false;
                dataLoaded.value = true;
                //
                calculateBalance()
            })
            //
            const availableBalance = ref(0);
            const myDebt = ref(0);
            const debtToMe = ref(0);
            // 
            const calculateBalance = () => {
                console.log('calculate...')
                // Массив сумм, которые мне уже вносили по делам продаж
                let payMeArray = []
                let payMe = 0
                // Массив сумм, которые я уже вносил по делам закупок
                let iPayArray = []
                let iPay = 0
                // Массив моих задолженностей
                let myDebtsArray = []
                let myDebts = 0
                // Массив покупательских задолженностей
                let debtsToMeArray = []
                let debtsToMe = 0
                //
                myDeals.value.forEach(item => {
                    if(item.dealType === 'sale') {
                        payMeArray.push(item.dealPaid)
                        debtsToMeArray.push(item.totalDealPrice - item.dealPaid)
                    } else if (item.dealType === 'buy') {
                        iPayArray.push(item.dealPaid)
                        myDebtsArray.push(item.totalDealPrice - item.dealPaid)
                    }
                })
                // суммируем значения в массивах, считаем текущий баланс
                payMe = payMeArray.reduce((a, b) => a + b, 0)
                iPay = iPayArray.reduce((a, b) => a + b, 0)
                availableBalance.value = payMe - iPay
                // 
                myDebts = myDebtsArray.reduce((a, b) => a + b, 0)
                myDebt.value = myDebts
                //
                debtsToMe = debtsToMeArray.reduce((a, b) => a + b, 0)
                debtToMe.value = debtsToMe 
            }
            //
            const putInWallet = () => {
                alert('Хотите пополнить кошелек? В разработке...')
            }
            //
            const makeAPay = () => {
                alert('Хотите оплатить? В разработке...')
            }

            return {
                menu, user, router, pageTitle, myDeals, spinner, dataLoaded, currency, availableBalance, myDebt, debtToMe, calculateBalance, statsChartOutline, putInWallet, makeAPay
            }
        }
    })
</script>

<style scoped>

</style>