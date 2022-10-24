<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader />

        <!-- page-content -->
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
                    {{currentRecipe}}
                </ion-item-group>
            </div>

        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    //
    import { IonContent, IonItemGroup } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue'

    export default defineComponent({
        name: 'View-recipe',
        components: {
            ViewHeader, Spinner, IonContent, IonItemGroup
        },
        setup() {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.dealId;
            const info = route.params;
            const currentRecipe = ref(JSON.parse(info.recipe))
            //
            const spinner = ref(null);
            return {
                route, router, spinner, currentRecipe, currentId
            }
        }
    })
</script>

<style scoped>

</style>