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
                        <Select :data="dealTypes" :placeholder="`Укажите тип дела`" @date-updated="(selected) => currentDealType = selected.currentValue"/>
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
                            @getSubjectDiscount="setNewSubjectDiscount"
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
                            @getSubjectDiscount="setSubjectDiscount"
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

            <!-- ========================== Доставка ================================================= -->
            <ion-item-group class="ion-text-left ion-padding-horizontal" v-if="dealData.dealType === 'sale'">
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin" >Доставка</h4>
                </ion-text>
                <!-- Тип доставки -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">Тип доставки</ion-button>
                            <ion-chip :color="setChipColor(dealData.shipping.typeOfShipping)">
                                <Select
                                    :data="shippingTypeList" 
                                    placeholder="Не выбран"
                                    @date-updated="(selected) => dealShippingType = selected.currentValue"
                                />
                            </ion-chip>
                        </ion-row>
                </ion-grid>
                <!-- Стоимость доставки -->
                <!-- Вариант с доставкой -->
                <ion-grid v-if="dealData.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="shippingPrice" :value="dealData.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>
                    </ion-row>
                </ion-grid>
                <!-- Вариант при самовывозе (disabled изменения input) -->
                <ion-grid v-if="dealData.shipping.typeOfShipping === 'shipping-pickup'" class="ion-no-padding border-bottom">
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                        <!-- Заголовок -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Стоимость доставки ({{ currency }})
                        </ion-button>
                        <!-- Ценник -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                        <ion-input type="number" disabled="true" v-model="shippingPrice" :value="dealData.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                    </ion-button>

                    </ion-row>
                </ion-grid>
                <!-- Адрес доставки -->
                <ion-grid v-if="dealData.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding border-bottom">
                    <!-- Header -->
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Заголовок -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Адрес доставки
                        </ion-button>
                    </ion-row>
                    <!-- Content -->
                    <ion-row class="ion-margin-bottom">
                        <ion-textarea class="ion-margin-bottom" autocapitalize="on" v-model="shippingAddress"></ion-textarea>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
            <ion-item-group class="ion-text-left ion-padding-horizontal" v-if="dealData.dealType === 'buy'">
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin" >Доставка</h4>
                </ion-text>
                <!-- Тип доставки -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">Тип доставки</ion-button>
                            <ion-chip :color="setChipColor(dealData.shipping.typeOfShipping)">
                                <Select
                                    :data="shippingTypeList" 
                                    placeholder="Не выбран"
                                    @date-updated="(selected) => dealShippingType = selected.currentValue"
                                />
                            </ion-chip>
                        </ion-row>
                </ion-grid>
                <!-- Стоимость доставки -->
                <!-- Вариант с доставкой -->
                <ion-grid v-if="dealData.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="shippingPrice" :value="dealData.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>
                    </ion-row>
                </ion-grid>
                <!-- Вариант при самовывозе (в данном случае disabled="false") -->
                <ion-grid v-if="dealData.shipping.typeOfShipping === 'shipping-pickup'" class="ion-no-padding border-bottom">
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                        <!-- Заголовок -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Стоимость доставки ({{ currency }})
                        </ion-button>
                        <!-- Ценник -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                        <ion-input type="number" v-model="shippingPrice" :value="dealData.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                    </ion-button>

                    </ion-row>
                </ion-grid>
            </ion-item-group>
            
            <!-- ============================ ИТОГ ==================================================== -->
            <ion-item-group v-if="dealData.dealType !== ''" class="ion-text-left ion-padding-horizontal">
                <!-- Заголовок -->
                <ion-text>
                    <h4>Итого</h4>
                </ion-text>

                <!-- Итог предметов в режиме sale -->
                <div v-if="dealData.dealType === 'sale'">
                    sale...
                </div>

                <!-- Итог предметов в режиме sale -->
                <div v-if="dealData.dealType === 'buy'">
                    buy...
                </div>
            </ion-item-group>


            <!--  -->
            <ion-item-group class="ion-text-left ion-padding-horizontal" v-if="dealData.dealType === 'sale'">
                {{sumAllTotalSubjectPriceFunc(dealData.dealsList)}}
            </ion-item-group>
            <!--  -->
            <ion-item-group class="ion-text-left ion-padding-horizontal" v-if="dealData.dealType === 'sale'">
                <!-- Заголовок -->
                <ion-text>
                    <h4>Итого</h4>
                </ion-text>
                <!--  -->
                <ion-list>
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text>Торт</ion-text>
                            <ion-text>1.00 * 2378.00 = 2378.00 </ion-text>
                        </ion-row>
                    </ion-grid>
                </ion-list>
                <ul style="list-style: none; padding-left: 0; font-size: 14px;" class="ion-text-left">
                    <li>
                            <br>
                        Без рецепта <br>
                        С учетом 5% скидки (118,90) = 2259,10<br>
                        Напиток 1.00 * 150.00 = 150.00 <br>
                        Упаковка для торта 1.00 * 210.00 = 210.00
                    </li>
                    <li style="margin-top: 10px;">
                        Капкейк Молочная девочка 6.00 * 190.00 = 1140.00 <br>
                        Напиток 1.00 * 150.00 = 150.00 <br>
                        Упаковка для капкейков 1.00 * 210.00 = 210.00
                    </li>
                    <li style="margin-top: 10px; background-color: green;">
                        Итог: {{sumAllTotalSubjectPriceFunc(dealData.dealsList)}} {{ currency }}
                    </li>
                    <li style="margin-top: 10px; background-color: green;">
                        Доставка: {{ dealData.shipping.shippingPrice }} {{ currency }}
                    </li>
                </ul>
                <ul>
                    <li style="background-color: green;">
                        Сумма оплате: {{ dealData.totalDealPrice }}
                    </li>
                    <li>
                        Оплачено: (dealPaid): =1000.00 <br>
                    </li>
                    <li>
                        Задолженность: =3398.10 <br>
                    </li>
                </ul>
                <ion-button expand="block">
                    Внести
                </ion-button>
            </ion-item-group>

            <br>
            {{dealData}}
            <br>
            <br>
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
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, IonSearchbar, IonItem, IonChip, IonIcon, IonCard, IonActionSheet, IonThumbnail, IonImg, IonLabel, IonTextarea, IonList } from '@ionic/vue';
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
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonInput, ModalCalendar, IonSearchbar, IonItem, Select, IonChip, IonIcon, IonCard, CreateDealSubject, ViewDealSubject, IonActionSheet, IonThumbnail, IonImg, IonLabel, IonTextarea, IonList
        },
        setup(props, { emit }) {
            // Currency
            const currency = ref(store.state.systemCurrency.name);
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
                            price: 0,
                            gramPerPerson: 0,
                            subjectPrice: 0,
                            costEstimation: '',
                            productQuantity: 1,
                            totalSubjectPrice: 0, 
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
                    } else {
                        return
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
            const currentDealType = ref('');
            watchEffect(() => {
                myContactsArray.value = props.myContacts;
                dealData.value = props.dealData;
                currentDealType.value = props.dealData.dealType;
            });
            
            currentDealType.value = dealData.value.dealType
            watch(currentDealType, (type) => {
                // При случайном или намеренном изменении типа дела - очищаем объект дела
                dealData.value.dealType = type
                // console.log(currentDealType.value)
                console.log(type)
                // dealData.value.dealType = ''
                dealData.value.contactID = '000'
                dealData.value.dealsList = []
                dealData.value.shipping = {
                    shippingPrice: 0
                }
                dealData.value.totalDealPrice = 0
                dealData.value.executionDate = ''
                dealData.value.dealPaid = 0
                dealData.value.cancelledReason = ''
                //
            })

            // ================================== New Deal Modal Create Subject ============================================
            //
            const sumAttributesPriceValue = ref(0);
            const setSumAttributesPriceValue = (sumAttrPriceValue) => {
                sumAttributesPriceValue.value = sumAttrPriceValue
            }
            // Считаем общую totalSubjectPrice по CURRENT предмету (предмет + допы)
            const calcNewSubjectTotalPrice = () => {
                if (dealData.value.dealType === 'sale') {
                    currentSubject.value.totalSubjectPrice = currentSubject.value.subjectPrice + sumAttributesPriceValue.value
                } else if (dealData.value.dealType === 'buy') {
                    currentSubject.value.totalSubjectPrice = currentSubject.value.subjectPrice
                }
            }
            // Считаем общую totalSubjectPrice по NEW предмету (предмет + допы)
            const calcSubjectTotalPrice = () => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.totalSubjectPrice = currentDealSubject.value.subjectPrice + sumAttributesPriceValue.value
                } else if (dealData.value.dealType === 'buy') {
                    currentDealSubject.value.totalSubjectPrice = currentDealSubject.value.subjectPrice
                }
            }
            // ставим Current Subject PRICE
            const setSubjectPrice = (price) => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.price = price;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (dealData.value.dealType === 'buy') {
                    currentDealSubject.value.price = price;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * currentDealSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                calcSubjectTotalPrice()
            }
            // ставим NEW Subject PRICE
            const setNewSubjectPrice = (price) => {
                if(dealData.value.dealType === 'sale') {
                    currentSubject.value.price = price;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity *((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if(dealData.value.dealType === 'buy') {
                    currentSubject.value.price = price;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * currentSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(0)
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
                calcNewSubjectTotalPrice()
            }
            // ставим Current Subject gramPerPErson
            const setGramPerPerson = (gram) => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.gramPerPerson = gram;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(2)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (dealData.value.dealType === 'buy') {
                    currentDealSubject.value.gramPerPerson = gram;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * currentDealSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                calcSubjectTotalPrice()
            }
            // ставим NEW Subject gramPerPerson
            const setNewGramPerPerson = (gram) => {
                if(dealData.value.dealType === 'sale') {
                    currentSubject.value.gramPerPerson = gram;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if(dealData.value.dealType === 'buy') {
                    currentSubject.value.gramPerPerson = gram;
                    if (currentSubject.value.costEstimation === 'perKilogram') {
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * currentSubject.value.gramPerPerson).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                calcNewSubjectTotalPrice()
            }
            // ставим Current Subject QUANTITY
            const setSubjectQty = (qty) => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.productQuantity = qty;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы) и цвет кнопок меняем пол условию
                        // setCountQtyButtonColor(qty)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // setCountQtyButtonColor(qty)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (dealData.value.dealType === 'buy') {
                    currentDealSubject.value.productQuantity = qty;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * currentDealSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(2)
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы) и цвет кнопок меняем пол условию
                setCountQtyButtonColor(qty)
                calcSubjectTotalPrice()
            }
            // ставим New Subject QUANTITY
            const setNewSubjectQty = (qty) => {
                if(dealData.value.dealType === 'sale') {
                    currentSubject.value.productQuantity = qty;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcNewSubjectTotalPrice()
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (dealData.value.dealType === 'buy') {
                    currentSubject.value.productQuantity = qty;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * currentSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(0)
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                calcNewSubjectTotalPrice()
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
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        setCountPersonQtyButtonColor(qty)
                        calcSubjectTotalPrice()
                    } else if(currentDealSubject.value.costEstimation === 'perUnit') {
                        // Не используется
                    }else if(currentDealSubject.value.costEstimation === 'per100gram') {
                        // Не используется
                    }
                } else if(dealData.value.dealType === 'buy') {
                    // Если не понадобится - удалить
                    console.log('В разработке')
                }
            }
            // ставим NEW PERSON Subject QUANTITY
            const setNewPersonQty = (qty) => {
                if(dealData.value.dealType === 'sale') {
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        currentSubject.value.personQuantity = qty;
                        // Формула рассчета цены currentSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        // Не используется
                    } else if(currentSubject.value.costEstimation === 'per100gram') {
                        // Не используется
                    }
                } else if(dealData.value.dealType === 'buy') {
                    // Если не понадобится - удалить
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
            // ставим CURRENT subject discount
            const setSubjectDiscount = (discount) => {
                if(dealData.value.dealType === 'sale') {
                    currentDealSubject.value.subjectDiscount = discount;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (dealData.value.dealType === 'buy') {
                    // Если не понадобится - удалить
                    console.log('В разработке')
                }
            }
            // Ставим NEW subject discount
            const setNewSubjectDiscount = (dicsount) => {
                if(dealData.value.dealType === 'sale') {
                    currentSubject.value.subjectDiscount = dicsount;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity *((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if(dealData.value.dealType === 'buy') {
                    // Если не понадобится - удалить
                    console.log('В разработке')
                }
            }
            // Задаем цвет chip
            const setChipColor = (value) => {
                // Это для селекта по выбоору статуса дела
                if (value === 'deal-in-debt') {
                    return 'danger'
                }
                if (value === 'deal-complete') {
                    return 'success'
                }
                if(value === 'deal-cancelled') {
                    return 'warning'
                }
                // Это для селекта по выбору типа доставки
                if(value === 'shipping-pickup') {
                    return 'primary'
                } 
                if(value === 'shipping-delivery') {
                    return 'primary'
                }
                return 'primary'
            }
            // массив вариантов доставки из store
            const shippingTypeList = ref(store.state.shippingTypeList)
            // храним значение dealShippingType
            const dealShippingType = ref();
            // следим за изменениями значения dealShippingType у текущего дела и обновляем его в БД
            watch (dealShippingType, () => {
                // При переключении обнуляем счетчик
                shippingPrice.value = 0
                if(dealShippingType.value === 'shipping-pickup') {
                    dealData.value.shipping = {
                        typeOfShipping: dealShippingType.value,
                        shippingPrice: 0
                    }
                } else if (dealShippingType.value === 'shipping-delivery') {
                    dealData.value.shipping = {
                        typeOfShipping: dealShippingType.value,
                        shippingAddress: '',
                        shippingPrice: 0
                    }
                }
                // update()
            })
            // следим за измененимями цены доставки
            const shippingPrice = ref()
            watch(shippingPrice, () => {
                // dealData.value.shipping.shippingPrice = +shippingPrice.value
                if(dealData.value.dealType === 'sale') {
                    if(dealData.value.dealsList.length === 0) {
                        dealData.value.shipping.shippingPrice = +shippingPrice.value
                        dealData.value.totalDealPrice = dealData.value.shipping.shippingPrice
                        // update()
                    } else {
                        // console.log(shippingPrice.value)
                        dealData.value.shipping.shippingPrice = +shippingPrice.value
                        // update()
                    }
                } else if (dealData.value.dealType === 'buy') {
                    if(dealData.value.dealsList.length === 0) {
                        dealData.value.shipping.shippingPrice = +shippingPrice.value
                        dealData.value.totalDealPrice = dealData.value.shipping.shippingPrice
                        // update()
                    } else {
                        // console.log(shippingPrice.value)
                        dealData.value.shipping.shippingPrice = +shippingPrice.value
                        // update()
                    }
                }
            })
            //
            const shippingAddress = ref();
            watch(shippingAddress, () => {
                dealData.value.shipping.shippingAddress = shippingAddress.value
            })
            // Считаем сумму всех PRICE всех subject
            const sumAllTotalSubjectPrice = ref();
            const sumAllTotalSubjectPriceFunc = (array) => {
                if(array.length !== 0) {
                    // Выбираем из массива данных нужные значения
                    let totalSubjectPriceArray = array.map(item => item.totalSubjectPrice)
                    // Суммируем значения
                    const sumAllTotalSubjectPrice = totalSubjectPriceArray.reduce((accumulator, currentValue) => accumulator + currentValue)
                    calcTotalDealPrice(sumAllTotalSubjectPrice)
                    // console.log(sumAllTotalSubjectPrice.value)
                    return sumAllTotalSubjectPrice
                } else {
                    calcTotalDealPrice(0)
                    // sumAllTotalSubjectPrice.value = 0
                    return 0
                }
            }
            // функция калькуляции общей стоимости дела
            const calcTotalDealPrice = (sumSubjectPrice) => {
                if(dealData.value.dealType === 'sale') {
                    // console.log(sumSubjectPrice)
                    dealData.value.totalDealPrice = sumSubjectPrice + dealData.value.shipping.shippingPrice
                    // update()
                } else if (dealData.value.dealType === 'buy') {
                    // Доставки в данном разделе нет
                    dealData.value.totalDealPrice = sumSubjectPrice
                }
            }

            return {
                currency, dealContact, dealContactID , searchContactMenu, choose, isCalendarOpened, closeModalCalendar, updateExecutionDate, datepicker, myContactsArray, searchDealContact, searchedContacts, dealTypes, addCircleOutline, closeCircleOutline, isCreateNewSubjectOpened, openCreateSubjectModal, closeCreateSubjectModal, currentSubject, openDeleteSubjectModal, subjectToDelete, deleteDealSubjectButtons, addNewSubject, deleteSubject, dealData, currentDealSubject, isViewDealSubjectOpened, openCurrentDealSubject, checkRentAttr, setColorByDealType, setIconByDealType, translateDealSubjectRecipe, userRecipeArray, currentDealType, isAttributesMenuOpened, setNewSubjectPrice, calcNewSubjectTotalPrice, sumAttributesPriceValue, setSumAttributesPriceValue, setSubjectPrice, setSubjectQty, setCountQtyButtonColor, countQtyButtonColor, calcSubjectTotalPrice, setNewSubjectQty, setPersonQty, setNewPersonQty, countPersonQtyButtonColor, setCountPersonQtyButtonColor, setGramPerPerson, setNewGramPerPerson, setSubjectDiscount, setNewSubjectDiscount, setChipColor, shippingTypeList, dealShippingType, shippingPrice, shippingAddress, sumAllTotalSubjectPrice, sumAllTotalSubjectPriceFunc, calcTotalDealPrice
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
    .flex_nowrap {
        flex-wrap: nowrap;
    }
    .border-bottom {
        border-bottom: 1px solid var(--ion-color-light);
    }
    .border-top {
        border-top: 1px solid var(--ion-color-light);
    }
</style>