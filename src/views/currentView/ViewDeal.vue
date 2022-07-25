<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader :edit="edit" :editMode="editMode" :update="update" :cancelEdit="cancelEdit"/>

        <!-- page-content -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
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
                {{currentId}}
                <br>
                {{currentDeal}}
                <br>
                <!-- Кнопка удалить контакта -->
                <!-- Не показываем в режиме edit -->
                <ion-button v-if="!edit" @click="setOpen(true)" fill="clear" color="danger">Удалить дело</ion-button>
                <!-- Всплывашка подтверждение -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Точно удалить?"
                    :buttons="buttons"
                    @didDismiss="setOpen(false)"
                >
                </ion-action-sheet>
            </div>
        </ion-content>

    </div>
</template>

<script>
    import { onMounted, defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import { IonContent, IonButton, IonActionSheet } from '@ionic/vue';
    import {  } from 'ionicons/icons';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    export default defineComponent({
        name: 'View-deal',
        components: {
            Spinner, ViewHeader, IonContent, IonButton, IonActionSheet
        }, 
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.dealId;
            const info = route.params;
            const currentDeal = ref(JSON.parse(info.deal))
            // Храним на случай нажатия Отмены при редактировании контакта
            const tempData = JSON.parse(info.deal)
            //
            const spinner = ref(null);
            // Edit contact info
            const edit = ref(null)
            const editMode = () => {
                edit.value = !edit.value;
            }
            // Cancel editMode & cancel all changes
            const cancelEdit = () => {
                edit.value = !edit.value;
                // note.value = !note.value;
                currentDeal.value = tempData
                reloadData()
            }
            // Обновляем данные из БД
            // вынести в store?
            const reloadData = async () => {
                try {
                    const { data: myDeals, error } = await supabase.from('deals').select('*').eq('id', currentId);
                    currentDeal.value = myDeals[0];
                    if (error) throw error;
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }     
            // update current deal function
            const update = async () => {
                try {
                    spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${currentId} is updated`)
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                edit.value = !edit.value;
                spinner.value = false;
            }
            // delete current deal function
            const deleteDeal = async () => {
                try {
                    const { error } = await supabase.from('deals').delete().eq('id',currentId);
                    if(error) throw error;
                    router.push({ name: 'Deals' })
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            // меню подтверждения удаления current contact
            const isOpenRef = ref(false);
            const setOpen = (boolean) => isOpenRef.value = boolean;
            const buttons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        console.log('Delete clicked')
                        deleteDeal()
                    },
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    },
                }
            ]
            return {
                spinner, currentId, info, currentDeal, edit, editMode, cancelEdit, update, isOpenRef, setOpen, buttons, deleteDeal
            }
        }
    })
</script>

<style scoped>

</style>