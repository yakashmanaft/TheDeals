<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader />

        <!-- view deal subject -->
        <ViewDealSubject 
            :isOpen="isViewDealSubjectOpened"
            @closeModal="isViewDealSubjectOpened = false"
            :subjectData="currentDealSubject"
        />

        <!-- page-content -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
        >
            <br>
            <br>
            <!-- page-content -->
            <!-- No data -->
            <div>
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div>
                <!-- Тип дела -->
                <!-- ============================== Статус дела ========================================== -->
                <ion-item-group>
                    <ion-grid class="ion-margin-top" style="padding-top: 0!important">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-chip :color="setChipColor(dealStatus)">
                                <Select
                                    :data="dealStatusList" 
                                    :placeholder="translatePlaceholder(currentDeal.dealStatus, dealStatusList)"
                                    @date-updated="(selected) => dealStatus = selected.currentValue"
                                />
                            </ion-chip>
                            <ion-chip color="medium" outline="true">{{setDealType(currentDeal.dealType)}}</ion-chip>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- ============================== Контакт по делу ====================================== -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text >
                        <h4>Контакт</h4>
                    </ion-text>
                    <!-- Показываем контакт по делу -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">{{dealContact}}</ion-button>
                            <ion-button size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchContactMenu = true">Изменить</ion-button>
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

                <!-- =========================== Дата и время исполнения ================================= -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Дата и время исполнения</h4>
                    </ion-text>
                    <!-- Блок показа / редактирования даты и времени исполнения -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- Текущая дата и время исполнения -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">{{ datepicker(currentDeal.executionDate) }}</ion-button>
                            <!-- Кнопка активации компонента, она же показывает выбранное -->
                            <ion-button size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="openModalCalendar(isCalendarOpened = true)">Изменить</ion-button>
                        </ion-row>
                    </ion-grid>
                    <ModalCalendar 
                        :is-open="isCalendarOpened" 
                        @date-updated="(pickedDate) => executionDate = pickedDate.currentValue"
                        @closeModal="closeModalCalendar(executionDate)"
                        @updateDate="updateExecutionDate()"
                        @didDismiss="isCalendarOpened = false"
                        :date="currentDeal.executionDate"
                    />
                </ion-item-group>

                <!-- =========================== Предмет дела ============================================ -->
                <ion-item-group class="ion-text-left">
                    <!-- Заголовок -->
                    <ion-text>
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-align-items-center ion-margin-top ion-justify-content-between ion-padding-horizontal">
                                <h4 class="ion-no-margin">Предмет дела</h4>
                                <ion-text color="medium">Всего {{ currentDeal.dealsList.length }}</ion-text>
                            </ion-row>
                        </ion-grid>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-nowrap horizontal-scroll">
                            <!-- Карточки предметов заказа -->
                            <ion-card @click.stop="openCurrentDealSubject(index)" class="ion-padding ion-text-center card-center relative" v-for="(item, index) in currentDeal.dealsList" :key="item.id">
                                <!-- Кнопка удалить конкретный предмет дела -->
                                <ion-icon @click.stop="openDeleteSubjectModal(item.id)" class="icon_size icon_absolute" :icon="closeCircleOutline"></ion-icon>
                                <!-- item -->
                                <ion-thumbnail style="height: 64px; width: 64px; margin: 0 auto">
                                    <ion-img style="height: 100%" :src="`../img/subjects/sale/${item.selectedProduct}.webp`"></ion-img>
                                </ion-thumbnail>
                                <ion-label style="font-size: 12px">
                                    x{{item.productQuantity}}
                                </ion-label>
                                <ion-text style="white-space: normal">{{ item.recipe }}</ion-text>
                            </ion-card>
                            <!-- Добавить еще предмет к заказу -->
                            <div class="ion-padding card-center card-add">
                                <ion-icon :icon="addCircleOutline" color="primary" class="icon_size"></ion-icon>
                                <ion-text class="ion-text-center ion-margin-top" color="primary">
                                    Добавить
                                </ion-text>    
                            </div>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>
                <!-- Всплывашка подтверждение -->
                <ion-action-sheet
                    :is-open="deleteSubject"
                    header="Точно удалить?"
                    :buttons="deleteDealSubjectButtons"
                    @didDismiss="deleteSubject = false"
                >
                </ion-action-sheet>

                <br>
                {{currentDeal}}
                <br>
                <!-- ========================== Кнопка удалить дело =================================== -->
                <!-- Не показываем в режиме edit -->
                <ion-button @click="setOpen(true)" fill="clear" color="danger">Удалить дело</ion-button>
                <!-- Всплывашка подтверждение -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Точно удалить?"
                    :buttons="deleteDealButtons"
                    @didDismiss="setOpen(false)"
                >
                </ion-action-sheet>
            </div>
        </ion-content>

    </div>
