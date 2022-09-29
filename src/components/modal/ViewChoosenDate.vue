<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title>{{formattedDate(date)}}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!-- Маячок о количестве дел -->
            <div>
                <ion-text v-if="deals.length > 0">
                    Запланированных дел: {{deals.length}}
                </ion-text>
                <ion-text v-if="deals.length === 0">
                    Нет запланированных дел
                </ion-text>
            </div>
            <!-- Карточки дел -->
            <div v-for="deal in deals" :key="deal.id" class="ion-margin-bottom">
                <router-link :to="{ name: 'View-Deal', params: {
                    dealId: deal.id,
                    deal: JSON.stringify(deal)
                }}">
                    {{deal.id}} 
                </router-link>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonText } from '@ionic/vue';
    //
    import { format, parseISO, formatISO  } from 'date-fns';
    import { ru } from 'date-fns/locale';
    //
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'ViewChoosenDate',
        emit: ['closeModal'],
        props: {
            deals: Array,
            date: String
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonText
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
            //
            return {
                router, deals, date, formattedDate
            }
        }
    })
</script>

<style scoped>

</style>