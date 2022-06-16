<template>
  <div>
    <!-- Component Navigation -->
    <Navigation :title="title"/>

    <!-- content -->
    <div class="pt-20 container">
      <h2>экран склада</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis quos odio quidem nostrum accusantium itaque expedita rem atque animi explicabo obcaecati quae delectus a perferendis beatae corrupti quasi minus placeat reprehenderit quam at illum, cupiditate hic? Unde id nemo laboriosam in nulla, officia soluta voluptate ipsam repellendus atque recusandae dignissimos sunt quibusdam eaque corrupti facilis esse perspiciatis repudiandae vero pariatur quod ut sequi impedit. Possimus consectetur recusandae reiciendis blanditiis quis quae sequi laborum commodi tempore pariatur. Ipsam blanditiis incidunt laboriosam officiis officia facilis! Alias eos modi ea nostrum veniam quidem nobis obcaecati corporis sapiente laboriosam optio, aliquam enim nisi! Aspernatur rem voluptate consectetur doloribus officiis? Inventore cupiditate atque recusandae impedit similique, magni voluptatibus velit necessitatibus sed quis nisi repudiandae suscipit facere totam dicta voluptatem! Nemo, velit pariatur incidunt beatae repudiandae enim ab quae, fuga placeat labore molestiae nam inventore dolores perspiciatis sit quaerat. Id fugit unde ut nulla veniam quas quibusdam. Assumenda odio cupiditate reiciendis aspernatur voluptatibus? Voluptatem praesentium numquam non nihil nulla cum veniam unde illo est maxime dicta, doloremque iusto tempora porro, rerum tempore quaerat, corrupti sunt magni quasi. Harum nihil, commodi tempora atque perferendis provident, sint fugiat deserunt officiis consectetur, qui voluptatibus totam ratione odio ullam? Dignissimos cum eveniet quibusdam. Atque necessitatibus, autem rem, recusandae error, non consequuntur similique iste reiciendis corporis quam ullam adipisci tempore voluptas. Cumque eos culpa harum, eveniet cupiditate accusamus autem. Consectetur, ex. Harum quasi ex atque impedit nisi assumenda optio necessitatibus quibusdam sapiente enim, omnis maxime deleniti eos et neque nesciunt laborum, voluptate at. Minima tenetur nam doloremque optio quos animi autem, mollitia nobis quasi fugiat voluptatum voluptate ex? Incidunt quidem vel nisi minus fugiat est placeat sed corporis nesciunt. Tempora, modi eligendi. Labore aliquam dolore iure harum numquam aut iusto nesciunt optio fugit officiis eveniet, exercitationem voluptates architecto totam aspernatur? Culpa, dolor placeat dolores veritatis animi quos laborum ex ipsam optio similique eaque veniam vitae odio commodi dicta, maxime eveniet fuga dignissimos voluptatum ad sint libero quis! Repellendus dolor nihil maxime cumque et aliquid a rem dignissimos, non vitae placeat quam veniam soluta ullam eius aspernatur laboriosam beatae id fugit. Sapiente aliquid quo voluptatum a illo nulla et qui enim corporis dignissimos, hic quis consectetur maiores commodi saepe recusandae magni perferendis! Consequuntur maxime corporis accusamus rerum veniam! Id dicta obcaecati vitae non aliquam expedita iure, rem ea ut consectetur nisi excepturi laborum ad placeat assumenda sequi architecto accusantium praesentium earum eos eius illum reprehenderit nobis! Eligendi soluta consectetur asperiores molestiae vitae laudantium qui, omnis error illo at perspiciatis explicabo illum! Voluptatibus nostrum quas magnam dolor placeat a expedita tempora, at ullam possimus praesentium porro itaque mollitia fuga commodi alias ipsum illo ea voluptates rem. Beatae unde rem facere saepe maiores voluptates necessitatibus, ab dolorum iure dignissimos aliquam exercitationem. Soluta, nostrum voluptas! Repellendus pariatur, quisquam ab illo laborum quas optio? Autem molestiae maiores incidunt vero ad animi mollitia officiis officia corrupti a, odio eaque atque possimus non soluta rem voluptas modi. Possimus voluptatum quaerat deserunt ratione eos excepturi molestiae atque aut rerum.</p>
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