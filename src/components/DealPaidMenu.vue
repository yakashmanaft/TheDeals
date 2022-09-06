<template>
    <ion-modal :initial-breakpoint="0.6">
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <!-- <ion-button>Отменить</ion-button> -->
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Внести</ion-title>
                <ion-buttons slot="end">
                    <ion-button>Готово</ion-button>
                    <!-- <ion-button @click="$emit('updateDate')">Готово</ion-button> -->
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!--  -->
            deal Paid menu
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watch } from 'vue'; 
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/vue'

    export default defineComponent({
        name: 'DealPaidMenu',
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent,
        },
        setup(props, {emit}) {
            return {

            }
        } 
    })
</script>

<style scoped>

</style>