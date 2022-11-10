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
                <!--  -->
                <br>
                <ion-item-group>
                    Автор рецепта {{currentRecipe.recipeAuthorEmail}}
                </ion-item-group>
                <!-- Кнопка удалить -->
                <ion-button fill="clear" color="danger" @click="openDeleteMenu">Удалить</ion-button>
                <!-- Всплывашка подтверждение удаления рецепта -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Вы точно хотите удалить рецепт?"
                    @didDismiss="isOpenRef = false"
                    :buttons="deleteCurrentRecipeButtons"
                ></ion-action-sheet>
            </div>

        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { supabase } from '../../supabase/init';
    //
    import { IonContent, IonItemGroup, IonButton, IonActionSheet } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue'

    export default defineComponent({
        name: 'View-recipe',
        components: {
            ViewHeader, Spinner, IonContent, IonItemGroup, IonButton, IonActionSheet
        },
        setup() {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.recipeId;
            const info = route.params;
            const currentRecipe = ref(JSON.parse(info.recipe))
            //
            const spinner = ref(null);
            //
            const isOpenRef = ref(false)
            const openDeleteMenu = () => {
                isOpenRef.value = true
            }
            const deleteCurrentRecipeButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCurrentRecipe()
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ] 
            const deleteCurrentRecipe = async () => {
                // console.log(currentId)
                try {
                    const { error } = await supabase.from('userRecipes').delete().eq('id', currentId)
                    if(error) throw error
                    //router.push({ name: 'Recipes' })
                    router.go(-1)
                    alert('Wiew Recipe: Рецепт удален из книги')
                } catch (error) {
                    // Удалить если не понадобится
                    // alert(`Error: ${error.message}`)
                }
            }

            return {
                route, router, spinner, currentRecipe, currentId, info, openDeleteMenu, isOpenRef, deleteCurrentRecipeButtons, deleteCurrentRecipe
            }
        }
    })
</script>

<style scoped>

</style>