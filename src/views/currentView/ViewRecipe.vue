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
                    <ion-item counter="true" class="ion-no-padding">
                        <ion-input color="primary" v-model="recipeName" autocapitalize="on" maxlength="40"></ion-input>
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
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Описание</h4>
                    </ion-text>

                    <!--  -->
                    <ion-textarea
                        color="medium"
                        class="ion-no-padding" 
                        autoGrow="true" 
                        autocapitalize="on"
                        v-model="recipeDescription"
                    ></ion-textarea>
                </ion-item-group>

                <!--  -->
                <ion-item-group class="ion-margin-top" @click="checkIngredients()">
                    <ion-chip color="success" class="ion-no-margin">
                        Все ингредиенты в наличии
                    </ion-chip>
                    <!-- <ion-chip color="warning" class="ion-no-margin">
                        На складе недостаточно ингредиентов
                    </ion-chip> -->
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
                                <ion-item v-for="(ingredient, idx) in element.ingredients" :key="idx" lines="none" class="ion-no-padding" style="margin-top: 1rem;">
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-justify-content-between">
                                            <div style="display: flex; flex-direction: column;">
                                                <ion-text>{{ingredient.name}}</ion-text>
                                                <ion-text>{{ingredient.value}}</ion-text>
                                            </div>
                                            
                                        </ion-row>
                                    </ion-grid>
                                </ion-item>
                            </div>
                        </div>
                    </div>

                </ion-item-group>
                
                <!-- Вкл / Выкл на продажу в магазин рецептов -->
                <ion-item-group>
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

                <!-- Модалка проверки количества ингредиентов в наличии (для приготовления по рецепту) -->
                <CheckIngredientsAvailabilityModal
                    :isOpen="isCheckIngredientsAvailabilityModalOpened"
                    @closeModal="(isCheckIngredientsAvailabilityModalOpened = false)"
                    @didDismiss="(isCheckIngredientsAvailabilityModalOpened = false)"
                />

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
    import { IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea } from '@ionic/vue';
    import { closeCircleOutline } from 'ionicons/icons'
    //
    import 'swiper/css';
    import '@ionic/vue/css/ionic-swiper.css';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import CheckIngredientsAvailabilityModal from '../../components/modal/CheckIngredientsAvailabilityModal.vue';

    export default defineComponent({
        name: 'View-recipe',
        components: {
            ViewHeader, Spinner, CheckIngredientsAvailabilityModal,
            //
            IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea,
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
            watch(recipeName, () => {
                // console.log(recipeName.value)
                currentRecipe.value.name = recipeName.value
                currentRecipe.value.value = recipeName.value
            })
            const recipeDescription = ref(currentRecipe.value.recipeDescription)
            watch(recipeDescription, () => {
                currentRecipe.value.recipeDescription = recipeDescription.value
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
            const isCheckIngredientsAvailabilityModalOpened = ref(false)
            const checkIngredients = () => {
                isCheckIngredientsAvailabilityModalOpened.value = true
            }
            

            return {
                route, router, spinner, currentRecipe, currentId, info, openDeleteMenu, isOpenRef, deleteCurrentRecipeButtons, deleteCurrentRecipe, recipeName, closeCircleOutline, openDeleteCategoryModal, deleteCategory, categoryToDelete, deleteCategoryButtons, recipeDescription, expendList, checkIngredients, isCheckIngredientsAvailabilityModalOpened
            }
        }
    })
</script>

<style scoped>

</style>