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

        <!-- Content -->
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
            <!-- No data -->
            <div v-if="(!dataLoaded) && !spinner" class="ion-padding-horizontal">
                Нет данных
                <br>
                Чат в разработке...
            </div>

            <!-- Data -->
            <div v-if="dataLoaded" class="ion-margin-bottom">
                Есть данные
                <br>
                Чат в разработке...
            </div>
        </ion-content>

        <!-- page footer -->
        <Footer/>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    //
    import store from '../store/index';
    import { supabase } from '../supabase/init'
    //
    import { IonContent } from '@ionic/vue';
    import {  } from 'ionicons/icons';
    //
    import Spinner from '@/components/Spinner.vue';
    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue'
    import Footer from '@/components/Footer.vue';

    export default defineComponent({
        name: 'Chat',
        components: {
            Spinner, NavigationMenu, Header, Footer,
            //
            IonContent
        },
        setup(props, { emit }) {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail();
            const userEmail = ref(store.state.userEmail);
            console.log(userEmail.value);
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;
            //
            const spinner = ref(null);
            const dataLoaded = ref(null);
            //
            spinner.value = true;
            //
            onMounted(() => {
                spinner.value = false
                dataLoaded.value = true;
            })

            return {
                user, router, spinner, pageTitle, userEmail, dataLoaded
            }
        }
    })
</script>

<stylescoped>

</stylescoped>