<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новое</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createDeal', dealData)">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <!-- ============================ Контакт по делу ===================================== -->
            <ion-item-group>
                <!-- заголовок -->
                <ion-text>
                    <h4>Контакт</h4>
                </ion-text>
                <ion-grid>
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-text color="medium">{{dealContact}}</ion-text>
                        <ion-text color="primary" @click="searchContactMenu = true">
                            Изменить
                        </ion-text>
                    </ion-row>
                </ion-grid>
                <ion-input v-model="dealData.contactID" ></ion-input>
                <div v-if="searchContactMenu">
                    <div v-for="contact in myContacts" :key="contact.id" @click="choose(contact)">
                        {{contact.contactInfo.name}} {{contact.contactInfo.surname}}
                    </div>
                </div>
                <!-- Поиск -->
            </ion-item-group>
            <!-- Дата и время исполнения -->
            <ion-item-group>
                <!-- заголовок -->
                <ion-text>
                    <h4>Дата и время исполнения</h4>
                </ion-text>
                <!-- Кнопка активации компонента, она же показывает выбранное -->
                <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="openModalCalendar(isCalendarOpened)">{{datepicker(dealData.executionDate)}}</ion-button>
                <!-- Компонент выбора даты -->
                <ModalCalendar 
                    :isOpen="isCalendarOpened" 
                    @date-updated="(pickedDate) => dealData.executionDate = pickedDate.currentValue"
                    @closeModal="closeModalCalendar(isCalendarOpened)"
                    @didDismiss="isCalendarOpened = false"
                />
            </ion-item-group>
            <br>
            <br>
            {{dealData}}
        </ion-content>
    </ion-modal>
    <!-- Значение статуса дела по умолчанию: Бронь даты, deal-in-booking -->
</template>

<script>
    import { defineComponent, ref, computed, watch } from 'vue';
    import store from '../../store/index'; 
    //
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput } from '@ionic/vue';
    //
    import ModalCalendar from '../modal/ModalCalendar.vue'
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    //
    export default defineComponent({
        name: 'CreateNewDeal',
        emits: ['date-updated', 'closeModal', 'createDeal'],
        props: {
            dealData: Object,
            myContacts: Array
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, ModalCalendar
        },
        setup(props, { emit }) {
            // ================= choose contact for deal ==========================
            const dealContact = ref('Неизвестный');
            const dealContactID = ref('000');
            // выдергиваем из массива нужный контакт
            const searchContactMenu = ref(false)
            const choose = (contact) => {
                dealContact.value = `${contact.contactInfo.name} ${contact.contactInfo.surname}`
                dealContactID.value = contact.id
                searchContactMenu.value = false
            }
            // следим за изменениями в ID и передаем наверх
            watch(dealContactID, (currentValue) => {
                console.log(currentValue)
                emit('date-updated', {currentValue})
            })
            // Управление модалкой календаря
            const isCalendarOpened = ref(true)
            const openModalCalendar = () => {
                isCalendarOpened.value = true
            }
            const closeModalCalendar = () => {
                isCalendarOpened.value = !isCalendarOpened.value
            }
            // Выбираем дату
            const datepicker = (eventDate) => {
                if(eventDate.currentValue === undefined) {
                    return 'Выберите дату'
                }
                const data = eventDate.currentValue
                const formattedString = format(parseISO(data), 'd MMMM', { locale: ru });
                return formattedString
            }
            return {
                dealContact, dealContactID , searchContactMenu, choose, isCalendarOpened, openModalCalendar, closeModalCalendar, datepicker
            }
        }
    })
</script>

<style scoped>
</style>