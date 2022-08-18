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
            :currentDealType="currentDeal.dealType"
            @updateBD="updateBD"
        />

        <!-- add subject to deal -->
        <CreateDealSubject
            :isOpen="isCreateNewSubjectOpened"
            @closeModal="closeCreateSubjectModal"
            :subjectData="currentSubject"
            @createSubject="addNewSubject"
            :currentDealType="currentDeal.dealType"
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
                <!-- ============================== Статус и тип дела ========================================== -->
                <ion-item-group>
                    <ion-grid class="ion-margin-top" style="padding-top: 0!important">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- Статус дела -->
                            <ion-chip :color="setChipColor(dealStatus)">
                                <Select
                                    :data="dealStatusList" 
                                    :placeholder="translateValue(currentDeal.dealStatus, dealStatusList)"
                                    @date-updated="(selected) => dealStatus = selected.currentValue"
                                />
                            </ion-chip>
                            <!-- Тип дела -->
                            <ion-chip :color="setColorByDealType(currentDeal.dealType)" outline="true">
                                <ion-icon :icon="setIconByDealType(currentDeal.dealType)"></ion-icon>
                                <ion-label>
                                    {{setDealType(currentDeal.dealType)}}
                                </ion-label>
                            </ion-chip>
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
                                <ion-icon @click.stop="openDeleteSubjectModal(item.id)" class="icon_size icon_del absolute" :icon="closeCircleOutline"></ion-icon>
                                <!-- item -->
                                <ion-thumbnail v-if="item.selectedProduct !== ''" style="height: 64px; width: 64px; margin: 0 auto" class="relative">
                                    <!-- Если тип дела Продажа -->
                                    <div v-if="currentDeal.dealType === 'sale'">
                                        <ion-img  style="height: 100%" :src="`../img/subjects/sale/${item.selectedProduct}.webp`"></ion-img>
                                    </div>
                                    <!-- Если тип дела Закупка -->
                                    <div v-if="currentDeal.dealType === 'buy'">
                                        <ion-img  style="height: 100%" :src="`../img/subjects/buy/${item.selectedProduct}.webp`"></ion-img>
                                    </div>
                                    <!-- mark where subject has attribute -->
                                    <div v-if="checkRentAttr(item)" class="absolute mark-atribute"></div>
                                </ion-thumbnail>
                                <!--  -->
                                <!-- <ion-thumbnail v-if="item.selectedProduct === ''" class="empty-deal-list_thumbnail">
                                    <ion-icon class="empty-deal-list_icon" :icon="helpOutline"></ion-icon>
                                </ion-thumbnail> -->
                                <ion-label style="font-size: 12px">
                                    x{{item.productQuantity}}
                                </ion-label>
                                <ion-text v-if="currentDeal.dealType === 'sale'" style="white-space: normal">{{ translateDealSubjectRecipe(item.recipe) }}</ion-text>
                            </ion-card>
                            <!-- Добавить еще предмет к заказу -->
                            <ion-card class="ion-padding card-center card-add" @click="openCreateSubjectModal()">
                                <ion-icon :icon="addCircleOutline" color="primary" class="icon_size"></ion-icon>
                                <ion-text class="ion-text-center ion-margin-top" color="primary">
                                    Добавить
                                </ion-text>    
                            </ion-card>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>
                <!-- Всплывашка подтверждение удаления предмета заказа -->
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
                <!-- Всплывашка подтверждение удаления дела-->
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
    import { addCircleOutline, closeCircleOutline, helpOutline } from 'ionicons/icons';
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    import { setColorByDealType } from '../../helpers/setColorByDealType';
    import { setIconByDealType } from '../../helpers/setIconBy';
    import { translateValue } from '@/helpers/translateValue';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import Select from '@/components/Select.vue';
    import ModalCalendar from '../../components/modal/NewDeal-modalCalendar.vue';
    import ViewDealSubject from '../../components/modal/ViewDeal-modalViewSubject.vue';
    import CreateDealSubject from '../../components/modal/ViewDeal-modalCreateSubject.vue';
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
            CreateDealSubject,
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
            const updateBD = () => {
                update()
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
            // ================================ управление current deal subject ===================================
            const currentDealSubject = ref()
            // открываем view current deal item
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
            // create new current deal subject
            const isCreateNewSubjectOpened = ref(false);
            // Открывает модалку создания нового предмета к текущему делу
            const openCreateSubjectModal = () => {
                isCreateNewSubjectOpened.value = true;
                // Обнуляем шаблон нового предмета у дела
                currentSubject.value  = {
                    id: uid(),
                    selectedProduct: '',
                    price: '',
                    costEstimation: '',
                    recipe:'',
                    productQuantity: 1,
                    additionalAttributes: [],
                    productNote: ''
                }
            }
            // Закрываем модалку создания нового предмета к текущему делу
            const closeCreateSubjectModal = () => {
                isCreateNewSubjectOpened.value = false;
            }
            // Заготовка под шаблон нового предмета к делу
            const currentSubject = ref({})
            // Добавляем новый предмет к текущему делу и делаем запись в БД
            const addNewSubject = () => {
                //Выдумать варианты валидации
                if(currentSubject.value.selectedProduct === '') {
                    alert('ViewDeal: Вы не выбрали предмет дела')
                } else if(currentDeal.value.dealType === 'sale' && currentSubject.value.recipe === '') {
                    alert('ViewDeal: Вы не указали рецепт')
                } else {
                    currentDeal.value.dealsList.push(currentSubject.value); 
                    isCreateNewSubjectOpened.value = false;
                    update();
                }
            }

            // Проверяем выбрани ли атрибуты у предмета заказа
            const checkRentAttr = (item) => {
                if(item.additionalAttributes.length > 0) {
                    // Если атрибут выбран
                    return true
                } else if (item.additionalAttributes.length === 0 ){
                    // Если атрибутов в принципе не выбрано
                    // console.log('без атрибутов')
                    return false;
                }
            }
            // Переводчик названий рецептов
            const userRecipeArray = ref(store.state.userRecipeArray)
            const translateDealSubjectRecipe = (value) => {
                if (currentDeal.value.dealType === 'sale') {
                    if(value === 'no-recipe' || value === ''){
                        return 'Без рецепта'
                    } else {
                        return translateValue(value, userRecipeArray.value)
                    }
                }
            }


            return {
                spinner, currentId, info, currentDeal, dealContactID, isOpenRef, setOpen, deleteDealButtons, deleteDealSubjectButtons, deleteDeal, dealContact, choose, searchContactMenu, searchDealContact, searchedContacts, myContacts, dealStatusList, dealStatus, translateValue, setChipColor, executionDate, datepicker, isCalendarOpened, openModalCalendar, closeModalCalendar, updateExecutionDate, addCircleOutline, setDealType, closeCircleOutline, isViewDealSubjectOpened, openCurrentDealSubject, deleteSubject, openDeleteSubjectModal, deleteCurrentDealItem, currentDealSubject, subjectToDelete, isCreateNewSubjectOpened, openCreateSubjectModal, closeCreateSubjectModal, currentSubject, addNewSubject, checkRentAttr, helpOutline, setColorByDealType, setIconByDealType, translateDealSubjectRecipe, userRecipeArray, updateBD
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
    /* .empty-deal-list_thumbnail {
        height: 64px;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
    } */
    /* .empty-deal-list_icon {
        width: 100%;
        height: 100%
    } */
</style>