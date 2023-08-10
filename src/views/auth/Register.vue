<template>
    <div class="ion-margin-horizontal">
        <!-- Error Handling -->
        <ion-alert 
            v-if="errorMsg"
            :is-open="errorMsg ? isOpenRef = true : isOpenRef = false"
            header="Что-то не вписали"
            sub-header="Важное сообщение"
            :message="errorMsg"
            :buttons="['OK']"
            @didDismiss="isOpenRef = false"
        ></ion-alert>

        <!-- Confirm email alert-->
        <ion-alert
            v-if="confirmRequire"
            :is-open="confirmRequire ? isOpenRef = true : isOpenRef = false"
            header="Потдвердите почту"
            :sub-header="`На адрес ${userAccountSettings.email} был отправлен запрос-подтверждение`"
            :buttons="['ВОЙТИ']"
            @didDismiss="confirmRequireFunc()"
        ></ion-alert>
        
        <!-- Spinner -->
        <Spinner v-if="spinner"/>

        <!-- Content -->
        <div class="wrapper">

            <Logo style="margin-top: 2rem;"/>
            
            <form style="width: 100%;">
                
                <LogRegFrom 
                    v-if="!isChooseProfileModalOpened"
                    @chooseProfile="goToChooseProfile"
                    @toLogin="goToLogin"
                />
    
                <set-user-profile 
                    v-else
                    @toReg="goToReg"
                    :userWorkProfileArray="userWorkProfileArray"
                    :userWorkProfile="userAccountSettings.userWorkProfile"
                    @makeRegister="register"
                />
            </form>



            <!-- <form @submit.prevent='register()' style="width: 100%"> -->
<!-- 
                 <div> -->

                    <!-- Email -->
                    <!-- <ion-item id="email" fill="solid" ref="item" class="ion-no-padding">
                        <ion-label color="primary" position="floating">Адрес эл.почты</ion-label>
                        <ion-input type="email" @ionInput="validate" @ionBlur="markTouched" v-model="email" ></ion-input>
                        <ion-note v-if="email" slot="helper" color="success">Корректный адрес</ion-note>
                        <ion-note slot="error">Некорректный адрес</ion-note>
                    </ion-item> -->
    
                    <!--  Пароль -->
                    <!-- <ion-item fill="solid" ref="item" class="ion-no-padding">
                        <ion-label color="primary" position="floating">Пароль</ion-label>
                        <ion-input type="password" v-model="password"></ion-input>
                    </ion-item> -->
    
                    <!-- Confirm Password -->
                    <!-- <ion-item id="confirmPassword" fill="solid" ref="item" class="ion-no-padding ion-margin-bottom">
                        <ion-label color="primary" position="floating">Повтор пароля</ion-label>
                        <ion-input type="password" @ionInput="confirmPasswordValidate" @ionBlur="markTouched" v-model="confirmPassword"></ion-input>
                        <ion-note v-if="confirmPassword" slot="helper" color="success">Совпадает</ion-note>
                        <ion-note slot="error">Не совпадает</ion-note>
                    </ion-item> -->
                    
                                    <!-- Перейти в ЛОГИН или ДАЛЕЕ -->
                    <!-- <div class="buttons-group" :class="{'z-index-none' : spinner}"> -->
    
                        <!-- Делаем Сабмит -->
                        <!-- <ion-button v-if="isChooseProfileModalOpened" @click="register()" class="ion-margin">Создать аккаунт</ion-button> -->
                        
                        <!-- Открывает модалку выбора профиля -->
                        <!-- <ion-button v-else @click="goToChooseProfile" color="dark" class="ion-margin">Далее</ion-button> -->
    
                        <!-- Просто закрыть модалку выбора профиля -->
    
                        <!-- Ссылка на экран логина -->
                        <!-- <ion-button v-if="isChooseProfileModalOpened" color="primary" fill="clear" class="ion-margin" @click="isChooseProfileModalOpened = false"> -->
                            <!-- Назад
                        </ion-button> -->
    
                        <!-- Ссылка на экран логина -->
                        <!-- <ion-button v-else color="primary" fill="clear" class="ion-margin" @click="goToLogin()"> -->
                            <!-- Уже есть аккаунт -->
                            <!-- <router-link :to="{ name: 'Login' }" style="color: white">Войти</router-link> -->
                        <!-- </ion-button> -->
                    <!-- </div>
                </div> -->

                <!-- Модалка выбора профиля -->
                <!-- <ion-modal :isOpen="isChooseProfileModalOpened" @didDismiss="isChooseProfileModalOpened = false">

                    <ion-content forceOverscroll="false">


                        <div :class="{'display-none' : spinner}" class="header-group">
                                
                            <ion-item-group class="ion-text-center">
                                <ion-text>
                                    <h4>Выберите профиль:</h4>
                                </ion-text>
                            </ion-item-group>

                            
                            <ion-item-group class="ion-text-center ion-margin-vertical">
                                <ion-text color="primary">
                                    {{userAccountSettings.userWorkProfile}}
                                </ion-text>
                            </ion-item-group>

                        </div> 


                        <ion-grid style="display: flex; align-items: center; justify-content: center; height: 90%" :class="{'display-none' : spinner}">
                            <swiper
                                v-if="userWorkProfileArray.length !== 0"
                                :modules="modules"
                                :pagination="true" 
                                :slides-per-view="1" 
                                :space-between="0"
                                :loop="false"
                                @slideChange="onSlideChange"
                            >
                                <swiper-slide
                                    v-for="(slideContent, index) in userWorkProfileArray"
                                    :key="index"
                                    :virtualIndex="index"
                                >
                                    <div style="padding: 1rem; margin-bottom: 2rem;">
                                        <div style="display: flex; justify-content: center; align-items:center; border-radius: 50%; width: 100%; height: 100%; overflow: hidden; border: 1px solid var(--ion-color-light)" class="swiper-lazy-preloader-white" >
                                            <ion-img loading="lazy" style="width: 100%; height: 100%; object-fit: contain!important;" :src="`../img/profiles/${translateUserProfileToImg(userAccountSettings.userWorkProfile)}.webp`"></ion-img>
                                        </div>
                                    </div>
                                </swiper-slide>
                            </swiper>

                        </ion-grid>

                    </ion-content>



                    <Spinner v-if="spinner"/>
                </ion-modal> -->


                <br>
                <br>
                
                <!-- </form> -->
                
            </div>
            
        </div>

        <!--  -->
        <copyright/>
