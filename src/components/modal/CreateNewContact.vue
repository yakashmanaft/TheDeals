<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal', contactName = '')">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Контакт</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createContact', contactName)">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item>
                <ion-label position="stacked">Enter your name</ion-label>
                <ion-input v-model="contactName" type="text" placeholder="Your name"></ion-input>
                {{contactName}}
            </ion-item>
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
            reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
            dicta.
            </p>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref } from 'vue'; 
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonItem, IonLabel, IonInput } from '@ionic/vue';

    export default defineComponent({
        name: 'CreateNewContact',
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonItem, IonLabel, IonInput
        },
        setup() {
            const contactName = ref()


            return {
                contactName
            }
        }
    })
</script>