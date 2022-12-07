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
            <ion-text>
                <h4>
                    Запасы недостаточны:
                </h4>
                <ion-text color="medium">
                    Осуществите закупку у ваших поставщиков.
                    <!-- <ion-text color="primary">Создать дело</ion-text> -->
                </ion-text>
            </ion-text>
            <ion-grid class="ion-no-padding ion-padding-top">

                <ion-row class="ion-align-items-center ion-justify-content-between ion-nowrap ion-margin-top">
                    <!--  -->
                    <div style="display: flex; align-items: center;">
                        <!-- иконка -->
                        <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light); border: 1px solid var(--ion-color-danger)">
                            <ion-img src="../img/subjects/buy/egg.webp"></ion-img>
                        </ion-thumbnail>
                        <!-- Название ингредиента -->
                        <ion-text color="danger" class="ion-margin-start">Сливочный творожный сыр</ion-text>
                    </div>
                    <ion-text color="danger" style="white-space: nowrap; margin-left: 0.3rem;">6 / 5 шт.</ion-text>
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
</style>