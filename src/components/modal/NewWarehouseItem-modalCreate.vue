<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeThisModal">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createItem', itemData)">Готово</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" forceOverscroll="false">
            <!-- ============================= Основные данные ===================================== -->
            {{ itemData }}

            <!-- Название предмета или сам предмет  -->
            <ion-item-group class="ion-padding-bottom">
                <!-- Заголовок -->
                <ion-text>
                    <h4>Предмет</h4>
                </ion-text>
                <!-- название вписывать если НЕ Тортодилер -->
                <ion-input
                    v-if="userWorkProfile !== 'Тортодилер'"
                    type="text"
                    v-model="itemName"
                    placeholder="Укажите название предмета"
                    autocapitalize="on"
                ></ion-input>
                <!-- Предмет, если Тортодилер -->
                <div v-else>
                    <ion-item lines="none" class="ion-no-padding">
                        <!-- Если ничего не было выбрано -->
                        <ion-text 
                            v-if="itemData.name === ''"
                            color="primary" 
                            style="border-bottom: 1px dashed var(--ion-color-primary)"
                            @click.stop="searchWarehouseItemMenu = true"
                        >Выберите из списка</ion-text>
                        <!-- Если предмет был указан -->
                        <ion-grid v-else class="ion-no-padding">
                            <ion-row @click.stop="searchWarehouseItemMenu = true" class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                <!--  -->
                                <ion-text color="primary">{{ itemData.name }}</ion-text>
                                <!--  -->
                                <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                                    <ion-img :src="setImgSrc(itemData.name)"></ion-img>
                                </ion-thumbnail>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-item-group>

            <!-- Каталожный номер (если НЕ Тортодилер)-->
            <ion-item-group v-if="userWorkProfile !== 'Тортодилер'" >
                <!-- Заголовок -->
                <ion-text>
                    <h4>Каталожный номер (Артикул)</h4>
                </ion-text>
                <!--  -->
                <ion-input
                    type="text"
                    v-model="catalogNumber"
                    placeholder="Укажите каталожный номер"
                ></ion-input>
            </ion-item-group>

            <!-- Кол-во -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Кол-во</h4>
                </ion-text>
                <!--  -->
                <ion-grid class="ion-no-padding">
                    <!--  -->
                    <ion-row v-if="userWorkProfile === 'Тортодилер'" class="ion-justify-content-between ion-align-items-center">
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Тип расчета
                        </ion-button>

                        <ion-button color="primary" size="large" fill="clear" class="ion-no-padding ion-no-margin">
                            <Select
                                :data="priceEstimationType"
                                placeholder="Не выбран"
                                @date-updated="(selected) => itemEstimationType = selected.currentValue"
                            />
                        </ion-button>
                    </ion-row>

                    <ion-row v-if="itemData.estimationType !== ''" class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap">

                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Количество 
                                <span v-if="itemData.estimationType === 'perKilogram'">(в граммах)</span>
                                <span v-if="itemData.estimationType === 'perUnit'">(шт.)</span>
                                <span v-if="itemData.estimationType === 'per100gram'">(по 100 гр.)</span>
                            </ion-button>

                            <!-- perUnit -->
                            <div v-if="itemData.estimationType === 'perUnit' || itemData.estimationType === 'per100gram'" style="display: flex; align-items: center;">
                                <!-- Substract -->
                                <ion-icon :icon="removeCircleOutline" class="countQty_button" :color="itemData.subjectQty > 1 ? 'primary' : 'light'" @click="changeSubjectQty('sub')"></ion-icon>
                                <!-- Qty -->
                                <ion-text class="ion-margin-horizontal countQty_count" color="primary">{{ itemData.subjectQty }}</ion-text>
                                <!-- Add -->
                                <ion-icon :icon="addCircleOutline" class="countQty_button" color="primary" @click="changeSubjectQty('add')"></ion-icon>
                            </div>

                            <!-- perKilogram -->
                            <div v-if="itemData.estimationType === 'perKilogram'">
                                <ion-input placeholder="Не указано" v-model="itemData.subjectQty" color="primary" class="ion-text-end ion-no-padding" style="font-size: 1.3rem; font-weight: bold" @ionChange="setPerKilogramValue(itemData.subjectQty)" inputmode="decimal"></ion-input>
                            </div>
                    </ion-row>
                </ion-grid>
            </ion-item-group>

            <!-- Категория предмета -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Категории предмета</h4>
                </ion-text>
                <!--  -->
                <ion-grid class="ion-no-padding">

                    <!-- Добавленная категория -->
                    <ion-chip v-for="category, index in itemData.categories" :key="index" class="ion-no-margin ion-margin-top ion-margin-end" color="primary" style="position: relative; overflow: visible">
                        {{ category }}
                        <!-- Кнопка удалить выбранную категорию у предмета -->
                        <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium" @click.stop="openDeleteCategoryModal(category)"></ion-icon>
                    </ion-chip>

                    <!-- Кнопка добавить категорию -->
                    <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" outline="true" @click.stop="searchWarehouseCategoriesMenu = true">Добавить</ion-chip>

                </ion-grid>

                <!-- Всплывашка подтверждение удаления категории предмета -->
                <ion-action-sheet
                    :isOpen="deleteCategory"
                    header="Удалить категорию"
                    :buttons="deleteCategoryButtons"
                    @didDismiss="deleteCategory = false"
                ></ion-action-sheet>
            </ion-item-group>

            <!-- Модалка по выбору / поиску категорий  -->
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
                    <!-- <ion-item lines="none" @click="addNewCategory" v-if="searchedhWarehouseCategories.length > 0">
                        <ion-text color="primary">
                            Добавить категорию
                        </ion-text>
                    </ion-item> -->

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
            
            <!-- Модалка по выбору / поиску предмета -->
            <SearchDealBuySubject 
                :isOpen="searchWarehouseItemMenu"
                @closeModal="searchWarehouseItemMenu = false"
                :properties="'warehouseSuitable'"
                @addItem="addItemToCurrentElement"
            />
        </ion-content>
    </ion-modal>
