<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый предмет</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createSubject', subjectData)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            {{currentDealType}}
            {{subjectData}}
            <!-- Выбор предмета к делу -->
            <ion-item-group>
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
            <ion-item-group v-if="currentDealType === 'sale'" class="ion-text-left">
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


                <p>Выберите рецепт предмета</p>
                <input type="text" v-model="subjectData.recipe">
            </ion-item-group>

            <!-- Если ЗАКУПКА -->
            <ion-item-group v-if="currentDealType === 'buy'">
                Это добавление предмета для Закупа
                <input type="text" v-model="subjectData.selectedProduct"/>
                <textarea name="" id="" cols="30" rows="10" v-model="subjectData.productNote"></textarea>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, computed, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonImg, IonThumbnail, IonIcon, IonGrid, IonRow, IonSearchbar, IonItem } from '@ionic/vue';
    import { helpOutline } from 'ionicons/icons';
    //
    import SelectDealSubject from '../Select-DealSubject.vue';
    //
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    import { searchUserRecipeFilter } from '../../helpers/filterUserRecipe';
    import { sortAlphabetically } from '../../helpers/sortDealSubject'
    //
    import store from '../../store/index';
    //
    export default defineComponent({
        name: 'CreateDealSubject',
        emits: ['closeModal', 'createSubject'],
        props: {
            subjectData: Object,
            currentDealType: String
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
            SelectDealSubject,
            IonImg, 
            IonThumbnail,
            IonIcon, 
            IonGrid,
            IonRow,
            IonSearchbar,
            IonItem
        },
        setup(props, {emit}) {
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами рецептов (Временно в сторе)
            const userRecipeArray = ref(store.state.userRecipeArray)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ПРОДАЖИ
            const dealSaleSubjectArray = ref([
                {
                    value: 'cake',
                    name: 'Торт',
                    costEstimation: 'perKilogram'
                },
                {
                    value: 'wedding-cake',
                    name: 'Свадебный торт',
                    costEstimation: 'perKilogram'
                },
                {
                    value: 'cupcake',
                    name: 'Капкейк',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'meringue-roll',
                    name: 'Меренговый рулет',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'brownies',
                    name: 'Брауни',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'meringue',
                    name: 'Меренге (Безе)',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'pavlova',
                    name: 'Павлова',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'cake-pop',
                    name: 'Кейк-попсы',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'cake-eskimos',
                    name: 'Эскимошки',
                    costEstimation: 'perUnit'
                }
            ])
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ЗАКУПКИ
            const dealBuySubjectArray = ref([
                {
                    value: 'sugar',
                    name: 'Сахар',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'cottage-cheese',
                    name: 'Сливочный творожный сыр',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'sugar-powder',
                    name: 'Сахарная пудра',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'nuts',
                    name: 'Орехи',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'egg',
                    name: 'Яйцо',
                    // costEstimation: 'perUnit'
                },
                {
                    value: 'flour',
                    name: 'Мука',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'cocoa',
                    name: 'Какао',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'corn-starch',
                    name: 'Кукурузный крахмал',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'salt',
                    name: 'Соль',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'vanilla',
                    name: 'Ваниль',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'sour-cream',
                    name: 'Сметана',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'banana',
                    name: 'Банан',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'baking-soda',
                    name: 'Пищевая сода',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'vanilla-extract',
                    name: 'Ванильный экстракт',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'cream',
                    name: 'Сливки',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'gouda-cheese',
                    name: 'Сыр гауда',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'lemon-juice',
                    name: 'Сок лимона',
                    // costEstimation: 'perKilogram'
                },
            ])
            //
            const subjectData = ref();
            const currentDealType = ref();
            //
            const showSelectedProduct = (selectedProduct) => {
                if(subjectData.value.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value === 'sale') {
                        return translatePlaceholder(selectedProduct, dealSaleSubjectArray.value)
                    }
                    // Если currentDealType - Закупки
                    else if (currentDealType.value === 'buy') {
                        return translatePlaceholder(selectedProduct, dealBuySubjectArray.value)
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
                    return translatePlaceholder(selectedRecipe, userRecipeArray.value)
                } else {
                    return 'Не выбрано'
                }
            }
            // 
            const searchSubjectMenu = ref(false);
            const searchSelectedProduct = ref('');
            //
            const searchRecipeMenu = ref(false);
            const searchRecipe = ref('');
            
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


            watchEffect(() => {
                subjectData.value = props.subjectData;
                currentDealType.value = props.currentDealType

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
            // Задаем из выбранному списка значение для selectedProduct
            const choose = (subject) => {
                subjectData.value.selectedProduct = subject.value
                searchSubjectMenu.value = false
                // console.log(subject)
            }
            // Задаем из выбранного списка значение для recipe
            const chooseRecipe = (recipe) => {
                subjectData.value.recipe = recipe.value;
                searchRecipeMenu.value = false;
                // console.log(recipe)
            }
            // Заглушка под предмет продажи "БЕЗ РЕЦЕПТА"
            const noRecipe = ref({
                value: 'no-recipe',
                name: 'Без рецепта'
            })

            return {
                dealSaleSubjectArray, dealBuySubjectArray, helpOutline, showSelectedProduct, searchSubjectMenu, searchSelectedProduct, currentDealType, translatePlaceholder, searchedSubject, choose, searchRecipeMenu, searchRecipe, userRecipeArray, chooseRecipe, showSelectedRecipe, searchedRecipe, noRecipe
            }
        }
    })
</script>

<style scoped>
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

</style>