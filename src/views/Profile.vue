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
          <ion-card class="ion-no-padding ion-text-left">
            <ion-card-header>
              <ion-card-title>Мой Кошелек</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              {{myDeals.length}}
              <br>
              <ion-text>Свободных средств: 0,00 {{ currency }}</ion-text><br>
              <ion-text>Задолженность: 10,00 {{ currency }}</ion-text><br>
              <!-- Если нет долгов -->
              <ion-text>Задолженность отсутствует</ion-text>
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
      const availableBalance = ref();
      const myDebt = ref();
      const debtToMe = ref();
      //
      const calculateBalance = () => {
        console.log('calculate...')
        // console.log(myDeals.value.filter(item => item.dealType === 'buy'))
        // console.log(myDeals.value.filter(item => item.dealType === 'sale'))
        myDeals.value.forEach(item => {
          if(item.dealType === 'sale') {
            console.log(`Мне должны: ${item.totalDealPrice - item.dealPaid}`)
          } else if (item.dealType === 'buy') {
            console.log(`Моя задолженность: ${item.totalDealPrice - item.dealPaid}`)
          }
        })
        
      }

      return {
        spinner, user, router, dataLoaded, userSettings, userEmail, isQrAvailable, removeCircleOutline, addCircleOutline, changeDaySaturationQty, daySaturation, setCountQtyButtonDecreaseColor, setCountQtyButtonAddColor, translateDaySaturationName, openBusinessCard, addBusinessCard, editBusinessCard, myDeals, availableBalance, myDebt, debtToMe, currency
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