</template>

<script>
import { defineComponent, ref, computed, watch, watchEffect, onMounted  } from "vue";
//
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput, IonGrid, IonRow, IonIcon, IonChip, IonSearchbar, IonItem, IonActionSheet, IonImg, IonThumbnail } from "@ionic/vue";
import { removeCircleOutline, addCircleOutline, closeCircleOutline } from 'ionicons/icons'
//
import { searchWarehouseCategoryFilter } from '../../helpers/filterWarehouseCategories';
import { sortAlphabeticallyWarhouseItem } from "../../helpers/sortDealSubject";
//
import Select from '../Select.vue'
import SearchDealBuySubject from '../modal/SearchDealBuySubject.vue'
//
import store from '../../store/index';
// import { uid } from 'uid';
// import { supabase } from '../../supabase/init';

    export default defineComponent({
        name: 'CreateItem',
        emits: ['closeModal'],
        props: {
            itemData: Object
        }, 
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput, IonGrid, IonRow, IonIcon, IonChip, IonSearchbar, IonItem, IonActionSheet, IonImg, IonThumbnail,
            //
            Select, SearchDealBuySubject
        }, 
        setup (props, { emit }) {
            //
            const itemData = ref();
            const itemName = ref('')
            const catalogNumber = ref();
            const itemEstimationType = ref();
            // Массив пользователя с вариантам категорий для предметов на складе
            const userWarehouseCategories = ref();
            const userSettings = ref(store.state.userSettings)
            const priceEstimationType = ref(store.state.priceEstimataionType)
            const userWorkProfile = ref(userSettings.value[0].userWorkProfile)
            //
            onMounted( async () => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings;
                //
                userWarehouseCategories.value = userSettings.value[0].userWarehouseCategories
                // console.log(userWorkProfile.value)
            })
            //
            watch(itemName, () => {
                itemData.value.name = itemName.value
            })
            //
            watch(catalogNumber, () => {
                itemData.value.catalogNumber = catalogNumber.value
            })
            //
            watch(itemEstimationType, () => {
                itemData.value.estimationType = itemEstimationType.value;
                if(itemEstimationType.value === 'perKilogram') {
                    itemData.value.subjectQty = 0
                } else {
                    itemData.value.subjectQty = 1
                }
            })
            //
            const closeThisModal = () => {
                emit('closeModal', 
                    itemName.value = '',
                    catalogNumber.value = ''
                )
            }
            //
            // const countSubjectQtyButtonColor = ref('primary')
            const changeSubjectQty = (action) => {
                if(action === 'sub' && itemData.value.subjectQty > 1) {
                    itemData.value.subjectQty--
                } else if (action === 'add') {
                    itemData.value.subjectQty++
                }
            }
            //
            const searchWarehouseCategoriesMenu = ref(false)
            const searchWarehouseCategories = ref('')
            // ПОЛЬЗОВАТЕЛЬСКИЕ КАТЕГОРИИ
            const searchedhWarehouseCategories = computed(() => {
                const sortedWarehouseCategoriesArray = sortAlphabeticallyWarhouseItem(userWarehouseCategories.value)
                return searchWarehouseCategoryFilter(sortedWarehouseCategoriesArray, searchWarehouseCategories.value)
            })
            //
            const addNewCategory = () => {
                alert('NewWarehouseItem-modalCreate: функционал в разработке (addNewCategory)')
            }
            // Проверяем добавлена уже категория к предмету или нет
            const isCategoryAlreadyAdded = ref();
            // Переменная для категории к добавлению
            const newCategory = ref()
            const choosenCategory = (category) => {
                isCategoryAlreadyAdded.value = itemData.value.categories.find(item => item === category)
                if(isCategoryAlreadyAdded.value !== undefined) {
                    alert('NewWarehouseItem-modalCreate: категория уже добавлена к предмету')
                } else {
                    searchWarehouseCategories.value = ''
                    searchWarehouseCategoriesMenu.value = false
                    // newCategory.value = {
                    //     name: category.name
                    // }
                    newCategory.value = category
                    console.log(newCategory.value)
                    itemData.value.categories.push(newCategory.value)
                }
            }
            // ============================ Удаление категории у предмета ===============================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteCategory = ref(false);
            // Храним категорию предмета к удалению
            const categoryToDelete = ref();
            // Кнопка action sheet для подтверждения удаления
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
            //удаляем current category в предмете (обнолвений в БД здесь не производится)
            const openDeleteCategoryModal = (category) => {
                categoryToDelete.value = category;
                deleteCategory.value = true
            }
            const deleteCategoruFunc = (category) => {
                itemData.value.categories = itemData.value.categories.filter(item => item !== category)
            }
            // преобрзауем значение количества в perKilogram
            const setPerKilogramValue = (inputValue) => {
                itemData.value.subjectQty = +inputValue
            }
            // ======================= поиск / создание предмета на склад ====================
            const searchWarehouseItemMenu = ref(false)
            const addItemToCurrentElement = (item) => {
                itemData.value.name = item.name;
                searchWarehouseItemMenu.value = false;
            }
            //
            const setImgSrc = (recipeName) => {
                let dealBuySubjectArray = store.state.dealBuySubjectArray
                let ingredientValue;
                dealBuySubjectArray.filter(item => {
                    if(item.name === recipeName ) {
                        ingredientValue = item.value
                    }
                })
                // console.log(ingredientValue) 
                return `../img/subjects/buy/${ingredientValue}.webp`
            }
            //
            watchEffect(() => {
                itemData.value = props.itemData
            }) 

            return {
                itemData, itemName, catalogNumber, closeThisModal, removeCircleOutline, addCircleOutline, changeSubjectQty, closeCircleOutline, searchWarehouseCategoriesMenu, searchWarehouseCategories, addNewCategory, searchedhWarehouseCategories, userWarehouseCategories, userSettings, choosenCategory, newCategory, isCategoryAlreadyAdded, openDeleteCategoryModal, deleteCategory, categoryToDelete, deleteCategoryButtons, deleteCategoruFunc, priceEstimationType, userWorkProfile, setPerKilogramValue, itemEstimationType, searchWarehouseItemMenu,  addItemToCurrentElement, setImgSrc
            }
        }
    })
</script>

<style scoped>
    .countQty_button {
        font-size: 32px;
    }
    .countQty_count {
        font-size: 24px;
    }
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