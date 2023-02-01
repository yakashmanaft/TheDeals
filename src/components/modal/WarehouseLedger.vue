<template>
    <ion-modal>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>
        <!--  -->
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click.stop="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title>Журнал</ion-title>
                <ion-buttons slot="end"></ion-buttons>
            </ion-toolbar>
        </ion-header>
        <!--  -->
        <ion-content forceOverscroll="false">

            <!-- no data -->
            <div v-if="myData.length === 0" class="no-data ion-padding-horizontal">
                <ion-text>Пока пусто</ion-text>
            </div>

            <!-- data -->
            <div v-if="myData.length !== 0">

                <!--  -->
                <div v-for="(date, idx) in getTransactionDateArray()" :key="idx" class="ion-margin-top ion-padding-horizontal">

                    <!-- Дата -->
                    <ion-text>
                        <h2>
                            <!-- Применить СЕГОДНЯ ВЧЕРА если даты соответствуют -->
                            {{date}}
                        </h2>
                    </ion-text>

                    <!-- Транзакции -->
                    <div v-for="transaction in myData" :key="transaction.id" class="margin-top" @click="openTransactionDetailsModal(transaction)">

                        <!--  -->
                        <div v-if="formattedDate(transaction.created_at) === date" class="ion-no-margin ion-padding-vertical">

                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-align-items-center ion-justify-content-between">

                                    <!-- Иконка, Предмет -->
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-align-items-center">

                                            <!-- Иконка -->
                                            <div class="transaction_icon ion-margin-end" :class="[transaction.actionType === 'add' ? 'transaction_icon-income': 'transaction_icon-outcome']">
                                                <ion-icon v-if="transaction.actionType === 'substract'" :icon="arrowUpOutline" color="light"></ion-icon>
                                                <ion-icon v-if="transaction.actionType === 'add'" :icon="arrowDownOutline" color="light"></ion-icon>
                                            </div>

                                            <!-- Наименование предмета -->
                                            <ion-text color="medium">
                                                {{ translateItemID(transaction.itemID) }}
                                            </ion-text>

                                        </ion-row>
                                    </ion-grid>

                                    <!-- Сумма транзакции -->
                                    <ion-text
                                        :color="getAmountColor(transaction.actionType)"
                                    >
                                        <span v-if="transaction.actionType === 'add'">+</span>
                                        <span v-else>-</span>
                                        {{ transaction.qty }} {{ setValueByEstimationType(transaction.estimationType) }}
                                    </ion-text>
                                </ion-row>
                            </ion-grid>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Модалка с деталями транзакции -->
            <TransactionWarehouseDetails
                :is-open="transactionDetailOpened"
                @closeModal="transactionDetailOpened = false"
                @didDismiss="transactionDetailOpened = false"
                :transaction="currentTransaction"
                @closeLedger="$emit('closeModal')"
            />
            <br>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted } from 'vue';
    import store from '../../store/index';
    //
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonIcon } from '@ionic/vue';
    import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons'
    //
    import Spinner from '../Spinner.vue';
    import TransactionWarehouseDetails from '../../components/modal/TransactionWarehouseDetails.vue'
    //
    import { format, parseISO, formatISO } from 'date-fns';
    import { ru } from 'date-fns/locale';

    export default defineComponent({
        name: 'WarehouseLedger',
        emit: [],
        props: {
            
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonIcon,
            //
            Spinner, TransactionWarehouseDetails
        },
        setup(props, {emit}) {
            //
            const spinner = ref(null);
            const myData = ref([])
            const userWarehouseItems = ref([])

            // Подтягиваем данные леджера из store
            spinner.value = true;

            onMounted(async () => {
                await store.methods.getUserWarehouseLedger();
                myData.value = store.state.userLedgerWarehouseArray
                //
                await store.methods.getUserWarehouseItemsFromDB()
                userWarehouseItems.value = store.state.userWarehouseArray
                //
                spinner.value = false
            })

            // функция форматирования даты для сравнения даты дела и даты дня
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'dd.MM.Y');
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
            const transactionDetailOpened = ref(false)
            const currentTransaction = ref();
            const openTransactionDetailsModal = (transaction) => {
                transactionDetailOpened.value = true
                currentTransaction.value = transaction
            }

            //
            // const goToItem = (itemID) => {
            //     console.log(itemID)
            // }

            //
            const getAmountColor = (transactionActionType) => {
                if(transactionActionType === 'add') {
                    return 'success'
                } else {
                    return 'medium'
                }
            }

            //
            const setValueByEstimationType = (estimationType) => {
                if(estimationType === 'perKilogram') {
                    return 'гр.'
                } else if (estimationType === 'perUnit') {
                    return 'шт.'
                } 
                // else if (estimationType === 'per100gram') {
                //     return 'по 100 гр.'
                // }
            }

            // Подумать, как можно доработать, быть может используя temp значения
            const translateItemID = (itemID) => {
                const item = userWarehouseItems.value.filter(item => item.id === +itemID)
                // console.log(item)
                if(item.length !== 0) {
                    return `${item[0].name}`
                } else {
                    return 'Неизвестный предмет'
                }
            }

            return {
                myData, spinner, getTransactionDateArray, formattedDate, openTransactionDetailsModal, arrowDownOutline, arrowUpOutline, getAmountColor, setValueByEstimationType, translateItemID, userWarehouseItems, transactionDetailOpened, currentTransaction
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