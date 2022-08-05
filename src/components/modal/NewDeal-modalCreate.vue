<template>
    <!-- add subject to deal -->
    <!-- <CreateDealSubject
        :isOpen="subject.show = true"
        @closeModal="closeCreateSubjectModal(subject)"
        :subjectData="currentSubject"
        @createSubject="addNewSubject"
        :currentDealType="dealData.dealType"
    /> -->
    <!--  -->
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
        <ion-content>
            <!-- ============================ Статус дела ========================================= -->
            <!-- Значение статуса дела по умолчанию: Бронь даты, deal-in-booking -->
            <ion-item-group class="ion-text-center ion-padding-horizontal ion-margin-top">
                <ion-text color="medium">
                    Все новые дела создаются со статусом <b>Бронь даты</b>. Изменить статус вы можете после создания дела.
                </ion-text>
            </ion-item-group>

            <!-- ============================== Типа дела ========================================== -->
            <ion-item-group class="ion-padding-horizontal">
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
            <ion-item-group class="ion-padding-horizontal">
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
            <ion-item-group class="ion-padding-horizontal">
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

            <!-- ============================ Предмет дела =================================== -->
            <ion-item-group class="ion-margin-top">
                <!-- Заголовок -->
                <ion-text>
                    <ion-grid class="ion-no-padding ion-padding-horizontal">
                        <ion-row class="ion-align-items-center ion-justify-content-between">
                            <h4 class="ion-no-margin">Предмет дела</h4>
                            <ion-text color="medium">Всего {{ dealData.dealsList.length }}</ion-text>
                        </ion-row>
                    </ion-grid>
                </ion-text>
                <!--  -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-nowrap horizontal-scroll">
                        <!-- Карточки предметов заказа -->
                        <ion-card class="ion-padding ion-text-center card-center relative" v-for="(item, index) in dealData.dealsList" :key="item.id">
                            <!-- Кнопка удалить конкретный предмет дела -->
                            <ion-icon class="icon_size icon_del absolute" :icon="closeCircleOutline">
                                <!-- из ViewDeal -->
                            </ion-icon>
                        </ion-card>
                        <!-- Добавить еще предмет к заказу -->
                        <ion-card class="ion-padding card-center card-add" @click="$emit('addSubject')">
                            <ion-icon :icon="addCircleOutline" color="primary" class="icon_size"></ion-icon>
                            <ion-text class="ion-text-center ion-margin-top" color="primary">
                                Добавить
                            </ion-text> 
                        </ion-card>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
            <br>
            <br>
            <ion-item-group class="ion-paddin-bottom ion-margin-bottom">

                {{dealData}}
            </ion-item-group>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, computed, watch } from 'vue';
    import store from '../../store/index'; 
    import { uid } from 'uid';
    //
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, IonSearchbar, IonItem, IonChip, IonIcon, IonCard  } from '@ionic/vue';
    import { addCircleOutline, closeCircleOutline } from 'ionicons/icons'
    //
    import ModalCalendar from './NewDeal-modalCalendar.vue'
    import Select from '../Select.vue'
    import CreateDealSubject from '../modal/ViewDeal-modalCreateSubject.vue';
    //
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    import { watchEffect } from 'vue';
    //
    export default defineComponent({
        name: 'CreateNewDeal',
        emits: ['date-updated', 'closeModal', 'createDeal', 'updateDate', 'addSubject'],
        props: {
            dealData: Object,
            myContacts: Array
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, ModalCalendar, IonSearchbar, IonItem, Select, IonChip, IonIcon, IonCard, CreateDealSubject
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
            const openModalCalendar = (subject) => {
                subject.show = true
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

            // create new current deal subject
            // const isCreateNewSubjectOpened = ref(false);
            // Открывает модалку создания нового предмета к текущему делу
            const openCreateSubjectModal = (subject) => {
                subject.show = !subject.show;
            }
            // Закрываем модалку создания нового предмета к текущему делу
            const closeCreateSubjectModal = (subject) => {
                subject.show = !subject.show;
            }
            // Щаблон нового предмета к текущему делу
            const currentSubject = ref({
                id: uid(),
                selectedProduct: '',
                additionalAttributes: [],
                productNote: '',
                show: false
            })
            const addNewSubject = () => {
                console.log('new subject created')
            }
            return {
                dealContact, dealContactID , searchContactMenu, choose, isCalendarOpened, openModalCalendar, closeModalCalendar, updateExecutionDate, datepicker, myContactsArray, searchDealContact, searchedContacts, dealTypes, addCircleOutline, closeCircleOutline, openCreateSubjectModal, closeCreateSubjectModal, currentSubject, addNewSubject
            }
        }
    })
</script>

<style scoped>
    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }
    ion-card {
        overflow: visible;
    }
    .card-center {
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        min-width: 140px; 
        max-width: 140px;
    }
    .card-add {
        min-height: 140px;
    }
    .icon_size {
        font-size: 25px;
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .icon_del {
        top: 0.3rem;
        left: 0.3rem;
    }
    .mark-atribute {
        top: 0;
        right: -0.7rem;
        width: 1rem;
        height: 1rem;
        background-color: var(--ion-color-warning);
        border-radius: 100%
    }
</style>