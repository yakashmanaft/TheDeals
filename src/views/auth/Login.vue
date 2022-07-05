<template>
    <div>
        <!-- Error Handling -->
        <div v-if="errorMsg">
            <p>{{ errorMsg }}</p>
        </div>


        <!-- Content -->
        <p class="ion-text-start">Deals.</p>
        
        <form @submit.prevent='login()' class="ion-margin-horizontal">
            <!-- Email -->
            <ion-input 
                placeholder="Enter Email / Введите имейл"
                type="email" 
                v-model="email"    
            ></ion-input>

            <!-- Password -->
            <ion-input 
                placeholder="Enter password / Введите пароль"
                type="password" 
                v-model="password"    
            ></ion-input>

            <!-- Button -->
            <ion-button 
                class="ripple-parent"
                type="submit" 
                color="success" 
                expand="block"
            >
                <ion-text color="light" >
                    Войти
                </ion-text>
                
            </ion-button>
        </form>

    </div>
</template>

<script>
    import { ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRouter } from 'vue-router';

    import { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText } from '@ionic/vue';
    import { defineComponent } from 'vue';

    export default defineComponent ({
        name: 'login',
        components: { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText },
        setup() {
            // Create data / vars
            const router = useRouter();
            const email = ref(null);
            const password = ref(null);
            const errorMsg = ref(null);

            // Login function
            const login = async () => {
                try {
                    const { error } = await supabase.auth.signIn({
                        email: email.value,
                        password: password.value
                    });
                    if (error) throw error;
                    router.push({ name: 'Calendar' })
                } catch (error) {
                    errorMsg.value = `Error: ${error.message}`;
                    setTimeout(() => {
                        errorMsg.value = null
                    }, 5000)
                }
            }

            return {
                email, password, errorMsg, login
            }
        }
    })
</script>

<style scoped>
  .ripple-parent {
    position: relative;
    overflow: hidden;
  }
</style>