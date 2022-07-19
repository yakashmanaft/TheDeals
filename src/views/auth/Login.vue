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
            <form @submit.prevent='login()'>
                <!-- Email -->
                <ion-input 
                    placeholder="Enter Email / Введите имейл"
                    type="email" 
                    v-model="email"    
                    class="ion-text-start ion-padding-vertical ion-padding-horizontal"
                ></ion-input>
    
                <!-- Password -->
                <ion-input 
                    placeholder="Enter password / Введите пароль"
                    type="password" 
                    v-model="password"   
                    class="ion-text-start ion-padding-vertical ion-padding-horizontal" 
                ></ion-input>
    
                <!-- Button -->
                <ion-button 
                    class="ion-margin-vertical"
                    type="submit" 
                    color="success" 
                    expand="block"
                >
                    <ion-text color="light" >
                        Войти
                    </ion-text>
                    
                </ion-button>
                <!-- Ссылка на экран регистрации -->
                <ion-text color="primary">
                    <router-link :to="{ name: 'Register' }">Еще нет аккаунта?</router-link>
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
    import Spinner from '../../components/Spinner.vue'

    export default defineComponent ({
        name: 'login',
        components: { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, Spinner },
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
                try {
                    const { error } = await supabase.auth.signIn({
                        email: email.value,
                        password: password.value
                    });
                    if (error) throw error;
                    spinner.value = true
                    setTimeout(() => {
                        router.push({ name: 'Calendar' })
                    }, 3000)
                    
                } catch (error) {
                    errorMsg.value = `Error: ${error.message}`;
                    setTimeout(() => {
                        errorMsg.value = null
                    }, 5000)
                }
            }

            // show alert of errorMsg
            const setOpen = () => isOpenRef.value = !isOpenRef.value; 

            return {
                email, password, errorMsg, login, spinner, isOpenRef, setOpen
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