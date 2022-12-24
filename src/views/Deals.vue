<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- page header -->
        <Header 
            @setFilter="setFilterFunc"
            :title="pageTitle"
            :filterBy="dealByType"
            style="background-color: white"
        />

        <!-- Кнопка перехода к созданию нового дела -->
        <CreateButton @click="setOpen"/>

        <!-- popup создания нового дела -->
        <CreateNewDeal
            :isOpen="isViewDealModalOpened"
            @closeModal="setOpen"
            @createDeal="createNew"
            :dealData="dealData"
            :myContacts="myContacts"
            @date-updated="(dealContactID) => dealData.contactID = dealContactID.currentValue"
            @addSubject="addSubject"
            @deleteSubject="deleteSubject"
        />
        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push"
            forceOverscroll="false"
        >
            <br>
            <br>
            <br>
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myDeals.length === 0) && !spinner" class="no-status-deal ion-padding-horizontal no-data">
                <ion-img src="img/common/deals-sticker.webp" alt="нет дел"></ion-img>
                <ion-text color="primary"><h2>У вас еще нет дел...</h2></ion-text>
                <ion-text color="medium">Самое время начать заниматься деятельностью. <br>И создать первое дело!</ion-text>
            </div>
            <!-- Data -->
            <div v-if="dataLoaded && myDeals.length !== 0" class="ion-margin-bottom" style="padding-top: 0.6rem">
                <br>
                <!-- ======================================= Статусы дел ================================ -->
                <ion-list class="horizontal-scroll chip-deal-status">
                    <ion-chip v-for="(status, index) in dealStatusList" :key="index" @click="setDealStatus(status.value)" :color="setChipColor(status.value)" :outline="setChipOutline(status.value, currentDealStatus)" >
                        <ion-label>{{ status.name }} <span v-if="status.value !== 'deal-cancelled' && status.value !== 'deal-complete'">{{countDealByStatus(status.value)}}</span></ion-label>
                    </ion-chip>
                </ion-list>
                <!-- Фильтр по типу дела -->
                <!-- <ion-item-group class="ion-text-left ion-margin-start">
                    <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                        <Select 
                            :data="dealTypesList"
                            placeholder="Все"
                            @date-updated="(selected) => dealByType = selected.currentValue"
                        />
                    </ion-button>
                </ion-item-group> -->

                <!-- Меню выбора фильтра дел -->
                <ion-action-sheet
                    :isOpen="setDealTypeMenu"
                    @didDismiss="setDealTypeMenu = false"
                    :buttons="setDealTypeMenuButtons"
                >
                </ion-action-sheet>

                <!-- Если по конкретному статусу нет дел -->
                <div class="no-status-deal height_60vh" v-if="foundDealsByStatus.length === 0">
                    <div v-for="(status, index) in dealStatusList" :key="index">
                        <div v-if="currentDealStatus === status.value">
                            <ion-img class="no-status-deal_img" :src="`img/status/${status.value}.svg`"></ion-img>
                            <h4>{{ status.caption }}</h4>
                            <ion-text color="medium">{{ status.text }}</ion-text>
                        </div>
                    </div>
                </div>

                <!-- ======================================== Карточки дел ============================= -->
                <div v-for="(day, idx) in getExecutionDate()" :key="idx" class="ion-margin-top">
                    {{day}}
                    <div 
                        v-for="deal in foundDealsByStatus" 
                        :key="deal.id"
                        >
                            <router-link 
                                v-if="formattedDate(deal.executionDate) === day"
                                :to="{ name: 'View-Deal', params: { 
                                        dealId: deal.id,
                                        dealUid: deal.uid,
                                        deal: JSON.stringify(deal)
                                    }}"
                            >
                                <ion-card class="ion-padding-horizontal ion-padding-vertical">
                                    <!-- Header of the card -->
                                    <ion-card-header class="ion-no-padding">
                                        <ion-grid class="ion-no-padding">
                                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                                <div style="display: flex;" class="relative">
                                                    <ion-thumbnail class="icon-thumbnail absolute" :class="{'icon-thumbnail_sale': deal.dealType === 'sale', 'icon-thumbnail_buy': deal.dealType === 'buy'}">
                                                        <ion-icon class="icon-thumbnail_icon" :icon="setIconByDealType(deal.dealType)"></ion-icon>
                                                    </ion-thumbnail>
                                                    <!--  -->
                                                    <div @click.prevent.stop="openActionSheetDealStatusMenu(deal, deal.dealStatus)" style="margin-left: 0.4rem">
                                                        <ion-text color="primary">
                                                            {{translateValue(deal.dealStatus, dealStatusList)}}
                                                        </ion-text>
                                                    </div>
                                                </div>
                                                <!-- Контакт по делу -->
                                                <div>
                                                    <ion-text v-if="deal.contactID === '000'" color="primary">Неизвестный</ion-text>
                                                    <ion-text v-else>
                                                        <router-link 
                                                            :to="{ name: 'View-Contact', params: { 
                                                                contactId: deal.contactID,
                                                                contact: getContact(deal.contactID)
                                                                }}"
                                                        >{{showNameByID(deal.contactID, myContacts)}}</router-link>
                                                    </ion-text>
                                                </div>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-card-header>
                                    <!-- Body of the card -->
                                    <ion-card-content class="ion-no-padding ion-margin-top">
                                        <!-- Предмет заказа -->
                                        <ion-grid>
                                            <ion-row style="gap: 0.8rem">
                                                <div class="relative" v-for="(item, index) in deal.dealsList" :key="index">
                                                    <!-- item -->
                                                    <ion-thumbnail v-if="item.selectedProduct !== ''" style="height: 64px; width: 64px;">
                                                        <!-- Если типа дела Продажа -->
                                                        <div v-if="deal.dealType === 'sale'">
                                                            <ion-img style="height: 100%" :src="`img/subjects/sale/${item.selectedProduct}.webp`"></ion-img>
                                                        </div>
                                                        <!-- Если типа дела Закупка -->
                                                        <div v-if="deal.dealType === 'buy'">
                                                            <ion-img style="height: 100%" :src="`img/subjects/buy/${item.selectedProduct}.webp`"></ion-img>
                                                        </div>
                                                    </ion-thumbnail>
                                                    <!--  -->
                                                    <ion-label style="font-size: 12px">
                                                        x{{item.productQuantity}}
                                                    </ion-label>
                                                    <!-- mark where subject has attribute -->
                                                    <div 
                                                        v-if="checkRentAttr(item, deal.dealType)" 
                                                        class="absolute mark-atribute"
                                                    >
                                                        <ion-icon :color="setMarkerAttrColor(item) ? 'success' : 'warning'" :icon="shapes"></ion-icon>
                                                    </div>
                                                </div>
                                                <div v-if="deal.dealsList.length" class="empty-item"></div>
                                                <!-- deal.dealsList is empty array -->
                                                <div v-if="!deal.dealsList.length">
                                                    <ion-thumbnail class="empty-deal-list_thumbnail">
                                                        <ion-icon class="empty-deal-list_icon" :icon="helpOutline"></ion-icon>
                                                    </ion-thumbnail>
                                                </div>
                                            </ion-row>
                                        </ion-grid>

                                    </ion-card-content>
                                </ion-card>
                            </router-link>
                    </div>
                </div>

            </div>

            <br>
            <br>
            <br>

            <!-- Модалка внесения средства по оплате -->
            <DealPaidMenu
                :is-open="isDealPaidMenuOpened"
                :currentDeal="dealWhereChangeStatus"
                :debt="refreshDebtValue()"
                :amount="dealPaidAmountValue()"
                @getAmountValue="setAmountValue"
                @closeModal="closeDealPaidMenu"
                @didDismiss="isDealPaidMenuOpened = false"
            />
            <!-- Всплывашка изменения статуса конкретного дела-->
            <ion-action-sheet
                :is-open="actionSheetDealStatus"
                header="Сменить статус дела"
                :buttons="changeDealStatusMenuButtons"
                @didDismiss="actionSheetDealStatus = false"
            >
            </ion-action-sheet>
        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue'
    import Spinner from '@/components/Spinner.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import CreateNewDeal from '@/components/modal/NewDeal-modalCreate.vue';
    // import Select from '@/components/Select.vue'
    import DealPaidMenu from '@/components/DealPaidMenu.vue';
    import Footer from '@/components/Footer.vue';
    //
    import { 
        IonContent, 
        IonHeader, 
        IonItem, 
        IonImg,
        IonList, 
        IonMenu, 
        IonMenuToggle,
        IonButton,
        IonTitle, 
        IonToolbar,
        IonIcon,
        IonText,
        IonChip,
        IonLabel,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonCard,
        IonCardHeader,
        IonGrid,
        IonRow,
        IonCardContent,
        IonThumbnail,
        IonItemGroup,
        IonActionSheet
    } from '@ionic/vue';
    import { helpOutline, shapes } from 'ionicons/icons';
    import { defineComponent, ref, computed, onMounted, watch } from 'vue';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { uid } from 'uid';
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import { setIconByDealType } from '@/helpers/setIconBy';
    import { translateValue } from '@/helpers/translateValue';
    import { setChipOutline } from '@/helpers/setChip';
    import { checkRentAttr } from '@/helpers/checkRentAttr'; 
    import { showNameByID } from '@/helpers/setNameByID';
    import { setMarkerAttrColor } from '@/helpers/setMarkerColor';
    //
    export default defineComponent({
        name: 'Deals',
        components: {
            Header,
            NavigationMenu,
            Spinner,
            CreateButton,
            DealPaidMenu,
            CreateNewDeal,
            // Select,
            Footer,
            //
            IonContent, 
            IonHeader, 
            IonItem, 
            IonImg,
            IonList, 
            IonMenu, 
            IonMenuToggle,
            IonButton,
            IonTitle, 
            IonToolbar,
            IonIcon,
            IonText,
            IonChip,
            IonLabel,
            IonItemOption,
            IonItemOptions,
            IonItemSliding,
            IonCard,
            IonCardHeader,
            IonGrid,
            IonRow,
            IonCardContent,
            IonThumbnail,
            IonItemGroup,
            IonActionSheet
        },
        setup() {
            // Currency
            const currency = ref(store.state.systemCurrency.name)
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            console.log(userEmail.value)
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;
            // 
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myDeals = ref([]);
            // счетчик количества дел по конкретному статусу
            // const countDealsByCurrentStatus = ref(null);
            // Статусы дел
            const dealStatusList = ref(store.state.dealStatusList)
            //Все даты по конкретному статусу
            const daysArray = ref([])
            // уникальные даты по конкретному статусу
            const days = ref([])
            // Подтягиваем список дел из store
            spinner.value = true;
            // Массив сделок по выбранному статусу
            const foundDealsByStatus = ref([])
            //
            onMounted( async() => {
                // daysArray.value = []
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
                spinner.value = false
                dataLoaded.value = true;
                refreshData();
            })
            // Получаем массив форматированных к показу дат
            const getExecutionDate = () => {
                // Сортируем от ближайшей даты и по удалению от сегодня
                daysArray.value.sort((a,b) => {
                    return new Date(b) - new Date(a);
                })
                // создаем новый массив на основе форматированных дат
                const array = []
                daysArray.value.forEach(item => {
                    array.push(formattedDate(item))
                })
                // исключаем дубли дат
                const days = new Set(array)
                // возвращаем данные
                return days
            }
            // функция форматирования даты для сравнения даты дела и даты дня
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }
            // Выбранный по умолчанию статус дел при загрузке экрана
            const currentDealStatus = ref('deal-in-booking');
            // Следим за изменением статуса дела и запускаем функцию показа
            watch(currentDealStatus, (currentValue) => {
                refreshData(currentValue)
            })
            // Счетчик коилчества дел по конкретному статусу
            const countDealByStatus = (status) => {
                const result = myDeals.value.filter(item => item.dealStatus === status && showDealByType(item.dealType))   
                return result.length
            }
            // Текущий выбранный статус сделок
            const setDealStatus = (name) => {
                currentDealStatus.value = name
            }
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

            // ====================================================================
            // Work with deal card
            const doSomething = () => {
                console.log('clicked')
                // Это заглушка
            }
            // Меняем статус прямо на карточке дела
            const updateCurrentDealStatus = async (deal) => {
                // console.log(`После обновления: ${deal.dealStatus}`)
                // Обновляем данные в БД
                try{
                    const { error } = await supabase.from('deals').update({
                        dealStatus: deal.dealStatus
                    }).eq('id', deal.id);
                    if(error) throw error;
                    refreshData();
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
            // Храним данные контакта
            const myContacts = ref([])
            onMounted( async () => {
                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
            })
            // Передаем в роут данные ко конкретному контакту
            const getContact = (contactID) => {
                const result = myContacts.value.filter(contact => contact.id === +contactID)
                const contact = result[0]
                return JSON.stringify(contact)
            }          
            // ====================================================================
            // Work with Modal Create New Deal
            const isViewDealModalOpened = ref(false)
            // Изменяемый шаблон нового дела
            const dealData = ref({
                uid: uid(),
                email: userEmail.value,
                dealType: '',
                dealStatus: "deal-in-booking",
                contactID: '000',
                dealsList: [],
                shipping: '',
                totalDealPrice: 0,
                executionDate: '',
                dealPaid: 0,
                cancelledReason: '',
                dealImportance: 1,
                comments: ''
            })
            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
                spinner.value = false
                isViewDealModalOpened.value = !isViewDealModalOpened.value;
                dealData.value = {
                    uid: uid(),
                    email: userEmail.value,
                    dealType: '',
                    dealStatus:"deal-in-booking",
                    contactID: '000',
                    dealsList: [],
                    shipping: {
                        typeOfShipping: '',
                        shippingPrice: 0
                    },
                    totalDealPrice: 0,
                    executionDate: '',
                    dealPaid: 0,
                    cancelledReason: '',
                    dealImportance: 1,
                    comments: ''
                }
            }
            // Создаем новую дело
            const createNew = async (newDealData) => {
                // принимаем инфу по делу из modal
                dealData.value = newDealData
                spinner.value = true;
                // Если строки Имя Фамилия пустые или не пустые 
                // использовать валидацию 
                if(dealData.value.executionDate === ''){
                    alert('Deals: Вы не выбрали дату исполнения')
                } else if(dealData.value.dealType === '') {
                    alert('Deals: Вы не указали тип дела')
                // } else if (!dealData.value.shipping.typeOfShipping && dealData.value.dealType === 'sale') {
                } else if (!dealData.value.shipping.typeOfShipping) {
                // } else if (!dealData.value.shipping.typeOfShipping) {
                    // Если не понадобится - убрать
                    alert('Deals: Вы не указали способ доставки')
                } else if (dealData.value.dealType === 'buy' && dealData.value.dealsList.length === 0) {
                    alert('Deals: Вы не добавили предмет дела')
                } else {
                    try{
                        // Добавляем в БД инфу по новому делу
                        const { error } = await supabase.from('deals').insert([dealData.value])
                        if(error) throw error;
                        // обновляем массив в store
                        await store.methods.getMyDealsFromBD();
                        myDeals.value = store.state.myDealsArray
                        // ищем созданное новое дело в массиве всех дел в store (по uid)
                        const newDeal = myDeals.value.find(el => el.uid === dealData.value.uid)
                        // закрываем modal
                        isViewDealModalOpened.value = false;
                        // переходим на страницу созданного нового контакта
                        router.push({name: 'View-Deal', params: { dealId: newDeal.id, deal: JSON.stringify(newDeal)}})
                        if(dealData.value.dealPaid > 0) {
                            addToLedger(dealData.value.dealPaid, newDeal.id)
                        }
                    } catch (error) {
                        alert(`Error: ${error.message}`)
                    }
                }
            }
            // Функция обновления контента к показу (после обновления в записей в БД)
            const refreshData = () => {
                daysArray.value = []
                days.value = []
                // Обновляем содержимое к отображению
                foundDealsByStatus.value = myDeals.value.filter(deal => {
                    // Задаем формат отображения для даты полученных дел
                    // const executionDate = formattedDate(new Date(deal.executionDate).toISOString().split("T")[0])
                    // const executionDate = formattedDate(deal.executionDate)
                    const executionDate = deal.executionDate
                    if(deal.dealStatus === currentDealStatus.value && showDealByType(deal.dealType)) {
                        daysArray.value.push(executionDate)
                        // daysArray.value.sort((a,b) => {
                        //     return new Date(b) - new Date(a);
                        // })
                        return deal.dealStatus === currentDealStatus.value
                    } 
                })
            }
            // ============================ Фильтр для отображения на доске сделок по конкретному типу =====================
            // Типы дел
            const dealTypesList = ref(store.state.dealTypes)
            // Переключатель дел к показу (Все / Продажи / Закупки)
            const dealByType = ref('all')
            // Фильтр для показа дел (Все / Продажи / Закупки)
            const showDealByType = (dealType) => {
                if(dealByType.value === 'all') {
                    return dealType
                } else if (dealByType.value === 'sale') {
                    return dealType === 'sale'
                } else if (dealByType.value === 'buy') {
                     return dealType === 'buy'
                }
            }
            // Следим за изменением dealByType и запускаем обнолвение дел к показу по выбранным критериям
            watch(dealByType, () => {
                refreshData(currentDealStatus)
            })
            // 
            const addSubject = (subjectData) => {
                // console.log(dealData.value.dealType)
                dealData.value.dealsList.push({
                    // id: uid(),
                    id: subjectData.id,
                    selectedProduct: subjectData.selectedProduct,
                    price: subjectData.price,
                    costEstimation: subjectData.costEstimation,
                    personQuantity: subjectData.personQuantity,
                    gramPerPerson: subjectData.gramPerPerson,
                    subjectDiscount: subjectData.subjectDiscount,
                    subjectPrice: subjectData.subjectPrice,
                    recipe: subjectData.recipe, 
                    productQuantity: subjectData.productQuantity,
                    // массив пока шаблоном, в modalCreateSubject задавать значения
                    additionalAttributes: subjectData.additionalAttributes,
                    totalSubjectPrice: subjectData.totalSubjectPrice,
                    productNote: subjectData.productNote,
                })  
            }
            const deleteSubject = (id) => {
                dealData.value.dealsList = dealData.value.dealsList.filter(subject => subject.id !== id);
            }
            //
            const prevDealStatus = ref()
            // Вызываем action sheet меню выбора статуса дела
            const actionSheetDealStatus = ref(false)
            const openActionSheetDealStatusMenu = (deal, dealStatus) => {
                actionSheetDealStatus.value = true
                // console.log(deal)
                dealWhereChangeStatus.value = deal
                // console.log(dealStatus)
                prevDealStatus.value = dealStatus
                // updateCurrentDealStatus(deal)
            }
            // переменные для управления сменой статусов у выбранной карточки дела (выбранного дела)
            const dealStatus = ref();
            const dealWhereChangeStatus = ref()
            const debt = ref()
            // ======================================= Массив кнопок в меню смены статуса у дела ==================================
            const changeDealStatusMenuButtons = []
            // добавляем в массив changeDealStatusMenuButtons объекты из dealStatusList
            for(let i = 1; i <= dealStatusList.value.length; i++) {
                changeDealStatusMenuButtons.push({
                    text: dealStatusList.value[i-1].name,
                    handler: () => {
                        dealStatus.value = dealStatusList.value[i-1].value
                        // console.log(`это handler: ${dealStatus.value}`)
                        // помещаем во временную переменную обновленное значение статуса
                        dealWhereChangeStatus.value.dealStatus = dealStatus.value 
                        // console.log(`Предыдущий статус: ${prevDealStatus.value}`)
                        // console.log(`Текущий статус: ${dealStatus.value}`)
                        // компонент DealPaidMenu
                        if(dealWhereChangeStatus.value.dealStatus === 'deal-complete' && dealWhereChangeStatus.value.dealsList.length !== 0) {
                            culcDealDebt(dealWhereChangeStatus.value.totalDealPrice, dealWhereChangeStatus.value.dealPaid)
                            if(debt.value > 0) {
                                if(confirm(`Есть долг по оплате дела. Внести сумму задолженности или её часть?`)) {
                                    // оставляем старый статус (так как не понятно всю ли сумму внесут по долгу)
                                    dealWhereChangeStatus.value.dealStatus = prevDealStatus.value
                                    openDealPaidMenu()
                                } else {
                                    // просто оставляем старый статус дела (НЕ меняем на завершен)
                                    dealWhereChangeStatus.value.dealStatus = prevDealStatus.value
                                }
                            } else if (debt.value === 0) {
                                // SALE
                                // alert(`ViewDeal: статус дела изменен на ${dealStatus.value}`)
                                if(dealWhereChangeStatus.value.dealType === 'sale') {
                                    // Оставляем dealStatus как deal-complete
                                    // НО проверить на наличие долга по аренде атрибутов
                                    isAllAttrReturnedFunc()
                                } 
                            } else if (debt.value < 0) {
                                // Удалить, если не пригодится
                                alert('Получается переплата... Верно?')
                            }
                        } 
                        // сохраняем изменения в БД
                        updateCurrentDealStatus(dealWhereChangeStatus.value)
                    }
                })
            }
            watch(dealStatus, () => {
                // Забираем предметы для работы со складом
                if(dealWhereChangeStatus.value.dealsList.length !== 0) {
                    if(dealStatus.value === 'deal-in-process' && dealWhereChangeStatus.value.dealType === 'sale') {
                        console.log(`Можно вычитать предметы со склада по делу №${dealWhereChangeStatus.value.uid}`)
                        dealWhereChangeStatus.value.dealsList.forEach(item => {
                            console.log(item)
                        })
                    } else if (dealStatus.value === 'deal-complete' && dealWhereChangeStatus.value.dealType === 'buy') {
                        console.log(`Можно помещать предметы на склад по делу №${dealWhereChangeStatus.value.uid}`)
                        dealWhereChangeStatus.value.dealsList.forEach(item => {
                            console.log(item)
                        })
                    }
                }
            })
            // Добавляем кнопку отмены (скрытия меню)
            changeDealStatusMenuButtons.push({
                text: 'Отменить',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked')
                }
            })
            // удалить если не понадобится
            // watch(dealStatus, (status) => {
            //     console.log(`это watch: ${status}`)
                
            // })
            // Считаем debt у конкретного дела
            const culcDealDebt = (totalDealPrice, dealPaid) => {
                // Пока так
                debt.value = totalDealPrice - dealPaid
                return debt.value
            } 
            // управление модалкой внесения оплаты
            const isDealPaidMenuOpened = ref(false)
            const openDealPaidMenu = () => {
                isDealPaidMenuOpened.value = true
                refreshDebtValue()
            }
            //
            const refreshDebtValue = () => {
                return debt.value
            }
            //
            const closeDealPaidMenu = () => {
                isDealPaidMenuOpened.value = false
            }
            // функция обнуления пропса по начальному значению суммы оплаты (для DealPaidMenu)
            const dealPaidAmountValue = () => {
                return 0
            }
            //
            const setAmountValue = (amount) => {
                if(dealWhereChangeStatus.value.dealPaid === 0){
                    dealWhereChangeStatus.value.dealPaid = +amount
                } else if (dealWhereChangeStatus.value.dealPaid !== 0) {
                    dealWhereChangeStatus.value.dealPaid += +amount
                }
                culcDealDebt(dealWhereChangeStatus.value.totalDealPrice, dealWhereChangeStatus.value.dealPaid)
                if(debt.value > 0) {
                    // сообщаем пользователю сколько внесено
                    alert(`Deal: внесено ${amount} ${currency.value}`)
                    // закрываем dealPaidMenu
                    closeDealPaidMenu()
                    // сохраняем изменения в БД
                    update()
                } else if (debt.value === 0) {
                    // SALE
                    if(dealWhereChangeStatus.value.dealType === 'sale') {
                        // Сейчас делу присвоен статус ЗАВЕРШЕН
                        // уведомляем о количестве внесенных средств
                        alert(`Deal: внесено ${amount} ${currency.value}`)
                        // проверяем на наличие долгов по атрибутам
                        isAllAttrReturnedFunc()
                        // console.log(dealWhereChangeStatus.value.dealType)
                        // updateCurrentDealStatus(dealWhereChangeStatus.value)
                    } 
                    // BUY
                    else if (dealWhereChangeStatus.value.dealType === 'buy') {
                        // уведомляем о количестве внесенных средств
                        alert(`Deal: внесено ${amount} ${currency.value}`)
                        // console.log(dealWhereChangeStatus.value.dealType)
                        // Делу уже присвоен статус ЗАВЕРШЕН
                        dealWhereChangeStatus.value.dealStatus = 'deal-complete'
                        alert('Deal: статус дела изменен на "ЗАВЕРШЕНО"')
                        closeDealPaidMenu()
                        updateCurrentDealStatus(dealWhereChangeStatus.value)
                        update()
                    }
                } else if (debt.value < 0) {
                    // Удалить, если не пригодится
                    alert('Получается переплата... Верно?')
                }
            }
            //
            const isAllAttrReturned = ref(false)
            const isAllAttrReturnedFunc = () => {
                let dealsListArray = dealWhereChangeStatus.value.dealsList
                let subjectAttributesArray = dealsListArray.map(item => item.additionalAttributes)
                // Упрощаем массив, поднимая вложенные массивы в массив верхнего уровня
                let isReturnedArray = subjectAttributesArray.flat()
                let isReturnData = isReturnedArray.map(item => item.isReturned) 
                if(isReturnData.length === 0) {
                    // Значит массив атрибутов пустой
                    // При создании он всеравно есть, но изначально пустой
                    dealWhereChangeStatus.value.dealStatus = 'deal-complete'
                    alert('Deal: статус дела изменен на ЗАВЕРШЕН')
                    closeDealPaidMenu()
                } else if (isReturnData.length !== 0) {
                    // Если массив содержит невозвращенные атрибуты какого-либо предмета в деле
                    if(isReturnData.includes(false)) {
                        isAllAttrReturned.value = false
                        alert(`Deal: Вам вернули не все допы по заказу. Статус дела изменен на ДОЛГ`)
                        dealWhereChangeStatus.value.dealStatus = 'deal-in-debt'
                        // Если dealPaidMenu открыто
                        closeDealPaidMenu()
                    } else {
                        // Если содержит все true (то есть всё уже вернули)
                        isAllAttrReturned.value = true
                        dealWhereChangeStatus.value.dealStatus = 'deal-complete'
                        alert('Deal: статус дела изменен на ЗАВЕРШЕН')
                        closeDealPaidMenu()
                    }
                }
                // сохраняем изменения в БД
                updateCurrentDealStatus(dealWhereChangeStatus.value)
                update()
            }
            //
            const update = async () => {
                try {
                    // spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${dealWhereChangeStatus.value.id} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        contactID: dealWhereChangeStatus.value.contactID,
                        dealStatus: dealWhereChangeStatus.value.dealStatus,
                        executionDate: dealWhereChangeStatus.value.executionDate,
                        dealsList: dealWhereChangeStatus.value.dealsList,
                        shipping: dealWhereChangeStatus.value.shipping,
                        dealPaid: dealWhereChangeStatus.value.dealPaid,
                        cancelledReason: dealWhereChangeStatus.value.cancelledReason,
                        totalDealPrice: dealWhereChangeStatus.value.totalDealPrice,
                        dealImportance: dealWhereChangeStatus.value.dealImportance

                    }).eq('id', dealWhereChangeStatus.value.id);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                // spinner.value = false;
            }

            //
            const addToLedger = async (amount, dealID) => {
                try {
                    const { error } = await supabase.from('ledger').insert([{
                        dealID: dealID,
                        uid: dealData.value.uid,
                        contactID: dealData.value.contactID,
                        dealType: dealData.value.dealType,
                        amount: amount,
                        userEmail: dealData.value.email
                    }])
                    if(error) throw error
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }

            //
            const setDealTypeMenu = ref(false)
            const setFilterFunc = () => {
                console.log('set filter')
                setDealTypeMenu.value = true
            }
            const setDealTypeMenuButtons = [
                {
                    text: 'Показать все',
                    handler: () => {
                        dealByType.value = 'all'
                        //Также, это является значением по умолчанию
                    }
                },
                {
                    text: 'Продажи',
                    handler: () => {
                        dealByType.value = 'sale'
                    }
                },
                {
                    text: 'Закупки',
                    handler: () => {
                        dealByType.value = 'buy'
                    }
                },
                {
                    text: 'Назад',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    },
                }
            ]

            return {
                user, router, pageTitle, userEmail, createNew, myDeals, spinner, dataLoaded, isViewDealModalOpened, dealData, setOpen, setDealStatus, currentDealStatus, dealStatusList, foundDealsByStatus, daysArray, days, getExecutionDate, formattedDate, countDealByStatus, setChipColor, setChipOutline, doSomething, updateCurrentDealStatus, translateValue, refreshData, myContacts, getContact, showNameByID, checkRentAttr, dealTypesList, dealByType, showDealByType, helpOutline, addSubject, deleteSubject, setIconByDealType, actionSheetDealStatus, openActionSheetDealStatusMenu, changeDealStatusMenuButtons, dealStatus, dealWhereChangeStatus, prevDealStatus, debt, culcDealDebt, openDealPaidMenu, isDealPaidMenuOpened, refreshDebtValue, closeDealPaidMenu, dealPaidAmountValue, setAmountValue, isAllAttrReturnedFunc, currency, isAllAttrReturned, update, setMarkerAttrColor, shapes, addToLedger, setFilterFunc, setDealTypeMenu, setDealTypeMenuButtons
            }
        }
    })
