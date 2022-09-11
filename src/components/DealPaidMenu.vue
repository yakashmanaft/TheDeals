<template>
    <ion-modal :initial-breakpoint="0.4">
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <!-- <ion-button>Отменить</ion-button> -->
                    <ion-button @click="$emit('closeModal', amountValue = 0)">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Внести</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('getAmountValue', amountValue)">Готово</ion-button>
                    <!-- <ion-button @click="$emit('updateDate')">Готово</ion-button> -->
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!--  -->
            <input type="text" v-model="amountValue" placeholder="Сумма к оплате">


            <br>
            Задолженность по делу:  {{ currentDeal.totalDealPrice - currentDeal.dealPaid }}
            <br>
            СУмма к оплате: {{ amountValue }}
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, watch, watchEffect } from 'vue'; 
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/vue'

    export default defineComponent({
        name: 'DealPaidMenu',
        emits: [
            'closeModal', 'getAmountValue'
        ],
        props: {
            currentDeal: Object,
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent,
        },
        setup(props, {emit}) {
            //
            const currentDeal = ref() 
            // сумма к оплате (следим за изменениями значения переменной)
            const amountValue = ref(0)
            // const debtValue = ref()
            //
            watchEffect(() => {
                currentDeal.value = props.currentDeal
            })

            return {
                currentDeal, amountValue
            }
        } 
    })
</script>

<style scoped>

</style>