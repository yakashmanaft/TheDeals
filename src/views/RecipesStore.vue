<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- page header -->
        <Header 
            @goToBusket="goToRecipesStoreBusket"
            :title="pageTitle"
            style="background-color: white"
        />

        <!--  -->
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
            <div v-if="(!dataLoaded || storeItems.length === 0) && !spinner" class="no-status-deal ion-padding-horizontal no-data">
                <ion-img src="img/common/recipes-store-sticker.webp" alt="нет рецептов"></ion-img>
                <ion-text color="primary"><h2>В магазине нет рецептов...</h2></ion-text>
                <ion-text color="medium">Вы можете быть первыми!</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && storeItems.length !== 0" class="ion-text-left ion-margin-bottom" style="padding-top: 1.5rem">
                <br>
                <!--  -->
                <ion-searchbar class="ion-text-left searchbar" placeholder="Поиск..." v-model="search"></ion-searchbar>

                <!--  -->
                <!-- для формирования рабочего поиска массив storeItems преобразовавываем в searchedItem как в warehouse.vue-->
                <!-- и используем переменную search -->
                <!-- v-if="search !== ''" -->
                <router-link
                    v-for="(item, index) in storeItems"
                    :key="index"
                    :to="{
                        name: 'View-store-recipe',
                        params: {
                            itemId: item.id,
                            itemUid: item.uid,
                            item: JSON.stringify(item)
                        }
                    }"
                >
                    <ion-card>
                        <!-- Image -->
                        <div style="height: 13rem; width: 100%; background-color: var(--ion-color-medium);">
                            <ion-img src="img/common/banana-with-gouda.jpg" :alt="item.name" style="width: 100%; height: 100%; object-fit: cover"/>
                        </div>
                        <!-- Header -->
                        <ion-card-header>
                            <ion-card-title>
                                {{item.name}}
                            </ion-card-title>
                            <ion-text class="ion-no-margin vertical-devider" v-for="(category, index) in item.categories" :key="index" style="margin-right: 0.3rem;">
                                {{category}}
                            </ion-text>
                        </ion-card-header>
                        <!-- Content -->
                        <ion-card-content>
                            <!-- {{item}} -->
                            Автор: {{setAuthor(item.recipeAuthorEmail)}}
                        </ion-card-content>
                    </ion-card>
                </router-link>
            </div>
        </ion-content>

        <!-- page footer -->
        <Footer style="background-color: white"/>

        <!-- Recipe Store Cart -->
        <RecipeStoreCart
            :isOpen="isCartOpened"
            @didDismiss="isCartOpened = false"
            @closeModal="isCartOpened = false"
        />
    </div>
</template>

<script>
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue';
    import Footer from '../components/Footer.vue'
    import RecipeStoreCart from '../components/modal/RecipeStoreCart.vue';
    //
    import { defineComponent, ref, computed, onMounted  } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    //
    import { IonContent, IonImg, IonText, IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
    //
    import store from '../store/index';

    export default defineComponent({
        name: 'RecipesStore',
        components: {
            Spinner, NavigationMenu, Header, Footer, RecipeStoreCart,
            //
            IonContent, IonImg, IonText, IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent
        },
        setup(props, { emit }) {
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const storeItems = ref([])
            // Подтягиваем список дел из store
            spinner.value = true;
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            const route = useRoute();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            console.log(userEmail.value)
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            spinner.value = true;
            //
            const users = ref([])
            //
            onMounted(async () => {
                await store.methods.getStoreRecipes()
                storeItems.value = store.state.storeRecipesArray;
                //
                spinner.value = false
                dataLoaded.value = true;
                //
                await store.methods.getUsers()
                users.value = store.state.usersArray;
                // console.log(users.value)
            })
            // функция поиска рецепта по магазину с помощью search
            const search = ref('')

            // парсим автора рецепта
            const setAuthor = (recipeAuthorEmail) => {
                let author;
                // users.value.forEach(user => {
                //     if(recipeAuthorEmail === userEmail.value) {
                //         author =  'Я'
                //     } else if(recipeAuthorEmail === user.email){
                //         console.log(user.organization)
                //         console.log(user.userInfo)
                //         author = user.email
                //     }
                // })
                if(recipeAuthorEmail === userEmail.value) {
                    author = 'Я'
                } else {
                    author = recipeAuthorEmail
                }
                return author
            }
            // Переход в корзину
            const isCartOpened = ref(false)
            const goToRecipesStoreBusket = () => {
                isCartOpened.value = true;
            }

            return {
                spinner, dataLoaded, storeItems, user, router, route, pageTitle, search, setAuthor, users, goToRecipesStoreBusket, isCartOpened
            }
        }
    })
</script>

<style scoped>
    ion-img {
        height: 50vh;
    }
    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }
    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
    .no-status-deal {
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .no-status-deal_img {
        width: 50%; 
        height: 50%; 
        margin:0 auto;
    }
    .no-data ion-img {
        width: 50%;
    }
    .display-none {
        display: none;
    }
    .display-block {
        display: block
    }
    .line-divider {
        border: 0.05rem solid var(--ion-color-light);
    }
    ion-text.vertical-devider {
        padding-right: 0.3rem;
        border-right: 1px solid var(--ion-color-medium);
    }
    ion-text.vertical-devider:last-child {
        padding-right: 0;
        border: none;
    }
    .searchbar {
        position: fixed;
        z-index: 99999;
        top: 2.5rem;
    }
    ion-searchbar {
        background-color: white;
    }
</style>