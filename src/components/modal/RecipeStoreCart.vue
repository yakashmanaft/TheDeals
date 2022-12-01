<template>
    <ion-modal>

        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Корзина</ion-title>
                <ion-buttons slot="end">
                    <ion-button>Очистить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!--  -->
        <ion-content class="ion-padding" forceOverscroll="false">
            Корзина в разработке...
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, computed, onMounted } from "vue";
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle } from "@ionic/vue";
    import { } from 'ionicons/icons';

    export default defineComponent({
        name: 'RecipeStoreCart',
        // emits: ['closeModal'],
        props: {

        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonTitle
        },
        setup(){
            return {

            }
        }
    })
</script>

<style scoped>

</style>