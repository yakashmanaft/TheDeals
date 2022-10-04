<template>
    <ion-card class="ion-padding-horizontal ion-padding-vertical">
        <!-- Header of the card -->
        <ion-card-header class="ion-no-padding">
            <ion-grid class="ion-no-padding">
                <ion-row class="ion-justify-content-between ion-align-items-center">
                    <div style="display: flex" class="relative">
                        <ion-thumbnail class="icon-thumbnail absolute" :class="{'icon-thumbnail_sale': deal.dealType === 'sale', 'icon-thumbnail_buy': deal.dealType === 'buy'}">
                            <ion-icon class="icon-thumbnail_icon" :icon="setIconByDealType(deal.dealType)"></ion-icon>
                        </ion-thumbnail>
                        <!--  -->
                        <div @click.prevent.stop="openActionSheetDealStatusMenu(deal, deal.dealStatus)" style="margin-left: 0.4rem">
                            <ion-text color="primary">
                                {{translateValue(deal.dealStatus, dealStatusList)}}
                            </ion-text>
                        </div>
                    </div>
                    <!-- Контакт по делу -->
                    <div>
                        <ion-text v-if="deal.contactID === '000'" color="primary">Неизвестный</ion-text>
                        <ion-text v-else color="primary" @click.prevent.stop="$emit('getContact', deal.contactID)">
                            {{contactName}}
                        </ion-text>
                    </div>
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
                            :class="setMarkerAttrColor(item) ? 'mark-success' : 'mark-warning'"
                        ></div>
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
        <!-- Модалка внесения средства по оплате -->
        <DealPaidMenu
            :class="{ 'show-modal': isDealPaidMenuOpened === true}"
            :is-open="isDealPaidMenuOpened"
            :currentDeal="dealWhereChangeStatus"
            :debt="refreshDebtValue()"
            :amount="dealPaidAmountValue()"
            @getAmountValue="setAmountValue"                
            @closeModal="closeDealPaidMenu"
            @didDismiss="closeDealPaidMenu"
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
    import { defineComponent, ref, watchEffect, onMounted } from 'vue';
    // import { useRoute, useRouter } from 'vue-router';
    //
    import store from '../store/index';
    //
    import { IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon, IonText, IonCardContent, IonImg, IonLabel, IonActionSheet } from '@ionic/vue'
    //
    import { helpOutline } from 'ionicons/icons';
    //
    import { setIconByDealType } from '@/helpers/setIconBy';
    import { translateValue } from '@/helpers/translateValue';
    import { checkRentAttr } from '@/helpers/checkRentAttr';
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
                // открываем action sheet
                actionSheetDealStatus.value = true
                // присваиваем переменной значение выбранной deal
                dealWhereChangeStatus.value = deal
                // присваиваем переменной исходной значнеие статуса
                prevDealStatus.value = dealStatus
                // console.log(deal)
                // console.log(dealStatus)
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
                        if(dealWhereChangeStatus.value.dealStatus === 'deal-complete') {
                            culcDealDebt(dealWhereChangeStatus.value.totalDealPrice, dealWhereChangeStatus.value.dealPaid)
                            if(debt.value > 0) {
                                if(confirm(`Есть долг по оплате дела. Внести сумму задолженности или её часть?`)) {
                                    // оставляем старый статус (так как не понятно всю ли сумму внесут по долгу)
                                    dealWhereChangeStatus.value.dealStatus = prevDealStatus.value
                                    openDealPaidMenu()
                                } else {
                                    // просто оставляем старый статус дела (НЕ меняем на завершен)
                                    dealWhereChangeStatus.value.dealStatus = prevDealStatus.value
                                }
                            } else if (debt.value === 0) {
                                // SALE
                                if(dealWhereChangeStatus.value.dealType === 'sale') {
                                    // Оставляем dealStatus как deal-complete
                                    // НО проверить на наличие долга по аренде атрибутов
                                    isAllAttrReturnedFunc()
                                    // console.log(dealWhereChangeStatus.value.dealType)
                                } 
                                // BUY
                                else if (dealWhereChangeStatus.value.dealType === 'buy') {
                                    // Оставляем dealStatus как deal-complete
                                    alert('DealCard: статус дела изменен на "ЗАВЕРШЕНО"')
                                    // closeDealPaidMenu()
                                }
                            } else if (debt.value < 0) {
                                // Оставляем dealStatus как deal-complete
                                // console.log(dealWhereChangeStatus.value.dealType)
                                alert('DealCard: статус дела изменен на "ЗАВЕРШЕНО"')
                            }
                        }
                        // сохраняем изменения в БД
                        updateCurrentDealStatus(dealWhereChangeStatus.value)
                        update()
                    }
                })
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
                console.log(isDealPaidMenuOpened.value)
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
                        console.log(isDealPaidMenuOpened.value)
                        // closeDealPaidMenu()
                        // console.log(dealWhereChangeStatus.value.dealType)
                        // updateCurrentDealStatus(dealWhereChangeStatus.value)
                    } 
                    // BUY
                    else if (dealWhereChangeStatus.value.dealType === 'buy') {
                        // console.log(dealWhereChangeStatus.value.dealType)
                        alert('DealCard: статус дела изменен на "ЗАВЕРШЕНО"')
                        // dealWhereChangeStatus.value.dealStatus = dealStatus.value
                        dealWhereChangeStatus.value.dealStatus = 'deal-complete'
                        console.log(dealWhereChangeStatus.value.dealStatus)
                        // deal.value.dealStatus = dealStatus.value
                        // deal.debt = 'deal-complete'
                        closeDealPaidMenu()
                        //
                        console.log(isDealPaidMenuOpened.value)
                        console.log(dealStatus.value)
                        //
                        updateCurrentDealStatus(dealWhereChangeStatus.value)
                        update()
                        // console.log(isDealPaidMenuOpened.value) 
                    }
                } else if (debt.value < 0) {
                    // Удалить, если не пригодится
                    alert('Получается переплата... Верно?')
                }
                // closeDealPaidMenu()
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
                    dealWhereChangeStatus.value.dealStatus = 'deal-complete'
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
                        dealWhereChangeStatus.value.dealStatus = 'deal-complete'
                        // Если dealPaidMenu открыто
                        closeDealPaidMenu()
                        // console.log(isDealPaidMenuOpened.value)
                    }
                }
                // closeDealPaidMenu()
                // сохраняем изменения в БД
                updateCurrentDealStatus(dealWhereChangeStatus.value)
                update()
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
            // раскрашиваем маркер по возврату атрибутов
            const setMarkerAttrColor = (subject) => {
                // console.log(subject.additionalAttributes)
                let subjectAttributesArray = subject.additionalAttributes
                let isReturnedArray = subjectAttributesArray.flat()
                console.log(isReturnedArray)
                let isReturnData = isReturnedArray.map(item => item.isReturned) 
                console.log(isReturnData)
                if(isReturnData.includes(false)) {
                    return false
                } else {
                    return true
                }
            }
            //
            watchEffect(() => {
                deal.value = props.deal
                // setMarkerAttrColor(deal.value)
                contactName.value = props.contactNameByID
            })

            return {
                deal, helpOutline, setIconByDealType, translateValue, dealStatusList, openActionSheetDealStatusMenu, contactName, checkRentAttr, actionSheetDealStatus, changeDealStatusMenuButtons, dealStatus, dealWhereChangeStatus, debt, prevDealStatus, updateCurrentDealStatus, culcDealDebt, isDealPaidMenuOpened, openDealPaidMenu, refreshDebtValue, closeDealPaidMenu, dealPaidAmountValue, setAmountValue, isAllAttrReturned, isAllAttrReturnedFunc, update, setMarkerAttrColor
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
        top: 0;
        right: 0;
        width: 1rem;
        height: 1rem;
        /* background-color: var(--ion-color-warning); */
        /* background-color: var(--ion-color-medium); */
        border-radius: 100%
    }
    .mark-success {
        background-color: var(--ion-color-success);
    }
    .mark-warning {
        background-color: var(--ion-color-warning);
    }
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
</style>