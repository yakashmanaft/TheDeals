<template>
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
            <!-- page content -->
            <!-- No data -->
            <div>
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div>
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <ion-text>
                        <h4>Рабочий прайс</h4>
                    </ion-text>
                    <ion-card class="ion-no-margin">
                        <ion-card-header>
                            header
                        </ion-card-header>
                        <ion-card-content>
                            content
                            <div v-for="(item, index) in userSettings" :key="index">
                                {{ item.userPriceList }}
                                <br/>
                                <br>
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
    import Header from '../components/headers/Header.vue'
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
    IonCardContent
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
            IonCardContent
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
            //
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings
            })
            //

            return {
                menu, user, userEmail, router, pageTitle, userSettings
            }
        }
    })
</script>

<style scoped>

</style>