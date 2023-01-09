<template>
    <div>
        <!-- Navigation Menu -->
        <navigation-menu
            :title="pageTitle"
        />

        <!-- page header -->
        <Header :title="pageTitle" style="background-color: white"/>

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
            <div class="ion-margin-top">
                <h1>Как работать в сервисе</h1>
    
                <div>
                    В разработке...
                </div>
            </div>

            <br>
            <br>
            <br>
        </ion-content>

        <!-- page footer -->
        <Footer style="background-color: white"/>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import Header from '../components/headers/Header.vue';
    import Footer from '../components/Footer.vue';
    //
    import { 
        IonContent
    } from '@ionic/vue';
    import {  } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import NavigationMenu from '../components/NavigationMenu.vue';


    export default defineComponent({
        name: 'faq',
        components: {
            Header,
            NavigationMenu,
            Footer,
            //
            IonContent
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;

            return {
                user, router, pageTitle
            }
        }
    })
</script>

<style scoped>

</style>