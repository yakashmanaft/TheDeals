<template>
        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="title" />

        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
        >
            <br>
            <br>
            <!-- page content -->
            <h1>Список дел (заказы, поставки, личное)</h1>

            <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, rem necessitatibus praesentium numquam vel quaerat pariatur vero libero consequatur earum tempora cum, facilis fugiat aut doloremque illo deleniti animi quas. Unde officiis similique animi minima dolorem est, fuga modi sunt, sint quibusdam nemo illum nam magni deleniti aliquid distinctio enim. Ipsa illum repellat, modi voluptatibus fuga distinctio excepturi ullam veniam omnis blanditiis vero quidem quam suscipit sed ea qui. Soluta beatae culpa sunt ab ut placeat nostrum iusto obcaecati voluptates, fugit possimus magni odio incidunt nemo aut atque tempore asperiores non itaque deserunt officiis quasi inventore. Omnis earum sapiente eaque cum sunt pariatur enim sit nostrum facilis ea? Cum porro numquam doloribus illo recusandae officiis ipsa distinctio cumque odio, sed perspiciatis soluta quidem minima quasi sit vero repudiandae voluptate voluptatibus similique consectetur rerum. Esse praesentium cupiditate, voluptates in mollitia unde accusantium quos ut, alias vitae omnis atque, illum dolorem aspernatur dolore dolorum nemo veritatis quia quaerat repudiandae explicabo perferendis nisi! Consectetur ab exercitationem repellendus asperiores vero deserunt et optio facilis eaque nihil eum vitae assumenda iusto tenetur magnam, earum labore, corrupti perspiciatis nobis mollitia autem aut nesciunt! Consectetur adipisci earum, ipsa dicta natus laudantium placeat voluptates, odit dignissimos, nisi consequuntur vel necessitatibus aliquam veritatis. Magni unde at reiciendis error voluptate voluptatum velit expedita non. Iste doloribus expedita laudantium tempora non obcaecati deserunt, nemo nobis quo? Labore nobis adipisci unde? Cumque dolorum unde dolorem nobis atque voluptatum suscipit eveniet quaerat dicta obcaecati tempore repellendus, laboriosam exercitationem adipisci odio voluptatem maiores id ab culpa. Praesentium nesciunt quod a. Hic incidunt nihil praesentium fugiat molestiae autem quia modi fugit non beatae ullam doloribus similique sed, ea libero aperiam animi accusantium rem delectus, iusto, dolorum labore minus! Vero sapiente iusto tempora hic dignissimos at laborum soluta, aut officia aperiam, recusandae eligendi minima ea ut dolores, dolore impedit quis voluptates. Deserunt necessitatibus non perferendis repellendus atque molestiae accusantium suscipit voluptate debitis mollitia magni ut rerum quisquam, quam dolorum est, corrupti sed fuga quo iusto quis. Suscipit enim quaerat dolores consectetur dolorum aut ullam, sed ad odit nesciunt unde neque ea, est accusantium ipsum nam doloremque ipsa totam sapiente consequuntur possimus amet dolorem molestiae voluptate. Beatae quia voluptas quos, iusto explicabo, adipisci, vero harum illo ipsum cum optio fugit itaque. Neque quo labore eveniet eligendi? Fugiat perferendis obcaecati, impedit unde laborum quo vero sed minus officiis cum sint aliquid adipisci voluptatum culpa excepturi accusantium nobis. Quaerat, alias facere? Error odit earum saepe repudiandae non nisi praesentium iste esse quisquam ducimus consequuntur, exercitationem facilis veniam quasi consectetur adipisci fugiat ipsa quibusdam placeat? Aliquid quidem, dignissimos expedita temporibus dolore rerum ut possimus ipsam minus asperiores tenetur quibusdam eius quisquam soluta maxime est adipisci. Delectus cum eum porro voluptate, odit saepe. Dignissimos earum deleniti deserunt impedit. Laborum quas odit facilis at. Eligendi doloribus assumenda nemo magnam quis architecto adipisci dolor consequatur natus vel, distinctio commodi inventore! Beatae sint libero illum eveniet vero sit, laboriosam quos quasi laborum totam? Aspernatur, quos? Eos atque aliquam eligendi, alias quos quae temporibus corporis.
            </div>
        </ion-content>
</template>

<script>
    import { defineComponent } from 'vue';
    import Header from '../components/Header.vue'
    import { 
    IonContent, 
    IonHeader, 
    IonItem, 
    IonList, 
    IonMenu, 
    IonMenuToggle,
    IonButton,
    IonTitle, 
    IonToolbar,
    IonIcon,
    IonText
    } from '@ionic/vue';
    import { menu } from 'ionicons/icons';
    import store from '../store/index';
    import { computed } from 'vue';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import NavigationMenu from '../components/NavigationMenu.vue';


    export default defineComponent({
        name: 'Deals',
        components: {
            Header,
            IonContent, 
            IonHeader, 
            IonItem, 
            IonList, 
            IonMenu, 
            IonMenuToggle,
            IonButton,
            IonTitle, 
            IonToolbar,
            IonIcon,
            IonText,
            NavigationMenu
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Page title
            const title = router.currentRoute._value.meta.translation;

            return {
                menu, user, router, title
            }
        }
    })
</script>

<style scoped>

</style>