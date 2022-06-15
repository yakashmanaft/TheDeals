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

    <h2>Рецепты</h2>
    <ul v-for="(recipe, index) in recipes" :key="index">
      <li>{{recipe.title}}</li>
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

      //Рецепты кондитерских изделий
      const recipes = [
        {
          title: 'Красный бархат'
        },
        {
          title: 'Молочная девочка'
        },
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
        {
          title: 'Банановый с гаудой',
          
        }
      ]

      // Ассортимент по предметам заказа
      const assortmentList = [
        {
          name: 'cake',
          img: 'cake.png',
          title: 'Торт',
          costEstimation: 'perKilogram'
        },
        {
          name: 'wedding-cake',
          img: 'wedding-cake.png',
          title: 'Свадебный торт',
          costEstimation: 'perKilogram'
        },
        {
          name: 'cupcake',
          img: 'cupcake.png',
          title: 'Капкейк',
          costEstimation: 'perUnit'
        },
        {
          name: 'meringue-roll',
          img: 'meringue-roll.png',
          title: 'Меренговый рулет',
          costEstimation: 'perUnit'
        },
        {
          name: 'brownies',
          img: 'brownies.png',
          title: 'Брауни',
          costEstimation: 'perUnit'
        },
        {
          name: 'meringue',
          img: 'meringue.png',
          title: 'Меренге (Безе)',
          costEstimation: 'perUnit'
        },
        {
          name: 'pavlova',
          img: 'pavlova.png',
          title: 'Павлова',
          costEstimation: 'perUnit'
        },
        {
          name: 'cake-pop',
          img: 'cake-pop.png',
          title: 'Кейк-попсы',
          costEstimation: 'perUnit'
        },
        {
          name: 'cake-eskimos',
          img: 'cake-eskimos.png',
          title: 'Эскимошки',
          costEstimation: 'perUnit'
        }
      ]  
      
      return {
        user, title, assortmentList, recipes
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>