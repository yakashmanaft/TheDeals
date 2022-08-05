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
            <!-- ============================ Статус дела ========================================= -->
            <ion-item-group class="ion-text-center">
                <ion-text color="medium">
                    Все новые дела создаются со статусом <b>Бронь даты</b>. Изменить статус вы можете после создания дела.
                </ion-text>
            </ion-item-group>

            <!-- ============================== Типа дела ========================================== -->
            <ion-item-group>
                <!-- заголовок -->
                <ion-text>
                    <h4>Тип дела</h4>
                </ion-text>
                <!-- Выбор типа дела -->
                <ion-chip color="primary" class="ion-no-margin">
                    <Select :data="dealTypes" :placeholder="`Укажите тип дела`" @date-updated="(selected) => dealData.dealType = selected.currentValue"/>
                </ion-chip>
            </ion-item-group>

            <!-- ============================ Контакт по делу ===================================== -->
            <ion-item-group>
                <!-- заголовок -->
                <ion-text>
                    <h4>Контакт</h4>
                </ion-text>
                <!-- Показываем контакт по делу -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchContactMenu = true">{{dealContact}}</ion-button>
                    </ion-row>
                </ion-grid>
                <!-- модалка для выбора (ПОИСК КОНТАКТА) контакта по делу -->
                <!-- Может быть вынести в отдельны компонент? -->
                <ion-modal :isOpen="searchContactMenu" >
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchDealContact" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchContactMenu = false"></ion-searchbar>
                    <ion-content style="height: 90vh">
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
                    </ion-content>
                </ion-modal>
            </ion-item-group>

            <!-- ========================== Дата и время исполнения ============================== -->
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
                    @updateDate="updateExecutionDate()"
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
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, IonSearchbar, IonItem, IonChip  } from '@ionic/vue';
    //
    import ModalCalendar from './NewDeal-modalCalendar.vue'
    import Select from '../Select.vue'
    //
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    import { watchEffect } from 'vue';
    //
    export default defineComponent({
        name: 'CreateNewDeal',
        emits: ['date-updated', 'closeModal', 'createDeal', 'updateDate'],
        props: {
            dealData: Object,
            myContacts: Array
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, ModalCalendar, IonSearchbar, IonItem, Select, IonChip
        },
        setup(props, { emit }) {
            // Типы дел для создания нового дела
            const dealTypes = ref(store.state.newDealTypes)
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
            const closeModalCalendar = (executionDate) => {
                executionDate = 'Выберите дату'
                isCalendarOpened.value = false;
            }
            const updateExecutionDate = () => {
                isCalendarOpened.value = false;
            }
            // Выбираем дату
            // и показываем ее уже в варианте с указанием времени
            const datepicker = (eventDate) => {
                if(eventDate === '') {
                    return 'Выберите дату'
                }
                const data = eventDate;
                const formattedString = format(parseISO(data), 'd MMMM к HH:mm', { locale: ru });
                // console.log(formattedString)
                return formattedString
            }
            // Поиск при выборе контакта по делу
            const myContactsArray = ref([])
            const searchedContacts = computed(() => {
                return searchFilter(myContactsArray.value, searchDealContact.value)
            })
            //
            watchEffect(() => myContactsArray.value = props.myContacts);
            // console.log(myContactsArray.value)
            return {
                dealContact, dealContactID , searchContactMenu, choose, isCalendarOpened, openModalCalendar, closeModalCalendar, updateExecutionDate, datepicker, myContactsArray, searchDealContact, searchedContacts, dealTypes
            }
        }
    })
</script>

<style scoped>
</style>