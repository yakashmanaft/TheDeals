<template v-show="user">
    <!-- page header -->
    <ion-header translucent="true">
        <ion-toolbar color="white">
            
            <!-- КНОПКИ СЛЕВА -->
            <ion-buttons class="color-primary" slot="start">
                <!-- В КОШЕЛЕК -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Calendar'" @click="goToWallet()">
                    <ion-icon :icon="walletOutline" />
                </ion-button>
                <!-- КНОПКА НАЗАД, Если текущий роут НЕ Calendar -->
                <ion-back-button v-if="router.currentRoute._value.meta.title !== 'Calendar'" default-href="/" text="Назад"></ion-back-button>
            </ion-buttons>

            <!-- ЗАГОЛОВОК В СЕРЕДИНЕ -->
            <ion-title >{{ title }}</ion-title>

            <!-- КНОПКИ СПРАВА -->
            <ion-buttons slot="end">
                <!-- QR -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Wallet'" @click="goToPay()">
                    <ion-icon color="primary" :icon="qrCodeOutline"></ion-icon>
                </ion-button>

                <!-- Settings -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Warehouse'" @click="$emit('goToSettings', true)">
                    <ion-icon color="primary" :icon="settingsOutline"></ion-icon>
                </ion-button>

                <!-- BURGER -->
                <ion-menu-toggle v-if="router.currentRoute._value.meta.title === 'Calendar'">
                    <ion-icon :icon="menu" class/>
                </ion-menu-toggle>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<script>
    import store from '../../store/index';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButtons, IonButton, IonBackButton, IonTitle } from '@ionic/vue';
    import { menu, walletOutline, settingsOutline, qrCodeOutline } from 'ionicons/icons';

    export default {
        name: 'Header',
        components: {
            IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButtons, IonButton, IonBackButton, IonTitle
        },
        props: ['title'],
        setup(props, { emit }) {
            const user = computed(() => store.state.user);
            const router = useRouter();
            //
            const goToWallet = () => {
                router.push({ name: 'Wallet' })
            }
            //
            const goToPay = () => {
                alert('Сканируйте qr-код, чтобы оплатить. В разработке...')
            }

            //
            // const goToSettings = () => {
            //     alert('Настройки в разработке..')
            // }

            return {
                user, router, menu, walletOutline, settingsOutline, goToWallet, qrCodeOutline, goToPay, settingsOutline
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
    .color-primary {
        color: var(--ion-color-primary)
    }
    ion-menu-toggle {
        width: 30px;
        height: 30px;
    }
</style>