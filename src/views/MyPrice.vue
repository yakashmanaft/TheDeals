<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle" />

        <!-- Кнопка перехода к созданию нового дела -->
        <create-button @click="toggleNewPriceProductModal"/>

        <!-- Модалка просмотра конкретного продукта в прайсе -->
        <ViewPriceProduct
            :is-open="isViewCurrentProductOpened" 
            @closeModal="isViewCurrentProductOpened = false"   
            :productData="currentProduct"
            @getCostEstimation="setCostEstimation"
            @getProductPrice="setProductPrice"
        />

        <!-- Модалка создания нового продукта к прайсу -->
        <CreatePriceProduct
            :is-open="isModalNewPriceProductOpened" 
            @closeModal="isModalNewPriceProductOpened = false"   
            :newProductData="newPriceProductData"
            @addPriceProduct="addNewPriceProduct"
        />
        
        <!-- Page content -->
        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
        >
            <br>
            <br>
            <!-- page content -->
            <div v-for="(item, index) in userSettings" :key="index">
                <!-- No data -->
                <div v-if="!spinner && item.userPriceList.length === 0" class="no-status-deal ion-padding-horizontal">
                    <ion-img style="height: 30vh;" src="img/common/price-sticker.webp" alt="нет дел"></ion-img>
                    <ion-text color="primary"><h2>Ваш прайс пуст...</h2></ion-text>
                    <ion-text color="medium">Добавьте продукт</ion-text>
                </div>

                <!-- Data -->
                <div v-if="item.userPriceList.length !== 0">
                    <!-- Продуктовый прайс -->
                    <ion-item-group class="ion-text-left ion-padding-horizontal ion-margin-top">
                        <ion-text color="medium">
                            Кол-во позиций: {{item.userPriceList.length}}
                        </ion-text>
                    </ion-item-group>
                    <ion-item-group class="ion-text-left ion-padding-horizontal ion-margin-bottom">
                        <ion-card class="ion-no-margin ion-margin-top relative" v-for="item in item.userPriceList" :key="item.id" @click.stop="openSaleProductInfo(item)">
                            <ion-card-content class="ion-no-padding">
                                <!-- Кнопка удалить конкретный предмет дела -->
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
            </div>

            <!-- Всплывашка подтверждение удаления продукта из прайса листа пользователя -->
            <ion-action-sheet
                :is-open="deleteProductAction"
                header="Точно удалить?"
                :buttons="deleteProductButtons"
                @didDismiss="deleteProductAction = false"
            ></ion-action-sheet>

        </ion-content>
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
        IonThumbnail
    } from '@ionic/vue';
    import { menu, trashOutline } from 'ionicons/icons';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    //
    export default defineComponent({
        name: 'MyPrice',
        emits: [],
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
            NavigationMenu,
            IonItemGroup,
            IonCard,
            IonCardHeader,
            IonCardContent,
            Spinner,
            IonGrid,
            IonRow,
            IonItemSliding,
            IonItemOptions,
            IonItemOption,
            IonLabel,
            IonActionSheet,
            IonModal,
            IonButtons,
            CreatePriceProduct,
            ViewPriceProduct,
            CreateButton,
            IonImg,
            IonThumbnail
        },
        setup(props, { emit }) {
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
                // console.log(userSettings.value[0].id)
            })

            // ==========================Управление current price product ================================================
            const currentProduct = ref();
            const costEstimation = ref();
            //
            const isViewCurrentProductOpened = ref(false)
            const openSaleProductInfo = (item) => {
                isViewCurrentProductOpened.value = true
                currentProduct.value = item;
            }

            // ======================== Удаление конкретного продукта из прайса ===========================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteProductAction = ref(false);
            // Храним айди продукта к удалению
            const productToDelete = ref();
            const openDeleteProductModal = (id) => {
                productToDelete.value = id
                deleteProductAction.value = true;
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
            //
            const deleteProduct = (id) => {
                // console.log(id)
                userSettings.value[0].userPriceList = userSettings.value[0].userPriceList.filter(product => product.uid !== id);
                updateUserPriceListDB();
            }
            // =============================== Добавление / Создание нового продукта к прайсу =================================
            const isModalNewPriceProductOpened = ref(false);
            // Изменяемый шаблон нового рецепты
            const newPriceProductData = ref({
                uid: uid(),
                value: '',
                name: '',
                price: '',
                costEstimation: ''
            })
            //
            const toggleNewPriceProductModal = () => {
                isModalNewPriceProductOpened.value = !isModalNewPriceProductOpened.value;
                newPriceProductData.value = {
                    uid: uid(),
                    value: '',
                    name: '',
                    price: '',
                    costEstimation: ''
                }
            }
            // Добавляем новый продукт к прайсу
            const addNewPriceProduct = (newProductData) => {
                // ищем в массиве продуктов в прайсе сходства
                const isItemAlreadyHave = userSettings.value[0].userPriceList.find(item => item.value === newProductData.value)
                //
                if(newProductData.value === '') {
                    alert('My price: Вы не выбрали продукт')
                } else if (isItemAlreadyHave !== undefined) {
                    alert('My Price: Продукт уже добавлен в прайс')
                } else {
                    userSettings.value[0].userPriceList.push({
                        uid: uid(),
                        value: newProductData.value,
                        name: newProductData.name,
                        price: newProductData.price,
                        costEstimation: newProductData.costEstimation
                    })
                    isModalNewPriceProductOpened.value = false
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
                        userPriceList: userSettings.value[0].userPriceList
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
                    return 'Цена за кг.'
                } else if (type === 'perUnit') {
                    return 'Цена за шт.'
                }
            }
            // 
            const setCostEstimation = (costEstimation) => {
                currentProduct.value.costEstimation = costEstimation;
                updateUserPriceListDB()
            }
            //
            const setProductPrice = (price) => {
                currentProduct.value.price = price
                updateUserPriceListDB()
            }

            return {
                menu, user, userEmail, router, pageTitle, userSettings, spinner, dataLoaded, trashOutline, deleteProductAction, openDeleteProductModal, deleteProductButtons, productToDelete, deleteProduct, openSaleProductInfo, updateUserPriceListDB, isViewCurrentProductOpened, currentProduct, isModalNewPriceProductOpened, addNewPriceProduct, toggleNewPriceProductModal, newPriceProductData, closeCircleOutline, currency, priceCalcType, costEstimation, setCostEstimation, setProductPrice
            }
        }
    })
</script>

<style scoped>
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
</style>