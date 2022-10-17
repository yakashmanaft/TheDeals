<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle" />
        
        <!-- Page content -->
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
            <div v-if="(!dataLoaded || userSettings.length === 0) && !spinner" class="ion-margin-top">
                <!-- Если !data -->
                <!-- Data is not available -->
                <br>
                Данные не загружены
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && userSettings.length !== 0" class="ion-margin-top">
                <!--  -->
                <ion-grid class="ion-no-padding">
                    <ion-row>
                        id: {{ userSettings.id }}
                    </ion-row>
                    <ion-row>
                        uid: {{ userSettings.uid }}
                    </ion-row>
                    <ion-row>
                        Зарегистрирован: {{ userSettings.created_at }}
                    </ion-row>
                    <ion-row>
                        {{ userSettings.email }}
                    </ion-row>
                </ion-grid>

                <div>
                    <p>Загруженность дня</p>
                    <div v-for="(item, i) in userSettings.daySaturation" :key="i">
                        {{item.name}}
                        {{item.qty}}
                    </div>
                </div>

            </div>

        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, onMounted, ref } from 'vue';
    import { uid } from 'uid';
    //
    import Header from '../components/headers/Header.vue';
    import Spinner from '../components/Spinner.vue';
    import NavigationMenu from '../components/NavigationMenu.vue';
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
        IonRow,
        IonItemSliding,
        IonItemOptions,
        IonItemOption,
        IonLabel, 
        IonActionSheet,
        IonModal,
        IonButtons
    } from '@ionic/vue';
    import { menu, trashOutline } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    //
    export default defineComponent({
        name: 'Settings',
        emits: [],
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
            IonRow,
            IonItemSliding,
            IonItemOptions,
            IonItemOption,
            IonLabel,
            IonActionSheet,
            IonModal,
            IonButtons,
        },
        setup(props, { emit }) {
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
            const userSettings = ref(store.state.userSettings[0])
            //
            // const daySaturation = ref(userSettings.value.daySaturation)
            //
            const spinner = ref(null)
            const dataLoaded = ref(null)
            //
            spinner.value = true;
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings[0]
                spinner.value = false;
                dataLoaded.value = true;
                // console.log(userSettings.value[0].id)
                // console.log(daySaturation.value)
            })


            return {
                menu, user, userEmail, router, pageTitle, userSettings, spinner, dataLoaded
            }
        }
    })
</script>

<style scoped>

</style>