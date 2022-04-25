<template>
  <div>
    <Navigation :title="title"/>
    <h2>экран календаря событий</h2>
  </div>

  <!-- Здесь планирую показывать диаграмы может какие -->
</template>

<script>
  import Navigation from '../components/Navigation.vue';

  import store from '../store/index';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    components: {
      Navigation
    },
    setup () {
      const user = computed(() => store.state.user);

      // Берем имя роута для заголовка
      const router = useRouter();
      const title = router.currentRoute._value.meta.translation;
      
      return {
        user, title
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>