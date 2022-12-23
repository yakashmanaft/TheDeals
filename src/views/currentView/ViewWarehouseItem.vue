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
                {{ currentItem }}

                <!-- Название предмета или сам предмет  -->
                <ion-item-group class="ion-padding-bottom ion-padding-horizontal ion-text-left">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Предмет</h4>
                    </ion-text>

                    <!-- OFF режим редактирования -->
                    <!-- Название (Если НЕ тортодилер) -->

                    <!-- Название (Если тортодилер) -->
                    <ion-item lines="none" style="--inner-padding-end: none" class="ion-no-padding">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                <!--  -->
                                <ion-text color="medium">{{ currentItem.name }}</ion-text>
                                <!--  -->
                                <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                                    <ion-img :src="setImgSrc(currentItem.name)"></ion-img>
                                </ion-thumbnail>
                            </ion-row>
                        </ion-grid>
                    </ion-item>

                    <!-- ON режим редактирования -->
                    <!-- Название (Если НЕ тортодилер) -->

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
    import store from '../../store/index';
    //
    import { IonContent, IonItemGroup, IonButton, IonActionSheet, IonText, IonItem, IonThumbnail, IonImg, IonGrid, IonRow } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue'

    export default defineComponent({
        name: 'View-warehouse-item',
        components: {
            ViewHeader, Spinner, 
            //
            IonContent, IonItemGroup, IonButton, IonActionSheet, IonText, IonItem, IonThumbnail, IonImg, IonGrid, IonRow
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
            
            // Подгружаем картинку в название предмета
            const setImgSrc = (itemName) => {
                let dealBuySubjectArray = store.state.dealBuySubjectArray;
                let value;
                dealBuySubjectArray.filter(item => {
                    if(item.name === itemName) {
                        value = item.value
                    }
                })
                return `../img/subjects/buy/${value}.webp`
            }

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
                route, router, spinner, currentId, info, currentItem, openDeleteMenu, isOpenRef, deleteWarehouseItemButtons, setImgSrc
            }
        }
    })
</script>

<style scoped>
    .thumbnail_deal-subject {
        height: 64px;
        min-width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        padding: 0.5rem;
    }
</style>