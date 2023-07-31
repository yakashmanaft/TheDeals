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
            style="background-color: white"
            @calendarMode="calendarModeFunc"
            :isMonth="isMonthMode"
        />
        <!-- @goToSettings="toggleSettingsModal" -->

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
            <br>
            
            <!-- CALENDAR -->
            <div v-if="isMonthMode === true">

                <!-- Компонент месячного календаря -->
                <CalendarMonth/>
            </div>
            <div v-else>
                wEEK gfkdjsbgdfkg
            </div>

        </ion-content>

        <!-- page footer -->
        <Footer style="background-color: white"/>
    </div>
</template>

<script>
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    //
    import store from '../../../store/index';
    import { supabase } from '@/supabase/init';
    
    //
    import Spinner from '@/components/Spinner.vue'
    import Header from '@/components/headers/Header.vue'
    import NavigationMenu from '@/components/NavigationMenu.vue'
    import Footer from '@/components/Footer.vue';

    //
    import CalendarMonth from '../../../components/calendar/month/CalendarMonth.vue'

    //
    import { IonContent } from '@ionic/vue'

    export default defineComponent({
        name: 'TestCalendar',
        emit: [],
        props: {},
        components: {
            Spinner,
            Header,
            NavigationMenu,
            Footer,

            //
            CalendarMonth,

            //
            IonContent
        },
        setup(props, { emit }) {

            //
            const spinner = ref(null)
            spinner.value = true

            //
            const user = computed(() => store.state.user);
            const userEmail = ref()

            // Setup ref to router
            const route = useRoute();
            const router = useRouter();

            // Page title
            const pageTitle = router.currentRoute._value.meta.translation;

            // Toggle calendar mode
            const isMonthMode = ref(true)
            const calendarModeFunc = (boolean) => {
                if(boolean === true) {
                    isMonthMode.value = true
                    // loadInMonthMode()
                } else {
                    isMonthMode.value = false
                }
            }

            onMounted(() => {

                // Get user email
                store.methods.setUserEmail()
                userEmail.value = store.state.userEmail
    
                //
                spinner.value = false
            })


            return {
                spinner, user, route, router, pageTitle, userEmail, isMonthMode, calendarModeFunc
            }
        }
    })
</script>

<style>

</style>