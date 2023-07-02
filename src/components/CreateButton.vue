<template>
        <ion-fab v-if="router.currentRoute._value.meta.title === 'Deals' || router.currentRoute._value.meta.title === 'Contacts' || router.currentRoute._value.meta.title === 'Recipes' || router.currentRoute._value.meta.title === 'MyPrice' || router.currentRoute._value.meta.title === 'Warehouse'" vertical="bottom" horizontal="end" slot="fixed" style="position:fixed; bottom: 5rem; right: 1rem;">
            <ion-fab-button>
                <ion-icon :icon="add">
                    
                </ion-icon>
            </ion-fab-button>
        </ion-fab>

        <!--  -->

        <ion-fab v-else vertical="bottom" horizontal="end" slot="fixed" class="ion-margin-end ion-margin-bottom">
            <ion-fab-button>
                <ion-icon :icon="add">
                    
                </ion-icon>
            </ion-fab-button>
        </ion-fab>
</template>

<script>
    import { defineComponent } from 'vue';
    import { add } from 'ionicons/icons';
    import { 
        IonIcon,
        IonFab,
        IonFabButton
    } from '@ionic/vue';
    //
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'CreateButton',
        components: {
            IonIcon, IonFab, IonFabButton
        },
        setup() {
            const router = useRouter()

            return {
                add, router
            }
        }
    })
</script>

<style scoped>

</style>