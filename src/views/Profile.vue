<template>
  <div>
    <!-- Спиннер как имитация загрузки -->
    <Spinner v-if="spinner"/>

    <!-- page header -->
    <ViewHeader 
      :title="pageTitle"
    />

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
        <!-- Общая инфа по аккаунту -->
        <ion-grid class="ion-no-padding">
          <ion-row class="ion-justify-content-center">
            <avatar v-model:path="avatar_url" @upload="updateProfile"></avatar>
            <!-- <Avatar/> -->
            <!-- <form class="form-widget" @submit.prevent="updateProfile">

            <Avatar v-model:path="avatar_url" @upload="updateProfile" size="10" />


          </form> -->
          </ion-row>
          <!--  -->
          <ion-row class="ion-justify-content-center">
            <!-- https://habr.com/ru/company/timeweb/blog/648761/ -->
            <!-- https://habr.com/ru/company/timeweb/blog/660183/ -->
            <!-- <ion-avatar class="account-avatar" @click="changeAvatar()">
              <img src="img/common/user-avatar.png">
            </ion-avatar> -->
              <!-- <br>
              <input type="file" ref="file" @change="handleFileUpload()"> -->
          </ion-row>
          <!--  -->
          <div v-if="!edit">
            <ion-row class="ion-justify-content-center ion-align-items-center">
              <h2 v-if="userSettings.userInfo.name && userSettings.userInfo.surname">
                {{userInfo.name}} {{userInfo.surname}}
              </h2>
              <h2 v-else >Без имени</h2>
            </ion-row>
            <!-- Кнопка включает режим редактирования -->
            <ion-icon style="font-size: 24px;" :icon="createOutline" color="primary" @click="edit = true"></ion-icon>
          </div>
          <!--  -->
          <div v-if="edit">
            <h2>
              <ion-input autocapitalize="on" inputmode="text" placeholder="Имя" v-model="userInfo.name" :value="userInfo.name"></ion-input>
              <ion-input autocapitalize="on" inputmode="text" placeholder="Фамилия" v-model="userInfo.surname" :value="userInfo.surname"></ion-input>
            </h2>
            <ion-text @click="updateUserInfo" color="primary">Готово</ion-text>
          </div>
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

        <!-- Организация -->
        <ion-card class="ion-no-padding ion-text-left">
          <ion-card-header>
            <ion-grid class="ion-no-padding">
              <ion-row class="ion-align-items-center ion-justify-content-between">
                <ion-card-title>
                  Мои организации
                </ion-card-title>
                <ion-icon style="font-size: 24px;" :icon="ellipsisHorizontal" @click="isMainOrganizationMenuOpened = true"></ion-icon>
              </ion-row>
            </ion-grid>

            <!--  -->
            <ion-action-sheet
              :isOpen="isMainOrganizationMenuOpened"
              @didDismiss="isMainOrganizationMenuOpened = false"
              :buttons="mainOrganizationMenuButtons"
            ></ion-action-sheet>
          </ion-card-header>
          <ion-card-content v-if="userSettings.organization.length === 0">
            Нет организаций
          </ion-card-content>
          <ion-card-content v-else>
            <div v-for="(organization, index) in userSettings.organization" :key="index" class="marginTop">
              <ion-grid class="ion-no-padding">
                <ion-row class="ion-align-items-center ion-justify-content-between">
                  <div>
                    <ion-chip class="ion-no-margin" color="primary" @click="openCurrentOrganizationMenu(organization, index)">
                      {{organization.organizationName}}
                    </ion-chip>
                    <ion-chip disabled="true">
                      1 чел.
                    </ion-chip>
                  </div>
                  <ion-text>{{organization.role}}</ion-text>
                </ion-row>
              </ion-grid>
            </div>
            <!--  -->
            <ion-action-sheet
              :isOpen="isCurrentOrganizationMenuOpened"
              @didDismiss="isCurrentOrganizationMenuOpened = false"
              :buttons="currentOrganizationMenuButtons"
            ></ion-action-sheet>
          </ion-card-content>
          
            <!-- Всплывашка подтверждение удаления предмета заказа -->
            <ion-action-sheet
                :is-open="deleteOrganizationMenu"
                header="Точно?"
                :buttons="deleteOrganizationMenuButtons"
                @didDismiss="deleteOrganizationMenu = false"
            >
            </ion-action-sheet>
        </ion-card>

        <!-- Инфа по подписке -->
        <ion-card class="ion-no-padding ion-text-left">
          <ion-card-header>
              <ion-grid class="ion-no-padding">
                <ion-row class="ion-align-items-center ion-justify-content-between">
                  <ion-card-title>Подписка</ion-card-title>
                  <ion-chip class="ion-no-margin" @click="renewSubscription()" color="primary">Тарифы</ion-chip>
                </ion-row>
              </ion-grid>
            </ion-card-header>
            <!--  -->
            <ion-card-content>
              Пробный период<br>
              Действует до 27.10.2022
              <!-- Подписка истекла -->
            </ion-card-content>
        </ion-card>

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
  import Avatar from '../components/Avatar.vue';
  //
  import { IonContent, IonText, IonCard, IonAvatar, IonIcon, IonGrid, IonRow, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonActionSheet, IonInput } from '@ionic/vue';
  import { removeCircleOutline, addCircleOutline, ellipsisHorizontal, createOutline } from 'ionicons/icons';
  //
  import { format, parseISO } from 'date-fns';
  import { ru } from 'date-fns/locale'

  export default defineComponent({
    name: 'Profile',
    components: {
      Spinner, ViewHeader, Avatar, 
      //
      IonContent, IonActionSheet, IonText, IonCard, IonAvatar, IonIcon, IonGrid, IonRow, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonInput
    },
    setup() {
      //
      const avatar_url = ref()
      // Currency
      const currency = ref(store.state.systemCurrency.name)
      // Get user from store
      const user = computed(() => store.state.user);
      // Setup ref to router
      const router = useRouter();
      // Page title
      const pageTitle = router.currentRoute._value.meta.translation;
      console.log(pageTitle)
      //
      const userSettings = ref(store.state.userSettings[0])
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
          alert('Profile: Вы пытаетесь открыть QR-визитку. Не получится. Функционал в разработке...')
        }
      }
      //
      const addBusinessCard = () => {
        alert('Profile: Вы пытаетесь создать QR-визитку. Функционал в разработке...')
      }
      //
      const editBusinessCard = () => {
        alert('Profile: Вы пытаетесь редактировать QR-визитку. Функционал в разработке...')
      }
      //
      const availableBalance = ref(0);
      const myDebt = ref(0);
      const debtToMe = ref(0);
      //
      const calculateBalance = () => {
        // console.log('calculate...')
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
      // const changeAvatar = () => {
      //   alert('Profile: Вы хотите сменить аватарку? Функционал в разработке...')
      // }
      //
      const formattedDate = (day) => {
        const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
        return formattedString;
      }
      // функционал по продлению подписки
      const renewSubscription = () => {
        alert('Profile: хотите продлить подписку? В разработке...')
      }
      // ============================== Работа с аватаркой ============================
      const file = ref(null)
      const handleFileUpload = async () => {
        console.log("selected file",file.value.files)
      }
      //
      const updateProfile = () => {
        console.log('123')
      }

      // isMainOrganizationMenuOpened
      const isMainOrganizationMenuOpened = ref(false)
      const mainOrganizationMenuButtons = [
          {
              text: 'Создать',
              handler: () => {
                alert('Profile: создание организаций в разработке...')
              },
          },
          {
            text: 'Найти организацию',
            handler: () => {
              alert('Profile: поиск организаций в разработке...')
            }
          },
          {
              text: 'Отменить',
              role: 'cancel',
              handler: () => {
                  console.log('Cancel clicked')
              },
          }
        ]

        // isCurrentOrganizationMenuOpened
        const organizationToDelete = ref()
        const currentOrganizationMenuButtons = ref([])
        const isCurrentOrganizationMenuOpened = ref(false)
        //
        const openCurrentOrganizationMenu = (organization, index) => {
          organizationToDelete.value = index
          if(organization.role === 'Создатель') {
            currentOrganizationMenuButtons.value = organizationCreatorButtons
          } else {
            currentOrganizationMenuButtons.value = organizationParticipantButtons
          }
          isCurrentOrganizationMenuOpened.value = true
        }
        //
        const organizationCreatorButtons = [
          {
            text: 'Пригласить',
            handler: () => {
              alert('Profile: приглашения в организацию в разработке')
            }
          },
          {
              text: 'Распустить (удалить)',
              role: 'destructive',
              data: {
                  type: 'delete'
              },
              handler: () => {
                  openDeleteOrganizationMenu()
              },
          },
          {
              text: 'Отменить',
              role: 'cancel',
              handler: () => {
                  console.log('Cancel clicked')
              },
          }
        ]
        //
        const organizationParticipantButtons = [
          {
              text: 'Выйти из организации',
              role: 'destructive',
              data: {
                  type: 'delete'
              },
              handler: () => {
                  openDeleteOrganizationMenu()
              },
          },
          {
              text: 'Отменить',
              role: 'cancel',
              handler: () => {
                  console.log('Cancel clicked')
              },
          }
        ]
        // 
        const deleteCurrentOrganization = (index) => {
          userSettings.value.organization.splice(index, 1)
          updateUserOrganizations()
        }
        //
        const updateUserOrganizations = async () => {
          try {
            spinner.value = true
            const { error } = await supabase.from('accountSettings').update({
              organization: userSettings.value.organization
            }).eq('id', userSettings.value.id)
            if(error) throw error;
          } catch (error) {
            alert(`Error: ${error.message}`)
          }
          spinner.value = false;
        }
        //
        const deleteOrganizationMenu = ref(false)
        const openDeleteOrganizationMenu = () => {
          deleteOrganizationMenu.value = true
        }
        const deleteOrganizationMenuButtons = [
          {
              text: 'Да',
              role: 'destructive',
              data: {
                  type: 'delete'
              },
              handler: () => {
                deleteCurrentOrganization(organizationToDelete.value)
              },
          },
          {
              text: 'Отменить',
              role: 'cancel',
              handler: () => {
                  console.log('Cancel clicked')
              },
          }
        ]

        const edit = ref(false)
        const userInfo = ref({
          name: userSettings.value.userInfo.name,
          surname: userSettings.value.userInfo.surname
        })
        const updateUserInfo = async () => {
          if (!userInfo.value.name || userInfo.value.name === '') {
            alert('Profile: Укажите имя')
          } else if (!userInfo.value.surname || userInfo.value.surname === '') {
            alert('Profile: Укажите фамилию')
          } else {
            try {
              spinner.value = true
              const { error } = await supabase.from('accountSettings').update({
                userInfo: userInfo.value
              }).eq('id', userSettings.value.id)
              if(error) throw error;
            } catch (error) {
              alert(`Error: ${error.message}`)
            }
            //const userSettings = ref(store.state.userSettings[0])
            await store.methods.getUserSettingsfromDB()
            userSettings.value = store.state.userSettings[0]
            //
            edit.value = false
            spinner.value = false;
          }
        }

      return {
        spinner, user, router, dataLoaded, userSettings, userEmail, isQrAvailable, removeCircleOutline, addCircleOutline, changeDaySaturationQty, daySaturation, setCountQtyButtonDecreaseColor, setCountQtyButtonAddColor, translateDaySaturationName, openBusinessCard, addBusinessCard, editBusinessCard, myDeals, availableBalance, myDebt, debtToMe, currency, formattedDate, pageTitle, renewSubscription, file, handleFileUpload, avatar_url, updateProfile, ellipsisHorizontal, isMainOrganizationMenuOpened, mainOrganizationMenuButtons, isCurrentOrganizationMenuOpened, currentOrganizationMenuButtons, openCurrentOrganizationMenu ,organizationCreatorButtons, organizationParticipantButtons, organizationToDelete, deleteCurrentOrganization, deleteOrganizationMenu, openDeleteOrganizationMenu, deleteOrganizationMenuButtons, createOutline, edit, userInfo, updateUserInfo
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
    /* .account-avatar {
      width: 6rem;
      height: 6rem;
    } */
    .marginTop {
      margin-top: 16px;
    }
    .marginTop:first-child {
      margin-top: 0px;
    }
</style>