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
                    {{ currentItem }}
                </ion-item-group>
                <!-- Кпнока удалить -->
                <ion-button fill="clear" color="danger" @click="openDeleteMenu">Удалить</ion-button>
                <!-- Всплывашка подтверждение удаления предмета-->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Вы хотите удалить предмет?"
                    @didDismiss="isOpenRef = false"
                    :buttons="deleteWarehouseItemButtons"
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
        name: 'View-warehouse-item',
        components: {
            ViewHeader, Spinner, 
            //
            IonContent, IonItemGroup, IonButton, IonActionSheet
        },
        setup () {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.itemId;
            const info = route.params;
            const currentItem = ref(JSON.parse(info.item))
            //
            const spinner = ref(null);
            //
            const isOpenRef = ref(false)
            const openDeleteMenu = () => {
                isOpenRef.value = true
            }
            const deleteWarehouseItemButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCurrentItem()
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
            const deleteCurrentItem = async () => {
                // console.log(currentId)
                try {
                    const { error } = await supabase.from('userWarehouse').delete().eq('id', currentId)
                    if(error) throw error
                    // router.push({ name: 'Warehouse' })
                    router.go(-1)
                    alert('Wiew Warehouse: Предмет удален со склада')
                } catch (error) {
                    // Удалить если не понадобится
                    // alert(`Error: ${error.message}`)
                }
            }

            return {
                route, router, spinner, currentId, info, currentItem, openDeleteMenu, isOpenRef, deleteWarehouseItemButtons
            }
        }
    })
</script>

<style scoped>

</style>