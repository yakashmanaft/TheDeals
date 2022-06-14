<template>
  <div>
    <Navigation :title="title"/>
    <h2>экран настроек аккаунта</h2>
    <ul>
      <li>- список предметов заказа</li>
      <li>- список этапов заказа (сделки) можно и в разбивке по заказу, личному, поставкам</li>
      <li>- список дополнительных атрибутов (посуда, подставки, упаковка)</li>
      <li>- списки статусов по делам</li>
    </ul>
    <div v-for="(item, index) in assortmentList" :key="index">

      <span>{{ item.title }}</span>
      <ul v-for="(recipe, idx) in item.recipes" :key="idx">
        <li class="text-sm text-dark-gray">
          <span>{{recipe.title}}</span>
          <ul v-for="(step, n) in recipe.steps" :key="n">
            <li>{{ n }}.{{ step }}</li>
          </ul>
        </li>
      </ul>

    </div>
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

      //Рецепты
      // Ассортимент по предметам заказа (устанавливается в настройках аккаунта)
      const assortmentList = [
        {
          name: 'cake',
          img: 'cake.png',
          title: 'Торт',
          recipes: [
            {
              title: 'Молочная девочка'
            },
            {
              title: 'Красный бархат'
            }
          ]
        },
        {
          name: 'wedding-cake',
          img: 'wedding-cake.png',
          title: 'Свадебный торт',
        },
        {
          name: 'cupcake',
          img: 'cupcake.png',
          title: 'Капкейк',
        },
        {
          name: 'meringue-roll',
          img: 'meringue-roll.png',
          title: 'Меренговый рулет',
        },
        {
          name: 'brownies',
          img: 'brownies.png',
          title: 'Брауни',
        },
        {
          name: 'meringue',
          img: 'meringue.png',
          title: 'Меренге (Безе)',
          recipes: [
            {
              title: 'Швейцарская меренга (Безешка по-нашему)',
              steps: [
                'На 1 часть белком берем 2 части сахара',
                'Соединяем все в термоустойчивой миске и ставим на водяную баню. Взбиваем белки до растворения сахара (прямо в водяной бане)',
                'Затем снимаем с бани и продолжаем взбивать до остывания, доводя до состояния крепких пиков ("Птичий клюв")',
                'После перекладываем массу в кондитерской мешок с нужной насадкой и',
                'Отсаживаем в пергаменте',
                'Ставим духовку на 85 - 90С сушиться на 2-3 часа',
                'И все готово'
              ]
            },
          ]
        },
        {
          name: 'pavlova',
          img: 'pavlova.png',
          title: 'Павлова',
        },
        {
          name: 'cake-pop',
          img: 'cake-pop.png',
          title: 'Кейк-попсы',
        },
        {
          name: 'cake-eskimos',
          img: 'cake-eskimos.png',
          title: 'Эскимошки'
        }
      ]  
      
      return {
        user, title, assortmentList
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>