<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Просмотр</ion-title>
                <!-- <ion-buttons slot="end">
                    <ion-button>Готово</ion-button>
                </ion-buttons> -->
            </ion-toolbar>
        </ion-header>
        <ion-content>
            {{currentDealType}}
            {{subjectData}}
            <!-- ================ Добавленный продукт ======================== -->

            <!-- Если продукт есть (продажа, закуп) -->
            <ion-item-group v-if="subjectData.selectedProduct" class="ion-padding-horizontal">
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Продукт</h4>
                </ion-text>
                <!-- Показываем текущий продукт -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Название текущего продукта -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            {{ translateProductValue(subjectData.selectedProduct) }}
                        </ion-button>
                        <!-- Иконка к текущему продукту -->
                        <ion-thumbnail v-if="subjectData.selectedProduct !== '' && currentDealType === 'sale'" class="thumbnail_deal-subject">
                            <ion-img :src="`../img/subjects/sale/${subjectData.selectedProduct}.webp`"></ion-img>
                        </ion-thumbnail>
                        <ion-thumbnail v-if="subjectData.selectedProduct !== '' && currentDealType === 'buy'" class="thumbnail_deal-subject">
                            <ion-img :src="`../img/subjects/buy/${subjectData.selectedProduct}.webp`"></ion-img>
                        </ion-thumbnail>
                    </ion-row>
                </ion-grid>
            </ion-item-group>

            <!-- Если продукта нет (Атрибут) -->
            <ion-item-group v-else>
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Доп. Атрибут</h4>
                </ion-text>
                <!-- Показываем текущий доп. атрибут -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Название текущего доп. атрибуту -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            {{ subjectData.name }}
                        </ion-button>
                        <!-- Иконка к текущему доп. атрибуту -->
                        <ion-thumbnail class="thumbnail_deal-subject">
                            <ion-img :src="`../img/subjects/sale/${subjectData.value}.webp`"></ion-img>
                        </ion-thumbnail>
                    </ion-row>
                </ion-grid>
            </ion-item-group>

            <!-- ================  Показываем в зависимости от выбранного типа дела ==============-->
            <!-- Если ПРОДАЖА -->
            <div v-if="currentDealType === 'sale' && subjectData.additionalAttributes">

                <!-- РЕЦЕПТ -->
                <ion-item-group>
                    <!-- Подбираем рецепт к делу -->
                    <ion-text>
                        <h4 class="ion-no-margin ion-margin-top">Рецепт</h4>
                    </ion-text>
                    <!-- Показ и кнопка изменения рецепта к предмету -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">{{ showSelectedRecipe(subjectData.recipe) }}</ion-button>
                            <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchRecipeMenu = true">
                                Изменить
                            </ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- Модалка для выбор (Выбор / поиск рецепта для предмета) -->
                    <ion-modal :isOpen="searchRecipeMenu">
                        <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchRecipe" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchRecipeMenu = false">
                        </ion-searchbar>
                        <ion-content style="height: 90vh">
                            <!-- Если не хотим указывать рецепт -->
                            <ion-item v-if="searchedRecipe.length > 0" @click="chooseRecipe(noRecipe)">Без рецепта</ion-item>
                            <!-- Выбираем из списка рецептов ПОЛЬЗОВАТЕЛЯ -->
                            <ion-item v-for="recipe in searchedRecipe" :key="recipe.id" @click="chooseRecipe(recipe)">
                                {{ recipe.name }}
                            </ion-item>
                            <!-- Если ничего подходящего нету -->
                            <!-- Создать свой или купить на маркете -->
                            <div v-if="searchedRecipe.length <= 0">
                                <ion-item lines="none">
                                    <ion-grid>
                                        <ion-row class="ion-justify-content-between ion-align-items-center">
                                            <ion-text color="medium">
                                                Ничего не найдено
                                            </ion-text>
                                            <ion-text color="primary">
                                                Добавить
                                            </ion-text>
                                            <ion-text>
                                                Купить рецепт
                                            </ion-text>
                                        </ion-row>
                                    </ion-grid>
                                </ion-item>
                            </div>
                        </ion-content>
                    </ion-modal>
                </ion-item-group>

                <!-- АТРИБУТЫ -->
                <ion-item-group class="ion-margin-top">
                    <!-- Заголовок -->
                    <ion-text>
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-align-items-center ion-justify-content-between ion-padding-horizontal">
                                <h4 class="ion-no-margin">Атрибуты к предмету</h4>
                                <ion-text color="primary">Всего {{ subjectData.additionalAttributes.length }}</ion-text>
                            </ion-row>
                        </ion-grid>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-nowrap horizontal-scroll">
                            <!-- Карточки attribute -->
                            <ion-card @click.stop="openCurrentSubjectAttribute(index)" class="ion-padding ion-text-center card-center relative" v-for="(attribute, index) in subjectData.additionalAttributes" :key="attribute.id">
                                <!-- Кнопка удалить конкретный атрибут у предмета -->
                                <ion-icon class="icon_size icon_del absolute" :icon="closeCircleOutline" @click.stop="openDeleteAttributeModal(attribute)"></ion-icon>
                                <!-- attribute img-->
                                <ion-thumbnail class="relative">
                                    <ion-img style="height: 100%" :src="`../img/subjects/sale/${attribute.value}.webp`"></ion-img>
                                </ion-thumbnail>
                            </ion-card>
                            <!-- Открываем меню создания предмета к делу -->
                            <ion-card class="ion-padding card-center card-add" @click.stop="searchAttributeMenu = true">
                                <ion-icon :icon="addOutline" color="primary" class="icon_size"></ion-icon>
                            </ion-card>
                        </ion-row>
                    </ion-grid>
                    <!-- Всплывашка подтверждение удаления предмета заказа -->
                    <ion-action-sheet
                        :is-open="deleteAttribute"
                        header="Точно удалить?"
                        :buttons="deleteSubjectAttributeButtons"
                        @didDismiss="deleteAttribute = false"
                    >
                    </ion-action-sheet>
                </ion-item-group>

                <!-- модалка просмотра уже добавленного атрибута -->
                <ViewDealSubject 
                    :isOpen="isViewSubjectAttributeOpened"
                    @closeModal="isViewSubjectAttributeOpened = false"
                    :subjectData="currentSubjectAttribute"
                    :currentDealType="currentDealType"
                />

                <!-- Модалка по выбору / поиску атрибутов в прайсе пользователя -->
                <ion-modal :isOpen="searchAttributeMenu">
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchAdditionalAttributes" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchAttributeMenu = false"></ion-searchbar>
                    <!--  -->
                    <ion-content style="height: 90vh">
                        <ion-item v-for="attribute in searchedAdditionalAttributes" :key="attribute.id" @click="chooseAttribute(attribute)">
                            {{ attribute.name }}
                            {{ attribute.price }}
                            ({{ systemCurrency.name }})
                        </ion-item>
                        <!-- Если ничего подхлдящего нет, создать свое надо -->
                        <div v-if="searchedAdditionalAttributes.length <= 0">
                            <ion-item lines="none">
                                <ion-grid>
                                    <ion-row class="ion-justify-content-between ion-align-items-center">
                                        <ion-text color="medium">
                                            Ничего не найдено
                                        </ion-text>
                                        <ion-text color="primary">
                                            Добавить
                                        </ion-text>
                                    </ion-row>
                                </ion-grid>
                            </ion-item>
                        </div>
                    </ion-content>
                </ion-modal>

                <!--  -->
            </div>
            <!-- Если ЗАКУП -->
            <div v-if="currentDealType === 'buy'">
                <!-- product price -->
                <ion-item-group >
                    <ion-text>
                        <h4>Стоимость приобретения</h4>
                    </ion-text>
                </ion-item-group>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, computed, ref, watchEffect, onMounted } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonSearchbar, IonItem, IonGrid, IonRow, IonThumbnail, IonImg, IonToggle, IonCard, IonIcon, IonActionSheet } from '@ionic/vue';
    //
    import { addOutline, closeCircleOutline } from 'ionicons/icons';
    //
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    import { searchUserRecipeFilter } from '../../helpers/filterUserRecipe';
    import { sortAlphabetically } from '../../helpers/sortDealSubject';
    import { translateValue } from '@/helpers/translateValue';
    //
    import store from '../../store/index';
    //
    export default defineComponent({
        name: 'ViewDealSubject',
        emits: ['closeModal', 'updateBD'],
        props: {
            subjectData: Object,
            currentDealType: String
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonSearchbar, IonItem, IonGrid, IonRow, IonThumbnail, IonImg, IonToggle, IonCard, IonIcon, IonActionSheet
        },
        setup(props, { emit }) {
            // Валюта отображения
            const systemCurrency = ref(store.state.systemCurrency)
            //
            const subjectData = ref();
            const currentDealType = ref();
            // Массив с СИСТЕМНЫМ списком предметов для продажи
            const dealSaleSubjectArray = ref(store.state.dealSaleSubjectArray)
            // Массив с СИСТЕМНЫМ списком предметов для закупа
            const dealBuySubjectArray = ref(store.state.dealBuySubjectArray)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами дополнительных атрибутов к предметам дела
            const dealAdditionalAttributesArray = ref();
            //
            const userSettings = ref(store.state.userSettings)
            //
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings
                // dealSaleSubjectArray.value = userSettings.value[0].userPriceList
                dealAdditionalAttributesArray.value = userSettings.value[0].userAdditionalAttributes
            })
            //
            const searchRecipeMenu = ref(false);
            const searchRecipe = ref('');
            const searchAttributeMenu = ref(false)
            const searchAdditionalAttributes = ref('')
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами рецептов (Временно в сторе)
            const userRecipeArray = ref(store.state.userRecipeArray)
            // РЕЦЕПТ ПОЛЬЗОВАТЕЛЯ (фильтр для поиска и сортировки по алфавиту)
            const searchedRecipe = computed(() => {
                const sortedUserRecipeArray = sortAlphabetically(userRecipeArray.value);
                return searchUserRecipeFilter(sortedUserRecipeArray, searchRecipe.value)
            })
            // ПОЛЬЗОВАТЕЛЬСКИЕ ДОП АТРИБУТЫ К ПРОДУКТУ ПРОДАЖИ
            const searchedAdditionalAttributes = computed(() => {
                const sortedDealAdditionalAttributesArray = sortAlphabetically(dealAdditionalAttributesArray.value);
                // используем фнукцию фильтрации из предметов заказа
                return searchDealSubjectFilter(sortedDealAdditionalAttributesArray, searchAdditionalAttributes.value);
            })
            // Задаем из выбранного списка значение для recipe
            const chooseRecipe = (recipe) => {
                subjectData.value.recipe = recipe.value;
                searchRecipeMenu.value = false;
                emit('updateBD');
            }
            // Выбираем из списка объект для массива атрибутов
            const chooseAttribute = (attribute) => {
                isItemAlreadyHave.value = subjectData.value.additionalAttributes.find(item => item.value === attribute.value)
                if(isItemAlreadyHave.value !== undefined) {
                    alert('Modal Create Subject: атрибут уже добавлен к предмету')
                } else {
                    searchAttributeMenu.value = false;
                    subjectData.value.additionalAttributes.push(attribute)
                    // 
                    subjectData.value.subjectPrice += +attribute.price;
                    emit('updateBD');
                }
            }
            // Заглушка под предмет продажи "БЕЗ РЕЦЕПТА"
            const noRecipe = ref({
                value: 'no-recipe',
                name: 'Без рецепта'
            })
            // ======================== Удаление конкретного атрибута у предмета ========================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteAttribute = ref(false);
            // Храним айди предмета к удалению
            const attributeToDelete = ref();
            // Кнопка action sheet для подтверждения удаления
            const deleteSubjectAttributeButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteAttributeFunc(attributeToDelete.value)
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
            //удаляем current attribute в предмете (обнолвений в БД здесь не производится)
            const openDeleteAttributeModal = (attribute) => {
                attributeToDelete.value = attribute;
                deleteAttribute.value = true
            }
            const deleteAttributeFunc = (attribute) => {
                subjectData.value.additionalAttributes = subjectData.value.additionalAttributes.filter(item => item.uid !== attribute.uid);
                // и вычитаем из общей стоимости
                subjectData.value.subjectPrice -= +attribute.price
                emit('updateBD');
            }

            const showSelectedRecipe = (selectedRecipe) => {
                if(subjectData.value.recipe === 'no-recipe') {
                    return 'Без рецепта'
                }else if(subjectData.value.recipe !== '' && subjectData.value.recipe !== 'no-recipe') {
                    return translateValue(selectedRecipe, userRecipeArray.value)
                } else {
                    return 'Не выбрано'
                }
            }
            // ================ Работа с атрибутами предмета
            const currentSubjectAttribute = ref()
            // открываем view current attribute item
            const isViewSubjectAttributeOpened = ref(false);
            const openCurrentSubjectAttribute = (index) => {
                isViewSubjectAttributeOpened.value = true;
                // console.log(subjectData.value.additionalAttributes[index])
                currentSubjectAttribute.value = subjectData.value.additionalAttributes[index];
                console.log(currentSubjectAttribute.value)
            }
            // ============================ Проверяем добавлен ли уже атрибут к продукту
            const isItemAlreadyHave = ref();

            //
            watchEffect(() => {
                subjectData.value = props.subjectData;
                currentDealType.value = props.currentDealType;
            })
            //
            const translateProductValue = (selected) => {
                if (subjectData.value.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value === 'sale') {
                        return translateValue(selected, dealSaleSubjectArray.value)
                    }
                    // Если currentDealType - Закупки
                    if (currentDealType.value === 'buy') {
                        return translateValue(selected, dealBuySubjectArray.value)
                    }
                } else if (!subjectData.value.selectedProduct) {
                    console.log(selected)
                } else {
                    return
                }
            }

            return {
                systemCurrency, userSettings, subjectData, currentDealType, searchRecipeMenu, searchRecipe, chooseRecipe, noRecipe, searchedRecipe, userRecipeArray, showSelectedRecipe, translateProductValue, dealSaleSubjectArray, dealBuySubjectArray, addOutline, closeCircleOutline, deleteAttribute, attributeToDelete, deleteSubjectAttributeButtons, openDeleteAttributeModal, deleteAttributeFunc, isViewSubjectAttributeOpened, openCurrentSubjectAttribute, currentSubjectAttribute, isItemAlreadyHave, searchAttributeMenu, searchAdditionalAttributes, searchedAdditionalAttributes, dealAdditionalAttributesArray, chooseAttribute
            }
        }
    })
</script>

<style scoped>
    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }
    ion-card {
        overflow: visible;
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .thumbnail_deal-subject {
        height: 64px;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--ion-color-light);
        border-radius: 50%;
        padding: 0.5rem;
    }
    .card-center {
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        min-width: 64px; 
        max-width: 64px;
        padding: 0.5rem;
        background-color: var(--ion-color-light);
        box-shadow: none;
        border-radius: 50%;
    }
    .card-add {
        min-height: 64px;
    }
    .icon_size {
        font-size: 25px;
    }
    .icon_del {
        top: -0.4rem;
        left: -0.4rem;
        z-index: 20;
    }
</style>