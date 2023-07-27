<template>
    <ion-card class="ion-padding-horizontal ion-padding-vertical">
        <!-- Header of the card -->
        <ion-card-header class="ion-no-padding">
            <ion-grid class="ion-no-padding">
                <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap">
                    <div style="display: flex;" class="relative">
                        <ion-thumbnail class="icon-thumbnail absolute" :class="{'icon-thumbnail_sale': deal.dealType === 'sale', 'icon-thumbnail_buy': deal.dealType === 'buy'}">
                            <ion-icon class="icon-thumbnail_icon" :icon="setIconByDealType(deal.dealType)"></ion-icon>
                        </ion-thumbnail>
                        <!--  -->
                        <div @click.prevent.stop="openActionSheetDealStatusMenu(deal, deal.dealStatus)" style="margin-left: 0.4rem;">
                            <ion-text color="primary">
                                {{translateValue(deal.dealStatus, dealStatusList)}}
                            </ion-text>
                        </div>
                    </div>
                    <!-- Контакт по делу -->
                    <!-- <div>
                        <ion-text v-if="deal.contactID === '000'" color="primary">Неизвестный</ion-text>
                        <ion-text v-else color="primary" @click.prevent.stop="$emit('getContact', deal.contactID)">
                            {{contactName}}
                        </ion-text>
                    </div> -->
                    <ion-text @click.prevent.stop="$emit('getContact', deal.contactID)" class="ion-text-right">{{contactName}}</ion-text>
                </ion-row>
            </ion-grid>
        </ion-card-header>
        <!-- Body of the card -->
        <ion-card-content class="ion-no-padding ion-margin-top">
            <!-- Предмет заказа -->
            <ion-grid>
                <ion-row style="gap: 0.8rem">
                    <div class="relative product-block" v-for="(item, index) in deal.dealsList" :key="index">
                        <!-- item -->
                        <ion-thumbnail v-if="item.selectedProduct !== ''" style="height: 64px; width: 64px;">
                            <!-- Если типа дела Продажа -->
                            <div v-if="deal.dealType === 'sale'">
                                <ion-img style="height: 100%" :src="`img/subjects/sale/${item.selectedProduct}.webp`"></ion-img>
                            </div>
                            <!-- Если типа дела Закупка -->
                            <div v-if="deal.dealType === 'buy'">
                                <ion-img style="height: 100%" :src="`img/subjects/buy/${item.selectedProduct}.webp`"></ion-img>
                            </div>
                        </ion-thumbnail>
                        <!--  -->
                        <ion-label style="font-size: 12px">
                            x{{item.productQuantity}}
                        </ion-label>
                        <!-- mark where subject has attribute -->
                        <div 
                            v-if="checkRentAttr(item, deal.dealType)" 
                            class="absolute mark-atribute" 
                        >
                            <ion-icon :color="setMarkerAttrColor(item) ? 'success' : 'warning'" :icon="shapes"></ion-icon>
                        </div>
                            <!-- :class="isAllAttrReturned ? 'mark-success' : 'mark-warning'" -->
                    </div>
                    <div v-if="deal.dealsList.length" class="empty-item"></div>
                    <!-- deal.dealsList is empty array -->
                    <div v-if="!deal.dealsList.length">
                        <ion-thumbnail class="empty-deal-list_thumbnail">
                            <ion-icon class="empty-deal-list_icon" :icon="helpOutline"></ion-icon>
                        </ion-thumbnail>
                    </div>
                </ion-row>
            </ion-grid>
        </ion-card-content>

        <ion-grid>
            <ion-grid class="card-footer ion-padding-top ion-margin-top">
                <ion-row class="ion-justify-content-between ion-align-items-center">

                    <!-- сумма заказаа и сколько внесено оплаты уже -->
                    <ion-text>
                        {{ (deal.dealPaid).toFixed(2) }} / {{ (+deal.totalDealPrice - deal.dealPaid + deal.dealPaid).toFixed(2) }}
                    </ion-text>
                </ion-row>
            </ion-grid>
        </ion-grid>

        <!-- Модалка внесения средства по оплате -->
        <!-- :class="{ 'show-modal': isDealPaidMenuOpened === true}" -->
        <DealPaidMenu
            :isOpen="isDealPaidMenuOpened"
            :currentDeal="dealWhereChangeStatus"
            :debt="refreshDebtValue()"
            :amount="dealPaidAmountValue()"
            @getAmountValue="setAmountValue"                
            @closeModal="closeDealPaidMenu"
            @didDismiss="isDealPaidMenuOpened = false"
        />
        <!-- Всплывашка изменения статуса конкретного дела-->
        <ion-action-sheet
            :is-open="actionSheetDealStatus"
            header="Сменить статус дела"
            :buttons="changeDealStatusMenuButtons"
            @didDismiss="actionSheetDealStatus = false"
        >
        </ion-action-sheet>    
    </ion-card>
