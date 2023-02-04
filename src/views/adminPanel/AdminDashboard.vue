<template>
  <div>

    <!-- Контент -->
    <ion-content
      :scroll-events="true"
      class="ion-page ion-margin-top" 
      id="main"
      type="push"
      forceOverscroll="false"
    >

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
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
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
      IonContent, IonGrid, IonRow, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonText
    },
    setup(props, { emit }) {
      // Общая инфа о пользователях
      const usersArray = ref()
      onMounted(async () => {
        await store.methods.getUsers();
        usersArray.value = store.state.usersArray.reverse()
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
        usersArray, formattedDate
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