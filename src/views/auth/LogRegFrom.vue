<template>
    <div style="display: flex; align-items: center; justify-content: center; width: 100%">

        <form>
    
            <!-- Email -->
            <ion-item id="email" fill="none" ref="item" class="ion-no-padding">
                <ion-label color="primary" position="floating">Адрес эл.почты</ion-label>
                <ion-input type="email" @ionInput="validate" @ionBlur="markTouched" v-model="email"></ion-input>
                <ion-note v-if="email" slot="helper" color="success">Корректный адрес</ion-note>
                <ion-note slot="error">Некорректный адрес</ion-note>
            </ion-item>
    
            <!-- Password -->
            <ion-item fill="none" ref="item" class="ion-no-padding">
                <ion-label color="primary" position="floating">Пароль</ion-label>
                <ion-input type="password" v-model="password"></ion-input>
            </ion-item>
    
            <!-- Confirm Password -->
            <ion-item id="confirmPassword" fill="none" ref="item" class="ion-no-padding ion-margin-bottom">
                <ion-label color="primary" position="floating">Повтор пароля</ion-label>
                <ion-input type="password" @ionInput="confirmPasswordValidate" @ionBlur="markTouched" v-model="confirmPassword"></ion-input>
                <ion-note v-if="confirmPassword" slot="helper" color="success">Совпадает</ion-note>
                <ion-note slot="error">Не совпадает</ion-note>
            </ion-item>
    
            <!-- Перейти в ЛОГИН или ДАЛЕЕ -->
            <div class="buttons-group" :class="{'z-index-none' : spinner}">
    
                <!-- Делаем Сабмит -->
                <ion-button v-if="isChooseProfileModalOpened" @click="register()">Создать аккаунт</ion-button>
                
                <!-- Открывает модалку выбора профиля -->
                <ion-button v-else @click="goToChooseProfile" color="dark">Далее</ion-button>
    
                <!-- Просто закрыть модалку выбора профиля -->
    
                <!-- Ссылка на экран логина -->
                <ion-button v-if="isChooseProfileModalOpened" color="primary" fill="clear" @click="isChooseProfileModalOpened = false">
                    Назад
                </ion-button>
    
                <!-- Ссылка на экран логина -->
                <ion-button v-else color="primary" fill="clear" @click="goToLogin()" style="font-family: Roboto, 'Helvetica Neue', 'sans-serif'">
                    Уже есть аккаунт
                    <!-- <router-link :to="{ name: 'Login' }" style="color: white">Войти</router-link> -->
                </ion-button>
            </div>
        </form>
    </div>
</template>
<script>
import { IonItem, IonLabel, IonInput, IonNote, IonButton } from '@ionic/vue'
export default {
    name: 'LogRegFrom',
    components: {

        //
        IonItem, IonLabel, IonInput, IonNote, IonButton,
    },
    data() {
        return {

        }
    },
    methods: {
        goToLogin() {
            this.$emit('toLogin')
        }
    }
}
</script>
<style scoped>
form {
    
}
@media (min-width: 480px) {
    form {
        border-radius: 1rem;
        padding: 1rem;
    }
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
ion-item{
    --inner-padding-end: 0px;
    --padding-start:0px
}
.buttons-group {
    display: flex; 
    flex-direction: column; 
    width: 100%; 
    background-color: #fff; 
    z-index: 99999;
}
</style>