</template>

<script>
    import { defineComponent, ref, watchEffect, onMounted, watch } from 'vue';
    // import { useRoute, useRouter } from 'vue-router';
    //
    import store from '../store/index';
    //
    import { IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon, IonText, IonCardContent, IonImg, IonLabel, IonActionSheet, toastController } from '@ionic/vue'
    //
    import { helpOutline, shapes } from 'ionicons/icons';
    //
    import { setIconByDealType } from '@/helpers/setIconBy';
    import { translateValue } from '@/helpers/translateValue';
    import { checkRentAttr } from '@/helpers/checkRentAttr';
    import { setMarkerAttrColor } from '../helpers/setMarkerColor';
    //
    import { supabase } from '@/supabase/init';
    //
    import DealPaidMenu from '@/components/DealPaidMenu.vue';
    //
    export default defineComponent({
        name: 'DealCard',
        emit: ['getContact'],
        props: {
            deal: Object,
            contactNameByID: String
        },
        components: {
            IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon, IonText, IonCardContent, IonImg, IonLabel, IonActionSheet, DealPaidMenu
        },
        setup(props, {emit}) {
            //
            // const route = useRoute();
            //
            const currency = ref(store.state.systemCurrency.name)
            const deal = ref()
            // const currentId = route.params.dealId;
            // console.log(currentId)
            const contactName = ref();
            const dealStatusList = ref(store.state.dealStatusList)
            const dealStatus = ref();
            const dealWhereChangeStatus = ref()
            const prevDealStatus = ref()
            const debt = ref()

            // Вызываем action sheet меню выбора статуса дела
            const actionSheetDealStatus = ref(false)
            const openActionSheetDealStatusMenu = (deal, dealStatus) => {
                actionSheetDealStatus.value = true
                // console.log(deal)
                dealWhereChangeStatus.value = deal
                // console.log(dealStatus)
                prevDealStatus.value = dealStatus
                // updateCurrentDealStatus(deal)
            }
            // ======================================= Массив кнопок в меню смены статуса у дела ==================================
            const changeDealStatusMenuButtons = []
            // добавляем в массив changeDealStatusMenuButtons объекты из dealStatusList
            for(let i = 1; i <= dealStatusList.value.length; i++) {
                changeDealStatusMenuButtons.push({
                    text: dealStatusList.value[i-1].name,
                    handler: () => {
                        dealStatus.value = dealStatusList.value[i-1].value
                        // помещаем во временную переменную обновленное значение статуса
                        dealWhereChangeStatus.value.dealStatus = dealStatus.value 
                        // console.log(`Предыдущий статус: ${prevDealStatus.value}`)
                        // console.log(`Текущий статус: ${dealStatus.value}`)
                        // компонент DealPaidMenu
                        if(dealWhereChangeStatus.value.dealStatus === 'deal-complete' && dealWhereChangeStatus.value.dealsList.length !== 0) {

                            culcDealDebt(dealWhereChangeStatus.value.totalDealPrice, dealWhereChangeStatus.value.dealPaid)
                            if(debt.value > 0) {

                                if(confirm(`Есть долг по оплате дела. Внести сумму задолженности или её часть?`)) {
                                    // оставляем старый статус (так как не понятно всю ли сумму внесут по долгу)
                                    dealWhereChangeStatus.value.dealStatus = prevDealStatus.value
                                    openDealPaidMenu()
                                    // closeDealPaidMenu()
                                } else {
                                    // просто оставляем старый статус дела (НЕ меняем на завершен)
                                    dealWhereChangeStatus.value.dealStatus = prevDealStatus.value
                                }
                            } else if (debt.value === 0 ) {
                                // SALE
                                // alert(`ViewDeal: статус дела изменен на ${dealStatus.value}`)
                                if(dealWhereChangeStatus.value.dealType === 'sale' ) {
                                    // Оставляем dealStatus как deal-complete
                                    // НО проверить на наличие долга по аренде атрибутов
                                    isAllAttrReturnedFunc()
                                } else if (dealWhereChangeStatus.value.dealType === 'buy') {
                                    // зачисляем на склад только при условию что НЕТ долгов по оплате поставки
                                    addToWarehouseToast()
                                    console.log(`Можно помещать предметы на склад по делу №${dealWhereChangeStatus.value.uid}`)
                                    dealWhereChangeStatus.value.dealsList.forEach(item => {
                                        console.log(item)
                                    })
                                }
                            } else if (debt.value < 0) {
                                // Оставляем dealStatus как deal-complete
                                alert('Получается переплата... Верно?')
                            }
                        } 
                        // сохраняем изменения в БД
                        updateCurrentDealStatus(dealWhereChangeStatus.value)
                        update()
                    }
                })
            }
            watch(dealStatus, () => {
                // Забираем предметы для работы со складом
                if(dealWhereChangeStatus.value.dealsList.length !== 0) {
                    if(dealStatus.value === 'deal-in-process' && dealWhereChangeStatus.value.dealType === 'sale') {
                        substructFromWarehouseToast()
                        console.log(`Можно вычитать предметы со склада по делу №${dealWhereChangeStatus.value.uid}`)
                        dealWhereChangeStatus.value.dealsList.forEach(item => {
                            console.log(item)
                        })
                    } 
                    // для dealType === 'buy' условие запускается в: 
                    // 1. setAmountValue(), когда полностью внесена оплата
                    // 2. changeDealStatusMenuButtons, когда debt.value === 0
                }
            })
            // Уведомляем о выделении предметов со склада для реализации дела по указанному рецепту
            const substructFromWarehouseToast = async () => {
                const toast = await toastController.create({
                    // Ингредиенты, необходимые для выполнения заказа, будут взяты со склада.
                    message: `
                        В разработке... Перемещение со склада в работу...
                    `,
                    // duration: 3000,
                    // cssClass: 'custom-toast', 
                    position: 'top',
                    buttons: [
                        {
                            text: 'ОК',
                            role: 'cnacel',
                            handler: () => {
                                console.log('toast clicked dismiss')
                            }
                        }
                    ]
                });
                await toast.present();
                // const { role } = await toast.onDidDismiss();    
            }
            const addToWarehouseToast = async () => {
                const toast = await toastController.create({
                    // Предметы дела будут добавлены на склад
                    message: `
                        В разработке... Перемещение на склад 
                    `,
                    // duration: 3000,
                    // cssClass: 'custom-toast', 
                    position: 'top',
                    buttons: [
                        {
                            text: 'ОК',
                            role: 'cnacel',
                            handler: () => {
                                console.log('toast clicked dismiss')
                            }
                        }
                    ]
                });
                await toast.present();
                // const { role } = await toast.onDidDismiss();    
            }
            // Добавляем кнопку отмены (скрытия меню)
            changeDealStatusMenuButtons.push({
                text: 'Отменить',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked')
                }
            })
            // Меняем статус прямо на карточке дела
            const updateCurrentDealStatus = async (deal) => {
                // Обновляем данные в БД
                try {
                    const { error } = await supabase.from('deals').update({
                        dealStatus: deal.dealStatus
                    }).eq('id', deal.id)
                    if(error) throw error;
                    // refreshData();
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
            // Считаем debt у конкретного дела
            const culcDealDebt = (totalDealPrice, dealPaid) => {
                // Пока так
                debt.value = totalDealPrice - dealPaid
                return debt.value
            }
            // Управление модалкой внесения оплаты
            const isDealPaidMenuOpened = ref(false)
            const openDealPaidMenu = () => {
                // actionSheetDealStatus.value = false
                isDealPaidMenuOpened.value = true
                refreshDebtValue()
            }
            //
            const refreshDebtValue = () => {
                return debt.value
            }
            //
            const closeDealPaidMenu = () => {
                isDealPaidMenuOpened.value = false
            }
            // функция обнуления пропса по начальному значению суммы оплаты (для DealPaidMenu)
            const dealPaidAmountValue = () => {
                return 0
            }
            //
            const setAmountValue = (amount) => {
                // console.log(isDealPaidMenuOpened.value)
                if(dealWhereChangeStatus.value.dealPaid === 0){
                    dealWhereChangeStatus.value.dealPaid = +amount
                } else if (dealWhereChangeStatus.value.dealPaid !== 0) {
                    dealWhereChangeStatus.value.dealPaid += +amount
                }
                culcDealDebt(dealWhereChangeStatus.value.totalDealPrice, dealWhereChangeStatus.value.dealPaid)
                if(debt.value > 0) {
                    // сообщаем пользователю сколько внесено
                    alert(`DealCard: внесено ${amount} ${currency.value}`)
                    // закрываем dealPaidMenu
                    closeDealPaidMenu()
                    // сохраняем изменения в БД
                    update()
                } else if (debt.value === 0) {
                    console.log(debt.value)
                    // уведомляем о количестве внесенных средств
                    alert(`DealCard: внесено ${amount} ${currency.value}`)
                    // SALE
                    if(dealWhereChangeStatus.value.dealType === 'sale') {
                        // Сейчас делу присвоен статус ЗАВЕРШЕН
                        // проверяем на наличие долгов по атрибутам
                        isAllAttrReturnedFunc()
                    } 
                    // BUY
                    else if (dealWhereChangeStatus.value.dealType === 'buy') {
                        // Костыльно конечно, тем не менее работает. Иначе модалка dealPaidMenu не закрывается
                        setTimeout(setDealStatusToComplete, 500)
                        alert('DealCard: статус дела изменен на "ЗАВЕРШЕНО"')
                        closeDealPaidMenu()
                        // зачисляем на склад только при условию что НЕТ долгов по оплате поставки
                        addToWarehouseToast()
                        console.log(`Можно помещать предметы на склад по делу №${dealWhereChangeStatus.value.uid}`)
                        dealWhereChangeStatus.value.dealsList.forEach(item => {
                            console.log(item)
                        })
                    }
                } else if (debt.value < 0) {
                    // Удалить, если не пригодится
                    alert('Получается переплата... Верно?')
                }
            }
            //
            const isAllAttrReturned = ref(false)
            const isAllAttrReturnedFunc = () => {
                // console.log(isDealPaidMenuOpened.value)
                let dealsListArray = dealWhereChangeStatus.value.dealsList
                let subjectAttributesArray = dealsListArray.map(item => item.additionalAttributes)
                // Упрощаем массив, поднимая вложенные массивы в массив верхнего уровня
                let isReturnedArray = subjectAttributesArray.flat()
                // console.log(isReturnedArray)
                let isReturnData = isReturnedArray.map(item => item.isReturned) 
                if(isReturnData.length === 0) {
                    // Значит массив атрибутов пустой
                    // При создании он всеравно есть, но изначально пустой
                    // Костыльно конечно, тем не менее работает. Иначе модалка dealPaidMenu не закрывается
                    setTimeout(setDealStatusToComplete, 500)
                    // dealWhereChangeStatus.value.dealStatus = 'deal-complete'
                    alert('Deal: статус дела изменен на ЗАВЕРШЕН')
                    closeDealPaidMenu()
                } else if (isReturnData.length !== 0) {
                    // Если массив содержит невозвращенные атрибуты какого-либо предмета в деле
                    if(isReturnData.includes(false)) {
                        // isAllAttrReturned.value = false
                        alert(`DealCard: Вам вернули не все допы по заказу. Статус дела изменен на ДОЛГ`)
                        dealWhereChangeStatus.value.dealStatus = 'deal-in-debt'
                        // Если dealPaidMenu открыто
                        closeDealPaidMenu()
                    } else {
                        // Если содержит все true (то есть всё уже вернули)
                        // isAllAttrReturned.value = true
                        alert('DealCard: статус дела изменен на ЗАВЕРШЕНО')
                        // Костыльно конечно, тем не менее работает. Иначе модалка dealPaidMenu не закрывается
                        setTimeout(setDealStatusToComplete, 500)
                        // Если dealPaidMenu открыто
                        closeDealPaidMenu()
                        // console.log(isDealPaidMenuOpened.value)
                    }
                }
                // // сохраняем изменения в БД
                // updateCurrentDealStatus(dealWhereChangeStatus.value)
                // update()
            }
            const update = async () => {
                try {
                    // spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${dealWhereChangeStatus.value.id} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        contactID: dealWhereChangeStatus.value.contactID,
                        dealStatus: dealWhereChangeStatus.value.dealStatus,
                        // dealStatus: dealStatus.value,
                        executionDate: dealWhereChangeStatus.value.executionDate,
                        dealsList: dealWhereChangeStatus.value.dealsList,
                        shipping: dealWhereChangeStatus.value.shipping,
                        dealPaid: dealWhereChangeStatus.value.dealPaid,
                        cancelledReason: dealWhereChangeStatus.value.cancelledReason,
                        totalDealPrice: dealWhereChangeStatus.value.totalDealPrice

                    }).eq('id', dealWhereChangeStatus.value.id);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                // spinner.value = false;
            }
            //
            const setDealStatusToComplete = () => {
                dealWhereChangeStatus.value.dealStatus = 'deal-complete'
                updateCurrentDealStatus(dealWhereChangeStatus.value)
                update()
            }
            //
            watchEffect(() => {
                deal.value = props.deal
                contactName.value = props.contactNameByID
            })

            return {
                deal, helpOutline, setIconByDealType, translateValue, dealStatusList, openActionSheetDealStatusMenu, contactName, checkRentAttr, actionSheetDealStatus, changeDealStatusMenuButtons, dealStatus, dealWhereChangeStatus, debt, prevDealStatus, updateCurrentDealStatus, culcDealDebt, isDealPaidMenuOpened, openDealPaidMenu, refreshDebtValue, closeDealPaidMenu, dealPaidAmountValue, setAmountValue, isAllAttrReturned, isAllAttrReturnedFunc, update, setMarkerAttrColor, setDealStatusToComplete, shapes, substructFromWarehouseToast, addToWarehouseToast
            }
        }
    })
