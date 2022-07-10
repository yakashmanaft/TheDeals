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
            UID {{ currentUid }}
            <br>
            {{ info.contact }}
        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import { IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow } from '@ionic/vue';

    export default defineComponent({
        name: 'view-contact',
        components: {
            IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Берем имя роута для заголовка
            const pageTitle = router.currentRoute._value.meta.translation;  

            // Get current info of route
            const currentId = route.params.contactId;
            const currentUid = route.params.contactUid;
            const info = route.params

            return {
                pageTitle, currentId, currentUid, info
            }
        }
    })
</script>

<style scoped>

</style>