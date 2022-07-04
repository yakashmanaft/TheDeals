<template>
  <div>
    <ion-menu side="end" menu-id="first" content-id="main">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Example Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item>Menu Item</ion-item>
          <ion-item><router-link to="/">Home</router-link></ion-item>
          <ion-item><router-link to="/about">About</router-link></ion-item>
          <PWAPrompt/>
        </ion-list>
      </ion-content>
    </ion-menu>

    <div class="ion-page" id="main" type="push">
      <ion-content>
        <ion-menu-toggle>
          <ion-button>Menu</ion-button>
        </ion-menu-toggle>
        <router-view/>
      </ion-content>
    </div>
  </div>
</template>

<script>
import PWAPrompt from "./components/PWAPrompt.vue";
import { ref } from 'vue';
import { defineComponent } from 'vue';
import { 
  IonContent, 
  IonHeader, 
  IonItem, 
  IonList, 
  IonMenu, 
  IonMenuToggle,
  IonButton,
  IonTitle, 
  IonToolbar
} from '@ionic/vue';

export default defineComponent ({
    components: {
      PWAPrompt,
    IonContent, 
    IonHeader, 
    IonItem, 
    IonList, 
    IonMenu, 
    IonMenuToggle,
    IonButton,
    IonTitle, 
    IonToolbar
    },
    setup() {
      return {
        
      }
    }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
