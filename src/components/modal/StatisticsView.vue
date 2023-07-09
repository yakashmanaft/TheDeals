<template>

    <!-- =================================== ВЫБОР ПЕРИОДА =======================================-->
    <div class="ion-text-left ion-padding-horizontal">
        <ion-grid class="ion-no-padding">
            <ion-row class="ion-justify-content-between">

                <ion-text>Период: </ion-text>
                <ion-text>01.02.2023 - 10.11.2023</ion-text>
            </ion-row>
        </ion-grid>
    </div>
    
    <br>
    {{ useDeals }}
</template>

<script>
    import { defineComponent } from 'vue';
    import { IonGrid, IonRow, IonText } from '@ionic/vue';

    export default defineComponent({
        name: 'StatisticsView',
        components: {
            IonGrid, IonRow, IonText
        },
        props: ['useDeals'],
        emits: [],
        setup (props, {emit}) {
            return {

            }
        }
    })
</script>

<style scoped>
</style>