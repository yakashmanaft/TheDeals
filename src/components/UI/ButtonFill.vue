<template>
    <ion-button>
        <slot></slot>
    </ion-button>
</template>
<script>
import { IonButton } from '@ionic/vue';
export default {
    name: 'button-fill',
    components: {
        IonButton
    }
}
</script>
<style scoped>
    
</style>