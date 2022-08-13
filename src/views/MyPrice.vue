<template>
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
            <!-- No data -->
            <div v-if="(!dataLoaded || userSettings.length === 0) && !spinner">
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && userSettings.length !== 0">
                <div v-for="(item, index) in userSettings" :key="index">
                    <!-- Продуктовый прайс -->
                    <ion-item-group class="ion-text-left ion-padding-horizontal">
                        <ion-card class="ion-no-margin ion-margin-top" v-for="(item, idx) in item.userPriceList" :key="item.id" @click.stop="openSaleProductInfo(item)">
                            <ion-card-content class="ion-no-padding">
                                <!-- User Product -->
                                <ion-item-sliding>
                                    <ion-item lines="none" class="ion-no-padding">
                                        <div class="ion-padding">
                                            {{ item }}
                                        </div>
                                    </ion-item>
                                    <ion-item-options>
                                        <ion-item-option color="danger" @click.stop="openDeleteProductModal(item.id)">
                                            <ion-icon slot="start" :icon="trashOutline"></ion-icon>
                                        </ion-item-option>
                                    </ion-item-options>
                                </ion-item-sliding>
                            </ion-card-content>
                        </ion-card>
                    </ion-item-group>
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
</template>

<script>
    import { defineComponent, onMounted, ref } from 'vue';
    import { uid } from 'uid';
    //
    import Header from '../components/headers/Header.vue';
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '../components/NavigationMenu.vue';
    import CreatePriceProduct from '../components/modal/NewPriceProduct-modalCreate';
    import ViewPriceProduct from '../components/modal/ViewPriceProduct-modalViewProduct';
    import CreateButton from '../components/CreateButton.vue';
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
        IonButtons
    } from '@ionic/vue';
    import { menu, trashOutline } from 'ionicons/icons';
    import store from '../store/index';
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
            CreateButton
        },
        setup(props, { emit }) {
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
            //
            const isViewCurrentProductOpened = ref(false)
            const openSaleProductInfo = (item) => {
                // console.log(`opened: ${item.value} ${item.id}`)
                isViewCurrentProductOpened.value = true
                currentProduct.value = item
            }

            // ======================== Удаление конкретного продукта из прайса ===========================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteProductAction = ref(false);
            // Храним айди продукта к удалению
            const productToDelete = ref();
            // Кнопка action sheet для подтверждения удаления
            const deleteProductButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteProduct(productToDelete.value)
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
            const openDeleteProductModal = (id) => {
                productToDelete.value = id
                deleteProductAction.value = true
            }
            //
            const deleteProduct = (id) => {
                console.log(id)
                userSettings.value[0].userPriceList = userSettings.value[0].userPriceList.filter(product => product.id !== id);
                updateUserPriceListDB();
                console.log(userSettings.value[0].userPriceList)
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
                if(newProductData.value === '') {
                    alert('My price: Вы не выбрали продукт')
                } else {
                    userSettings.value[0].userPriceList.push({
                        uid: uid(),
                        value: newProductData.value,
                        name: newProductData.name,
                        price: '',
                        costEstimation: ''
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

            return {
                menu, user, userEmail, router, pageTitle, userSettings, spinner, dataLoaded, trashOutline, deleteProductAction, openDeleteProductModal, deleteProductButtons, deleteProduct, openSaleProductInfo, updateUserPriceListDB, isViewCurrentProductOpened, currentProduct, isModalNewPriceProductOpened, addNewPriceProduct, toggleNewPriceProductModal, newPriceProductData
            }
        }
    })
</script>

<style scoped>

</style>