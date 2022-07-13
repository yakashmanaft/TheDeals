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
                    <ion-input v-model="contactData.contactInfo.surname" inputmode="text" placeholder="Фамилия" autocapitalize="on"></ion-input>
                </ion-item>
                <!-- Name -->
                <ion-item>
                    <ion-label position="stacked">Укажите имя</ion-label>
                    <ion-input v-model="contactData.contactInfo.name" inputmode="text" placeholder="Имя"></ion-input>
                </ion-item>
                <!-- Company -->
                <ion-item>
                    <ion-label position="stacked">Укажите наименование организации</ion-label>
                    <ion-input v-model="contactData.contactInfo.company" inputmode="text" placeholder="Компания"></ion-input>
                </ion-item>
            </ion-item-group>

            <!-- Phones -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Телефоны</h4>
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
                <!-- Если телефоны указаны -->
                <div class="current-phone-content" v-for="(number, index) in contactData.phoneNumbers" :key="index">
                    <!-- sequence number &  delete current phone btn-->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-padding-start ion-justify-content-between ion-align-items-center">
                            <!-- sequence number -->
                                <ion-text position="stacked">Телефон #{{index + 1}}</ion-text>
                            <!-- delete current phone btn -->
                            <ion-button fill="clear" class="btn-delete-phone" @click="$emit('deletePhoneNumber', number.id)">
                                <ion-icon :icon="closeOutline" color="danger" slot="end"></ion-icon>
                            </ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- Phone number -->
                    <ion-item>
                        <ion-input inputmode="tel" placeholder="Укажите номер телефона" v-model="number.phone"></ion-input>
                    </ion-item>
                    <!-- Type of numper -->
                    <ion-item>
                        <ion-label position="stacked">
                            Тип номера телефона
                        </ion-label>
                        <Select :data="phoneTypes" :placeholder="'Тип номера'" @date-updated="(selected) => number.type = selected"/>
                    </ion-item>
                    <!-- link to messengers -->
                    <ion-item lines="none">
                            <ion-label position="stacked">
                                Привязка к мессенджерам
                            </ion-label>
                            <ion-grid class="ion-no-margin ion-no-padding">
                                <ion-row class="margin-top ion-justify-content-between ion-align-items-center" v-for="(messenger, index) in number.messengers" :key="index">
                                    <ion-text class="ion-padding-end">
                                        {{messenger.name}}
                                    </ion-text>
                                    <ion-toggle class="ion-padding-end" color="success" v-model="messenger.status"></ion-toggle>
                                </ion-row>
                            </ion-grid>
                    </ion-item>
                </div>
                <!-- Кнопка добавить еще один телефон к контакту -->
                <ion-row class="ion-justify-content-end">
                    <ion-text color="primary" v-if="contactData.phoneNumbers.length" @click="$emit('addPhoneNumber')">Добавить еще</ion-text>
                </ion-row>
            </ion-item-group>

            <!-- Emails -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Электронная почта</h4>
                </ion-text>
                <!-- Если адреса почты не указаны -->
                <ion-item v-if="!contactData.emails.length" lines="none">
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between">
                            <ion-text color="medium">Не указаны</ion-text>
                            <ion-text color="primary" @click="$emit('addEmail')">Добавить</ion-text>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <!-- Если телефоны указаны -->
                <div class="current-phone-content" v-for="(email, index) in contactData.emails" :key="index">
                    <!-- sequence number &  delete current phone btn-->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-padding-start ion-justify-content-between ion-align-items-center">
                            <!-- sequence number -->
                                <ion-text position="stacked">Адрес почты #{{index + 1}}</ion-text>
                            <!-- delete current email btn -->
                            <ion-button fill="clear" class="btn-delete-phone" @click="$emit('deleteEmail', email.id)">
                                <ion-icon :icon="closeOutline" color="danger" slot="end"></ion-icon>
                            </ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- Email address -->
                    <ion-item>
                        <ion-input inputmode="email" placeholder="Укажите адрес почты" v-model="email.email"></ion-input>
                    </ion-item>
                    <!-- Type of email -->
                    <ion-item>
                        <ion-label position="stacked">
                            Тип электронной почты
                        </ion-label>
                        <Select :data="phoneTypes" :placeholder="'Тип номера'" @date-updated="(selected) => email.type = selected"/>
                    </ion-item>
                </div>
                <!-- Кнопка добавить еще один email к контакту -->
                <ion-row class="ion-justify-content-end">
                    <ion-text color="primary" v-if="contactData.emails.length" @click="$emit('addEmail')">Добавить еще</ion-text>
                </ion-row>
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
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonItem, IonLabel, IonInput, IonItemGroup, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonToggle, IonIcon  } from '@ionic/vue';
    import { closeOutline } from 'ionicons/icons';
    import { uid } from 'uid';
    import store from '../../store/index';
    import Select from '../Select.vue';

    export default defineComponent({
        name: 'CreateNewContact',
        props: {
            contactData: Object
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonItem, IonLabel, IonInput, IonItemGroup, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, Select, IonToggle, IonIcon
        },
        setup() {
            const phoneTypes = ref(store.state.myContactPhoneEmailTypes)

            return {
                phoneTypes, closeOutline
            }
        }
    })
</script>

<style scoped>
    .current-phone-content {
        border-left: 1px solid var(--ion-color-medium);
        margin: 10px 0;
        padding-bottom: 10px;
        border-radius: 10px;
    }

    .margin-top {
        margin-top: 10px;
    }
</style>