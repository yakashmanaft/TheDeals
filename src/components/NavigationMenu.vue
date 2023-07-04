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
                <ion-item v-for="(el, i) in currentMenuList" :key="i" lines="none">
                    <ion-icon :icon="`${el.icon}`" :color="el.title === currentRoute ? 'primary' : 'medium'" :alt="`${el.icon}`" class="ion-margin-end"/>
                    <router-link :to="{ name: `${el.name}` }" :class="{ 'current-route': el.title === currentRoute }"> {{ el.title }}</router-link>
                </ion-item> 
                
                <!-- Ссылкана на панель админа -->
                <!-- <ion-item v-if="userProfile === 'Тортодилер'" lines="none">
                    <ion-icon :icon="storefrontOutline" color="primary" class="ion-margin-end"></ion-icon>
                    <router-link :to="{ name: 'RecipesStore' }" :class="{ 'current-route': currentRoute === 'Магазин рецептов' }">
                        Магазин рецептов
                    </router-link>
                </ion-item> -->
            </ion-list>
        </ion-content>
        <!-- menu footer -->
        <div>
            <ion-list lines="none">
                <!-- В Админскую панель -->
                <ion-item v-if="userEmail === adminEmail">
                    <ion-icon :icon="accessibilityOutline" :color="currentRoute === 'Панель администратора' ? 'primary' : 'medium'" class="ion-margin-end"></ion-icon>
                    <router-link :to="{ name: 'AdminDashboard' }" :class="{ 'current-route': currentRoute === 'Панель администратора' }">Панель администратора</router-link>
                </ion-item>

                <!-- В помощь по сервису -->
                <ion-item>
                    <ion-icon :icon="helpCircleOutline" :color="currentRoute === 'Помощь' ? 'primary' : 'medium'" class="ion-margin-end"></ion-icon>
                    <router-link :to="{ name: 'FAQ' }" :class="{ 'current-route': currentRoute === 'Помощь' }">Помощь</router-link>
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
    import { defineComponent, ref, computed, watchEffect, onMounted, watch } from 'vue';
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
    import { exitOutline, helpCircleOutline, person, storefrontOutline, accessibilityOutline } from 'ionicons/icons';

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
            const fileName = ref(props.avatar)
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            //Get user email
            const userEmail = user.value.email
            const adminEmail = store.state.adminEmail
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

                // ИСПРАВИТЬ: ИСКЛЮЧИТЬ ОШИБКУ УСЛОВИЕМ 
                await downloadImage()

            })
            //
            const avatarUrl = ref()
            const downloadImage = async () => {
                if(avatarFileName.value) {
                    try {
                        const { data, error } = await supabase.storage
                        .from('avatars')
                        .download(avatarFileName.value);
                        if (error) throw error;
                        avatarUrl.value = URL.createObjectURL(data);
                    } catch (error) {
                        console.error('Error downloading image: ', error.message);
                    }
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
                fileName.value = props.avatar
            })

            // Выводим в консоль текующую страницу
            console.log(currentRoute.value)
            watch(fileName, () => {
                avatarFileName.value = fileName.value
                console.log(`avatarFileName: ${avatarFileName.value}`)
                console.log(`FileName: ${fileName.value}`)
                downloadImage()
            })

            return {
                user, router, userEmail, adminEmail, logout, menuList, exitOutline, helpCircleOutline, menuType, currentRoute, person, getCurrentMenuList, userProfile, currentMenuList, storefrontOutline, avatarFileName, downloadImage, avatarUrl, fileName, accessibilityOutline
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
        color: var(--ion-color-primary)!important
    }
    .no-avatar {
        overflow: hidden;
        background-color: var(--ion-color-medium)
    }
    .no-avatar ion-icon {
        width: 100%;
        height: 115%;
    }
</style>