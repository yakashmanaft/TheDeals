<template>
    <!-- page header -->
    <ion-header translucent="true">
        <ion-toolbar color="white">
            <ion-buttons class="color-primary" slot="start">
                <ion-button fill="clear" v-if="edit" @click="cancelEdit">Отмена</ion-button>
                <ion-back-button  default-href="home" v-else text="Назад"></ion-back-button>
            </ion-buttons>
            <ion-buttons class="color-primary" slot="end">
                <ion-button fill="clear" v-if="edit"  @click="update">Готово</ion-button>
                <ion-button fill="clear" v-else @click="editMode">Править</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<script>
    import { defineComponent } from 'vue';
    import { IonHeader, IonToolbar, IonButtons, IonButton, IonBackButton } from '@ionic/vue';

    export default defineComponent({
        name: 'ViewContactHeader',
        props: ['edit', 'editMode', 'update', 'cancelEdit'],
        components: {
            IonHeader, IonToolbar, IonButtons, IonButton, IonBackButton
        },
        setup() {
            return {

            }
        }
    })
</script>

<style scoped>
    ion-toolbar {
        --border-color: var(--ion-color-white);
    }
    .color-primary {
        color: var(--ion-color-primary)
    }
</style>