</template>

<script>
    import { onMounted, defineComponent, ref, computed, watch } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import { IonContent, IonButton, IonActionSheet, IonItemGroup, IonText, IonGrid, IonRow, IonModal, IonItem, IonSearchbar, IonChip, IonCard, IonImg, IonThumbnail, IonLabel, IonIcon } from '@ionic/vue';
    import { addCircleOutline, closeCircleOutline } from 'ionicons/icons';
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import Select from '@/components/Select.vue';
    import ModalCalendar from '../../components/modal/NewDeal-modalCalendar.vue';
    import ViewDealSubject from '../../components/modal/ViewDeal-modalViewSubject.vue';
    //
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    //
    export default defineComponent({
        name: 'View-deal',
        components: {
            Spinner,
            ViewHeader,
            ViewDealSubject,
            IonContent,
            IonButton,
            IonActionSheet,
            IonItemGroup,
            IonText,
            IonGrid,
            IonRow,
            IonModal,
            IonItem,
            IonSearchbar,
            Select,
            IonChip,
            ModalCalendar,
            IonCard,
            IonImg,
            IonThumbnail,
            IonLabel,
            IonIcon
        }, 
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.dealId;
            const info = route.params;
            const currentDeal = ref(JSON.parse(info.deal))
            // Храним на случай нажатия Отмены при редактировании контакта
            // const tempData = JSON.parse(info.deal)
            //
            const spinner = ref(null);
            // Edit contact info
            // const edit = ref(null)
            // const editMode = () => {
            //     edit.value = !edit.value;
            // }
            // Cancel editMode & cancel all changes
            // const cancelEdit = () => {
            //     edit.value = !edit.value;
            //     // note.value = !note.value;
            //     currentDeal.value = tempData
            //     reloadData()
            // }
            // Статусы дел
            const dealStatusList = ref(store.state.dealStatusList)
            //
            const myContacts = ref([])
            myContacts.value = store.state.myContactsArray; 
            const searchDealContact = ref('');
            const searchedContacts = computed(() => {
                return searchFilter(myContacts.value, searchDealContact.value)
            })
            //
            const showNameByID = (contactID) => {
                const result = myContacts.value.filter(contact => contact.id === +contactID)
                if(result.length !== 0) {
                    const nameByID = (result[0].contactInfo.surname + ' ' + result[0].contactInfo.name).toString().replace(/"/g, "")
                    return nameByID;
                } else if (result.length === 0) {
                    const nameByID = 'Неизвестный'
                    return nameByID;
                }
            }
            // храним значение contactID
            const dealContactID = ref();
            dealContactID.value = currentDeal.value.contactID
            const dealContact = ref(showNameByID(dealContactID.value));
            // храним значение dealStatus
            const dealStatus = ref(currentDeal.value.dealStatus);
            // следим за изменениями значения dealStatus у текущего дела и обновляем его в БД
            watch (dealStatus, () => {
                // console.log(dealStatus.value)
                update()
            })
            // выдергиваем из массива нужный контакт
            const searchContactMenu = ref(false)
            const choose = (contact) => {
                dealContact.value = `${contact.contactInfo.name} ${contact.contactInfo.surname}`
                dealContactID.value = contact.id
                searchContactMenu.value = false
                update()
            }
            // Обновляем данные из БД
            // вынести в store?
            // const reloadData = async () => {
            //     try {
            //         const { data: myDeals, error } = await supabase.from('deals').select('*').eq('id', currentId);
            //         currentDeal.value = myDeals[0];
            //         if (error) throw error;
            //     } catch (error) {
            //         alert(`Error: ${error.message}`)
            //     }
            // }     
            // Переводчик placeholder
            // Еслит надо переиспользовать
            // А если будет слишком много данных? Мы же каждый раз их обходим циклом...
            const translatePlaceholder = (value, array) => {
                let currentName = ''
                array.forEach(item => {
                    if(item.value === value) {
                        currentName = item.name
                        return currentName
                    }
                })
                return currentName
            }
            // =========================== Выбираем дату ==========================
            // храним значение executionDate
            const executionDate = ref();
            // и показываем ее уже в варианте с указанием времени
            const datepicker = (eventDate) => {
                if(eventDate === '') {
                    return 'Выберите дату'
                }
                const data = eventDate;
                const formattedString = format(parseISO(data), 'd MMMM к HH:mm', { locale: ru });
                return formattedString
            }
            // Управление модалкой календаря
            const isCalendarOpened = ref(false)
            const openModalCalendar = () => {
                isCalendarOpened.value = true
            }
            const closeModalCalendar = (executionDate) => {
                executionDate = currentDeal.value.executionDate
                isCalendarOpened.value = false;
            }
            const updateExecutionDate = () => {
                currentDeal.value.executionDate = executionDate.value 
                isCalendarOpened.value = false;
                update()
            }
            // следим за изменениями значения executionDate у текущего дела и обновляем его в БД
            // watch (executionDate, () => {
            //     currentDeal.value.executionDate = executionDate.value 
            //     update()
            //     console.log(executionDate.value)
            // })
            // ======================================== update current deal ================================
            const update = async () => {
                try {
                    spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        contactID: dealContactID.value,
                        dealStatus: dealStatus.value,
                        executionDate: executionDate.value,
                        dealsList: currentDeal.value.dealsList

                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                spinner.value = false;
            }
            // ================================== delete current deal function ===============================
            const deleteDeal = async () => {
                try {
                    const { error } = await supabase.from('deals').delete().eq('id',currentId);
                    if(error) throw error;
                    router.push({ name: 'Deals' })
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            // меню подтверждения удаления current contact
            const isOpenRef = ref(false);
            const setOpen = (boolean) => isOpenRef.value = boolean;
            const deleteDealSubjectButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        console.log('Delete clicked')
                        deleteCurrentDealItem(subjectToDelete.value)
                    },
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    },
                }
            ]
            const deleteDealButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        console.log('Delete clicked')
                        deleteDeal()
                    },
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    },
                }
            ]
            // Задаем цвет chip
            const setChipColor = (status) => {
                if (status === 'deal-in-debt') {
                    return 'danger'
                }
                if (status === 'deal-complete') {
                    return 'success'
                }
                if(status === 'deal-cancelled') {
                    return 'warning'
                }
                return 'primary'
            }
            // Переводчик dealType
            const setDealType = (dealType) => {
                if(dealType === 'sale') {
                    return 'Продажа'
                } else if (dealType === 'buy') {
                    return 'Закупка'
                }
            }
            // ================================ управление current deal item ===================================
            const currentDealSubject = ref()
            // открываем просмотр подробностей current deal item
            const isViewDealSubjectOpened = ref(false);
            const openCurrentDealSubject = (index) => {
                isViewDealSubjectOpened.value = true;
                currentDealSubject.value = currentDeal.value.dealsList[index];
            }
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteSubject = ref(false);
            // Храним айди предмета к удалению
            const subjectToDelete = ref();
            const openDeleteSubjectModal = (id) => {
                deleteSubject.value = true;
                subjectToDelete.value = id;
            }
            // удаляем current deal item и обновляем запись в БД
            const deleteCurrentDealItem = (id) => {
                currentDeal.value.dealsList = currentDeal.value.dealsList.filter(subject => subject.id !== id);
                update();
            }

            return {
                spinner, currentId, info, currentDeal, dealContactID, isOpenRef, setOpen, deleteDealButtons, deleteDealSubjectButtons, deleteDeal, dealContact, choose, searchContactMenu, searchDealContact, searchedContacts, myContacts, dealStatusList, dealStatus, translatePlaceholder, setChipColor, executionDate, datepicker, isCalendarOpened, openModalCalendar, closeModalCalendar, updateExecutionDate, addCircleOutline, setDealType, closeCircleOutline, isViewDealSubjectOpened, openCurrentDealSubject, deleteSubject, openDeleteSubjectModal, deleteCurrentDealItem, currentDealSubject, subjectToDelete
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
    .icon_absolute {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>