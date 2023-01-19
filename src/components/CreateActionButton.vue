<template>
    <!--  -->
    <ion-fab  vertical="bottom" horizontal="end" slot="fixed" style="position:fixed; right: 1rem;" :class="isHasSubstring() === true ? 'bottom-2-rem' : 'bottom-5-rem'">
        <ion-fab-button>
            <ion-icon :icon="layers"></ion-icon>
        </ion-fab-button>
    </ion-fab>
</template>

<script>
    import { defineComponent } from 'vue';
    import { layers } from 'ionicons/icons';
    import { IonIcon, IonFab, IonFabButton } from '@ionic/vue';
    //
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'CreateActionButton',
        components: {
            IonIcon, IonFab, IonFabButton
        }, 
        setup() {
            const router = useRouter()

            const isHasSubstring = () => {
                let currentRoute = router.currentRoute._value.fullPath
                let substring = '/view-warehouse/'
                if(currentRoute.indexOf(substring) === -1) {
                    return false
                } else {
                    return true
                }
            }

            return {
                router, layers, isHasSubstring
            }
        }
    })
</script>

<style scoped>
    .bottom-5-rem {
        bottom: 5rem;
    }
    .bottom-2-rem {
        bottom: 2rem;
    }
</style>