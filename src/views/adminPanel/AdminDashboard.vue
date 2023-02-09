<template>
  <div>
    <!-- Спиннер как имитация загрузки -->
    <Spinner v-if="spinner"/>

    <!-- Navigation Menu -->
    <navigation-menu
        :title="pageTitle"
    />

    <!-- page header -->
    <Header
      :title="pageTitle"
      style="background-color: white"
    />

    <!-- Контент -->
    <ion-content
      :scroll-events="true"
      class="ion-page ion-margin-top" 
      id="main"
      type="push"
      forceOverscroll="false"
    >
      <br>
      <br>
      <br>
      <!-- page content -->

      <!-- ================================== about users ================================== -->
      <!-- Пользваотели -->
      <ion-card>
        <!--  -->
        <ion-card-header>
          <ion-card-title class="ion-text-start">Пользователи</ion-card-title>
        </ion-card-header>

        <!--  -->
        <ion-card-content>
          <div v-for="(user, index) in usersArray" :key="index">
            <ion-grid class="ion-no-padding ">
              <ion-row class="ion-justify-content-between ion-align-items-center" >
    
                <!--  -->
                <ion-text class="ion-text-start width-sm-100">{{user.email}}</ion-text>
    
                <!--  -->
                <ion-text>{{ formattedDate(user.created_at) }}</ion-text>
                
              </ion-row>
            </ion-grid>
          </div>
        </ion-card-content>
      </ion-card>

      <span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae voluptatibus aut reprehenderit esse architecto. Distinctio dolor, quidem dicta eaque, ab excepturi nemo natus nostrum incidunt quo quam! Architecto temporibus animi magni ipsa. Fugit labore commodi cum eius nesciunt dignissimos rem suscipit, ab, corporis in praesentium. Veniam maxime ut sed numquam praesentium voluptate? Animi voluptate quod nostrum cupiditate deleniti aspernatur? Fugiat repellendus atque veritatis fuga, assumenda nostrum corporis ullam earum reprehenderit dicta sunt aliquam vero, officiis architecto ea debitis veniam? Et corrupti ab ut aut blanditiis, explicabo, doloribus vel commodi aspernatur labore optio asperiores, quasi nobis necessitatibus vero repellendus molestiae dicta mollitia! Magnam velit quia obcaecati praesentium accusamus quae aspernatur nobis fugit, minus corrupti tempore ratione quisquam nostrum perspiciatis suscipit, voluptas temporibus possimus vel amet minima. Odit fuga accusantium labore ad delectus officia eum velit, vero veritatis laboriosam nobis vitae excepturi esse? Ullam, voluptatem velit ut deserunt eligendi laborum! Consequuntur in dolorem aperiam vitae asperiores adipisci vel, quia ut est laudantium iste fuga sapiente autem neque aspernatur minus nam similique sit alias unde ipsa beatae, perspiciatis eos temporibus? Laborum quo nesciunt est quas odit numquam sint distinctio neque! Magni quas, eos aspernatur reiciendis numquam molestiae doloremque perspiciatis dolor adipisci sunt fugit perferendis autem mollitia atque repellat, nam facere minus non vel, hic omnis beatae! Facere quo quidem, nihil omnis nemo consequuntur illum atque ipsa incidunt voluptate sint officia, repellat dolores provident perspiciatis. Corrupti distinctio sint mollitia numquam dolores tempora ipsam molestias doloribus enim. Optio, minus doloremque. Praesentium illo odit voluptas voluptatibus hic dolorem, nesciunt amet sunt necessitatibus, nulla iure ducimus eius nisi ipsa illum deleniti consectetur! Iure, veritatis suscipit dolorum reprehenderit, ducimus porro maiores eius maxime voluptatum, fugit doloribus eveniet aspernatur harum quaerat tempora vero placeat provident ad est recusandae ut nam? Eius, natus reiciendis. Voluptatibus ullam doloremque possimus minus eveniet in ut et nemo officiis delectus alias debitis corporis, tempora magni omnis libero placeat deleniti voluptas velit dolore! Ea, veniam ducimus quae deserunt, provident laborum molestias officia modi eligendi tenetur libero accusantium sed quidem dicta. Ipsam maxime est, id cumque, culpa deserunt quia sint ad aspernatur eos non odio saepe odit a rem, vitae assumenda magni sit dolores aliquid doloribus consequatur ducimus repellat! Temporibus, saepe fugit laborum ullam, tempore repudiandae culpa accusantium inventore unde magni quos magnam reprehenderit illum reiciendis excepturi laudantium. Provident molestiae placeat omnis quos quidem aspernatur eaque at temporibus repudiandae accusamus architecto ratione magni aliquam praesentium, enim repellat rerum? Accusamus illo hic eaque enim eos possimus magnam sint tempore, delectus expedita culpa totam optio. Ipsa vel possimus illum ea architecto id quis modi aspernatur magnam, suscipit minima blanditiis reprehenderit nihil eligendi earum inventore odit officiis fugit aliquam placeat quibusdam quod dolores. Cumque repudiandae praesentium obcaecati hic illum libero exercitationem quod ea, possimus vitae dolor molestiae cupiditate in, consequuntur amet facere necessitatibus! Explicabo, pariatur mollitia nisi ducimus non vero cumque tempore tenetur iste magni dolorum voluptatum dolorem sequi suscipit laborum dicta facilis? Consectetur, aliquid ratione consequuntur possimus voluptates perferendis laborum porro ad eum voluptate, quod reprehenderit assumenda doloremque.</span>

    </ion-content>

    <!-- page footer -->
    <Footer/>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
//
import Spinner from '@/components/Spinner.vue'
import Header from '../../components/headers/Header.vue'
import NavigationMenu from '@/components/NavigationMenu.vue';
import Footer from '@/components/Footer.vue';
//
import { IonContent, IonGrid, IonRow, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonText } from '@ionic/vue';
//
import store from '../../store/index';
import { supabase } from '../../supabase/init';
//
import { format, parseISO, formatISO } from 'date-fns';
import { ru } from 'date-fns/locale';

  export default defineComponent({
    name: 'AdminDashboard',
    components: {
      Spinner, Header, NavigationMenu, Footer,
      //
      IonContent, IonGrid, IonRow, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonText
    },
    setup(props, { emit }) {
      // Общая инфа о пользователях
      const usersArray = ref()
      //
      const spinner = ref(null);
      spinner.value = true;
      // Setup ref to router
      const router = useRouter();
      // Get page title
      const pageTitle = router.currentRoute._value.meta.translation;

      onMounted(async () => {
        await store.methods.getUsers();
        usersArray.value = store.state.usersArray.reverse()
        //
        spinner.value = false
      })
      //
      const formattedDate = (day) => {
          if(day) {
              // const formattedString = format(parseISO(day), 'd MMMM yyyy');
              const formattedString = format(parseISO(day), 'dd.MM.yyyy', { locale: ru });
              return formattedString;
          }
      }

      return {
        usersArray, spinner, formattedDate, router, pageTitle
      }
    }
  })
</script>

<style scoped>
  @media(max-width: 576px) {
    .width-sm-100 {
      width: 100%
    }
  }
</style>