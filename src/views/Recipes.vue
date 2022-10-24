<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <Header :title="pageTitle" />
        
        <!-- page navigation menu -->
        <navigation-menu/>

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
            <div v-if="dataLoaded && myRecipes.length !== 0">
                <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="search"></ion-searchbar>
                <div v-for="recipe in myRecipes" :key="recipe.id" class="ion-margin-top">
                    <router-link
                        :to="{ name: 'View-Recipe', params: {
                            recipeId: recipe.id,
                            recipeUid: recipe.uid,
                            recipe: JSON.stringify(recipe)
                        } }"
                    >
                        {{recipe}}
                    </router-link>
                </div>
            </div>

        </ion-content>
    </div>
</template>

<script>
    import Header from '@/components/headers/Header.vue';
    import Spinner from '@/components/Spinner.vue';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import CreateNewRecipe from '@/components/modal/NewRecipe-modalCreate.vue';
    //
    import { IonContent, IonSearchbar, IonImg, IonText } from '@ionic/vue'
    //
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { uid } from 'uid';

    export default defineComponent({
        name: 'Recipes',
        components: {
            Header,
            Spinner,
            NavigationMenu,
            CreateButton,
            CreateNewRecipe,
            //
            IonContent,
            IonSearchbar,
            IonImg,
            IonText
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

            // Подтягиваем список рецептов из store
            spinner.value = true;
            //
            onMounted(async () => {
                await store.methods.getUserRecipesFromBD();
                myRecipes.value = store.state.userRecipeArray;
                spinner.value = false
                dataLoaded.value = true;
            })

            // функция поиска контакта с помощью search
            const search = ref('');

            // =====================================
            // Work with Modal Create New Recipe
            const isOpen = ref(false);

            // Изменяемый шаблон нового рецепты
            const recipeData = ref({
                uid: uid(),
                email: userEmail.value,
                value: '',
                name: ''
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
                    name: ''
                }
            }

            // Создаем новый рецепт
            const createNew = async (newRecipeData) => {
                // принимаем инфу по рецепту из modal
                recipeData.value = newRecipeData
                spinner.value = true;
                // Если есть пустые строки
                // Использовать валидацию
                if(recipeData.value.recipeName === '') {
                    alert('Recipes: Вы не указали название рецепта')
                } else {
                    try {
                        // Добавляем в БД инфу по новому контакту
                        const { error } = await supabase.from('userRecipes').insert([recipeData.value])
                        if(error) throw error;
                        await store.methods.getUserRecipesFromBD();
                        myRecipes.value = store.state.userRecipeArray;
                        // ищем созданный новый рецепт в массиве всех рецептов в store (по uid)
                        const newRecipe = myRecipes.value.find(el => el.uid === recipeData.value.uid) 
                        // Сбрасываем заполненные данные и закрываем модалку
                        // переходим на страницу созданного нового контакта
                        router.push({ name: 'View-Recipe', params: { recipeId: newRecipe.id, recipe: JSON.stringify(newRecipe)}})
                        // console.log(newRecipe)
                        setOpen()
                    } catch (error) {
                        alert(`Error: ${error.message}`)
                    }
                }
            }
            //
            const goToRecipesStore = () => {
                alert('Recipes: Магазин в разработке...')
            }

            return {
                user, router, pageTitle, spinner, dataLoaded, myRecipes, search, isOpen, recipeData, setOpen, createNew, goToRecipesStore
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
</style>