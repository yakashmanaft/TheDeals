<template>
    <div>
        <h1>Экран календарm</h1>  

        <ion-menu side="end" menu-id="first" content-id="main">
        <ion-header>
            <ion-toolbar color="primary">
            <ion-title>Example Menu</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
            <ion-item>Menu Item</ion-item>
            <ion-item><router-link to="/">Home</router-link></ion-item>
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

        <div class="ion-page" id="main" type="push">
        <ion-content>
            <ion-menu-toggle>
            <ion-button>Burger Menu
                <ion-icon :icon="grid" />
            </ion-button>
            </ion-menu-toggle>
            
        </ion-content>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import PWAPrompt from "../components/PWAPrompt.vue";
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
    import { grid } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';


    export default defineComponent({
        name: 'calendar',
        components: {
            PWAPrompt,
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
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);

            // Setup ref to router
            const router = useRouter();

            //Logout function
            const logout = async () => {
                await supabase.auth.signOut();
                router.push({ name: 'Login' })
            }

            return {
                grid, user, router, logout
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>