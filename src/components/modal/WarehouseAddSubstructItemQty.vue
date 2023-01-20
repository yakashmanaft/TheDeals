<template>
    <!-- 
        Чайная ложка – 5 мл это примерно 5 грамм
        Десертная ложка — 10 мл жидкости — 10 грамм
        Столовая ложка — 15 мл жидкости — 15 грамм
        Щепотка – 2-4 грамма
    -->
    <ion-modal>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-title>{{ setTitle(actionType) }}</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="closeModal">Закрыть</ion-button>
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
            <!-- <ion-text>Item</ion-text><br>
            <ion-text>{{ data }}</ion-text><br>
            <ion-text>{{ route }}</ion-text> -->

            <ion-item-group v-if="route === 'Warehouse'" class="ion-padding-horizontal">
                <!-- Заголовок -->
                <ion-text>
                    <h4>Предмет</h4>
                </ion-text>

                <!--  -->
                <ion-item lines="none" class="ion-no-padding">
                    <!-- Если ничего не было выбрано -->
                    <ion-text
                        v-if="data.name === undefined"
                        color="primary" 
                        style="border-bottom: 1px dashed var(--ion-color-primary)"
                        @click.stop="searchUserWarehouseItemMenu = true"
                    >
                        Выберите из списка
                    </ion-text>

                    <!-- Если предмет был указан -->
                    <ion-grid v-else class="ion-no-padding">
                        <ion-row @click.stop="searchUserWarehouseItemMenu = true" class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                            <!--  -->
                            <ion-text color="primary">{{ data.name }}</ion-text>
                            <!--  -->
                            <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                                <ion-img :src="setImgSrc(data.name)"></ion-img>
                            </ion-thumbnail>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-item-group>

            <ion-item-group v-if="data.name !== undefined" class="ion-padding-horizontal">
                <!-- Заголовок -->
                <ion-text>
                    <h4>Сколько {{ actionType }} 
                        <span v-if="data.estimationType === 'perKilogram'">в граммах</span>
                        <span v-if="data.estimationType === 'perUnit'">шт.</span>
                        <span v-if="data.estimationType === 'per100gram'">по 100 гр.</span>
                    </h4>
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

        <!-- Список предметов user warehouse -->
        <SearchUserWarehouseItem
            :isOpen="searchUserWarehouseItemMenu"
            @closeModal="searchUserWarehouseItemMenu = false"
            @addItem="addItemToCurrentElement"
        />
    </ion-modal>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import store from '../../store/index';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonText, IonItemGroup, IonInput, IonItem, IonGrid, IonRow, IonThumbnail, IonImg } from '@ionic/vue';
    //
    import Spinner from '../../components/Spinner.vue'
    import SearchUserWarehouseItem from '../../components/modal/SearchUserWarehouseItem.vue'

    export default defineComponent({
        name: 'WarehouseAddSubstructItemQty',
        emits: ['closeModal'],
        props: {
            actionType: String,
            itemData: Object,
            email: String,
            routeName: String
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonText, IonItemGroup, IonInput, IonItem, IonGrid, IonRow, IonThumbnail, IonImg,
            //
            Spinner, SearchUserWarehouseItem
        },
        setup(props, { emit }) {
            const data = ref(props.itemData)
            const userEmail = ref(props.email)
            const route = ref(props.routeName)
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
                        data.value.subjectQty = +data.value.subjectQty + +actionQty.value
                        updateSubjectQtyBD(data.value)
                        makeRecordInLedgerWarehouse(data.value, actionType)
                    } else if (actionType ==='вычесть') {
                        if(+actionQty.value <= +data.value.subjectQty) {
                            data.value.subjectQty = +data.value.subjectQty - +actionQty.value
                            updateSubjectQtyBD(data.value)
                            makeRecordInLedgerWarehouse(data.value, actionType)
                        } else {
                            alert('WarehouseAddSubstructItemQty: Значение к вычитанию не может быть больше текущих остатков на складе!')
                        }
                    }
                }
            }
            const updateSubjectQtyBD = async (itemData, actionType) => {
                spinner.value = true;
                try{
                    const {error} = await supabase.from('userWarehouse').update({
                        subjectQty: data.value.subjectQty
                    }).eq('id', data.value.id) 
                    if(error) throw error;
                    // spinner.value = false;
                    // actionQty.value = ''
                    // emit('closeModal')
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            const makeRecordInLedgerWarehouse = async (itemData, actionType) => {
                let typeOfAction;
                if(actionType === 'добавить') {
                    typeOfAction = 'add'
                } else if (actionType === 'вычесть') {
                    typeOfAction = 'substract'
                }
                try{
                    const { error } = await supabase.from('ledgerWarehouse').insert([{
                        itemID: data.value.id,
                        uid: data.value.uid,
                        estimationType: data.value.estimationType,
                        actionType: typeOfAction,
                        qty: actionQty.value,
                        userEmail: userEmail.value
                    }])
                    if(error) throw error
                    spinner.value = false;
                    data.value = {}
                    actionQty.value = ''
                    emit('closeModal')
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            // =========================================== ПОИСК В СПИСКЕ ПРЕДМЕТОВ User warehouse
            const searchUserWarehouseItemMenu = ref(false)
            const addItemToCurrentElement = (item) => {
                data.value = item;
                searchUserWarehouseItemMenu.value = false
            }
            // отображение выбранного предмета
            const setImgSrc = (itemName) => {
                let itemsArray = store.state.dealBuySubjectArray
                let itemValue;
                itemsArray.filter(item => {
                    if(item.name === itemName) {
                        itemValue = item.value
                    }
                })
                return `../img/subjects/buy/${itemValue}.webp`
            }

            // 
            const closeModal = () => {
                emit('closeModal')
                if(route.value === 'Warehouse') {
                    data.value = {}
                    actionQty.value = ''
                } else {
                    actionQty.value = ''
                }
            }

            return {
                route, setTitle, actionQty, setWarehouseLedgerData, spinner, userEmail, searchUserWarehouseItemMenu, addItemToCurrentElement, data, setImgSrc, closeModal
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