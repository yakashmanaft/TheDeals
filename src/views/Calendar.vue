<template>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle" />

        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
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
                <!-- color="primary" -->
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
            />
            <!-- Всплывашка об удалении выбранной даты из массива дат "ДЕнь без дел" -->
            <ion-action-sheet
                :is-open="actionSheetWeekendDayOpened"
                header="Это день без дел"
                :buttons="changeWeekendDayButtons"
                @didDismiss="actionSheetWeekendDayOpened = false"
            >
            </ion-action-sheet>
        </ion-content>
</template>

<script>
    import { defineComponent, ref, onMounted, watch } from 'vue';
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import Header from '../components/headers/Header.vue';
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
        IonActionSheet
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
            Spinner,
            ViewChoosenDate,
            CreateNewDeal,
            IonActionSheet
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
            console.log(userEmail.value)
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
            // 
            onMounted(async () => {
                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
                await store.methods.getMyDealsFromBD()
                myDeals.value = store.state.myDealsArray
                spinner.value = false
                dataLoaded.value = true 
                // refreshData()
                if(choosenDate.value) {
                    dealsByChoosenDate.value = myDeals.value.filter(deal => formattedDate(deal.executionDate) === formattedDate(choosenDate.value))
                }
                // console.log(choosenDate.value)
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
                // console.log(choosenDate.value)
                // если выбранная дата === одной из дат в массие дат, указанной как ДЕНЬ БЕЗ ДЕЛ
                if(formattedDate('2022-10-30T12:04:00+05:00') === formattedDate(choosenDate.value)) {
                    // не даем открывать оконо просмотра дня
                    isViewChoosenDateOpened.value = false
                    // открываем модалку уведомление что дата выбрана как ДЕНЬ БЕЗ ДЕЛ
                    actionSheetWeekendDayOpened.value = true
                    // далее работает функционал из массива changeWeekendDayButtons

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
            })
            // Управление модалкой просмотра даты
            const isViewChoosenDateOpened = ref(false)
            //
            const closeViewChoosenDate = () => {
                isViewChoosenDateOpened.value = false
                // dealsByChoosenDate.value = []
                // console.log(date)
                choosenDate.value = null
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
                cancelledReason: ''
            })
            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
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
                    cancelledReason: ''
                }
            }
            // =============================================================
            // Создаем новое дело
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
                // Если строки Имя Фамилия пустые или не пустые 
                // использовать валидацию 
                if(dealData.value.executionDate === ''){
                    alert('Deals: Вы не выбрали дату исполнения')
                } else if(dealData.value.dealType === '') {
                    alert('Deals: Вы не указали тип дела')
                } else if (!dealData.value.shipping.typeOfShipping && dealData.value.dealType === 'sale') {
                    // Если не понадобится - убрать
                    alert('Deals: Вы не указали способ доставки')
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
                        // переходим на страницу созданного нового контакта
                        router.push({name: 'View-Deal', params: { dealId: newDeal.id, deal: JSON.stringify(newDeal)}})
                    } catch (error) {
                        alert(`Error: ${error.message}`)
                    }
                }
            }
            // onMounted( async () => {
            //     await store.methods.getMyContactsFromDB()
            //     myContacts.value = store.state.myContactsArray
            // })
            //
            // const showNameByID = (contactID) => {
            //     return contactID
            // }
            // Передаем в роут данные ко конкретному контакту
            // const getContact = (contactID) => {
            //     const result = myContacts.value.filter(contact => contact.id === +contactID)
            //     const contact = result[0]
            //     return JSON.stringify(contact)
            // }
            // Подтягиваем name, surname на основании contactID
            // Вынести в отдельный файл
            // const showNameByID = (contactID) => {
            //     const result = myContacts.value.filter(contact => contact.id === +contactID)
            //     if(result.length !== 0) {
            //         const nameByID = (result[0].contactInfo.surname + ' ' + result[0].contactInfo.name).toString().replace(/"/g, "")
            //         return nameByID;
            //     } else if (result.length === 0) {
            //         const nameByID = 'Неизвестный'
            //         return nameByID;
            //     }
            // }
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
                        console.log('Отменили День без дел')
                        isViewChoosenDateOpened.value = true
                        // Надо бы удалять из массива "Дни без дел"
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
            const setWeekendDayFunc = (date) => {
                console.log(date)
                // закрывает
                isViewChoosenDateOpened.value = false
                //обнуляет
                choosenDate.value = null
                //
                console.log('Отметили как День без дел')
            }


            return {
                menu, user, router, pageTitle, choosenDate, spinner, dataLoaded, myDeals, dealsByChoosenDate, dealsArray, isViewChoosenDateOpened, closeViewChoosenDate, goToChoosenDeal, createNewDeal, isViewDealModalOpened, setOpen, dealData, dateCreate, createNew, myContacts, addSubject, deleteSubject, goToChoosenContact, actionSheetWeekendDayOpened, changeWeekendDayButtons, setWeekendDayFunc
            }
        }
    })
</script>

<style scoped>
    ion-datetime {
        --background: #ffffff;
        --background-rgb: 255,255,255;
        --title-color: green;
    }

    ion-datetime:not(.datetime-placeholder) {
        /* color: #f00; */
    }
    /* ion-datetime.datetime-calendar {
        display: none;
    } */
</style>