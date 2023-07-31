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
            @goToSettings="toggleSettingsModal"
            @calendarMode="calendarModeFunc"
            :title="pageTitle"
            :isMonth="isMonthMode"
        />

        <ion-content 
            :scroll-events="true"
            class="ion-page" 
            id="main"
            type="push" 
            forceOverscroll="false"
        >
            <br>
            <br>
            <br>
            
            <!-- page content -->

            <!-- MODE MONTH -->
            <div v-if="isMonthMode === true">
                <ion-datetime 
                    :first-day-of-week="1"
                    size="cover" 
                    calendar-weeks="true"
                    v-model="choosenDate"
                    presentation="date"
                ></ion-datetime>
            </div>

            <!-- MODE WEEK PLANNER -->
            <!-- :isMonthMode="isMonthMode"s -->
            <div v-else>
                <WeekPlanner 
                    :deals="deals"
                    @openCreateModal="openWeekCreateDeal"
                    :weekendDays="weekendDays"
                    @spinnerChangeStat="spinnerChangeStat"
                />
            </div>

            <div>

            </div>
            
            <!-- Модалка дел по выбранной дате -->
            <ViewChoosenDate
                :is-open="isViewChoosenDateOpened"
                @closeModal="closeViewChoosenDate"
                :deals="dealsByChoosenDate"
                :date="choosenDate"
                :myContactsArray="myContacts"
                @viewChoosenDeal="goToChoosenDeal"
                @createNewDeal="createNewDeal"
                @goToChoosenContact="goToChoosenContact"
                @setWeekendDay="setWeekendDayFunc"
            />

            <!-- Модалка по созданию нового дела -->
            <!-- :userRecipeArray="userRecipes" -->
            <CreateNewDeal
                :isOpen="isViewDealModalOpened"
                :dealData="dealData"
                :myContacts="myContacts"
                @closeModal="setOpen"
                @closeSelf="isViewDealModalOpened = false"
                @createDeal="createNew"
                @date-updated="(dealContactID) => dealData.contactID = dealContactID.currentValue"
                @addSubject="addSubject"
                @deleteSubject="deleteSubject"
                :walletBalance="availableBalance"

            />

            <!-- Всплывашка об удалении выбранной даты из массива дат "ДЕнь без дел" -->
            <ion-action-sheet
                :is-open="actionSheetWeekendDayOpened"
                header="Это день без дел"
                :buttons="changeWeekendDayButtons"
                @didDismiss="actionSheetWeekendDayOpened = false"
            >
            </ion-action-sheet>
            
            <!-- Настройки Календаря -->
            <CalendarSettings
                :isOpen="isSettingsModalOpened"
                @closeModal="toggleSettingsModal(false)"
                :userSettings="userSettings"
                @update="updateDaySaturation"
            />

            <!-- Для установки выходного дня -->
            <!-- <ion-action-sheet
                :is-open="asSetWeekendDay"
                header="Сделать этот день выходным"
                :buttons="asSetWeekendDayButtons"
                @didDismiss="asSetWeekendDay = false"
            >
            </ion-action-sheet> -->

            <!-- Для отмены выходного дня -->
            <!-- <ion-action-sheet
                :is-open="asCancelWeekendDay"
                header="Отменить выходной"
                :buttons="asCancelWeekendDayButtons"
                @didDismiss="asCancelWeekendDay = false"
            >
            </ion-action-sheet> -->

        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>
    import { defineComponent, ref, onMounted, watch } from 'vue';
    import { format, parseISO, formatISO9075, formatISO   } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import Header from '../components/headers/Header.vue';
    import Footer from '../components/Footer.vue';
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '../components/NavigationMenu.vue';
    import ViewChoosenDate from '../components/modal/ViewChoosenDate.vue';
    import CreateNewDeal from '../components/modal/NewDeal-modalCreate.vue';
    import CalendarSettings from '../components/modal/CalendarSettings.vue';
    import WeekPlanner from '../components/WeekPlanner.vue';
    // import ViewWeekDeal from '../components/modal/ViewWeekDeal.vue'
    //
    import { 
        IonContent, 
        IonHeader, 
        IonItem, 
        IonList, 
        IonMenu, 
        IonMenuToggle,
        IonButton,
        IonTitle, 
        IonToolbar,
        IonIcon,
        IonText,
        IonItemGroup,
        IonDatetime,
        IonActionSheet,
        IonFooter,
        toastController
    } from '@ionic/vue';
    //
    import { menu } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import { uid } from 'uid';
    //
    import { setExecutionHours } from '../helpers/setHours';

    export default defineComponent({
        name: 'calendar',
        components: {
            Header,
            Footer,
            Spinner,
            WeekPlanner,
            //
            IonContent, 
            IonHeader, 
            IonItem, 
            IonList, 
            IonMenu, 
            IonMenuToggle,
            IonButton,
            IonTitle, 
            IonToolbar,
            IonIcon,
            IonText,
            IonItemGroup,
            NavigationMenu,
            IonDatetime,
            ViewChoosenDate,
            CreateNewDeal,
            IonActionSheet,
            IonFooter,
            CalendarSettings
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const route = useRoute();
            const router = useRouter();
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;
            // Пеменная для выбранной в календаре даты
            const choosenDate = ref();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            // console.log(userEmail.value)
            const userSettings = ref(store.state.userSettings[0])
            //
            const spinner = ref(null);
            const myDeals = ref([]);
            // массив дел под конкретную дату
            const dealsByChoosenDate = ref([])
            // управление модалкой настройки выходного дня
            const actionSheetWeekendDayOpened = ref(false)
            //
            const dateCreate = ref();
            // Храним данные контакта
            const myContacts = ref([]);
            // рецепты пользователя
            const userRecipes = ref();
            // массив с датами типа День без дел
            const weekendDays = ref([]);
            // Переменная для наблюдателя по смене месяцев
            const observer = ref()
            //
            const availableBalance = ref(0)
            // const avatarFileName = ref('')
            // const daySaturation = ref(userSettings.value.daySaturation)
            // 
            //  ================================================ CALENDAR MODE ================================================
            // TOGGLE CALENDAR MODE
            const isMonthMode = ref(true)

            const calendarModeFunc = (boolean) => {
                if(boolean === true) {
                    isMonthMode.value = true
                    loadInMonthMode()
                } else {
                    isMonthMode.value = false
                }
            }

            // ФУНКЦИЯ ЗАГРУЗКИ КАЛЕНДАРЯ В РЕЖИМЕ MONTH
            const loadInMonthMode = async () => {
                spinner.value = true
                // Подтягиваем настройки аккаунта пользователя
                await store.methods.getUserSettingsfromDB()
                
                // Дергаем из store выходные дни
                userSettings.value = store.state.userSettings[0]
                weekendDays.value = userSettings.value.weekendDays

                //
                await store.methods.getMyDealsFromBD()
                myDeals.value = store.state.myDealsArray
                // запускаем функцию расчета баланса кошелька из store
                store.methods.calculateBalance(myDeals.value)
                availableBalance.value = store.state.availableBalance

                // Данные загружены, убираем spinner
                spinner.value = false
                
                // refreshData()
                if(choosenDate.value) {
                    dealsByChoosenDate.value = myDeals.value.filter(deal => formattedDate(deal.executionDate) === formattedDate(choosenDate.value))
                }

                // запускает функцию отрисовки стилей для дат календаря, исходя из существующих дел и загруженности дня
                
                // отслеживаем перелистывания месяцев в календаре
                const observer = new MutationObserver((mutationRecords) => {
                    if (mutationRecords) {
                        window.dispatchEvent(new CustomEvent('datetimeMonthDidChange', { detail: mutationRecords }));
                    }
                });
                // запускаем наблюдателя
                observer.observe(
                    document
                        .querySelector('ion-datetime')
                        .shadowRoot.querySelector('.calendar-body'),
                    {
                        subtree: true,
                        childList: true,
                    }
                );
                // запускаем обработчик событий при смене месяца
                window.addEventListener('datetimeMonthDidChange', (ev) => {
                    // console.log(ev)
                    // при перелистывании месяцев запускаем функцию стилей для дат
                    setCalendarStyle()
                })
                //при монтаже запускаем функцию стилей для дат
                setCalendarStyle()
                // Чистим deals.value
                deals.value = []
            }

            // ФУНКЦИЯ ЗАГРУЗКИ КАЛЕНДАРЯ В РЕЖИМЕ WEEK PLANNER 
            // 
            const deals = ref([])

            // Типа загрузка мода, по сути просто запускаем спинер
            const loadWeekMode = async () => {
                spinner.value = true 

                await store.methods.getUserSettingsfromDB()
                userSettings.value = store.state.userSettings[0]
                weekendDays.value = userSettings.value.weekendDays

                spinner.value = false 
            }

            
            // Отключаем спинер (это мы находимся в WeekPlanner)
            const spinnerChangeStat = (boolean) => {
                spinner.value = boolean
            }

            // УСЛОВИЯ ЗАПУСКАЯ ФУНКЦИЙ ЗАГРУЗКИ РЕЖИМА КАЛЕНДАРЯ при загрузке экрана

            if(router.currentRoute._value.fullPath === '/?isMonth=false') {
                isMonthMode.value = false;
                // loadWeekMode()
                spinner.value = true
            } else {
                isMonthMode.value = true;
                loadInMonthMode()
            }

            onMounted(() => {
                // Когда из дела возвраается назад в календарь в режиме месяца
                // console.log(route.query.day)
                console.log(isMonthMode.value)
                if(route.query.day) {

                    choosenDate.value = route.query.day

                    if(!isViewChoosenDateOpened.value) {
                        isViewChoosenDateOpened.value = true
                    }
                }
            })

            // ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ при нажатии на кнопку переклюения
            watch(isMonthMode, () => {
                
                if(isMonthMode.value === true) {
                    console.log('mode: MONTH')
                    loadInMonthMode()
                    router.replace({ query: {} })
                } else {
                    console.log('mode: WEEK')
                    // loadWeekMode()
                    spinner.value = true
                }
            })

            // ============================================ фильтруем дела по выбранную дату ====================================

            // функция форматирования даты для сравнения даты дела и выбранной даты
            const formattedDate = (day) => {
                if(day) {
                    // const formattedString = format(parseISO(day), 'd MMMM yyyy');
                    const formattedString = format(parseISO(day), 'd MMMM yyyy', { locale: ru });
                    return formattedString;
                }
            }
            // Массив дел по выбранной дате
            const dealsArray = ref([])
            // Когда выбираем дату (choosenDate.value уже имеет значение)
            watch(choosenDate, async () => {
                // setChoosenDateStyle()
                if(isMonthMode.value) {
                    setCalendarStyle()
                }
                // console.log(choosenDate.value)
                // если выбранная дата === одной из дат в массие дат, указанной как ДЕНЬ БЕЗ ДЕЛ
                // if(formattedDate('2022-10-30T12:04:00+05:00') === formattedDate(choosenDate.value)) {
                if(checkWeekendDays(choosenDate.value)){
                    // не даем открывать оконо просмотра дня
                    isViewChoosenDateOpened.value = false
                    // открываем модалку уведомление что дата выбрана как ДЕНЬ БЕЗ ДЕЛ
                    actionSheetWeekendDayOpened.value = true
                    // далее работает функционал из массива changeWeekendDayButtons
                    // let choosenDay = document.getElementsByClassName('.calendar-month')
                } else {
                    if(choosenDate.value) {
                        isViewChoosenDateOpened.value = true
                        // console.log(choosenDate.value)
                        await store.methods.getMyContactsFromDB()
                        myContacts.value = store.state.myContactsArray
                    }
                }
                dealsByChoosenDate.value = myDeals.value.filter(deal => {
                    if(formattedDate(deal.executionDate) === formattedDate(choosenDate.value)) {
                        dealsArray.value.push(deal)
                        return deal
                    }
                })
            })
            // Управление модалкой просмотра даты
            const isViewChoosenDateOpened = ref(false)
            //
            const closeViewChoosenDate = () => {
                isViewChoosenDateOpened.value = false
                // dealsByChoosenDate.value = []
                // console.log(date)
                choosenDate.value = null
                dealsArray.value = []
                // console.log(choosenDate.value)
            }
            // Переходим в карточку вабранного дела
            const goToChoosenDeal = (deal) => {
                // console.log(deal)
                router.push({name: 'View-Deal', params: { dealId: deal.id, deal: JSON.stringify(deal)}})
                isViewChoosenDateOpened.value = false
            }
            // Переходим в выбранный в карточке дела контакт
            const goToChoosenContact = (id) => {
                let contact = myContacts.value.filter(contact => contact.id === +id)
                // const result = myContacts.value.filter(contact => contact.id === +dealContactID)
                // const contact = result[0]
                // router.push({name: 'View-Contact', params: { contactId: dealContactID, contact: JSON.stringify(contact) }})
                if(contact.length === 0) {
                    alert('ViewWalletDebts: данный контакт не найден в Моих контактах')
                } else {
                    router.push({
                        name: 'View-Contact',
                        params: {
                            contactId: +id,
                            contact: JSON.stringify(contact[0])
                        }
                    })
                    isViewChoosenDateOpened.value = false
                }
            }
            // ==============================================================
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
                // executionDate: dateCreate.value,
                executionDate: '',
                executionDateEnd: '',
                dealPaid: 0,
                cancelledReason: '',
                dealImportance: 1,
                comments: '',
                tempContactName: 'Неизвестный'
            })
            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = async () => {

                isViewDealModalOpened.value = !isViewDealModalOpened.value;
                if(!isMonthMode.value) {
                    isViewChoosenDateOpened.value = false
                    // deleteTempDeal()
                } else {
                    isViewChoosenDateOpened.value = true
                }

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
                    executionDateEnd: '',
                    dealPaid: 0,
                    cancelledReason: '',
                    dealImportance: 1,
                    comments: '',
                    tempContactName: 'Неизвестный'
                }

                spinner.value = false
            }
            // =============================================================
            // Создаем новое дело, открывая модалку по созданию
            const createNewDeal = (date) => {
                // console.log(date)
                isViewChoosenDateOpened.value = false
                isViewDealModalOpened.value = true
                dateCreate.value = date
                // передаем выбранную дату в шаблон создания нового дела
                dealData.value.executionDate = dateCreate.value
                
                // Set execution date end
                dealData.value.executionDateEnd = setExecutionHours(dateCreate.value)
                
                console.log(`Время: ${dateCreate.value}; Время + час: ${dealData.value.executionDateEnd}`)
            }
            // Создаем новую сделку
            const called = ref(false)
            // Сама функция созания новго дела
            const createNew = async (newDealData) => {

                // принимаем инфу по контакту из modal
                dealData.value = newDealData

                // Если строки Имя Фамилия пустые или не пустые 
                // использовать валидацию 
                if(dealData.value.executionDate === ''){
                    alert('Calendar: Вы не выбрали дату исполнения')
                } else if(dealData.value.dealType === '') {
                    alert('Calendar: Вы не указали тип дела')
                // } else if (!dealData.value.shipping.typeOfShipping && dealData.value.dealType === 'sale') {
                } else if (dealData.value.dealsList.length === 0) {
                    alert('Calendar: Вы не добавили предмет дела')
                } else if (!dealData.value.shipping.typeOfShipping) {
                    // Если не понадобится - убрать
                    alert('Calendar: Вы не указали способ доставки')
                } else if(!called.value){
                    spinner.value = true;
                    called.value = true
                    try{
                        // Добавляем в БД инфу по новому контакту
                        // Скорей всего надо будет вынести в store или нет
                        const { error } = await supabase.from('deals').insert([dealData.value])
                        if(error) throw error
                        // обновляем массив в store
                        await store.methods.getMyDealsFromBD()
                        myDeals.value = store.state.myDealsArray
                        // ищем созданное новое дело в массиве всех дел в store (по uid)
                        const newDeal = myDeals.value.find(el => el.uid === dealData.value.uid)
                        // на свякий - тормозим спинер
                        spinner.value = false
                        //
                        if(dealData.value.dealPaid > 0) {
                            addToLedger(dealData.value.dealPaid, newDeal.id)
                        }
                        // если выбранная дата еще есть, а она есть - обновляем контент к показу 
                        // по этой дате в месячном
                        if(choosenDate.value) {
                            dealsByChoosenDate.value = myDeals.value.filter(deal => formattedDate(deal.executionDate) === formattedDate(choosenDate.value))
                        }

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
                            executionDateEnd: '',
                            dealPaid: 0,
                            cancelledReason: '',
                            dealImportance: 1,
                            comments: ''
                        }
                        //
                        if(isMonthMode.value) {
                            isViewDealModalOpened.value = false
                            isViewChoosenDateOpened.value = true
                            setCalendarStyle()
                        } else if (!isMonthMode.value) {

                            isViewChoosenDateOpened.value = false
                            // закрываем modal создания дела
                            isViewDealModalOpened.value = false

                            router.push({name: 'View-Deal', params: { dealId: newDeal.id, deal: JSON.stringify(newDeal)}, query: { isMonth: false }})
                        }
                    } catch (error) {
                        // alert(`"nj lfError: ${error.message}`)
                    }
                }
                // ЕСЛИ РЕЖИМ НЕДЕЛИ
                // if(!isMonthMode.value) {

                //     isViewChoosenDateOpened.value = false
                //     // закрываем modal создания дела
                //     isViewDealModalOpened.value = false
                // } 
                // // ЕСЛИ РЕЖИМИМ МЕСЯЦА
                // else {
                //     // Оставляем модалку выбранного дня открытой
                //     // isViewChoosenDateOpened.value = true
                //     // закрываем modal создания дела
                //     // isViewDealModalOpened.value = false
                // }
            }
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
                    tempRecipeName: subjectData.tempRecipeName,
                    productQuantity: subjectData.productQuantity,
                    // массив пока шаблоном, в modalCreateSubject задавать значения
                    additionalAttributes: subjectData.additionalAttributes,
                    totalSubjectPrice: subjectData.totalSubjectPrice,
                    productNote: subjectData.productNote,
                })  
            }
            //
            const deleteSubject = (id) => {
                dealData.value.dealsList = dealData.value.dealsList.filter(subject => subject.id !== id);
            }
            // ============================= Массив кнопок управления ДЕНЬ БЕЗ ДЕЛ ============================================
            
            const changeWeekendDayButtons = ref([
                {
                    text: 'Отменить',
                    handler: () => {
                        // console.log('Отменили День без дел')
                        isViewChoosenDateOpened.value = true
                        // Надо бы удалять из массива "Дни без дел"
                        // console.log(choosenDate.value)
                        let dayOfWeekend = choosenDate.value.substr(0,10)
                        weekendDays.value = weekendDays.value.filter(day => day.date !== dayOfWeekend);
                        setCalendarStyle()
                        // Обновляем запись в БД
                        updateWeekendDays()
                        // alert('День без дел отменен')
                        toastWeekend(formattedDate(choosenDate.value), { title: 'Выходной отменен', text: 'больше не выходной' })
                    }
                },  
                {
                    text: 'Назад ',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked')
                        // сбрасываем значение выбранную дату, чтобы потвторно можно было кликать на дату
                        choosenDate.value = null
                    }
                }
            ])
            //
            const setWeekendDayFunc = (day) => {
                let dayOfWeekend = day.substr(0, 10)
                weekendDays.value.push({date: dayOfWeekend})
                // обнолвяем запись в БД
                updateWeekendDays()
                // закрывает
                toastWeekend(formattedDate(day), { title: 'Выходной выбран', text: 'отмечен как выходной день' })
                isViewChoosenDateOpened.value = false
                //обнуляет
                choosenDate.value = null
                //
                setCalendarStyle()
            }
            // проверяем есть ли выбранная дата в массиве дней без дел
            const checkWeekendDays = (choosenDate) => {
                let dayOfWeekend;
                if(choosenDate) {
                    dayOfWeekend = choosenDate.substr(0,10)
                }
                if(weekendDays.value.find((item) => item.date === dayOfWeekend) !== undefined) {
                    return true
                } else {
                    return false
                }
            }
            // update weekend days array in BD
            const updateWeekendDays = async () => {
                // обновляем в БД
                try {
                    const { error } = await supabase.from('accountSettings').update({
                        weekendDays: weekendDays.value,
                    }).eq('email', userEmail.value)
                    if(error) throw error;
                } catch(error) {
                    alert(`Error: ${error.message}`)
                }
            }
            // 
            const setCalendarStyle = () => {
                let calendar = document.body.getElementsByTagName('ion-datetime')
                let dateTimeCalendar = calendar[0].shadowRoot.querySelector('.datetime-calendar')
                let buttons;
                if(dateTimeCalendar) {
                    buttons = dateTimeCalendar.querySelectorAll('.calendar-day')
                    //
                    buttons.forEach(item => {
                        let dayAndMonth = item.getAttribute('aria-label')
                        let year = item.getAttribute('data-year')
                        let dateString = `${dayAndMonth} ${year}`
                        let cutDateString;
                        // вырезаем в строке нужное значение
                        if(item.classList.contains('calendar-day-today')) {
                            cutDateString = dateString.split(', ')[2]
                        } else {
                            cutDateString = dateString.split(', ')[1]
                        }
                        //
                        // находим дни без дел и задаем им стили
                        // format(parseISO(weekendDay), 'd MMMM yyyy', { locale: ru });
                        if (weekendDays.value.find(weekendDay => formattedDate(weekendDay.date) === cutDateString)) {
                            // console.log(cutDateString)
                            //
                            return item.style.cssText = `
                                background-color: var(--ion-color-light);
                                opacity: 0.4;
                                margin: 0.2rem;
                                border-radius: 0.5rem;
                            `
                        } else {}
                        // раскрашиваем даты в зависимости от кол-ва дел, запланированных на этот день и их коэффициентов важности
                        // Определяем коэффициента загруженности
                        let workloadValue;
                        (() => {
                            const workloadFunc = () => {
                                let dealByDate = myDeals.value.filter(deal => formattedDate(deal.executionDate) === cutDateString)
                                //
                                let ratioArray = []
                                dealByDate.forEach(item => {
                                    ratioArray.push(item.dealImportance)
                                })
                                let newRatioArray = []
                                ratioArray.forEach(rating => {
                                    if(rating === 5) {
                                        rating = 3
                                    } else if (rating === 4) {
                                        rating = 2.5
                                    } else if (rating === 3) {
                                        rating = 2
                                    } else if (rating === 2) {
                                        rating = 1.5
                                    } else if (rating === 1) {
                                        rating = 1
                                    }
                                    newRatioArray.push(rating)
    
                                })
                                // console.log(newRatioArray)
                                workloadValue = newRatioArray.reduce((a, b) => a + b, 0)
                                // return workloadValue = dealByDate.length
                                return workloadValue
                            } 
                            workloadFunc()
                        })()
    
                        // день с легкой загруженностью
                        // при наличии low количества дел
                        if(workloadValue  > 0 && workloadValue  <= setSaturationDay('low')) {
                            return item.style.cssText = `
                                background-color: var(--ion-color-success);
                                margin: 0.2rem;
                                color: white;
                                border-radius: 0.5rem;
                            `
                        } 
                        // день с средней загруженностью
                        // количестве между low и high значениями (не включая данные значения)
                            else if(workloadValue  > setSaturationDay('low') && workloadValue  < setSaturationDay('high')) {
                            return item.style.cssText = `
                                background-color: var(--ion-color-warning);
                                margin: 0.2rem;
                                color: white;
                                border-radius: 0.5rem;
                            `
                        } 
                        // день с высокой загруженностью
                        // при наличии high количества дел и более
                        else if (workloadValue  >= setSaturationDay('high')) {
                            return item.style.cssText = `
                                background-color: var(--ion-color-danger-tint);
                                margin: 0.2rem;
                                color: white;
                                border-radius: 0.5rem;
                            `
                        }
                        // ячейка дат со статусом disabled
                        if(item.getAttribute('disabled') === '') {
                            return item.style.cssText = `
                                background-color: var(--ion-color-light);
                                margin: 0.2rem;
                                border-radius: 0.5rem;
                            `
                        } 
                        // свободные дни
                        else {
                            return item.style.cssText = `
                                background-color: var(--ion-color-success);
                                margin: 0.2rem;
                                color: white;
                                border-radius: 0.5rem;
                                opacity: 0.4;
                            `
                        }
                        
                    })
                }
                spinner.value = false
            }
            // проводим расчет цветовой индикации загруженности дня 
            const setSaturationDay = (level) => {
                let daySaturation = userSettings.value.daySaturation.find(item => item.name === level)
                return daySaturation.qty
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
                        userEmail: dealData.value.email,
                        tempContactName: dealData.value.tempContactName
                    }])
                    if(error) throw error
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }

            // Обновляем в БД массив с значениями загруженности дня
            const updateDaySaturation = async (daySaturationValue) => {
                try {
                    // spinner.value = true;
                    console.log('DB is updated')
                    //
                    const { error } = await supabase.from('accountSettings').update({
                        daySaturation: daySaturationValue
                    }).eq('id', userSettings.value.id)
                    if(error) throw error;
                    setCalendarStyle()
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                // spinner.value = false;
            }
            //
            const isSettingsModalOpened = ref(false)
            const toggleSettingsModal = (boolean) => {
                isSettingsModalOpened.value = boolean
            }

            // TOAST
            const toastWeekend = async (date, content) => {
                const toast = await toastController.create({
                    // Предметы дела будут добавлены на склад
                    message: `
                        <h3>${ content.title }</h3>
                        <p>${ date } ${ content.text }</p>
                    `,
                    // duration: 3000,
                    cssClass: 'custom_toast', 
                    position: 'top',
                    buttons: [
                        {
                            text: 'ОК',
                            role: 'cnacel',
                            handler: () => {
                                console.log('toast clicked dismiss')
                            }
                        }
                    ]
                });
                await toast.present();
                
            }

            const openWeekCreateDeal = async (event) => {
                isViewDealModalOpened.value = true
                //
                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
                //
                dealData.value.executionDate = formatISO(event)
                dealData.value.executionDateEnd = setExecutionHours(formatISO9075(event))

            }

            // const deleteTempDeal = () => {
            //     console.log('close modal clicked')
            // }

            // Переключатели выходного дня
            // Для установки выходного дня
            // const asSetWeekendDay = ref(false)
            // const asSetWeekendDayButtons = [
            //     {
            //         text: 'Сделать выходным',
            //         handler: () => {
            //             // проверяем что в дне нет дел
            //             checkEmptyDay()
            //         }
            //     },
            //     {
            //         text: 'Назад',
            //         role: 'cancel',
            //         handler: () => {
            //             console.log('Cancel clicked')
            //         },
            //     }
            // ]
            // Для отмены выходного дня
            // const asCancelWeekendDay = ref(false)
            // const asCancelWeekendDayButtons = [
            //     {
            //         text: 'Отменить',
            //         handler: async () => {
            //             // console.log('Заглушка. Нужна функция отмены выходного')
            //             // alert('Calendar: В разработке')
            //             // console.log(weekendDays.value.length)

            //             weekendDays.value = weekendDays.value.filter(day => day.date !== choosenDateFromWeekPlaner.value.date)

            //             // console.log(weekendDays.value.length)

            //             updateWeekendDays()
            //             toastWeekend(choosenDateFromWeekPlaner.value.date, { title: 'Выходной отменен', text: 'больше не выходной' })

            //             loadWeekMode()
            //         }
            //     },
            //     {
            //         text: 'Назад',
            //         role: 'cancel',
            //         handler: () => {
            //             console.log('Cancel clicked')
            //         },
            //     }
            // ]

            // Выбранная дата из Week Planner
            // const choosenDateFromWeekPlaner = ref({
            //     date: ''
            // })

            // УДАЛИТЬ ЕСЛИИ НЕ ПРИГОДИТСЯ!!!
            // const dateMakeWeekendWPFunc = (day) => {

            //     if(day && day.length === 10) {
            //         choosenDateFromWeekPlaner.value = {
            //             date: day
            //         }
            //         // Проверяем отмечен ли в БД как выходной день
            //         let isExist = weekendDays.value.find(e => e.date === choosenDateFromWeekPlaner.value.date) !== undefined
            //         // Если выбранный день уже является выходным
            //         if(isExist) {
            //             //  alert('WeekPlanner: выходной день')
            //             asCancelWeekendDay.value = true


            //              // ================ РАботаем с БД =================


            //         } 
            //         // Если выбранный день не выходной
            //         else {
            //             if(isViewDealModalOpened.value) {

            //             } else {
            //                 console.log('Рабочий день')
            //                 asSetWeekendDay.value = true
            //             }
            //         }

            //     }
            // }

            // Проверяем массив на наличиие дней с делами
            // const checkEmptyDay = async () => {
            //     // Временный массив
            //     const tempArr = []
            //     // По этой дате есть дела (поместить хэндлер в кнопки отмены)
            //     myDeals.value.forEach(item => {
            //         // Приводит даты дел к нужному формату
            //         let parsedExecutionDate = format(parseISO(item.executionDate), 'yyyy-MM-dd', { locale: ru })
            //         // Помещаем даты в массив
            //         tempArr.push({
            //             date: parsedExecutionDate
            //         })
            //     })
            //     // Если есть дела
            //     let dealsAreExist = tempArr.find(e => e.date === choosenDateFromWeekPlaner.value.date) !== undefined
            //     if(dealsAreExist) {
            //         alert('Calendar: Какой выходной! Есть дела в этот день!')
            //     } else {
            //         // console.log('НЕ ТДЕЛ!')
            //         // alert('Calendar: в разработке')

            //         // ================ РАботаем с БД =================
            //         weekendDays.value.push(choosenDateFromWeekPlaner.value)
            //         updateWeekendDays()
            //         // закрывает
            //         toastWeekend(choosenDateFromWeekPlaner.value.date, { title: 'Выходной выбран', text: 'отмечен как выходной день' })
            //         loadWeekMode()
            //     }
            // }

            // const openWeekendDayModaFunc = () => {
            //     console.log('opened')
                
            // }

            return {
                menu, user, router, pageTitle, choosenDate, spinner, myDeals, dealsByChoosenDate, dealsArray, isViewChoosenDateOpened, closeViewChoosenDate, goToChoosenDeal, createNewDeal, isViewDealModalOpened, setOpen, dealData, dateCreate, createNew, myContacts, addSubject, deleteSubject, goToChoosenContact, actionSheetWeekendDayOpened, changeWeekendDayButtons, setWeekendDayFunc, weekendDays, checkWeekendDays, userSettings, updateWeekendDays, setCalendarStyle, observer, availableBalance, addToLedger, toggleSettingsModal, isSettingsModalOpened, updateDaySaturation, userRecipes, called, toastWeekend, calendarModeFunc, isMonthMode, loadInMonthMode, loadWeekMode, deals, openWeekCreateDeal, spinnerChangeStat
            }
        }
    })
</script>

<style scoped>
    ion-datetime {
        --background: #ffffff;
        --background-rgb: 255,255,255;
        height: 80vh;
    }

    /* ion-datetime:not(.datetime-placeholder) {
        color: #f00;
    } */
    /* ion-datetime.datetime-calendar {
        display: none;
    } */
    /* Но part же нету в shadow-roots */
    ion-datetime::part(text) {
        background-color: red!important
    }
</style>