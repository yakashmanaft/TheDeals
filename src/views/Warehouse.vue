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
            @goToSettings="isSettingsModalOpened = true"
            :title="pageTitle"
        />

        <!-- Кнопка перехода к созданию нового дела -->
        <CreateButton @click="setOpen"/>

        <!-- Модалка создания нового предмета -->
        <CreateNewItem
            :is-open="isOpen"
            @closeModal="setOpen"
            @createItem="createItem"
            :itemData="itemData"
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
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myItems.length === 0) && !spinner" class="no-status-deal ion-padding-horizontal no-data">
                <ion-img src="img/common/warehouse-sticker.webp" alt="нет дел"></ion-img>
                <ion-text color="primary"><h2>Склад пуст...</h2></ion-text>
                <ion-text color="medium">Самое время пополнять запасы</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && myItems.length !== 0" class="ion-text-left ion-margin-bottom">

                <!-- Поиск -->
                <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="search"></ion-searchbar>

                <!-- Вывод списка предметов при поиске-->
                <router-link
                    v-if="search !== ''"
                    v-for="(item, index) in searchedItem" :key="index"
                    :to="{
                        name: 'View-warehouse-item',
                        params: {
                            itemId: item.id,
                            itemUid: item.uid,
                            item: JSON.stringify(item)
                        }
                    }"
                >
                    <ion-item lines="none" class="ion-no-padding ion-margin-horizontal">
                        <ion-grid>
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text color="primary">
                                    {{item.name}} ({{item.subjectQty}}{{ setMeasure(item.estimationType) }})
                                </ion-text>
                                <ion-text>
                                    <!-- {{item.subjectQty}} -->
                                    <!-- Не понятно что тут помещать )) -->
                                </ion-text>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </router-link>

                <!-- Выводс списка предметов при наличии категори в принципе -->
                <router-link
                    v-for="(item, index) in searchedItem" :key="index"
                    v-if="search === ''"
                    :to="{
                        name: 'View-warehouse-item',
                        params: {
                            itemId: item.id,
                            itemUid: item.uid,
                            item: JSON.stringify(item)
                        }
                    }"
                >
                    <ion-item v-if="(item.categories.length === 0)" lines="none">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="primary">
                                {{item.name}}
                            </ion-text>
                            <ion-text>
                                <!-- {{item.subjectQty}}  -->
                                <!-- Не понятно что тут помещать )) -->
                            </ion-text>
                        </ion-row>
                    </ion-item>
                </router-link>

                <!-- Полоска разделитель -->
                <!-- <div v-if="(searchedCategory.length > 0 && searchedItem.length === 0)" class="line-divider ion-margin-horizontal"></div> -->

                <!-- Вывод информации при отсутствии схожих поиску результатов-->
                <ion-item lines="none" v-if="searchedItem.length <= 0 && searchedCategory.length <= 0">
                    <ion-text color="medium">Ничего не найдено</ion-text>
                </ion-item>

                <!-- Вывод категорий и завернутых в них предметов -->
                <div v-else>
                    <div v-for="(category, index) in searchedCategory" :key="index" class="ion-no-padding ion-margin-horizontal" @click.stop="expendList(index)">

                        <!--  -->
                        <ion-item lines="none" class="ion-no-padding" v-if="filteredMyItemsFunc(category).length !== 0">
                            <ion-grid>
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text style="font-weight: bold">
                                        {{category}}
                                    </ion-text>
                                    <ion-text>
                                        {{filteredMyItemsFunc(category).length}}
                                    </ion-text>
                                </ion-row>
                            </ion-grid>
                        </ion-item>

                        <!--  -->
                        <div :id="index" style="display: none">
                            <div v-for="(item, idx) in filteredMyItemsFunc(category)" :key="idx" lines="none" class="ion-no-padding">
                                <router-link
                                    :to="{
                                        name: 'View-warehouse-item',
                                        params: {
                                            itemId: item.id,
                                            itemUid: item.uid,
                                            item: JSON.stringify(item)
                                        }
                                    }"
                                >
                                    <ion-item lines="none" class="ion-no-padding">
                                        <ion-grid>
                                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                                <ion-text color="primary">
                                                    {{item.name}} ({{item.subjectQty}}{{ setMeasure(item.estimationType) }})
                                                </ion-text>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-item>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <!--  -->
                <WarehouseSettings
                    :is-open="isSettingsModalOpened"
                    @closeModal="closeSettingsModal"
                    :itemsSystemCategories="warehouseCategoriesArray"
                    @update="update"
                />

            </div>

            <br>
            <br>
            <br>
        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted, watch } from 'vue'
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import { uid } from 'uid';
    //
    import { IonContent, IonImg, IonText, IonSearchbar, IonItem, IonList, IonGrid, IonRow, IonItemDivider } from '@ionic/vue'
    //
    import Spinner from '@/components/Spinner.vue';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue';
    import CreateButton from '../components/CreateButton.vue';
    import CreateNewItem from '../components/modal/NewWarehouseItem-modalCreate.vue';
    import WarehouseSettings from '../components/modal/WarehouseSettings.vue';
    import Footer from '../components/Footer.vue'
    // 
    import { searchWarehouseItemFilter  } from '../helpers/filterUserWarehouseItems.js';
    import { searchWarehouseCategoryFilter } from '../helpers/filterWarehouseCategories.js';

    export default defineComponent({
        name: 'Warehouse',
        components: {
            IonContent, IonImg, IonText, IonSearchbar, IonItem, IonList, IonGrid, IonRow, IonItemDivider,
            //
            WarehouseSettings, Spinner, NavigationMenu, Header, CreateButton, CreateNewItem, Footer
        },
        setup() {
            //
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myItems = ref([]);
            const warehouseCategoriesArray = ref([])
            // Подтягиваем список дел из store
            spinner.value = true;
            //
            // Currency
            const currency = ref(store.state.systemCurrency.name)
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            const route = useRoute();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            console.log(userEmail.value)
            // Get current info of route
            // const currentId = route.params;
            // console.log(currentId)
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const userSettings = ref(store.state.userSettings[0])
            const userWorkProfile = ref(userSettings.value.userWorkProfile);
            const userWarehouseCategoriesArray = ref(userSettings.value.userWarehouseCategories)
            //
            onMounted( async () => {
                await store.methods.getUserWarehouseItemsFromDB()
                myItems.value = store.state.userWarehouseArray;
                console.log(userWorkProfile.value)
                //
                spinner.value = false
                dataLoaded.value = true;

                // ===================== ЗАВИСИТ ОТ ТИПА РАБОЧЕГО ПРОФИЛЯ В НАСТРОЙКАХ АККАУНТА ====================
                // Это для списка складских категорий в настройках склада
                if(userWorkProfile.value === 'Автозапчасти') {
                    warehouseCategoriesArray.value = store.state.autoWarehouseCategoriesArray
                } else if (userWorkProfile.value === 'Тортодилер') {
                    warehouseCategoriesArray.value = store.state.cakeWarehouseCategoriesArray
                }
                
            })
            // функция поиска предмета по складу с помощью search
            const search = ref('');
            const searchedItem = computed(() => {
                return searchWarehouseItemFilter(myItems.value, search.value)
                // return myItems.value
            })
            const searchedCategory = computed(() => {
                return searchWarehouseCategoryFilter(userWarehouseCategoriesArray.value, search.value)
            })
            // =====================================
            // Work with Modal Create New Warehouse Item
            const isOpen = ref(false);
            //
            const itemData = ref({
                uid: uid(),
                email: userEmail.value,
                name: '',
                catalogNumber: '',
                subjectQty: 1,
                categories: []
            })
            if (userWorkProfile.value === 'Тортодилер') {
                itemData.value = {
                    uid: uid(),
                    email: userEmail.value,
                    name: '',
                    catalogNumber: '',
                    estimationType: '',
                    subjectQty: 1,
                    categories: []
                }
            }
            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
                spinner.value = false
                // alert('Warehouse: В разработке...')
                isOpen.value = !isOpen.value;
                if(userWorkProfile.value === 'Автозапчасти') {
                    itemData.value = {
                        uid: uid(),
                        email: userEmail.value,
                        name: '',
                        catalogNumber: '',
                        subjectQty: 1,
                        categories: []
                    }
                } else if (userWorkProfile.value === 'Тортодилер') {
                    itemData.value = {
                        uid: uid(),
                        email: userEmail.value,
                        name: '',
                        catalogNumber: '',
                        estimationType: '',
                        subjectQty: 1,
                        categories: []
                    }
                }
            }
            //
            // const closeCreateItemModal = () => {
            //     isOpen.value = false;
            //     itemData.value = {}
            // }
            // Создаем новый предмет
            const isItemAlreadyAdded = ref()
            const createItem = async (newItemData) => {
                // Принимаем инфу по предмету из модалки
                itemData.value = newItemData
                // имитируем загрузку
                spinner.value = true;
                // Использовать валидацию
                isItemAlreadyAdded.value = myItems.value.find(item => item.name === newItemData.name)
                if (isItemAlreadyAdded.value !== undefined) {
                    alert('Warehouse: Предмет с таким названием уже существует')
                } else if (newItemData.name === '') {
                    alert('Warehouse: Вы не указали предмет')
                } else if(userWorkProfile.value !== 'Тортодилер' && newItemData.catalogNumber === '') {
                    alert('Warehouse: Вы не указали каталожный номер')
                } else if(userWorkProfile.value === 'Тортодилер' && newItemData.estimationType === '') {
                    alert('Warehouse: Укажите тип расчета')
                } else if (newItemData.categories.length === 0) {
                    alert('Warehouse: Укажите категорию')
                } else if(newItemData.subjectQty === 0) {
                    alert('Warehouse: Количество должно быть > 0')
                } else {
                    try {
                        // Добавляем в БД инфу по новому предмету
                        const { error } = await supabase.from('userWarehouse').insert([itemData.value])
                        if(error) throw error;
                        //
                        await store.methods.getUserWarehouseItemsFromDB();
                        myItems.value = store.state.userWarehouseArray;
                        // ищем созданный новый предмет в массиве всех предметов в store (по uid)
                        const newItem = myItems.value.find(el => el.uid === itemData.value.uid)
                        // Сбрасываем заполненные данные и закрываем модалку
                        setOpen()
                        // переходим на страницу созданного нового контакта
                        router.push({ name: 'View-warehouse-item', params: { itemId: newItem.id, item: JSON.stringify(newItem)} })
                    } catch (error) {
                        alert(`Error: ${error.message}`)
                    }
                    // console.log('Предмет создан')
                    // console.log(newItemData)
                }
            }
            //
            const filteredMyItemsFunc = (category) => {
                let filteredMyItems = []
                myItems.value.forEach(item => {
                    // console.log(item.categories.includes(category))
                    if(item.categories.includes(category)) {
                        filteredMyItems.push(item)
                    }
                })

                return filteredMyItems
            }
            //
            const expendList = (index) => {
                let el = document.getElementById(index)
                if(document.getElementById(index)) {

                    if(el.style.display == 'none') {
                            el.style.display = 'block'
                        } else {
                            el.style.display = 'none'
                    }
                }
            }

            // 
            const isSettingsModalOpened = ref(false)
            const closeSettingsModal = () => {
                // console.log(boolean)
                // store.methods.getUserWarehouseItemsFromDB()
                // userWarehouseCategoriesArray.value = userSettings.value.userWarehouseCategories
                isSettingsModalOpened.value = false
                // console.log(`close clicked: ${userWarehouseCategoriesArray.value}`)
            }

            // 
            const update = async (myCategories) => {
                try {
                    spinner.value = true;
                    const {error} = await supabase.from('accountSettings').update({
                        userWarehouseCategories: myCategories
                    }).eq('email', userEmail.value);
                    if(error) throw error;
                    spinner.value = false;
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                await store.methods.getUserWarehouseItemsFromDB()
                myItems.value = store.state.userWarehouseArray;
                await store.methods.getUserSettingsfromDB()
                userWarehouseCategoriesArray.value = store.state.userSettings[0].userWarehouseCategories 
                console.log(`after update: ${userWarehouseCategoriesArray.value}`)
            }
            //
            const setMeasure = (estimationType) => {
                if(estimationType === 'perKilogram') {
                    return 'гр.'
                } else if(estimationType === 'perUnit') {
                    return 'шт.'
                } else if(estimationType === 'teaSpoon') {
                    return 'ч.л.'
                } else if (estimationType === 'pinch') {
                    return 'щепотки'
                } else if (estimationType === 'stick') {
                    return 'палочки'
                }
            }


            return {
                route, itemData, dataLoaded, spinner, setOpen, currency, user, pageTitle, myItems, isOpen, createItem, search, warehouseCategoriesArray, filteredMyItemsFunc, searchedItem, searchedCategory, expendList, closeSettingsModal, isSettingsModalOpened, update, userSettings, userWorkProfile, userWarehouseCategoriesArray, setMeasure, isItemAlreadyAdded
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
    .no-status-deal_img {
        width: 50%; 
        height: 50%; 
        margin:0 auto;
    }
    .no-data ion-img {
        width: 50%;
    }
    .display-none {
        display: none;
    }
    .display-block {
        display: block
    }
    .line-divider {
        border: 0.05rem solid var(--ion-color-light);
    }
</style>