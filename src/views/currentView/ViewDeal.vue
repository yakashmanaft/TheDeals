<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader />

        <!-- view deal subject -->
        <ViewDealSubject 
            :isOpen="isViewDealSubjectOpened"
            @closeModal="isViewDealSubjectOpened = false;"
            :subjectData="currentDealSubject"
            :currentDealType="currentDeal.dealType"
            @updateBD="updateBD"
            @getSubjectPrice="setSubjectPrice"
            @getGramPerPerson="setGramPerPerson"
            @getSumAttributesPriceValue="setSumAttributesPriceValue"
            @getSubjectQty="setSubjectQty"
            @getPersonQty="setPersonQty"
            :countQtyButtonColor="countQtyButtonColor"
            :countPersonQtyButtonColor="countPersonQtyButtonColor"
            @getSubjectDiscount="setSubjectDiscount"
        />

        <!-- add subject to deal -->
        <CreateDealSubject
            :isOpen="isCreateNewSubjectOpened"
            @closeModal="closeCreateSubjectModal"
            :subjectData="currentSubject"
            @createSubject="addNewSubject"
            :currentDealType="currentDeal.dealType"
            @getSubjectPrice="setNewSubjectPrice"
            @getGramPerPerson="setNewGramPerPerson"
            @getSubjectQty="setNewSubjectQty"
            @getPersonQty="setNewPersonQty"
            @getSubjectDiscount="setNewSubjectDiscount"
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
                <!-- currentSubject: {{currentSubject}}
                currentDealSubject: {{currentDealSubject}} -->
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
                    <ion-grid class="ion-no-padding border-bottom">
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
                    <ion-grid class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- Текущая дата и время исполнения -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">{{ datepicker(currentDeal.executionDate) }}</ion-button>
                            <!-- Кнопка активации компонента, она же показывает выбранное -->
                            <ion-button size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="openModalCalendar(isCalendarOpened = true)">Изменить</ion-button>
                        </ion-row>
                    </ion-grid>
                    <!--  -->
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
                                    <div v-if="checkRentAttr(item, currentDeal.dealType)" class="absolute mark-atribute"></div>
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

                <!-- ========================== Доставка ================================================= -->
                <ion-item-group class="ion-text-left ion-padding-horizontal" v-if="currentDeal.dealType === 'sale'">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4 class="ion-no-margin" >Доставка</h4>
                    </ion-text>
                    <!-- Тип доставки -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">Тип доставки</ion-button>
                            <!--  -->
                            <ion-chip :color="setChipColor(currentDeal.shipping.typeOfShipping)">
                                <Select
                                    :data="shippingTypeList" 
                                    :placeholder="translateShippingType(currentDeal.shipping.typeOfShipping)"
                                    @date-updated="(selected) => dealShippingType = selected.currentValue"
                                />
                            </ion-chip>
                        </ion-row>
                    </ion-grid>
                    <!-- Стоимость доставки -->
                    <!-- Вариант с доставкой -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="shippingPrice" :value="currentDeal.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- Вариант при самовывозе (disabled изменения input) -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-pickup'" class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" disabled="true" v-model="shippingPrice" :value="currentDeal.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>

                        </ion-row>
                    </ion-grid>
                    <!-- Адрес доставки -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding border-bottom">
                        <!-- header -->
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Адрес доставки
                            </ion-button>
                            <!-- Кнопка изменить адрес -->
                            <ion-button v-if="editShippingAddress === false" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="editShippingAddress = true">Изменить</ion-button>
                            <ion-button v-if="editShippingAddress === true" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="toggleEditShippingAddress">Готово</ion-button>
                        </ion-row>
                        <!--content -->
                        <ion-row class="ion-margin-bottom">
                            <!-- Адрес доставки -->
                            <ion-text v-if="editShippingAddress === false">{{setProductNotePlaceholder(currentDeal.shipping.shippingAddress)}}</ion-text>
                            <ion-textarea v-if="editShippingAddress === true" class="ion-margin-bottom" autocapitalize="on" v-model="shippingAddress"></ion-textarea>
                        </ion-row>
                    </ion-grid>
                </ion-item-group> 

                <!-- ============================ ИТОГ ==================================================== -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Итого</h4>
                    </ion-text>
                    <!--  -->
                    <ion-list class="border-bottom ion-padding-bottom">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text>Торт</ion-text>
                                <ion-text>1.00 * 2378.00 = 2378.00 </ion-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text style="font-size: 0.8rem" color="medium">Без рецепта</ion-text>
                                <ion-text style="font-size: 0.8rem" color="medium">С учетом скидки</ion-text>
                            </ion-row>
                        </ion-grid>
                        <ion-grid class="ion-no-padding ion-margin-top">
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text>Напиток</ion-text>
                                <ion-text>1.00 * 150.00 = 150.00 </ion-text>
                            </ion-row>
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text style="font-size: 0.8rem" color="medium">Атрибут</ion-text>
                                <!-- <ion-text style="font-size: 0.8rem" color="medium">С учетом скидки</ion-text> -->
                            </ion-row>
                        </ion-grid>
                    </ion-list>
                    <!--  -->

                    
                    <!--  -->
                    <ul style="list-style: none; padding-left: 0; font-size: 14px;" class="ion-text-left">
                        <li style="margin-top: 10px; background-color: green;">
                            Итог: {{sumAllTotalSubjectPriceFunc(currentDeal.dealsList)}} {{ currency }}
                        </li>
                        <li style="margin-top: 10px; background-color: green;">
                            Доставка: {{ currentDeal.shipping.shippingPrice }} {{ currency }}
                        </li>
                    </ul>
                    <ul>
                        <li style="background-color: green;">
                            Сумма оплате: {{ currentDeal.totalDealPrice }}
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
    import { IonContent, IonButton, IonActionSheet, IonItemGroup, IonText, IonGrid, IonRow, IonModal, IonItem, IonSearchbar, IonChip, IonCard, IonImg, IonThumbnail, IonLabel, IonIcon, IonInput, IonTextarea, IonList } from '@ionic/vue';
    import { addCircleOutline, closeCircleOutline, helpOutline } from 'ionicons/icons';
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    import { setColorByDealType } from '@/helpers/setColorByDealType';
    import { setIconByDealType } from '@/helpers/setIconBy';
    import { translateValue } from '@/helpers/translateValue';
    import { checkRentAttr } from '@/helpers/checkRentAttr';
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
            IonIcon,
            IonInput,
            IonTextarea, 
            IonList
        }, 
        setup() {
            // Currency
            const currency = ref(store.state.systemCurrency.name);
            //
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
            // Заготовка под шаблон нового предмета к делу
            const currentSubject = ref({})
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
                        dealsList: currentDeal.value.dealsList,
                        shipping: currentDeal.value.shipping,
                        dealPaid: currentDeal.value.dealPaid,
                        cancelledReason: currentDeal.value.cancelledReason,
                        totalDealPrice: currentDeal.value.totalDealPrice

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
            // ======================================== refresh current deal =================================
            
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
                setCountQtyButtonColor(currentDealSubject.value.productQuantity)
                setCountPersonQtyButtonColor(currentDealSubject.value.personQuantity)
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
                // update();
            }
            // create new current deal subject
            const isCreateNewSubjectOpened = ref(false);
            // Открывает модалку создания нового предмета к текущему делу
            const openCreateSubjectModal = () => {
                isCreateNewSubjectOpened.value = true;
                // Обнуляем шаблон нового предмета у дела согласно dealType
                if (currentDeal.value.dealType === 'sale') {
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
                } else if (currentDeal.value.dealType === 'buy') {
                    currentSubject.value = {
                        id: uid(),
                        selectedProduct: '',
                        price: 0,
                        subjectPrice: 0,
                        // costEstimation: '',
                        productQuantity: 1,
                        productNote: '',
                    }
                }
            }
            // Закрываем модалку создания нового предмета к текущему делу
            const closeCreateSubjectModal = () => {
                isCreateNewSubjectOpened.value = false;
                // Обнуляем шаблон нового предмета у дела согласно dealType
                // if (currentDeal.value.dealType === 'sale') {
                //     currentSubject.value = {
                //         id: uid(),
                //         selectedProduct: '',
                //         price: 0,
                //         costEstimation: '',
                //         personQuantity: 1,
                //         gramPerPerson: 120,
                //         subjectDiscount: 0,
                //         subjectPrice: 0,
                //         recipe: '',
                //         productQuantity: 0,
                //         additionalAttributes: [],
                //         totalSubjectPrice: 0, 
                //         productNote: '',
                //     }
                // } else if (currentDeal.value.dealType === 'buy') {
                //     currentSubject.value = {
                //         id: uid(),
                //         selectedProduct: '',
                //         price: 0,
                //         subjectPrice: 0,
                //         // costEstimation: '',
                //         productQuantity: 0,
                //         productNote: '',
                //     }
                // }
            }
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
                    // update();
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
            //
            const translateShippingType = (value) => {
                if(currentDeal.value.dealType === 'sale') {
                    if(value === '') {
                        return 'Не выбрано'
                    } else {
                        return translateValue(value, shippingTypeList.value)
                    }
                }
            }
            // Вспомогательная переменная
            const sumAttributesPriceValue = ref(0);
            const setSumAttributesPriceValue = (sumAttrPriceValue) => {
                sumAttributesPriceValue.value = sumAttrPriceValue
            }
            // Считаем общую totalSubjectPrice по предмету (предмет + допы)
            const calcNewSubjectTotalPrice = () => {
                currentSubject.value.totalSubjectPrice = currentSubject.value.subjectPrice + sumAttributesPriceValue.value
            }
            // ========================================= View Deal Modal View Subject ===================================================
            // Считаем общую totalSubjectPrice по предмету (предмет + допы)
            const calcSubjectTotalPrice = () => {
                currentDealSubject.value.totalSubjectPrice = currentDealSubject.value.subjectPrice + sumAttributesPriceValue.value
            }
            // ставим Current Subject PRICE
            const setSubjectPrice = (price) => {
                if(currentDeal.value.dealType === 'sale') {
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
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
                calcSubjectTotalPrice()
                update();
            }
            // ставим Current Subject gramPerPerson
            const setGramPerPerson = (gram) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDealSubject.value.gramPerPerson = gram;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + д
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
                calcSubjectTotalPrice()
                update();
            }
            // ставим Current Subject PRODUCT QUANTITY
            const setSubjectQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        currentDealSubject.value.productQuantity = qty;
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // setCountQtyButtonColor(qty)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.productQuantity = qty;
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // setCountQtyButtonColor(qty)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
                setCountQtyButtonColor(qty)
                calcSubjectTotalPrice()
                update();
            }
            // ставим Current Subjecty PERSON QUANTITY
            const setPersonQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        currentDealSubject.value.personQuantity = qty;
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        setCountPersonQtyButtonColor(qty)
                        calcSubjectTotalPrice()
                        update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        // Пока не используется в perUnit
                    } else if (currentDealSubject.value.costEstimation === 'per100gram') {
                        // Пока не используется в per100gram
                    }
                } else if(currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // Ставим Current Subject DISCOUNT
            const setSubjectDiscount = (discount) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDealSubject.value.subjectDiscount = discount;
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
                    calcSubjectTotalPrice()
                    update();
                } else if (currentDeal.value.dealType === 'buy') {
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
            // count PERSON QTY BUTTON COLOR
            const countPersonQtyButtonColor = ref('primary');
            const setCountPersonQtyButtonColor = (qty) => {
                if(qty < 2) {
                    return countPersonQtyButtonColor.value = 'light'
                } else {
                    return countPersonQtyButtonColor.value = 'primary'
                }
            }
            // ================================== View Deal Modal Create Subject ============================================
            // ставим NEW Current Subject PRICE
            const setNewSubjectPrice = (price) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.price = price;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // ставим NEW Subject gramPerPerson
            const setNewGramPerPerson = (gram) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.gramPerPerson = gram;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // ставим NEW Subject QUANTITY
            const setNewSubjectQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.productQuantity = qty;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // Ставим NEW Person SUBJECT QUANTITY
            const setNewPersonQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.personQuantity = qty;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        // Не используется
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        // Не используется
                    }
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // Ставим NEW Subject DISCOUNT
            const setNewSubjectDiscount = (discount) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.subjectDiscount = discount;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'per100gram') {
                        console.log('В разработке')
                    }
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            }
            // массив вариантов доставки из store
            const shippingTypeList = ref(store.state.shippingTypeList)
            // храним значение dealShippingType
            const dealShippingType = ref();
            // следим за изменениями значения dealShippingType у текущего дела и обновляем его в БД
            watch (dealShippingType, () => {
                if(dealShippingType.value === 'shipping-pickup') {
                    currentDeal.value.shipping = {
                        typeOfShipping: dealShippingType.value,
                        shippingPrice: 0
                    }
                } else if (dealShippingType.value === 'shipping-delivery') {
                    currentDeal.value.shipping = {
                        typeOfShipping: dealShippingType.value,
                        shippingAddress: '',
                        shippingPrice: 0
                    }
                } 
                update()
            })
            // Считаем сумму всех PRICE всех subject
            const sumAllTotalSubjectPrice = ref();
            const sumAllTotalSubjectPriceFunc = (array) => {
                if (array.length !== 0) {
                    // Выбираем из массива данных нужные значения
                    let totalSubjectPriceArray = array.map(item => item.totalSubjectPrice)
                    // Суммируем значения
                    const sumAllTotalSubjectPrice = totalSubjectPriceArray.reduce((accumulator, currentValue) => accumulator + currentValue)
                    calcTotalDealPrice(sumAllTotalSubjectPrice)
                    // console.log(sumAllTotalSubjectPrice.value)
                    return sumAllTotalSubjectPrice
                } else {
                    calcTotalDealPrice(0)
                    return 0
                }
            }
            // функция калькуляции общей стоимости дела (с учетом доставки)
            const calcTotalDealPrice = (sumSubjectPrice) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDeal.value.totalDealPrice = sumSubjectPrice + currentDeal.value.shipping.shippingPrice
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
                update()
            }
            //
            const shippingPrice = ref();
            watch(shippingPrice, () => {
                if(currentDeal.value.dealType === 'sale') {
                    if(currentDeal.value.dealsList.length === 0) {
                        currentDeal.value.shipping.shippingPrice = +shippingPrice.value
                        currentDeal.value.totalDealPrice = currentDeal.value.shipping.shippingPrice
                        // update()
                    } else {
                        currentDeal.value.shipping.shippingPrice = +shippingPrice.value
                    }
                    update()
                } else if (currentDeal.value.dealType === 'buy') {
                    console.log('В разработке')
                }
            })
            //
            const editShippingAddress = ref(false);
            //
            const shippingAddress = ref('');
            // watch(shippingAddress, () => {
            //     console.log(shippingAddress.value)
            //     currentDeal.value.shipping.shippingAddress = shippingAddress.value
            // })
            //
            const toggleEditShippingAddress = () => {
                editShippingAddress.value = false
                currentDeal.value.shipping.shippingAddress = shippingAddress.value
                update()
            }
            //
            const setProductNotePlaceholder = (note) => {
                if (note === '') {
                    return 'Напишите адрес'
                } else {
                    shippingAddress.value = note
                    return note
                }
            }

            return {
                currency, spinner, currentId, info, currentDeal, dealContactID, isOpenRef, setOpen, deleteDealButtons, deleteDealSubjectButtons, deleteDeal, dealContact, choose, searchContactMenu, searchDealContact, searchedContacts, myContacts, dealStatusList, dealStatus, translateValue, setChipColor, executionDate, datepicker, isCalendarOpened, openModalCalendar, closeModalCalendar, updateExecutionDate, addCircleOutline, setDealType, closeCircleOutline, isViewDealSubjectOpened, openCurrentDealSubject, deleteSubject, openDeleteSubjectModal, deleteCurrentDealItem, currentDealSubject, subjectToDelete, isCreateNewSubjectOpened, openCreateSubjectModal, closeCreateSubjectModal, currentSubject, addNewSubject, checkRentAttr, helpOutline, setColorByDealType, setIconByDealType, translateDealSubjectRecipe, userRecipeArray, updateBD, setSubjectPrice, sumAttributesPriceValue, setSumAttributesPriceValue, calcSubjectTotalPrice, setNewSubjectPrice, calcNewSubjectTotalPrice, setNewSubjectQty, setSubjectQty, setCountQtyButtonColor, countQtyButtonColor, setPersonQty, countPersonQtyButtonColor, setCountPersonQtyButtonColor, setNewPersonQty, setGramPerPerson, setNewGramPerPerson, setSubjectDiscount, setNewSubjectDiscount, shippingTypeList, dealShippingType, shippingPrice, setProductNotePlaceholder, shippingAddress, editShippingAddress, toggleEditShippingAddress, sumAllTotalSubjectPrice, sumAllTotalSubjectPriceFunc, translateShippingType
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