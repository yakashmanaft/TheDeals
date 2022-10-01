<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title>{{formattedDate(date)}}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createNewDeal', date)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!-- Маячок о количестве дел -->
            <div class="ion-margin-top ion-text-center">
                <ion-text color="medium" v-if="deals.length > 0">
                    Запланированных дел: {{deals.length}}
                </ion-text>
                <div class="no-deal" v-if="deals.length === 0">
                    <ion-text color="medium">Нет запланированных дел</ion-text>
                </div>
                <!-- <ion-button @click="createNewDeal" class="ion-margin-top" expand="block">Создать дело</ion-button> -->
            </div>
            <!-- Карточки дел -->
            <div v-for="deal in deals" :key="deal.id" class="ion-margin-bottom">
                <ion-card @click="$emit('viewChoosenDeal', deal)" class="ion-padding-horizontal ion-padding-vertical">
                    <!-- Header of the card -->
                    <ion-card-header class="ion-no-padding">

                    </ion-card-header>
                    {{deal.id}} 
                </ion-card>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonText, IonCard, IonCardHeader } from '@ionic/vue';
    //
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'ViewChoosenDate',
        emit: ['closeModal', 'viewChoosenDeal', 'createNewDeal'],
        props: {
            deals: Array,
            date: String
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonText, IonCard, IonCardHeader
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
                const formattedString = format(parseISO(day), 'd MMMM Y', { locale: ru });
                return formattedString;
            }
            //
            watchEffect(() => {
                deals.value = props.deals;
                date.value = props.date;
            })

            return {
                router, deals, date, formattedDate
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
</style>