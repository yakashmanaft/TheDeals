<!-- PWAPrompt.vue -->
<!-- https://webdevblog.ru/sozdanie-pwa-s-pomoshhju-vue-js/ -->
<template>
  <ion-grid v-if="shown" class="ion-padding-horizontal ion-padding-top">
    <ion-row>
      <ion-text>Добавить иконку на главную?</ion-text>
    </ion-row>
    <ion-row class="ion-margin-top">
      <ion-button @click="installPWA" class="ion-no-margin" color="dark">
        Да
      </ion-button>
      <ion-button @click="dismissPrompt" fill="clear" class="ion-no-margin" color="medium">
        Нет, спасибо
      </ion-button>
    </ion-row>
  </ion-grid>
  <!-- <div v-if="shown" class="container">
    <p>Добавить иконку на рабочий стол?</p>

    <div class="button-wrapper">
      <button class="button-success" @click="installPWA">
        Да, хочу
      </button>
  
      <button class="button-danger" @click="dismissPrompt">
        Нет, спасибо
      </button>
    </div>
  </div> -->
</template>

<script>
import { IonGrid, IonRow, IonButton, IonText } from '@ionic/vue' 

export default {
  components: {
    IonGrid, IonRow, IonButton, IonText
  },
  data: () => ({
    shown: false,
  }),
  beforeMount() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.installEvent = e
      this.shown = true
    })
  },
  methods: {
    dismissPrompt() {
      this.shown = false
    },
    installPWA() {
      this.installEvent.prompt()
      this.installEvent.userChoice.then((choice) => {
        this.dismissPrompt() // Hide the prompt once the user's clicked
        if (choice.outcome === 'accepted') {
          // Do something additional if the user chose to install
        } else {
          // Do something additional if the user declined
        }
      })
    },
  }
}
</script>

<style scoped>
  .container {
    background: var(--ion-color-light);
    padding: 1rem 0;
  }
  .button-wrapper {
    display: flex;
    justify-content: space-around;
  }
 button {
  padding: 0.7rem;
  border-radius: 0.5rem;
  color: var(	--ion-color-light);
 }
 button.button-success {
  background-color: var(--ion-color-success);
 }
 button.button-danger {
  background-color: var(--ion-color-danger);
 }
</style>