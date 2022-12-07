<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader />

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
            <div class="ion-text-left ion-padding-horizontal">

                <!-- Название рецепта -->
                <ion-item-group >
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Название</h4>
                    </ion-text>
                    <!--  -->
                    <ion-item class="ion-no-padding" lines="none">
                        <ion-input color="medium" v-model="recipeName" autocapitalize="on" maxlength="40"></ion-input>
                    </ion-item>
                </ion-item-group>

                <!-- Категории рецепта -->
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Категории</h4>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <!-- Категория -->
                        <ion-chip v-for="(category, index) in currentRecipe.categories" :key="index" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" style="position: relative; overflow: visible">
                            {{ category }}
                            <!-- Кнопка удалить выбранную категорию у рецепта -->
                            <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium" @click.stop="openDeleteCategoryModal(category)"></ion-icon>
                        </ion-chip>

                        <!-- Кнопка добавления категории -->
                        <ion-chip v-if="currentRecipe.categories.length < 3" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" outline="true" @click.stop="searchRecipesCategoriesMenu = true">
                            Добавить
                        </ion-chip>
                    </ion-grid>

                    <!-- Всплывашка подтверждение удаления категории предмета -->
                    <ion-action-sheet
                    :isOpen="deleteCategory"
                    header="Удалить категорию"
                    :buttons="deleteCategoryButtons"
                    @didDismiss="deleteCategory = false"
                    ></ion-action-sheet>
                </ion-item-group>

                <!-- Свайпер с фотками -->
                <swiper>
                    <!-- <swiper-slide 
                        v-for="(element, index) in currentRecipe.composition" 
                        :key="index"
                        style="font-size: 16px"
                    >
                        <ion-text>
                            {{element}}
                        </ion-text>
                    </swiper-slide> -->
                    <swiper-slide>
                        Фото 1
                    </swiper-slide>
                    <swiper-slide>
                        Фото 2
                    </swiper-slide>
                    <swiper-slide>
                        Фото 3
                    </swiper-slide>
                </swiper>

                <!-- Описание рецепта -->
                <ion-item-group class="ion-margin-bottom">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Описание</h4>
                    </ion-text>

                    <!--  -->
                    <ion-textarea
                        style="border-bottom: 1px solid var(--ion-color-light); padding-bottom: 0.8rem;"
                        color="medium"
                        class="ion-no-padding" 
                        placeholder="Не указано"
                        autoGrow="true" 
                        autocapitalize="on"
                        v-model="recipeDescription"
                    ></ion-textarea>
                </ion-item-group>

                <!-- Индикатор наличия ингредиентов под рецепт -->
                <ion-item-group class="ion-padding-bottom">
                    <!-- Если все ингредиенты есть -->
                    <!-- <ion-chip color="success" class="ion-no-margin">
                        <ion-icon :icon="checkmark"></ion-icon>
                        <ion-label>
                            Все ингредиенты в наличии
                        </ion-label>
                    </ion-chip> -->

                    <!-- Если чего-то из ингредиентов не хватает -->
                    <ion-chip color="danger" class="ion-no-margin">
                        <ion-icon :icon="alertOutline"></ion-icon>
                        <ion-label>
                            Недостаточно ингредиентов
                        </ion-label>
                    </ion-chip>
                </ion-item-group>

                <!-- Ингредиенты по составу -->
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Состав</h4>
                    </ion-text>

                    <!--  -->
                    <div>
                        <!-- 
                            Чайная ложка – 5 мл это примерно 5 грамм
                            Десертная ложка — 10 мл жидкости — 10 грамм
                            Столовая ложка — 15 мл жидкости — 15 грамм
                            Щепотка – 2-4 грамма
                        -->
                        <div v-for="(element, n) in currentRecipe.composition" :key="n" @click.stop="expendList(`ri + ${n}`)">
    
                            <!--  -->
                            <ion-item class="ion-no-padding">
                                <ion-text color="primary">
                                    {{(n + 1)}}. {{element.name}}
                                </ion-text>
                            </ion-item>
    
                            <!--  -->
                            <div :id="`ri + ${n}`" style="display: none">
                                <div v-for="(ingredient, idx) in element.ingredients" :key="idx" lines="none" class="ion-no-padding" style="margin-top: 1rem;">
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                            <div style="display: flex; flex-direction: column;">
                                                <ion-text>{{ingredient.name}}</ion-text>
                                                <ion-text>{{ingredient.value}}</ion-text>
                                            </div>
                                            <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light); border: 1px solid var(--ion-color-danger)">
                                                <ion-img :src="setImgSrc(ingredient.name, ingredient.costEstimation)"></ion-img>
                                            </ion-thumbnail>
                                        </ion-row>
                                            {{ingredient.costEstimation}}
                                    </ion-grid>
                                </div>
                            </div>
                        </div>
                    </div>

                </ion-item-group>
                
                <!-- Вкл / Выкл на продажу в магазин рецептов -->
                <ion-item-group class="ion-padding-vertical">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Продажа рецептов</h4>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="medium">
                                Выставлен на продажу
                            </ion-text>
                            <ion-toggle color="success"></ion-toggle>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- Кнопка удалить -->
                <ion-button fill="clear" color="danger" @click="openDeleteMenu">Удалить рецепт</ion-button>
                <!-- Всплывашка подтверждение удаления рецепта -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Вы точно хотите удалить рецепт?"
                    @didDismiss="isOpenRef = false"
                    :buttons="deleteCurrentRecipeButtons"
                ></ion-action-sheet>

                <br>
                {{currentRecipe}}
            </div>

        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { supabase } from '../../supabase/init';
    import store from '../../store/index';
    //
    import { IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea, IonLabel, IonThumbnail, IonImg } from '@ionic/vue';
    import { closeCircleOutline, checkmark, alertOutline } from 'ionicons/icons'
    //
    import 'swiper/css';
    import '@ionic/vue/css/ionic-swiper.css';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';

    export default defineComponent({
        name: 'View-recipe',
        components: {
            ViewHeader, Spinner,
            //
            IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea, IonLabel, IonThumbnail, IonImg,
            //
            Swiper, SwiperSlide
        },
        setup() {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.recipeId;
            const info = route.params;
            // console.log(info.recipeId)
            const currentRecipe = ref(JSON.parse(info.recipe))
            //
            const spinner = ref(null);
            //
            const isOpenRef = ref(false)
            const openDeleteMenu = () => {
                isOpenRef.value = true
            }
            const deleteCurrentRecipeButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCurrentRecipe()
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
            const deleteCurrentRecipe = async () => {
                // console.log(currentId)
                try {
                    const { error } = await supabase.from('userRecipes').delete().eq('id', currentId)
                    if(error) throw error
                    //router.push({ name: 'Recipes' })
                    router.go(-1)
                    alert('Wiew Recipe: Рецепт удален из книги')
                } catch (error) {
                    // Удалить если не понадобится
                    // alert(`Error: ${error.message}`)
                }
            }
            //
            const recipeName = ref(currentRecipe.value.name)
            watch(recipeName, async () => {
                // console.log(recipeName.value)
                currentRecipe.value.name = recipeName.value
                currentRecipe.value.value = recipeName.value
                // 
                spinner.value = true;
                try {
                    // Вынести в store?
                    // console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('userRecipes').update({
                        name: currentRecipe.value.name,
                        value: currentRecipe.value.value
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            })
            // 
            const recipeDescription = ref(currentRecipe.value.recipeDescription)
            watch(recipeDescription, async () => {
                currentRecipe.value.recipeDescription = recipeDescription.value
                // 
                spinner.value = true;
                try {
                    // Вынести в store?
                    // console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('userRecipes').update({
                        recipeDescription: currentRecipe.value.recipeDescription
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            })
            //
            // ============================ Удаление категории у предмета ===============================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteCategory = ref(false);
            // Храним категорию предмета к удалению
            const categoryToDelete = ref();
            //удаляем current category в предмете (обнолвений в БД здесь не производится)
            const openDeleteCategoryModal = (category) => {
                categoryToDelete.value = category;
                deleteCategory.value = true
            }
            const deleteCategoruFunc = (category) => {
                currentRecipe.value.categories = currentRecipe.value.categories.filter(item => item !== category)
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

            //
            const expendList = (el) => {
                let item = document.getElementById(el)
                if(item) {
                    item.style.display == 'none' ? item.style.display = 'block' : item.style.display = 'none'
                }
                // console.log(document.getElementById(el))
            }

            // 
            const setImgSrc = (recipeName, costEstimation) => {
                let dealBuySubjectArray = store.state.dealBuySubjectArray
                let ingredientValue;
                dealBuySubjectArray.filter(item => {
                    if(item.name === recipeName && item.costEstimation === costEstimation) {
                        ingredientValue = item.value
                    }
                })
                // console.log(ingredientValue) 
                return `../img/subjects/buy/${ingredientValue}.webp`
            }

            return {
                route, router, spinner, currentRecipe, currentId, info, openDeleteMenu, isOpenRef, deleteCurrentRecipeButtons, deleteCurrentRecipe, recipeName, closeCircleOutline, openDeleteCategoryModal, deleteCategory, categoryToDelete, deleteCategoryButtons, recipeDescription, expendList, checkmark, alertOutline, setImgSrc
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