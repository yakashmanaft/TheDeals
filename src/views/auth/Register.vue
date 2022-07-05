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
            @didDismiss="setClose()"
        ></ion-alert>

        <div class="wrapper">
            <!-- Content -->
            <div>
                <h1 class="ion-text-start ion-no-margin header">
                    <ion-text color="primary">Deals</ion-text><ion-text color="success">.</ion-text>
                </h1>
                <h2 class="ion-text-start ion-no-margin">
                    <ion-text color="medium">...в ваших руках</ion-text>
                </h2>
            </div>
            
            <!-- Форма ввода логина и пароля -->
            <form @submit.prevent='register()'>
                <!-- Email -->
                <ion-input 
                    placeholder="Enter Email / Введите имейл"
                    type="email" 
                    v-model="email"    
                    class="ion-text-start ion-padding-vertical ion-margin-horizontal"
                ></ion-input>
    
                <!-- Password -->
                <ion-input 
                    placeholder="Enter password / Введите пароль"
                    type="password" 
                    v-model="password"   
                    class="ion-text-start ion-padding-vertical ion-margin-horizontal" 
                ></ion-input>

                <!-- Confirm Password -->
                <ion-input 
                    placeholder="Confirm password / Повторите пароль"
                    type="password" 
                    v-model="confirmPassword"   
                    class="ion-text-start ion-padding-vertical ion-margin-horizontal" 
                ></ion-input>
    
                <!-- Button -->
                <ion-button 
                    class="ion-margin-vertical"
                    type="submit" 
                    color="warning" 
                    expand="block"
                >
                    <ion-text color="light" >
                        Зарегистрироваться
                    </ion-text>
                    
                </ion-button>
                <!-- Ссылка на экран регистрации -->
                <ion-text color="primary">
                    <router-link :to="{ name: 'Login' }">Уже есть аккаунт?</router-link>
                </ion-text>
            </form>

        </div>

    </div>
</template>

<script>
    import { ref, defineComponent } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRouter } from 'vue-router';
    import { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert } from '@ionic/vue';

    export default defineComponent ({
        name: 'register',
        components: { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert },
        setup() {
            // Create data / vars
            const router = useRouter();
            const email = ref(null);
            const password = ref(null);
            const confirmPassword = ref(null);
            const errorMsg = ref(null);
            const isOpenRef = ref(false);

            // Register function
            const register = async () => {
            if (password.value === confirmPassword.value) {
                try {
                const { error } = await supabase.auth.signUp({
                    email: email.value,
                    password: password.value
                });
                if (error) throw error;
                router.push({ name: 'Login' })
                } catch (error) {
                errorMsg.value = error.message;
                setTimeout(() => {
                    errorMsg.value = null;
                }, 5000)
                }
                return;
            }
            errorMsg.value = 'Error: Passwords do not match'
            setTimeout(() => {
                errorMsg.value = null;
            }, 5000)
            };

            // show alert of errorMsg
            const setOpen = () => isOpenRef.value = !isOpenRef.value; 

            return {
                email, password, errorMsg, register, isOpenRef, isOpenRef, setOpen
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
</style>