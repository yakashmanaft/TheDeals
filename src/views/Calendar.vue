<template>
  <div>
    <!-- component Navigation -->
    <Navigation :title="title"/>

    <div class="pt-20 container">
      <h2>экран календаря</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam voluptate iusto animi veritatis quisquam, ut perspiciatis cumque eaque unde sequi, assumenda dicta minima nostrum optio. Ea inventore magni est esse a doloribus deserunt sunt fugit vero, temporibus aliquam. Consectetur, qui dignissimos rem vitae repellat natus omnis quaerat iure nemo dicta dolores dolor nobis eius totam ut odio, perferendis adipisci expedita doloribus? Corporis perspiciatis corrupti eligendi ex illum similique fugiat labore nesciunt culpa dolorum totam sequi porro amet ab, voluptates ipsam obcaecati quod voluptatum laudantium dicta! Ab voluptas alias eaque veritatis eos aspernatur perferendis, optio numquam natus, velit omnis. Nulla at asperiores voluptate recusandae velit, porro iste deserunt eveniet impedit, aut vitae. Possimus incidunt excepturi nulla placeat nam quo aspernatur voluptas, odit, dolorem earum ducimus, quaerat odio laboriosam aut vero officia fuga cum corporis ad expedita tempora necessitatibus obcaecati praesentium! Illo exercitationem magnam aperiam atque libero! Nihil aperiam asperiores deleniti odio enim nisi ratione, quaerat sed iusto laudantium esse sequi tenetur culpa. Iste explicabo enim placeat eum! Eveniet, voluptate! Quos, maiores incidunt. Earum ullam officiis facilis recusandae natus obcaecati, aspernatur nemo magni totam molestiae! Libero quis, placeat fugit, explicabo officiis soluta expedita veniam omnis rem, qui dolore vel molestias doloremque in a numquam laudantium. Quae labore, aperiam expedita molestias ducimus vel nisi nam, illo, sed voluptas mollitia modi reprehenderit. Maxime modi nulla, eum animi ipsam quisquam, ratione quae earum debitis doloribus velit vero, perspiciatis recusandae veniam? Exercitationem expedita provident rerum. Natus est ex atque obcaecati vitae cum ea quo blanditiis, mollitia eaque libero. Aliquid tenetur facilis ipsum, dolorem sit expedita eos repudiandae, neque repellat culpa qui omnis illo error, laborum quod et doloribus quas maxime voluptates fuga impedit fugit ullam aliquam adipisci. Deleniti qui, sed voluptatem reprehenderit itaque dolore eveniet esse odio fuga consequatur. Dolores maxime omnis obcaecati? Magni omnis illum nemo accusantium reprehenderit nesciunt. Ducimus doloribus modi perspiciatis repellendus veritatis temporibus esse qui nulla neque sint a, voluptatibus tempore possimus sed aspernatur quidem vel blanditiis provident, voluptates excepturi sapiente consequuntur praesentium similique. Ipsum temporibus assumenda quibusdam aspernatur impedit saepe quam qui aperiam odit dolor cumque magnam pariatur, quae dicta autem ratione eum sunt iusto voluptates, animi dignissimos ipsa, expedita totam vitae. Voluptas eligendi maiores neque modi ducimus enim quia similique, beatae atque! Numquam nam maxime voluptate quas similique accusamus illo, sint quidem quae cupiditate provident fugiat accusantium assumenda alias sed dolores suscipit officia minus nisi. Incidunt, cum voluptate provident iste mollitia consequatur officia molestias, aliquam, laboriosam obcaecati repudiandae eligendi ex cupiditate. Quibusdam, laborum deserunt. Iusto beatae earum exercitationem deleniti quas, magnam sequi expedita eaque voluptatem quos, asperiores cumque. Perspiciatis fuga quisquam suscipit voluptatem nostrum commodi optio sapiente dicta nesciunt minus dignissimos facilis beatae alias ratione necessitatibus, laboriosam magnam? Accusantium voluptates, voluptatum nam enim obcaecati, sed tempora ipsum molestiae porro velit, mollitia vel aspernatur at blanditiis cumque eius esse cupiditate dolorem! Deserunt dolor doloribus saepe quidem sunt velit incidunt blanditiis nam aut sint qui facilis officia provident nisi fuga ex, aliquid distinctio quos debitis eum ullam adipisci itaque magni. Nostrum, est!</p>
    </div>
  </div>

  <!-- Здесь планирую показывать диаграмы может какие -->
</template>

<script>
  import Navigation from '../components/Navigation.vue';

  import store from '../store/index';
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    components: {
      Navigation
    },
    setup () {
      const dataLoaded = ref(null);
      const statusMsg = ref(null);
      const errorMsg = ref(null);

      const user = computed(() => store.state.user);

      // Берем имя роута для заголовка
      const router = useRouter();
      const title = router.currentRoute._value.meta.translation;
      
      return {
        dataLoaded, statusMsg, errorMsg, user, title
      }
    }
  }
</script>

<style scoped>
  .container {
    height: 100vh;
  }
</style>