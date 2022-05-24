<template>
  <div>
    <Navigation :title="title"/>
    <h2>экран настроек аккаунта</h2>
    <ul>
      <li>- список предметов заказа</li>
      <li>- список этапов заказа (сделки) можно и в разбивке по заказу, личному, поставкам</li>
      <li>- список дополнительных атрибутов (посуда, подставки, упаковка)</li>
    </ul>
  </div>
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