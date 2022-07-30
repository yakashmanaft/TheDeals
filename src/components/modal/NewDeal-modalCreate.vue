<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal', dealContact = 'Неизвестный')">Отменить</ion-button>
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
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-text color="primary" @click="searchContactMenu = true">{{dealContact}}</ion-text>
                        <!-- <ion-text color="primary" @click="searchContactMenu = true">
                            Изменить
                        </ion-text> -->
                    </ion-row>
                </ion-grid>
                <div v-if="searchContactMenu">
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchDealContact"></ion-searchbar>
                    <ion-item v-for="contact in searchedContacts" :key="contact.id" @click="choose(contact)">
                        <ion-grid>
                            <ion-row>
                                <ion-text>{{contact.contactInfo.name}} {{contact.contactInfo.surname}}</ion-text>
                            </ion-row>
                            <ion-row>
                                <ion-text style="font-size: 1rem;" color="medium">{{contact.contactInfo.company}}</ion-text>
                            </ion-row>
                        </ion-grid>
                        
                    </ion-item>
                    <!-- Если поиском в списке контактов ничего не найдено -->
                    <ion-item lines="none" v-if="searchedContacts.length <= 0">
                        <ion-text color="medium">Ничего не найдено</ion-text>
                    </ion-item>
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
                <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="openModalCalendar(isCalendarOpened = true)">{{datepicker(dealData.executionDate)}}</ion-button>
                <!-- Компонент выбора даты -->
                <ModalCalendar 
                    :is-open="isCalendarOpened" 
                    @date-updated="(pickedDate) => dealData.executionDate = pickedDate.currentValue"
                    @closeModal="closeModalCalendar()"
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
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, IonSearchbar, IonItem } from '@ionic/vue';
    //
    import ModalCalendar from './NewDeal-modalCalendar.vue'
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    import { watchEffect } from 'vue';
    //
    export default defineComponent({
        name: 'CreateNewDeal',
        emits: ['date-updated', 'closeModal', 'createDeal'],
        props: {
            dealData: Object,
            myContacts: Array
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, ModalCalendar, IonSearchbar, IonItem
        },
        setup(props, { emit }) {
            //
            const searchDealContact = ref('');
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
                emit('date-updated', {currentValue})
            })
            // Управление модалкой календаря
            const isCalendarOpened = ref(false)
            const openModalCalendar = () => {
                isCalendarOpened.value = true
            }
            const closeModalCalendar = () => {
                isCalendarOpened.value = false;
            }
            // Выбираем дату
            // и показываем ее уже в варианте с указанием времени
            const datepicker = (eventDate) => {
                if(eventDate === '') {
                    return 'Выберите дату'
                }
                const data = eventDate
                const formattedString = format(parseISO(data), 'd MMMM к HH:mm', { locale: ru });
                // console.log(formattedString)
                return formattedString
            }
            //
            const myContactsArray = ref([])
            const searchedContacts = computed(() => {
                return searchFilter(myContactsArray.value, searchDealContact.value)
            })

            
            watchEffect(() => myContactsArray.value = props.myContacts);
            // console.log(myContactsArray.value)
            return {
                dealContact, dealContactID , searchContactMenu, choose, isCalendarOpened, openModalCalendar, closeModalCalendar, datepicker, myContactsArray, searchDealContact, searchedContacts
            }
        }
    })
</script>

<style scoped>
</style>