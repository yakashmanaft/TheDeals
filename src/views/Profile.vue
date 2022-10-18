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
          <ion-grid class="ion-no-padding">
            <ion-row v-for="(item, i) in userSettings.daySaturation" :key="i" class="ion-align-items-center ion-justify-content-between">
              {{item.name}}
              <!--  -->
              <div style="display: flex; align-items: center">
                <!-- Subtract -->
                <ion-icon :color="setCountQtyButtonColor(item.qty)" :icon="removeCircleOutline" @click="changeDaySaturationQty('sub', item, i)" class="countQty_button"></ion-icon>
                <!-- Show data -->
                <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{item.qty}}</ion-text>
                <!-- Add -->
                <ion-icon color="primary" :icon="addCircleOutline" @click="changeDaySaturationQty('add', item, i)" class="countQty_button"></ion-icon>
              </div>
            </ion-row>
          </ion-grid>
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
  import { supabase } from '../supabase/init';
  //
  import Spinner from '../components/Spinner.vue';
  import ViewHeader from '../components/headers/HeaderViewCurrent.vue';
  //
  import { IonContent, IonText, IonCard, IonAvatar, IonIcon, IonGrid, IonRow } from '@ionic/vue';
  import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';

  export default defineComponent({
    name: 'Profile',
    components: {
      Spinner, ViewHeader, IonContent, IonText, IonCard, IonAvatar, IonIcon, IonGrid, IonRow
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
      // массив загруженности дня, который на данный момент хранится в БД
      const daySaturation = ref(userSettings.value.daySaturation)
      const changeDaySaturationQty = (action, item, i) => {
        // console.log(item.name === 'low')
        // Если кликаем на варианту с нижним порогом загруженности
        if(item.name === 'low') {
          if(action === 'sub' && item.qty > 1) {
            item.qty--
            daySaturation.value[i].qty = item.qty
            updateDaySaturation()
          } else if (action === 'add') {
            item.qty++
            daySaturation.value[i].qty = item.qty
            updateDaySaturation()
          }
        } 
        // Если кликаем на варианту с верхним порогом загруженности
        else if (item.name === 'high' && item.qty > 1) {
          if(action === 'sub') {
            item.qty--
            daySaturation.value[i].qty = item.qty
            updateDaySaturation()
          } else if (action === 'add') {
            item.qty++
            daySaturation.value[i].qty = item.qty
            updateDaySaturation()
          }
        }
      }
      // Обновляем в БД массив с значениями загруженности дня
      const updateDaySaturation = async () => {
          try {
            spinner.value = true;
            console.log('DB is updated')
            //
            const { error } = await supabase.from('accountSettings').update({
              daySaturation: daySaturation.value
            }).eq('id', userSettings.value.id)
            if(error) throw error;
          } catch (error) {
            alert(`Error: ${error.message}`)
          }
          spinner.value = false;
      }
      //
      const setCountQtyButtonColor = (qty) => {
        if(qty < 2) {
          return 'light'
        } else {
          return 'primary'
        }
      }

      return {
        spinner, user, router, dataLoaded, userSettings, userEmail, isQrAvailable, removeCircleOutline, addCircleOutline, changeDaySaturationQty, daySaturation, setCountQtyButtonColor
      }
    }
  })
</script>

<style scoped>
    .countQty_count {
        font-size: 24px;
    }
    .countQty_button {
        font-size: 32px;
    }
</style>