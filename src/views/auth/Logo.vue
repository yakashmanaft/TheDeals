<template>

    <div style="display: flex; align-items: center; justify-content: center; width: 100%;">

        <router-link :to="{ path: './indexwebpage' }" class="ion-text-center" style="cursor: pointer; display: flex; flex-direction: column; justify-content: end;">
            <div style="line-height: 4rem; font-size: 5rem; color: var(--ion-color-primary); font-weight: bold;">DAY</div> 
            <div style="color: var(--ion-color-success); text-align: right;">by deals</div>
        </router-link>
    </div>
</template>
<script>
import { IonGrid, IonText } from '@ionic/vue'

export default {
    name: 'Logo',
    components: {
        IonGrid, IonText
    }
}
</script>
<style scoped>
</style>