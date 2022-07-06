<template>
    <ion-menu side="end" menu-id="first" content-id="main">
        <ion-header>
            <ion-toolbar color="primary">
            <ion-title>Example Menu</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
            <ion-item>Menu Item</ion-item>
            <ion-item><router-link to="/">Календарь</router-link></ion-item>
            <ion-item><router-link to="/contacts">Мои контакты</router-link></ion-item>
            <ion-item><router-link to="/about">About</router-link></ion-item>
            <!-- Кнопка выхода из аккаунта -->
            <ion-item @click="logout()">
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
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { 
        IonContent, 
        IonHeader, 
        IonItem, 
        IonList, 
        IonMenu, 
        IonMenuToggle,
        IonButton,
        IonTitle, 
        IonToolbar,
        IonIcon,
        IonText
    } from '@ionic/vue';
    import PWAPrompt from '../components/PWAPrompt.vue';
    import { defineComponent } from 'vue';

    // import { menu } from 'ionicons/icons';

    export default defineComponent({
        name: 'NavigationMenu',
        components: {
            IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonText, PWAPrompt
        },
        props: [],
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Logout function
            const logout = async () => {
                await supabase.auth.signOut();
                router.push({ name: 'Login' });
            }

            return {
                user, router, logout
            }
        }
    })
</script>

<style scoped>

</style>