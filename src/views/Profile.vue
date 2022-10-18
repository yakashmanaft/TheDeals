<template>
  <div>
    <!-- Спиннер как имитация загрузки -->
    <Spinner v-if="spinner"/>

    <!-- page header -->
    <ViewHeader />

    <!-- page-content -->
    <ion-content
      :scroll-events="true"
      class="ion-page ion-margin-top"
      id="main"
      type="push"
      forceOverscroll="false"
    >
      <br>
      <br>
      <br>
      <!-- page content -->
      <!-- No data -->
      <div v-if="(!dataLoaded || userSettings.length === 0) && !spinner">
        <ion-text>Что-то пошло не так...</ion-text>
      </div>
      <!-- Data -->
      <div v-if="dataLoaded && userSettings.length !== 0">
        <br>
        <!-- Смена аватарки и прочие общие данные по аккаунту -->
        <ion-card class="ion-no-margin ion-margin-horizontal ion-padding">
          <!-- Аватар, поидее должен подгружать из настроек аккаунта -->
          <ion-avatar class="account-avatar">
              <img src="img/common/user-avatar.png">
          </ion-avatar>
          {{ userSettings.uid }}
          {{ userEmail }}
          Зарегистрирован: {{ userSettings.created_at }}
          <br>
          В разработке...
        </ion-card>

        <!-- Общая инфа по кошельку -->
        <router-link :to="{ name: 'Wallet' }">
          <ion-card class="ion-padding">
            <h5 class="ion-no-margin ion-text-left">Мой Кошелек</h5>
            <br>
            <ion-text>Свободных средств: 0,00 RUB</ion-text>
            <ion-text>Задолженность: 10,00 RUB</ion-text>
            <!-- Если нет долгов -->
            <ion-text>Задолженность отсутствует</ion-text>
            <br>
            В разработке...
          </ion-card>
        </router-link>

        <!-- QR-визитка -->
        <ion-card class="ion-padding">
          <h5 class="ion-no-margin ion-text-left">QR-визитка</h5>
          <br>
          <div>
            <ion-text v-if="isQrAvailable">Qr is Available</ion-text>
            <ion-text v-else>Qr is not Available</ion-text>
          </div>
          <ion-text>
            Моя визитная карточка с реквизитами
          </ion-text>
          <br>
          В разработке...
        </ion-card>

        <!-- Настройки загруженности дня -->
        <ion-card class="ion-padding">
          <h5 class="ion-no-margin ion-text-left">Настройки загруженности дня</h5>
          <br>
            <div v-for="(item, i) in userSettings.daySaturation" :key="i">
              {{item.name}}
              <!--  -->
              <!-- Subtract -->
              <ion-icon :icon="removeCircleOutline" @click="changeDaySaturationQty('sub', item)"></ion-icon>
              <!-- Show data -->
              <ion-text>{{item.qty}}</ion-text>
              <!-- Add -->
              <ion-icon :icon="addCircleOutline" @click="changeDaySaturationQty('add', item)"></ion-icon>
            </div>
        </ion-card>

        <!-- Реферальная ссылка для приглашения -->
        <ion-card class="ion-padding">
          <h5 class="ion-no-margin ion-text-left">Пригласить друга</h5>
          <br>
          <ion-text>В разработке...</ion-text>
        </ion-card>
      </div>
    </ion-content>
  </div>
</template>

<script>
  import { defineComponent, ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  //
  import store from '../store/index';
  //
  import Spinner from '../components/Spinner.vue';
  import ViewHeader from '../components/headers/HeaderViewCurrent.vue';
  //
  import { IonContent, IonText, IonCard, IonAvatar, IonIcon } from '@ionic/vue';
  import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';

  export default defineComponent({
    name: 'Profile',
    components: {
      Spinner, ViewHeader, IonContent, IonText, IonCard, IonAvatar, IonIcon
    },
    setup() {
      // Get user from store
      const user = computed(() => store.state.user);
      //
      const userSettings = ref(store.state.userSettings[0])
      // Setup ref to router
      const router = useRouter();
      // Get user email
      store.methods.setUserEmail()
      const userEmail = ref(store.state.userEmail)
      console.log(userEmail.value)
      //
      const spinner = ref(null);
      const dataLoaded = ref(null);
      const isQrAvailable = ref();
      // Подтягиваем список дел из store
      spinner.value = true;
      //
      onMounted(() => {
        spinner.value = false
        dataLoaded.value = true;
        //
        isQrAvailable.value = false
      })
      //
      // const daySaturationLowQty = ref()
      // const daySaturationHighQty = ref()
      //
      const changeDaySaturationQty = (action, item) => {
        if(action === 'sub') {
          item.qty--
          // обновляем значения в БД
          // daySaturationLowQty.value = item.qty
        } else if (action === 'add') {
          item.qty++
          // обновляем значения в БД
          // daySaturationHighQty.value = item.qty
          // console.log(daySaturationHighQty.value)
        }
      }
      // //
      // watch(daySaturationHighQty, () => {
      //   console.log(daySaturationHighQty.value)
      //   // обновляем значения в БД
      // })
      // watch(daySaturationLowQty, () => {
      //   console.log(daySaturationLowQty.value)
      //   // обновляем значения в БД
      // })

      return {
        spinner, user, router, dataLoaded, userSettings, userEmail, isQrAvailable, removeCircleOutline, addCircleOutline, changeDaySaturationQty 
      }
    }
  })
</script>

<style scoped>

</style>