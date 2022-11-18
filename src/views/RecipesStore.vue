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
            :title="pageTitle"
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
            <div v-if="dataLoaded && storeItems.length !== 0" class="ion-text-left ion-margin-bottom">
                <!-- Поиск надо же да? -->
                dsfds
            </div>
        </ion-content>
    </div>
</template>

<script>
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue';
    //
    import { defineComponent, ref, computed, onMounted  } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    //
    import { IonContent, IonImg, IonText } from '@ionic/vue'
    //
    import store from '../store/index';

    export default defineComponent({
        name: 'RecipesStore',
        components: {
            Spinner, NavigationMenu, Header,
            //
            IonContent, IonImg, IonText
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
            onMounted(() => {
                spinner.value = false
                dataLoaded.value = true;
            })

            return {
                spinner, dataLoaded, storeItems, user, router, route, pageTitle
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
</style>