<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-title class="ion-text-center">Просмотр</ion-title>
                <ion-buttons slot="start">
                    <!-- <ion-button>Готово</ion-button> -->
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content forceOverscroll="false">
            {{event}}
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watch } from 'vue'; 
    import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonButton } from '@ionic/vue';

    export default defineComponent({
        name: 'ViewWeekDeal',
        emit: ['closeModal'],
        props: ['event'],
        components: {
            IonModal, IonHeader, IonToolbar, IonContent, IonButton, IonTitle, IonButtons
        },
        setup(props, {emit}) {

            return {

            }
        }
    })
</script>

<style scoped>

</style>