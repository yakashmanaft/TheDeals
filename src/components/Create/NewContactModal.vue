<template>

        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="cancel">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Контакт</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="willDismiss()">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item>
                <ion-label position="stacked">Enter your name</ion-label>
                <ion-input v-model="contactName" type="text" placeholder="Your name"></ion-input>
            </ion-item>
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
            reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
            dicta.
            </p>
        </ion-content>

</template>

<script>
    import { defineComponent } from 'vue';
    import {
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonButton,
        IonItem,
        IonLabel,
        IonInput,
        modalController,
    } from '@ionic/vue';

    export default defineComponent({
        name: 'NewContactModal',
        components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonLabel, IonInput },
        setup () {
            const cancel = () => {
                return modalController.dismiss(null, 'cancel');
            }

            return {
                cancel
            }
        }
    })
</script>

<style scoped>

</style>