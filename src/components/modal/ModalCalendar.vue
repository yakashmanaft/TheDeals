<template>
    <ion-modal>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title>Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('selectedDate', pickedDate)">Создать</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-datetime 
                presentation="date"
                v-model="pickedDate"
                @ionChange="setContactDate"
            >
            </ion-datetime>
            {{ isCalendarOpen }}
            {{ pickedDate }}
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watch } from 'vue'; 
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonDatetime } from '@ionic/vue'

    export default defineComponent({
        name: 'Calendar',
        props: ['isCalendarOpen'],
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonDatetime
        },
        setup() {
            //
            const pickedDate = ref();
            //
            const setContactDate = () => {
                console.log(pickedDate.value)
                return pickedDate.value;
            }

            return {
                pickedDate, setContactDate
            }
        }
    })
</script>

<style scoped>

</style>