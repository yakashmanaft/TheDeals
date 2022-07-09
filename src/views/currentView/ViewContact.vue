<template>
    <div>
        <!-- page header -->
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="home" text="Назад"></ion-back-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button fill="clear">Править</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
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
            
            ID {{ currentId }}
            <br>
            {{ contact }}
        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import { IonContent, IonBackButton } from '@ionic/vue';

    export default defineComponent({
        name: 'view-contact',
        components: {
            IonContent, IonBackButton
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Берем имя роута для заголовка
            const pageTitle = router.currentRoute._value.meta.translation;  

            // Get current info of route
            const currentId = route.params.contactId;
            const contact = route.params.contact;

            return {
                pageTitle, currentId, contact, 
            }
        }
    })
</script>

<style scoped>

</style>