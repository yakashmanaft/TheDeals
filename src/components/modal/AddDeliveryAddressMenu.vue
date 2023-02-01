<template>
    <ion-modal>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
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
            <ion-text v-if="(dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete') && currentAddressIndexValue !== -1">
                Вы не можете изменять адрес доставки. Заказ уже {{ dealStatus }} 
                <!-- В ДОСТАВКЕ // ЗАВЕРШЕН -->
            </ion-text>


            <!-- Город -->
            <ion-input v-model="deliveryAddress.city" placeholder="Город" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>

            <!-- Улица -->
            <ion-input v-model="deliveryAddress.street" placeholder="Улица" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>

            <!-- Дом -->
            <ion-input v-model="deliveryAddress.building" placeholder="Дом" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>

            <!-- Квартира / Офис -->
            <ion-input v-model="deliveryAddress.flat" placeholder="Квартира / Офис" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-input>

            <!-- Квартира / Офис -->
            <ion-textarea v-model="deliveryAddress.comments" placeholder="Комментарий" inputmode="text" autocapitalize="on" :disabled="dealStatus === 'deal-in-delivery' || dealStatus === 'deal-complete' ? true : false"></ion-textarea>

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
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonInput, IonText, IonTextarea } from '@ionic/vue';

    export default defineComponent({
        name: 'AddDeliveryAddressMenu',
        emits: ['closeModal'],
        props: {
            addressesArray: Array,
            currentAddressIndex: Number,
            dealStatus: String,
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonInput, IonText, IonTextarea
            //
        },
        setup(props, { emit }) {
            const addressesArrayValue = ref()
            const currentAddressIndexValue = ref()
            //
            const deliveryAddress = ref()
            //
            const addDeliveryAddress = () => {
                if(deliveryAddress.value.street === '') {
                    alert('AddDeliveryAddressMenu: Улица должна быть заполнена')
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
                if(deliveryAddress.value.street === '') {
                    alert('AddDeliveryAddressMenu: Улица должна быть заполнена')
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
                console.log(currentAddressIndexValue.value)
            })
            //
            watchEffect(() => {
                addressesArrayValue.value = props.addressesArray
                currentAddressIndexValue.value = props.currentAddressIndex
            })
            

            return {
                addDeliveryAddress, deliveryAddress, addressesArrayValue, currentAddressIndexValue, saveChanges
            }   
        }
    })
</script>

<style scoped>

</style>