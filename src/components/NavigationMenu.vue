<template>
    <ion-menu side="end" menu-id="first" content-id="main">
        <ion-list-header class="ion-padding-vertical" lines="full" color="light">
            <ion-avatar class="ion-margin-end ion-margin-bottom account-avatar">
                <!-- Аватар, поидее должен подгружать из настроек аккаунта -->
                <img src="img/common/user-avatar.png">
            </ion-avatar>
            <ion-text class="account">Аккаунт</ion-text>
            <ion-text class="account-name">{{ userEmail }}</ion-text>
        </ion-list-header>
        <ion-content>
            <ion-list>
                <ion-item v-for="(item, index) in menuList" :key="index" lines="none" >
                    <ion-icon :icon="`${item.icon}-outline`" color="primary" :alt="`${item.icon}`" class="ion-margin-end"/>
                    <router-link :to="{ name: `${item.name}` }"> {{ item.title }}</router-link>
                </ion-item> 
                <!-- Кнопка выхода из аккаунта -->
                <ion-item @click="logout()" lines="none" class="ion-margin-vertical">
                    <ion-text color="danger">Выйти из аккаунта</ion-text>
                </ion-item>
                <!-- Предложение установить сервис в виде приложения -->
                <PWAPrompt/>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>

<script>
    import store from '../store/index';
    import { ref, computed } from 'vue';
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
        IonAvatar
    } from '@ionic/vue';
    import PWAPrompt from '../components/PWAPrompt.vue';
    import { defineComponent } from 'vue';
    import { calendarOutline, peopleOutline } from 'ionicons/icons';

    // import { menu } from 'ionicons/icons';

    export default defineComponent({
        name: 'NavigationMenu',
        components: {
            IonIcon, IonMenu, IonListHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonText, PWAPrompt, IonAvatar
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
            const menuList = [
                {
                    name: 'Calendar',
                    title: 'Календарь',
                    icon: calendarOutline
                },
                {
                    name: 'Contacts',
                    title: 'Мои контакты',
                    icon: peopleOutline
                }
            ]

            return {
                user, router, userEmail, logout, menuList, calendarOutline, peopleOutline
            }
        }
    })
</script>

<style scoped>
    ion-list-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start
    }

    a {
        color: var(--ion-color-step-850)!important;
    }
    .account {
        font-size: 0.6em; 
        font-weight: 400;
        color: var(--ion-color-medium)
    }

    .account-name {
        font-size: 0.8em; 
        font-weight: 500;
    }

    .account-avatar {
        width: 3em;
        height: 3em;
    }
</style>