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
        <ion-content class="ion-padding">
            <!-- ================ Добавленный продукт ======================== -->
            <ion-item-group>
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

            <!-- ================  Показываем в зависимости от выбранного типа дела ==============-->
            <!-- Если ПРОДАЖА -->
            <ion-item-group v-if="currentDealType === 'sale'">
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
            {{currentDealType}}
            {{subjectData}}
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, computed, ref, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonSearchbar, IonItem, IonGrid, IonRow, IonThumbnail, IonImg } from '@ionic/vue';
    //
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
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonSearchbar, IonItem, IonGrid, IonRow, IonThumbnail, IonImg
        },
        setup(props, { emit }) {
            //
            const subjectData = ref();
            const currentDealType = ref();
            // Массив со списком предметов для продажи
            const dealSaleSubjectArray = ref(store.state.dealSaleSubjectArray)
            // Массив со списком предметов для закупа
            const dealBuySubjectArray = ref(store.state.dealBuySubjectArray)
            //
            const searchRecipeMenu = ref(false);
            const searchRecipe = ref('');
            //
            const userRecipeArray = ref(store.state.userRecipeArray)
            // РЕЦЕПТ ПОЛЬЗОВАТЕЛЯ (фильтр для поиска и сортировки по алфавиту)
            const searchedRecipe = computed(() => {
                const sortedUserRecipeArray = sortAlphabetically(userRecipeArray.value);
                return searchUserRecipeFilter(sortedUserRecipeArray, searchRecipe.value)
            })
            // Задаем из выбранного списка значение для recipe
            const chooseRecipe = (recipe) => {
                subjectData.value.recipe = recipe.value;
                searchRecipeMenu.value = false;
                emit('updateBD');
            }
            // Заглушка под предмет продажи "БЕЗ РЕЦЕПТА"
            const noRecipe = ref({
                value: 'no-recipe',
                name: 'Без рецепта'
            })

            const showSelectedRecipe = (selectedRecipe) => {
                if(subjectData.value.recipe === 'no-recipe') {
                    return 'Без рецепта'
                }else if(subjectData.value.recipe !== '' && subjectData.value.recipe !== 'no-recipe') {
                    return translateValue(selectedRecipe, userRecipeArray.value)
                } else {
                    return 'Не выбрано'
                }
            }
            //
            watchEffect(() => {
                subjectData.value = props.subjectData;
                currentDealType.value = props.currentDealType;
            })
            //
            const translateProductValue = (selectedProduct) => {
                if (subjectData.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value === 'sale') {
                        return translateValue(selectedProduct, dealSaleSubjectArray.value)
                    }
                    // Если currentDealType - Закупки
                    if (currentDealType.value === 'buy') {
                        return translateValue(selectedProduct, dealBuySubjectArray.value)
                    }
                } else {
                    return
                }
            }

            return {
                subjectData, currentDealType, searchRecipeMenu, searchRecipe, chooseRecipe, noRecipe, searchedRecipe, userRecipeArray, showSelectedRecipe, translateProductValue, dealSaleSubjectArray, dealBuySubjectArray
            }
        }
    })
</script>

<style scoped>
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