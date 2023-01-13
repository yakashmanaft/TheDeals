<template v-show="user">
    <!-- page header -->
    <ion-header translucent="true">
        <ion-toolbar color="white">
            
            <!-- КНОПКИ СЛЕВА -->
            <ion-buttons slot="start">

                <!-- КНОПКА НАЗАД -->
                <ion-back-button class="color-primary" v-if="(router.currentRoute._value.meta.title !== 'Calendar' || router.currentRoute._value.meta.title === 'My finance') && isHasSubstring() === false" default-href="/" text="Назад"></ion-back-button>
            </ion-buttons>

            <!-- ЗАГОЛОВОК В СЕРЕДИНЕ -->
            <ion-title ><h4 class="ion-no-margin">{{ title }}</h4></ion-title>

            <!-- КНОПКИ СПРАВА -->
            <ion-buttons slot="end">
                <!-- RECIPE STORE BUSKET -->
                <ion-button class="relative" v-if="router.currentRoute._value.meta.title === 'Recipes Store'" @click="$emit('goToBusket')">
                    <ion-icon :icon="bagOutline"></ion-icon>
                    <div class="absolute cart flex-center">
                        <ion-text>99</ion-text>
                    </div>
                </ion-button>

                <!-- RECIPE STORE -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Recipes'" @click="$emit('goToStore')">
                    <ion-icon color="primary" :icon="storefrontOutline"></ion-icon>
                </ion-button>

                <!-- SETTINGS -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Calendar'" @click="$emit('goToSettings', true)">
                    <ion-icon color="primary" :icon="settingsOutline"></ion-icon>
                </ion-button>

                <!-- WAREHOUSE MENU -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Warehouse'" @click="$emit('goToWarehouseMenu', true)">
                    <ion-icon color="primary" :icon="ellipsisHorizontal"></ion-icon>
                </ion-button>

                <!-- Filter -->
                <ion-button v-if="router.currentRoute._value.meta.title === 'Deals'" @click="$emit('setFilter')" class="relative">
                    <ion-icon color="primary" :icon="funnelOutline"></ion-icon>
                    <div v-if="filterBy !== 'all'" class="absolute filterIndicator"></div>
                </ion-button>

            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<script>
    import store from '../../store/index';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButtons, IonButton, IonBackButton, IonTitle } from '@ionic/vue';
    import { menu, walletOutline, settingsOutline, qrCodeOutline, storefrontOutline, bagOutline, funnelOutline, ellipsisHorizontal } from 'ionicons/icons';

    export default {
        name: 'Header',
        components: {
            IonHeader, IonMenuToggle, IonToolbar, IonIcon, IonGrid, IonRow, IonText, IonButtons, IonButton, IonBackButton, IonTitle
        },
        props: ['title', 'filterBy'],
        setup(props, { emit }) {
            const user = computed(() => store.state.user);
            const router = useRouter();
            console.log(router.options.history.state.back)
            const isHasSubstring = () => {
                let historyBack = router.options.history.state.back
                let substring = '/view-deal/'
                if(historyBack === null || historyBack.indexOf(substring) === -1) {
                    return false
                } else {
                    return true
                }
            }

            return {
                user, router, menu, walletOutline, settingsOutline, qrCodeOutline, settingsOutline, storefrontOutline, bagOutline, funnelOutline, ellipsisHorizontal, isHasSubstring
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
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .cart {
        border-radius: 100%;
        right: -0.3rem;
        top: 0;
        background-color: var(--ion-color-warning);
        width: 1.2rem; 
        height: 1.2rem;
        padding: 0.7rem;
    }
    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cart ion-text {
        color: #fff;
        font-size: 0.8rem;
    }
    .filterIndicator {
        width: 1rem; 
        height: 1rem;
        background-color: var(--ion-color-warning);
        border-radius: 100%;
        right: 0rem;
        bottom: 0;
    }
</style>