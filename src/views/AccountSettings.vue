<template>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle" />

        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
        >
            <br>
            <br>
            <br>
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || userSettings.length === 0) && !spinner">
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && userSettings.length !== 0">
                <!-- Продуктовый прайс -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- <ion-text>
                        <h4>Рабочий прайс</h4>
                    </ion-text> -->
                    <ion-card class="ion-no-margin ion-padding">
                        <ion-card-header class="ion-no-padding">
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>
                                        <h4 class="ion-no-margin">Мои продукты</h4>
                                    </ion-text>
                                    <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                        Добавить
                                    </ion-button>
                                </ion-row>
                            </ion-grid>
                        </ion-card-header>
                        <ion-card-content class="ion-no-padding">
                            <div v-for="(item, index) in userSettings" :key="index">
                                <div v-for="(item, idx) in item.userPriceList" :key="item.id">
                                    {{ item }}
                                </div>
                            </div>
                                
                        </ion-card-content>
                    </ion-card>
                </ion-item-group>
            </div>
            
            <!-- Тарифная сетка  -->
        </ion-content>
</template>

<script>
    import { defineComponent, onMounted, ref } from 'vue';
    import Header from '../components/headers/Header.vue';
    import Spinner from '../components/Spinner.vue';
    //
    import { 
    IonContent, 
    IonHeader, 
    IonItem, 
    IonList, 
    IonMenu, 
    IonMenuToggle,
    IonButton,
    IonTitle, 
    IonToolbar,
    IonIcon,
    IonText,
    IonItemGroup,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonGrid,
    IonRow
    } from '@ionic/vue';
    import { menu } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import NavigationMenu from '../components/NavigationMenu.vue';
    //
    export default defineComponent({
        name: 'Settings',
        components: {
            Header,
            IonContent, 
            IonHeader, 
            IonItem, 
            IonList, 
            IonMenu, 
            IonMenuToggle,
            IonButton,
            IonTitle, 
            IonToolbar,
            IonIcon,
            IonText,
            NavigationMenu,
            IonItemGroup,
            IonCard,
            IonCardHeader,
            IonCardContent,
            Spinner,
            IonGrid,
            IonRow
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            // Setup ref to router
            const router = useRouter();
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const userSettings = ref(store.state.userSettings)
            //
            const spinner = ref(null);
            const dataLoaded = ref(null)
            //
            spinner.value = true;
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings
                 spinner.value = false;
                 dataLoaded.value = true;
            })
            //

            return {
                menu, user, userEmail, router, pageTitle, userSettings, spinner, dataLoaded
            }
        }
    })
</script>

<style scoped>

</style>