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
            sub-header="На указанный адрес был отправлен запрос подтверждение"
            :buttons="['ВОЙТИ']"
            @didDismiss="confirmRequireFunc()"
        ></ion-alert>

        <!-- Content -->
        <div class="wrapper">
            
            <div>
                <h1 class="ion-text-start ion-no-margin header">
                    <ion-text color="primary">Deals</ion-text><ion-text color="success">.</ion-text>
                </h1>
                <h3 class="ion-text-start ion-no-margin">
                    <ion-text color="medium">...бизнес в ваших руках</ion-text>
                </h3>
            </div>
            
            <!-- Форма ввода логина и пароля -->
            <form @submit.prevent='register()'>
                <!-- Email -->
                <!-- <ion-input 
                    placeholder="Enter Email / Введите имейл"
                    type="email" 
                    v-model="email"    
                    class="ion-text-start ion-padding-vertical ion-padding-horizontal"
                ></ion-input> -->

                <ion-item id="email" fill="solid" ref="item" class="ion-no-padding">
                    <ion-label color="primary" position="floating">Адрес эл.почты</ion-label>
                    <ion-input type="email" @ionInput="validate" @ionBlur="markTouched" v-model="email" ></ion-input>
                    <ion-note v-if="email" slot="helper" color="success">Корректный адрес</ion-note>
                    <ion-note slot="error">Некорректный адрес</ion-note>
                </ion-item>
    
                <!-- Password -->
                <!-- <ion-input 
                    placeholder="Enter password / Введите пароль"
                    type="password" 
                    v-model="password"   
                    class="ion-text-start ion-padding-vertical ion-padding-horizontal" 
                ></ion-input> -->

                <ion-item fill="solid" ref="item" class="ion-no-padding">
                    <ion-label color="primary" position="floating">Пароль</ion-label>
                    <ion-input type="password" v-model="password"></ion-input>
                </ion-item>

                <!-- Confirm Password -->
                <!-- <ion-input 
                    placeholder="Confirm password / Повторите пароль"
                    type="password" 
                    v-model="confirmPassword"   
                    class="ion-text-start ion-padding-vertical ion-padding-horizontal" 
                ></ion-input> -->

                <ion-item id="confirmPassword" fill="solid" ref="item" class="ion-no-padding ion-margin-bottom">
                    <ion-label color="primary" position="floating">Повтор пароля</ion-label>
                    <ion-input type="password" @ionInput="confirmPasswordValidate" @ionBlur="markTouched" v-model="confirmPassword"></ion-input>
                    <ion-note v-if="confirmPassword" slot="helper" color="success">Совпадает</ion-note>
                    <ion-note slot="error">Не совпадает</ion-note>
                </ion-item>

                <br>
                <br>
    
                <div style="display: flex; flex-direction: column">
                    <!-- Открывает модалку выбора профиля -->
                    <ion-button @click="goToChooseProfile" color="dark">
                        Далее
                    </ion-button>
    
                    <!-- Ссылка на экран логина -->
                    <ion-text color="primary" class="ion-margin-top">
                        <router-link :to="{ name: 'Login' }">Войти</router-link>
                    </ion-text>
                </div>

                <ion-modal 
                    :isOpen="isChooseProfileModalOpened"
                >
                    <ion-header translucent="true" >
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <!-- <ion-button @click="closeProfileMenu">Назад</ion-button> -->
                                <ion-back-button  default-href="/register" text="Назад" @click="closeProfileMenu"></ion-back-button>
                            </ion-buttons>
                        </ion-toolbar>
                    </ion-header>
                    <!--  -->
                    <ion-content class="ion-padding" forceOverscroll="false">
                        
                        <!--  -->
                        <ion-item-group>
                            <ion-text>
                                <h3>Выберите профиль</h3>
                            </ion-text>
                        </ion-item-group>

                        <ion-chip class="ion-margin-top">
                            <ion-select interface="action-sheet" placeholder="Выберите профиль" cancelText="Отменить" v-model="userWorkProfile" @ionChange="setProfile($event)">
                                <ion-select-option
                                    v-for="(item, index) in userWorkProfileArray"
                                    :key="index"
                                    :value="item"
                                >
                                    {{item}}
                                </ion-select-option>
                            </ion-select>
                        </ion-chip>
                        {{userAccountSetting}}
                        <br>
                        {{ userWorkProfile }}

                        <!-- Кнопка регистрации -->
                        <div style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999">
                            <ion-button 
                                class="ion-margin"
                                type="submit" 
                                color="success" 
                                expand="block"
                                @click="register()"
                            >
                                <ion-text color="light" >
                                    Зарегистрироваться
                                </ion-text>
                            </ion-button>
                        </div>

                        <!-- Spinner -->
                        <Spinner v-if="spinner"/>
                    </ion-content>
                </ion-modal>
            </form>

        </div>

    </div>
</template>

