<template>
    <ion-modal >
        <ion-header translucent="true">
            <ion-toolbar>
                <!-- <ion-title>Детали</ion-title> -->
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
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
                <ion-row class="ion-justify-content-center ion-padding-vertical">
                    <ion-text>
                        {{formattedDate(currentTransaction.created_at)}}
                    </ion-text>
                </ion-row>

                <ion-row class="ion-justify-content-center ion-margin-vertical ion-padding-vertical">
                    <ion-text style="font-size: 2rem; font-weight: bold;" :color="getAmountColor(currentTransaction.dealType)">
                        <span v-if="currentTransaction.dealType === 'sale'">+</span>
                        <span v-else>-</span>
                        {{currentTransaction.amount.toFixed(2)}} {{currency}}
                    </ion-text>
                </ion-row>

                <ion-row class="ion-justify-content-center ion-padding-top">
                    <ion-button @click="goToDeal(currentTransaction.dealID)" color="dark" shape="round">
                        Перейти к делу
                    </ion-button>
                </ion-row>
            </ion-grid>
            <!-- {{currentTransaction}} -->
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue'; 
    import { useRouter } from 'vue-router';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonText, IonGrid, IonRow, IonIcon } from '@ionic/vue';
    //
    import store from '../../store/index';
    //
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';

    export default defineComponent({
        name: 'TransactionDetails',
        props: {
            transaction: Object
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonText, IonGrid, IonRow, IonIcon
        },
        setup(props, { emit }) {
            // Currency
            const currency = ref(store.state.systemCurrency.name)
            // Setup ref to router
            const router = useRouter();
            //
            const currentTransaction = ref()
            const myDeals = ref([])
            //
            onMounted(async ( ) => {
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
            })

            //
            const goToDeal = (dealID) => {
                const currentDeal = myDeals.value.filter(item => item.id === +dealID)
                emit('closeModal')
                router.push({
                    name: 'View-Deal', params: {
                        dealId: +dealID,
                        deal: JSON.stringify(currentDeal[0])
                    }
                })
            }

            // функция форматирования даты для сравнения даты дела и даты дня
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y, HH:mm', { locale: ru });

                return formattedString;
            }

            //
            const getAmountColor = (transactionDealType) => {
                if(transactionDealType === 'sale') {
                    return 'success'
                } else {
                    return 'medium'
                }
            }

            watchEffect(() => {
                currentTransaction.value = props.transaction
            })

            return {
                currentTransaction, myDeals, goToDeal, router, formattedDate, currency, getAmountColor
            }
        }
    })
</script>

<style scoped>

</style>