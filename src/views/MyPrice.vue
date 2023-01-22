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

        <!-- Кнопка перехода к созданию нового дела -->
        <create-button @click="toggleNewPriceProductModal"/>

        <!-- Модалка просмотра конкретного продукта | атрибута в прайсе -->
        <ViewPriceProduct
            :is-open="isViewCurrentProductOpened" 
            @closeModal="closeProductInfo"   
            :productData="currentProduct"
            @getCostEstimation="setCostEstimation"
            @getProductPrice="setProductPrice"
            @getProductQty="setProductQty"
            @getRentType="setAttributeRentType"
            :blockToShow="blockToShow"
            :currentProductPrice="currentProductPrice"
        />

        <!-- Модалка создания нового продукта | атрибута к прайсу -->
        <CreatePriceProduct
            :is-open="isModalNewPriceItemOpened" 
            @closeModal="closeModalCreatePriceProduct"   
            :newProductData="newPriceProductData"
            @getNewProductQty="setNewProductQty"
            @getNewProductPrice="setNewProductPrice"
            @addPriceProduct="addNewPriceProduct"
            @getRentType="setNewProductAttributeRentType"
            :blockToShow="blockToShow"
            @blockToShowIsChanged="changeBlockToShow"
        />
        
        <!-- Page content -->
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
            <div v-for="(item, index) in userSettings" :key="index" class="ion-margin-bottom">
                <!-- No data -->
                <div v-if="!spinner && ((item.userPriceList.length === 0 && item.userAdditionalAttributes.length === 0) || !dataLoaded )" class="no-status-deal ion-padding-horizontal no-data">
                    <ion-img src="img/common/price-sticker.webp" alt="нет дел"></ion-img>
                    <ion-text color="primary"><h2>Ваш прайс пуст</h2></ion-text>
                    <ion-text color="medium">Добавьте продукт</ion-text>
                </div>

                <!-- Убирать если ни предметов ни атрибутов нет -->
                <div v-if="dataLoaded && (item.userPriceList.length !== 0 || item.userAdditionalAttributes.length !== 0)">
                    <ion-item-group class="ion-margin-top ion-text-left horizontal-scroll">
                        <ion-chip v-for="(chip, index) in priceChipList" :key="index" @click="setBlockToShow(chip.value)" color="primary" :outline="setChipOutline(chip.value, blockToShow)">
                            <ion-label>{{ chip.name }} <span>{{countItemChip(chip.value)}}</span></ion-label>
                        </ion-chip>
                    </ion-item-group>
                </div>

                <!-- ==================================== Data ===================================== -->
                <!-- Продуктовый прайс -->
                <div v-if="dataLoaded && item.userPriceList.length !== 0 && blockToShow === 'products'">
                    <ion-item-group class="ion-text-left ion-padding-horizontal ion-margin-bottom">
                        <ion-card class="ion-no-margin ion-margin-top relative" v-for="item in item.userPriceList" :key="item.id" @click.stop="openProductInfo(item)">
                            <ion-card-content class="ion-no-padding">
                                <!-- Кнопка удалить конкретный продукт -->
                                <ion-icon @click.stop="openDeleteProductModal(item.uid)" class="icon_size icon_del absolute" :icon="closeCircleOutline"></ion-icon>
                                <!-- User Product -->
                                <ion-grid>
                                    <ion-row class="ion-justify-content-between ion-align-items-center ion-padding">
                                        <div>
                                            <ion-thumbnail style="height: 4rem; width: 4rem; margin: 0 auto">
                                                <ion-img  style="height: 100%" :src="`../img/subjects/sale/${item.value}.webp`"></ion-img>
                                            </ion-thumbnail>
                                        </div>
                                        <div class="ion-text-end">
                                            <ion-label>
                                                {{item.name}}
                                            </ion-label>
                                            <ion-text color="primary" style="font-size: 1.5rem">
                                                {{item.price}} {{currency}}
                                            </ion-text>
                                            <ion-label>
                                                {{ priceCalcType(item.costEstimation) }}
                                            </ion-label>
                                        </div>
                                    </ion-row>
                                </ion-grid>
                            </ion-card-content>
                        </ion-card>
                    </ion-item-group>
                    <br>
                    <br>
                </div>

                <!-- Прайс по доп.атрибутам -->
                <div v-if="dataLoaded && item.userAdditionalAttributes.length !== 0 && blockToShow === 'attributes'">
                    <ion-item-group class="ion-text-left ion-padding-horizontal ion-margin-bottom">
                        <ion-card class="ion-no-margin ion-margin-top relative" v-for="item in item.userAdditionalAttributes" :key="item.id" @click.stop="openProductInfo(item)">
                            <ion-card-content class="ion-no-padding">
                                <!-- Кнопка удалить конкретный атрибут продукта -->
                                <ion-icon @click.stop="openDeleteAttributeModal(item.uid)" class="icon_size icon_del absolute" :icon="closeCircleOutline"></ion-icon>
                                <!--  -->
                                <ion-grid>
                                    <!-- если products -->
                                    <ion-row v-if="blockToShow === 'products'" class="ion-justify-content-between ion-align-items-center ion-padding">
                                        <div>
                                            <ion-thumbnail style="height: 4rem; width: 4rem; margin: 0 auto">
                                                <ion-img  style="height: 100%" :src="`../img/subjects/sale/${item.value}.webp`"></ion-img>
                                            </ion-thumbnail>
                                        </div>
                                        <div class="ion-text-end">
                                            <ion-label>
                                                {{item.name}}
                                            </ion-label>
                                            <ion-text color="primary" style="font-size: 1.5rem">
                                                {{item.price}} {{currency}}
                                            </ion-text>
                                            <ion-label>
                                                {{ setRentType(item.rentType) }}
                                            </ion-label>
                                        </div>
                                    </ion-row>
                                    <!-- если attributes -->
                                    <ion-row v-if="blockToShow === 'attributes'" class="ion-justify-content-between ion-align-items-center ion-padding">
                                        <div>
                                            <ion-thumbnail style="height: 4rem; width: 4rem; margin: 0 auto">
                                                <ion-img  style="height: 100%" :src="`../img/subjects/sale/${item.value}.webp`"></ion-img>
                                            </ion-thumbnail>
                                        </div>
                                        <div class="ion-text-end">
                                            <ion-label>
                                                {{item.name}}
                                            </ion-label>
                                            <ion-text color="primary" style="font-size: 1.5rem">
                                                {{item.totalPrice}} {{currency}}
                                            </ion-text>
                                            <ion-label>
                                                {{ setRentType(item.rentType) }}
                                            </ion-label>
                                        </div>
                                    </ion-row>
                                </ion-grid>
                            </ion-card-content>
                        </ion-card>
                    </ion-item-group>
                    <br>
                    <br>
                </div>

                <!-- No data in current chip -->
                <div class="no-status-deal" v-if="item.userAdditionalAttributes.length === 0 && blockToShow === 'attributes' && item.userPriceList.length !== 0">
                    Добавьте доп атрибуты в прайс
                </div>
                <div class="no-status-deal" v-if="item.userAdditionalAttributes.length !== 0 && blockToShow === 'products' && item.userPriceList.length === 0">
                    Добавьте продукт в прайс
        
                </div>
            </div>
            <br>
            <br>
            <br>
            <!-- Всплывашка подтверждение удаления продукта из прайса листа пользователя -->
            <ion-action-sheet
                :is-open="deleteProductAction"
                header="Точно удалить?"
                :buttons="deleteProductButtons"
                @didDismiss="deleteProductAction = false"
            ></ion-action-sheet>
            <!-- Всплывашка подтверждение удаления атрибутов к продуктам из прайса листа пользователя -->
            <ion-action-sheet
                :is-open="deleteAttributeAction"
                header="Точно удалить?"
                :buttons="deleteAttributeButtons"
                @didDismiss="deleteAttributeAction = false"
            ></ion-action-sheet>

        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>
    import { defineComponent, onMounted, ref, watch } from 'vue';
    import { uid } from 'uid';
    //
    import store from '../store/index';
    //
    import Header from '../components/headers/Header.vue';
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '../components/NavigationMenu.vue';
    import CreatePriceProduct from '../components/modal/NewPriceProduct-modalCreate';
    import ViewPriceProduct from '../components/modal/ViewPriceProduct-modalViewProduct';
    import CreateButton from '../components/CreateButton.vue';
    import Footer from '../components/Footer.vue'
    //
    import { closeCircleOutline } from 'ionicons/icons'
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
        IonCard,
        IonCardHeader,
        IonCardContent,
        IonGrid,
        IonRow,
        IonItemSliding,
        IonItemOptions,
        IonItemOption,
        IonLabel, 
        IonActionSheet,
        IonModal,
        IonButtons,
        IonImg,
        IonThumbnail,
        IonChip
    } from '@ionic/vue';
    import { menu, trashOutline } from 'ionicons/icons';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    //
    import { setChipOutline } from '../helpers/setChip';
    //
    export default defineComponent({
        name: 'MyPrice',
        emits: [],
        components: {
            Header,
            NavigationMenu,
            Spinner,
            CreatePriceProduct,
            ViewPriceProduct,
            CreateButton,
            Footer,
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
            IonCard,
            IonCardHeader,
            IonCardContent,
            IonGrid,
            IonRow,
            IonItemSliding,
            IonItemOptions,
            IonItemOption,
            IonLabel,
            IonActionSheet,
            IonModal,
            IonButtons,
            IonImg,
            IonThumbnail,
            IonChip
        },
        setup(props, { emit }) {
            //
            const priceChipList = ref(store.state.priceChipList);
            //
            const blockToShow = ref('products');
            // Currency
            const currency = ref(store.state.systemCurrency.name);
            // Get user from store
            const user = computed(() => store.state.user);
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            // Setup ref to router
            const router = useRouter();
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const userSettings = ref(store.state.userSettings)
            //
            const spinner = ref(null);
            const dataLoaded = ref(null)
            //
            spinner.value = true;
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings
                spinner.value = false;
                dataLoaded.value = true;
            })

            // ==========================Управление current price product ================================================
            const currentProduct = ref();
            const currentProductPrice = ref() 
            const costEstimation = ref();
            //
            const isViewCurrentProductOpened = ref(false)
            const openProductInfo = (item) => {
                isViewCurrentProductOpened.value = true
                currentProduct.value = item;
                currentProductPrice.value = item.price
                console.log(item.price)
            }
            //
            const closeProductInfo = (productData) => {
                isViewCurrentProductOpened.value = false
                // console.log(productData)
                updateUserPriceListDB()
            }

            // ======================== Удаление конкретного продукта из прайса ===========================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteProductAction = ref(false);
            const deleteAttributeAction = ref(false)
            // Храним айди продукта к удалению
            const productToDelete = ref();
            const openDeleteProductModal = (id) => {
                productToDelete.value = id
                deleteProductAction.value = true;
            }
            const attributeToDelete = ref();
            const openDeleteAttributeModal = (id) => {
                attributeToDelete.value = id;
                deleteAttributeAction.value = true;
            }
            // Кнопка action sheet для подтверждения удаления
            const deleteProductButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteProduct(productToDelete.value);
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
            // Кнопка action sheet для подверждения удаления атрибута
            const deleteAttributeButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteAdditionalAttribute(attributeToDelete.value);
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
            // delete product
            const deleteProduct = (id) => {
                // console.log(id)
                userSettings.value[0].userPriceList = userSettings.value[0].userPriceList.filter(product => product.uid !== id);
                updateUserPriceListDB();
            }
            // delete additional attribute
            const deleteAdditionalAttribute = (id) => {
                // console.log(id)
                userSettings.value[0].userAdditionalAttributes = userSettings.value[0].userAdditionalAttributes.filter(attribute => attribute.uid !== id);
                updateUserPriceListDB();
            }
            // =============================== Добавление / Создание нового продукта к прайсу =================================
            const isModalNewPriceItemOpened = ref(false);
            // Изменяемый шаблон нового рецепты
            const newPriceProductData = ref({
                uid: uid(),
                value: '',
                name: '',
                price: 0,
                costEstimation: ''
            })
            // Изменяемый шаблон нового доп атрибута
            const newPriceAdditionalAttributeData = ref({
                uid: uid(),
                value: '',
                name: '',
                price: 0,
                totalPrice: 0,
                qty: 1,
                rentType: '',
                isReturned: '' 
            })
            //
            const toggleNewPriceProductModal = () => {
                isModalNewPriceItemOpened.value = !isModalNewPriceItemOpened.value;
                // Если выбрано
                if(blockToShow.value === 'products') {
                    newPriceProductData.value = {
                        uid: uid(),
                        value: '',
                        name: '',
                        price: 0,
                        costEstimation: ''
                    }
                } else if (blockToShow.value === 'attributes') {
                    newPriceProductData.value = {
                        uid: uid(),
                        value: '',
                        name: '',
                        price: 0,
                        totalPrice: 0,
                        qty: 1,
                        rentType: '',
                        isReturned: '' 
                    }
                }
            }
            // Уже добавлено
            const isItemAlreadyHave = ref();
            // Добавляем новый продукт к прайсу
            const addNewPriceProduct = (newProductData) => {
                // ищем в массиве продуктов в прайсе сходства
                //
                if(blockToShow.value === 'products') {
                    isItemAlreadyHave.value = userSettings.value[0].userPriceList.find(item => item.value === newProductData.value)
                } else if (blockToShow.value === 'attributes') {
                    isItemAlreadyHave.value = userSettings.value[0].userAdditionalAttributes.find(item => item.value === newProductData.value)
                }
                //
                if(newProductData.value === '') {
                    alert('My price: Вы не выбрали продукт')
                } else if (isItemAlreadyHave.value !== undefined) {
                    alert('My Price: Продукт уже добавлен в прайс')
                } else if (blockToShow.value === 'products' && newProductData.costEstimation === '') {
                    alert('My price: Вы не указали тип расчета')
                } else if (blockToShow.value === 'attributes' && newProductData.rentType === '') {
                    alert('My price: Вы не указали тип расчета')
                } else if (newProductData.qty === 0) {
                    alert('My price: Вы не указали количество')
                } else if (newProductData.price === '') {
                    alert('My price: Вы не указали стоимость')
                } else if (blockToShow.value === 'products') {
                    userSettings.value[0].userPriceList.push({
                        uid: uid(),
                        value: newProductData.value,
                        name: newProductData.name,
                        price: newProductData.price,
                        costEstimation: newProductData.costEstimation
                    })
                    isModalNewPriceItemOpened.value = false
                    updateUserPriceListDB()
                } else if (blockToShow.value === 'attributes') {
                    // isItemAlreadyHave = userSettings.value[0].userAdditionalAttributes.find(item => item.value === newProductData.value)
                    userSettings.value[0].userAdditionalAttributes.push({
                        uid: uid(),
                        value: newProductData.value,
                        name: newProductData.name,
                        price: newProductData.price,
                        qty: newProductData.qty,
                        totalPrice: newProductData.totalPrice,
                        rentType: newProductData.rentType,
                        isReturned: newProductData.isReturned 
                    })
                    isModalNewPriceItemOpened.value = false;
                    updateUserPriceListDB()
                }
            } 

            // ================================ Обновление записи в БД =================================
            const updateUserPriceListDB = async () => {
                try {
                    spinner.value = true;
                    console.log('DB is updated')
                    //
                    const { error } = await supabase.from('accountSettings').update({
                        userPriceList: userSettings.value[0].userPriceList,
                        userAdditionalAttributes: userSettings.value[0].userAdditionalAttributes
                    }).eq('id', userSettings.value[0].id)
                    if(error) throw error;
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                spinner.value = false;
            }
            // Переводчик типа расчета цены
            const priceCalcType = (type) => {
                if (type === 'perKilogram') {
                    return 'Цена за 1кг.'
                } else if (type === 'perUnit') {
                    return 'Цена за 1шт.'
                } 
                // else if (type === 'per100gram') {
                //     return 'Цена за 100г.'
                // }
            }
            // 
            const setCostEstimation = (costEstimation) => {
                currentProduct.value.costEstimation = costEstimation;
                updateUserPriceListDB()
            }
            //
            const setProductPrice = (price) => {
                if(blockToShow.value === 'products') {
                    currentProduct.value.price = price
                    updateUserPriceListDB()
                } else if (blockToShow.value === 'attributes') {
                    currentProduct.value.price = price
                    currentProduct.value.totalPrice = currentProduct.value.price * currentProduct.value.qty
                    updateUserPriceListDB()
                }
            }
            //
            const setProductQty = (qty) => {
                if(blockToShow.value === 'attributes') {
                    currentProduct.value.qty = qty
                    currentProduct.value.totalPrice = currentProduct.value.price * currentProduct.value.qty
                    updateUserPriceListDB()
                }
            }
            //
            const setNewProductQty = (qty) => {
                if(blockToShow.value === 'attributes') {
                    // console.log(qty)
                    newPriceProductData.value.qty = qty
                    newPriceProductData.value.totalPrice = newPriceProductData.value.qty * newPriceProductData.value.price 
                }
            }
            //
            const setNewProductPrice = (price) => {
                if(blockToShow.value === 'attributes') {
                    // console.log(price)
                    newPriceProductData.value.price = +price
                    newPriceProductData.value.totalPrice = newPriceProductData.value.qty * newPriceProductData.value.price 
                } else if (blockToShow.value === 'products') {
                    newPriceProductData.value.price = +price
                }
            }
            //
            const setNewProductAttributeRentType = (type) => {
                console.log(type)
                newPriceProductData.value.rentType = type
                if(type === 'sale') {
                    newPriceProductData.value.isReturned = ''
                } else if (type === 'rent') {
                    newPriceProductData.value.isReturned = false
                }
            }
            //
            const setAttributeRentType = (type) => {
                console.log(type)
                currentProduct.value.rentType = type;
                if(type === 'sale') {
                    currentProduct.value.isReturned = ''
                } else if (type === 'rent') {
                    currentProduct.value.isReturned = false
                }
                updateUserPriceListDB()
            }
            //
            const setBlockToShow = (to) => {
                if(to === 'products') {
                    blockToShow.value = 'products'
                } else if (to === 'attributes') {
                    blockToShow.value = 'attributes'
                }
            }
            // Счетчик количества items по конкретному разделу прайса
            const countItemChip = (chipValue) => {
                if(chipValue === 'products') {
                    return userSettings.value[0].userPriceList.length
                } else if (chipValue === 'attributes') {
                    return userSettings.value[0].userAdditionalAttributes.length
                }
            }
            //
            const setRentType = (rentType) => {
                if(rentType === 'rent') {
                    return 'Сдаю в аренду'
                } else if (rentType === 'sale') {
                    return 'Продаю'
                }
            }
            //
            const changeBlockToShow = (block) => {
                // console.log(blockToShow)
                if (block === 'products') {
                    // console.log(block)
                    blockToShow.value = 'products'
                    newPriceProductData.value = {
                        uid: uid(),
                        value: '',
                        name: '',
                        price: 0,
                        costEstimation: ''
                    }
                } else if (block === 'attributes') {
                    // console.log(block)
                    blockToShow.value = 'attributes'
                    newPriceProductData.value = newPriceAdditionalAttributeData.value
                }
            }

            const closeModalCreatePriceProduct = (value) => {
                isModalNewPriceItemOpened.value = false
                blockToShow.value = value
                if(blockToShow.value === 'products') {
                    newPriceProductData.value = {
                        uid: '',
                        value: '',
                        name: '',
                        price: 0,
                        costEstimation: ''
                    }
                } else if (blockToShow.value === 'attributes') {
                    newPriceProductData.value = {
                        uid: '',
                        value: '',
                        name: '',
                        price: 0,
                        totalPrice: 0,
                        qty: 1,
                        rentType: '',
                        isReturned: '' 
                    }
                }
            }

            return {
                priceChipList, blockToShow, menu, user, userEmail, router, pageTitle, userSettings, spinner, dataLoaded, trashOutline, deleteProductAction, openDeleteProductModal, openDeleteAttributeModal, deleteProductButtons, deleteAttributeButtons, productToDelete, attributeToDelete, deleteProduct, openProductInfo, updateUserPriceListDB, isViewCurrentProductOpened, currentProduct, isModalNewPriceItemOpened, addNewPriceProduct, toggleNewPriceProductModal, newPriceProductData, closeCircleOutline, currency, priceCalcType, costEstimation, setCostEstimation, setProductPrice, setProductQty, newPriceAdditionalAttributeData, deleteAdditionalAttribute, setBlockToShow, countItemChip, setChipOutline, setRentType, deleteAttributeAction, isItemAlreadyHave, changeBlockToShow, closeModalCreatePriceProduct, setAttributeRentType, setNewProductQty, setNewProductPrice, setNewProductAttributeRentType, closeProductInfo, currentProductPrice
            }
        }
    })
</script>

<style scoped>
    ion-img {
        height: 50vh;
    }
    .no-status-deal {
        height: 60vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .icon_size {
        font-size: 25px;
    }
    .icon_del {
        top: 0.3rem;
        left: 0.3rem;
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
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
    .no-data ion-img {
        width: 50%
    }

</style>