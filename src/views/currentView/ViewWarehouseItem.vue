<template :key="componentKey">
    <!-- 
        Чайная ложка – 5 мл это примерно 5 грамм
        Десертная ложка — 10 мл жидкости — 10 грамм
        Столовая ложка — 15 мл жидкости — 15 грамм
        Щепотка – 2-4 грамма
    -->
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader 
            @openDeleteMenu="openDeleteMenu"
        />

        <!-- Кнопка вызова меню (добавить в позицию, вычесть из позиции) -->
        <CreateActionButton @click="isActionMenuOpened = true"/>

        <!-- Модалка добавления или вычитания количества из item -->
        <WarehouseAddSubstructItemQty
            :isOpen="isAddSubstructModalOpened"
            @closeModal="isAddSubstructModalOpened = false"
            :actionType="typeOfAction"
            :itemData="currentItem"
            :email="userEmail"
            :routeName="currentRoute"
        />

        <!-- page-content -->
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
            <!-- page-content -->
            <!-- No data -->
            <div>
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div>
                <!-- {{ currentItem }} -->

                <!-- Название предмета или сам предмет  -->
                <ion-item-group class="ion-padding-horizontal ion-text-left">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Предмет</h4>
                    </ion-text>

                    <!-- OFF режим редактирования -->
                    <!-- Название (Если НЕ тортодилер) -->

                    <!-- Название (Если тортодилер) -->
                    <ion-item lines="none" style="--inner-padding-end: none" class="ion-no-padding">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                <!--  -->
                                <ion-text color="medium">{{ currentItem.name }}</ion-text>
                                <!--  -->
                                <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                                    <ion-img :src="setImgSrc(currentItem.name)"></ion-img>
                                </ion-thumbnail>
                            </ion-row>
                        </ion-grid>
                    </ion-item>

                    <!-- ON режим редактирования -->
                    <!-- Название (Если НЕ тортодилер) -->

                </ion-item-group>

                <!-- Кол-во -->
                <ion-item-group class="ion-padding-horizontal ion-text-left">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Количество</h4>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">

                        <!--  -->
                        <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap">
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <span v-if="currentItem.estimationType === 'perKilogram'">в граммах</span>
                                <span v-if="currentItem.estimationType === 'perUnit'">шт.</span>
                                <!-- <span v-if="currentItem.estimationType === 'per100gram'">по 100 гр.</span> -->
                            </ion-button>

                            <!--  -->
                            <ion-text style="font-size: 1.3rem; font-weight: bold">{{ currentItem.subjectQty }}</ion-text>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- Категория -->
                <ion-item-group class="ion-padding-horizontal ion-text-left">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Категории</h4>
                    </ion-text>

                    <!--  -->
                    <ion-grid class="ion-no-padding">

                        <!-- Категории -->
                        <ion-chip v-for="(category, index) in currentItem.categories" :key="index" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" style="position: relative; overflow: visible">
                            {{ category }}
                            <!-- Кнопка удаления выбранной категории у предмета -->
                            <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium" @click.stop="openDeleteCategoryModal(category)"></ion-icon>
                        </ion-chip>

                        <!-- Кнопка добавления категории -->
                        <ion-chip v-if="currentItem.categories.length < 3" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" outline="true" @click.stop="searchWarehouseCategoriesMenu = true">Добавить</ion-chip>
                    </ion-grid>
                </ion-item-group>

                <!-- Всплывашка подтверждение удаления предмета-->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Вы хотите удалить предмет?"
                    @didDismiss="isOpenRef = false"
                    :buttons="deleteWarehouseItemButtons"
                ></ion-action-sheet>

                <!-- Всплывашка подтверждения удаления категории у предмета -->
                <ion-action-sheet
                    :isOpen="deleteCategory"
                    header="Удалить категорию"
                    :buttons="deleteCategoryButtons"
                    @didDismiss="deleteCategory = false"
                ></ion-action-sheet>

                <!-- Модалка по выбору / поиску категорий -->
                <ion-modal :isOpen="searchWarehouseCategoriesMenu">
                    <ion-searchbar
                        class="ion-text-left"
                        placeholder="Поиск..."
                        v-model="searchWarehouseCategories"
                        show-cancel-button="always"
                        cancelButtonText="Отменить"
                        @ionCancel="searchWarehouseCategoriesMenu = false" 
                    ></ion-searchbar>
                    <!--  -->
                    <ion-content style="height: 90vh">
                        
                        <!-- Если есть данные -->
                        <ion-item v-for="(category) in searchedhWarehouseCategories" :key="category.id" @click="choosenCategory(category)">
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>{{ category }}</ion-text>
                                </ion-row>
                            </ion-grid>
                        </ion-item>

                        <!-- Если ничего подходящего нет или нет данных -->
                        <div v-if="searchedhWarehouseCategories.length <= 0" class="ion-margin-top ion-margin-horizontal">
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text color="medium">
                                        Ничего не найдено
                                    </ion-text>
                                    <!-- <ion-text color="primary" @click="addNewCategory">
                                        Добавить
                                    </ion-text> -->
                                </ion-row>
                            </ion-grid>
                        </div>
                    </ion-content>
                </ion-modal>
            </div>

        </ion-content>
        
        <!-- меню выбор действий (добвить, вычесть)-->
        <ion-action-sheet
            :isOpen="isActionMenuOpened"
            :buttons="actionMenuButtons"
            header="Выберите нужное действие"
            @didDismiss="isActionMenuOpened = false"
        ></ion-action-sheet>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { supabase } from '../../supabase/init';
    import store from '../../store/index';
    //
    import { IonContent, IonItemGroup, IonButton, IonActionSheet, IonText, IonItem, IonThumbnail, IonImg, IonGrid, IonRow, IonChip, IonModal,  IonSearchbar, IonIcon } from '@ionic/vue';
    import { closeCircleOutline } from 'ionicons/icons'
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import CreateActionButton from '../../components/CreateActionButton.vue';
    import WarehouseAddSubstructItemQty from '../../components/modal/WarehouseAddSubstructItemQty.vue';
    //
    import { searchWarehouseCategoryFilter } from '../../helpers/filterWarehouseCategories';
    import { sortAlphabeticallyWarhouseItem } from '../../helpers/sortDealSubject';

    export default defineComponent({
        name: 'View-warehouse-item',
        components: {
            ViewHeader, Spinner, CreateActionButton, WarehouseAddSubstructItemQty,
            //
            IonContent, IonItemGroup, IonButton, IonActionSheet, IonText, IonItem, IonThumbnail, IonImg, IonGrid, IonRow, IonChip, IonModal, IonSearchbar, IonIcon
        },
        setup () {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.itemId;
            const info = route.params;

            const currentItem = ref(JSON.parse(info.item))
            //
            const userEmail = ref(store.state.userEmail)
            const userSettings = ref(store.state.userSettings)
            // console.log(userEmail.value)
            const currentRoute = router.currentRoute._value.name
            //
            const spinner = ref(null);
            //
            // Массив пользователя с вариантам категорий для предметов на складе
            const userWarehouseCategories = ref();

            onMounted(async () => {
                await store.methods.getUserSettingsfromDB()
                userSettings.value = store.state.userSettings;
                //
                userWarehouseCategories.value = userSettings.value[0].userWarehouseCategories
            })
            
            // Подгружаем картинку в название предмета
            const setImgSrc = (itemName) => {
                let dealBuySubjectArray = store.state.dealBuySubjectArray;
                let value;
                dealBuySubjectArray.filter(item => {
                    if(item.name === itemName) {
                        value = item.value
                    }
                })
                return `../img/subjects/buy/${value}.webp`
            }

            //
            const isOpenRef = ref(false)
            const openDeleteMenu = () => {
                isOpenRef.value = true
            }
            const deleteWarehouseItemButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCurrentItem()
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            const deleteCurrentItem = async () => {
                // console.log(currentId)
                try {
                    makeSubstructRecordInLedgerWarehouse(currentItem.value)
                    const { error } = await supabase.from('userWarehouse').delete().eq('id', currentId)
                    if(error) throw error
                    // router.push({ name: 'Warehouse' })
                    router.go(-1)
                    alert('Wiew Warehouse: Предмет удален со склада')
                } catch (error) {
                    // Удалить если не понадобится
                    // alert(`Error: ${error.message}`)
                }
            }

            // Делаем запись о вычитании в warehouse ledger
            const makeSubstructRecordInLedgerWarehouse = async (item) => {
                try{
                    const { error } = await supabase.from('ledgerWarehouse').insert([{
                        itemID: item.id,
                        uid: item.uid,
                        estimationType: item.estimationType,
                        actionType: 'substract',
                        qty: item.subjectQty,
                        userEmail: userEmail.value,
                        tempName: item.name
                    }])
                    if(error) throw error
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }

            // Для action menu в кнопке CreateActionButton
            const isActionMenuOpened = ref(false)
            const typeOfAction = ref()
            const actionMenuButtons = [
                {
                    text: 'Добавить к позиции',
                    handler: () => {
                        isAddSubstructModalOpened.value = true
                        typeOfAction.value = 'добавить'
                    }
                },
                {
                    text: 'Вычесть из позиции',
                    handler: () => {
                        isAddSubstructModalOpened.value = true
                        typeOfAction.value = 'вычесть'
                    }
                },
                {
                    text: 'Закрыть',
                    role: 'cancel',
                    data: {
                        action: 'cancel'
                    }
                }
            ]

            // =================== РАБОТА С ДОБАВЛЕНИЕМ ВЫЧИТАНИЕМ КОЛИЧЕСТВА В ITEM ====================
            const isAddSubstructModalOpened = ref(false)

            // =================== РАБОТА С КАТЕГОРИЯМИ ПРЕДМЕТА ========================================
            const searchWarehouseCategoriesMenu = ref(false)
            const searchWarehouseCategories = ref('')
            // Пользовательские категории
            const searchedhWarehouseCategories = computed(() => {
                const sortedWarehouseCategoriesArray = sortAlphabeticallyWarhouseItem(userWarehouseCategories.value)
                return searchWarehouseCategoryFilter(sortedWarehouseCategoriesArray, searchWarehouseCategories.value)
            })
            // Проверяем добавлена уже категория или нет
            const isCategoryAlreadyAdded = ref();
            // Переменная для категории к добавлению
            const newCategory = ref()
            const choosenCategory = async (category) => {
                isCategoryAlreadyAdded.value = currentItem.value.categories.find(item => item === category)
                if(isCategoryAlreadyAdded.value !== undefined) {
                    alert('ViewWarehouseItem: категория уже добавлена к предмету')
                } else {
                    searchWarehouseCategories.value = ''
                    searchWarehouseCategoriesMenu.value = false
                    newCategory.value = category
                    // console.log(newCategory.value)
                    currentItem.value.categories.push(newCategory.value)
                }
                //
                spinner.value = true;
                try {
                    const { error } = await supabase.from('userWarehouse').update({
                        categories: currentItem.value.categories
                    }).eq('id', info.itemId);
                    if(error) throw error;
                    spinner.value = false;
                    // Предмет успешно обновлен
                } catch(error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            // ========================================= Удаление категорий у предмета =========================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteCategory = ref(false);
            // Храним категорию предмета к удалению
            const categoryToDelete = ref();
            // удаляем current category в предмете (обнолвений в БД здесь не производится)
            const openDeleteCategoryModal = (category) => {
                if(currentItem.value.categories.length === 1) {
                    alert('ViewWarehouseItem: должна быть указана хотя бы одна категория')
                } else {
                    categoryToDelete.value = category;
                    deleteCategory.value = true
                }
            }
            const deleteCategoruFunc = async (category) => {
                currentItem.value.categories = currentItem.value.categories.filter(item => item !== category)
                //
                spinner.value = true;
                try {
                    const { error } = await supabase.from('userWarehouse').update({
                        categories: currentItem.value.categories
                    }).eq('id', info.itemId)
                    if(error) throw error;
                    spinner.value = false;
                    // Предмет успешно обновлен
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }
            //
            const deleteCategoryButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCategoruFunc(categoryToDelete.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]

            return {
                route, router, spinner, currentId, info, currentItem, openDeleteMenu, isOpenRef, deleteWarehouseItemButtons, setImgSrc, isActionMenuOpened, actionMenuButtons, isAddSubstructModalOpened, typeOfAction, userEmail, currentRoute, makeSubstructRecordInLedgerWarehouse, searchWarehouseCategoriesMenu, searchWarehouseCategories, searchedhWarehouseCategories, isCategoryAlreadyAdded, newCategory, choosenCategory, userWarehouseCategories, userSettings, deleteCategory, categoryToDelete, openDeleteCategoryModal, deleteCategoruFunc, deleteCategoryButtons, closeCircleOutline
            }
        }
    })
</script>

<style scoped>
    .thumbnail_deal-subject {
        height: 64px;
        min-width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        padding: 0.5rem;
    }
</style>