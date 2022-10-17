<template>
    <ion-menu side="start" menu-id="first" content-id="main">
        <!-- menu header -->
        <ion-list-header class="ion-padding-top" lines="full">
            <ion-grid class="ion-no-margin ion-no-padding">
                <ion-row class="ion-align-items-center">
                    <ion-col>
                        <router-link :to="{ name: 'Profile'  }">
                            <!-- Аватар, поидее должен подгружать из настроек аккаунта -->
                            <ion-avatar class="account-avatar">
                                <img src="img/common/user-avatar.png">
                            </ion-avatar>
                        </router-link>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <!-- Инфа по аккаунту -->
            <ion-grid class="ion-margin-vertical ion-no-padding">
                <ion-row class="ion-align-items-center">
                    <ion-col>
                        <ion-row>
                            <ion-text class="account">Аккаунт</ion-text>
                        </ion-row>
                        <ion-row>
                            <ion-text class="account-name">{{ userEmail }}</ion-text>
                        </ion-row>
                    </ion-col>
                    <ion-col size="2">
                        <ion-row>
                            <!-- Кнопка выхода из аккаунта -->
                            <ion-icon :icon="exitOutline" color="primary" @click="logout()"/>
                        </ion-row>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-list-header>
        <!-- menu content -->
        <ion-content class="ion-padding-vertical">
            <ion-list>
                <ion-item v-for="(item, index) in menuList" :key="index" lines="none" >
                    <ion-icon :icon="`${item.icon}`" color="primary" :alt="`${item.icon}`" class="ion-margin-end"/>
                    <router-link :to="{ name: `${item.name}` }"> {{ item.title }}</router-link>
                </ion-item> 
            </ion-list>
        </ion-content>
        <!-- menu footer -->
        <div>
            <ion-list lines="none">
                <ion-item>
                    <ion-icon :icon="settingsOutline" color="primary" class="ion-margin-end"></ion-icon>
                    <router-link :to="{ name: 'Settings' }">Настройки</router-link>
                </ion-item>
                <ion-item>
                    <ion-icon :icon="helpCircleOutline" color="primary" class="ion-margin-end"></ion-icon>
                    <router-link :to="{ name: 'FAQ' }">Помощь</router-link>
                </ion-item>
            </ion-list>
            <!-- Предложение установить сервис в виде приложения -->
            <PWAPrompt/>
        </div>
    </ion-menu>
</template>

<script>
    import store from '../store/index';
    import { defineComponent, ref, computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { 
        IonContent, 
        IonListHeader,
        IonItem, 
        IonList, 
        IonMenu, 
        IonTitle, 
        IonToolbar,
        IonIcon,
        IonText,
        IonAvatar,
        IonGrid,
        IonRow,
        IonCol
    } from '@ionic/vue';
    import PWAPrompt from '../components/PWAPrompt.vue';
    import { exitOutline, settingsOutline, helpCircleOutline } from 'ionicons/icons';

    export default defineComponent({
        name: 'NavigationMenu',
        components: {
            IonIcon, IonMenu, IonListHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonText, PWAPrompt, IonAvatar, IonGrid, IonRow, IonCol
        },
        props: [],
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            //Get user email
            const userEmail = user.value.email
            // Logout function
            const logout = async () => {
                await supabase.auth.signOut();
                router.push({ name: 'Login' });
            }
            // menu items array
            const menuList = ref(store.state.menuList)

            return {
                user, router, userEmail, logout, menuList, exitOutline, settingsOutline, helpCircleOutline
            }
        }
    })
</script>

<style scoped>
    ion-grid {
        width: 100%;
    }

    ion-list-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start
    }

    a {
        color: var(--ion-color-step-850)!important;
    }
    .account {
        font-size: 0.8rem; 
        font-weight: 400;
        color: var(--ion-color-medium)
    }

    .account-name {
        font-size: 1rem; 
        font-weight: 500;
    }

    .account-avatar {
        width: 4rem;
        height: 4rem;
    }
</style>