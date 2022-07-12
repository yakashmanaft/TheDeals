<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createContact', contactData)">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <!-- Основные данные -->
            <ion-item-group>
                <!-- заголовок -->
                <ion-text>
                    <h4>Основная информация</h4>
                </ion-text>
                <!-- Surname -->
                <ion-item>
                    <ion-label position="stacked">Укажите фамилию</ion-label>
                    <ion-input v-model="contactData.contactInfo.surname" type="text" placeholder="Фамилия"></ion-input>
                </ion-item>
                <!-- Name -->
                <ion-item>
                    <ion-label position="stacked">Укажите имя</ion-label>
                    <ion-input v-model="contactData.contactInfo.name" type="text" placeholder="Имя"></ion-input>
                </ion-item>
                <!-- Company -->
                <ion-item>
                    <ion-label position="stacked">Укажите наименование организации</ion-label>
                    <ion-input v-model="contactData.contactInfo.company" type="text" placeholder="Компания"></ion-input>
                </ion-item>
            </ion-item-group>

            <!-- Phones -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Телефоны</h4>
                </ion-text>
                <!-- Если телефоны не указаны -->
                <ion-item v-if="!contactData.phoneNumbers.length" lines="none">
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between">
                            <ion-text color="medium">Не указаны</ion-text>
                            <ion-text color="primary" @click="$emit('addPhoneNumber')">Добавить</ion-text>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <ion-item v-for="(number, index) in contactData.phoneNumbers" :key="index">
                    <!-- Phone number -->
                    {{number.id}}
                    <!-- Type of numper -->
                    <Select :data="phoneTypes" :placeholder="'Тип номера'" @date-updated="(selected) => number.type = selected"/>

                    <p @click="$emit('deletePhoneNumber', number.id)">Удалить</p>
                </ion-item>
                <p v-if="contactData.phoneNumbers.length" @click="$emit('addPhoneNumber')">Добавить еще</p>
            </ion-item-group>

            <!-- Emails -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Электронная почта</h4>
                </ion-text>
                <!-- Если адреса почты не указаны -->
                <ion-item lines="none">
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between">
                            <ion-text color="medium">Не указаны</ion-text>
                            <ion-text color="primary">Добавить</ion-text>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-item-group>

            <br>
            <div style="margin-bottom: 100px;">
                {{ contactData }}
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, computed } from 'vue'; 
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonItem, IonLabel, IonInput, IonItemGroup, IonGrid, IonRow, IonSelect, IonSelectOption  } from '@ionic/vue';
    import { uid } from 'uid';
    import store from '../../store/index';
    import Select from '../Select.vue';

    export default defineComponent({
        name: 'CreateNewContact',
        props: {
            contactData: Object
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonItem, IonLabel, IonInput, IonItemGroup, IonGrid, IonRow, IonSelect, IonSelectOption, Select
        },
        setup() {
            const phoneTypes = ref(store.state.myContactPhoneTypes)

            return {
                phoneTypes
            }
        }
    })
</script>