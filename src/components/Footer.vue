<template v-show="user">
    <ion-footer style="position:fixed; bottom: 0;" translucent="true">
        <ion-toolbar class="ion-no-border" color="white">
            <ion-buttons >
                <ion-grid class="ion-no-padding" style="margin: 0.6rem auto">
                    <ion-row class="ion-justify-content-around">

                        <!-- Профиль пользователя -->
                        <ion-button class="ion-margin-vertical" @click="goToProfile()">
                            <ion-icon v-if="router.currentRoute._value.meta.title === 'Profile'" :icon="person"></ion-icon>
                            <ion-icon v-else :icon="personOutline"></ion-icon>
                        </ion-button>

                        <!-- Calendar -->
                        <ion-button class="ion-margin-vertical" @click="goToIndex()">
                            <ion-icon v-if="router.currentRoute._value.meta.title === 'Calendar'" :icon="calendar"></ion-icon>
                            <ion-icon v-else :icon="calendarOutline"></ion-icon>
                        </ion-button>

                        <!-- Чат -->
                        <ion-button class="ion-margin-vertical" @click="goToChat()">
                            <ion-icon v-if="router.currentRoute._value.meta.title === 'Chat'" :icon="chatbubbles"></ion-icon>
                            <ion-icon v-else :icon="chatbubblesOutline"></ion-icon>
                        </ion-button>
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
    import { IonFooter, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonGrid, IonRow } from '@ionic/vue';
    import { chatbubblesOutline, personOutline, calendarOutline, calendar, person, chatbubbles } from 'ionicons/icons'

    export default {
        name: 'Footer',
        components: {
            IonFooter, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonGrid, IonRow
        },
        props: ['title'],
        setup(props, {emit}) {
            const user = computed(() => store.state.user);
            const router = useRouter();
            //
            const goToChat = () => {
                alert('Footer: Чат в разработке...')
            }
            //
            const goToProfile = () => {
                router.push({name: 'Profile'})
            }
            //
            const goToIndex = () => {
                router.push('/')
            }

            return {
                user, router, chatbubblesOutline, personOutline, calendarOutline, goToChat, goToProfile, goToIndex, calendar, person, chatbubbles
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
</style>