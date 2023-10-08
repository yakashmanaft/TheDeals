<template>
  <div v-if="appReady">
    <router-view
      :nogi="con"
    />
  </div>
</template>

<!-- Проверка -->

<script>
import { ref } from 'vue';
import { supabase } from './supabase/init';
import store  from './store/index';


import { defineComponent } from 'vue';


export default defineComponent ({
    setup() {
      // Create data / vars
      const appReady = ref(null);

      // Check to see if user is already logged in
      const user = supabase.auth.user();

      // If user does not exist, need to make app ready
      if (!user) {
        appReady.value = true;
      }

      const con = ref({
        content: 'NOGI из APP.vue'
      })

      // Runs when there is a auth state change
      // if user is logged in, this will fire
      supabase.auth.onAuthStateChange((_, session) => {
        // console.log('hello')
        store.methods.setUser(session);
        appReady.value = true;
      })

      return {
        appReady, user, con
      }
    }
})
</script>

<style>
/* На случай кастомных цветов */
@import './theme/variables.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--ion-color-system);
}

html {
        overflow: auto;
}

nav {
  padding: 30px;
}

nav a {

  color: var(--ion-color-system);
}

nav a.router-link-exact-active {
  color: var(--ion-color-system);
  font-weight: bold;
}

a {
  text-decoration: none;
}

ion-modal {
  /* opacity: 0.95; */
  backdrop-filter: blur(2px);
} 

li {
  padding: 0;
  margin: 0;
  list-style: none;
}

</style>
