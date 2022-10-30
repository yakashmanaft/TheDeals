<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- page header -->
        <Header :title="pageTitle"/>

        <!-- Кнопка перехода к созданию нового дела -->
        <CreateButton @click="setOpen"/>

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
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myItems.length === 0) && !spinner" class="no-status-deal ion-padding-horizontal no-data">
                <ion-img src="img/common/warehouse-sticker.webp" alt="нет дел"></ion-img>
                <ion-text color="primary"><h2>Склад пуст...</h2></ion-text>
                <ion-text color="medium">Самое время пополнять запасы</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && myItems.length !== 0">
                Чета есть
            </div>
        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted} from 'vue'
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    //
    import { IonContent, IonImg, IonText } from '@ionic/vue'
    //
    import Spinner from '@/components/Spinner.vue';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue';
    import CreateButton from '../components/CreateButton.vue';

    export default defineComponent({
        name: 'Warehouse',
        components: {
            IonContent, Spinner, NavigationMenu, Header, CreateButton, IonImg, IonText
        },
        setup() {
            //
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myItems = ref([]);
            // Подтягиваем список дел из store
            spinner.value = true;
            //
            // Currency
            const currency = ref(store.state.systemCurrency.name)
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
            onMounted(() => {
                spinner.value = false
                dataLoaded.value = true;
            })
            //
            const itemData = ref({
                // uid: uid(),
                // email: userEmail.value,
                // dealType: '',
                // dealStatus: "deal-in-booking",
                // contactID: '000',
                // dealsList: [],
                // shipping: '',
                // totalDealPrice: 0,
                // executionDate: '',
                // dealPaid: 0,
                // cancelledReason: '',
                // dealImportance: 1
            })
            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
                spinner.value = false
                alert('Warehouse: В разработке...')
                // isViewDealModalOpened.value = !isViewDealModalOpened.value;
                // dealData.value = {
                //     uid: uid(),
                //     email: userEmail.value,
                //     dealType: '',
                //     dealStatus:"deal-in-booking",
                //     contactID: '000',
                //     dealsList: [],
                //     shipping: {
                //         typeOfShipping: '',
                //         shippingPrice: 0
                //     },
                //     totalDealPrice: 0,
                //     executionDate: '',
                //     dealPaid: 0,
                //     cancelledReason: '',
                //     dealImportance: 1
                // }
            }

            return {
                itemData, dataLoaded, spinner, setOpen, currency, user, pageTitle, myItems
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
</style>