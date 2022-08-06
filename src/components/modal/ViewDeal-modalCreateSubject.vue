<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый предмет</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createSubject', subjectData)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            {{currentDealType}}
            {{subjectData}}
            <!-- ================  Показываем в зависимости от выбранного типа дела ==============-->
            <div v-if="currentDealType === 'sale'">
                <!-- Это указываем предмет продажи -->
                <p>Выберите предмет</p>
                <input type="text" v-model="subjectData.selectedProduct"/>
                <!-- Это указываем рецепт предмета -->
                <p>Выберите рецепт предмета</p>
                <input type="text" v-model="subjectData.recipe">
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