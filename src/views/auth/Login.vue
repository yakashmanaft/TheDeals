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

            <!--  -->
            <Logo style="margin-top: 2rem;"/>

            <!--  -->
            <form style="width: 100%">
                <LogRegFrom
                    :fullPath="fullPath"
                    @ToRegister="goToRegister"
                    @login="login"
                />
            </form>
        </div>
    </div>

    <!--  -->
    <copyright/>
</template>

<script>
    import { ref, defineComponent } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRouter } from 'vue-router';
    import { IonContent, IonLabel, IonInput, IonItem, IonButton, IonText, IonAlert, IonNote } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue'
    import Logo from './Logo.vue';
    import LogRegFrom from '../auth/LogRegFrom.vue'

    export default defineComponent ({
        name: 'login',
        components: { 
            IonContent, 
            IonLabel, 
            IonInput, 
            IonItem, 
            IonButton, 
            IonText, 
            IonAlert,
            IonNote, 
            //
            Spinner,  
            Logo,
            LogRegFrom
        },
        setup() {
            // Create data / vars
            const router = useRouter();
            const fullPath = router.currentRoute._value.fullPath
            const errorMsg = ref(null);
            const spinner = ref(null)

            // Login function
            const login = async (obj) => {
                spinner.value = true
                try {
                    const { error } = await supabase.auth.signIn({
                        email: obj.email,
                        password: obj.password
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

                router.push({ name: 'Register' })
            }


            return {
                errorMsg, login, spinner, goToRegister, fullPath
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

    ion-item{
        --inner-padding-end: 0px;
        --padding-start:0px
    }
</style>