<template>
    <!-- page header -->
    <Header :title="pageTitle" />

    <!-- page content -->
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

        <!-- Data -->
        {{currentId}}
    </ion-content>
</template>

<script>
    import Header from '../../components/Header.vue'

    import { defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import { IonContent } from '@ionic/vue';

    export default defineComponent({
        name: 'view-contact',
        components: {
            Header, IonContent
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Берем имя роута для заголовка
            const pageTitle = router.currentRoute._value.meta.translation;  

            // Get current Id of route
            const currentId = route.params.contactId;

            return {
                pageTitle, currentId
            }
        }
    })
</script>

<style scoped>

</style>