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
                        <ion-text v-else>
                            <div @click.prevent.stop="$emit('getContact', deal.contactID)">
                                {{contactName}}
                            </div>
                        </ion-text>
                    </div>
                </ion-row>
            </ion-grid>
        </ion-card-header>
        {{deal.id}}
    </ion-card>
</template>

<script>
    import { defineComponent, ref, watchEffect, onMounted } from 'vue';
    import store from '../store/index';
    //
    import { IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon, IonText } from '@ionic/vue'
    //
    import { helpOutline } from 'ionicons/icons';
    //
    import { setIconByDealType } from '@/helpers/setIconBy'
    import { translateValue } from '@/helpers/translateValue'


    export default defineComponent({
        name: 'DealCard',
        emit: ['getContact'],
        props: {
            deal: Object,
            contactNameByID: String
        },
        components: {
            IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon, IonText
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
                deal, helpOutline, setIconByDealType, translateValue, dealStatusList, openActionSheetDealStatusMenu, contactName
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
</style>