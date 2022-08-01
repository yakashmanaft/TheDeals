<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle"/>

        <!-- Кнопка перехода к созданию нового дела -->
        <create-button @click="setOpen"/>

        <!-- popup создания нового дела -->
        <CreateNewDeal
            :isOpen="isOpen"
            @closeModal="setOpen"
            @createDeal="createNew"
            :dealData="dealData"
            :myContacts="myContacts"
            @date-updated="(dealContactID) => dealData.contactID = dealContactID.currentValue"
        />

        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push"
        >
            <br>
            <br>
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myDeals.length === 0) && !spinner" class="no-status-deal ion-padding-horizontal">
                <ion-img style="height: 30vh;" src="img/common/deals-sticker.webp" alt="нет дел"></ion-img>
                <ion-text color="primary"><h2>У вас еще нет дел...</h2></ion-text>
                <ion-text>Самое время начать заниматься деятельностью. <br>И создать первое дело!</ion-text>
            </div>
            <!-- Data -->
            <div v-if="dataLoaded && myDeals.length !== 0">
                <!-- Статусы дел -->
                <ion-list class="horizontal-scroll ion-margin-top">
                    <ion-chip v-for="(status, index) in dealStatusList" :key="index" @click="setDealStatus(status.value)" :color="setChipColor(status.value)" :outline="setChipOutline(status.value)">
                        <ion-label>{{ status.name }} {{countDealByStatus(status.value)}}</ion-label>
                    </ion-chip>
                </ion-list>
                <!-- Если по данному статусу нет дел -->
                <div class="no-status-deal" v-if="foundDealsByStatus.length === 0">
                    <div v-for="(status, index) in dealStatusList" :key="index">
                        <div v-if="currentDealStatus === status.value">
                            <ion-img class="no-status-deal_img" :src="`img/status/${status.value}.svg`"></ion-img>
                            <h4>{{ status.caption }}</h4>
                            <ion-text color="medium">{{ status.text }}</ion-text>
                        </div>
                    </div>
                </div>

                <!-- Карточки дел-->
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
                                        <ion-grid>
                                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                                <!-- Кнопка смены статуса дела -->
                                                <div @click.prevent.stop="doSomething">
                                                    <!-- Как будет вести себя translatePlaceholder при тысяче дел например?  -->
                                                    <Select :data="dealStatusList" :placeholder="translatePlaceholder(deal.dealStatus, dealStatusList)" @date-updated="(selected) => {deal.dealStatus = selected.currentValue; updateCurrentDealStatus(deal)}"/>
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
                                                        >{{showNameByID(deal.contactID)}}</router-link>
                                                    </ion-text>
                                                </div>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-card-header>
                                    <!-- Body of the card -->
                                    


                                </ion-card>
                            </router-link>
                    </div>
                </div>

            </div>
        </ion-content>
    </div>
</template>

<script>
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue'
    import Spinner from '@/components/Spinner.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import CreateNewDeal from '@/components/modal/NewDeal-modalCreate.vue';
    import Select from '../components/Select.vue'
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
        IonRow
    } from '@ionic/vue';
    import { defineComponent, ref, computed, onMounted, watch } from 'vue';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { uid } from 'uid';
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale'
    export default defineComponent({
        name: 'Deals',
        components: {
            Header,
            Spinner,
            CreateButton,
            CreateNewDeal,
            Select,
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
            NavigationMenu,
            IonChip,
            IonLabel,
            IonItemOption,
            IonItemOptions,
            IonItemSliding,
            IonCard,
            IonCardHeader,
            IonGrid,
            IonRow
        },
        setup() {
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
                resfreshData();
            })
            // Получаем массив форматированных к показу дат
            const getExecutionDate = () => {
                // Сортируем от ближайшей даты и по удалению от сегодня
                daysArray.value.sort((a,b) => {
                    return new Date(a) - new Date(b);
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
                resfreshData(currentValue)
            })
            // Счетчик коилчества дел по конкретному статусу
            const countDealByStatus = (status) => {
                const result = myDeals.value.filter(item => item.dealStatus === status)   
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
            //
            const setChipOutline = (status) => {
                if(status === currentDealStatus.value) {
                    return false
                }
                return true
            }
            // ====================================================================
            // Work with deal card
            const doSomething = () => {
                console.log('clicked')
            }
            // Меняем статус прямо на карточке дела
            const updateCurrentDealStatus = async (deal) => {
                // Обновляем данные в БД
                try{
                    const { error } = await supabase.from('deals').update({
                        dealStatus: deal.dealStatus
                    }).eq('id', deal.id);
                    if(error) throw error;
                    resfreshData();
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
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
            // Подтягиваем name, surname на основании contactID
            // Вынести в отдельный файл
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
            
            // ====================================================================
            // Work with Modal Create New Deal
            const isOpen = ref(false)
            // Изменяемый шаблон нового дела
            const dealData = ref({
                uid: uid(),
                email: userEmail.value,
                dealType: '',
                dealStatus: "deal-in-booking",
                contactID: '000',
                dealsList: [],
                shipping: '',
                totalDealValue: '',
                executionDate: '',
                dealPaid: '',
                cancelledReason: ''
            })
            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
                isOpen.value = !isOpen.value;
                dealData.value = {
                    uid: uid(),
                    email: userEmail.value,
                    dealType: '',
                    dealStatus:"deal-in-booking",
                    contactID: '000',
                    dealsList: [],
                    shipping: '',
                    totalDealValue: '',
                    executionDate: '',
                    dealPaid: '',
                    cancelledReason: ''
                }
            }
            // Создаем новую сделку
            const createNew = async (newDealData) => {
                // принимаем инфу по контакту из modal
                dealData.value = newDealData
                spinner.value = true;
                // Если строки Имя Фамилия пустые или не пустые 
                // использовать валидацию 
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
                    isOpen.value = false;
                    // переходим на страницу созданного нового контакта
                    router.push({name: 'View-Deal', params: { dealId: newDeal.id, deal: JSON.stringify(newDeal)}})
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            // Функция обновления контента к показу (после обновления в записей в БД)
            const resfreshData = () => {
                daysArray.value = []
                days.value = []
                // Обновляем содержимое к отображению
                foundDealsByStatus.value = myDeals.value.filter(deal => {
                    // Задаем формат отображения для даты полученных дел
                    // const executionDate = formattedDate(new Date(deal.executionDate).toISOString().split("T")[0])
                    // const executionDate = formattedDate(deal.executionDate)
                    const executionDate = deal.executionDate
                    if(deal.dealStatus === currentDealStatus.value) {
                        daysArray.value.push(executionDate)
                        // daysArray.value.sort((a,b) => {
                        //     return new Date(b) - new Date(a);
                        // })
                        return deal.dealStatus === currentDealStatus.value
                    } 
                })
            }
            return {
                user, router, pageTitle, userEmail, createNew, myDeals, spinner, dataLoaded, isOpen, dealData, setOpen, setDealStatus, currentDealStatus, dealStatusList, foundDealsByStatus, daysArray, days, getExecutionDate, formattedDate, countDealByStatus, setChipColor, setChipOutline, doSomething, updateCurrentDealStatus, translatePlaceholder, resfreshData, myContacts, getContact, showNameByID
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
        height: 80vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .no-status-deal_img {
        width: 50%; 
        height: 50%; 
        margin:0 auto;
    }
</style>