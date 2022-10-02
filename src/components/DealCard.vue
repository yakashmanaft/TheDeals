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
                        <div v-if="checkRentAttr(item, deal.dealType)" class="absolute mark-atribute"></div>
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
    </ion-card>
</template>

<script>
    import { defineComponent, ref, watchEffect, onMounted } from 'vue';
    import store from '../store/index';
    //
    import { IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon, IonText, IonCardContent, IonImg, IonLabel } from '@ionic/vue'
    //
    import { helpOutline } from 'ionicons/icons';
    //
    import { setIconByDealType } from '@/helpers/setIconBy';
    import { translateValue } from '@/helpers/translateValue';
    import { checkRentAttr } from '@/helpers/checkRentAttr';
    //
    export default defineComponent({
        name: 'DealCard',
        emit: ['getContact'],
        props: {
            deal: Object,
            contactNameByID: String
        },
        components: {
            IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon, IonText, IonCardContent, IonImg, IonLabel
        },
        setup(props, {emit}) {
            //
            const deal = ref()
            const contactName = ref();
            const dealStatusList = ref(store.state.dealStatusList)
            //
            const openActionSheetDealStatusMenu = (deal, dealStatus) => {
                alert('DealCard: В разработке...')
            }
            //
            watchEffect(() => {
                deal.value = props.deal
                contactName.value = props.contactNameByID
            })

            return {
                deal, helpOutline, setIconByDealType, translateValue, dealStatusList, openActionSheetDealStatusMenu, contactName, checkRentAttr
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
        background-color: var(--ion-color-warning);
        border-radius: 100%
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
</style>