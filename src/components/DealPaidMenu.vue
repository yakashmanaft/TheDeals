<template>
    <ion-modal :initial-breakpoint="0.4">
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <!-- <ion-button>Отменить</ion-button> -->
                    <ion-button @click="$emit('closeModal', amountValue)">Отменить</ion-button>
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
            <input type="number" v-model="amountValue" placeholder="Сумма к оплате">


            <br>
            Задолженность по делу:  {{ debt }}
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
            debt: Number,
            amount: Number
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent,
        },
        setup(props, {emit}) {
            //
            const currentDeal = ref() 
            // сумма к оплате (следим за изменениями значения переменной)
            const amountValue = ref(0)
            //
            const debt = ref()
            //
            // const amount = ref()
            // 
            watchEffect(() => {
                currentDeal.value = props.currentDeal
                debt.value = props.debt
                // amount.value = props.amount
                amountValue.value = props.amount
            })
            //
            
            // текущий долг по делу
            // проверяем какое значение вписывает пользователь
            watch(amountValue, (value) => {
                console.log(value)
                if (value > debt.value) {
                    amountValue.value = debt.value
                } else if (value === '') {
                    amountValue.value = 0
                }
            })

            return {
                currentDeal, amountValue
            }
        } 
    })
</script>

<style scoped>

</style>