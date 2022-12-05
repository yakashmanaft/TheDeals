<template>
    <ion-modal>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!--  -->
        <ion-content class="ion-padding-horizontal">

            <ion-grid class="ion-no-padding">
                <ion-row class="ion-align-items-center ion-justify-content-between ion-nowrap ion-margin-top">
                    <!--  -->
                    <div style="display: flex; align-items: center;">
                        <!-- иконка -->
                        <ion-thumbnail class="thumbnail_deal-subject relative" style="background-color: var(--ion-color-light);">
                            <ion-img src="../img/subjects/buy/egg.webp"></ion-img>
                            <div 
                                class="absolute mark-atribute"
                            >
                                <ion-icon style="font-size: 1.1rem;" :icon="checkmark" color="light"></ion-icon>
                            </div>
                        </ion-thumbnail>
                        <!-- Название ингредиента -->
                        <ion-text color="medium" class="ion-margin-start">Сливочный творожный сыр</ion-text>
                        <!-- Иконка галочка для демонстрации наличия -->
                    </div>
                    <ion-text color="medium" style="white-space: nowrap; margin-left: 0.3rem;">300/3100 г.</ion-text>
                </ion-row>
                <ion-row class="ion-align-items-center ion-justify-content-between ion-nowrap ion-margin-top">
                    <!--  -->
                    <div style="display: flex; align-items: center;">
                        <!-- иконка -->
                        <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-warning);">
                            <ion-img src="../img/subjects/buy/egg.webp"></ion-img>
                        </ion-thumbnail>
                        <!-- Название ингредиента -->
                        <ion-text color="warning" class="ion-margin-start">Сливочный творожный сыр</ion-text>
                    </div>
                    <ion-text color="warning" style="white-space: nowrap; margin-left: 0.3rem;">6/5 шт.</ion-text>
                </ion-row>
                <ion-row class="ion-align-items-center ion-justify-content-between ion-nowrap ion-margin-top">
                    <!--  -->
                    <div style="display: flex; align-items: center;">
                        <!-- иконка -->
                        <ion-thumbnail class="thumbnail_deal-subject relative" style="background-color: var(--ion-color-light);">
                            <ion-img src="../img/subjects/buy/egg.webp"></ion-img>
                            <div 
                                class="absolute mark-atribute"
                            >
                                <ion-icon style="font-size: 1.1rem;" :icon="checkmark" color="light"></ion-icon>
                            </div>
                        </ion-thumbnail>
                        <!-- Название ингредиента -->
                        <ion-text color="medium" class="ion-margin-start">Сливочный творожный сыр</ion-text>
                    </div>
                    <ion-text color="medium" style="white-space: nowrap; margin-left: 0.3rem;">300/3100 г.</ion-text>
                </ion-row>
            </ion-grid>

        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent } from 'vue';
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonThumbnail, IonImg, IonText, IonGrid, IonRow } from '@ionic/vue'
    //
    import { checkmark } from 'ionicons/icons';

    export default defineComponent({
        name: 'CheckIngredientsAvailabilityModal',
        emits: ['closeModal'],
        props: {

        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonThumbnail, IonImg, IonText, IonGrid, IonRow
            //
        },
        setup(props, {emit}) {
            return {
                checkmark
            }
        }
    })
</script>

<style scoped>
    .thumbnail_deal-subject {
        height: 64px;
        min-width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        padding: 0.5rem;
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .mark-atribute {
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 0;
        right: 0;
        width: 1.3rem;
        height: 1.3rem;
        background-color: var(--ion-color-success);
        border-radius: 100%
    }
</style>