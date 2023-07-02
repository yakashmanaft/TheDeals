<template>
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader />

        <!-- page content -->
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
            <!-- page-content -->
            <!-- No data -->
            <div>
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div>
                <ion-item-group>
                    {{ currentItem }}
                </ion-item-group>

                <br>
                <ion-item-group>
                    Автор рецепта {{currentItem.recipeAuthorEmail}}
                </ion-item-group>
            </div>
        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { supabase } from '../../supabase/init';
    //
    import { IonContent, IonItemGroup } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue'

    export default defineComponent({
        name: 'View-store-recipe',
        components: {
            Spinner, ViewHeader,
            //
            IonContent, IonItemGroup
        },
        setup() {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.itemId;
            const info = route.params;
            const currentItem = ref(JSON.parse(info.item))
            //
            const spinner = ref(null);

            return {
                route, router, currentId, currentItem, spinner
            }
        }
    })
</script>

<style scoped>

</style>