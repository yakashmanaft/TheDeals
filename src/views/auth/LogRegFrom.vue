<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    "
  >
    <div class="form">
      <!-- Email -->
      <ion-item id="email" fill="none" ref="item" class="ion-no-padding">
        <ion-label color="medium" position="floating">Адрес эл.почты</ion-label>
        <ion-input
          style="border-bottom: none"
          type="email"
          @ionInput="validate"
          v-model="email"
        ></ion-input>
        <ion-note v-if="email" slot="helper" color="success"
          >Корректный адрес</ion-note
        >
        <ion-note slot="error">Некорректный адрес</ion-note>
      </ion-item>

      <!-- Password -->
      <ion-item id="password" fill="none" ref="item" class="ion-no-padding">
        <ion-label color="medium" position="floating">Пароль</ion-label>
        <ion-input type="password" v-model="password" @ionInput="validatePassword"></ion-input>
      </ion-item>

      <!-- Confirm Password -->
      <ion-item
        v-show="$props.fullPath === '/register'"
        id="confirmPassword"
        fill="none"
        ref="item"
        class="ion-no-padding ion-margin-bottom"
      >
        <ion-label color="medium" position="floating">Повтор пароля</ion-label>
        <ion-input
          type="password"
          @ionInput="confirmPasswordValidate"
          v-model="confirmPassword"
        ></ion-input>
        <ion-note v-if="confirmPassword" slot="helper" color="success"
          >Совпадает</ion-note
        >
        <ion-note slot="error">Не совпадает</ion-note>
      </ion-item>

      <!-- Перейти в ЛОГИН или ДАЛЕЕ -->
      <div class="buttons-group" :class="{ 'z-index-none': spinner }">

        <!--  -->

        <!-- Делаем Сабмит -->
        <ion-button v-if="isChooseProfileModalOpened && $props.fullPath === '/register'" @click="register()"
          >Создать аккаунт</ion-button
        >

        <!-- Открывает модалку выбора профиля -->
        <button-fill v-if="!isChooseProfileModalOpened && $props.fullPath === '/register'" color="dark" @click="goNext"
          >Далее</button-fill
        >

        <!-- Ссылка на экран логина -->
        <button-fill v-if="!isChooseProfileModalOpened && $props.fullPath === '/register'" fill="clear" color="medium" @click="goToLogin()"
          >Уже есть аккаунт</button-fill
        >


        <!--  -->

        <!-- Кнопка войти -->
        <button-fill color="dark" v-if="!isChooseProfileModalOpened && $props.fullPath === '/login'" @click="login()">Войти</button-fill>

        <!-- ссылка на экран регистраии -->
        <button-fill v-if="!isChooseProfileModalOpened && $props.fullPath === '/login'" fill="clear" color="medium" @click="goToRegister()"
          >Создать аккаунт</button-fill
        >
      </div>
    </div>
  </div>
</template>
<script>
import { IonItem, IonLabel, IonInput, IonNote, IonButton } from "@ionic/vue";
export default {
  name: "LogRegFrom",
  components: {
    //
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonButton,
  },
  props: {
    isChooseProfileModalOpened: {
      type: Boolean,
      required: false,
    },
    spinner: {
      // type: Boolean,
      // required: true
    },
    fullPath: {
      type: String,
      required: true
    }
  },
  data() {
    return {
        email: null,
        password: null,
        confirmPassword: null,
    };
  },
  methods: {
    goToLogin() {
        
        this.$emit('toLogin');
    },

    goToRegister() {
      this.$emit('ToRegister')
    },

    goNext() {
        this.$emit('chooseProfile', {
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword
        })
    },

    login() {
      this.$emit('login', {
        email: this.email,
        password: this.password,
      })
    },

    // Валидируем имейл
    validateEmail(email) {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    },

    validate(ev) {
      // const item = document.querySelector('ion-item');
      const item = document.getElementById("email");
      const value = ev.target.value;
      if(!this.email) {
        this.email = ev.target.value
      }
      item.classList.remove("ion-valid");
      item.classList.remove("ion-invalid");

      if (value === "") return;

      this.validateEmail(value)
        ? item.classList.add("ion-valid")
        : item.classList.add("ion-invalid");
    },

    // 
    validatePassword (ev) {

        const value = ev.target.value;
        if (!this.password) {
            this.password = value
        } else if (value === "") return;
    },

    // Валидируем подтверждение пароля
    validateConfirmPassword (value) {
        console.log(value)
        // return confirmPassword.match(this.password)
    },

    confirmPasswordValidate (ev) {

        
        const item = document.getElementById('confirmPassword')
        const value = ev.target.value;
        // console.log(value)
        item.classList.remove('ion-valid');
        item.classList.remove('ion-invalid');
        if(!this.confirmPassword) {
            this.confirmPassword = ev.target.value
        } else if (value === "") return;
        let validateConfirmPassword = (value) => {
            // console.log(value)
            return value.match(this.password)
        }
        validateConfirmPassword(value) ? item.classList.add('ion-valid') : item.classList.add('ion-invalid');
    }
  },
};
</script>
<style scoped>
.form {
  width: 320px;
}
@media (min-width: 480px) {
  .form {
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
  background-color: red;
}
ion-item {
  --inner-padding-end: 0px;
  --padding-start: 0px;
}
.buttons-group {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
}
@media (max-height: 390px) {
  .buttons-group {
    margin-top: 1rem;
  }
}
.z-index-none {
  z-index: 0;
}
</style>
