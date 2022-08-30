<template>
    <!--  -->
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal', dealContact = 'Неизвестный')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Создать дело</ion-title>
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
                <ion-chip :color="setColorByDealType(dealData.dealType)" class="ion-no-margin">
                    <ion-icon class="ion-no-margin" v-if="dealData.dealType !== ''" :icon="setIconByDealType(dealData.dealType)"></ion-icon>
                    <ion-label>
                        <Select :data="dealTypes" :placeholder="`Укажите тип дела`" @date-updated="(selected) => dealData.dealType = selected.currentValue"/>
                    </ion-label>
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
                                    <ion-text>{{contact.contactInfo.surname}} {{contact.contactInfo.name}}</ion-text>
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
                <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="isCalendarOpened = true">{{datepicker(dealData.executionDate)}}</ion-button>
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
                        <ion-card @click.stop="openCurrentDealSubject(index)" class="ion-padding ion-text-center card-center relative" v-for="(item, index) in dealData.dealsList" :key="item.id">
                            <!-- Кнопка удалить конкретный предмет дела -->
                            <ion-icon @click.stop="openDeleteSubjectModal(item.id)" class="icon_size icon_del absolute" :icon="closeCircleOutline"></ion-icon>
                            <!-- Item -->
                            <ion-thumbnail v-if="item.selectedProduct !== ''" style="height: 64px; width: 64px; margin: 0 auto" class="relative">
                                <!-- Если тип дела Продажа -->
                                <div v-if="dealData.dealType === 'sale'">
                                    <ion-img style="height: 100%" :src="`../img/subjects/sale/${item.selectedProduct}.webp`"></ion-img>
                                </div>
                                <!-- Если тип дела Закупка -->
                                <div v-if="dealData.dealType === 'buy'">
                                    <ion-img style="height: 100%" :src="`../img/subjects/buy/${item.selectedProduct}.webp`"></ion-img>
                                </div>
                                <!-- mark where subject has attribute -->
                                <div v-if="checkRentAttr(item)" class="absolute mark-atribute"></div>
                            </ion-thumbnail>
                            <ion-label style="font-size: 12px">
                                x{{item.productQuantity}}
                            </ion-label>
                            <ion-text style="white-space: normal">{{ translateDealSubjectRecipe(item.recipe) }}</ion-text>
                        </ion-card>
                        <!-- Открываем меню создания предмета к делу -->
                        <ion-card class="ion-padding card-center card-add" @click="openCreateSubjectModal()">
                            <ion-icon :icon="addCircleOutline" color="primary" class="icon_size"></ion-icon>
                            <ion-text class="ion-text-center ion-margin-top" color="primary">
                                Добавить
                            </ion-text> 
                        </ion-card>
                        <!-- Компонент создания нового предмета к делу -->
                        <CreateDealSubject
                            :is-open="isCreateNewSubjectOpened"
                            @closeModal="closeCreateSubjectModal"
                            @createSubject="addNewSubject"
                            :subjectData="currentSubject"
                            :currentDealType="dealData.dealType"
                            @getSubjectPrice="setNewSubjectPrice"
                            @getGramPerPerson="setNewGramPerPerson"
                            @getSubjectQty="setNewSubjectQty"
                            @getPersonQty="setNewPersonQty"
                        />
                        <!-- Компонент просмотра предмета по делу -->
                        <ViewDealSubject
                            :is-open="isViewDealSubjectOpened"
                            @closeModal="isViewDealSubjectOpened = false"
                            :subjectData="currentDealSubject"
                            :currentDealType="dealData.dealType"
                            @getSubjectPrice="setSubjectPrice"
                            @getGramPerPerson="setGramPerPerson"
                            @getSumAttributesPriceValue="setSumAttributesPriceValue"
                            @getSubjectQty="setSubjectQty"
                            @getPersonQty="setPersonQty"
                            :countQtyButtonColor="countQtyButtonColor"
                            :countPersonQtyButtonColor="countPersonQtyButtonColor"
                        />
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
    import { defineComponent, ref, computed, watch, watchEffect } from 'vue';
    import store from '../../store/index'; 
    import { uid } from 'uid';
    //
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, IonSearchbar, IonItem, IonChip, IonIcon, IonCard, IonActionSheet, IonThumbnail, IonImg, IonLabel } from '@ionic/vue';
    import { addCircleOutline, closeCircleOutline } from 'ionicons/icons'
    //
    import ModalCalendar from './NewDeal-modalCalendar.vue'
    import Select from '../Select.vue'
    import CreateDealSubject from '../modal/ViewDeal-modalCreateSubject.vue';
    import ViewDealSubject from '../modal/ViewDeal-modalViewSubject.vue'
    //
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    import { setColorByDealType } from '../../helpers/setColorByDealType';
    import { setIconByDealType } from '../../helpers/setIconBy';
    import { translateValue } from '../../helpers/translateValue';
    //
    export default defineComponent({
        name: 'CreateNewDeal',
        emits: ['date-updated', 'closeModal', 'createDeal', 'updateDate', 'addSubject', 'deleteSubject'],
        props: {
            dealData: Object,
            myContacts: Array
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, ModalCalendar, IonSearchbar, IonItem, Select, IonChip, IonIcon, IonCard, CreateDealSubject, ViewDealSubject, IonActionSheet, IonThumbnail, IonImg, IonLabel
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
            // ============================ управление current deal subject ================================
            const isCreateNewSubjectOpened = ref(false);
            // Открывает модалку создания нового предмета к текущему делу
            const openCreateSubjectModal = () => {
                if(dealData.value.dealType !== '') {
                    isCreateNewSubjectOpened.value = true
                    if (dealData.value.dealType === 'sale') {
                        currentSubject.value = {
                            id: uid(),
                            selectedProduct: '',
                            price: 0,
                            costEstimation: '',
                            personQuantity: 1,
                            gramPerPerson: 120,
                            subjectDiscount: 0,
                            subjectPrice: 0,
                            recipe: '',
                            productQuantity: 1,
                            additionalAttributes: [],
                            totalSubjectPrice: 0, 
                            productNote: '',
                        }
                    } else if (dealData.value.dealType === 'buy') {
                        currentSubject.value = {
                            id: uid(),
                            selectedProduct: '',
                            price: '',
                            subjectPrice: 0,
                            // costEstimation: '',
                            productQuantity: 1,
                            productNote: '',
                        }
                    }
                } else {
                    alert('NewDeal-modalCreate: Вы не указали тип дела')
                }
            }
            // Закрываем модалку создания нового предмета к текущему делу
            const closeCreateSubjectModal = () => {
                isCreateNewSubjectOpened.value = false
                // Обнуляем шаблон нового предмета у дела согласно dealType
                // if (dealData.value.dealType === 'sale') {
                //     currentSubject.value = {
                //         id: uid(),
                //         selectedProduct: '',
                //         price: '',
                //         costEstimation: '',
                //         personQuantity: 1,
                //         gramPerPerson: 120,
                //         subjectDiscount: 0,
                //         subjectPrice: 0,
                //         recipe: '',
                //         productQuantity: 1,
                //         additionalAttributes: [],
                //         totalSubjectPrice: 0, 
                //         productNote: '',
                //     }
                // } else if (dealData.value.dealType === 'buy') {
                //     currentSubject.value = {
                //         id: uid(),
                //         selectedProduct: '',
                //         price: '',
                //         subjectPrice: 0,
                //         // costEstimation: '',
                //         productQuantity: 1,
                //         productNote: '',
                //     }
                // }
            }
            
            // ================================= Удаление конкретного предмета у дела ============================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteSubject = ref(false);
            // Храним айди предмета к удалению
            const subjectToDelete = ref();
            // Кнопка action sheet для подтверждения удаления
            const deleteDealSubjectButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        emit('deleteSubject', subjectToDelete.value)
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
            // удаляем current deal item (обнолвений в БД здесь не производится)
            const openDeleteSubjectModal = (id) => {
                // console.log(id)
                subjectToDelete.value = id;
                deleteSubject.value = true;
            }
            // Заготовка под шаблон нового предмета к делу
            const currentSubject = ref({})
            //
            const dealData = ref();
            //
            const isAttributesMenuOpened = ref(false);
            //
            const addNewSubject = (subjectData, isMenuOpened) => {
                // Выдумать варианты валидации
                if (currentSubject.value.selectedProduct === '' ) {
                    alert('NewDeal-modalCreate: Вы не выбрали предмет дела')
                } else if(dealData.value.dealType === 'sale' && currentSubject.value.recipe === '') {
                    alert('NewDeal-modalCreate: Вы не указали рецепт')
                } else {
                    currentSubject.value = subjectData
                    emit('addSubject', currentSubject.value)
                    closeCreateSubjectModal()
                    console.log('new subject created')
                    isAttributesMenuOpened.value = !isMenuOpened;
                }
            }

            // Проверяем выбрани ли атрибуты у предмета заказа
            const checkRentAttr = (item) => {
                if(dealData.value.dealType === 'sale') {
                    if(item.additionalAttributes.length > 0) {
                        // Если атрибут выбран
                        return true
                    } else if (item.additionalAttributes.length === 0 ){
                        // Если атрибутов в принципе не выбрано
                        // console.log('без атрибутов')
                        return false;
                    }
                } else if (dealData.value.dealType === 'buy') {
                    return
                }
            }

            // =================================== Управление current deal subject ===============================
            const currentDealSubject = ref();
            // открываем view current deal item
            const isViewDealSubjectOpened = ref(false);
            const openCurrentDealSubject = (index) => {
                isViewDealSubjectOpened.value = true;
                currentDealSubject.value = dealData.value.dealsList[index];
                setCountQtyButtonColor(currentDealSubject.value.productQuantity)
                setCountPersonQtyButtonColor(currentDealSubject.value.personQuantity)
            }
            //
            const translateDealSubjectRecipe = (value) => {
                if(dealData.value.dealType === 'sale') {
                    if(value === 'no-recipe' || value === '') {
                        return 'Без рецепта'
                    } else {
                        return translateValue(value, userRecipeArray.value)
                    }
                }
            }
            // Подтягивает данные по рецептам ПОЛЬЗОВАТЕЛЯ из стора (временно)
            const userRecipeArray = ref(store.state.userRecipeArray)

            watchEffect(() => {
                myContactsArray.value = props.myContacts;
                dealData.value = props.dealData;
            });

            const currentDealType = ref();    
            watch(currentDealType, () => {
                // При случайном или намеренном изменении типа дела - очищаем объект дела
                // console.log(currentDealType.value)
                dealData.value.dealType = currentDealType.value
                // dealData.value.dealType = ''
                dealData.value.contactID = '000'
                dealData.value.dealsList = []
                dealData.value.shipping = ''
                dealData.value.totalDealPrice = ''
                dealData.value.executionDate = ''
                dealData.value.dealPaid = ''
                dealData.value.cancelledReason = ''
            })

            // ================================== New Deal Modal Create Subject ============================================
            //
            const sumAttributesPriceValue = ref(0);
            const setSumAttributesPriceValue = (sumAttrPriceValue) => {
                sumAttributesPriceValue.value = sumAttrPriceValue
            }
            // Считаем общую totalSubjectPrice по CURRENT предмету (предмет + допы)
            const calcNewSubjectTotalPrice = () => {
                currentSubject.value.totalSubjectPrice = currentSubject.value.subjectPrice + sumAttributesPriceValue.value
            }
            // Считаем общую totalSubjectPrice по NEW предмету (предмет + допы)
            const calcSubjectTotalPrice = () => {
                currentDealSubject.value.totalSubjectPrice = currentDealSubject.value.subjectPrice + sumAttributesPriceValue.value
            }
            // ставим Current Subject PRICE
            const setSubjectPrice = (price) => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.price = price;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = (currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)

                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = currentDealSubject.value.price * currentDealSubject.value.productQuantity
                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
            }
            // ставим NEW Subject PRICE
            const setNewSubjectPrice = (price) => {
                if(dealData.value.dealType === 'sale') {
                    currentSubject.value.price = price;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = (currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = currentSubject.value.price * currentSubject.value.productQuantity
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if(dealData.value.dealType === 'but') {
                    console.log('В разработке')
                }
            }
            // ставим Current Subject gramPerPErson
            const setGramPerPerson = (gram) => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.gramPerPerson = gram;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = (currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)

                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = currentDealSubject.value.price * currentDealSubject.value.productQuantity
                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
            }
            // ставим NEW Subject gramPerPerson
            const setNewGramPerPerson = (gram) => {
                if(dealData.value.dealType === 'sale') {
                    currentSubject.value.gramPerPerson = gram;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = (currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = currentSubject.value.price * currentSubject.value.productQuantity
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if(dealData.value.dealType === 'but') {
                    console.log('В разработке')
                }
            }
            // ставим Current Subject QUANTITY
            const setSubjectQty = (qty) => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.productQuantity = qty;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = (currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        setCountQtyButtonColor(qty)
                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = currentDealSubject.value.price * currentDealSubject.value.productQuantity
                        setCountQtyButtonColor(qty)
                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (dealData.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // ставим New Subject QUANTITY
            const setNewSubjectQty = (qty) => {
                if(dealData.value.dealType === 'sale') {
                    currentSubject.value.productQuantity = qty;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = (currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = currentSubject.value.price * currentSubject.value.productQuantity
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (dealData.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // count SUBJECT QTY BUTTON COLOR
            const countQtyButtonColor = ref('primary');
            const setCountQtyButtonColor = (qty) => {
                if(qty < 2) {
                    return countQtyButtonColor.value = 'light'
                } else {
                    return countQtyButtonColor.value = 'primary'
                }
            }
            // ставим Current PERSON Subject QUANTITY
            const setPersonQty = (qty) => {
                if(dealData.value.dealType === 'sale') {
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        currentDealSubject.value.personQuantity = qty;
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = (currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        setCountPersonQtyButtonColor(qty)
                        calcSubjectTotalPrice()
                    } else if(currentDealSubject.value.costEstimation === 'perUnit') {
                        // Не используется
                    }else if(currentDealSubject.value.costEstimation === 'per100gram') {
                        // Не используется
                    }
                } else if(dealData.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // ставим NEW PERSON Subject QUANTITY
            const setNewPersonQty = (qty) => {
                if(dealData.value.dealType === 'sale') {
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        currentSubject.value.personQuantity = qty;
                        // Формула рассчета цены currentSubject 
                        currentSubject.value.subjectPrice = (currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        // Не используется
                    } else if(currentSubject.value.costEstimation === 'per100gram') {
                        // Не используется
                    }
                } else if(dealData.value.dealType === 'buy') {
                    console.log('В разработке')
                } 
            }
            // count PERSON QTY BUTTON COLOR
            const countPersonQtyButtonColor = ref('primary');
            const setCountPersonQtyButtonColor = (qty) => {
                if(qty < 2) {
                    return countPersonQtyButtonColor.value = 'light'
                } else {
                    return countPersonQtyButtonColor.value = 'primary'
                }
            }


            return {
                dealContact, dealContactID , searchContactMenu, choose, isCalendarOpened, closeModalCalendar, updateExecutionDate, datepicker, myContactsArray, searchDealContact, searchedContacts, dealTypes, addCircleOutline, closeCircleOutline, isCreateNewSubjectOpened, openCreateSubjectModal, closeCreateSubjectModal, currentSubject, openDeleteSubjectModal, subjectToDelete, deleteDealSubjectButtons, addNewSubject, deleteSubject, dealData, currentDealSubject, isViewDealSubjectOpened, openCurrentDealSubject, checkRentAttr, setColorByDealType, setIconByDealType, translateDealSubjectRecipe, userRecipeArray, currentDealType, isAttributesMenuOpened, setNewSubjectPrice, calcNewSubjectTotalPrice, sumAttributesPriceValue, setSumAttributesPriceValue, setSubjectPrice, setSubjectQty, setCountQtyButtonColor, countQtyButtonColor, calcSubjectTotalPrice, setNewSubjectQty, setPersonQty, setNewPersonQty, countPersonQtyButtonColor, setCountPersonQtyButtonColor, setGramPerPerson, setNewGramPerPerson
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