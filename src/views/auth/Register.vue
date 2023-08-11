<template>
  <div class="ion-margin-horizontal">
    <!-- Error Handling -->
    <ion-alert
      v-if="errorMsg"
      :is-open="errorMsg ? (isOpenRef = true) : (isOpenRef = false)"
      header="Что-то не вписали"
      sub-header="Важное сообщение"
      :message="errorMsg"
      :buttons="['OK']"
      @didDismiss="isOpenRef = false"
    ></ion-alert>

    <!-- Confirm email alert-->
    <ion-alert
      v-if="confirmRequire"
      :is-open="confirmRequire ? (isOpenRef = true) : (isOpenRef = false)"
      header="Потдвердите почту"
      :sub-header="`На адрес ${userAccountSettings.email} был отправлен запрос-подтверждение`"
      :buttons="['ВОЙТИ']"
      @didDismiss="confirmRequireFunc()"
    ></ion-alert>

    <!-- Spinner -->
    <Spinner v-if="spinner" />

    <!-- Content -->
    <div class="wrapper">
      <Logo style="margin-top: 2rem" />

      <form style="width: 100%">
        <LogRegFrom
          v-if="!isChooseProfileModalOpened"
          :isChooseProfileModalOpened="isChooseProfileModalOpened"
          :spinner="spinner"
          @chooseProfile="goToChooseProfile"
          @toLogin="goToLogin"
          :fullPath="fullPath"
        />

        <set-user-profile
          v-else
          @toReg="goToReg"
          :userWorkProfileArray="userWorkProfileArray"
          :userWorkProfile="userAccountSettings.userWorkProfile"
          @makeRegister="register"
        />
      </form>
    </div>
  </div>

  <!--  -->
  <copyright />
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { supabase } from "../../supabase/init";
import store from "../../store/index";
import { useRouter } from "vue-router";
import {
  IonContent,
  IonLabel,
  IonInput,
  IonItem,
  IonButton,
  IonText,
  IonAlert,
  IonNote,
  IonList,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonModal,
  IonHeader,
  IonItemGroup,
  IonImg,
  IonGrid,
} from "@ionic/vue";
//
import Spinner from "../../components/Spinner.vue";
import Logo from "./Logo.vue";
import LogRegFrom from "./LogRegFrom.vue";
import setUserProfile from "@/views/auth/setUserProfile.vue";
//
import { uid } from "uid";

