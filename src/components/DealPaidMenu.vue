<template>
    <ion-modal :initial-breakpoint="0.5">
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="end">
                    <!-- <ion-button>Отменить</ion-button> -->
                    <ion-button @click="$emit('closeModal', amountValue = 0)">Отменить</ion-button>
                </ion-buttons>
                <!-- <ion-title>Внести</ion-title> -->
                <!-- <ion-buttons slot="end">
                    <ion-button @click="$emit('getAmountValue', amountValue)">Готово</ion-button>
                </ion-buttons> -->
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!-- Заголовок -->
            <ion-item lines="none" class="ion-margin-top">
                <ion-title size="large" class="ion-no-padding">
                    Внести
                </ion-title>
            </ion-item>
            <!-- Показываем остаток по долгу -->
            <ion-item lines="none" class="ion-margin-top ion-margin-end" @click="setAmountValue">
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-text>Задолженность: </ion-text>
                        <ion-text color="primary underline-dashed">
                            {{ debt }} {{currency}}
                        </ion-text>
                    </ion-row>
                </ion-grid>
            </ion-item>
            <!-- Input для внесения платежа -->
            <ion-item lines="none ion-margin-end ion-padding-bottom">
                <ion-label for="amountValue" color="primary">Впишите сумму:</ion-label>
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-end ion-align-items-center">
                        <input class="margin-end ion-text-end deal-paid_input ion-no-padding" id="amountValue" inputmode="decimal" type="number" v-model="amountValue" placeholder="0">
                        <ion-text color="primary">{{currency}}</ion-text>
                    </ion-row>
                </ion-grid>
            </ion-item>
            <!-- Кнопка Внести сумма -->
            <!-- <ion-button expand="block" class="ion-margin-horizontal ion-margin-top" @click="$emit('getAmountValue', amountValue)">
                ОК
            </ion-button> -->
            <ion-button expand="block" class="ion-margin-horizontal ion-margin-top" @click="getAmountValueFunc()">
                ОК
            </ion-button>
            <!-- <br>
            СУмма к оплате: {{ amountValue }} -->
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, watch, watchEffect } from 'vue'; 
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonInput, IonLabel, IonGrid, IonRow, IonText } from '@ionic/vue'
    //
    import store from '../store/index'
    //
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
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonInput, IonLabel, IonGrid, IonRow, IonText
        },
        setup(props, {emit}) {
            // currency
            const currency = ref(store.state.systemCurrency.name)
            //
            const currentDeal = ref() 
            // сумма к оплате (следим за изменениями значения переменной)
            const amountValue = ref()
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
                // console.log(amountValue.value)
                if (value > debt.value) {
                    amountValue.value = debt.value
                } else if (value === '') {
                    amountValue.value = ''
                }
            })
            //
            const setAmountValue = () => {
                // console.log('clicked')
                amountValue.value = debt.value
            }
            // функция внесения суммы в счет задолженности
            const getAmountValueFunc = () => {
                if(amountValue.value === 0) {
                    alert('Вносимая сумма должна быть больше нуля')
                } else if(amountValue.value > 0){
                    emit('getAmountValue', amountValue.value)
                } else if (amountValue.value < 0) {
                    alert('Вносимая сумма не может быть ниже нуля')
                }
            }

            return {
                currentDeal, amountValue, currency, setAmountValue, getAmountValueFunc
            }
        } 
    })
</script>

<style scoped>
    .deal-paid_input {
        border: none;
        width: 50%;
        color: var(--ion-color-primary)
    }
    .deal-paid_input:focus {
        outline: none;
    }
    .margin-end {
        margin-right: 0.5rem;
    }
    .underline-dashed {
        border-bottom: 1px dashed
    }
    /* ion-modal {
        --backdrop-opacity: 0
    } */
</style>