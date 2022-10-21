<template v-show="user">
    <ion-header translucent="true">
        <ion-toolbar color="white">
            <ion-grid class="ion-no-padding">
                <ion-row class="ion-justify-content-center ion-align-items-center" style="position: relative; height: 30px;">

                    <!-- КОШЕЛЕК -->
                    <router-link v-if="router.currentRoute._value.meta.title === 'Calendar'" :to="{ name: 'Wallet' }" style="position: absolute; left: 0.3rem; top: 0;">
                        <!-- <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" > -->
                            <ion-icon :icon="walletOutline" />
                        <!-- </ion-button> -->
                    </router-link>

                    <!-- КНОПКА НАЗАД -->
                    <ion-back-button v-if="router.currentRoute._value.meta.title !== 'Calendar'" default-href="/calendar" text="Назад" style="position: absolute; left: 0; top: 0;"></ion-back-button>

                    <!-- ЗАГОЛОВОК -->
                    <h5 class="ion-no-margin" v-if="router.currentRoute._value.meta.title === 'Calendar'">{{ title }}</h5>

                    <!-- КНОПКА ОТМЕНИТЬ -->
                    <ion-text @click="$router.go(-1)" v-if="router.currentRoute._value.meta.type === 'Create'" color="primary">
                        Отменить
                    </ion-text>

                    <!-- БУРГЕР -->
                    <ion-menu-toggle v-if="router.currentRoute._value.meta.title === 'Calendar'" style="position: absolute; right: 0.3rem; top: 0;">
                        <ion-icon :icon="menu" class/>
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
    import { IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButton, IonBackButton } from '@ionic/vue';
    import { menu, walletOutline, settingsOutline } from 'ionicons/icons';

    export default {
        name: 'Header',
        components: {
            IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButton, IonBackButton
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