<template>
    <!-- page header -->
    <ion-header translucent="true">
        <ion-toolbar color="white">
            <ion-buttons class="color-primary" slot="start">
                <ion-button fill="clear" v-if="edit" @click="cancelEdit">Отмена</ion-button>
                <ion-back-button  default-href="/" v-else text="Назад"></ion-back-button>
            </ion-buttons>
            <!-- Если текущий роут НЕ View-Deal && НЕ Profile && НЕ View-Recipe-->
            <ion-buttons class="color-primary" slot="end" v-if="(route.name !== 'View-Deal' && route.name !== 'Profile' && route.name !== 'View-Recipe')">
                <ion-button fill="clear" v-if="edit"  @click="update">Готово</ion-button>
                <ion-button fill="clear" v-else @click="editMode">Править</ion-button>
            </ion-buttons>
            <!-- Если текущий роут View-DEal -->
            <ion-buttons v-if="route.name === 'View-Deal'" slot="end" @click="$emit('openDeleteMenu')">
                <ion-button>
                    <ion-icon :icon="trashOutline" color="danger"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<script>
    import { defineComponent } from 'vue';
    import { useRoute } from 'vue-router';
    import store from '../../store/index';
    //
    import { trashOutline } from 'ionicons/icons';
    //
    import { IonHeader, IonToolbar, IonButtons, IonButton, IonBackButton, IonIcon } from '@ionic/vue';

    export default defineComponent({
        name: 'ViewContactHeader',
        emits: ['openDeleteMenu'],
        props: ['edit', 'editMode', 'update', 'cancelEdit'],
        components: {
            IonHeader,
            IonToolbar,
            IonButtons,
            IonButton,
            IonBackButton,
            IonIcon
        },
        setup(props, { emit }) {
            //
            const route = useRoute();

            return {
                route, trashOutline
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