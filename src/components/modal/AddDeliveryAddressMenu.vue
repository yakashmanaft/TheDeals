<template>
    <ion-modal>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal', deliveryAddress = {})">Отменить</ion-button>
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
            <ion-input v-model="deliveryAddress.street" placeholder="Улица" inputmode="text" autocapitalize="on"></ion-input>

            <div>
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
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonInput } from '@ionic/vue';

    export default defineComponent({
        name: 'AddDeliveryAddressMenu',
        emits: ['closeModal'],
        props: {
            addressesArray: Array,
            currentAddressIndex: Number
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonInput
            //
        },
        setup(props, { emit }) {
            const addressesArrayValue = ref()
            const currentAddressIndexValue = ref()
            //
            const deliveryAddress = ref({
                street: '',
                build: '',
                comments: ''
            })
            //
            const addDeliveryAddress = () => {
                if(deliveryAddress.value.street === '') {
                    alert('AddDeliveryAddressMenu: Улица должна быть заполнена')
                } else {
                    props.addressesArray.push(deliveryAddress.value)
                    emit('closeModal')
                    deliveryAddress.value = {
                        street: '',
                        build: '',
                        comments: ''
                    }
                }
            }
            //
            const saveChanges = () => {
                if(deliveryAddress.value.street === '') {
                    alert('AddDeliveryAddressMenu: Улица должна быть заполнена')
                } else {
                }
                props.addressesArray[props.currentAddressIndex] = deliveryAddress.value
                emit('closeModal')
                deliveryAddress.value = {
                    street: '',
                    build: '',
                    comments: ''
                }
            }
            //
            watch(currentAddressIndexValue, () => {
                if(currentAddressIndexValue.value === -1) {

                } else {
                    deliveryAddress.value = {
                        street: addressesArrayValue.value[currentAddressIndexValue.value].street,
                        build: '',
                        comments: ''
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