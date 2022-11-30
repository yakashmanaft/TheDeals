<template v-show="user">
    <!-- page header -->
    <ion-header translucent="true">
        <ion-toolbar color="white">
            
            <!-- КНОПКИ СЛЕВА -->
            <ion-buttons slot="start">

                <!-- RECIPE STORE -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Recipes'" @click="$emit('goToStore')">
                    <ion-icon color="primary" :icon="storefrontOutline"></ion-icon>
                </ion-button>

                <!-- SETTINGS -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Warehouse'" @click="$emit('goToSettings', true)">
                    <ion-icon color="primary" :icon="settingsOutline"></ion-icon>
                </ion-button>

                <!-- КНОПКА НАЗАД -->
                <ion-back-button class="color-primary" v-if="router.currentRoute._value.meta.title === 'Recipes Store' || router.currentRoute._value.meta.title === 'My finance'" default-href="/" text="Назад"></ion-back-button>
            </ion-buttons>

            <!-- ЗАГОЛОВОК В СЕРЕДИНЕ -->
            <ion-title >{{ title }}</ion-title>

            <!-- КНОПКИ СПРАВА -->
            <ion-buttons slot="end">
                <!-- RECIPE STORE BUSKET -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Recipes Store'" @click="$emit('goToBusket')">
                    <ion-icon :icon="bagOutline"></ion-icon>
                </ion-button>

                <!-- BURGER -->
                <ion-menu-toggle v-if="router.currentRoute._value.meta.title !== 'Recipes Store'">
                    <ion-icon :icon="menu"/>
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
    import { menu, walletOutline, settingsOutline, qrCodeOutline, storefrontOutline, bagOutline } from 'ionicons/icons';

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

            return {
                user, router, menu, walletOutline, settingsOutline, goToWallet, qrCodeOutline, goToPay, settingsOutline, storefrontOutline, bagOutline
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