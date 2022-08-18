<template v-show="user">
    <ion-header translucent="true">
        <ion-toolbar color="white">
            <ion-grid>
                <ion-row class="ion-justify-content-between ion-align-items-center">
                    <ion-menu-toggle v-if="router.currentRoute._value.meta.type === 'View'">
                        <ion-icon :icon="menu" class/>
                    </ion-menu-toggle>
                    <h1 class="ion-no-margin">{{ title }}</h1>
                    <ion-text @click="$router.go(-1)" v-if="router.currentRoute._value.meta.type === 'Create'" color="primary">
                        Отменить
                    </ion-text>
                    <router-link v-if="router.currentRoute._value.meta.type === 'View' && router.currentRoute._value.meta.title !== 'Wallet'" :to="{ name: 'Wallet' }">
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" >
                            <ion-icon :icon="walletOutline" />
                        </ion-button>
                    </router-link>
                    <router-link v-if="router.currentRoute._value.meta.type === 'View' && router.currentRoute._value.meta.title === 'Wallet'" :to="{ name: 'Settings' }">
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" >
                            <ion-icon :icon="settingsOutline" />
                        </ion-button>
                    </router-link>
                </ion-row>
            </ion-grid>
        </ion-toolbar>
    </ion-header>
</template>

<script>
    import store from '../../store/index';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButton } from '@ionic/vue';
    import { menu, walletOutline, settingsOutline } from 'ionicons/icons';

    export default {
        name: 'Header',
        components: {
            IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButton
        },
        props: ['title'],
        setup() {
            const user = computed(() => store.state.user);
            const router = useRouter();

            return {
                user, router, menu, walletOutline, settingsOutline
            }
        }
    }
</script>

<style scoped>
    ion-toolbar {
        --border-color: var(--ion-color-white);
    }
    ion-icon {
        font-size: 30px;
    }
</style>