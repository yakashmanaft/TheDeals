<template>
    <ion-modal>
        <!--  -->
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click.stop="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title>Журнал</ion-title>
                <ion-buttons slot="end"></ion-buttons>
            </ion-toolbar>
        </ion-header>
        <!--  -->
        <ion-content forceOverscroll="false">
            <ion-item-group>
                Это журнал
            </ion-item-group>
            <br>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup } from '@ionic/vue';

    export default defineComponent({
        name: 'warehouseLedger',
        emit: [],
        props: {
            
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup
        },
        setup(props, {emit}) {
            return {

            }
        }
    })
</script>

<style scoped>

</style>