<template>
    <ion-modal>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-title>{{ setTitle(actionType) }}</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!--  -->
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
            <ion-text>Item</ion-text><br>
            <ion-text>{{ itemData }}</ion-text><br>

            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Сколько {{ actionType }}</h4>
                </ion-text>

                <!--  -->
                <ion-input v-model="actionQty" inputmode="decimal" placeholder="0">

                </ion-input>
            </ion-item-group>

            <!-- Кнопка -->
            <div style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999" class="ion-padding">
                <ion-button expand="block" @click.stop="setWarehouseLedgerData(itemData, actionType)">{{ setTitle(actionType) }}</ion-button>
            </div>

        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonText, IonItemGroup, IonInput } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue'

    export default defineComponent({
        name: 'WarehouseAddSubstructItemQty',
        emits: ['closeModal'],
        props: {
            actionType: String,
            itemData: Object,
            email: String
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonText, IonItemGroup, IonInput,
            //
            Spinner
        },
        setup(props, { emit }) {
            const userEmail = ref(props.email)
            const spinner = ref(null)
            const setTitle = (actionType) => {
                const result = actionType.charAt(0).toUpperCase() + actionType.slice(1)
                return result
            }

            const actionQty = ref('')

            const setWarehouseLedgerData = (itemData, actionType) => {
                if(actionQty.value === '') {
                    alert('WarehouseAddSubstructItemQty: Укажите значение для изменения остатков на складе')
                } else {
                    if(actionType === 'добавить') {
                        itemData.subjectQty = +itemData.subjectQty + +actionQty.value
                        updateSubjectQtyBD(itemData)
                        makeRecordInLedgerWarehouse(itemData)
                    } else if (actionType ==='вычесть') {
                        if(+actionQty.value <= +itemData.subjectQty) {
                            itemData.subjectQty = +itemData.subjectQty - +actionQty.value
                            updateSubjectQtyBD(itemData)
                            makeRecordInLedgerWarehouse(itemData)
                        } else {
                            alert('WarehouseAddSubstructItemQty: Значение к вычитанию не может быть больше текущих остатков на складе!')
                        }
                    }
                }
            }
            const updateSubjectQtyBD = async (itemData) => {
                spinner.value = true;
                try{
                    const {error} = await supabase.from('userWarehouse').update({
                        subjectQty: itemData.subjectQty
                    }).eq('id', itemData.id) 
                    if(error) throw error;
                    // spinner.value = false;
                    // actionQty.value = ''
                    // emit('closeModal')
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            const makeRecordInLedgerWarehouse = async (itemData) => {
                try{
                    const { error } = await supabase.from('ledgerWarehouse').insert([{
                        itemID: itemData.id,
                        uid: itemData.uid,
                        estimationType: itemData.estimationType,
                        qty: itemData.subjectQty,
                        userEmail: userEmail.value
                    }])
                    if(error) throw error
                    spinner.value = false;
                    actionQty.value = ''
                    emit('closeModal')
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }

            // добавляем запись (строку) от транзакции в леджер
            // const addToLedger = async (amount) => {
            //     try {
            //         const { error } = await supabase.from('ledger').insert([{
            //             dealID: currentDeal.value.id,
            //             uid: currentDeal.value.uid,
            //             contactID: currentDeal.value.contactID,
            //             dealType: currentDeal.value.dealType,
            //             amount: amount,
            //             userEmail: currentDeal.value.email
            //         }])
            //         if(error) throw error
            //     } catch (error) {
            //         alert(`Error: ${error.message}`)
            //     }
            // }

            return {
                setTitle, actionQty, setWarehouseLedgerData, spinner, userEmail
            }
        }
    })
</script>

<style scoped>

</style>