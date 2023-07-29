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
                    <ion-text style="margin-right: 10px; color:var(--ion-color-system);">
                        Сегодня: {{today}}
                    </ion-text>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding ion-page ion-margin-bottom ion-margin-top">
            <br>
            <br>
            <!--  -->
            <!-- {{dealDebtsArray}} -->
            <ion-card class="ion-no-margin ion-margin-vertical ion-padding" @click="goToDebtsDeal(deal)" v-if="dealDebtsArray.length !== 0" v-for="deal in getSortedDealDebtsArray()" :key="deal.id">
                <!-- Дата создания дела: <br> {{deal.created_at}} <br> -->
                <ion-grid class="ion-no-padding">
                    <!--  -->
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- <ion-text v-if="deal.contactID === '000'" color="medium" style="font-size: 1rem;">
                            Неизвестный
                        </ion-text> -->
                        <ion-text color="primary" @click.stop="goToContact(deal.contactID)" style="font-size: 1rem; border-bottom: 1px dashed var(--ion-color-primary) ">
                            {{translateContactName(deal.contactID, deal.tempContactName)}}
                        </ion-text>
                        <ion-chip v-if="new Date() > new Date(deal.executionDate)" color="warning">
                            Просрочено
                        </ion-chip>
                        <ion-chip v-else color="primary" class="ion-no-margin">
                            {{translateValue(deal.dealStatus, dealStatusList)}}
                        </ion-chip>
                    </ion-row>
                    <!--  -->
                    <ion-row class="ion-justify-content-end ion-align-items-center ion-margin-top">
                        <ion-text style="padding: 0 12px 0 12px">
                            Дата исполнения: {{formattedDate(deal.executionDate)}}
                        </ion-text>
                    </ion-row>
                    <!--  -->
                    <ion-row class="ion-justify-content-end ion-align-items-center">
                        <ion-text style="font-size: 1rem; font-weight: bold; padding: 0 12px 0 0" class="ion-text-right">
                            {{ deal.dealPaid }} / {{ deal.totalDealPrice }} {{ currency }}
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
            today = dd + '.' + mm + '.' + yyyy;
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
                const formattedString = format(parseISO(day), 'dd.MM.Y');
                // const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }
            
            //
            const translateContactName = (contactID, tempContactName) => {
                const contact = myContacts.value.filter(contact => contact.id === +contactID)
                // Проверяка
                if(contact.length !== 0) {
                    return `${contact[0].contactInfo.surname} ${contact[0].contactInfo.name}`
                } else if (contact.length === 0 && tempContactName) {
                    return tempContactName
                } else if (contact.length === 0 && !tempContactName) {
                    return 'Неизвестный'
                }
            }
            //
            const currentContact = ref()
            const goToContact = (contactID) => {
                currentContact.value = myContacts.value.filter(contact => contact.id === +contactID)
                // Проверяем по наличии в книге контактов
                if(currentContact.value.length === 0) {
                    alert('ViewWalletDebts: данный контакт не найден в Моих контактах')
                } else {
                    router.push({
                        name: 'View-Contact',
                        params: {
                            contactId: +contactID,
                            contact: JSON.stringify(currentContact.value[0])
                        }
                    })
                    emit('closeModal')
                }

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
                router, dealDebtsArray, currency, goToDebtsDeal, dealStatusList, translateValue, translateContactName, goToContact, currentContact, getSortedDealDebtsArray, today, formattedDate
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