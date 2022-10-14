<template>
  <div v-if="appReady">
    <router-view/>
  </div>
</template>

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

      // Runs when there is a auth state change
      // if user is logged in, this will fire
      supabase.auth.onAuthStateChange((_, session) => {
        console.log('hello')
        store.methods.setUser(session);
        appReady.value = true;
      })

      return {
        appReady, user
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

a {
  text-decoration: none;
}

ion-modal {
  /* opacity: 0.95; */
  backdrop-filter: blur(2px);
} 

</style>
