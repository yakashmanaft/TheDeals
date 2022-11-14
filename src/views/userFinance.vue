<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <Header :title="pageTitle" />

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
            <div v-if="(!dataLoaded || myData.length === 0) && !spinner" class="no-data ion-padding-horizontal">
                <ion-text>Пока пусто</ion-text>
            </div>

            <!-- Data -->
            <div v-if="dataLoaded && myData.value !== 0" class="ion-text-left ion-margin-bottom">
                <div v-for="(item, index) in myData" :key="index" class="ion-margin-top">
                    <ion-text>dealID: {{item.dealID}}</ion-text><br>
                    <ion-text>uid: {{item.uid}}</ion-text><br>
                    <ion-text>created_at: {{item.created_at}}</ion-text><br>
                    <ion-text>contactID: {{item.contactID}}</ion-text><br>
                    <ion-text>dealType: {{item.dealType}}</ion-text><br>
                    <ion-text>amount: {{item.amount}}</ion-text>
                </div>
            </div>
        </ion-content>
    </div>
</template>

<script>
    import Header from '@/components/headers/Header.vue';
    import Spinner from '@/components/Spinner.vue';
    //
    import { IonContent, IonText } from '@ionic/vue'
    //
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import store from '../store/index';
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'userFinance',
        components: {
            Header, Spinner,
            //
            IonContent, IonText
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
            const myData = ref([])

            // Подтягиваем данные леджера из store
            spinner.value = true;

            onMounted(async () => {
                await store.methods.getUserLedger();
                myData.value = store.state.userLedgerArray
                //
                spinner.value = false
                dataLoaded.value = true;
            })

            return {
                user, router, pageTitle, spinner, dataLoaded, myData
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