</script>

<style scoped>
    ion-thumbnail {
        background-color: var(--ion-color-light);
        --border-radius: 100%;
        padding: 0.5rem;
    }
    .empty-item {
        margin-left: auto
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .mark-atribute {
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0rem;
        right: -0.2rem;
        width: 1.3rem;
        height: 1.3rem;
        background-color: var(--ion-color-light);
        border-radius: 100%
    }
    /* удалить если не понадобится */
    /* .mark-success {
        background-color: var(--ion-color-success);
    }
    .mark-warning {
        background-color: var(--ion-color-warning);
    } */
    .empty-deal-list_thumbnail {
        height: 64px;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .empty-deal-list_icon {
        width: 100%;
        height: 100%
    }
    .icon-thumbnail {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0.2rem;
        padding-top: 0.4rem;
        padding-left: 0.4rem;
        padding-bottom: 0.3 rem;
        top: -22px;
        left: -22px;
        
    }
    .icon-thumbnail_icon {
        width: 100%;
        height: 100%;
        color: white;
    }
    .icon-thumbnail_sale {
        background-color: var(--ion-color-success);
    }
    .icon-thumbnail_buy {
        background-color: var(--ion-color-warning);
    }
    .product-block {
        display: flex; 
        flex-direction: column; 
        align-items: center;
        gap: 0.3rem;
    }
    /* ion-modal {
        backdrop-filter: blur(0.1rem) grayscale(1);
    } */
    ion-modal {
        --backdrop-opacity: var(--ion-backdrop-opacity, 0.4)!important;
    }
    .display-none {
        display: none;
    }

    .card-footer {
        border-top: 1px solid var(--ion-color-medium);
    }
</style>