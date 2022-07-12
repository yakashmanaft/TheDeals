<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Контакт</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createContact', contactData)">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item>
                <ion-label position="stacked">Укажите фамилию</ion-label>
                <ion-input v-model="contactData.contactInfo.surname" type="text" placeholder="Фамилия"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Укажите имя</ion-label>
                <ion-input v-model="contactData.contactInfo.name" type="text" placeholder="Имя"></ion-input>
            </ion-item>
            {{ contactData }}
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
            reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
            dicta.
            </p>
            {{ userEmail }}
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, computed } from 'vue'; 
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonItem, IonLabel, IonInput } from '@ionic/vue';
    import { uid } from 'uid';

    export default defineComponent({
        name: 'CreateNewContact',
        props: {
            userEmail: String,
            contactData: Object
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonItem, IonLabel, IonInput
        },
        setup() {

            return {
                
            }
        }
    })
</script>