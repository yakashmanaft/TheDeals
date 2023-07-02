<template>
    <ion-modal>

        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!--  -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top ion-text-center" 
            id="main"
            type="push"
            forceOverscroll="false"
        >
            <br>
            <br>
            <br>
            <ion-grid style="height: 70%; display: flex; flex-direction: column; justify-content: center;">
                <!--  -->
                <ion-row class="ion-justify-content-center ion-padding-vertical">
                    <ion-text>
                        {{formattedDate(currentTransaction.created_at)}}
                    </ion-text>
                </ion-row>

                <!--  -->
                <ion-row class="ion-justify-content-center ion-margin-vertical ion-padding-vertical">
                    <ion-text style="font-size: 2rem; font-weight: bold;" :color="getAmountColor(currentTransaction.actionType)">
                        <span v-if="currentTransaction.actionType === 'add'">+</span>
                        <span v-else>-</span>
                        {{currentTransaction.qty.toFixed(2)}} 
                        <span v-if="currentTransaction.estimationType === 'perKilogram'">в граммах</span>
                        <span v-if="currentTransaction.estimationType === 'perUnit'">шт.</span>
                        <!-- <span v-if="currentTransaction.estimationType === 'per100gram'">по 100 гр.</span> -->
                    </ion-text>
                </ion-row>

                <!--  -->
                <ion-row class="ion-justify-content-center ion-padding-top">
                    <ion-button @click="goToItem(currentTransaction.itemID)" color="dark" shape="round">Перейти к предмету</ion-button>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, watchEffect} from 'vue';
    import { useRouter } from 'vue-router';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonGrid, IonRow, IonText } from '@ionic/vue';
    //
    import store from '../../store/index';
    //
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';

    export default defineComponent({
        name: 'TransactionWarehouseDetails',
        props: {
            transaction: Object
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonGrid, IonRow, IonText
        },
        setup(props, { emit }) {
            // Setup ref to router
            const router = useRouter();
            const currentTransaction = ref()
            const userWarehouseItems = ref([])

            //
            onMounted(async () => {
                await store.methods.getUserWarehouseItemsFromDB()
                userWarehouseItems.value = store.state.userWarehouseArray
            })

            // 
            const goToItem = (itemID) => {
                const currentItem = userWarehouseItems.value.filter(item => item.id === +itemID)
                // console.log(currentItem)
                if(currentItem.length === 0) {
                    alert('TransactionWarehouseDetails: Данного предмета нет на вашем складе')
                } else {
                    emit('closeModal')
                    emit('closeLedger')
                    router.push({
                        name: 'View-warehouse-item', params: {
                            itemId: +itemID,
                            item: JSON.stringify(currentItem[0])
                        }
                    })
                }
            }

            // функция форматирования даты для сравнения даты дела и даты дня
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y, HH:mm', { locale: ru });

                return formattedString;
            }

            //
            //
            const getAmountColor = (transactionActionType) => {
                if(transactionActionType === 'add') {
                    return 'success'
                } else {
                    return 'medium'
                }
            }

            watchEffect(() => {
                currentTransaction.value = props.transaction
            })

            return {
                router, currentTransaction, userWarehouseItems, formattedDate, goToItem, getAmountColor
            }
        }
    })
</script>

<style scoped>

</style>