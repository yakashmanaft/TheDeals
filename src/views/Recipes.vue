<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <Header 
            @goToStore="goToRecipesStore"    
            :title="pageTitle" 
        />
        
        <!-- page navigation menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- Кнопка перехода к созданию нового контакта -->
        <create-button @click="setOpen"/>

        <!-- Модалка создания нового рецепта -->
        <CreateNewRecipe
            :is-open="isOpen" 
            @closeModal="setOpen"   
            @createRecipe="createNew"
            :recipeData="recipeData"
        />

        <!-- page content -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
            forceOverscroll="false"
        >
            <br>
            <br>
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myRecipes.length === 0) && !spinner" class="no-data ion-padding-horizontal">
                <ion-img src="img/common/recipe-sticker.webp" alt="нет контактов"></ion-img>
                <ion-text color="primary"><h2>У вас еще нет рецептов...</h2></ion-text>
                <ion-text color="medium">Добавьте свой рецепт или выберите в <span style="color: var(--ion-color-primary)" @click="goToRecipesStore()">магазине</span></ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && myRecipes.length !== 0" class="ion-text-left ion-margin-bottom">

                <!-- Поиск -->
                <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="search"></ion-searchbar>

                <!-- Вывод списка -->
                <router-link
                    v-if="search !== ''"
                    v-for="(recipe, index) in searchedRecipe" :key="index"
                    :to="{ name: 'View-Recipe', 
                            params: {
                            recipeId: recipe.id,
                            recipeUid: recipe.uid,
                            recipe: JSON.stringify(recipe)
                        } 
                    }"
                >
                    <ion-item lines="none" class="ion-no-padding ion-margin-horizontal">
                        <ion-grid>
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text color="primary">
                                    {{recipe.name}}
                                </ion-text>
                                <ion-text>
                                    <!-- Не понятно что тут помещать )) -->
                                </ion-text>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </router-link>
                
                <!-- Выводс списка рецептов при наличии категори в принципе -->
                <router-link 
                    v-for="(recipe, index) in searchedRecipe" :key="index" 
                    v-if="search === ''"
                    :to="{ name: 'View-Recipe', 
                            params: {
                            recipeId: recipe.id,
                            recipeUid: recipe.uid,
                            recipe: JSON.stringify(recipe)
                        } 
                    }"   
                >
                    
                    <ion-item v-if="(recipe.categories.length === 0)" lines="none">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="primary">
                                {{recipe.name}}
                            </ion-text>
                            <ion-text>
                                <!-- Не понятно что тут помещать )) -->
                            </ion-text>
                        </ion-row>
                    </ion-item>
                </router-link>

                <!-- Полоска разделитель -->
                <!-- <div v-if="(searchedCategory.length > 0 && searchedRecipe.length)" class="line-divider ion-margin-horizontal"></div> -->

                <!-- Вывод информации при отсутствии схожих поиску результатов-->
                <ion-item lines="none" v-if="searchedRecipe.length <= 0 && searchedCategory.length <= 0">
                <!-- <ion-item lines="none" v-if="searchedRecipe.length <= 0"> -->
                    <ion-text color="medium">Ничего не найдено</ion-text>
                </ion-item>

                <!-- Вывод категорий и звернутых в них рецептов -->
                <div v-else>
                    <div v-for="(category, index) in searchedCategory" :key="index" class="ion-no-padding ion-margin-horizontal" @click.stop="expendList(index)">
                        
                        <!--  -->
                        <ion-item lines="none" class="ion-no-padding" v-if="filteredMyRecipesFunc(category).length !== 0">
                            <ion-grid>
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text style="font-weight: bold">
                                        {{category}}
                                    </ion-text>
                                    <ion-text>
                                        {{filteredMyRecipesFunc(category).length}}
                                    </ion-text>
                                </ion-row>
                            </ion-grid>
                        </ion-item>

                        <!--  -->
                        <div :id="index" style="display: none">
                            <div v-for="(recipe, idx) in filteredMyRecipesFunc(category)" :key="idx" class="ion-no-padding">
                                <router-link
                                    :to="{
                                        name: 'View-Recipe',
                                        params: {
                                            recipeId: recipe.id,
                                            recipeUid: recipe.uid,
                                            recipe: JSON.stringify(recipe)
                                        }
                                    }"
                                >
                                    <ion-item lines="none" class="ion-no-padding">
                                        <ion-grid>
                                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                                <ion-text color="primary">
                                                    {{recipe.name}}
                                                </ion-text>
                                                <ion-text style="display: flex; align-items: center">
                                                    <ion-icon v-if="userEmail !== recipe.recipeAuthorEmail" color="success"  :icon="bagCheckOutline" @click.stop.prevent="showNotification(recipe)"></ion-icon>
                                                    <!--  -->
                                                    <ion-icon v-if="recipe.forSale" color="warning" :icon="ribbonOutline" class="ion-margin-start" @click.stop.prevent="showNotification(recipe)"></ion-icon>
                                                </ion-text>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-item>
                                </router-link>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>

            <br>
            <br>
            <br>

        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>
    import Header from '@/components/headers/Header.vue';
    import Spinner from '@/components/Spinner.vue';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import CreateNewRecipe from '@/components/modal/NewRecipe-modalCreate.vue';
    import Footer from '../components/Footer.vue';
    //
    import { IonContent, IonSearchbar, IonImg, IonText, IonItem, IonGrid, IonRow, IonIcon } from '@ionic/vue'
    import { bagCheckOutline, ribbonOutline } from 'ionicons/icons'
    //
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { uid } from 'uid';
    //
    import { searchWarehouseItemFilter } from '../helpers/filterUserWarehouseItems.js';
    import { searchWarehouseCategoryFilter } from '../helpers/filterWarehouseCategories.js';

    export default defineComponent({
        name: 'Recipes',
        components: {
            Header,
            Spinner,
            NavigationMenu,
            CreateButton,
            CreateNewRecipe,
            Footer,
            //
            IonContent,
            IonSearchbar,
            IonImg,
            IonText,
            IonItem,
            IonGrid,
            IonRow,
            IonIcon
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            console.log(userEmail.value)
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myRecipes = ref([])
            //
            const recipesCategoriesArray = ref([])

            // Подтягиваем список рецептов из store
            spinner.value = true;
            //
            onMounted(async () => {
                await store.methods.getUserRecipesFromBD();
                myRecipes.value = store.state.userRecipeArray;
                //
                spinner.value = false
                dataLoaded.value = true;
                //
                recipesCategoriesArray.value = store.state.recipesCategoriesArray
            })

            // функция поиска рецепта с помощью search
            const search = ref('');
            const searchedRecipe = computed(() => {
                return searchWarehouseItemFilter(myRecipes.value, search.value)
            })
            const searchedCategory = computed(() => {
                return searchWarehouseCategoryFilter(recipesCategoriesArray.value, search.value)
            })

            // =====================================
            // Work with Modal Create New Recipe
            const isOpen = ref(false);

            // Изменяемый шаблон нового рецепты
            const recipeData = ref({
                uid: uid(),
                email: userEmail.value,
                value: '',
                name: '',
                categories: [],
                recipeAuthorEmail: userEmail.value,
                forSale: false,
                recipeDescription: '',
                composition: []
            })

            // При закрытии или открытии modal очищаем шаблон рецепта
            const setOpen = () => {
                isOpen.value = !isOpen.value;
                spinner.value = false
                // searchRecipe.value = ''
                recipeData.value = {
                    uid: uid(),
                    email: userEmail.value,
                    value: '',
                    name: '',
                    categories: [],
                    recipeAuthorEmail: userEmail.value,
                    forSale: false,
                    recipeDescription: '',
                    composition: []
                }
            }

            // Создаем новый рецепт
            const createNew = async (newRecipeData) => {
                // принимаем инфу по рецепту из modal
                recipeData.value = newRecipeData
                spinner.value = true;
                // Если есть пустые строки
                // Использовать валидацию
                if(newRecipeData.name === '') {
                    alert('Recipes: Вы не указали название рецепта')
                } else if (newRecipeData.recipeDescription === '') {
                    alert('Recips: Вы не заполнили описание рецепта')
                } 
                else {
                    try {
                        // Добавляем в БД инфу по новому контакту
                        const { error } = await supabase.from('userRecipes').insert([recipeData.value])
                        if(error) throw error;
                        await store.methods.getUserRecipesFromBD();
                        myRecipes.value = store.state.userRecipeArray;
                        // ищем созданный новый рецепт в массиве всех рецептов в store (по uid)
                        const newRecipe = myRecipes.value.find(el => el.uid === recipeData.value.uid) 
                        // Сбрасываем заполненные данные и закрываем модалку
                        setOpen()
                        // переходим на страницу созданного нового контакта
                        router.push({ name: 'View-Recipe', params: { recipeId: newRecipe.id, recipe: JSON.stringify(newRecipe)}})
                        // console.log(newRecipe)
                    } catch (error) {
                        alert(`Error: ${error.message}`)
                    }
                }
            }
            //
            const goToRecipesStore = () => {
                // alert('Recipes: Магазин в разработке...')
                router.push({name: 'RecipesStore'})
            }
            //
            const filteredMyRecipesFunc = (category) => {
                let filteredMyRecipes = []
                myRecipes.value.forEach(recipe => {
                    if(recipe.categories.includes(category)) {
                        filteredMyRecipes.push(recipe)
                    }
                })

                return filteredMyRecipes
            }
            //
            const expendList = (index) => {
                let el = document.getElementById(index)
                if(document.getElementById(index)) {

                    if(el.style.display == 'none') {
                            el.style.display = 'block'
                        } else {
                            el.style.display = 'none'
                    }
                }
            }

            //
            const showNotification = (recipe) => {
                if (userEmail.value !== recipe.recipeAuthorEmail) {
                    alert('Данный рецепт был вами куплен')
                } else if (recipe.forSale) {
                    alert('Это ваш рецепт и вы выставили его на продажу в магазине рецептов')
                }
            }

            return {
                user, userEmail, router, pageTitle, spinner, dataLoaded, myRecipes, search, isOpen, recipeData, setOpen, createNew, goToRecipesStore, searchedRecipe, recipesCategoriesArray, searchedCategory, expendList, filteredMyRecipesFunc, bagCheckOutline, showNotification, ribbonOutline
            }
        }  
    })
</script>

<style scoped>
    .no-data {
        height: 80vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }

    .no-data ion-img {
        width: 50%
    }
    .line-divider {
        border: 0.05rem solid var(--ion-color-light);
    }
</style>