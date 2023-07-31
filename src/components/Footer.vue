<template v-show="user">
    <ion-footer style="position:fixed; bottom: 0;" translucent="true">
        <ion-toolbar class="ion-no-border" color="white">
            <ion-buttons >
                <ion-grid class="ion-no-padding" style="margin: 0.6rem auto">
                    <ion-row class="ion-justify-content-around adaptive-over-768">

                        <!-- Профиль пользователя -->
                        <ion-button class="ion-margin-vertical" @click="goToProfile()">
                            <ion-icon color="primary" v-if="router.currentRoute._value.meta.title === 'Profile'" :icon="person"></ion-icon>
                            <ion-icon v-else :icon="personOutline"></ion-icon>
                        </ion-button>

                        <!-- Кошелек -->
                        <ion-button class="ion-margin-vertical" @click="goToWallet()">
                            <ion-icon color="primary" v-if="router.currentRoute._value.meta.title === 'Wallet'" :icon="wallet"></ion-icon>
                            <ion-icon v-else :icon="walletOutline"></ion-icon>
                        </ion-button>

                        <!-- Calendar -->
                        <ion-button class="ion-margin-vertical" @click="goToIndex()">
                            <ion-icon color="primary" v-if="router.currentRoute._value.meta.title === 'Calendar'" :icon="calendar"></ion-icon>
                            <ion-icon v-else :icon="calendarOutline"></ion-icon>
                        </ion-button>

                        <!-- Чат -->
                        <ion-button class="ion-margin-vertical" @click="goToChat()">
                            <ion-icon color="primary" v-if="router.currentRoute._value.meta.title === 'Chat'" :icon="chatbubbles"></ion-icon>
                            <ion-icon v-else :icon="chatbubblesOutline"></ion-icon>
                        </ion-button>

                        <!-- BURGER -->
                        <ion-menu-toggle class="ion-menu_toggle">
                            <ion-icon :icon="menu" color="system"/>
                        </ion-menu-toggle>
                    </ion-row>
                </ion-grid>
            </ion-buttons>  
        </ion-toolbar>
    </ion-footer>
</template>

<script>
    import store from '../store/index';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { IonFooter, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonGrid, IonRow, IonMenuToggle } from '@ionic/vue';
    import { chatbubblesOutline, personOutline, calendarOutline, walletOutline, calendar, person, chatbubbles, wallet, menu } from 'ionicons/icons'

    export default {
        name: 'Footer',
        components: {
            IonFooter, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonGrid, IonRow, IonMenuToggle
        },
        props: ['title'],
        setup(props, {emit}) {
            const user = computed(() => store.state.user);
            const router = useRouter();
            //
            const goToChat = () => {
                router.push({ name: 'Chat' })
            }
            //
            const goToProfile = () => {
                router.push({ name: 'Profile' })
            }
            //
            const goToIndex = () => {
                router.push('/')
            }
            //
            const goToWallet = () => {
                router.push({ name: 'Wallet' })
            }

            return {
                user, router, chatbubblesOutline, personOutline, calendarOutline, walletOutline, goToChat, goToProfile, goToIndex, goToWallet, calendar, person, chatbubbles, wallet, menu
            }
        }
    }
</script>

<style scoped>
    ion-icon {
        font-size: 30px;
    }
    .color-primary {
        color: var(--ion-color-primary)
    }
    .ion-menu_toggle {
        cursor: pointer;
    }

    @media (min-width: 769px)  {
        .adaptive-over-768 {
            justify-content: center!important;
        }
        .adaptive-over-768 > * {
            margin: 0 2rem;
        }
    }
</style>