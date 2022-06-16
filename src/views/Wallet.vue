<template>
  <div>
    <Navigation :title="title"/>

    <div class="pt-20 container">
      <h2>экран кошелька</h2>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum aut, ratione perspiciatis commodi dolorum, reprehenderit quia sint saepe molestiae odit sapiente recusandae id vero dignissimos consequuntur inventore alias impedit, dicta vitae maxime a! Repudiandae ipsam at aliquid tenetur. Natus, dicta illum quas quisquam aspernatur explicabo fugit debitis quaerat totam ut repudiandae beatae voluptate laudantium nulla laboriosam ducimus odio dolor perferendis iste repellat excepturi officia! Asperiores deserunt quis consequuntur sed enim ea nemo error, harum consequatur totam qui dolorum, ipsa eveniet beatae aliquid. Laboriosam commodi neque cum mollitia ipsam tempora molestias, consectetur odit eius consequatur? Veniam nobis nisi architecto repellat reiciendis voluptate aliquam. Recusandae assumenda, quis iste dolore mollitia aperiam minus! Repellat reiciendis esse voluptatum sed magni veniam inventore soluta ipsum laudantium suscipit necessitatibus porro harum labore ratione explicabo, quidem natus dignissimos consequuntur odio exercitationem sapiente. Ex, totam, aperiam porro quibusdam aliquam, quod fugiat adipisci velit sit ipsam maiores veritatis? Debitis rerum enim omnis qui quia nostrum nam voluptatum similique deleniti delectus, commodi, reiciendis accusantium cupiditate. Modi tempora ullam neque ea doloribus error quo voluptate illo veritatis, harum ex laborum possimus, cumque ut quibusdam fugiat sequi inventore. Cupiditate minus explicabo rem libero labore tempore odio neque rerum. Ut, ea possimus molestias impedit cum facilis dignissimos perferendis iusto deleniti architecto! Laborum itaque, amet incidunt nobis molestiae pariatur, doloribus excepturi, magni aut ratione quas? Molestiae repellat totam porro commodi? Ea ex facere, quas harum dolor velit facilis! Ipsa qui perferendis ab quidem harum earum fugiat doloremque. Praesentium velit optio expedita sit autem perspiciatis dignissimos id corrupti animi temporibus nisi maiores ullam et illo est, fuga ad inventore cum, minus harum numquam nihil voluptatem perferendis! Ipsum voluptas nemo impedit voluptate voluptatum, deserunt necessitatibus sapiente doloremque fugit eveniet voluptatibus, dolorem suscipit provident? Eligendi modi deserunt, dolore corporis, aliquid hic maxime quaerat necessitatibus natus repellat dicta tempore distinctio possimus nemo quidem ut delectus nam. Beatae ipsum, impedit dignissimos exercitationem animi et aspernatur sint aperiam, laboriosam repellendus itaque velit minus, necessitatibus ab sapiente veritatis vel non ullam illum! Possimus consequatur praesentium enim eligendi hic dicta voluptates cumque placeat, autem minus molestiae eius laborum ipsum repellendus officiis dolorem quis odio culpa est aliquid. Ratione eligendi rerum omnis rem mollitia sapiente alias repellendus quis nostrum, magnam deserunt animi ullam sequi libero corrupti quam dicta nemo architecto, enim magni totam, quia voluptas possimus! Mollitia provident iste ab nulla labore sint fugit earum corrupti consequuntur officiis itaque deserunt voluptas tempora iure facilis sapiente, aliquam, consectetur libero aspernatur optio nam! Repellendus, consequuntur quo, a magni dolorem in magnam quae delectus distinctio itaque asperiores sunt quibusdam ipsa inventore adipisci culpa sint quisquam blanditiis expedita eaque. Temporibus velit dolorum dolor id soluta voluptas modi, animi voluptatum, est veniam, eligendi autem magni. Mollitia saepe hic quis rerum iusto ratione ipsum distinctio eaque quo eveniet modi quidem ipsam similique blanditiis ipsa quam enim impedit, id delectus voluptatum inventore. Aut ducimus dolorum saepe consectetur veritatis voluptates totam reprehenderit, minima aliquam obcaecati. Corporis esse atque repellat similique eum, qui eveniet excepturi iusto unde in molestias doloremque voluptatibus laboriosam.</p>
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
      
      return {
        user, title
      }
    }
  }
</script>

<style scoped>
  .container {
    height: 100vh;
  }
</style>