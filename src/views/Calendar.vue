<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- page header -->
        <Header :title="pageTitle" />

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

            <div>
                <ion-datetime
                    minute-values="0,15,30,45"
                    presentation="date"
                    size="cover"
                    v-model="choosenDate"
                    :first-day-of-week="1"
                    locale="ru"
                    ></ion-datetime>
                    <!-- @ionChange="setChoosenDateStyle" -->
                <!-- :is-date-enabled="isWeekday" -->
                <!-- dayValues="5,10,15,20,25,30" -->
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
            <CreateNewDeal
                :isOpen="isViewDealModalOpened"
                @closeModal="setOpen"
                @createDeal="createNew"
                :dealData="dealData"
                :myContacts="myContacts"
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
            <!--  -->
            <!-- {{userSettings.daySaturation}} -->
        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>
    import { defineComponent, ref, onMounted, watch } from 'vue';
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import Header from '../components/headers/Header.vue';
    import Footer from '../components/Footer.vue';
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '../components/NavigationMenu.vue';
    import ViewChoosenDate from '../components/modal/ViewChoosenDate.vue';
    import CreateNewDeal from '../components/modal/NewDeal-modalCreate.vue';
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
        IonFooter
    } from '@ionic/vue';
    //
    import { menu } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { uid } from 'uid';



    export default defineComponent({
        name: 'calendar',
        components: {
            Header,
            Footer,
            Spinner,
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
            IonFooter
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
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
            const dataLoaded = ref(null);
            const myDeals = ref([]);
            // массив дел под конкретную дату
            const dealsByChoosenDate = ref([])
            // управление модалкой настройки выходного дня
            const actionSheetWeekendDayOpened = ref(false)
            //
            const dateCreate = ref();
            // Храним данные контакта
            const myContacts = ref([])
            // массив с датами типа День без дел
            const weekendDays = ref([]);
            // Переменная для наблюдателя по смене месяцев
            const observer = ref()
            //
            const availableBalance = ref(0)
            // const avatarFileName = ref('')
            // 
            onMounted(async () => {
                spinner.value = true
                await store.methods.getUserSettingsfromDB()
                userSettings.value = store.state.userSettings[0]
                weekendDays.value = userSettings.value.weekendDays
                // console.log(weekendDays.value)
                // avatarFileName.value = userSettings.value.avatar_url
                // console.log(userSettings.value.avatar_url)
                //
                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
                //
                await store.methods.getMyDealsFromBD()
                myDeals.value = store.state.myDealsArray
                // запускаем функцию расчета баланса кошелька из store
                store.methods.calculateBalance(myDeals.value)
                availableBalance.value = store.state.availableBalance
                //
                if(dataLoaded.value = true) {
                    spinner.value = false
                } 
                
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
            })
            // фильтруем дела по выбранную дату
            // функция форматирования даты для сравнения даты дела и выбранной даты
            const formattedDate = (day) => {
                if(day) {
                    const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                    return formattedString;
                }
            }
            // Массив дел по выбранной дате
            const dealsArray = ref([])
            // Когда выбираем дату (choosenDate.value уже имеет значение)
            watch(choosenDate, () => {
                // setChoosenDateStyle()
                // setCalendarStyle()
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
                    }
                }
                dealsByChoosenDate.value = myDeals.value.filter(deal => {
                    if(formattedDate(deal.executionDate) === formattedDate(choosenDate.value)) {
                        dealsArray.value.push(deal)
                        return deal
                    }
                })
                // console.log(dealsArray.value)
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
                isViewChoosenDateOpened.value = false
                router.push({name: 'View-Deal', params: { dealId: deal.id, deal: JSON.stringify(deal)}})
            }
            // Переходим в выбранный в карточке дела контакт
            const goToChoosenContact = (dealContactID) => {
                isViewChoosenDateOpened.value = false
                const result = myContacts.value.filter(contact => contact.id === +dealContactID)
                const contact = result[0]
                router.push({name: 'View-Contact', params: { contactId: dealContactID, contact: JSON.stringify(contact) }})
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
                dealPaid: 0,
                cancelledReason: '',
                dealImportance: 1
            })
            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
                isViewDealModalOpened.value = !isViewDealModalOpened.value;
                isViewChoosenDateOpened.value = true
                // choosenDate.value = null
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
                    dealImportance: 1
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
            }
            // Создаем новую сделку
            const createNew = async (newDealData) => {
                // принимаем инфу по контакту из modal
                dealData.value = newDealData
                spinner.value = true;
                // console.log(dealData.value)
                // Если строки Имя Фамилия пустые или не пустые 
                // использовать валидацию 
                if(dealData.value.executionDate === ''){
                    alert('Calendar: Вы не выбрали дату исполнения')
                } else if(dealData.value.dealType === '') {
                    alert('Calendar: Вы не указали тип дела')
                // } else if (!dealData.value.shipping.typeOfShipping && dealData.value.dealType === 'sale') {
                } else if (!dealData.value.shipping.typeOfShipping) {
                    // Если не понадобится - убрать
                    alert('Calendar: Вы не указали способ доставки')
                } else {
                    try{
                        // Добавляем в БД инфу по новому контакту
                        // Скорей всего надо будет вынести в store или нет
                        const { error } = await supabase.from('deals').insert([dealData.value])
                        if(error) throw error;
                        // обновляем массив в store
                        await store.methods.getMyDealsFromBD();
                        myDeals.value = store.state.myDealsArray
                        // ищем созданное новое дело в массиве всех дел в store (по uid)
                        const newDeal = myDeals.value.find(el => el.uid === dealData.value.uid)
                        // закрываем modal
                        isViewDealModalOpened.value = false;
                        // на свякий - тормозим спинер
                        spinner.value = false;
                        //
                        if(dealData.value.dealPaid > 0) {
                            addToLedger(dealData.value.dealPaid, newDeal.id)
                        }
                        // Оставляем модалку выбранного дня открытой
                        isViewChoosenDateOpened.value = true
                        // если выбранная дата еще есть, а она есть - обновляем контент к показу по этой дате
                        if(choosenDate.value) {
                            dealsByChoosenDate.value = myDeals.value.filter(deal => formattedDate(deal.executionDate) === formattedDate(choosenDate.value))
                        }
                        //
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
                            dealImportance: 1
                        }
                        //
                        setCalendarStyle()
                    } catch (error) {
                        alert(`Error: ${error.message}`)
                    }
                }
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
                        weekendDays.value = weekendDays.value.filter(day => day.date !== formattedDate(choosenDate.value));
                        setCalendarStyle()
                        // Обновляем запись в БД
                        updateWeekendDays()
                        alert('День без дел отменен')
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
            const setWeekendDayFunc = async (date) => {
                weekendDays.value.push({date: formattedDate(date)})
                // console.log(weekendDays.value)
                // обнолвяем запись в БД
                updateWeekendDays()
                // закрывает
                isViewChoosenDateOpened.value = false
                //обнуляет
                choosenDate.value = null
                //
                // console.log('Отметили как День без дел')
                setCalendarStyle()
                alert('Отмечено как День без дел')
            }
            // проверяем есть ли выбранная дата в массиве дней без дел
            const checkWeekendDays = (choosenDate) => {
                if(weekendDays.value.find((item) => item.date === formattedDate(choosenDate)) !== undefined) {
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
                        weekendDays: weekendDays.value
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
                let buttons = dateTimeCalendar.querySelectorAll('.calendar-day')
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
                    if (weekendDays.value.find(weekendDay => weekendDay.date === cutDateString)) {
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
                        userEmail: dealData.value.email
                    }])
                    if(error) throw error
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }

            return {
                menu, user, router, pageTitle, choosenDate, spinner, dataLoaded, myDeals, dealsByChoosenDate, dealsArray, isViewChoosenDateOpened, closeViewChoosenDate, goToChoosenDeal, createNewDeal, isViewDealModalOpened, setOpen, dealData, dateCreate, createNew, myContacts, addSubject, deleteSubject, goToChoosenContact, actionSheetWeekendDayOpened, changeWeekendDayButtons, setWeekendDayFunc, weekendDays, checkWeekendDays, userSettings, updateWeekendDays, setCalendarStyle, observer, availableBalance, addToLedger
            }
        }
    })
</script>

<style scoped>
    ion-datetime {
        --background: #ffffff;
        --background-rgb: 255,255,255;
        --title-color: green;
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