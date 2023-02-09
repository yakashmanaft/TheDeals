<template>
  <div>
    <!-- Спиннер как имитация загрузки -->
    <Spinner v-if="spinner"/>

    <!-- Navigation Menu -->
    <navigation-menu
        :title="pageTitle"
    />

    <!-- page header -->
    <Header
      :title="pageTitle"
      style="background-color: white"
    />

    <!-- Контент -->
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

      <!-- ================================== about users ================================== -->
      <!-- Пользваотели -->
      <ion-card>
        <!--  -->
        <ion-card-header>
          <ion-card-title class="ion-text-start">Пользователи</ion-card-title>
        </ion-card-header>

        <!--  -->
        <ion-card-content>
          <div v-for="(user, index) in usersArray" :key="index">
            <ion-grid class="ion-no-padding ">
              <ion-row class="ion-justify-content-between ion-align-items-center" >
    
                <!--  -->
                <ion-text class="ion-text-start width-sm-100">{{user.email}}</ion-text>
    
                <!--  -->
                <ion-text>{{ formattedDate(user.created_at) }}</ion-text>
        
              </ion-row>
            </ion-grid>
          </div>
        </ion-card-content>
      </ion-card>

    </ion-content>

    <!-- page footer -->
    <Footer/>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
//
import Spinner from '@/components/Spinner.vue'
import Header from '../../components/headers/Header.vue'
import NavigationMenu from '@/components/NavigationMenu.vue';
import Footer from '@/components/Footer.vue';
//
import { IonContent, IonGrid, IonRow, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonText } from '@ionic/vue';
//
import store from '../../store/index';
import { supabase } from '../../supabase/init';
//
import { format, parseISO, formatISO } from 'date-fns';
import { ru } from 'date-fns/locale';

  export default defineComponent({
    name: 'AdminDashboard',
    components: {
      Spinner, Header, NavigationMenu, Footer,
      //
      IonContent, IonGrid, IonRow, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonText
    },
    setup(props, { emit }) {
      // Общая инфа о пользователях
      const usersArray = ref()
      //
      const spinner = ref(null);
      spinner.value = true;
      // Setup ref to router
      const router = useRouter();
      // Get page title
      const pageTitle = router.currentRoute._value.meta.translation;

      onMounted(async () => {
        await store.methods.getUsers();
        usersArray.value = store.state.usersArray.reverse()
        //
        spinner.value = false
      })
      //
      const formattedDate = (day) => {
          if(day) {
              // const formattedString = format(parseISO(day), 'd MMMM yyyy');
              const formattedString = format(parseISO(day), 'dd.MM.yyyy', { locale: ru });
              return formattedString;
          }
      }

      return {
        usersArray, spinner, formattedDate, router, pageTitle
      }
    }
  })
</script>

<style scoped>
  @media(max-width: 576px) {
    .width-sm-100 {
      width: 100%
    }
  }
</style>