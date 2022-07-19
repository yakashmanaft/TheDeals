<template>
    <ion-modal :initial-breakpoint="0.6">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Выберите дату</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-datetime 
                size="cover"
                presentation="date"
                v-model="pickedDate"
                @ionChange="$emit('closeModal')"
            >
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

            return {
                pickedDate
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