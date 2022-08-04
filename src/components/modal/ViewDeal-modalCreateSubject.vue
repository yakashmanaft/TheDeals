<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый предмет</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createSubject', subjectData)">Готово</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            {{currentDealType}}
            {{subjectData}}
            <!--  -->
            <div v-if="currentDealType === 'sale'">
                Это добавление предмета для Продажи
                <input type="text" v-model="subjectData.selectedProduct"/>
            </div>
            <!--  -->
            <div v-if="currentDealType === 'buy'">
                Это добавление предмета для Закупа
                <input type="text" v-model="subjectData.selectedProduct"/>
                <textarea name="" id="" cols="30" rows="10" v-model="subjectData.productNote"></textarea>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/vue';

    export default defineComponent({
        name: 'CreateDealSubject',
        emits: ['closeModal', 'createSubject'],
        props: {
            subjectData: Object,
            currentDealType: String
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent
        },
        setup() {

            return {

            }
        }
    })
</script>

<style scoped>

</style>