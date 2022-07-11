<template v-show="user">
    <ion-header translucent="true">
        <ion-toolbar >
            <ion-grid>
                <ion-row class="ion-justify-content-between ion-align-items-center">
                    <h1 class="ion-no-margin">{{ title }}</h1>
                    <ion-text @click="$router.go(-1)" v-if="router.currentRoute._value.meta.type === 'Create'" color="primary">
                        Отменить
                    </ion-text>
                    <ion-menu-toggle v-if="router.currentRoute._value.meta.type === 'View'">
                        <ion-icon :icon="menu" />
                    </ion-menu-toggle>
                </ion-row>
            </ion-grid>
        </ion-toolbar>
    </ion-header>
</template>

<script>
    import store from '../../store/index';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText } from '@ionic/vue';
    import { menu } from 'ionicons/icons';

    export default {
        name: 'Header',
        components: {
            IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText
        },
        props: ['title'],
        setup() {
            const user = computed(() => store.state.user);
            const router = useRouter();

            return {
                user, router, menu
            }
        }
    }
</script>

<style scoped>
    ion-icon {
        font-size: 30px;
    }
</style>