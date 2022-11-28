<template>
    <ion-menu side="end" menu-id="first" content-id="main" :type="menuType">
        <!-- menu header -->
        <ion-list-header class="ion-padding-top" lines="full">
            <ion-grid class="ion-no-margin ion-no-padding">
                <ion-row class="ion-align-items-center">
                    <ion-col>
                        <router-link :to="{ name: 'Profile'  }">
                            <!-- Аватар, поидее должен подгружать из настроек аккаунта -->
                            <ion-avatar v-if="avatarFileName" >
                                <!-- Если в БД есть запись url -->
                                <img :src="avatarUrl" />
                            </ion-avatar>

                            <!-- Если null -->
                            <ion-avatar v-else class="no-avatar">
                                <ion-icon style="font-size: 2rem;" color="light" :icon="person"></ion-icon>
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
                            <ion-text class="account">{{userProfile}}</ion-text>
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
        <ion-content class="ion-padding-vertical" forceOverscroll="false">
            <ion-list>
                <ion-item v-for="(item, index) in currentMenuList" :key="index" lines="none">
                    <ion-icon :icon="`${item.icon}`" color="primary" :alt="`${item.icon}`" class="ion-margin-end"/>
                    <router-link :to="{ name: `${item.name}` }" :class="{ 'current-route': item.title === currentRoute }"> {{ item.title }}</router-link>
                </ion-item> 
                <!-- Ссылкана магазин рецептов -->
                <ion-item v-if="userProfile === 'Тортодилер'" lines="none">
                    <ion-icon :icon="storefrontOutline" color="primary" class="ion-margin-end"></ion-icon>
                    <router-link :to="{ name: 'RecipesStore' }">
                        Магазин рецептов
                    </router-link>
                </ion-item>
            </ion-list>
        </ion-content>
        <!-- menu footer -->
        <div>
            <ion-list lines="none">
                <ion-item>
                    <ion-icon :icon="helpCircleOutline" color="primary" class="ion-margin-end"></ion-icon>
                    <router-link :to="{ name: 'FAQ' }">Помощь</router-link>
                </ion-item>
            </ion-list>
            <!-- Предложение установить сервис в виде приложения -->
            <PWAPrompt class="ion-margin-top"/>
            <br>
        </div>
    </ion-menu>
</template>

<script>
    import store from '../store/index';
    import { defineComponent, ref, computed, watchEffect, onMounted } from 'vue';
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
    import { exitOutline, helpCircleOutline, person, storefrontOutline } from 'ionicons/icons';

    export default defineComponent({
        name: 'NavigationMenu',
        components: {
            IonIcon, IonMenu, IonListHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonText, PWAPrompt, IonAvatar, IonGrid, IonRow, IonCol
        },
        props: {
            title: String,
            avatar: String,
        },
        setup(props, {emit}) {
            //
            const currentRoute = ref(props.title)
            const avatarFileName = ref()
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            //Get user email
            const userEmail = user.value.email
            //
            const userProfile = ref('')
            // menu items array
            const menuList = ref(store.state.menuList)
            //
            onMounted(async () => {
                await store.methods.getUserSettingsfromDB()
                userProfile.value = store.state.userSettings[0].userWorkProfile
                avatarFileName.value = store.state.userSettings[0].avatar_url
                await getCurrentMenuList()
                // console.log(avatarFileName.value)
                await downloadImage()
                // console.log(avatarUrl.value)
            })
            //
            const avatarUrl = ref()
            const downloadImage = async () => {
                try {
                    const { data, error } = await supabase.storage
                    .from('avatars')
                    .download(avatarFileName.value);
                    if (error) throw error;
                    avatarUrl.value = URL.createObjectURL(data);
                } catch (error) {
                    console.error('Error downloading image: ', error.message);
                }
            };
            // Logout function
            const logout = async () => {
                await supabase.auth.signOut();
                router.push({ name: 'Login' });
            }
            //
            const currentMenuList = ref([])
            const getCurrentMenuList = async () => {
                // console.log(userProfile.value)
                // console.log(menuList.value.filter(item => item.name !== 'Recipes'))
                if(userProfile.value === 'Автозапчасти') {
                    currentMenuList.value = menuList.value.filter(item => item.name !== 'Recipes')
                } else if(userProfile.value === 'Тортодилер') {
                    currentMenuList.value = menuList.value
                }
                return currentMenuList.value
            }
            //
            const menuType = ref('overlay')
            //
            watchEffect(() => {
                currentRoute.value = props.title;
                // avatarFileName.value = props.avatar
            })
            console.log(currentRoute.value)

            return {
                user, router, userEmail, logout, menuList, exitOutline, helpCircleOutline, menuType, currentRoute, person, getCurrentMenuList, userProfile, currentMenuList, storefrontOutline, avatarFileName, downloadImage, avatarUrl
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
    ion-avatar {
        height: 5rem;
        width: 5rem;
        display: block
    }

    .account-avatar {
        width: 100%;
        height: 100%;
    }
    .current-route {
        font-weight: bold;
        color: var(--ion-color-primary)
    }
    .no-avatar {
        overflow: hidden;
        /* display: flex;
        justify-content: center;
        align-items: flex-end; */
        background-color: var(--ion-color-medium)
    }
    .no-avatar ion-icon {
        width: 100%;
        height: 115%;
    }
</style>