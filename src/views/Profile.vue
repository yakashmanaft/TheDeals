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
      <!-- page content -->
      <!-- No data -->
      <div v-if="(!dataLoaded || userSettings.length === 0) && !spinner">
        <ion-text>Что-то пошло не так...</ion-text>
      </div>
      <!-- Data -->
      <div v-if="dataLoaded && userSettings.length !== 0">
        <br>
        <!-- Смена аватарки и прочие общие данные по аккаунту -->
        <!-- <ion-card class="ion-no-margin ion-margin-horizontal ion-padding">
          <ion-avatar class="account-avatar">
              <img src="img/common/user-avatar.png">
          </ion-avatar>
          uid: {{ userSettings.uid }} <br>
          email: {{ userEmail }} <br>
          Зарегистрирован: {{ userSettings.created_at }}
        </ion-card> -->
        <!-- Общая инфа по аккаунту -->
        <ion-grid class="ion-no-padding">
          <!--  -->
          <ion-row class="ion-justify-content-center">
            <ion-avatar class="account-avatar" @click="changeAvatar()">
              <img src="img/common/user-avatar.png">
            </ion-avatar>
          </ion-row>
          <!--  -->
          <ion-row class="ion-justify-content-center ion-margin-top">
            <ion-text>Uid: {{ userSettings.uid }}</ion-text>
          </ion-row>
          <!--  -->
          <ion-row class="ion-justify-content-center">
            <ion-text>Email: {{ userEmail }}</ion-text>
          </ion-row>
          <!--  -->
          <ion-row class="ion-justify-content-center">
            <ion-text>Зарегистрирован: {{formattedDate(userSettings.created_at)}}</ion-text>
          </ion-row>
        </ion-grid>

        <!-- Общая инфа по кошельку -->
        <router-link :to="{ name: 'Wallet' }">
          <ion-card class="ion-no-padding ion-text-left">
            <ion-card-header>
              <ion-card-title>Мой Кошелек</ion-card-title>
            </ion-card-header>
            <ion-card-content style="display: flex; flex-direction: column; gap: 16px;">
              <!--  -->
              <div style="background-color: var(--ion-color-success); border-radius: 0.6rem; padding: 16px; color: #fff; display: flex; justify-content: space-between; align-items: center;">
                <span>Баланс:</span>
                <span style="white-space: nowrap; font-size: 24px;">{{availableBalance.toFixed(2)}} {{ currency }}</span>
              </div>
              <!--  -->
              <div class="ion-text-right" style="display: flex; flex-direction: column;">
                <ion-text v-if="myDebt > 0">Моя задолженность: {{myDebt.toFixed(2)}} {{ currency }}</ion-text>
                <ion-text v-if="debtToMe > 0">Мне должны: {{debtToMe.toFixed(2)}} {{ currency }}</ion-text>
                <ion-text v-if="myDebt === 0 && debtToMe === 0">Долги отсутствуют</ion-text>
              </div>
            </ion-card-content>
          </ion-card>
        </router-link>

        <!-- QR-визитка -->
        <ion-card class="ion-padding" @click="openBusinessCard()">
          <ion-card-header class="ion-no-padding">
            <ion-grid class="ion-no-padding">
              <ion-row class="ion-align-items-center ion-justify-content-between">
                <ion-card-title class="ion-no-margin ion-text-left">QR-визитка</ion-card-title>
                <div>
                  <!-- Если QR-визитка в наличии -->
                  <ion-text v-if="isQrAvailable" color="primary" style="font-size: 16px;" @click.prevent.stop="editBusinessCard()">Править</ion-text>
                  <!-- Если QR-визитки еще создавалось -->
                  <ion-chip v-else class="ion-no-margin" @click.prevent.stop="addBusinessCard()" color="primary">Добавить</ion-chip>
                </div>
              </ion-row>
            </ion-grid>
          </ion-card-header>
          <ion-card-content class="ion-no-padding">
            <ion-grid class="ion-no-padding ion-margin-top ion-text-left">

              <ion-text>
                Моя визитная карточка с реквизитами
              </ion-text>
            </ion-grid>
          </ion-card-content>
        </ion-card>

        <!-- Настройки загруженности дня -->
        <ion-card class="ion-padding">
          <ion-card-header class="ion-no-padding">
            <ion-card-title class="ion-no-margin ion-text-left">Загруженность дня</ion-card-title>
          </ion-card-header>
          <ion-card-content class="ion-no-padding">
            <ion-grid class="ion-no-padding ion-margin-top" v-for="(item, i) in userSettings.daySaturation" :key="i" >
              <ion-row class="ion-align-items-center ion-justify-content-between">
                <ion-text color="primary">
                  {{ translateDaySaturationName(item.name) }}
                </ion-text>
                <!--  -->
                <div style="display: flex; align-items: center">
                  <!-- Subtract -->
                  <ion-icon :color="setCountQtyButtonDecreaseColor(item)" :icon="removeCircleOutline" @click="changeDaySaturationQty('sub', item, i)" class="countQty_button"></ion-icon>
                  <!-- Show data -->
                  <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{item.qty}}</ion-text>
                  <!-- Add -->
                  <ion-icon :color="setCountQtyButtonAddColor(item)" :icon="addCircleOutline" @click="changeDaySaturationQty('add', item, i)" class="countQty_button"></ion-icon>
                </div>
              </ion-row>
              <!--  -->
              <ion-row class="ion-text-left ion-margin-top">
                <ion-text v-if="item.name === 'low'">
                  Количество дел, которое вы с легкостью можете выполнить
                </ion-text>
                <ion-text v-else>
                  Количество дел, выполнить которое нужно очень постараться
                </ion-text>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>

        <!-- Реферальная ссылка для приглашения -->
        <ion-card class="ion-no-padding ion-text-left">
          <ion-card-header>
            <ion-card-title class="ion-no-margin ion-text-left">Пригласить друга</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-text>В разработке...</ion-text>
          </ion-card-content>
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
  import { IonContent, IonText, IonCard, IonAvatar, IonIcon, IonGrid, IonRow, IonCardHeader, IonCardTitle, IonCardContent, IonChip } from '@ionic/vue';
  import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';
  //
  import { format, parseISO } from 'date-fns';
  import { ru } from 'date-fns/locale'

  export default defineComponent({
    name: 'Profile',
    components: {
      Spinner, ViewHeader, IonContent, IonText, IonCard, IonAvatar, IonIcon, IonGrid, IonRow, IonCardHeader, IonCardTitle, IonCardContent, IonChip
    },
    setup() {
      // Currency
      const currency = ref(store.state.systemCurrency.name)
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
      const myDeals = ref([]);
      //
      const spinner = ref(null);
      const dataLoaded = ref(null);
      const isQrAvailable = ref();
      // Подтягиваем список дел из store
      spinner.value = true;
      //
      onMounted( async () => {
        await store.methods.getMyDealsFromBD();
        myDeals.value = store.state.myDealsArray;
        spinner.value = false;
        dataLoaded.value = true;
        // 
        calculateBalance()
        isQrAvailable.value = false
      })
      // массив загруженности дня, который на данный момент хранится в БД
      const daySaturation = ref(userSettings.value.daySaturation)
      const changeDaySaturationQty = (action, item, i) => {
        // Если кликаем на варианту с нижним порогом загруженности
        if(item.name === 'low') {
          if(action === 'sub' && item.qty > 1 ) {
            item.qty--
            daySaturation.value[i].qty = item.qty
            updateDaySaturation()
          } else if (action === 'add' && item.qty < daySaturation.value[1].qty) {
            item.qty++
            daySaturation.value[i].qty = item.qty
            updateDaySaturation()
          }
        } 
        // Если кликаем на варианту с верхним порогом загруженности
        else if (item.name === 'high') {
          if(action === 'sub' && item.qty > daySaturation.value[0].qty) {
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
      // меняем стили кнопок для уменьшения количества 
      const setCountQtyButtonDecreaseColor = (item) => {
        if(item.name === 'low') {
          if(item.qty < 2) {
            return 'light'
          } else {
            return 'primary'
          }
        } else if (item.name === 'high') {
          if(item.qty === daySaturation.value[0].qty) {
            return 'light'
          } else {
            return 'primary'
          }
        }
      }
      // меняем стили кнопок для увеличения количества 
      const setCountQtyButtonAddColor = (item) => {
        if(item.name === 'low') {
          if(item.qty === daySaturation.value[1].qty) {
            return 'light'
          } else {
            return 'primary'
          }
        } else if (item.name === 'high') {
          return 'primary'
        }
      }
      //
      const translateDaySaturationName = (itemName) => {
        if(itemName === 'low') {
          return 'Низкая нагрузка'
        } else if (itemName === 'high') {
          return 'Высокая нагрузка'
        }
        
      }
      // открываем модкалку с QR-визиткой
      const openBusinessCard = () => {
        if (isQrAvailable.value) {
          alert('Вы пытаетесь открыть QR-визитку. Не получится. Функционал в разработке...')
        }
      }
      //
      const addBusinessCard = () => {
        alert('Вы пытаетесь создать QR-визитку. Функционал в разработке...')
      }
      //
      const editBusinessCard = () => {
        alert('Вы пытаетесь редактировать QR-визитку. Функционал в разработке...')
      }
      //
      const availableBalance = ref(0);
      const myDebt = ref(0);
      const debtToMe = ref(0);
      //
      const calculateBalance = () => {
        console.log('calculate...')
        // Массив сумм, которые мне уже вносили по делам продаж
        let payMeArray = []
        let payMe = 0
        // Массив сумм, которые я уже вносил по делам закупок
        let iPayArray = []
        let iPay = 0
        // Массив моих задолженностей
        let myDebtsArray = []
        let myDebts = 0
        // Массив покупательских задолженностей
        let debtsToMeArray = []
        let debtsToMe = 0
        //
        myDeals.value.forEach(item => {
          if(item.dealType === 'sale') {
            payMeArray.push(item.dealPaid)
            debtsToMeArray.push(item.totalDealPrice - item.dealPaid)
          } else if (item.dealType === 'buy') {
            iPayArray.push(item.dealPaid)
            myDebtsArray.push(item.totalDealPrice - item.dealPaid)
          }
        })
        // суммируем значения в массивах, считаем текущий баланс
        payMe = payMeArray.reduce((a, b) => a + b, 0)
        iPay = iPayArray.reduce((a, b) => a + b, 0)
        availableBalance.value = payMe - iPay
        // 
        myDebts = myDebtsArray.reduce((a, b) => a + b, 0)
        myDebt.value = myDebts
        //
        debtsToMe = debtsToMeArray.reduce((a, b) => a + b, 0)
        debtToMe.value = debtsToMe 
      }
      // Функционал по смене автарки
      const changeAvatar = () => {
        alert('Вы хотите сменить аватарку? Функционал в разработке...')
      }
      //
      const formattedDate = (day) => {
        const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
        return formattedString;
      }

      return {
        spinner, user, router, dataLoaded, userSettings, userEmail, isQrAvailable, removeCircleOutline, addCircleOutline, changeDaySaturationQty, daySaturation, setCountQtyButtonDecreaseColor, setCountQtyButtonAddColor, translateDaySaturationName, openBusinessCard, addBusinessCard, editBusinessCard, myDeals, availableBalance, myDebt, debtToMe, currency, changeAvatar, formattedDate
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
    .account-avatar {
      width: 6rem;
      height: 6rem;
    }
</style>