<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новое</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createDeal', dealData)">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <!-- ============================ Контакт по делу ===================================== -->
            <ion-item-group>
                <!-- заголовок -->
                <ion-text>
                    <h4>Укажите контакт</h4>
                </ion-text>
            </ion-item-group>
            {{dealData}}
        </ion-content>
    </ion-modal>
    <!-- Значение статуса дела по умолчанию: Бронь даты, deal-in-booking -->
</template>

<script>
    import { defineComponent, ref, computed } from 'vue';
    import store from '../../store/index'; 
    //
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText } from '@ionic/vue';

    export default defineComponent({
        name: 'CreateNewDeal',
        props: {
            dealData: Object
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText
        },
        setup() {
            return {

            }
        }
    })
</script>

<style scoped>

</style>