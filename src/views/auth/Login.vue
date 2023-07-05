<template>
    <div class="ion-margin-horizontal">
        <!-- Error Handling -->
        <ion-alert 
            v-if="errorMsg"
            :is-open="errorMsg ? isOpenRef = true : isOpenRef = false"
            header="Логин или пароль неверны"
            sub-header="Важное сообщение"
            :message="errorMsg"
            :buttons="['OK']"
            @didDismiss="isOpenRef = false"
        ></ion-alert>

        <!-- Spinner -->
        <Spinner v-if="spinner"/>

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
            <form @submit.prevent='login()' style="height: 60%;">
                <!-- Email -->
                <!-- <ion-input 
                    placeholder="Enter Email / Введите имейл"
                    type="email" 
                    v-model="email"    
                    class="ion-text-start ion-padding-vertical ion-padding-horizontal"
                ></ion-input> -->

                <ion-item fill="solid" ref="item" class="ion-no-padding">
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
                <br>
                <br>

                <div style="display: flex; flex-direction: column; position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999">

                    <!-- Button -->
                    <ion-button 
                        class="ion-margin-vertical ion-margin"
                        type="submit" 
                        color="success" 
                        expand="block"
                    >
                        <ion-text color="light" >
                            Войти
                        </ion-text>
                        
                    </ion-button>
                    <!-- Ссылка на экран регистрации -->
                    <ion-button color="primary" fill="clear" @click="goToRegister()" class="ion-margin">
                        Создать аккаунт
                        <!-- <router-link :to="{ name: 'Register' }">Создать аккаунт</router-link> -->
                    </ion-button>

                </div>
            </form>

        </div>

    </div>
</template>

<script>
    import { ref, defineComponent } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRouter } from 'vue-router';
    import { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, IonNote } from '@ionic/vue';
    import Spinner from '../../components/Spinner.vue'

    export default defineComponent ({
        name: 'login',
        components: { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, Spinner, IonNote },
        setup() {
            // Create data / vars
            const router = useRouter();
            const email = ref(null);
            const password = ref(null);
            const errorMsg = ref(null);
            const isOpenRef = ref(false);
            const spinner = ref(null)

            // Login function
            const login = async () => {
                spinner.value = true
                try {
                    const { error } = await supabase.auth.signIn({
                        email: email.value,
                        password: password.value
                    });
                    if (error) throw error;
                    setTimeout(() => {
                        router.push({ name: 'Calendar' })
                    }, 2000)
                    
                } catch (error) {
                    errorMsg.value = `Error: ${error.message}`;
                    spinner.value = false
                    setTimeout(() => {
                        errorMsg.value = null
                    }, 5000)
                }
            }

            // 
            const goToRegister = () => {
                // :to="{ name: 'Register' }"
                router.push({ name: 'Register' })
            }

            // show alert of errorMsg
            const setOpen = () => isOpenRef.value = !isOpenRef.value; 

            //
            const validateEmail = (email) => {
                // return email.match(/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

                return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            }

            //
            const validate = (ev) => {
                const item = document.querySelector('ion-item');
                const value = ev.target.value;
                item.classList.remove('ion-valid');
                item.classList.remove('ion-invalid');

                if (value === "") return;

                validateEmail(value) ? item.classList.add('ion-valid') : item.classList.add('ion-invalid');
            }

            const markTouched = () => {
                const item = document.querySelector('ion-item');
                item.classList.add('ion-touched');
            }

            return {
                email, password, errorMsg, login, spinner, isOpenRef, setOpen, validateEmail, validate, markTouched, goToRegister
            }
        }
    })
</script>

<style scoped>
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
</style>