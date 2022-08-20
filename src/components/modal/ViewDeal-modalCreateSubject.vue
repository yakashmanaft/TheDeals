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

                <ion-item-group>
                    <!-- ================== Считаем Subject Price ==================================== -->
                    <!-- per Kilogram -->
                    <div v-if="subjectData.costEstimation === 'perKilogram'">
                        <!-- Заголовок -->
                        <ion-text>
                            <h4>Калькулятор цены</h4>
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
                            <ion-row class="ion-align-items-center ion-justify-content-between">
                                <ion-text>
                                    Дополнительные атрибуты
                                </ion-text>  
                                <ion-toggle color="success" @ionChange="toggleAttributesMenu"></ion-toggle>  
                            </ion-row>
                            <ion-row>
                                Цена продукта: {{ subjectData.subjectPrice }}
                            </ion-row>
                        </ion-grid>
                        <ion-grid class="ion-no-padding" v-if="isAttributesMenuOpened">
                            <ion-row class="ion-nowrap horizontal-scroll">
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>
                                <ion-card class="thumbnail_deal-subject">
                                    <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                                </ion-card>

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
            <ion-item-group>
                <ion-text>
                    <h4>Заметки по предмету</h4>
                </ion-text>
                <ion-textarea autocapitalize="on" v-model="subjectData.productNote" placeholder="Написать..."></ion-textarea>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonImg, IonThumbnail, IonIcon, IonGrid, IonRow, IonSearchbar, IonItem, IonTextarea, IonToggle, IonCard } from '@ionic/vue';
    import { helpOutline } from 'ionicons/icons';
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
            IonImg, 
            IonThumbnail,
            IonIcon, 
            IonGrid,
            IonRow,
            IonSearchbar,
            IonItem,
            IonTextarea,
            IonToggle,
            IonCard
        },
        setup(props, {emit}) {
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами рецептов (Временно в сторе)
            const userRecipeArray = ref(store.state.userRecipeArray)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ПРОДАЖИ
            const dealSaleSubjectArray = ref();
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ЗАКУПКИ
            const dealBuySubjectArray = ref(store.state.dealBuySubjectArray)
            //
            const subjectData = ref();
            const currentDealType = ref();
            //
            const userSettings = ref(store.state.userSettings)
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings
                console.log(userSettings.value[0].userPriceList)
                dealSaleSubjectArray.value = userSettings.value[0].userPriceList
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
            // 
            const searchSubjectMenu = ref(false);
            const searchSelectedProduct = ref('');
            //
            const searchRecipeMenu = ref(false);
            const searchRecipe = ref('');
            //
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
                // console.log(recipe)
            }
            // Заглушка под предмет продажи "БЕЗ РЕЦЕПТА"
            const noRecipe = ref({
                value: 'no-recipe',
                name: 'Без рецепта'
            })
            // ==================== Рассчет subjectPrice цены при условии за килограмм

            // ==================== Работа с доп. атрибутами
            const isAttributesMenuOpened = ref(false);
            const toggleAttributesMenu = () => {
                isAttributesMenuOpened.value = !isAttributesMenuOpened.value;
                // при закрытии - узатираем выбранные атрибуты
            }


            return {
                dealSaleSubjectArray, dealBuySubjectArray, helpOutline, showSelectedProduct, searchSubjectMenu, searchSelectedProduct, currentDealType, translateValue, searchedSubject, choose, searchRecipeMenu, searchRecipe, userRecipeArray, chooseRecipe, showSelectedRecipe, searchedRecipe, noRecipe, isAttributesMenuOpened, toggleAttributesMenu
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
    /* ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    } */
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

</style>