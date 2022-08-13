<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('addPriceProduct', newProductData)">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <!-- ============================= Основные данные ===================================== -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Новый продукт в прайс</h4>
                    {{newProductData}}
                </ion-text>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText } from '@ionic/vue';

    export default defineComponent({
        name: 'CreatePriceProduct',
        props: {
            newProductData: Object
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