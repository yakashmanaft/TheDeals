<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Просмотр</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <!-- ============================= Основные данные ===================================== -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Прсомотр конкретного продукта в прайсе</h4>
                    {{productData}}
                </ion-text>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText } from '@ionic/vue';

    export default defineComponent({
        name: 'ViewPriceProduct',
        props: {
            productData: Object
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