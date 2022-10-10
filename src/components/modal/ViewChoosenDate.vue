<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal', date)">Закрыть</ion-button>
                </ion-buttons>
                <ion-title>{{formattedDate(date)}}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createNewDeal', date)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content forceOverscroll="false">
            <!-- Маячок о количестве дел -->
            <div class="ion-margin-top ion-text-center">
                <ion-text color="medium" v-if="deals.length > 0">
                    Запланированные
                </ion-text>
                <div class="no-deal" v-if="deals.length === 0">
                    <ion-text color="medium">Нет запланированных дел</ion-text>
                    <ion-text @click="$emit('setWeekendDay', date)" color="primary" class="ion-margin-top">Отметить как день без дел</ion-text>
                </div>
            </div>
            <!--  -->
            <ion-card v-if="checkStatusAndLength(deals)" class="ion-padding-horizontal ion-padding-vertical">
                Нет запланированных дел
            </ion-card>
            <!-- Карточки дел -->
            <!-- =================================== Если в реализации ===================================== -->
            <div v-for="deal in deals" :key="deal.id" class="ion-margin-bottom">
                <DealCard
                    v-if="deal.dealStatus !== 'deal-cancelled' && deal.dealStatus !== 'deal-complete'"
                    @click="$emit('viewChoosenDeal', deal)"
                    :deal="deal"
                    @getContact="setContact"
                    :contactNameByID="showNameByID(deal.contactID, myContacts)"
                />
            </div>
            <!-- ==================================== Если завершены ==================================== -->
            <div v-if="checkStatus('deal-complete')" class="ion-margin-top ion-text-center">
                <ion-text color="medium">Завершенные</ion-text>
            </div>
            <div v-for="deal in deals" :key="deal.id">
                <DealCard
                    v-if="deal.dealStatus === 'deal-complete'" 
                    @click="$emit('viewChoosenDeal', deal)"
                    :deal="deal"
                    @getContact="setContact"
                    :contactNameByID="showNameByID(deal.contactID, myContacts)"
                    class="deal-cover"
                />
            </div>
            <!-- Если Отменены -->
            <div v-if="checkStatus('deal-cancelled')" class="ion-margin-top ion-text-center">
                <ion-text color="medium">Отмененные</ion-text>
            </div>
            <div v-for="deal in deals" :key="deal.id">
                <DealCard
                    v-if="deal.dealStatus === 'deal-cancelled'" 
                    @click="$emit('viewChoosenDeal', deal)"
                    :deal="deal"
                    @getContact="setContact"
                    :contactNameByID="showNameByID(deal.contactID, myContacts)"
                    class="deal-cover"
                />
            </div>
            <br>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect, onMounted } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonText, IonCard, IonCardHeader, IonGrid, IonRow, IonThumbnail, IonIcon } from '@ionic/vue';
    //
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import { useRouter } from 'vue-router';
    import store from '../../store'
    //
    import { helpOutline } from 'ionicons/icons';
    //
    import DealCard from '../DealCard.vue';
    //
    import { showNameByID } from '../../helpers/setNameByID'

    export default defineComponent({
        name: 'ViewChoosenDate',
        emit: ['closeModal', 'viewChoosenDeal', 'createNewDeal', 'goToChoosenContact', 'setWeekendDay'],
        props: {
            deals: Array,
            date: String,
            myContactsArray: Array
        },
        components: {
            IonModal,
            IonHeader,
            IonToolbar,
            IonButtons,
            IonButton,
            IonTitle,
            IonContent,
            IonText,
            IonCard,
            IonCardHeader,
            IonGrid,
            IonRow,
            IonThumbnail,
            IonIcon,
            DealCard,
        },
        setup(props, {emit}) {
            // Setup ref to router
            const router = useRouter();
            // переменная для массива выбранны по дате дел
            const deals = ref()
            // переменная для выбранной даты
            const date = ref()
            // функция форматирования даты
            const formattedDate = (day) => {
                if(day) {
                    const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                    return formattedString;
                }
            }
            // Проверяем есть ли отмененные или завершенные дела по выбранной дате
            const checkStatus = (status) => {
                const allDealStatus = deals.value.map(deal => deal.dealStatus)
                if(allDealStatus.includes(status)) {
                    return true
                } else {
                    return false
                }
            }
            //
            const checkStatusAndLength = (deals) => {
                const allDealStatus = deals.map(deal => deal.dealStatus)
                // console.log(allDealStatus)
                if (deals.length > 0 && (allDealStatus.includes('deal-in-booking') || allDealStatus.includes('deal-in-process') || allDealStatus.includes('deal-in-delivery') || allDealStatus.includes('deal-in-debt'))) {
                    // console.log(allDealStatus.includes('deal-in-booking'))
                    return false
                }
                else if(deals.length > 0 && (allDealStatus.includes('deal-complete') || allDealStatus.includes('deal-cancelled'))) {
                    return true
                } 
            } 
            // Храним данные контакта
            const myContacts = ref([])
            // Эмитим наверх айдишник ко конкретному контакту
            const setContact = (dealContactID) => {
                emit('goToChoosenContact', dealContactID)
            } 
            //
            watchEffect(() => {
                deals.value = props.deals;
                date.value = props.date;
                myContacts.value = props.myContactsArray
            })

            return {
                router, deals, date, formattedDate, helpOutline, checkStatus, checkStatusAndLength, setContact, myContacts, showNameByID
            }
        }
    })
</script>

<style scoped>
    .no-deal {
        height: 80vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .deal-cover {
        box-shadow: none;
        position: relative;
        background-color: var(--ion-color-light)
    }
    .deal-cover:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(20rem) opacity(0.8)
    }
</style>