<template>
    <div>
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
            <!-- page content -->
            <!-- NO data -->
            <div v-if="(!dataLoaded || myDeals.length === 0) && !spinner" class="ion-margin-top">
                <br>
                Данных не обнаружено. База пуста...
            </div>

            <!-- Data available -->
            <div v-if="dataLoaded && myDeals.length !== 0" class="ion-margin-top">
                <br>
                <ion-grid class="ion-no-padding">
                    <ion-row>
                        Количество дел: {{ myDeals.length }}
                        
                    </ion-row>
                </ion-grid>
            </div>
        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import Header from '../components/headers/Header.vue'
    import { 
        IonContent, IonGrid, IonRow
    } from '@ionic/vue';
    import { menu } from 'ionicons/icons';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Spinner from '@/components/Spinner.vue'


    export default defineComponent({
        name: 'wallet',
        components: {
            Header,
            IonContent, 
            NavigationMenu,
            Spinner,
            IonGrid,
            IonRow
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
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const spinner = ref(null)
            const dataLoaded = ref(null);
            // Временно обзавем данные
            const myDeals = ref([]);
            // Подтягиваем список дел из store
            spinner.value = true;
            //
            onMounted( async () => {
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
                spinner.value = false;
                dataLoaded.value = true;
            })

            return {
                menu, user, router, pageTitle, myDeals, spinner, dataLoaded
            }
        }
    })
</script>

<style scoped>

</style>