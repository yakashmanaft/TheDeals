<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <Header :title="pageTitle" />

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
            <div v-if="(!dataLoaded || myData.length === 0) && !spinner" class="no-data ion-padding-horizontal">
                <ion-text>Пока пусто</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && myData !== 0" class="ion-text-left ion-margin-bottom ion-padding-horizontal">

                <!--  -->
                <div v-for="(date, idx) in getTransactionDateArray()" :key="idx" class="ion-margin-top">

                    <!-- Дата -->
                    <ion-text>
                        <h2>
                            <!-- Применить СЕГОДНЯ ВЧЕРА если даты соответствуют -->
                            {{date}}
                        </h2>
                    </ion-text>

                    <!-- Транзакция -->
                    <div v-for="transaction in myData" :key="transaction.id">
                        <div v-if="formattedDate(transaction.created_at) === date">
                            <!-- <ion-text>dealID: {{transaction.dealID}}</ion-text><br>
                            <ion-text>uid: {{transaction.uid}}</ion-text><br>
                            <ion-text>created_at: {{transaction.created_at}}</ion-text><br>
                            <ion-text>contactID: {{transaction.contactID}}</ion-text><br>
                            <ion-text>dealType: {{transaction.dealType}}</ion-text><br>
                            <ion-text>amount: {{transaction.amount}}</ion-text> -->

                            <!--  -->
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-align-items-center ion-justify-content-between">

                                    <!-- Иконка Контакт и тип транзакции -->
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-align-items-center ">
                                            
                                            <div class="transaction_icon" :class="[transaction.dealType === 'sale' ? 'transaction_icon-income': 'transaction_icon-outcome']">
                                                <ion-icon v-if="transaction.dealType === 'buy'" :icon="arrowUpOutline" color="light"></ion-icon>
                                                <ion-icon v-if="transaction.dealType === 'sale'" :icon="arrowDownOutline" color="light"></ion-icon>
                                            </div>
        
                                            <div class="ion-margin-start">
                                                <ion-text>
                                                    {{transaction.contactID}}
                                                </ion-text>
        
                                                <div>
                                                    <ion-text v-if="transaction.dealType === 'sale'">
                                                        Поступление
                                                    </ion-text>
                                                    <ion-text v-if="transaction.dealType === 'buy'">
                                                        Оплата
                                                    </ion-text>
                                                </div>
                                            </div>
                                        </ion-row>
                                    </ion-grid>

                                    <!-- Сумма транзакции и deal ID -->
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-justify-content-end">
                                            <ion-text>{{ transaction.amount }} {{currency}}</ion-text>
    
                                            <ion-text>К делу (Это ссылка)</ion-text>
                                        </ion-row>
                                    </ion-grid>
                                </ion-row>
                            </ion-grid>
                        </div>
                    </div>
                </div>

                <!--  -->
                <!-- <div v-for="(item, index) in myData" :key="index" class="ion-margin-top">
                    <ion-text>dealID: {{item.dealID}}</ion-text><br>
                    <ion-text>uid: {{item.uid}}</ion-text><br>
                    <ion-text>created_at: {{item.created_at}}</ion-text><br>
                    <ion-text>contactID: {{item.contactID}}</ion-text><br>
                    <ion-text>dealType: {{item.dealType}}</ion-text><br>
                    <ion-text>amount: {{item.amount}}</ion-text>
                </div> -->
            </div>
        </ion-content>
    </div>
</template>

<script>
    import Header from '@/components/headers/Header.vue';
    import Spinner from '@/components/Spinner.vue';
    //
    import { IonContent, IonText, IonGrid, IonRow, IonIcon } from '@ionic/vue'
    import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons'
    //
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import store from '../store/index';
    import { useRouter } from 'vue-router';
    //
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';

    export default defineComponent({
        name: 'userFinance',
        components: {
            Header, Spinner,
            //
            IonContent, IonText, IonGrid, IonRow, IonIcon
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
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myData = ref([])
            //
            const daysArray = ref([])

            // Подтягиваем данные леджера из store
            spinner.value = true;

            onMounted(async () => {
                await store.methods.getUserLedger();
                myData.value = store.state.userLedgerArray
                //
                spinner.value = false
                dataLoaded.value = true;
            })

            // функция форматирования даты для сравнения даты дела и даты дня
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }

            // Получаем массив форматированных к показу дат
            const getTransactionDateArray = () => {
                // делаем массив дат транзакций
                const dateArray = []
                myData.value.forEach(date => {
                    dateArray.push(date.created_at)
                })
                // Сортируем от ближайшей даты и по удалению от сегодня
                dateArray.sort((a, b) => {
                    return new Date(a) - new Date(b)
                })
                // создаем новый массив на основе форматированных дат
                const formattedDateArray = []
                dateArray.forEach(day => {
                    formattedDateArray.push(formattedDate(day))
                })
                // Исключаем дубли
                const formattedDateArrayNoDublicates = new Set(formattedDateArray)

                return formattedDateArrayNoDublicates
                

                // Сортируем от ближайшей даты и по удалению от сегодня
            }

            return {
                user, router, pageTitle, spinner, dataLoaded, myData, daysArray, getTransactionDateArray, formattedDate, arrowUpOutline, arrowDownOutline, currency
            }
        }
    })
</script>

<style scoped>
    .no-data {
        height: 80vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }

    .no-data ion-img {
        width: 50%
    }
    .transaction_icon {

    }

    .transaction_icon-income {
        background-color: var(--ion-color-success)
    }

    .transaction_icon-outcome {
        background-color: var(--ion-color-danger)
    }
</style>