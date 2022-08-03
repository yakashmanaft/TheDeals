<template>
    <ion-modal :initial-breakpoint="0.6">
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Выберите дату</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('updateDate')">Готово</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-datetime 
                :prefer-wheel="true"
                size="cover"
                presentation="date-time"
                v-model="pickedDate"
                :value="setCurrentDate(date)"
                :first-day-of-week="1"
                locale="ru"
            >
                <span slot="time-label">Время исполнения</span>
            </ion-datetime>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watch } from 'vue'; 
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonDatetime } from '@ionic/vue'

    export default defineComponent({
        name: 'Calendar',
        emit: ['date-updated'],
        props: ['date'],
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonDatetime
        },
        setup(props, {emit}) {
            //
            const pickedDate = ref();
            //
            watch(pickedDate, (currentValue) => {
                emit('date-updated', {currentValue})
            })
            //
            const setCurrentDate = (date) => {
                // console.log(date)
                if(date === undefined) {
                    return
                } else if(date) {
                    return date
                }
            }

            return {
                pickedDate, setCurrentDate
            }
        }
    })
</script>

<style scoped>
    ion-datetime {
        --background: #ffffff;
        --background-rgb: 255,255,255;
    }
</style>