</template>

<script>
    import { ref, defineComponent, onMounted } from 'vue';
    import { supabase } from '../../supabase/init';
    import store from '../../store/index';
    import { useRouter } from 'vue-router';
    import { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, IonNote, IonList, IonSelect, IonSelectOption, IonChip, IonModal, IonHeader, IonItemGroup, IonImg, IonGrid } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    import Logo from './Logo.vue';
    import LogRegFrom from './LogRegFrom.vue';
    import setUserProfile from '@/views/auth/setUserProfile.vue'
    //
    import { uid } from 'uid';
    //
    // import { Swiper, SwiperSlide } from 'swiper/vue';
    // import { Virtual, Pagination } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import '@ionic/vue/css/ionic-swiper.css';

    export default defineComponent ({
        name: 'register',
        components: { 
            Spinner, Logo, LogRegFrom, setUserProfile,
            //
            IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, IonNote, IonList, IonSelect, IonSelectOption, IonChip, IonModal, IonHeader, IonContent, IonItemGroup, IonImg, IonGrid,
            //
            // Swiper, SwiperSlide
        },
        setup() {
            // Create data / vars
            const router = useRouter();
            const email = ref(null);
            const password = ref(null);
            const confirmPassword = ref(null);
            const errorMsg = ref(null);
            const isOpenRef = ref(false);
            const spinner = ref(null);
            const confirmRequire = ref(null);
            const userWorkProfile = ref('');
            const userWorkProfileArray = ref([])

            const allSettings = ref()
            const allAccountEmails = ref([])

            onMounted(async () => {
                userWorkProfileArray.value = store.state.userWorkProfileArray
                await store.methods.getAllSettingsFromDB()
                // console.log(email.value)         
                allSettings.value = store.state.allSettings
                allSettings.value.forEach(account => {
                    allAccountEmails.value.push(account.email)
                })
                userAccountSettings.value.userWorkProfile = userWorkProfileArray.value[0]
            })

            //
            // const setProfile = (event) => {
            //     // console.log(event.target.value)
            //     userAccountSettings.value.userWorkProfile = event.target.value
            //     console.log(userWorkProfile.value)
            // }

            //
            const goToLogin = () => {
                isChooseProfileModalOpened.value = false
                router.push({ name: 'Login' })
            }
            const goToReg = () => {
                isChooseProfileModalOpened.value = false
            }

            // Шаблон для создания строки под настройки пользваотеля в БД accountSettings
            const userAccountSettings = ref({
                uid: uid(),
                // Здесь еще нет имейла
                email: email.value,
                userPriceList: [],
                userAdditionalAttributes: [],
                userWarehouseCategories: ['Без категории'],
                userRecipesCategories: ['Без категории'],
                weekendDays: [],
                daySaturation: [
                    {
                        name: 'low',
                        qty: 4
                    },
                    {
                        name: 'high',
                        qty: 8
                    }
                ],
                avatar_url: null,
                userWorkProfile: null,
                organization: [],
                userInfo: {}
            })

            // Register function
            const register = async (accountProfile) => {
                console.log(accountProfile)
                await store.methods.getAllSettingsFromDB()     
                let allSettings = store.state.allSettings
                let allAccountEmails = []
                allSettings.forEach(account => {
                    // console.log(account.email)
                    allAccountEmails.push(account.email)
                })

                if (userAccountSettings.value.userWorkProfile === '') {
                    alert('Register: Выберите профиль')
                } else if (password.value !== confirmPassword.value) {
                    alert('Register: Пароль не совпадает')
                } else if (allAccountEmails.includes(email.value)) {
                    alert('Register: Аккаунт с указанным имейлом уже существует')
                } 
                if (accountProfile === 'Автозапчасти') {
                    alert('Register: функционал профиля Автозапчасти в стадии разработки...')
                } 
                else if (password.value === confirmPassword.value) {
                //     spinner.value = true;
                    try {
                    const { error } = await supabase.auth.signUp({
                        email: email.value,
                        password: password.value
                    });
                    if (error) throw error;
                    setTimeout(() => {
                        confirmRequire.value = true
                //         // router.push({ name: 'Login' })
                        console.log(email.value)
                //         // Здесь имейл уже подтянулся
                        userAccountSettings.value.email = email.value.toLowerCase()
                //         // isChooseProfileModalOpened.value = false
                        createAccountSettings()
                    }, 3000)
                    } catch (error) {
                        errorMsg.value = error.message;
                        spinner.value = false
                        console.log('Мы пока не можем рассылать подтверждения!')
                        // setTimeout(() => {
                        //     errorMsg.value = null;
                        // }, 5000)
                    }
                    return;
                }
                // // errorMsg.value = 'Error: Passwords do not match'
                setTimeout(() => {
                    errorMsg.value = null;
                }, 5000)
            };

            // confirm alert
            const confirmRequireFunc = () => {
                isOpenRef.value = !isOpenRef.value;
                router.push({ name: 'Login' });
                isChooseProfileModalOpened.value = false
                
            }

            // show alert of errorMsg
            const setOpen = () => isOpenRef.value = !isOpenRef.value; 

            //
            const createAccountSettings = async () => {
                try {
                    const { error } = await supabase.from('accountSettings').insert([userAccountSettings.value])
                    if (error) throw error;
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }

            //
            // const validateEmail = (email) => {

            //     return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            // }

            //
            // const validateConfirmPassword = (confirmPassword) => {
            //     return confirmPassword.match(password.value)
            // }

            //
            // const validate = (ev) => {
            //     // const item = document.querySelector('ion-item');
            //     const item = document.getElementById('email')
            //     const value = ev.target.value;
            //     item.classList.remove('ion-valid');
            //     item.classList.remove('ion-invalid');

            //     if (value === "") return;

            //     validateEmail(value) ? item.classList.add('ion-valid') : item.classList.add('ion-invalid');
            // }

            //
            // const confirmPasswordValidate = (ev) => {
            //     // const item = document.querySelector('ion-item');
            //     const item = document.getElementById('confirmPassword')
            //     const value = ev.target.value;
            //     item.classList.remove('ion-valid');
            //     item.classList.remove('ion-invalid');

            //     if (value === "") return;

            //     validateConfirmPassword(value) ? item.classList.add('ion-valid') : item.classList.add('ion-invalid');
            // }

            //
            // const markTouched = () => {
            //     const item = document.querySelector('ion-item');
            //     item.classList.add('ion-touched');
            // }

            // ====================================== РАБОТА С МОДАЛКОЙ ВЫБОРА ПРОФИЛЯ =================================
            const isChooseProfileModalOpened = ref(false)
            const goToChooseProfile = (obj) => {
                if(!obj.email || obj.mail === '') {
                    alert('Register: укажите имейл')
                } else if (!obj.password || obj.password === '') {
                    alert('Register: укажите пароль')
                } else if (!obj.confirmPassword || obj.confirmPassword !== obj.password) {
                    alert('Register: пароль не совпадает')
                } else {
                    isChooseProfileModalOpened.value = true
                    
                    userWorkProfile.value = ''
                    // userAccountSettings.value.userWorkProfile = null
                    userAccountSettings.value.userWorkProfile = userWorkProfileArray.value[0]
                    email.value = obj.email
                    password.value = obj.password
                    confirmPassword.value = obj.confirmPassword
                }
            }
            // const onSlideChange = (swiper) => {
            //     // console.log(swiper)
            //     userAccountSettings.value.userWorkProfile = userWorkProfileArray.value[swiper.activeIndex]
            // }
            // const translateUserProfileToImg = (userWorkProfile) => {
            //     if(userWorkProfile) {
            //         if(userWorkProfile === 'Тортодилер') {
            //             return 'cake-backer'
            //         } else if (userWorkProfile === 'Автозапчасти') {
            //             return 'auto-parts'
            //         }
            //     }
            // }

            return {
                email, password, confirmPassword, spinner, confirmRequire, confirmRequireFunc, errorMsg, register, isOpenRef, isOpenRef, setOpen, userAccountSettings, createAccountSettings, userWorkProfile, userWorkProfileArray, goToChooseProfile, isChooseProfileModalOpened, goToLogin, goToReg
            }
        }
    })
</script>

<style scoped>
    .wrapper {
        max-width: 1200px;
        margin: 0 auto;
        height: 100vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-around;
    }
    @media (min-width: 620px) {
        .wrapper {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
        }
        .wrapper div {
            width: 50%
        }
    }
    .header {
        font-size: 70px;
        font-weight: bold;
    }


    /* 
    .buttons-group {
        display: flex; 
        flex-direction: column; 
        position: fixed; 
        bottom: 0; 
        left: 0; 
        width: 100%; 
        background-color: #fff; 
        z-index: 99999;
    }
    */


    .header-group {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
    }



    .display-none {
        display: none!important;
    }

</style>