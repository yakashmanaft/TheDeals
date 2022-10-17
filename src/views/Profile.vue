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
      <div v-if="!dataLoaded && !spinner">
        <ion-text>Что-то пошло не так...</ion-text>
      </div>
      <!-- Data -->
      <div v-if="dataLoaded">
        Данные
        <br>
        <ion-card>
          <ion-text>
            QR-визитка
          </ion-text>
          <div>
            <ion-text v-if="isQrAvailable">Qr is Available</ion-text>
            <ion-text v-else>Qr is not Available</ion-text>
          </div>
          <ion-text>
            Моя визитная карточка с реквизитами
          </ion-text>
        </ion-card>
      </div>
    </ion-content>
  </div>
</template>

<script>
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  //
  import store from '../store/index';
  //
  import Spinner from '../components/Spinner.vue';
  import ViewHeader from '../components/headers/HeaderViewCurrent.vue';
  //
  import { IonContent, IonText, IonCard } from '@ionic/vue';

  export default defineComponent({
    name: 'Profile',
    components: {
      Spinner, ViewHeader, IonContent, IonText, IonCard
    },
    setup() {
      // Get user from store
      const user = computed(() => store.state.user);
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

      return {
        spinner, user, router, dataLoaded, isQrAvailable
      }
    }
  })
</script>

<style scoped>

</style>