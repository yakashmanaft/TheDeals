<template>
    <ion-modal :initial-breakpoint="0.8">
        <ion-header>
            <ion-toolbar translucent="true">
                <ion-buttons slot="end">
                    <ion-button @click="$emit('closeModal')">
                        Закрыть
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding ion-page ion-margin-bottom ion-margin-top">
            <br>
            <br>
            <!--  -->
            <ion-card class="ion-no-margin ion-margin-vertical" @click="goToDebtsDeal(deal)" v-if="dealDebtsArray.length !== 0" v-for="deal in dealDebtsArray">
                Дата создания дела: <br> {{deal.created_at}} <br>
                Дата исполнения дела: <br> {{deal.executionDate}} <br>
                Статус дела: <br> {{deal.dealStatus}} <br>
                Контакт по делу: <br> {{deal.contactID}} <br>
                Задолженность: <br> {{deal.totalDealPrice - deal.dealPaid}} {{currency}}
            </ion-card>

            <!--  -->
            <div v-else class="no-status-deal no-data">
                <ion-img src="img/common/no-debts-sticker.webp"></ion-img>
                <ion-text color="medium" class="ion-margin-top">Долгов не обнаружено</ion-text>
            </div>

            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonText, IonImg, IonCard } from '@ionic/vue';

    export default defineComponent({
        name: 'ViewWalletDebts',
        props: {
            dealArray: Array,
            currencyValue: String
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonText, IonImg, IonCard
        },
        setup(props, { emit }) {
            // Setup ref to router
            const router = useRouter();
            //
            const dealDebtsArray = ref([])
            const currency = ref('')
            //
            const goToDebtsDeal = (deal) => {
                emit('closeModal')
                router.push({
                    name: 'View-Deal', 
                    params: {
                        dealId: deal.id,
                        dealUid: deal.uid,
                        deal: JSON.stringify(deal)
                    }
                })
            }
            //
            watchEffect(() => {
                dealDebtsArray.value = props.dealArray
                currency.value = props.currencyValue
            })

            return {
                router, dealDebtsArray, currency, goToDebtsDeal
            }
        }
    })
</script>

<style scoped>
    .no-status-deal {
        margin-top: 15vh;
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .no-data ion-img {
        width: 50%;
    }
</style>