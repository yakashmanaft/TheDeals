<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- page header -->
        <Header 
            :title="pageTitle" 
            style="background-color: white"
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
            <div v-if="(!dataLoaded || myData.length === 0) && !spinner" class="no-data ion-padding-horizontal">
                <ion-text>Пока пусто</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && myData !== 0" class="ion-text-left ion-margin-bottom">
                <!--  -->
                <div v-for="(date, idx) in getTransactionDateArray()" :key="idx" class="ion-margin-top ion-padding-horizontal">

                    <!-- Дата -->
                    <ion-text>
                        <h2>
                            <!-- Применить СЕГОДНЯ ВЧЕРА если даты соответствуют -->
                            {{date}}
                        </h2>
                    </ion-text>

                    <!-- Транзакция -->
                    <div v-for="transaction in myData" :key="transaction.id" class="ion-margin-top" @click="openTransactionDetailsModal(transaction)">


                            <!--  -->
                            <div v-if="formattedDate(transaction.created_at) === date" class="ion-no-margin ion-padding-vertical">

                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-align-items-center ion-justify-content-between">
    
                                        <!-- Иконка Контакт  -->
                                        <ion-grid class="ion-no-padding">
                                            <ion-row class="ion-align-items-center">
                                                
                                                <div class="transaction_icon ion-margin-end" :class="[transaction.dealType === 'sale' ? 'transaction_icon-income': 'transaction_icon-outcome']">
                                                    <ion-icon v-if="transaction.dealType === 'buy'" :icon="arrowUpOutline" color="light"></ion-icon>
                                                    <ion-icon v-if="transaction.dealType === 'sale'" :icon="arrowDownOutline" color="light"></ion-icon>
                                                </div>
    
                                                <!-- Ссылка на контакт -->
                                                <ion-text v-if="transaction.contactID === '000'" color="medium">
                                                    Неизвестный
                                                </ion-text>
                                                <ion-text v-else @click.stop="goToContact(transaction.contactID)" color="primary">
                                                    {{translateContactName(transaction.contactID)}}
                                                </ion-text>
                                            </ion-row>
                                        </ion-grid>
    
                                        <!-- Сумма транзакции -->
                                        <ion-text
                                            :color="getAmountColor(transaction.dealType)"
                                        >
                                            <span v-if="transaction.dealType === 'sale'">+</span>
                                            <span v-else>-</span>
                                            {{ transaction.amount }} {{currency}}
                                        </ion-text>
                                    </ion-row>
                                </ion-grid>
                            </div>

                    </div>
                </div>

                <!-- Модалка, открывает показывает инфу конкретной транзакции -->
                <TransactionDetails
                    :is-open="transactionDetailOpened"
                    @closeModal="transactionDetailOpened = false"
                    @didDismiss="transactionDetailOpened = false"
                    :transaction="currentTransaction"
                />

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

            <br>
            <br>
            <br>
        </ion-content>

        <!-- page footer -->
        <Footer style="background-color: white"/>
    </div>
</template>

<script>
    import Header from '@/components/headers/Header.vue';
    import NavigationMenu from '../components/NavigationMenu.vue';
    import Spinner from '@/components/Spinner.vue';
    import TransactionDetails from '../components/modal/TransactonDetails.vue';
    import Footer from '../components/Footer.vue';
    //
    import { IonContent, IonText, IonGrid, IonRow, IonIcon, IonCard } from '@ionic/vue'
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
            Header, NavigationMenu, Spinner, TransactionDetails, Footer,
            //
            IonContent, IonText, IonGrid, IonRow, IonIcon, IonCard
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
            const myData = ref([]);
            // const myDeals = ref([]);
            const myContacts = ref([])
            //
            const daysArray = ref([])
            //

            // Подтягиваем данные леджера из store
            spinner.value = true;

            onMounted(async () => {
                await store.methods.getUserLedger();
                myData.value = store.state.userLedgerArray
                //
                // await store.methods.getMyDealsFromBD();
                // myDeals.value = store.state.myDealsArray;
                //
                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
                //
                spinner.value = false
                dataLoaded.value = true;
            })

            // функция форматирования даты для сравнения даты дела и даты дня
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd.M.Y');
                // const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }

            // Получаем массив форматированных к показу дат
            const getTransactionDateArray = () => {
                // делаем массив дат транзакций
                const dateArray = []
                myData.value.forEach(date => {
                    dateArray.unshift(date.created_at)
                })
                // Сортируем от ближайшей даты и по удалению от сегодня
                dateArray.sort((a, b) => {
                    return new Date(a) - new Date(b)
                })
                // создаем новый массив на основе форматированных дат
                const formattedDateArray = []
                dateArray.forEach(day => {
                    formattedDateArray.unshift(formattedDate(day))
                })
                // Исключаем дубли
                const formattedDateArrayNoDublicates = new Set(formattedDateArray)

                return formattedDateArrayNoDublicates
            }

            //
            const getAmountColor = (transactionDealType) => {
                if(transactionDealType === 'sale') {
                    return 'success'
                } else {
                    return 'medium'
                }
            }

            // 
            // const getDealData = (transactionDealID) => {
            //     const currentDeal = myDeals.value.filter(item => item.id === transactionDealID)
            //     console.log(currentDeal)
            //     return currentDeal
            // }

            //
            const currentContact = ref()
            const goToContact = (contactID) => {
                currentContact.value = myContacts.value.filter(contact => contact.id === +contactID)
                router.push({
                    name: 'View-Contact',
                    params: {
                        contactId: +contactID,
                        contact: JSON.stringify(currentContact.value[0])
                    }
                })
            }

            // 
            const transactionDetailOpened = ref(false)
            const currentTransaction = ref();
            const openTransactionDetailsModal = (transaction) => {
                transactionDetailOpened.value = true
                currentTransaction.value = transaction
            }
            //
            const translateContactName = (contactID) => {
                const contact = myContacts.value.filter(contact => contact.id === +contactID)
                return `${contact[0].contactInfo.surname} ${contact[0].contactInfo.name}`
            }

            return {
                user, router, pageTitle, spinner, dataLoaded, myData, daysArray, getTransactionDateArray, formattedDate, arrowUpOutline, arrowDownOutline, currency, getAmountColor, transactionDetailOpened, openTransactionDetailsModal, currentTransaction, myContacts, goToContact, currentContact, translateContactName
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
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        border-radius: 100%;
    }

    .transaction_icon-income {
        background-color: var(--ion-color-success)
    }

    .transaction_icon-outcome {
        background-color: var(--ion-color-warning)
    }
</style>