</script>

<style scoped>
    ion-img {
        height: 50vh;
    }
    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }
    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
    .no-status-deal {
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .height_60vh {
        height: 60vh; 
    }
    .no-status-deal_img {
        width: 50%; 
        height: 50%; 
        margin:0 auto;
    }
    ion-thumbnail {
        background-color: var(--ion-color-light);
        --border-radius: 100%;
        padding: 0.5rem;
    }
    .empty-item {
        margin-left: auto
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .mark-atribute {
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0rem;
        right: -0.2rem;
        width: 1.3rem;
        height: 1.3rem;
        background-color: var(--ion-color-light);
        border-radius: 100%
    }
    /* удалить если не понадобится */
    /* .mark-success {
        background-color: var(--ion-color-success);
    }
    .mark-warning {
        background-color: var(--ion-color-warning);
    } */
    .empty-deal-list_thumbnail {
        height: 64px;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .empty-deal-list_icon {
        width: 100%;
        height: 100%
    }
    .icon-thumbnail {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0.2rem;
        padding-top: 0.4rem;
        padding-left: 0.4rem;
        padding-bottom: 0.3 rem;
        top: -22px;
        left: -22px;
        
    }
    .icon-thumbnail_icon {
        width: 100%;
        height: 100%;
        color: white;
    }
    .icon-thumbnail_sale {
        background-color: var(--ion-color-success);
    }
    .icon-thumbnail_buy {
        background-color: var(--ion-color-warning);
    }
    .no-data ion-img {
        width: 50%
    }
    .chip-deal-status {
        position: fixed; 
        z-index: 99999; 
        overflow-x: auto; 
        width: 100%;
        top: 2rem;
        padding-top: 1rem;
    }
</style>