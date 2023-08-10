<template>
    <!-- <div>
        <h1 class="ion-text-start ion-no-margin">
            <ion-text color="primary">Deals</ion-text><ion-text color="success">.</ion-text>
        </h1>
        <h3 class="ion-text-start ion-no-margin">
            <ion-text color="medium">byDay</ion-text>
        </h3>
    </div> -->
    <div style="display: flex; align-items: center; justify-content: center; width: 100%;">

        <div class="ion-text-center" style="display: flex; flex-direction: column; justify-content: end;">
            <div style="line-height: 4rem; font-size: 5rem; color: var(--ion-color-primary); font-weight: bold;">DAY</div> 
            <div style="color: var(--ion-color-success); text-align: right;">by deals</div>
        </div>
    </div>
</template>
<script>
import { IonGrid, IonText } from '@ionic/vue'

export default {
    name: 'LoginLogo',
    components: {
        IonGrid, IonText
    }
}
</script>
<style scoped>
</style>