export default defineComponent({
  name: "register",
  components: {
    Spinner,
    Logo,
    LogRegFrom,
    setUserProfile,
    //
    IonContent,
    IonLabel,
    IonInput,
    IonItem,
    IonButton,
    IonText,
    IonAlert,
    IonNote,
    IonList,
    IonSelect,
    IonSelectOption,
    IonChip,
    IonModal,
    IonHeader,
    IonContent,
    IonItemGroup,
    IonImg,
    IonGrid,
    //
  },
  setup() {
    // Create data / vars
    const router = useRouter();
    const fullPath = router.currentRoute._value.fullPath;
    console.log(fullPath);
    const email = ref(null);
    const password = ref(null);
    const confirmPassword = ref(null);
    const errorMsg = ref(null);
    const isOpenRef = ref(false);
    const spinner = ref(null);
    const confirmRequire = ref(null);
    const userWorkProfile = ref("");
    const userWorkProfileArray = ref([]);

    const allSettings = ref();
    const allAccountEmails = ref([]);

    onMounted(async () => {
      userWorkProfileArray.value = store.state.userWorkProfileArray;
      await store.methods.getAllSettingsFromDB();
      // console.log(email.value)
      allSettings.value = store.state.allSettings;
      allSettings.value.forEach((account) => {
        allAccountEmails.value.push(account.email);
      });
      userAccountSettings.value.userWorkProfile = userWorkProfileArray.value[0];
    });

    //
    // const setProfile = (event) => {
    //     // console.log(event.target.value)
    //     userAccountSettings.value.userWorkProfile = event.target.value
    //     console.log(userWorkProfile.value)
    // }

    //
    const goToLogin = () => {
      isChooseProfileModalOpened.value = false;
      router.push({ name: "Login" });
    };
    const goToReg = () => {
      isChooseProfileModalOpened.value = false;
    };

    // Шаблон для создания строки под настройки пользваотеля в БД accountSettings
    const userAccountSettings = ref({
      uid: uid(),
      // Здесь еще нет имейла
      email: email.value,
      userPriceList: [],
      userAdditionalAttributes: [],
      userWarehouseCategories: ["Без категории"],
      userRecipesCategories: ["Без категории"],
      weekendDays: [],
      daySaturation: [
        {
          name: "low",
          qty: 4,
        },
        {
          name: "high",
          qty: 8,
        },
      ],
      avatar_url: null,
      userWorkProfile: null,
      organization: [],
      userInfo: {},
    });

    // Register function
    const register = async (accountProfile) => {
      console.log(accountProfile);
      await store.methods.getAllSettingsFromDB();
      let allSettings = store.state.allSettings;
      let allAccountEmails = [];
      allSettings.forEach((account) => {
        // console.log(account.email)
        allAccountEmails.push(account.email);
      });

      if (userAccountSettings.value.userWorkProfile === "") {
        alert("Register: Выберите профиль");
      } else if (password.value !== confirmPassword.value) {
        alert("Register: Пароль не совпадает");
      } else if (allAccountEmails.includes(email.value)) {
        alert("Register: Аккаунт с указанным имейлом уже существует");
      }
      if (accountProfile === "Автозапчасти") {
        alert(
          "Register: функционал профиля Автозапчасти в стадии разработки..."
        );
      } else if (password.value === confirmPassword.value && !allAccountEmails.includes(email.value)) {
        spinner.value = true;
        try {
          const { error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
          });
          if (error) throw error;
          setTimeout(() => {
            confirmRequire.value = true;
            //         // router.push({ name: 'Login' })
            console.log(email.value);
            //         // Здесь имейл уже подтянулся
            userAccountSettings.value.email = email.value.toLowerCase();
            //         // isChooseProfileModalOpened.value = false
            createAccountSettings();
          }, 3000);
        } catch (error) {
          errorMsg.value = error.message;
          spinner.value = false;
          // console.log("Мы пока не можем рассылать подтверждения!");
          setTimeout(() => {
              errorMsg.value = null;
          }, 5000)
        }
        return;
      }
      // // errorMsg.value = 'Error: Passwords do not match'
      setTimeout(() => {
        errorMsg.value = null;
      }, 5000);
    };

    // confirm alert
    const confirmRequireFunc = () => {
      isOpenRef.value = !isOpenRef.value;
      router.push({ name: "Login" });
      isChooseProfileModalOpened.value = false;
    };

    //
    const createAccountSettings = async () => {
      try {
        const { error } = await supabase
          .from("accountSettings")
          .insert([userAccountSettings.value]);
        if (error) throw error;
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    };

    // ====================================== РАБОТА С МОДАЛКОЙ ВЫБОРА ПРОФИЛЯ =================================
    const isChooseProfileModalOpened = ref(false);
    const goToChooseProfile = (obj) => {
      if (!obj.email || obj.mail === "") {
        alert("Register: укажите имейл");
      } else if (!obj.password || obj.password === "") {
        alert("Register: укажите пароль");
      } else if (!obj.confirmPassword || obj.confirmPassword !== obj.password) {
        alert("Register: пароль не совпадает");
      } else {
        isChooseProfileModalOpened.value = true;

        userWorkProfile.value = "";

        userAccountSettings.value.userWorkProfile =
          userWorkProfileArray.value[0];
        email.value = obj.email;
        password.value = obj.password;
        confirmPassword.value = obj.confirmPassword;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      spinner,
      confirmRequire,
      confirmRequireFunc,
      errorMsg,
      register,
      isOpenRef,
      userAccountSettings,
      createAccountSettings,
      userWorkProfile,
      userWorkProfileArray,
      goToChooseProfile,
      isChooseProfileModalOpened,
      goToLogin,
      goToReg,
      fullPath,
    };
  },
});
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
    width: 50%;
  }
}
.header {
  font-size: 70px;
  font-weight: bold;
}
</style>
