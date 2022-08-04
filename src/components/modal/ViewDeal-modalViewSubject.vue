<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Просмотр</ion-title>
                <!-- <ion-buttons slot="end">
                    <ion-button>Готово</ion-button>
                </ion-buttons> -->
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            {{subjectData}}
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/vue';

    export default defineComponent({
        name: 'ViewDealSubject',
        emits: ['closeModal'],
        props: {
            subjectData: Object
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent
        },
        setup() {
            return {

            }
        }
    })
</script>

<style scoped>

</style>