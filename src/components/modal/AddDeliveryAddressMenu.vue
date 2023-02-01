<template>
    <ion-modal>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeMenuModal">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Добавить адрес</ion-title>
            </ion-toolbar>
        </ion-header>

        <!--  -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push"
            forceOverscroll="false"
        >
            <br>
            <br>
            <br>
            <!-- {{ addressesArray }} -->

            <!-- Notification -->
            <div class="notification-element ion-margin-horizontal" v-if="(dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete') && currentAddressIndexValue !== -1">
                <!-- В ДОСТАВКЕ // ЗАВЕРШЕН -->
                Вы не можете изменять адрес доставки. Заказ уже {{ translateDealStatus(dealStatus) }}
            </div>


            <!-- Город -->
            <div class="address-item">
                <ion-text color="medium">Город</ion-text>
                <ion-input color="primary" v-model="deliveryAddress.city" placeholder="Город" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>
            </div>

            <!-- Улица -->
            <div class="address-item">
                <ion-text color="medium">Улица</ion-text>
                <ion-input color="primary" v-model="deliveryAddress.street" placeholder="Улица" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>
            </div>

            <!-- Дом -->
            <div class="address-item">
                <ion-text color="medium">Дом</ion-text>
                <ion-input color="primary" v-model="deliveryAddress.building" placeholder="Дом" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>
            </div>

            <!-- Квартира / Офис -->
            <div class="address-item">
                <ion-text color="medium">Квартира / Офис</ion-text>
                <ion-input color="primary" v-model="deliveryAddress.flat" placeholder="Квартира / Офис" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>
            </div>

            <!-- Комментарии к адресу -->
            <div class="address-item">
                <ion-text color="medium">Комментарии</ion-text>
                <ion-textarea v-model="deliveryAddress.comments" placeholder="Укажите комментарии к адресу" autoGrow="true" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-textarea>
            </div>

            <br>
            <br>
            <br>

            <div>
                {{ dealStatus }}
                {{ addressesArrayValue[currentAddressIndexValue] }}
                {{ currentAddressIndexValue }}
            </div>

            <!-- Кнопка Добавить -->
            <div style="position:fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999" class="ion-padding">
                <ion-button v-if="currentAddressIndexValue === -1" expand="block" @click.stop="addDeliveryAddress(deliveryAddress)">Добавить</ion-button>
                <ion-button v-else expand="block" @click="saveChanges(deliveryAddress)">Сохранить</ion-button>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, watchEffect, watch } from 'vue';
    // import { uid } from 'uid';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonInput, IonText, IonTextarea, IonLabel } from '@ionic/vue';

    export default defineComponent({
        name: 'AddDeliveryAddressMenu',
        emits: ['closeModal'],
        props: {
            addressesArray: Array,
            currentAddressIndex: Number,
            dealStatus: String,
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonInput, IonText, IonTextarea, IonLabel
            //
        },
        setup(props, { emit }) {
            const addressesArrayValue = ref()
            const currentAddressIndexValue = ref()
            //
            const deliveryAddress = ref()
            //
            const addDeliveryAddress = () => {
                if (deliveryAddress.value.city === '') {
                    alert('AddDeliveryAddressMenu: Укажите город доставки')
                } else if(deliveryAddress.value.street === '') {
                    alert('AddDeliveryAddressMenu: Улица должна быть заполнена')
                } else if (deliveryAddress.value.building === '') {
                    alert('AddDeliveryAddressMenu: У здания должен быть номер')
                } else {
                    props.addressesArray.push(deliveryAddress.value)
                    emit('closeModal')
                    deliveryAddress.value = {
                        city: 'Пермь',
                        street: '',
                        building: '',
                        flat: '',
                        comments: ''
                    }
                }
            }
            //
            const saveChanges = () => {
                if (deliveryAddress.value.city === '') {
                    alert('AddDeliveryAddressMenu: Укажите город доставки')
                } else if(deliveryAddress.value.street === '') {
                    alert('AddDeliveryAddressMenu: Улица должна быть заполнена')
                } else if (deliveryAddress.value.building === '') {
                    alert('AddDeliveryAddressMenu: У здания должен быть номер')
                } else {
                    props.addressesArray[props.currentAddressIndex] = deliveryAddress.value
                    emit('closeModal')
                    // deliveryAddress.value = {
                    //     city: '',
                    //     street: '',
                    //     building: '',
                    //     flat: '',
                    //     comments: ''
                    // }
                }
            }
            //
            watch(currentAddressIndexValue, () => {
                if(currentAddressIndexValue.value === -1) {
                    deliveryAddress.value = {
                        city: 'Пермь',
                        street: '',
                        building: '',
                        flat: '',
                        comments: ''
                    }
                } else {
                    deliveryAddress.value = {
                        city: addressesArrayValue.value[currentAddressIndexValue.value].city,
                        street: addressesArrayValue.value[currentAddressIndexValue.value].street,
                        building: addressesArrayValue.value[currentAddressIndexValue.value].building,
                        flat: addressesArrayValue.value[currentAddressIndexValue.value].flat,
                        comments: addressesArrayValue.value[currentAddressIndexValue.value].comments
                    }
                }
                // console.log(currentAddressIndexValue.value)
            })

            //
            const translateDealStatus = (dealStatusValue) => {
                if(dealStatusValue === 'deal-in-delivery') {
                    return "В ДОСТАВКЕ"
                } else if (dealStatusValue === 'deal-complete') {
                    return 'ЗАВЕРШЕН'
                }
            }

            //
            const closeMenuModal = () => {
                emit('closeModal')
                deliveryAddress.value = {
                    city: addressesArrayValue.value[currentAddressIndexValue.value].city,
                    street: addressesArrayValue.value[currentAddressIndexValue.value].street,
                    building: addressesArrayValue.value[currentAddressIndexValue.value].building,
                    flat: addressesArrayValue.value[currentAddressIndexValue.value].flat,
                    comments: addressesArrayValue.value[currentAddressIndexValue.value].comments
                }
            }

            //
            watchEffect(() => {
                addressesArrayValue.value = props.addressesArray
                currentAddressIndexValue.value = props.currentAddressIndex
            })
            

            return {
                addDeliveryAddress, deliveryAddress, addressesArrayValue, currentAddressIndexValue, saveChanges, translateDealStatus, closeMenuModal
            }   
        }
    })
</script>

<style scoped>
    .notification-element {
        background-color: black; 
        padding: 1rem;
        color: white; 
        border-radius: 5px;
    }
    .address-item {
        border: 1px solid var(--ion-color-light); 
        border-radius: 5px; 
        padding: 1rem; 
        margin: 16px 16px 0 16px;
    }
</style>