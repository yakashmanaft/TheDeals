<template>
    <router-link :to="{ name: `${route}`}">
        <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="ion-margin-end ion-margin-bottom">
            <ion-fab-button>
                <ion-icon :icon="add">
                    
                </ion-icon>
            </ion-fab-button>
        </ion-fab>
    </router-link>
</template>

<script>
    import { defineComponent } from 'vue';
    import { add } from 'ionicons/icons';
    import { 
        IonIcon,
        IonFab,
        IonFabButton
    } from '@ionic/vue';

    export default defineComponent({
        name: 'CreateButton',
        components: {
            IonIcon, IonFab, IonFabButton
        },
        props: ['route'],
        setup() {
            return {
                add
            }
        }
    })
</script>

<style scoped>

</style>