<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar translucent="true">
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">
                        Закрыть
                    </ion-button>
                </ion-buttons>
                <!--  -->
                <ion-buttons slot="end">
                    Сегодня: {{today}}
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding ion-page ion-margin-bottom ion-margin-top">
            <br>
            <br>
            <!--  -->
            <!-- {{dealDebtsArray}} -->
            <ion-card class="ion-no-margin ion-margin-vertical ion-padding" @click="goToDebtsDeal(deal)" v-if="dealDebtsArray.length !== 0" v-for="deal in getSortedDealDebtsArray()">
                <!-- Дата создания дела: <br> {{deal.created_at}} <br> -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-text>
                            Дата исполнения: <br> {{formattedDate(deal.executionDate)}}
                        </ion-text>
                        <ion-chip color="primary" class="ion-no-margin">
                            {{translateValue(deal.dealStatus, dealStatusList)}}
                        </ion-chip>
                    </ion-row>
                    <!--  -->
                    <ion-row class="ion-justify-content-start ion-align-items-center ion-margin-top">
                        <ion-text v-if="deal.contactID === '000'" color="medium">
                            Неизвестный
                        </ion-text>
                        <ion-text v-else color="primary" @click.stop="goToContact(deal.contactID)">
                            {{translateContactName(deal.contactID)}}
                        </ion-text>
                    </ion-row>
                    <!--  -->
                    <ion-row>
                        <ion-text>
                            Задолженность: {{deal.totalDealPrice - deal.dealPaid}} {{currency}}
                        </ion-text>
                    </ion-row>
                </ion-grid>
            </ion-card>

            <!--  -->
            <div v-else class="no-status-deal no-data">
                <ion-img src="img/common/no-debts-sticker.webp"></ion-img>
                <ion-text color="medium" class="ion-margin-top">Долгов не обнаружено</ion-text>
            </div>

            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';
    //
    import store from '../../store/index';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonText, IonImg, IonCard, IonChip, IonGrid, IonRow } from '@ionic/vue';
    //
    import { translateValue } from '../../helpers/translateValue'
    //
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'

    export default defineComponent({
        name: 'ViewWalletDebts',
        props: {
            dealArray: Array,
            currencyValue: String
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonButton, IonText, IonImg, IonCard, IonChip, IonGrid, IonRow
        },
        setup(props, { emit }) {
            // Setup ref to router
            const router = useRouter();
            //
            let today = new Date()
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '.' + dd + '.' + yyyy;
            //
            const dealDebtsArray = ref([])
            const currency = ref('')
            // Статусы дел
            const dealStatusList = ref(store.state.dealStatusList)
            //
            const myContacts = ref([])
            //
            onMounted(async () => {
                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
            })
            //
            const goToDebtsDeal = (deal) => {
                emit('closeModal')
                router.push({
                    name: 'View-Deal', 
                    params: {
                        dealId: deal.id,
                        dealUid: deal.uid,
                        deal: JSON.stringify(deal)
                    }
                })
            }
            //
            const formattedDate = (day) => {
                const formattedString = format(parseISO(day), 'd MMMM Y HH:mm', { locale: ru });
                return formattedString;
            }
            //
            const translateContactName = (contactID) => {
                const contact = myContacts.value.filter(contact => contact.id === +contactID)
                return `${contact[0].contactInfo.surname} ${contact[0].contactInfo.name}`
            }
            //
            const currentContact = ref()
            const goToContact = (contactID) => {
                currentContact.value = myContacts.value.filter(contact => contact.id === +contactID)
                emit('closeModal')
                router.push({
                    name: 'View-Contact',
                    params: {
                        contactId: +contactID,
                        contact: JSON.stringify(currentContact.value[0])
                    }
                })
            }
            // Сортируем массив дел с долгами по датам
            const getSortedDealDebtsArray = () => {
                dealDebtsArray.value.sort((a, b) => {
                    return new Date(b.executionDate) - new Date(a.executionDate)
                })
                return dealDebtsArray.value
            }
            //
            watchEffect(() => {
                dealDebtsArray.value = props.dealArray
                currency.value = props.currencyValue
            })

            return {
                router, dealDebtsArray, currency, goToDebtsDeal, dealStatusList, translateValue, formattedDate, translateContactName, goToContact, currentContact, getSortedDealDebtsArray, today
            }
        }
    })
</script>

<style scoped>
    .no-status-deal {
        margin-top: 15vh;
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
    .no-data ion-img {
        width: 50%;
    }
</style>