<script>
    import { ref, defineComponent, onMounted } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRouter } from 'vue-router';
    import { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, IonNote, IonList, IonSelect, IonSelectOption, IonChip, IonHeader, IonModal, IonToolbar, IonButtons, IonItemGroup, IonBackButton } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    //
    import { uid } from 'uid';
    //
    import store from '../../store/index';

    export default defineComponent ({
        name: 'register',
        components: { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, Spinner, IonNote, IonList, IonSelect, IonSelectOption, IonChip, IonHeader, IonModal, IonToolbar, IonButtons, IonItemGroup, IonBackButton },
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

            onMounted(() => {
                userWorkProfileArray.value = store.state.userWorkProfileArray
            })

            //
            const setProfile = (event) => {
                // console.log(event.target.value)
                userAccountSetting.value.userWorkProfile = event.target.value
                console.log(userWorkProfile.value)
            }

            // Шаблон для создания строки под настройки пользваотеля в БД accountSettings
            const userAccountSetting = ref({
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
            const called = ref(false)
            const register = async () => {

                if (userWorkProfile.value === '') {
                    alert('Register: Выберите профиль')
                } else if (password.value !== confirmPassword.value) {
                    alert('Register: Пароль не совпадает')
                } else if (allAccountEmails.value.includes(email.value)) {
                    alert('Register: Аккаунт с указанным имейлом уже существует')
                } else if (password.value === confirmPassword.value) {
                    spinner.value = true;
                    called.value = true;
                    try {
                    const { error } = await supabase.auth.signUp({
                        email: email.value,
                        password: password.value
                    });
                    if (error) throw error;
                    confirmRequire.value = true
                    // router.push({ name: 'Login' })
                    console.log(email.value)
                    // Здесь имейл уже подтянулся
                    userAccountSetting.value.email = email.value
                    createAccountSettings()
                    closeProfileMenu()
                    // setTimeout(() => {
                    // }, 3000)
                    } catch (error) {
                    // errorMsg.value = error.message;
                    setTimeout(() => {
                        errorMsg.value = null;
                    }, 5000)
                    }
                    return;
                }
                // errorMsg.value = 'Error: Passwords do not match'
                setTimeout(() => {
                    errorMsg.value = null;
                }, 5000)
            };

            // confirm alert
            const confirmRequireFunc = () => {
                isOpenRef.value = !isOpenRef.value;
                router.push({ name: 'Login' });
            }

            // show alert of errorMsg
            const setOpen = () => isOpenRef.value = !isOpenRef.value; 

            //
            const createAccountSettings = async () => {
                try {
                    const { error } = await supabase.from('accountSettings').insert([userAccountSetting.value])
                    if (error) throw error;
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }

            //
            const validateEmail = (email) => {
                // return email.match(/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

                return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            }

            //
            const validateConfirmPassword = (confirmPassword) => {
                return confirmPassword.match(password.value)
            }

            //
            const validate = (ev) => {
                // const item = document.querySelector('ion-item');
                const item = document.getElementById('email')
                const value = ev.target.value;
                item.classList.remove('ion-valid');
                item.classList.remove('ion-invalid');

                if (value === "") return;

                validateEmail(value) ? item.classList.add('ion-valid') : item.classList.add('ion-invalid');
            }

            //
            const confirmPasswordValidate = (ev) => {
                // const item = document.querySelector('ion-item');
                const item = document.getElementById('confirmPassword')
                const value = ev.target.value;
                item.classList.remove('ion-valid');
                item.classList.remove('ion-invalid');

                if (value === "") return;

                validateConfirmPassword(value) ? item.classList.add('ion-valid') : item.classList.add('ion-invalid');
            }

            //
            const markTouched = () => {
                const item = document.querySelector('ion-item');
                item.classList.add('ion-touched');
            }

            const isChooseProfileModalOpened = ref(false)
            const allSettings = ref()
            const allAccountEmails = ref([])
            const goToChooseProfile = async () => {
                if(!email.value || email.value === '') {
                    alert('Register: укажите имейл')
                } else if (!password.value || password.value === '') {
                    alert('Register: укажите пароль')
                } else if (!confirmPassword.value || confirmPassword.value !== password.value) {
                    alert('Register: пароль не совпадает')
                } else {
                    isChooseProfileModalOpened.value = true
                    userWorkProfile.value = ''
                    userAccountSetting.value.userWorkProfile = null
                    // 
                    await store.methods.getAllSettingsFromDB()
                    // console.log(email.value)         
                    allSettings.value = store.state.allSettings
                    allSettings.value.forEach(account => {
                        allAccountEmails.value.push(account.email)
                    })
                }

            // const password = ref(null);
            // const confirmPassword = ref(null);
            }
            const closeProfileMenu = () => {
                // userWorkProfile.value = ''
                isChooseProfileModalOpened.value = false
                // userAccountSetting.value.userWorkProfile = null
            }

            const click = () => {
                console.log('clicked')
            }

            return {
                email, password, confirmPassword, spinner, confirmRequire, confirmRequireFunc, errorMsg, register, isOpenRef, isOpenRef, setOpen, userAccountSetting, createAccountSettings, validateEmail, validate, markTouched, validateConfirmPassword, confirmPasswordValidate, userWorkProfile, userWorkProfileArray, setProfile, isChooseProfileModalOpened, closeProfileMenu, goToChooseProfile, click, called, allSettings, allSettings
            }
        }
    })
</script>

<style scoped>
    ion-toolbar {
        --border-style: none;
        --background: white;
    }
    .wrapper {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .header {
        font-size: 70px;
        font-weight: bold;
    }

    ion-item{
        --inner-padding-end: 0px;
        --padding-start:0px
    }
    ion-select {
        --placeholder-opacity: 1;
        --padding-start: 5px;
        --padding-bottom: 0;
        --padding-top: 0;
        --padding-end: 5px;
    }
    ion-list {
        border-radius: 20px;
        background-color: transparent
    }

    .width-100 {
        --width: 100%;
    }
</style>