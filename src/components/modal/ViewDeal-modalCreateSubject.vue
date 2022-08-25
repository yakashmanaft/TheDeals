<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal'); isAttributesMenuOpened = false">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый предмет</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createSubject', subjectData, isAttributesMenuOpened)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <!--  -->
        <ion-grid>
            <ion-row>
                <ion-text v-if="subjectData.selectedProduct !== ''">Общая сумма предмета: {{ subjectData.totalSubjectPrice }}</ion-text>
            </ion-row>
        </ion-grid>
        <!--  -->
        <ion-content>
            {{currentDealType}}
            {{subjectData}}
            <!-- Выбор предмета к делу -->
            <ion-item-group class="ion-padding-horizontal">
                <!-- заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Предмет</h4>
                </ion-text>
                <!-- Показываем выбранный предмет по делу -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Кнопка выбора предмета дела -->
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchSubjectMenu = true">
                            {{ showSelectedProduct(subjectData.selectedProduct) }}
                        </ion-button>
                        <!-- Если уже указан предмет -->
                        <ion-thumbnail v-if="subjectData.selectedProduct !== ''" class="thumbnail_deal-subject">
                            <!-- Если тип дела Продажа -->
                            <ion-img v-if="currentDealType === 'sale'" :src="`../img/subjects/sale/${subjectData.selectedProduct}.webp`"></ion-img>
                            <!-- Если тип дела Закупка -->
                            <ion-img v-if="currentDealType === 'buy'" :src="`../img/subjects/buy/${subjectData.selectedProduct}.webp`"></ion-img>
                        </ion-thumbnail>
                        <!-- Если предмет не указан -->
                        <ion-thumbnail v-else class="thumbnail_deal-subject">
                            <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                        </ion-thumbnail>
                    </ion-row>
                </ion-grid>
                <!-- модалка для выбора (Поиск предмета к делу) -->
                <ion-modal :isOpen="searchSubjectMenu">
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchSelectedProduct" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchSubjectMenu = false"></ion-searchbar>
                    <ion-content style="height: 90vh">
                        <ion-item v-for="subject in searchedSubject" :key="subject.id" @click="choose(subject)">
                            {{ subject.name }}
                        </ion-item>
                        <!-- Если ничего подхлдящего нет, создать свое надо -->
                        <div v-if="searchedSubject.length <= 0">
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
            </ion-item-group>

            <!-- ================  Показываем в зависимости от выбранного типа дела ==============-->
            <!-- Если ПРОДАЖА -->
            <div v-if="currentDealType === 'sale'">

                <!-- РЕЦЕПТ -->
                <ion-item-group  class="ion-text-left ion-padding-horizontal">
                    <!-- Подбираем рецепт к делу -->
                    <ion-text>
                        <h4>Рецепт</h4>
                    </ion-text>
                    <!-- Кнопка выбора рецепта к предмету -->
                    <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchRecipeMenu = true">
                        {{ showSelectedRecipe(subjectData.recipe) }}
                    </ion-button>
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
                                    <ion-text color="medium">
                                        Ничего не найдено
                                    </ion-text>
                                </ion-item>
                                <br>
                                <br>
                                <ion-item lines="none">
                                    <ion-text class="ion-padding-horizontal">
                                        Если вы хотите добавить рецепт, которого нет в вашей книге десертов - ищите в магазине рецептов :) 
                                    </ion-text>
                                </ion-item>
                            </div>
                        </ion-content>
                    </ion-modal>
                </ion-item-group>

                <!-- АТРИБУТЫ -->
                <ion-item-group class="ion-margin-top">
                    <!-- Заголовок -->
                    <ion-text>
                        <ion-grid class="ion-no-padding ion-padding-horizontal">
                            <ion-row class="ion-align-items-center ion-justify-content-between">
                                <div>
                                    <h4 class="ion-no-margin">Атрибуты к предмету</h4>
                                    <ion-text color="primary">Всего {{ subjectData.additionalAttributes.length }}</ion-text>
                                </div>
                                <ion-toggle color="success" @ionChange="toggleAttributesMenu"></ion-toggle>
                            </ion-row>
                        </ion-grid>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding" v-if="isAttributesMenuOpened">
                        <ion-row class="ion-nowrap horizontal-scroll">
                            <!-- Карточки attribute -->
                            <ion-card @click.stop="openCurrentSubjectAttribute(attribute)" class="ion-padding ion-text-center card-center relative" v-for="(attribute, index) in subjectData.additionalAttributes" :key="attribute.id">
                                <!-- Кнопка удалить конкретный атрибут у предмета -->
                                <ion-icon class="icon_size icon_del absolute" :icon="closeCircleOutline" @click.stop="openDeleteAttributeModal(attribute)"></ion-icon>
                                <!-- attribute img-->
                                <ion-thumbnail class="relative">
                                    <ion-img style="height: 100%" :src="`../img/subjects/sale/${attribute.value}.webp`"></ion-img>
                                </ion-thumbnail>
                                <!--  -->
                                <ion-text class="absolute" style="bottom: -1rem;">х{{attribute.qty}}</ion-text>
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

                <!-- ===================================================================== -->
                <!-- модалка просмотра уже добавленного атрибута -->
                <!-- <ViewDealSubject 
                    :isOpen="isViewSubjectAttributeOpened"
                    @closeModal="isViewSubjectAttributeOpened = false"
                    :subjectData="currentDealSubject"
                    :currentDealType="currentDealType"
                /> -->
                <ion-modal :isOpen="isViewSubjectAttributeOpened">
                    <ion-header translucent="true">
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-button @click="isViewSubjectAttributeOpened = false">Закрыть</ion-button>
                            </ion-buttons>
                            <ion-title class="ion-text-center">Просмотр</ion-title>
                            <!-- <ion-buttons slot="end">
                                <ion-button>Готово</ion-button>
                            </ion-buttons> -->
                        </ion-toolbar>
                    </ion-header>
                    <ion-content>
                        <br>
                        {{currentDealType}}
                        {{currentSubjectAttribute}}
                        <ion-item-group class="ion-padding-horizontal">
                            <!-- Заголовок -->
                            <ion-text>
                                <h4 class="ion-no-margin ion-margin-top">Доп. Атрибут</h4>
                            </ion-text>
                            <!-- Показываем текущий доп. атрибут -->
                            <ion-grid class="ion-no-padding border-bottom ion-padding-bottom">
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <!-- Название текущего доп. атрибуту -->
                                    <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                        {{ currentSubjectAttribute.name }}
                                    </ion-button>
                                    <!-- Иконка к текущему доп. атрибуту -->
                                    <ion-thumbnail class="thumbnail_deal-subject">
                                        <ion-img :src="`../img/subjects/sale/${currentSubjectAttribute.value}.webp`"></ion-img>
                                    </ion-thumbnail>
                                </ion-row>
                            </ion-grid>
                        </ion-item-group>
                        <!--  -->
                        <ion-item-group>
                            Кол-во
                            <input type="number" v-model="currentSubjectAttribute.qty">
                            Цена за 1 ед.
                            <input type="number" v-model="currentSubjectAttribute.pricePerUnit">
                        </ion-item-group>
                        <!--  -->
                        <ion-item-group class="ion-padding-horizontal">
                            <ion-text>
                                <h4 class="ion-no-margin">Стоимость атрибута</h4>
                            </ion-text>
                            <!--  -->
                            <ion-grid>
                                <ion-row>
                                    <div>
                                        Всего: {{currentSubjectAttribute.totalPrice}} {{systemCurrency.name}}
                                    </div>
                                </ion-row>
                            </ion-grid>
                        </ion-item-group>
                    </ion-content>
                </ion-modal>

                <!-- Модалка по выбору / поиску атрибутов в прайсе пользователя -->
                <ion-modal :isOpen="searchAttributeMenu">
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchAdditionalAttributes" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchAttributeMenu = false"></ion-searchbar>
                    <!--  -->
                    <ion-content style="height: 90vh">
                        <ion-item v-for="attribute in searchedAdditionalAttributes" :key="attribute.id" @click="chooseAttribute(attribute)">
                            {{ attribute.name }}
                            {{ attribute }}
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

                <!-- ================== Считаем Subject Price ==================================== -->
                <ion-item-group>
                    <!-- per Kilogram -->
                    <div v-if="subjectData.costEstimation === 'perKilogram'">
                        <!-- Заголовок -->
                        <ion-text >
                            <h4 class="ion-padding-horizontal">Калькулятор цены</h4>
                        </ion-text>
                        <!--  -->
                        <ion-grid class="ion-no-padding">
                            <ion-row>
                                Цена за 1 кг.: {{ subjectData.price }}
                            </ion-row>
                            <ion-row>
                                Количество гостей (чел.): {{ subjectData.personQuantity }}
                            </ion-row>
                            <ion-row>
                                Вес одной порции (гр.): {{ subjectData.gramPerPerson }}
                            </ion-row>
                            <ion-row>
                                Количество предмета (шт.): {{ subjectData.productQuantity }}
                            </ion-row>
                            <ion-row>
                                Скидка на предмет: (%): {{ subjectData.subjectDiscount }}
                            </ion-row>
                        </ion-grid>
                    </div>
                    <!-- per 100gram -->
                    <div v-if="subjectData.costEstimation === 'per100gram'">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Калькулятор цены</h4>
                    </ion-text>
                        Цена за 100 гр. {{ subjectData.price }} <br>

                    </div>
                    <!-- per Unit -->
                    <div v-if="subjectData.costEstimation === 'perUnit'">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Калькулятор цены</h4>
                    </ion-text>
                        Цена за 1 шт. {{ subjectData.price }} <br>
                    </div>


                    <!-- 
                        
                     -->
                    <!-- модалка для выбора (Поиск атрибута к предмету) -->


                    <!-- ================== Считаем Total Subject Price ============================== -->
                </ion-item-group>
            </div>

            <!-- Если ЗАКУПКА -->
            <div v-if="currentDealType === 'buy'" >
                <!-- product price -->
                <ion-item-group >
                    <ion-text>
                        <h4>Стоимость приобретения</h4>
                    </ion-text>
                </ion-item-group>
            </div>

            <!-- product note -->
            <ion-item-group class="ion-padding-horizontal ion-margin-bottom">
                <ion-text>
                    <h4>Заметки по предмету</h4>
                </ion-text>
                <ion-textarea class="ion-margin-bottom" autocapitalize="on" v-model="subjectData.productNote" placeholder="Написать..."></ion-textarea>
            </ion-item-group>
            <br>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, computed, watch, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonImg, IonThumbnail, IonIcon, IonGrid, IonRow, IonSearchbar, IonItem, IonTextarea, IonToggle, IonCard, IonLabel, IonActionSheet } from '@ionic/vue';
    import { helpOutline, addOutline, closeCircleOutline } from 'ionicons/icons';
    //
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    import { searchUserRecipeFilter } from '../../helpers/filterUserRecipe';
    import { sortAlphabetically } from '../../helpers/sortDealSubject';
    import { translateValue } from '@/helpers/translateValue';
    //
    import store from '../../store/index';
    //
    export default defineComponent({
        name: 'CreateDealSubject',
        emits: ['closeModal', 'createSubject'],
        props: {
            subjectData: Object,
            currentDealType: String,
            isAttributesMenuOpened: Boolean
        },
        components: {
            IonModal,
            IonHeader,
            IonToolbar,
            IonButtons,
            IonButton,
            IonTitle,
            IonContent,
            IonItemGroup,
            IonText,
            IonImg, 
            IonThumbnail,
            IonIcon, 
            IonGrid,
            IonRow,
            IonSearchbar,
            IonItem,
            IonTextarea,
            IonToggle,
            IonCard, 
            IonLabel,
            IonActionSheet,
        },
        setup(props, {emit}) {
            //
            const currentSubjectAttribute = ref()
            // Валюта отображения
            const systemCurrency = ref(store.state.systemCurrency)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами рецептов (Временно в сторе)
            const userRecipeArray = ref(store.state.userRecipeArray)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ПРОДАЖИ
            const dealSaleSubjectArray = ref();
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами дополнительных атрибутов к предметам дела
            const dealAdditionalAttributesArray = ref();
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ЗАКУПКИ
            const dealBuySubjectArray = ref(store.state.dealBuySubjectArray)
            //
            const subjectData = ref();
            const currentDealType = ref();
            //
            const userSettings = ref(store.state.userSettings)
            //
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings
                // console.log(userSettings.value[0].userPriceList)
                dealSaleSubjectArray.value = userSettings.value[0].userPriceList
                dealAdditionalAttributesArray.value = userSettings.value[0].userAdditionalAttributes
            })
            //
            const showSelectedProduct = (selectedProduct) => {
                if(subjectData.value.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value === 'sale') {
                        return translateValue(selectedProduct, dealSaleSubjectArray.value)
                    }
                    // Если currentDealType - Закупки
                    else if (currentDealType.value === 'buy') {
                        return translateValue(selectedProduct, dealBuySubjectArray.value)
                    }
                    //
                } else {
                    return 'Не выбран'
                }
            }
            //
            const showSelectedRecipe = (selectedRecipe) => {
                if(subjectData.value.recipe !== '' && subjectData.value.recipe === 'no-recipe') {
                    return 'Без рецепта'
                }else if(subjectData.value.recipe !== '' && subjectData.value.recipe !== 'no-recipe') {
                    return translateValue(selectedRecipe, userRecipeArray.value)
                } else {
                    return 'Не выбрано'
                }
            }
            //  =================== Работы с предметами дела
            const searchSubjectMenu = ref(false);
            const searchSelectedProduct = ref('');
            // =================== Работы с рецептами
            const searchRecipeMenu = ref(false);
            const searchRecipe = ref('');
            // ==================== Работа с доп. атрибутами
            const isAttributesMenuOpened = ref(false);
            const toggleAttributesMenu = () => {
                isAttributesMenuOpened.value = !isAttributesMenuOpened.value;
                // при закрытии - затираем выбранные атрибуты
                subjectData.value.additionalAttributes = []
            }
            const searchAttributeMenu = ref(false)
            const searchAdditionalAttributes = ref('')
            //
            watchEffect(() => {
                subjectData.value = props.subjectData;
                currentDealType.value = props.currentDealType
                isAttributesMenuOpened.value = props.isAttributesMenuOpened
                currentSubjectAttribute.value = props.currentSubjectAttribute

            })
            // ПРЕДМЕТ ДЕЛА (фильтр для поиска и сортировка по алфавиту)
            const searchedSubject = computed(() => {
                if(currentDealType.value === 'sale') {
                    const sortedDealSellSubjectArray = sortAlphabetically(dealSaleSubjectArray.value);
                    return searchDealSubjectFilter(sortedDealSellSubjectArray, searchSelectedProduct.value);
                } else if(currentDealType.value === 'buy') {
                    const sortedDealBuySubjectArray = sortAlphabetically(dealBuySubjectArray.value);
                    return searchDealSubjectFilter(sortedDealBuySubjectArray, searchSelectedProduct.value);
                }
            }) 
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
            // Задаем из выбранному списка значение для selectedProduct
            const choose = (subject) => {
                subjectData.value.selectedProduct = subject.value;
                subjectData.value.price = subject.price;
                subjectData.value.costEstimation = subject.costEstimation;
                //
                searchSubjectMenu.value = false
            }
            // Задаем из выбранного списка значение для recipe
            const chooseRecipe = (recipe) => {
                subjectData.value.recipe = recipe.value;
                searchRecipeMenu.value = false;
            }
            // Выбираем из списка объект для массива атрибутов
            const chooseAttribute = (attribute) => {
                isItemAlreadyHave.value = subjectData.value.additionalAttributes.find(item => item.value === attribute.value)
                if(isItemAlreadyHave.value !== undefined) {
                    alert('Modal Create Subject: атрибут уже добавлен к предмету')
                } else {
                    searchAttributeMenu.value = false;
                    const newAttribute = attribute;
                    subjectData.value.additionalAttributes.push(newAttribute)
                    // 
                    subjectData.value.totalSubjectPrice += +attribute.totalPrice
                    // emit('updateBD');
                }
            }
            // Заглушка под предмет продажи "БЕЗ РЕЦЕПТА"
            const noRecipe = ref({
                value: 'no-recipe',
                name: 'Без рецепта'
            })
            // ======================================== Удаление конкретного атрибута у предмета ==========================================
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
                subjectData.value.totalSubjectPrice -= +attribute.totalPrice
            }

            // ======================================== Просмотр конкретного атрибута =====================================================
            // открываем view current attribute item
            const isViewSubjectAttributeOpened = ref(false);
            const openCurrentSubjectAttribute = (attribute) => {
                isViewSubjectAttributeOpened.value = true;
                // console.log(subjectData.value.additionalAttributes[index])
                // currentSubjectAttribute.value = subjectData.value.additionalAttributes[index];
                currentSubjectAttribute.value = attribute
                // console.log(currentSubjectAttribute.value)
            }
            // Проверяем добавлен ли уже атрибут к продукту
            const isItemAlreadyHave = ref();




        // // Берем массив данных
        // let array = dealsList.value;
        // // Выбираем из массива данных нужные значения
        // let numbers = array.map(item => item.totalSubjectPrice)
        // // Суммируем значения
        // let sum = numbers.reduce( (accumulator, currentValue) => accumulator + currentValue)


            // subjectData.value.subjectPrice = 1



            //
            // const attributeTotalPriceValue = ref(0);
            // // attributeTotalPriceValue.value = currentSubjectAttribute.pricePerUnit
            // console.log(currentSubjectAttribute.value)
            //
            // const attributeTotalPrice = (pricePerUnit, qty) => {
            //     currentSubjectAttribute.value.totalPrice = pricePerUnit * qty
            //     console.log(currentSubjectAttribute.value.totalPrice)
            //     // attributeTotalPriceValue.value = currentSubjectAttribute.value.totalPrice
            // }
            // subjectData.value.subjectPrice -= attributeTotalPriceValue.value
            // watch(attributeTotalPriceValue, (newValue, oldValue) => {
            //     // attributeTotalPrice()
            //     console.log(attributeTotalPriceValue.value)
            //     // subjectData.value.subjectPrice = (subjectData.value.subjectPrice - +oldValue) +  attributeTotalPriceValue.value
            //     // subjectData.value.subjectPrice += attributeTotalPriceValue.value
            //     // console.log(`oldValue: ${oldValue}`)
            //     // console.log(`newValue: ${newValue}`)
            //     // subjectData.value.subjectPrice = (subjectData.value.subjectPrice - +oldValue) + +newValue
            //     //subjectData.value.subjectPrice +=
            //     // console.log(subjectData.value.subjectPrice)
            // })

            return {
                dealSaleSubjectArray, dealBuySubjectArray, helpOutline, addOutline, showSelectedProduct, searchSubjectMenu, searchSelectedProduct, currentDealType, translateValue, searchedSubject, choose, searchRecipeMenu, searchRecipe, userRecipeArray, chooseRecipe, showSelectedRecipe, searchedRecipe, noRecipe, searchAttributeMenu, searchAdditionalAttributes, dealAdditionalAttributesArray, searchedAdditionalAttributes, chooseAttribute, closeCircleOutline, isAttributesMenuOpened, toggleAttributesMenu, openDeleteAttributeModal, deleteAttribute, attributeToDelete, deleteSubjectAttributeButtons, systemCurrency, currentSubjectAttribute, isViewSubjectAttributeOpened, openCurrentSubjectAttribute, isItemAlreadyHave
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